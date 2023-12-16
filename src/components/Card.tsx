import { ReactElement } from "react";
import { iLine } from "../types";
import { IoArrowRedo, IoCloudUpload, IoNavigate, IoServer, IoWarning } from "react-icons/io5";

const icon = (type: string, category: string): ReactElement | null => {
  if (type === "History.Push") {
    return <IoArrowRedo style={{ color: "#1eb7e1" }} />;
  } else if (type === "Curl") {
    return <IoCloudUpload style={{ color: "#62ff42" }} />;
  } else if (type === "Click" || type === "PadClick") {
    return <IoNavigate />;
  } else if (category === "StoreAction") {
    return <IoServer style={{ color: "#1eb7e1" }} />;
  } else if (category === "ERROR") {
    return <IoWarning style={{ color: "#c52a22" }} />;
  } else return <div style={{ minWidth: "1em" }}></div>;
};

const Card: React.FunctionComponent<{ lineData: iLine }> = ({ lineData }) => {
  const { index, date, category, type, value } = lineData;

  return (
    <div className="lineCard">
      <p className="lineN-date">
        {index} / {date.time}
      </p>
      {/* <p className="category">{category}</p> */}
      {icon(type, category)}
      <p className="type">{type}</p>
      {type !== "Curl" ? <p className="value">{value}</p> : <p className="pointer">{`{ . . . }`}</p>}
    </div>
  );
};

export default Card;
