import { FunctionComponent, MutableRefObject } from "react";
import { iLine, iSession, logData } from "../types";

interface Props {
    file: File | undefined;
    original: iLine[] | undefined;
    loading: boolean;
    sessions: iSession[] | undefined;
    logData: MutableRefObject<logData | null | undefined>;
    clearHandler: () => void;
    searchByID: () => void;
    setOpId: (e: string) => void;
}
const Header: FunctionComponent<Props> = ({
    file,
    original,
    loading,
    sessions,
    clearHandler,
    logData,
    searchByID,
    setOpId,
}) => {
    return (
        <section className="header">
            <h1 className="title">unLogger</h1>

            <div>
                {file && original && !loading && (
                    <div className="fileData">
                        <p>
                            {logData.current?.sucursal || "-"} / {logData.current?.terminal || "-"}
                        </p>
                        <p>{logData.current?.date || "-"}</p>
                    </div>
                )}
            </div>

            {file && !loading && <button onClick={clearHandler}>clear ❌</button>}
            {sessions && (
                <div>
                    <>
                        <input type="text" placeholder="Operation ID" onChange={e => setOpId(e.target.value)} />
                        <button disabled={!file} onClick={searchByID}>
                            buscar sesion
                        </button>
                    </>
                </div>
            )}
        </section>
    );
};

export default Header;
