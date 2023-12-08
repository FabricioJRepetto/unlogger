import { iLine } from "../types";

const Card: React.FunctionComponent<{ lineData: iLine }> = ({ lineData }) => {
  const { index, date, category, type, value } = lineData;
  return (
    <div className="lineCard">
      <p className="lineN-date">
        {index} / {date.time}
      </p>
      <p className="category">{category}</p>
      <p className="type">{type}</p>
      {type !== "Curl" && <p className="value">{value}</p>}
    </div>
  );
};

export default Card;
