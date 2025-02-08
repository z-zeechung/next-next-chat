import * as Comlink from 'comlink';
import {initPyodide} from './init-pyodide.js'

let pyodide
initPyodide((p)=>{
    pyodide = p
})

function waitUntilLoaded() {
    return new Promise((resolve, reject) => {
        const checkPyodide = () => {
            if (pyodide !== undefined) {
                pyodide.setStdout({ batched: (msg) => {} });
                resolve(pyodide);
            } else {
                setTimeout(checkPyodide, 100);
            }
        };
        checkPyodide();
    });
}

const functions = {
    async runPythonScript(code){
        const pyodide = await waitUntilLoaded();
        let output = ""
        pyodide.setStdout({ batched: (msg) => output += msg + "\n" });
        await pyodide.runPythonAsync(code);
        return output
    }
}

Comlink.expose(functions);