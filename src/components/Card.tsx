import { ReactElement, FunctionComponent } from "react";
import { iLine } from "../types";
import { curlType } from "../utils/curlType";

interface Props {
    lineData: iLine;
    icon: ReactElement | null;
    openValue: () => void;
    cardIndex: number;
}
const Card: FunctionComponent<Props> = ({ lineData, icon, openValue, cardIndex }) => {
    const { lineNum, date, type, value } = lineData;
    const method = curlType(value);

    const copyTimeStamp = () => {
        date.time && navigator.clipboard.writeText(date.time);
    };

    return (
        <div className="lineCard" style={{ animationDelay: `${5 * cardIndex}ms` }}>
            <span className="lineN-date" onClick={copyTimeStamp}>
                <p>{lineNum}</p>/ <p className="pointer lineTimeStamp">{date.time}</p>
            </span>
            {/* <p className="category">{category}</p> */}
            {icon}
            <p className={type === "Curl" ? "method " + method : "type"}>{type === "Curl" ? method : type}</p>
            {type === "Curl" ? (
                <p className={`pointer`} onClick={openValue}>{`{...}`}</p>
            ) : (
                <p className="value">{value}</p>
            )}
        </div>
    );
};

export default Card;
