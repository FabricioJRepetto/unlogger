import { useState } from 'react';
import './App.css'

function App() {
    const [file, setFile] = useState<File | FileList>()

    const base64 = (file: File) => { 
        const reader = new FileReader()
        reader.readAsDataURL(file)
         reader.onload = function () {
            console.log(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const loadfile = (files: FileList | null): void => {
        if (files && files[0]) {
            const file = files[0]

            setTimeout(() => {
                setFile(file)
                base64(file)
            }, 500);
        }
    }

    return (
        <>     
            <h1>UNLOGGER</h1>
            {/* <button>subir log</button> */}
            <input type="file" name="file-input" id="file-input" accept="text/x-log" multiple={false} onChange={(e) => loadfile(e.target.files)}/>
            {file && <p>cargado</p>}
        </>
    )
}

export default App
