import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { iLine, iSession, logData } from "./types";
import { ID } from "./utils/regexp";
import SessionsBanner from "./components/SessionsBanner";
import DragNDrop from "./components/DragNDrop";
import LogContainer from "./components/LogContainer";

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

    //   const load = (files: FileList | null) => {
    const load = (eventTarget: EventTarget & HTMLInputElement) => {
        if (!eventTarget.files) return;
        const file = eventTarget.files[0];
        const type = file.name.split(".").pop();
        if (type !== "log") {
            console.warn("File type:", type, "not suported");
            return;
        } else {
            setFile(file);
            console.log("File Loaded");
        }
        eventTarget.value = "";
    };

    const loadOnDrop = (file: File | null) => {
        if (!file) return;
        const type = file.name.split(".").pop();
        if (type !== "log") {
            console.warn("File type:", type, "not suported");
            return;
        } else {
            setFile(file);
            console.log("File Loaded");
        }
        inputRef.current && (inputRef.current.value = "");
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
        setSessions(undefined);
        setOpId(undefined);
        logData.current = null;
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
                        multiple={false}
                        onChange={e => load(e.target)}
                        style={{ display: "none" }}
                    />

                    {file && original && !loading && (
                        <div className="fileData">
                            <p>
                                {logData.current?.sucursal || "-"} / {logData.current?.terminal || "-"}
                            </p>
                            <p>{logData.current?.date || "-"}</p>
                        </div>
                    )}
                </div>

                {file && !loading && <button onClick={handleRemove}>clear ❌</button>}
                <div>
                    {sessions && (
                        <>
                            <input type="text" placeholder="Operation ID" onChange={e => setOpId(e.target.value)} />
                            <button disabled={!file} onClick={selectSessionByID}>
                                buscar sesion
                            </button>
                        </>
                    )}
                </div>
            </section>

            {!lines && (
                <DragNDrop
                    load={() => inputRef.current?.click()}
                    loadOnDrop={(file: File | null) => loadOnDrop(file)}
                    process={processFile}
                    clear={handleRemove}
                    file={!!file && !original}
                    loading={loading}
                    fileName={file?.name}
                />
            )}

            {sessions && sessions.length > 0 && (
                <>
                    <SessionsBanner sessions={sessions} handler={handleSelectSession} />
                </>
            )}

            {lines && <LogContainer lines={lines} />}
        </>
    );
}

export default App;
