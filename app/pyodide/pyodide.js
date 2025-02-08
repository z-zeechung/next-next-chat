import PyodideWorker from "./pyodide.worker.js"
import * as Comlink from 'comlink';


const worker = new PyodideWorker();

const remoteFunctions = Comlink.wrap(worker);

export function runPythonScript(code){
    return remoteFunctions.runPythonScript(code)
}