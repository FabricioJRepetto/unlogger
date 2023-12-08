import { EVENT, iDate, iLine, iSession, iSessionEvent, parsedResult } from "../types";
import { GeneralRegEx, ID, START, sessionEvent } from "./regexp";

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
  return r ? r[0].slice(2, -1) : "SIN TIPO";
};

export const valueMatcher = (line: string): string => {
  const r = line.split(/\[\w* : [\w.]*\]/gi);
  return r.length >= 2 ? r[1].trimStart() : line;
};

/** Arma una lista de lineas {@link iLine} y sesiones {@link iSession} filtrando el log en base a un RegExp {@link GeneralRegEx} */
export const parseLog = (file: File): parsedResult => {
  console.log("#####  Parsing File  #####");
  const startTime = Date.now();

  const reader = new FileReader();
  reader.readAsText(file, "utf-8");

  reader.onload = async evt => {
    const result = evt?.target?.result;
    console.log("   # File reader:", result ? "succeed" : "failed");

    if (result && typeof result === "string") {
      const lines: iLine[] = [];
      const sessionEvents: iSessionEvent[] = [];
      let index = 0;

      await result.split("\n").forEach(line => {
        try {
          line = line.replace(/[\r]+/g, "");
          if (GeneralRegEx.test(line)) {
            const date = dateMatcher(line),
              category = categoryMatcher(line),
              type = typeMatcher(line),
              value = valueMatcher(line).replace(/[\r]/g, "");

            if (sessionEvent.test(value)) {
              const type = START.test(value) ? EVENT.init : ID.test(value) ? EVENT.OpID : EVENT.close;

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

      return {
        lines,
        sessions,
      };
    }
  };

  return {
    lines: [],
    sessions: [],
  };
};
