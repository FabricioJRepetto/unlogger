import { ReactElement, FunctionComponent } from "react";
import { iLine } from "../types";
import { curlType } from "../utils/curlType";

interface Props {
  lineData: iLine;
  icon: ReactElement | null;
}
const Card: FunctionComponent<Props> = ({ lineData, icon }) => {
  const { index, date, type, value } = lineData;
  const method = curlType(value);
  return (
    <div className="lineCard">
      <p className="lineN-date">
        {index} / {date.time}
      </p>
      {/* <p className="category">{category}</p> */}
      {icon}
      <p className="type">{type}</p>
      {type === "Curl" ? (
        <b className={`pointer ${method}`}>{`${method} { . . . }`}</b>
      ) : (
        <p className="value">{value}</p>
      )}
    </div>
  );
};

export default Card;
