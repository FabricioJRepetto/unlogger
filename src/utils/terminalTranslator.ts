export const terminalTranslator = (terminalID: string): string => {
  switch (terminalID) {
    case "0505" || "512":
      return terminalID + " BNA";
    case "0503" || "0504":
      return terminalID + " BRM";
    case "0509" || "505":
      return terminalID + " GBRU";
    case "0515":
      return terminalID + " ITM";
    case "0500" || "0513":
      return terminalID + " SR";

    default:
      return "X";
  }
};

/*
 BNA 0505 512
 BRM 0503 0504
 GBRU 0509 505
 ITM 0515
 SR 0500 0513
 */
