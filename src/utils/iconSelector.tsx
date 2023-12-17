import { ReactElement } from "react";
import { IoArrowRedo, IoCloudUpload, IoServer, IoWarning, IoAt } from "react-icons/io5";
import { HiCursorClick } from "react-icons/hi";

export const iconSelector = (type: string, category: string): ReactElement | null => {
  if (type === "History.Push") {
    return <IoArrowRedo style={{ color: "#1eb7e1" }} />;
  } else if (type === "Curl") {
    return <IoCloudUpload style={{ color: "#62ff42" }} />;
  } else if (type === "Click" || type === "PadClick") {
    // return <IoNavigate />;
    return <HiCursorClick />;
  } else if (category === "StoreAction") {
    return <IoServer style={{ color: "#1eb7e1" }} />;
  } else if (type === "OperationID") {
    return <IoAt style={{ color: "#fff" }} />;
  } else if (category === "ERROR") {
    return <IoWarning style={{ color: "#c52a22" }} />;
  } else return <div style={{ minWidth: "1em" }}></div>;
};
