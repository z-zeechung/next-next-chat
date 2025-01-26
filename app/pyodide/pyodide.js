import PyodideWorker from "./pyodide.worker.js"
import * as Comlink from 'comlink';


const worker = new PyodideWorker();

const remoteFunctions = Comlink.wrap(worker);

/** 
 * @type {Function[]}
 */
let funcs = []

const localFunctions = {
    invoke(name, args, kwargs){
        const func = funcs.find(func=>func.name===name)
        if(func){
            return func(...args, ...Object.values(kwargs))
        }
    }
};

Comlink.expose(localFunctions, worker);

/**
 * 
 * @param {string} code 
 * @param {Function[]} functions 
 */
export async function runPyodide(code, functions = []){
    funcs = functions
    await remoteFunctions.runPyodide(code, functions.map(func=>func.name))
}