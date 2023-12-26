export const terminalTranslator = (terminalID: string): string => {
    switch (terminalID) {
        case "505" || "512":
            return terminalID + " BNA";
        case "503" || "504":
            return terminalID + " BRM";
        case "509" || "505":
            return terminalID + " GBRU";
        case "515":
            return terminalID + " ITM";
        case "500" || "513":
            return terminalID + " SR";
        case "511":
            return terminalID + " ATM";

        default:
            return "???";
    }
};

/*
 BNA 0505 512
 BRM 0503 0504
 GBRU 0509 505
 ITM 0515
 SR 0500 0513
 ATM 511
 */
