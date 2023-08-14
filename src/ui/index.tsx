import "babel-polyfill";
import "whatwg-fetch";

import * as React from "react";
import * as ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";

import { getDb } from "./db/db";
import { DEFAULT_RUS_PLAYER, DEFAULT_ENG_PLAYER } from "../lib/qmplayer/player";
import { Loader, Redirect, ErrorInfo } from "./common";
import { observer } from "mobx-react";
import { autorun, observable, runInAction, toJS } from "mobx";
import { INDEX_JSON } from "./consts";
import { getLang, browserDefaultLang } from "./lang";
import { assertNever } from "../assertNever";

import { OptionsTabContainer } from "./options";
import { QuestList } from "./questList";
import { AppNavbar } from "./appNavbar";
import { QuestInfo } from "./questInfo";
import { Store } from "./store";
import { QuestPlayController } from "./questPlayController";
import { EditorContainer } from "./editor";

console.info(`Starting the app (buildAt=${new Date(__VERSION__).toISOString()})`);

function debug(...args: any) {
  // console.info(...args);
}

@observer
class MainLoader extends React.Component<{}> {
  @observable
  store?: Store;
  @observable
  loadingStage?: "db" | "index";
  @observable
  error?: string;

  componentDidMount() {
    (async () => {
      this.loadingStage = "index";

      const index = await fetch(INDEX_JSON).then((x) => x.json());

      this.loadingStage = "db";

      const db = await getDb();
      let player = await db.getConfigLocal("player");

      if (!player) {
        debug(`Welcome, a new user!`);
        player =
          browserDefaultLang === "rus"
            ? DEFAULT_RUS_PLAYER
            : browserDefaultLang === "eng"
            ? DEFAULT_ENG_PLAYER
            : assertNever(browserDefaultLang);
        await db.setConfigBoth("player", player);
      }

      const lastLocation = await db.getConfigLocal("lastLocation");
      const store = new Store(index, db, player);
      (window as any).store = store;
      autorun(() => {
        db.setConfigLocal("lastLocation", store.hash).catch((e) => console.warn(e));
      });
      if (lastLocation) {
        /* Disabled this feature
                location.replace(
                    lastLocation.indexOf("#") === 0
                        ? lastLocation
                        : "#" + lastLocation
                );
                */
      }
      //if (lastPlayedGame) {
      //    location.hash = `/quests/${lastPlayedGame}`;
      //}
      await store.loadWinProofsFromLocal();

      // TODO - drop sw?
      if ("serviceWorker" in navigator && location.hostname !== "localhost") {
        (async () => {
          const registrationOld = await navigator.serviceWorker.getRegistration();

          if (registrationOld) {
            debug(`Service worker have old registration`);
          } else {
            debug(`Service worker do not have old registration, will register now`);
          }
          const reg = registrationOld || (await navigator.serviceWorker.register("/sw.js"));
          store.serviceWorkerRegistered = true;

          function updateStore() {
            debug(
              `serviceWorker installing=${reg.installing ? reg.installing.state : "null"} ` +
                `waiting=${reg.waiting ? reg.waiting.state : "null"} ` +
                `active=${reg.active ? reg.active.state : "null"} `,
            );
            store.installingServiceWorkerState = reg.installing ? reg.installing.state : null;
            store.waitingServiceWorkerState = reg.waiting ? reg.waiting.state : null;
            store.waitingServiceWorker = reg.waiting;
            store.activeServiceWorkerState = reg.active ? reg.active.state : null;
            if (reg.installing) {
              reg.installing.onstatechange = updateStore;
            }
            if (reg.waiting) {
              reg.waiting.onstatechange = updateStore;
            }
            if (reg.active) {
              reg.active.onstatechange = updateStore;
            }
          }
          updateStore();
          reg.addEventListener("updatefound", () => {
            debug(`SW regisration: updatefound`);
            updateStore();
          });

          setInterval(() => reg.update().catch((e) => console.warn(e)), 1000 * 60 * 60);
        })().catch((e) => console.warn(e));

        navigator.serviceWorker.addEventListener("controllerchange", (e) => {
          /*
                          Only do a reload if there was a controller and a new controlled appeared.
                          - if there was no controller: this is a first install and 
                            a "clients.claim()" was called from service worker "activate" state
                            (which were triggered automatically)
                            We do a service worker registration immediately after page loads,
                                so installed version will be probably the same as loaded
                          - if there is a controller: serviceWorkers "activate" state was
                            triggered by sendMessage from the page, i.e. from user click
                        */
          if (store.serviceWorkerController && navigator.serviceWorker.controller) {
            if (!store.reloadingPage) {
              store.reloadingPage = true;
              window.location.reload(); // Call to "reload" does not stop the page!
            }
          }

          store.serviceWorkerController = navigator.serviceWorker.controller
            ? navigator.serviceWorker.controller.state
            : null;
        });
        store.serviceWorkerController = navigator.serviceWorker.controller
          ? navigator.serviceWorker.controller.state
          : null;
        debug(
          `serviceWorker controller=${
            navigator.serviceWorker.controller ? navigator.serviceWorker.controller.state : "null"
          }`,
        );
      }

      (async () => {
        if (navigator.storage) {
          const alreadyPersisted = await navigator.storage.persisted();
          debug(`Storage current persist status=${alreadyPersisted}`);
          store.storageIsPersisted = alreadyPersisted;

          if (!alreadyPersisted && navigator.serviceWorker && navigator.serviceWorker.controller) {
            const requestedPersist = await navigator.storage.persist();
            debug(`Storage requested persist status=${requestedPersist}`);
            store.storageIsPersisted = requestedPersist;
          }
        }
      })().catch((e) => console.warn(e));
      runInAction(() => {
        this.loadingStage = undefined;
        this.store = store;
      });
    })().catch((e) => (this.error = `${e.message || "Error"}`));
  }
  render() {
    if (this.error) {
      return <ErrorInfo error={this.error} />;
    }
    const store = this.store;

    if (!store) {
      const l = getLang(browserDefaultLang); // Not from store because obviously store if not ready yet
      if (this.loadingStage === undefined) {
        return <Loader text={l.loading} />;
      } else if (this.loadingStage === "index") {
        return <Loader text={l.loadingIndex} />;
      } else if (this.loadingStage === "db") {
        return <Loader text={l.loadingLocalDatabase} />;
      } else {
        return assertNever(this.loadingStage);
      }
    }
    if (store.reloadingPage) {
      return <Loader text={store.l.reloading} />;
    }

    const { tab0, tab1, tab2 } = store.path;

    if (tab0 === "options") {
      return (
        <div className="game-design">
          <AppNavbar store={store}>
            <OptionsTabContainer store={store} />
          </AppNavbar>
        </div>
      );
    } else if (tab0 === "editor") {
      return (
        <EditorContainer
          questsToLoad={toJS(store.index.quests)}
          onExit={() => {
            location.href = `#/`;
          }}
        />
      );
    } else if (tab0 === "quests") {
      if (!tab1) {
        return (
          <div className="game-design">
            <QuestList store={store} />
          </div>
        );
      } else {
        if (!tab2) {
          return (
            <div className="game-design">
              <AppNavbar store={store}>
                <QuestInfo key={tab1} store={store} gameName={tab1} />
              </AppNavbar>
            </div>
          );
        } else {
          return (
            <div className="game-design">
              <QuestPlayController key={tab1} store={store} gameName={tab1} />
            </div>
          );
        }
      }
    }

    return (
      <div>
        <Redirect to="#/quests" />
      </div>
    );
  }
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("No root element!");
}
if (
  document.location.href.indexOf("https://") === 0 ||
  document.location.hostname === "localhost" ||
  document.location.hostname === "127.0.0.1"
) {
  ReactDOM.render(<MainLoader />, root);
} else {
  debug("Mounting redirect");
  const newLocation = document.location.href.replace(/^http:\/\//, "https://");
  ReactDOM.render(
    <div className="p-1 text-center">
      Redirecting to <a href={newLocation}>{newLocation}</a>
    </div>,
    root,
  );
  document.location.href = newLocation;
}
