/* eslint-disable no-restricted-globals */
import { EVENT, iLine, iSession, iSessionEvent, logData } from "../types";
import { idParser } from "../utils/idParser";
import { categoryMatcher, dateMatcher, typeMatcher, valueMatcher } from "../utils/logParserFilters";
import { GeneralRegEx, ID, START, sessionEvent } from "../utils/regexp";

/** Arma una lista de lineas {@link iLine} y sesiones {@link iSession} filtrando el log en base a un RegExp {@link GeneralRegEx} */
self.onmessage = e => {
    console.log("   @ Worker");

    if (!e) return;

    console.log("#####  Parsing File  #####");
    const startTime = Date.now();

    const file = e.data;
    let logData: logData;
    const reader = new FileReader();
    reader.readAsText(file, "utf-8");

    reader.onload = evt => {
        const result = evt?.target?.result;
        console.log("   # File reader:", result ? "succeed" : "failed");

        if (result && typeof result === "string") {
            const lines: iLine[] = [];
            const sessionEvents: iSessionEvent[] = [];
            let index = 0;

            result.split("\n").forEach(line => {
                try {
                    line = line.replace(/[\r]+/g, "");
                    if (GeneralRegEx.test(line)) {
                        const date = dateMatcher(line),
                            category = categoryMatcher(line),
                            type = typeMatcher(line),
                            value = valueMatcher(line).replace(/[\r]/g, "");

                        if (sessionEvent.test(value)) {
                            const type = START.test(value) ? EVENT.init : ID.test(value) ? EVENT.OpID : EVENT.close;

                            if (!logData && type === EVENT.OpID) logData = idParser(value);

                            sessionEvents.push({
                                type,
                                index: index,
                                value,
                                date,
                            });
                        }

                        lines.push({
                            index: index,
                            date,
                            category,
                            type,
                            value,
                        });
                        index++;
                    }
                } catch (error) {
                    console.error(error);
                }
            });

            // Prepara una lista de sesiones basado en los eventos registrados en sessionEvents
            const sessions: iSession[] = [];
            let aux: iSession = {
                id: [],
                init: {
                    index: null,
                    date: null,
                },
                close: {
                    index: null,
                    date: null,
                },
            };
            sessionEvents.forEach(event => {
                if (event.type === EVENT.OpID) {
                    aux.id.push(event.value);
                }

                if (event.type === EVENT.init) {
                    // Si hay Ids guardadas, son entre sesiones
                    if (aux.id.length) {
                        // Terminar/guardar sesion anterior
                        sessions.push(aux);
                        // Reinicia
                        aux = {
                            id: [],
                            init: {
                                index: null,
                                date: null,
                            },
                            close: {
                                index: null,
                                date: null,
                            },
                        };
                    }
                    // Comenzar sesion nueva
                    aux.init.index = event.index;
                    aux.init.date = event.date;
                }

                if (event.type === EVENT.close) {
                    aux.close.index = event.index;
                    aux.close.date = event.date;
                    sessions.push(aux);
                    // Reinicia
                    aux = {
                        id: [],
                        init: {
                            index: null,
                            date: null,
                        },
                        close: {
                            index: null,
                            date: null,
                        },
                    };
                }
            });

            console.log("   # lines", lines.length);
            console.log("   # sessions", sessions.filter(s => s.init.index && s.close.index).length);
            console.log(`   # elapsed ${(Date.now() - startTime) / 1000} s.`);
            console.log("#####  ############  #####");

            self.postMessage({
                data: logData,
                lines,
                sessions,
            });
        }
    };

    self.postMessage({
        data: null,
        lines: [],
        sessions: [],
    });
};

export {};
