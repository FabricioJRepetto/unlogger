import { FunctionComponent, useState } from "react";
import { iLine } from "../types";
import Card from "./Card";
import { iconSelector } from "../utils/iconSelector";
import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { curlType } from "../utils/curlType";
import { endpointParser } from "../utils/endpointParser";
import { endpoint } from "../utils/regexp";
import { curlParser } from "../utils/curlParser";
interface Props {
    lines: iLine[];
}
interface request {
    method: string;
    url: string;
    endpoint: string;
    data?: string;
    headers: string;
}

const LogContainer: FunctionComponent<Props> = ({ lines }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [request, setValue] = useState<request>();

    const handleOpenValue = (value: string): void => {
        try {
            const method = curlType(value);
            const url = endpointParser(value);
            const endp = url.match(endpoint);
            const { headers, data } = curlParser(value);

            const req = {
                method,
                url,
                endpoint: endp ? endp[0] : "???",
                data,
                headers,
            };
            setValue(req);
            setOpen(true);
        } catch (error) {
            console.log(value);
            console.error(error);
        }
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
                    <pre>{"{"}</pre>
                    <span>
                        <pre>headers: {request?.headers}</pre>
                        {request?.data && <pre>data: {request.data}</pre>}
                    </span>
                    <pre>{"}"}</pre>
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
