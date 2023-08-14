import { GameLog, GameState } from "../../lib/qmplayer/funcs";
import { ConfigBoth, ConfigLocalOnly } from "./defs";

const INDEXEDDB_NAME = "spaceranges2";
const INDEXEDDB_CONFIG_STORE_NAME = "config";
const INDEXEDDB_SAVED_STORE_NAME = "savedgames";
const INDEXEDDB_WON_STORE_NAME = "wongames";
const INDEXEDDB_CUSTOM_SAVED_STORE_NAME = "customsavedgames";

function debug(...args: any[]) {
  //console.info(...args);
}

export async function getDb() {
  debug("Starting to get db");

  const db = window.indexedDB
    ? await new Promise<IDBDatabase>((resolve, reject) => {
        const idb = window.indexedDB.open(INDEXEDDB_NAME, 8);
        debug("idb opened");
        idb.onerror = (e) =>
          reject(
            new Error(
              idb.error ? `IndexedDB error: ${idb.error.name} ${idb.error.message}` : "Unknown",
            ),
          );
        idb.onsuccess = (e: any) => resolve(e.target.result);
        idb.onupgradeneeded = (e: any) => {
          debug("onupgradeneeded");
          const db: IDBDatabase = e.target.result;
          // debug(`Old version=${db.}`)

          for (const storeName of [
            INDEXEDDB_CONFIG_STORE_NAME,
            INDEXEDDB_SAVED_STORE_NAME,
            INDEXEDDB_WON_STORE_NAME,
            INDEXEDDB_CUSTOM_SAVED_STORE_NAME,
          ]) {
            if (!db.objectStoreNames.contains(storeName)) {
              debug(`Creating ${storeName} store`);
              db.createObjectStore(storeName, {
                // keyPath: false,
                autoIncrement: false,
              });
            } else {
              debug(`It containt ${storeName} store`);
            }
          }
        };
      })
    : undefined;
  debug(db ? "Got indexedDB" : "IndexedDB is not available, will use localStorage");
  // await new Promise<void>(resolve => setTimeout(resolve, 1));

  async function getLocal(storeName: string, key: string) {
    if (db) {
      const trx = db.transaction([storeName], "readonly");
      const objectStore = trx.objectStore(storeName);
      const getReq = objectStore.get(key);
      const localResult = await new Promise<any>((resolve, reject) => {
        getReq.onsuccess = (e) => {
          resolve(getReq.result);
        };
        getReq.onerror = (e) =>
          reject(new Error(getReq.error ? getReq.error.toString() : "Unknown"));
      });
      return localResult;
    } else {
      // fallback to localStorage
      const raw = localStorage.getItem(`RANGERS-${storeName}-${key}`);
      if (raw) {
        return JSON.parse(raw);
      } else {
        return null;
      }
    }
  }

  async function setLocal(storeName: string, key: string, value: any) {
    if (db) {
      const trx = db.transaction([storeName], "readwrite");
      const objectStore = trx.objectStore(storeName);

      const req = value ? objectStore.put(value, key) : objectStore.delete(key);
      await new Promise<void>((resolve, reject) => {
        req.onsuccess = (e) => resolve();
        req.onerror = (e) => {
          console.warn("Indexeddb error", req.error);
          reject(
            new Error(
              req.error ? `IndexedDB error: ${req.error.name} ${req.error.message}` : "Unknown",
            ),
          );
        };
      });
    } else {
      const lsFullKey = `RANGERS-${storeName}-${key}`;
      if (value) {
        localStorage.setItem(lsFullKey, JSON.stringify(value));
      } else {
        localStorage.removeItem(lsFullKey);
      }
    }
  }

  /* No actions from this point, only exported functions */

  async function setConfigBoth(key: keyof ConfigBoth, value: ConfigBoth[typeof key]) {
    debug(`setConfig key=${key} value=${JSON.stringify(value)}`);
    await setLocal(INDEXEDDB_CONFIG_STORE_NAME, key, value);
  }

  async function setConfigLocal(key: keyof ConfigLocalOnly, value: ConfigLocalOnly[typeof key]) {
    debug(`setConfig key=${key} value=${JSON.stringify(value)}`);
    await setLocal(INDEXEDDB_CONFIG_STORE_NAME, key, value);
  }

  async function getConfigLocal<T extends keyof ConfigBoth>(key: T): Promise<ConfigBoth[T] | null> {
    return getLocal(INDEXEDDB_CONFIG_STORE_NAME, key);
  }

  async function isGamePassedLocal(gameName: string) {
    const values = await getLocal(INDEXEDDB_WON_STORE_NAME, gameName);
    if (values && typeof values === "object" && Object.keys(values).length >= 1) {
      return values;
    } else {
      return false;
    }
  }

  async function setGamePassing(gameName: string, proof: GameLog) {
    const values = await getLocal(INDEXEDDB_WON_STORE_NAME, gameName);
    const newValues = {
      ...values,
      [proof.aleaSeed]: proof,
    };
    await setLocal(INDEXEDDB_WON_STORE_NAME, gameName, newValues);
  }

  async function saveGame(gameName: string, saving: GameState | null) {
    const savingRaw = saving ? JSON.stringify(saving) : saving;
    await setLocal(INDEXEDDB_SAVED_STORE_NAME, gameName, savingRaw);
  }

  async function getLocalSaving(gameName: string) {
    const rawValue = await getLocal(INDEXEDDB_SAVED_STORE_NAME, gameName);
    try {
      const value = JSON.parse(rawValue);
      return value as GameState;
    } catch (e) {
      return null;
    }
  }

  async function saveCustomGame(gameKey: string, saving: GameState | null) {
    // It is ok to save gamestate as it is without JSON encoding
    // But it caused some issues when saving was a MobX observable
    // So we save it as a string
    const savingRaw = saving ? JSON.stringify(saving) : saving;
    await setLocal(INDEXEDDB_CUSTOM_SAVED_STORE_NAME, gameKey, savingRaw);
  }
  async function loadCustomGame(gameKey: string) {
    const rawValue = await getLocal(INDEXEDDB_CUSTOM_SAVED_STORE_NAME, gameKey);
    if (!rawValue) {
      return null;
    }
    try {
      const value = JSON.parse(rawValue);
      return value as GameState;
    } catch (e) {
      return null;
    }
  }

  debug(`Returning db instance`);
  return {
    setConfigBoth,
    setConfigLocal,
    getConfigLocal,

    isGamePassedLocal,
    setGamePassing,

    saveGame,
    getLocalSaving,

    saveCustomGame,
    loadCustomGame,
  };
}

export type DB = typeof getDb extends (app: any) => Promise<infer T> ? T : never;
