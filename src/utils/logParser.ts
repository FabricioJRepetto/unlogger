import { iDate, line } from "../types"

const dateMatcher = (line: string): iDate => {
    const year = line.match(/\d{4}-\d{2}-\d{2}/g)
    const time = line.match(/\d{2}:\d{2}:\d{2}.\d{4}/g)
    return {
        year: year ? year[0] : null,
        time: time ? time[0] : null    
    }
}

const categoryMatcher = (line: string): string => { 
    const r = line.match(/\[ERROR\] |(\[[\w.]+ :)/gi)
    return r ? r[0].slice(1,-2) : "SIN CATEGORIA"
}

const typeMatcher = (line: string): string => { 
    const r = line.match(/: [\w.]+\]/gi)
    return r ? r[0].slice(2,-1) : "SIN TIPO"
}

const valueMatcher = (line: string): string => { 
    const r = line.split(/\[\w+ : [\w.]+\]/gi)
    return r.length >= 2 ? r[1].trimStart() : "SIN VALOR"
}
//TODO solo separar usos, filtrar aparte 
export const parseLog = (rawLog: string): line[] => {
    const startTime = Date.now()
    const uses: line[][] = []
    const lines: line[] = []
    rawLog.split('\n').map((line,i) => {
        // filtro RegEx inicial: /\[ERROR\]|(\[(WebApp|StoreAction) : (\w*)\])/gi
        const excluded = /(RpcClient|Bootstrapper :|HBInterval|"heartBeatEvent"|WebSocket message receipt|restartPantallaEnBlancoTimeout|hbinter|refused to excecute script from)/gi.test(line)
        const accepted = /\[error\]|\[[\w.]+ : [\w. ]+\]/gi.test(line)
        
        if (!excluded && accepted) {
            const date = dateMatcher(line),
                category = categoryMatcher(line),
                type = typeMatcher(line);
            let value = valueMatcher(line),
                extra = null;
            
            if (category === 'Connection' && type === 'send') {
                const newValue = value.match(/\{"name":"\w+/gi)
                const id = value.match(/"id":"[\w-]+/gi)
                value = (newValue && id) 
                    ? newValue[0].replace(/(\{"name":")|"\}/gi, '') + ' (' + id[0].replace(/("id":")/gi, '') + ')' 
                    : value
                extra = value
            }

            const temp = {
                index: i,
                date,
                category,
                type,
                value,
                extra
            }
            lines.push(temp)
        }
    })
    
    console.log(`Returned ${lines.length} lines in ${(Date.now() - startTime) / 1000} seconds`);
    return lines.slice(0,1000)
}