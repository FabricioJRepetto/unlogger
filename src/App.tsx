import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { iLine, iSession, logData } from "./types";
import Card from "./components/Card";
import { ID } from "./utils/regexp";
import SessionsBanner from "./components/SessionsBanner";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [lines, setLines] = useState<iLine[]>();
  const [original, setOriginal] = useState<iLine[]>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [opId, setOpId] = useState<string>();
  const [sessions, setSessions] = useState<iSession[]>();
  const worker: Worker = useMemo(
    () => new Worker(new URL("./worker/WebWorker.ts", import.meta.url), { type: "module" }),
    []
  );
  const logData = useRef<logData | null>();

  useEffect(() => {
    if (window.Worker) {
      worker.onmessage = e => {
        const { lines, sessions, data } = e.data;

        if (lines.length && sessions.length) {
          console.log("   @ Main: Message received");
          setLines(lines);
          setOriginal(lines);
          setSessions(sessions);
          logData.current = data;

          setLoading(false);
        }
      };
    }
  }, [worker, logData]);

  const load = (files: FileList | null) => {
    if (!files) return;
    const file = files[0];
    setFile(file);

    console.log("File Loaded");
  };

  const processFile = (): void => {
    try {
      if (!file || !worker) {
        console.log("No hay Worker o file");
        return;
      }

      setLoading(true);
      worker.postMessage(file);
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  };

  const selectSessionByID = () => {
    if (!opId || !sessions || !original) return;
    if (!ID.test(opId)) {
      console.warn(`ID debe constar de 21 caracteres numericos. ID: ${opId}, length: ${opId.length}`);
      return;
    }

    // Busca el index de la primera aparición de la ID
    const sessionData = sessions.find(session => session.id.includes(opId));
    if (!sessionData) {
      console.warn("Operation ID no encontrada");
      return;
    }
    if (!sessionData.init.index || !sessionData.close.index) {
      console.warn("Operation ID asignada fuera de sesiones");
      return;
    }
    console.log("sessionData", sessionData);

    // Recorta de los logs originales
    const {
      init: { index: init },
      close: { index: close },
    } = sessionData;
    if (init && close) {
      const newLines = original.slice(init, close);
      setLines(newLines);
    }
  };

  const handleSelectSession = (index: number) => {
    if (!sessions || !original) return;

    const sessionData = sessions[index];
    if (!sessionData) return;

    const {
      init: { index: init },
      close: { index: close },
    } = sessionData;

    if (!init || !close) {
      console.warn("Sesión sin inicio o sin final");
      return;
    }

    // Recorta de los logs originales
    if (init && close) {
      const newLines = original.slice(init, close);
      setLines(newLines);
    }
  };

  const handleRemove = () => {
    setOriginal(undefined);
    setFile(undefined);
    setLines(undefined);
  };

  return (
    <>
      <div className="glow"></div>
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
          {file && !original && !loading && (
            <button onClick={processFile} disabled={!file}>
              procesar
            </button>
          )}
          {loading && <p className="loadingText">PROCESANDO ARCHIVO</p>}
          {file && original && !loading && (
            <div className="fileData">
              <p>
                Sucursal: {logData.current?.sucursal || "-"} Terminal: {logData.current?.terminal || "-"}
              </p>
              <p>{logData.current?.date || "-"}</p>
            </div>
          )}
        </div>

        {file && !loading && <button onClick={handleRemove}>clear ❌</button>}

        <div>
          <input type="text" placeholder="Operation ID" onChange={e => setOpId(e.target.value)} />
          <button disabled={!file} onClick={selectSessionByID}>
            recortar
          </button>
        </div>
      </section>

      {sessions && (
        <>
          <div className="SessionsBannerHeader">
            <b className="SessionsBannerTitle">Sesiones</b>
            <p className="SessionsBannerDescription">scroll horizontal: shift + mouse wheel</p>
          </div>
          <SessionsBanner sessions={sessions} handler={handleSelectSession} />
        </>
      )}

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
