import React, { useState, DragEvent } from "react";
import { IoFileTrayOutline, IoFileTrayFullOutline } from "react-icons/io5";

interface Props {
  file: boolean;
  loading: boolean;
  load: () => void;
  loadOnDrop: (file: File | null) => void;
  process: () => void;
  clear: () => void;
  fileName: string | undefined;
}

const DragNDrop: React.FunctionComponent<Props> = ({ load, loadOnDrop, process, clear, file, loading, fileName }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

  return (
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
        {!file && !loading && <button onClick={load}>Subir Archivo</button>}
        {file && !loading && <button onClick={process}>Procesar</button>}
        {loading && <p className="loadingText">PROCESANDO ARCHIVO</p>}
      </div>
    </section>
  );
};

export default DragNDrop;
