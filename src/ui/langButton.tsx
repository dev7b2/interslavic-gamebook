import * as React from "react";
import { Player } from "../lib/qmplayer/player";
import { observer } from "mobx-react";
import { Store } from "./store";
import { toJS } from "mobx";

interface OptionsState {
  player: Player;

  busy: boolean;
}

@observer
export class LangButton extends React.Component<
  {
    store: Store;
  },
  OptionsState
> {
  state = {
    player: toJS(this.props.store.player),
    busy: false,
  };
  render() {
    const l = this.props.store.l;
    const updatePlayer = <K extends keyof Player>(key: K, value: Player[K]) => {
      this.setState(
        {
          player: {
            ...this.state.player,
            [key]: value,
          },
        },
        () => saveDataToDB(),
      );
    };
    const toggleLanguage = () => {
      const newLang = this.state.player.lang === "rus" ? "eng" : "rus";

      updatePlayer("lang", newLang);
    };
    const saveDataToDB = () => {
      this.setState({
        busy: true,
      });
      (async () => {
        const db = this.props.store.db;

        await db.setConfigBoth("player", this.state.player);

        const savedPlayer = await db.getConfigLocal("player");

        if (!savedPlayer) {
          throw new Error("Where is the player?");
        }

        this.props.store.player = savedPlayer;
        this.setState({
          busy: false,
        });
      })().catch((e) => location.reload());
    };

    return (
      <button
        className="btn lang-button"
        aria-label={l.lang}
        onClick={toggleLanguage}
        disabled={this.state.busy}
      >
        <i className="fa fa-keyboard-o" /> <span className="button-text">{l.alphabet}</span>
      </button>
    );
  }
}
