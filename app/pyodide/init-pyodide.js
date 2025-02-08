import { remoteFS } from "./remote-fs"

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
    let mountDir = "/mnt";
    pyodide.FS.mkdirTree(mountDir);
    pyodide.FS.mount(remoteFS(pyodide, mountDir, "/pyodide/python3.11"), { root: "." }, mountDir);
    console.log(pyodide.FS.readFile("/mnt/site-packages/aiohttp/__init__.py", { encoding: "utf8" }));
    setPyodide(pyodide)
}