function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = ()=>resolve();
        script.onerror = reject;
        document.head.append(script);
    });
}

var pyodide = undefined

function syncPyodideFS(populate){
    return new Promise(async (resolve, reject) => {
        await pyodide.FS.syncfs(populate, function (err) {
            resolve()
        });
    })
}

async function loadZip(zipfile){
    let zipResponse = await fetch(`/pyodide/${zipfile}.zip`);
    let zipBinary = await zipResponse.arrayBuffer();
    await pyodide.unpackArchive(zipBinary, "zip");
}

/**
 * 
 * @param {(pyodide)=>void} cb
 */
export async function runPyodide(cb, syncfs=false){
    if(!pyodide){
        await loadScript("https://cdn.jsdelivr.net/pyodide/v0.26.3/full/pyodide.js");
        pyodide = await loadPyodide();
        pyodide.FS.mount(pyodide.FS.filesystems.IDBFS, {}, "/lib/python3.12/site-packages");
        await syncPyodideFS(true);
        await pyodide.loadPackage("micropip")
        await loadZip("ssl")
        await syncPyodideFS(false);
    }
    if(syncfs){await syncPyodideFS(true);}
    await cb(pyodide)
    if(syncfs){await syncPyodideFS(false);}
}