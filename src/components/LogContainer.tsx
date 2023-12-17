import { FunctionComponent, useState } from "react";
import { iLine } from "../types";
import Card from "./Card";
import { iconSelector } from "../utils/iconSelector";
import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { curlType } from "../utils/curlType";
import { endpointParser } from "../utils/endpointParser";
import { endpoint } from "../utils/regexp";
interface Props {
    lines: iLine[];
}
interface request {
    method: string;
    url: string;
    endpoint: string;
    data: string;
}
const LogContainer: FunctionComponent<Props> = ({ lines }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [request, setValue] = useState<request>();

    const handleOpenValue = (value: string): void => {
        const method = curlType(value);
        const url = endpointParser(value);
        const endp = url.match(endpoint);
        const data = value.split("--data '")[1].slice(0, -1);
        const obj = JSON.parse(data);
        const pretty = JSON.stringify(obj, undefined, 4);

        const req = {
            method,
            url,
            endpoint: endp ? endp[0] : "",
            data: pretty,
        };
        setValue(req);
        setOpen(true);
    };

    const copyHandler = () => {
        request?.data && navigator.clipboard.writeText(request.data);
    };

    return (
        <section className="logContainer">
            <div className={open ? "valueModal" : "hidden"} onClick={() => setOpen(false)}>
                <div
                    onClick={e => e.stopPropagation()}
                    onMouseUp={e => e.stopPropagation()}
                    className="valueModalContent"
                >
                    <div className="valueModalButtons">
                        <HiMiniDocumentDuplicate className="pointer" onClick={copyHandler} />
                        <IoClose className="pointer" onClick={() => setOpen(false)} />
                    </div>
                    <p className={request?.method}>{request?.method}</p>
                    <p>
                        {request?.url.replace(endpoint, "")}
                        <b className={request?.method}>{request?.endpoint}</b>
                    </p>
                    <pre>{request?.data}</pre>
                </div>
            </div>
            <div style={{ textAlign: "left" }}>
                {lines.map((line, i) => (
                    <Card
                        lineData={line}
                        key={i}
                        icon={iconSelector(line.type, line.category)}
                        openValue={() => handleOpenValue(line.value)}
                    />
                ))}
            </div>
        </section>
    );
};

export default LogContainer;
