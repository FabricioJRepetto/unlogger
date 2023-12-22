export const curlParser = (value: string) => {
    const keyValues = value.split(/ -H | --data /);
    let data: string | undefined = undefined;

    // Remove first element: "curl -X GET "build.json""
    keyValues.shift();

    if (/--data/.test(value)) {
        // Remove last element: "--data {...}" and prettify it
        keyValues.pop();

        const aux = value.split("--data '")[1].slice(0, -1) || "???";
        const obj = JSON.parse(aux);
        const pretty = JSON.stringify(obj, undefined, 4);
        data = pretty;
    }

    const headers: Record<string, string> = {};
    keyValues.forEach(knv => {
        const aux = knv.replaceAll('"', "").split(":");
        const key = aux[0];
        const value = aux[1];

        // Hide JWTokens
        headers[key] = key === "Authorization" ? "Bearer [TOKEN]" : value;
    });
    const prettyHeaders = JSON.stringify(headers, undefined, 4);

    return { headers: prettyHeaders, data };
};

// const str = `curl -X GET "build.json" -H "id_channel:terminal_autoservicio" -H "Content-Type:application/json" -H "id_operation:008105042311240000651" -H "origen_fecha_hora:2023-11-24T03:07:21-03:00" -H "origen_terminal:504" -H "origen_organizacion_id:081" -H "origen_organizacion_tipo:SU" -H "kiosko_id:081504" -H "equipo_ip:10.3.2.28" -H "equipo_nombre:T0810504H" -H "session_id:94391f58-1666-4095-abb9-1f57a087dc80" -H "caller:webApp" --data '{"software":[{"name":"TerminalServices","version":"4.0.20.0","description":"NCR Services for Terminal Application","type":"plataform"},{"name":"TerminalAgent","version":"1.2.0.0","description":"NCR Agent for Terminal Application","type":"plataform"},{"name":"TerminalClient","version":"1.0.6.0","description":"NCR Browser for Terminal Application","type":"plataform"},{"name":"XfsServices","version":"1.2.1.0","description":"XFS Services","type":"plataform"},{"name":"TerminalApplication","version":"0.2.10","description":"Terminal Application for Banco Galica","type":"plataform"},{"name":"softyAppCliente","version":"0.2.1","description":"softyAppCliente","current":true,"type":"web"},{"name":"softyAppSupervisor","version":"0.2.0","description":"softyAppSupervisor","current":false,"type":"web"},{"name":"mainApp","version":"0.0.6","description":"mainApp","current":false,"type":"web"}],"hardware":[{"state":"ONLINE","id":"pin","name":"PIN Pad","deviceClass":"PIN"},{"state":"ONLINE","id":"idc","name":"Motorized Card Reader","deviceClass":"IDC"},{"state":"ONLINE","id":"ctls","name":"Contactless Card Reader","deviceClass":"IDC"},{"state":"ONLINE","id":"cim","name":"Cash In Module","deviceClass":"CIM"},{"state":"NODEVICE","id":"cdm","name":"Cash Dispenser","deviceClass":"CDM"},{"state":"ONLINE","id":"cdm2","name":"Cash Recycler","deviceClass":"CDM"},{"state":"NODEVICE","id":"ipm","name":"Check Deposit","deviceClass":"IPM"},{"state":"NODEVICE","id":"dpm","name":"Check Document Processor","deviceClass":"PTR"},{"state":"HWERROR","id":"ptr","name":"Receipt Printer","deviceClass":"PTR"},{"state":"ONLINE","id":"bptr","name":"Barcode Reader","deviceClass":"PTR"},{"state":"ONLINE","id":"vdm","name":"Vendor Dependent Mode","deviceClass":"VDM"},{"state":"ONLINE","id":"siu","name":"Siu Indicators","deviceClass":"SIU"}],"os":{"platform":"Win32NT","servicePack":"","version":"10.0.17763.0","versionString":"Microsoft Windows NT 10.0.17763.0"},"timeZone":{"Id":"Argentina Standard Time","DisplayName":"(UTC-03:00) City of Buenos Aires","StandardName":"Argentina Standard Time","DaylightName":"Argentina Daylight Time","BaseUtcOffset":"-03:00:00","AdjustmentRules":[{"DateStart":"2007-01-01T00:00:00","DateEnd":"2007-12-31T00:00:00","DaylightDelta":"01:00:00","DaylightTransitionStart":{"TimeOfDay":"0001-01-01T00:00:00","Month":12,"Week":5,"Day":1,"DayOfWeek":"Sunday","IsFixedDateRule":false},"DaylightTransitionEnd":{"TimeOfDay":"0001-01-01T00:00:00","Month":1,"Week":1,"Day":1,"DayOfWeek":"Monday","IsFixedDateRule":false},"BaseUtcOffsetDelta":"00:00:00","NoDaylightTransitions":false},{"DateStart":"2008-01-01T00:00:00","DateEnd":"2008-12-31T00:00:00","DaylightDelta":"01:00:00","DaylightTransitionStart":{"TimeOfDay":"0001-01-01T23:59:59.999","Month":10,"Week":3,"Day":1,"DayOfWeek":"Saturday","IsFixedDateRule":false},"DaylightTransitionEnd":{"TimeOfDay":"0001-01-01T00:00:00","Month":3,"Week":3,"Day":1,"DayOfWeek":"Sunday","IsFixedDateRule":false},"BaseUtcOffsetDelta":"00:00:00","NoDaylightTransitions":false},{"DateStart":"2009-01-01T00:00:00","DateEnd":"2009-12-31T00:00:00","DaylightDelta":"01:00:00","DaylightTransitionStart":{"TimeOfDay":"0001-01-01T00:00:00","Month":1,"Week":1,"Day":1,"DayOfWeek":"Thursday","IsFixedDateRule":false},"DaylightTransitionEnd":{"TimeOfDay":"0001-01-01T23:59:59.999","Month":3,"Week":2,"Day":1,"DayOfWeek":"Saturday","IsFixedDateRule":false},"BaseUtcOffsetDelta":"00:00:00","NoDaylightTransitions":false}],"SupportsDaylightSavingTime":true}}'`;
// const str2 = `curl -X GET "build.json" -H "id_channel:terminal_autoservicio" -H "Content-Type:application/json" -H "id_operation:008105042311240000651" -H "origen_fecha_hora:2023-11-24T03:07:21-03:00" -H "origen_terminal:504" -H "origen_organizacion_id:081" -H "origen_organizacion_tipo:SU" -H "kiosko_id:081504" -H "equipo_ip:10.3.2.28" -H "equipo_nombre:T0810504H" -H "session_id:94391f58-1666-4095-abb9-1f57a087dc80" -H "caller:webApp" --data '{"context":{},"device":{"counters":[{"binName":"Capture Bin","binNumber":1,"count":15,"idOperation":"010305012312130057751","mediaInCount":15,"mediaType":"Check"},{"binName":"Retract Bin","binNumber":2,"count":0,"idOperation":"010305012312130057751","mediaInCount":0,"mediaType":"Check"}],"deviceClass":"IPM"}}'`;
// console.log(curlParser(str));
