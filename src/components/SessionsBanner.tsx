import { FunctionComponent, useState } from "react";
import { iSession } from "../types";

interface CardProps {
  sessionData: iSession;
  handler: () => void;
  selected: boolean;
}

interface Props {
  sessions: iSession[];
  handler: (index: number) => void;
}

const SessionCard: FunctionComponent<CardProps> = ({ sessionData, handler, selected }) => {
  const { id, init, close } = sessionData;
  if (!init.index || !close.index) return null;
  return (
    <div className={`SessionCard pointer ${selected ? "sessionSelected" : ""}`} onClick={handler}>
      <p>start: {init.date?.time?.slice(0, -5)}</p>
      <p>end: {close.date?.time?.slice(0, -5)}</p>
      <p>OpIDs: {id.length}</p>
      <p>lines: {close.index - init.index}</p>
    </div>
  );
};

const SessionsBanner: FunctionComponent<Props> = ({ sessions, handler }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const clickHandler = (index: number) => {
    handler(index);
    setSelected(index);
  };

  const aux = sessions
    .filter(s => s.init.index && s.close.index)
    .map((s, i) => (
      <SessionCard sessionData={s} handler={() => clickHandler(i)} selected={selected === i} key={"session_" + i} />
    ));

  return (
    <>
      {aux.length ? (
        <>
          <div className="SessionsBannerHeader">
            <b className="SessionsBannerTitle">Sesiones</b>
            <p className="SessionsBannerDescription">scroll horizontal: shift + mouse wheel</p>
          </div>
          <div className="SessionsBanner">{aux}</div>
        </>
      ) : (
        <div className="noSessions">
          <b>Sin sessiones</b>
        </div>
      )}
    </>
  );
};

export default SessionsBanner;
