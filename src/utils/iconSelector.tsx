import { ReactElement } from "react";
import { IoArrowRedo, IoWarning, IoCaretUp } from "react-icons/io5";
import { HiCursorClick } from "react-icons/hi";
import { HiMiniRectangleGroup, HiMiniHashtag } from "react-icons/hi2";

export const iconSelector = (type: string, category: string): ReactElement | null => {
    if (type === "History.Push") {
        return <IoArrowRedo style={{ color: "#1eb7e1" }} />;
    } else if (type === "Curl") {
        return <IoCaretUp style={{ color: "#fff" }} />;
    } else if (type === "Click" || type === "PadClick") {
        return <HiCursorClick />;
    } else if (category === "StoreAction") {
        return <HiMiniRectangleGroup style={{ color: "#46C1E6" }} />;
    } else if (type === "OperationID") {
        return <HiMiniHashtag style={{ color: "#fff" }} />;
    } else if (category === "ERROR") {
        return <IoWarning style={{ color: "#ff5631" }} />;
    } else return <div style={{ minWidth: "1em" }}></div>;
};
