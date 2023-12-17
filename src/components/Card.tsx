import { ReactElement, FunctionComponent } from "react";
import { iLine } from "../types";
import { curlType } from "../utils/curlType";

interface Props {
    lineData: iLine;
    icon: ReactElement | null;
    openValue: () => void;
}
const Card: FunctionComponent<Props> = ({ lineData, icon, openValue }) => {
    const { index, date, type, value } = lineData;
    const method = curlType(value);
    return (
        <div className="lineCard">
            <p className="lineN-date">
                {index} / {date.time}
            </p>
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
