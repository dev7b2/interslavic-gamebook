import { Quest } from "../qmplayer/funcs";
import { transliterate } from "./translit.utils";

export function translateGameToLat(game: Quest): Quest {
  const result: Quest = {
    ...game,
    successText: transliterate(game.successText),
    taskText: transliterate(game.taskText),
    params: game.params.map((param) => ({
      ...param,
      showingInfo: param.showingInfo.map((si) => ({ ...si, str: transliterate(si.str) })),
    })),
    locations: game.locations.map((loc) => ({
      ...loc,
      texts: loc.texts.map((lTxt) => transliterate(lTxt)),
    })),
    jumps: game.jumps.map((jump) => ({
      ...jump,
      text: transliterate(jump.text),
      description: transliterate(jump.description),
    })),
  };

  return result;
}
