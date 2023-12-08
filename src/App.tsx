import { useRef, useState } from "react";
import "./App.css";
import { EVENT, iDate, iLine, iSession, iSessionEvent } from "./types";
import Card from "./components/Card";
import { GeneralRegEx, ID, START, sessionEvent } from "./utils/regexp";

const dateMatcher = (line: string): iDate => {
  const year = line.match(/\d{4}-\d{2}-\d{2}/g);
  const time = line.match(/\d{2}:\d{2}:\d{2}.\d{4}/g);
  return {
    year: year ? year[0] : null,
    time: time ? time[0] : null,
  };
};

const categoryMatcher = (line: string): string => {
  const r = line.match(/\[ERROR\] |\[\w.\] |(\[(WebApp|StoreAction) :)/gi);
  return r ? r[0].slice(1, -2) : "SIN CATEGORIA";
};

const typeMatcher = (line: string): string => {
  const r = line.match(/: [\w.]*\]/gi);
  return r ? r[0].slice(2, -1) : "SIN TIPO";
};

const valueMatcher = (line: string): string => {
  const r = line.split(/\[\w* : [\w.]*\]/gi);
  return r.length >= 2 ? r[1].trimStart() : line;
};

function App() {
  const [file, setFile] = useState<File>();
  const [lines, setLines] = useState<iLine[]>();
  const [original, setOriginal] = useState<iLine[]>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [opId, setOpId] = useState<string>();
  const [sessions, setSessions] = useState<iSession[]>();

  const load = (files: FileList | null) => {
    if (!files) return;
    const file = files[0];
    setFile(file);

    console.log("File Loaded");
  };

  const processFile = (): void => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file, "utf-8");

    reader.onload = evt => {
      const result = evt?.target?.result;
      console.log("File reader:", result ? "succeed" : "failed");

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

                sessionEvents.push({
                  type,
                  index: index,
                  value,
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
          indexes: {
            init: null,
            close: null,
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
                indexes: {
                  init: null,
                  close: null,
                },
              };
            }
            // Comenzar sesion nueva
            aux.indexes.init = event.index;
          }

          if (event.type === EVENT.close) {
            aux.indexes.close = event.index;
            sessions.push(aux);
            // Reinicia
            aux = {
              id: [],
              indexes: {
                init: null,
                close: null,
              },
            };
          }
        });

        console.log("lines", lines.length);
        console.log("sessions", sessions.filter(s => s.indexes.init && s.indexes.close).length);
        console.log("--------");

        setLines(lines);
        setOriginal(lines);
        setSessions(sessions);
      }
    };
  };

  const selectSessionByID = () => {
    if (!opId || !sessions || !original) return;
    if (!ID.test(opId)) {
      console.warn(`ID debe constar de 21 caracteres numericos. ID: ${opId}, length: ${opId.length}`);
      return;
    }

    console.log("sessions", sessions);
    console.log("original", original.length);
    // Busca el index de la primera aparición de la ID
    const sessionIndexes = sessions.find(session => session.id.includes(opId));
    if (!sessionIndexes) {
      console.warn("Operation ID no encontrada");
      return;
    }
    if (!sessionIndexes.indexes.init || !sessionIndexes.indexes.close) {
      console.warn("Operation ID asignada fuera de sesiones");
      return;
    }
    console.log("sessionIndexes", sessionIndexes);

    // Recorta de los logs originales
    const { init, close } = sessionIndexes.indexes;
    const newLines = original.slice(init, close);
    setLines(newLines);
    console.log("newLines", newLines);
  };

  const handleRemove = () => {
    setFile(undefined);
    setLines(undefined);
  };

  return (
    <>
      <section className="header">
        <h1 className="title">unLogger</h1>

        <div>
          <input
            ref={inputRef}
            type="file"
            name="file-input"
            id="file-input"
            accept=""
            multiple={false}
            onChange={e => load(e.target.files)}
            style={{ display: "none" }}
          />
          {!file && (
            <button onClick={() => inputRef.current?.click()} disabled={!!file}>
              cargar
            </button>
          )}
          {file && (
            <button onClick={processFile} disabled={!file}>
              procesar
            </button>
          )}
          {file && (
            <p className="pointer" onClick={handleRemove}>
              log {file?.name} ❌
            </p>
          )}
        </div>

        <div>
          <input type="text" placeholder="Operation ID" onChange={e => setOpId(e.target.value)} />
          <button disabled={!file} onClick={selectSessionByID}>
            recortar
          </button>
        </div>
      </section>

      <section className="logContainer">
        {lines && (
          <div style={{ textAlign: "left" }}>
            {lines.map((line, i) => (
              <Card lineData={line} key={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default App;
