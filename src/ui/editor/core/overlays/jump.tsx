import classNames from "classnames";
import * as React from "react";
import { assertNever } from "../../../../assertNever";
import { DeepImmutable } from "../../../../lib/qmplayer/deepImmutable";
import { Quest } from "../../../../lib/qmplayer/funcs";
import { Jump } from "../../../../lib/qmreader";
import { getParamStringInfo } from "../hovers/paramsAndChangeConditionsSummary";
import { Overlay } from "../overlay";
import { range } from "../utils";
import { MediaEdit, ParamChangeTypeEdit } from "./common";
import { toast } from "react-toastify";
import { useOnDocumentKeyUp } from "../keypress";
import { FormulaInput } from "../common/formulaInput";

export function JumpOverlay({
  quest,
  initialJump,
  onClose,
}: {
  quest: Quest;
  initialJump: DeepImmutable<Jump>;
  onClose: (jump: DeepImmutable<Jump> | undefined) => void;
}) {
  const [jump, setJump] = React.useState<DeepImmutable<Jump> | undefined>(undefined);

  const [paramId, setParamId] = React.useState(0);

  React.useEffect(() => {
    setJump(initialJump);
    setParamId(0);
  }, [initialJump]);

  const [isPrompting, setIsPrompting] = React.useState(false);
  React.useEffect(() => {
    if (!isPrompting) {
      return;
    }
    const timerId = window.setTimeout(() => setIsPrompting(false), 5000);
    return () => window.clearTimeout(timerId);
  });

  const isChanged = jump !== initialJump;

  const onCloseWithPrompt = React.useCallback(() => {
    if (!isChanged) {
      onClose(undefined);
      return;
    }

    if (isPrompting) {
      onClose(undefined);
    } else {
      setIsPrompting(true);
    }
  }, [isChanged, isPrompting]);

  useOnDocumentKeyUp((e) => {
    console.info(e.key);
    if (e.key === "Escape") {
      onCloseWithPrompt();
    }
  });

  if (!jump) {
    return null;
  }

  return (
    <Overlay
      wide
      position="absolute"
      headerText={`Редактирование перехода P ${jump.id}`}
      onClose={onCloseWithPrompt}
    >
      <div>
        <div>Вопрос для совершения перехода:</div>
        <textarea
          className="form-control mb-1"
          rows={2}
          style={{
            resize: "none",
          }}
          value={jump.text}
          onChange={(e) => {
            setJump({
              ...jump,
              text: e.target.value,
            });
          }}
        />

        <div className="row mb-2">
          <div className="col-9">
            <div>Сообщение, выводящееся при выполнении перехода:</div>
            <textarea
              className="form-control mb-1"
              rows={5}
              style={{
                resize: "none",
              }}
              value={jump.description}
              onChange={(e) => {
                setJump({
                  ...jump,
                  description: e.target.value,
                });
              }}
            />
          </div>
          <div className="col-3 pt-4">
            <input
              className="form-control"
              placeholder="Иллюстрация"
              value={jump.img}
              onChange={(e) => setJump({ ...jump, img: e.target.value })}
            />
            <input
              className="form-control"
              placeholder="Фоновый трек"
              value={jump.track}
              onChange={(e) => setJump({ ...jump, track: e.target.value })}
            />
            <input
              className="form-control"
              placeholder="Звуковой эффект"
              value={jump.sound}
              onChange={(e) => setJump({ ...jump, track: e.target.value })}
            />
          </div>
        </div>

        <div className="d-flex align-items-center mb-3">
          <label className="form-check-label" style={{ flexShrink: 0 }}>
            Логическое условие
          </label>
          <FormulaInput
            className="form-control w-100 ml-2"
            value={jump.formulaToPass}
            onChange={(newValue) => setJump({ ...jump, formulaToPass: newValue })}
            paramsActive={quest.params}
            allowEmpty
          />
        </div>

        <div className="row mb-3">
          <div className="col-6">
            <select
              className="form-control"
              value={paramId}
              size={16}
              style={{ height: "100%" }}
              onChange={(e) => setParamId(parseInt(e.target.value))}
            >
              {quest.params.map((param, idx) => {
                const summary = getParamStringInfo(idx, param, jump.paramsChanges[idx], null);
                return (
                  <option className={param.active ? "" : "text-muted"} value={idx}>
                    {summary.textName}
                    {summary.leftText} {summary.rightText}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="col-6">TODO</div>
        </div>

        <div className="form-inline">
          <div className="ml-3 form-check form-check-inline">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                checked={jump.dayPassed}
                onChange={(e) => setJump({ ...jump, dayPassed: e.target.checked })}
              />
              Прошел один день
            </label>
          </div>

          <div className="ml-4 form-check form-check-inline">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                checked={jump.jumpingCountLimit === 0}
                onChange={(e) => setJump({ ...jump, jumpingCountLimit: e.target.checked ? 0 : 1 })}
              />
              Неограниченная проходимость
            </label>
          </div>
          {jump.jumpingCountLimit > 0 && (
            <input
              className={classNames("form-control ml-2")}
              type="number"
              value={jump.jumpingCountLimit}
              onChange={(e) => setJump({ ...jump, jumpingCountLimit: parseInt(e.target.value) })}
            />
          )}

          <button
            className="btn btn-primary ml-auto mr-2"
            disabled={!isChanged}
            onClick={() => onClose(jump)}
          >
            Сохранить
          </button>
          <button className="btn btn-danger" onClick={onCloseWithPrompt}>
            {!isPrompting ? "Закрыть" : "Точно закрыть?"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
