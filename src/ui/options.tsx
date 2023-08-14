import * as React from "react";
import { Loader, DivFadeinCss } from "./common";
import { LangTexts } from "./lang";
import { DB } from "./db/db";
import { Player, Lang } from "../lib/qmplayer/player";
import { observer } from "mobx-react";
import { Store } from "./store";
import { toJS } from "mobx";

interface OptionsState {
  player: Player;

  busy: boolean;
}

@observer
export class OptionsTabContainer extends React.Component<
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
    if (this.state.busy) {
      return <Loader text={l.saving} />;
    }

    const player = this.state.player;
    const updatePlayer = <K extends keyof Player>(key: K, value: Player[K]) => {
      this.setState({
        player: {
          ...player,
          [key]: value,
        },
      });
    };
    return (
      <DivFadeinCss key="options" className="text-center my-3 container">
        <form>
          <div className="row">
            {/* <div className="form-group col-md-6">
              <label>{l.ranger}</label>
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={player.Ranger}
                onChange={(e) => updatePlayer("Ranger", e.target.value)}
              />
            </div> */}

            <div className="form-group col-md-6">
              <label className="customized-label">{l.lang}</label>
              <select
                className="customized-select"
                value={player.lang}
                onChange={(e) => updatePlayer("lang", e.target.value as Lang)}
              >
                <option value="rus">{l.rus}</option>
                <option value="eng">{l.eng}</option>
              </select>
            </div>

            {/* <div className="form-group col-md-6">
              <label>{l.fromPlanet}</label>
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={player.FromPlanet}
                onChange={(e) => updatePlayer("FromPlanet", e.target.value)}
              />
            </div> */}

            {/* <div className="form-group col-md-6">
              <label>{l.fromStar}</label>
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={player.FromStar}
                onChange={(e) => updatePlayer("FromStar", e.target.value)}
              />
            </div> */}

            {/* <div className="form-group col-md-6">
              <label>{l.toPlanet}</label>
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={player.ToPlanet}
                onChange={(e) => updatePlayer("ToPlanet", e.target.value)}
              />
            </div> */}

            {/* <div className="form-group col-md-6">
              <label>{l.toStar}</label>
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={player.ToStar}
                onChange={(e) => updatePlayer("ToStar", e.target.value)}
              />
            </div> */}

            {/* <div className="form-group col-md-6">
              <label>{l.defaultCompensation}</label>
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={player.Money}
                onChange={(e) => updatePlayer("Money", e.target.value)}
              />
            </div> */}

            <div className="form-group col-md-6">
              <label className="customized-label">{l.enableBackButton}</label>
              <select
                className="customized-select"
                value={player.allowBackButton ? "1" : "0"}
                onChange={(e) => updatePlayer("allowBackButton", e.target.value === "1")}
              >
                <option value="1">{l.backButtonEnabled}</option>
                <option value="0">{l.backButtonDisabled}</option>
              </select>
            </div>
          </div>
        </form>
        <div className="text-center">
          <button
            className="btn btn-primary px-5"
            onClick={() => {
              this.setState({
                busy: true,
              });
              (async () => {
                const db = this.props.store.db;
                await db.setConfigBoth("player", player);
                const savedPlayer = await db.getConfigLocal("player");
                if (!savedPlayer) {
                  throw new Error("Where is the player?");
                }
                this.props.store.player = savedPlayer;
                this.setState({
                  busy: false,
                });
              })().catch((e) => location.reload());
            }}
          >
            <i className="fa fa-save" /> <span className="button-text">{l.save}</span>
          </button>
        </div>
      </DivFadeinCss>
    );
  }
}
