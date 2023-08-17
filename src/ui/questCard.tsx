import React from "react";

export function QuestCard({ quest, onClick }) {
  return (
    <a
      href={`#/quests/${quest.gameName}`}
      key={quest.gameName}
      className="quest-card"
      style={{ backgroundColor: quest.bgColor }}
      onClick={onClick}
    >
      <h5 className="quest-card-title">{quest.gameTitle}</h5>
      <div className="age-limit">{quest.smallDescription}</div>
      <img className="quest-logo" src={quest.imgPath} />
    </a>
  );
}
