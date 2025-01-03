import PyodideWorker from "./pyodide.worker.js"
import * as Comlink from 'comlink';


const worker = new PyodideWorker();

const remoteFunctions = Comlink.wrap(worker);

let funcs: Function[] = []

const localFunctions = {
    invoke(name, args, kwargs){
        const func = funcs.find(func=>func.name===name)
        if(func){
            return func(...args, ...Object.values(kwargs))
        }
    }
};

Comlink.expose(localFunctions, worker);

export async function runPyodide(code: string, functions: Function[] = []){
    funcs = functions
    await remoteFunctions.runPyodide(code, functions.map(func=>func.name))
}