import { FunctionComponent } from "react";
import { iLine } from "../types";
import Card from "./Card";
import { iconSelector } from "../utils/iconSelector";

interface Props {
  lines: iLine[];
}

const LogContainer: FunctionComponent<Props> = ({ lines }) => {
  return (
    <section className="logContainer">
      <div style={{ textAlign: "left" }}>
        {lines.map((line, i) => (
          <Card lineData={line} key={i} icon={iconSelector(line.type, line.category)} />
        ))}
      </div>
    </section>
  );
};

export default LogContainer;
