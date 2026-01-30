import React, { useState, DragEvent, useRef } from "react";
import { IoFileTrayOutline, IoFileTrayFullOutline } from "react-icons/io5";

interface Props {
    file: boolean;
    loading: boolean;
    setFile: (file: File | undefined) => void;
    process: () => void;
    clear: () => void;
    fileName: string | undefined;
}

const DragNDrop: React.FunctionComponent<Props> = ({ setFile, process, clear, file, loading, fileName }) => {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const dropHandler = (e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (file) clear();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const type = file.name.split(".").pop();
            console.log("Droped file type:", type);

            if (type !== "log") {
                setError(`¿${type}? Dame un .log`);
                setTimeout(() => {
                    setError(() => "");
                }, 3000);
            } else {
                loadOnDrop(file);
            }
        }
    };

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

    // input: para la funcionalidad del botón 'subir archivo'
    // section: Componente para la funcionalidad 'Drag-n-drop'
    return (
        <>
            <input
                ref={inputRef}
                type="file"
                name="file-input"
                id="file-input"
                multiple={false}
                onChange={e => load(e.target)}
                style={{ display: "none" }}
            />
            <section
                className={`dragNdropZone ${dragActive ? "dragging" : ""} ${loading ? "dragNdropProcessing" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={dropHandler}
            >
                {file ? <IoFileTrayFullOutline /> : <IoFileTrayOutline />}
                {!loading && !file && !error && <p>Drag 'n Drop</p>}
                {error && <p style={{ color: "#ed2f55" }}>{error}</p>}
                {fileName && file && <p>{fileName}</p>}
                <div>
                    {!file && !loading && <button onClick={() => inputRef.current?.click()}>Subir Archivo</button>}
                    {file && !loading && <button onClick={process}>Procesar</button>}
                    {loading && <p className="loadingText">PROCESANDO ARCHIVO</p>}
                </div>
            </section>
        </>
    );
};

export default DragNDrop;
