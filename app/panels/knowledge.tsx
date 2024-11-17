import { ClientApi } from "../client/api";
import { Button } from "../themes/theme";
import { runPyodide } from "../utils/pyodide";
import { extract } from "./knowledge/graphrag";
import { makeVectorIndex } from "./knowledge/make-vector-index";
import { chunk, readFile } from "./knowledge/read-file";

export function KnowledgeBase() {
  // return <Button onClick={async ()=>{
  //   const inputs = TEST_INPUT.trim().split('\n')
  //   console.log(JSON.stringify(await extract(inputs, (c, e, r)=>{
  //     console.log(context2msg(e, r))
  //   })))
  // }}/>

  return <Button onClick={async () => {
    // return 
    const inputs = document.createElement("input")
    inputs.type = "file"
    inputs.multiple = true
    inputs.addEventListener("change", async (event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const files = input.files;
        const inputs = [] as File[]
        for (let file of files) {
          inputs.push(file)
        }
        makeVectorIndex(inputs, (info, progress)=>{
          console.log(info, progress)
        })
      }
    });
    inputs.click()
  }} />
}