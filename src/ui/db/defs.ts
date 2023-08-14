import { Player } from "../../lib/qmplayer/player";
import { GameLog } from "../../lib/qmplayer/funcs";

export interface ConfigLocalOnly {
  lastLocation: string;
}

export interface ConfigBoth extends ConfigLocalOnly {
  player: Player;
  noMusic: boolean;
}

export interface GameWonProofs {
  [seed: string]: GameLog & {
    created: number;
  };
}
export interface WonProofs {
  [gameId: string]: GameWonProofs;
}
export interface FirebasePublic {
  info: {
    name: string;
  };
  gamesWonCount: number;
  gamesWonProofs: WonProofs;
  userId: string;
}

export interface WonProofTableRow {
  rangerName: string;
  userId: string;
  createdAt: number;
  gameName: string;
  proof: GameLog;
}
