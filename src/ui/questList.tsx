import * as React from "react";
import { DivFadeinCss } from "./common";
import { observer } from "mobx-react";
import { Store, QUEST_SEARCH_ALL } from "./store";

import { AppNavbar } from "./appNavbar";
import { getGameTaskText } from "../lib/getGameTaskText";
import { getMagicSlots } from "./questList.magicSlots";
import { computed } from "mobx";
import { QuestCard } from "./questCard";

interface QuestListState {
  dropdownOpen: boolean;
}

@observer
export class QuestList extends React.Component<
  {
    store: Store;
  },
  QuestListState
> {
  state: QuestListState = {
    dropdownOpen: false,
  };
  onScroll = () => {
    this.props.store.lastQuestListScroll = window.scrollY;
  };
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }
  componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
    if (this.props.store.lastQuestListScroll) {
      window.scrollTo(0, this.props.store.lastQuestListScroll);
    }
  }

  @computed
  get origins() {
    return this.props.store.index.quests
      .filter((x) => x.lang === this.props.store.player.lang)
      .map((x) => x.questOrigin)
      .reduce((acc, d) => (acc.indexOf(d) > -1 ? acc : acc.concat(d)), [] as string[]);
  }

  @computed
  get allQuestsForThisUser() {
    const passedQuests = this.props.store.wonProofs;
    return this.props.store.index.quests
      .filter((quest) => quest.lang === this.props.store.player.lang)
      .map((quest) => ({
        ...quest,
        passedAt: (() => {
          // Returns:
          //  - undefined if still loading
          //  - false if not passed
          //  - Date object when first passed
          //  - true is passed but date is unknown

          if (!passedQuests) {
            return undefined;
          }
          const passed = passedQuests.get(quest.gameName);
          if (typeof passed !== "object" || Object.keys(passed).length < 1) {
            return false;
          }
          const firstPassedAt = Math.min(
            ...Object.keys(passed).map(
              (key) => passed[key].performedJumps.slice(-1).pop()?.dateUnix || Infinity,
            ),
          );
          if (firstPassedAt === Infinity) {
            return true;
          }
          return new Date(firstPassedAt);
        })(),
        taskText: getGameTaskText(quest.taskText, this.props.store.player),
      }));
  }

  @computed
  get questsToShow() {
    const store = this.props.store;
    return this.allQuestsForThisUser
      .filter((quest) =>
        store.questsListTab !== QUEST_SEARCH_ALL ? quest.questOrigin === store.questsListTab : true,
      )
      .filter((quest) =>
        store.questsListSearch
          ? quest.gameName.toLowerCase().indexOf(store.questsListSearch.toLowerCase()) > -1 ||
            quest.taskText.toLowerCase().indexOf(store.questsListSearch.toLowerCase()) > -1
          : true,
      );
  }

  @computed
  get proposedSlots() {
    const allGamesInPseudoRandomOrder = this.allQuestsForThisUser
      .map((quest) => {
        // Tried to find combination which moves some nice quests to the beginning
        // const somePrimeNumbers = [3, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503];
        // const somePrimeNumbers = [439, 443, 467, 479, 487, 491, 499, 503];
        // const somePrimeNumbers = [953, 967, 971, 977, 983, 991, 997];
        const somePrimeNumbers = [967, 971, 977, 983, 991, 997];

        const isQuestFromTheGame =
          quest.questOrigin.startsWith("SR ") || quest.questOrigin.startsWith("КР ");

        const computedOrderValue = quest.gameName
          .split("")
          .map((char) => char.charCodeAt(0))
          .map(
            (charCode, index) =>
              charCode * somePrimeNumbers[index % somePrimeNumbers.length] + quest.hardness * 727,
          )
          .reduce((acc, val) => (acc + val) % 1000, 0);
        const hardcodedOrderValueForFansQuests = 2000;
        const orderValue = isQuestFromTheGame
          ? computedOrderValue
          : hardcodedOrderValueForFansQuests;

        return {
          gameName: quest.gameName,
          orderValue,
        };
      })
      .sort((a, b) => a.orderValue - b.orderValue || (a.gameName > b.gameName ? 1 : -1))
      .map((x) => x.gameName);
    const passedGamesInPassingOrder = this.allQuestsForThisUser
      .map((quest, index) => ({
        gameName: quest.gameName,
        order:
          quest.passedAt === undefined || quest.passedAt === false
            ? 0
            : quest.passedAt === true
            ? index
            : quest.passedAt.getTime(),
      }))
      .filter((x) => x.order > 0)
      .sort((a, b) => a.order - b.order)
      .map((x) => x.gameName);

    const proposedSlots = getMagicSlots(allGamesInPseudoRandomOrder, passedGamesInPassingOrder, 3);

    return proposedSlots;
  }

  render() {
    const { l } = this.props.store;
    const handleCardClick = (gameName: string) => {
      this.props.store.db
        .saveGame(gameName, null) // reset saved game data
        .then(() => {
          location.hash = `/quests/${gameName}/play`;
        })
        .catch((e) => console.error(e));
    };

    return (
      <AppNavbar store={this.props.store}>
        <DivFadeinCss key="quest list" className="container mb-5">
          <div className="text-center mb-5 mt-5">
            <h5 className="welcome-message">
              {l.hi}
              <br />
              {l.welcomeHeader}
            </h5>
          </div>

          {this.questsToShow.length > 0 ? (
            <>
              <div className="quest-box">
                {this.questsToShow.map((quest) => (
                  <QuestCard
                    quest={quest}
                    onClick={(e: Event) => {
                      e.preventDefault();

                      handleCardClick(quest.gameName);
                    }}
                  ></QuestCard>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <i className="fa fa-circle-o" /> {l.nothingFound}
            </div>
          )}
        </DivFadeinCss>
      </AppNavbar>
    );
  }
}
