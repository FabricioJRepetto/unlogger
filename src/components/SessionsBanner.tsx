import React from "react";
import { iSession } from "../types";

const SessionCard: React.FunctionComponent<{ sessionData: iSession; handler: () => void }> = ({
  sessionData,
  handler,
}) => {
  const { id, init, close } = sessionData;
  if (!init.index || !close.index) return null;
  return (
    <div className="SessionCard" onClick={handler}>
      {/* <p>start: {init.date?.time}</p> */}
      {/* <p>end: {close.date?.time}</p> */}
      <p>OpIDs: {id.length}</p>
      <p>lines: {close.index - init.index}</p>
    </div>
  );
};

const SessionsBanner: React.FunctionComponent<{ sessions: iSession[]; handler: (index: number) => void }> = ({
  sessions,
  handler,
}) => {
  return (
    <div className="SessionsBanner">
      {sessions.map((s, i) => (
        <SessionCard sessionData={s} handler={() => handler(i)} key={"session_" + i} />
      ))}
    </div>
  );
};

export default SessionsBanner;
