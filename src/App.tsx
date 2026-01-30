import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { iLine, iSession, logData } from "./types";
import { ID } from "./utils/regexp";
import SessionsBanner from "./components/SessionsBanner";
import DragNDrop from "./components/DragNDrop";
import LogContainer from "./components/LogContainer";
import Header from "./components/Header";
import Menu from "./components/Menu";

function App() {
    const [loading, setLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File>();
    const [lines, setLines] = useState<iLine[]>();
    const [original, setOriginal] = useState<iLine[]>();
    const [opId, setOpId] = useState<string>();
    const [sessions, setSessions] = useState<iSession[]>();
    const worker: Worker = useMemo(
        () => new Worker(new URL("./worker/WebWorker.ts", import.meta.url), { type: "module" }),
        [],
    );
    const logData = useRef<logData | null>();

    useEffect(() => {
        if (window.Worker) {
            worker.onmessage = e => {
                const { lines, sessions, data } = e.data;

                if (lines.length) {
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

    // const load = (files: FileList | null) => {

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

    const handleSelectSession = (index: number | null) => {
        if (!sessions || !original) return;
        if (index === null) {
            setLines(original);
            return;
        }

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

    const clearHandler = () => {
        setOriginal(undefined);
        setFile(undefined);
        setLines(undefined);
        setSessions(undefined);
        setOpId(undefined);
        logData.current = null;
    };

    return (
        <>
            <Menu />

            <Header
                file={file}
                original={original}
                loading={false}
                sessions={sessions}
                logData={logData}
                clearHandler={clearHandler}
                searchByID={selectSessionByID}
                setOpId={e => setOpId(e)}
            />

            {!lines && (
                <DragNDrop
                    setFile={(f: File | undefined) => setFile(f)}
                    process={processFile}
                    clear={clearHandler}
                    file={!!file && !original}
                    loading={loading}
                    fileName={file?.name}
                />
            )}

            <SessionsBanner sessions={sessions} handler={handleSelectSession} />
            <LogContainer lines={lines} />
        </>
    );
}

export default App;
