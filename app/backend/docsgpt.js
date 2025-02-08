/**
 * 
 * @param {"GET"|"PUT"|"POST"|"DELETE"|"OPTION"} method 
 * @param {string} route 
 * @param {string} payload 
 * @param {*} waitUntilLoaded 
 */
export async function docsgptRoute(method, route, payload, waitUntilLoaded){
    const pyodide = await waitUntilLoaded();
    if(pyodide.globals.get('dosc_gpt_client')==undefined){
        await pyodide.unpackArchive(await (await fetch("/3rd-party/docsgpt.zip")).arrayBuffer(), "zip");
        await pyodide.runPythonAsync(` 
import application.api.user.tasks
from application.worker import ingest_worker, remote_worker, sync_worker
from uuid import uuid4
TASK_META = None
class watcher:
    def __init__(self, id):
            self.id = id
    def update_state(self, state, meta):
            # print(self.id, state, meta)
            ...
class ingest:
    def delay(self, directory, formats, name_job, filename, user):
        id = uuid4()
        global TASK_META
        TASK_META = ingest_worker(watcher(id), directory, formats, name_job, filename, user)
        class task:
            def __init__(self):
                self.id = id
        return task()
application.api.user.tasks.ingest = ingest()

class ingest_remote:
     id = uuid4()
     def delay(self, source_data, job_name, user, loader):
        global TASK_META
        TASK_META = remote_worker(
            watcher(id),
            source_data,
            job_name,
            user,
            loader
        )
        return make_response(jsonify({"success": True, "task_id": id}), 200)
application.api.user.tasks.ingest_remote = ingest_remote()

from flask import jsonify, make_response
import application.api.user.routes
def task_status(self):
     return make_response(jsonify({"status": "SUCCESS", "result": TASK_META}), 200)
application.api.user.routes.TaskStatus.get = task_status

from application.parser.file.base_parser import BaseParser
class N2Parser(BaseParser):
     def _init_parser(self):
          return {}
     def parse_file(self, file, errors: str = "ignore") -> str:
        with open(file, "rb") as file_loaded:
            ...
        return "测试解析结果"
n2_parer = N2Parser()
import application.parser.file.bulk
application.parser.file.bulk.DEFAULT_FILE_EXTRACTOR = {
     ".doc": n2_parer,
     ".docx": n2_parer,
     ".pdf": n2_parer,
     ".pptx": n2_parer,
     ".ppt": n2_parer,
     ".html": n2_parer,
     ".htm": n2_parer
}

from application.app import app

dosc_gpt_client = app.test_client()
#with app.test_client() as client:
#    print(client.get('/').data)
        `)
    }
    if(method=="GET"){
        await pyodide.runPythonAsync(`
docsgpt_response = dosc_gpt_client.get('${route}').text
        `)
    }else if(method === "PUT") {
        await pyodide.runPythonAsync(`
docsgpt_response = dosc_gpt_client.put('${route}', data="${payload.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}", headers={'Content-Type': 'application/json'}).text
        `)
    }else if(method === "DELETE") {
        await pyodide.runPythonAsync(`
docsgpt_response = dosc_gpt_client.delete('${route}', data="${payload.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}", headers={'Content-Type': 'application/json'}).text
        `)
    }else if(method === "OPTION") {
        await pyodide.runPythonAsync(`
docsgpt_response = dosc_gpt_client.option('${route}', data="${payload.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}", headers={'Content-Type': 'application/json'}).text
        `)
    }else { // POST
        await pyodide.runPythonAsync(`
docsgpt_response = dosc_gpt_client.post('${route}', data="${payload.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}", headers={'Content-Type': 'application/json'}).text
        `)
    }
    return pyodide.globals.get("docsgpt_response")
}