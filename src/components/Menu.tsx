import { useState } from "react";
import { DEFAULT_REGEX } from "../utils/regexp";

const Menu = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`trayMenuContainer ${open ? "trayOpen" : ""}`}>
            <button className="trayMenuToggleButton" onClick={() => setOpen(p => !p)}>
                {open ? ">" : "<"}
            </button>
            <div className="trayMenuContent">
                <pre>{DEFAULT_REGEX.GeneralRegEx}</pre>
            </div>
        </div>
    );
};

export default Menu;
