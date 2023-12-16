import { logData } from "../types";
import { terminalTranslator } from "./terminalTranslator";

export const idParser = (opid: string): logData => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const sucursal = opid.slice(0, 4);
  const terminal = opid.slice(4, 8);
  const year = "20" + opid.slice(8, 10);
  const month = opid.slice(10, 12);
  const day = opid.slice(12, 14);
  const date = new Date(`${year}-${month}-${day}`).toLocaleDateString("es-AR", options);

  return {
    sucursal: sucursal === "0075" ? sucursal + " QA" : sucursal + " Producción",
    terminal: terminalTranslator(terminal),
    date,
  };
};
