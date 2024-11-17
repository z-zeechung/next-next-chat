import { ClientApi } from "../client/api";
import { Button } from "../themes/theme";
import { runPyodide } from "../utils/pyodide";

export function TestPage() {
    return <Button onClick={async () => {
        runPyodide(pyodide=>{
            pyodide.globals.set("__chat__", ClientApi.chat);
            pyodide.runPythonAsync(`
                from pyodide.ffi import run_sync
                print(run_sync(__chat__()))
            `);
        })
    }} />;
}
