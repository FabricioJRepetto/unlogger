import { FunctionComponent, MouseEvent, useEffect, useRef, useState } from "react";
import { iSession } from "../types";

interface Props {
    sessions: iSession[] | null | undefined;
    handler: (index: number | null) => void;
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
    const tooltipTO = useRef<NodeJS.Timeout | null>(null);

    const { id, init, close } = sessionData;
    if (!init.index || !close.index) return null;

    const UniqueOPIDS = Array.from(new Set(id));
    const IDList: string[] = UniqueOPIDS.length ? UniqueOPIDS : ["No Op. IDs found"];

    const hoverHandler = async (e: MouseEvent) => {
        if (e.type === "mouseenter") {
            tooltipTO.current = setTimeout(() => {
                tooltipHandler({
                    show: true,
                    idList: IDList,
                    xOffset: e.pageX - 128 + "px",
                    yOffset: e.pageY - 85 + "px",
                });
                clearTimeout(tooltipTO.current!);
                tooltipTO.current = null;
            }, 1000);
        } else if (e.type === "mouseleave") {
            clearTimeout(tooltipTO.current!);
            tooltipTO.current = null;
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
            <p>OpIDs: {UniqueOPIDS.length}</p>
            <p>lines: {close.index - init.index}</p>
        </div>
    );
};

const SessionsBanner: FunctionComponent<Props> = ({ sessions, handler }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [tooltip, setTooltip] = useState<boolean>(false);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [idList, setidList] = useState<string[]>();

    const [mousePos, setMousePos] = useState<{ left: string; top: string } | null>(null);
    useEffect(() => {
        addEventListener("mousemove", mousePosHandler);
        return () => {
            removeEventListener("mousemove", mousePosHandler);
        };
    }, []);

    const mousePosHandler = (ev: globalThis.MouseEvent) => {
        setMousePos({ left: ev.pageX - 120 + "px", top: ev.pageY - 120 + "px" });
        return null;
    };

    if (!sessions) return null;

    const tooltipHandler = (data: tooltipData) => {
        const { show, idList } = data;
        if (show && idList && mousePos?.left && mousePos?.top && tooltipRef.current) {
            setidList(idList);
            setTooltip(true);
        } else {
            setTooltip(false);
        }
    };

    const clickHandler = (index: number) => {
        if (index === selected) {
            handler(null);
            setSelected(null);
        } else {
            handler(index);
            setSelected(index);
        }
    };

    const sessionsList = sessions.map((s, i) => (
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
                        <div ref={tooltipRef} className={tooltip ? "idlist" : "hidden"} style={mousePos!}>
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
