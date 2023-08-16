import React from "react";

export function QuestCard(props: { quest: any }) {
  const quest = props.quest;

  return (
    <a
      href={`#/quests/${quest.gameName}`}
      key={quest.gameName}
      className="quest-card"
      style={{ backgroundColor: quest.bgColor }}
    >
      <h5 className="quest-card-title">{quest.gameTitle}</h5>
      <div className="age-limit">{quest.smallDescription}</div>
    </a>
  );
}
