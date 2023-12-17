import { FunctionComponent, MouseEvent, useRef, useState } from "react";
import { iSession } from "../types";

interface Props {
    sessions: iSession[];
    handler: (index: number) => void;
}
interface tooltipData {
    show: boolean;
    idList?: string[];
    xOffset?: string;
    yOffset?: string;
}

interface CardProps {
    sessionData: iSession;
    clickHandler: () => void;
    tooltipHandler: (data: tooltipData) => void;
    selected: boolean;
}

const SessionCard: FunctionComponent<CardProps> = ({ sessionData, clickHandler, tooltipHandler, selected }) => {
    const { id, init, close } = sessionData;
    if (!init.index || !close.index) return null;

    const IDList: string[] = Array.from(new Set(id));

    const hoverHandler = (e: MouseEvent) => {
        if (e.type === "mouseenter" && IDList.length) {
            const padding = 128;
            const X = e.pageX - padding;

            tooltipHandler({
                show: true,
                idList: IDList,
                xOffset: X + "px",
                yOffset: e.pageY - 85 + "px",
            });
        } else if (e.type === "mouseleave") {
            tooltipHandler({
                show: false,
            });
        }
    };

    return (
        <div
            className={`SessionCard pointer ${selected ? "sessionSelected" : ""}`}
            onClick={clickHandler}
            onMouseEnter={hoverHandler}
            onMouseLeave={hoverHandler}
        >
            <p>start: {init.date?.time?.slice(0, -5)}</p>
            <p>end: {close.date?.time?.slice(0, -5)}</p>
            <p>OpIDs: {IDList.length}</p>
            <p>lines: {close.index - init.index}</p>
        </div>
    );
};

const SessionsBanner: FunctionComponent<Props> = ({ sessions, handler }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [tooltip, setTooltip] = useState<boolean>(false);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [idList, setidList] = useState<string[]>();

    const tooltipHandler = (data: tooltipData) => {
        const { show, idList, xOffset, yOffset } = data;
        if (show && idList && xOffset && yOffset && tooltipRef.current) {
            setidList(idList);
            tooltipRef.current.style.left = xOffset;
            // tooltipRef.current.style.top = yOffset;
            setTooltip(true);
        } else {
            setTooltip(false);
        }
    };

    const clickHandler = (index: number) => {
        handler(index);
        setSelected(index);
    };

    const sessionsList = sessions
        .filter(s => s.init.index && s.close.index)
        .map((s, i) => (
            <SessionCard
                sessionData={s}
                clickHandler={() => clickHandler(i)}
                tooltipHandler={tooltipHandler}
                selected={selected === i}
                key={"session_" + i}
            />
        ));

    return (
        <>
            {sessionsList.length ? (
                <>
                    <div className="SessionsBannerHeader">
                        <div ref={tooltipRef} className={tooltip ? "idlist" : "hidden"}>
                            {tooltip &&
                                idList &&
                                idList.map(id => (
                                    <p key={id} className="idListId">
                                        {id}
                                    </p>
                                ))}
                        </div>
                        <b className="SessionsBannerTitle">Sesiones</b>
                        <p className="SessionsBannerDescription">scroll horizontal: shift + mouse wheel</p>
                    </div>
                    <div className="SessionsBanner">{sessionsList}</div>
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
