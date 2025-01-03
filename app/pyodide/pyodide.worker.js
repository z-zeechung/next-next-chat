import * as Comlink from 'comlink';

const functions = {
    async runPyodide(code, funcs){
        await waitUntilLoaded()
        for(let func of funcs){
            pyodide.runPythonAsync(`
                async def ${func}(*args, **kwargs):
                    return await __invoke_js_function__("${func}", args, kwargs)
            `)
        }
        return pyodide.runPythonAsync(code)
    }
}

Comlink.expose(functions);

const mainFunctions = Comlink.wrap(self);


var pyodide = undefined

new Promise(async resolve=>{
    await importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js');
    const _pyodide = await loadPyodide()
    _pyodide.globals.set("__invoke_js_function__", (name, args, kwargs)=>{
        return mainFunctions.invoke(name, args.toJs(), Object.fromEntries(kwargs.toJs()))
    })
    const tgz = new Uint8Array(await (await (await fetch("/pyodide/pyodide-packages.tar.gz")).blob()).arrayBuffer())
    _pyodide.FS.writeFile("/pyodide-packages.tar.gz", tgz)
    await _pyodide.runPythonAsync(`
        import tarfile
        import os
        with tarfile.open('/pyodide-packages.tar.gz', 'r:gz') as tar:
            tar.extractall(path='/')
    `)
    pyodide = _pyodide
    resolve()
})

function waitUntilLoaded() {
    return new Promise((resolve, reject) => {
        const checkPyodide = () => {
            if (pyodide !== undefined) {
                resolve(pyodide);
            } else {
                setTimeout(checkPyodide, 200);
            }
        };
        checkPyodide();
    });
}