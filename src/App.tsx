import { useState } from 'react';
import './App.css'

enum CATEGORY {
    WEBAPP = "WebApp",
    STOREACTION = "StoreAction",
    CONNECTION = "Connection",
}
type iDate = {
        year: string | null,
        time: string | null
    }
type line = {
    index: number
    date: iDate
    category: string
    type: string //: crear enum
    value: string
    extra?: string
}

const dateMatcher = (line: string): iDate => {
    const year = line.match(/\d{4}-\d{2}-\d{2}/g)
    const time = line.match(/\d{2}:\d{2}:\d{2}.\d{4}/g)
    return {
        year: year ? year[0] : null,
        time: time ? time[0] : null    
    }
}

const categoryMatcher = (line: string): string => { 
    const r = line.match(/\[ERROR\] |(\[(WebApp|StoreAction) :)/g)
    return r ? r[0].slice(1,-2) : "SIN CATEGORIA"
}

const typeMatcher = (line: string): string => { 
    const r = line.match(/: \w*\]/g)
    return r ? r[0].slice(2,-1) : "SIN TIPO"
}

const valueMatcher = (line: string): string => { 
    const r = line.split(/\[\w* : \w*\]/g)
    return r.length >= 2 ? r[1].trimStart() : "SIN VALOR"
}

function App() {
    const [file, setFile] = useState<File>()
    const [text, setText] = useState<string>()
    const [lines, setLines] = useState<line[]>()

    const loadfile = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]
            const reader = new FileReader()
            setFile(file)
            
            reader.readAsText(file, 'utf-8');
            reader.onload = (evt) => {
                const result = evt?.target?.result
                console.log('event:', result ? 'succeed': 'failed');

                if (result && typeof(result) === 'string') {
                    setText(result)
                    // const lines = result.split('\n').filter(line => /\[(WebApp|StoreAction) : (\w*)\]/gi.test(line))
                    const lines: line[] = []
                    result.split('\n').map((line,i) => {
                        // filtro RegEx inicial
                        if (/\[ERROR\]|(\[(WebApp|StoreAction) : (\w*)\])/gi.test(line)) {
                            const date = dateMatcher(line),
                                category = categoryMatcher(line),
                                type = typeMatcher(line),
                                value = valueMatcher(line);

                            const temp = {
                                index: i,
                                date,
                                category,
                                type,
                                value
                            }
                            lines.push(temp)
                        }
                    })

                    console.log('lines', lines.length)
                    setLines(lines)                    
                }
            };
            
        }
    }

    return (
        <>     
            <h1>UNLOGGER</h1>
            <input type="file" name="file-input" id="file-input" accept="" multiple={false} onChange={(e) => loadfile(e.target.files)}/>
            {file && <p>log {file?.name}</p>}
            {lines && <div style={{textAlign: "left"}}>{lines.map((l,i) => <p key={i}>{l.date.time} {l.category}({l.type}): {l.value}</p>)}</div>}
        </>
    )
}

export default App
