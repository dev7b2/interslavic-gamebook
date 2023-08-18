import * as React from "react";
import { Loader, DivFadeinCss, Redirect } from "./common";
import { LangTexts } from "./lang";
import { WonProofs, GameWonProofs } from "./db/defs";
import { Player, Lang } from "../lib/qmplayer/player";
import {
  GameState,
  initGame,
  performJump,
  Quest,
  getUIState,
  getGameLog,
  GameLog,
} from "../lib/qmplayer/funcs";
import { JUMP_I_AGREE } from "../lib/qmplayer/defs";
import { Index, Game } from "../packGameData/defs";
import { AppNavbar } from "./appNavbar";
import { ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";
import { QuestReplaceTags } from "./questReplaceTags";
import { substitute } from "../lib/substitution";
import { DEFAULT_DAYS_TO_PASS_QUEST } from "../lib/qmplayer/defs";
import { SRDateToString } from "../lib/qmplayer/funcs";
import classnames from "classnames";

import { observer } from "mobx-react";
import { Store } from "./store";
import { getGameTaskText } from "../lib/getGameTaskText";
import { toggleFullscreen } from "./questPlay/fullscreen";

function BackButton({ title }: { title: string }) {
  return (
    <button
      className={classnames("btn btn-block btn-ligth mb-2")}
      onClick={async () => {
        location.hash = `/quests`;
      }}
    >
      <i className="fa fa-reply" /> <span className="button-text">{title}</span>
    </button>
  );
}

interface QuestInfoState {
  accessDenied?: boolean;
  lastSavedGameState?: GameState | null;
  error?: string | Error;
}

@observer
export class QuestInfo extends React.Component<
  {
    store: Store;
    gameName: string;
  },
  QuestInfoState
> {
  state: QuestInfoState = {};

  componentDidMount() {
    this.props.store.db
      .getLocalSaving(this.props.gameName)
      .then((x) => x || null)
      .catch((e) => null)
      .then((lastSavedGameState) =>
        this.setState({
          lastSavedGameState,
        }),
      )
      .catch((e) => console.warn(e));
    window.scrollTo(0, 0);
  }
  render() {
    const { l, player, index, db } = this.props.store;

    const gameName = this.props.gameName;
    const game = index.quests.find((x) => x.gameName === gameName);
    if (!game) {
      return <Redirect to="#/" />;
    }
    const denyAccess = () =>
      this.setState({
        ...this.state,
        accessDenied: true,
      });

    if (this.state.accessDenied) {
      return (
        <>
          <div>Это было očekyvano...</div>
          <div className="row">
            <div className="col-md-4">
              <BackButton title={l.backToList}></BackButton>
            </div>
          </div>
        </>
      );
    }

    if (game.hardness === 18) {
      return (
        <div>
          <div>{l.ageLimitWarning}</div>
          <div>
            <button className="btn">Да, мне 18</button>
            <button className="btn" onClick={denyAccess}>
              Мне меньше 18
            </button>
          </div>
        </div>
      );
    }

    const passedQuest = this.props.store.wonProofs
      ? this.props.store.wonProofs.get(gameName)
      : null;

    return (
      <DivFadeinCss className="container">
        <div className="text-center mb-3">
          <h4>{game.gameTitle}</h4>
          <div>
            <small>{game.smallDescription}</small>
          </div>
          <div>
            <small>
              {(() => {
                // copy-paste from questList
                if (passedQuest === undefined) {
                  return <i className="text-muted fa fa-spin circle-o-notch" />;
                }

                if (
                  passedQuest === null ||
                  // tslint:disable-next-line:strict-type-predicates
                  typeof passedQuest !== "object" ||
                  Object.keys(passedQuest).length < 1
                ) {
                  return;
                }
                return Object.keys(passedQuest)
                  .map((k) => {
                    const log = passedQuest[k];
                    const firstStep = log.performedJumps.slice(0).shift();
                    const lastStep = log.performedJumps.slice(-1).shift();
                    if (!firstStep || !lastStep) {
                      return null;
                    }
                    const durationsMins = Math.ceil(
                      (new Date(lastStep.dateUnix).getTime() -
                        new Date(firstStep.dateUnix).getTime()) /
                        (1000 * 60),
                    );
                    return {
                      started: firstStep.dateUnix,
                      end: lastStep.dateUnix,
                      durationsMins,
                      k,
                    };
                  })
                  .filter((x) => x)
                  .sort((a, b) => {
                    if (a === null || b === null) {
                      return 0;
                    } else {
                      return a.started - b.started;
                    }
                  })
                  .map((x) =>
                    x ? (
                      <div key={x.k}>
                        {l.passed} {new Date(x.end).toLocaleString()} ({x.durationsMins}{" "}
                        {l.minutesShort})
                        {/*
                                                        {new Date(x.started).toLocaleString()} - {
                                                            new Date(x.end).toLocaleString()}
                                                        */}
                      </div>
                    ) : null,
                  );
              })()}
            </small>
          </div>
        </div>
        <div className="mb-3 bootstrap-style">
          <QuestReplaceTags str={getGameTaskText(game.taskText, player)} />
        </div>
        <div className="row">
          <div className="col-md-4">
            <button
              className={classnames("btn btn-block mb-2", {
                "btn-primary": !this.state.lastSavedGameState,
              })}
              onClick={() => {
                this.props.store.db
                  .saveGame(this.props.gameName, null)
                  .then(() => {
                    location.hash = `/quests/${gameName}/play`;
                  })
                  .catch((e) => console.error(e));
              }}
            >
              <i className="fa fa-rocket" />{" "}
              <span className="button-text">{l.startFromTheStart}</span>
            </button>
          </div>
          <div className="col-md-4">
            <button
              className={classnames("btn btn-block mb-2", {
                "btn-primary": !!this.state.lastSavedGameState,
                disabled: !this.state.lastSavedGameState,
              })}
              onClick={() => {
                location.hash = `/quests/${gameName}/play`;
              }}
            >
              {this.state.lastSavedGameState === undefined ? (
                <i className="fa fa-spin fa-spinner" />
              ) : this.state.lastSavedGameState ? (
                <>
                  <i className="fa fa-save" />{" "}
                  <span className="button-text">{l.startFromLastSave}</span>
                </>
              ) : (
                <>
                  {" "}
                  <i className="fa fa-circle-o" />{" "}
                  <span className="button-text">{l.noLastSave}</span>
                </>
              )}
            </button>
          </div>

          <div className="col-md-4">
            <button
              className={classnames("btn btn-block btn-ligth mb-2")}
              onClick={async () => {
                location.hash = `/quests`;
              }}
            >
              <i className="fa fa-reply" /> <span className="button-text">{l.backToList}</span>
            </button>
          </div>
        </div>
      </DivFadeinCss>
    );
  }
}
