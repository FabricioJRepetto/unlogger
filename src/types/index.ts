export enum CATEGORY {
<<<<<<< HEAD
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
}

export interface iSession {
  id: string[];
  indexes: {
    init: number | null;
    close: number | null;
  };
}
=======
    WEBAPP = "WebApp",
    STOREACTION = "StoreAction",
    CONNECTION = "Connection",
}
export type iDate = {
    year: string | null,
    time: string | null
}
export type line = {
    index: number
    date: iDate
    category: string
    type: string //: crear enum
    value: string
    extra: string | null
}
>>>>>>> 3fca83365d5c3ec3f361c1fee0c7a04a1e25eb80
