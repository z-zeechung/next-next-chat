export async function initPyodide(setPyodide){
    await importScripts('/pyodide/pyodide/pyodide.js');
    const pyodide = await loadPyodide()
    // const tgz = new Uint8Array(await (await (await fetch("/pyodide/pyodide-packages.tar.gz")).blob()).arrayBuffer())
    // pyodide.FS.writeFile("/pyodide-packages.tar.gz", tgz)
    // await pyodide.runPythonAsync(`
    //     import tarfile
    //     import os
    //     with tarfile.open('/pyodide-packages.tar.gz', 'r:gz') as tar:
    //         tar.extractall(path='/')
    // `)
    setPyodide(pyodide)
}