import { iDate } from "../types";

export const dateMatcher = (line: string): iDate => {
    const year = line.match(/\d{4}-\d{2}-\d{2}/g);
    const time = line.match(/\d{2}:\d{2}:\d{2}.\d{4}/g);
    return {
        year: year ? year[0] : null,
        time: time ? time[0] : null,
    };
};

export const categoryMatcher = (line: string): string => {
    const r = line.match(/\[ERROR\] |\[\w.\] |(\[(WebApp|StoreAction) :)/gi);
    return r ? r[0].slice(1, -2) : "SIN CATEGORIA";
};

export const typeMatcher = (line: string): string => {
    const r = line.match(/: [\w.]*\]/gi);
    if (r) {
        return r[0].slice(2, -1);
    } else if (line.match(/\[ERROR\]/gi)) {
        return "ERROR";
    } else {
        return "SIN TIPO";
    }
};

export const valueMatcher = (line: string): string => {
    const r = line.split(/\[\w* : [\w.]*\]/gi);
    return r.length >= 2 ? r[1].trimStart() : line;
};
