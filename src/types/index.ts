export enum CATEGORY {
    WEBAPP = "WebApp",
    STOREACTION = "StoreAction",
    CONNECTION = "Connection",
}
export type iDate = {
    year: string | null;
    time: string | null;
};
export type iLine = {
    index: number;
    lineNum: number;
    date: iDate;
    category: string;
    type: string; //: crear enum
    value: string;
    extra?: string;
};

export enum EVENT {
    init = "initiateSession",
    OpID = "OperationID",
    close = "sessionClosed",
}

export interface iSessionEvent {
    type: EVENT;
    index: number;
    value: string;
    date: iDate;
}

interface SessionEventData {
    index: number | null;
    date: iDate | null;
}
export interface iSession {
    id: string[];
    init: SessionEventData;
    close: SessionEventData;
}

export type parsedResult = {
    lines: iLine[];
    sessions: iSession[];
};

export interface logData {
    sucursal: string;
    terminal: string;
    date: string;
}
