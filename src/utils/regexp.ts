/** filtro RegEx general */
export const GeneralRegEx = new RegExp(
    /\[(webapp|storeaction) : [\w.]*\] (?!\{|key=|setContext:|WaitingView|<Too long>|emit:|restartPantallaEnBlancoTimeout()|HBInterval|Refused)/gi
);
/** Eventos de sesion: initiateSession, sessionClose!, Op. ID. */
export const sessionEvent = new RegExp(/^sessionClosed!$|^initiateSession$|^\d{21}$/gi);
/** Evento de sesión: initiateSession */
export const START = new RegExp(/^initiateSession$/gi);
/** Evento de sesión: Operation Id (21 dígitos) */
export const ID = new RegExp(/^"?\d{21}"?$/);
/** Detecta el endpoint de la url de una request, incluye o no una posible ID pasada como parametro */
// eslint-disable-next-line
export const endpoint = new RegExp(/[\/ode]*\/[\w\-]+[\/\d]*$/gm);
