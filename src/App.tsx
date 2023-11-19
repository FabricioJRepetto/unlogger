import { useState } from 'react';
import './App.css'
import { line } from './types';
import { parseLog } from './utils/logParser';

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
                    const lines = parseLog(result)
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
