export enum CATEGORY {
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