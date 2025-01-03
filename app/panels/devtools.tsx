export function DevTools(){
    return <div style={{width:"100%", height:"100%"}}>
        <button onClick={async ()=>{
            await loadScript("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");
            const pyodide = await loadPyodide();
            await pyodide.loadPackage("micropip")

            await pyodide.runPythonAsync(`
                import micropip

                await micropip.install("ssl")
                micropip.uninstall("packaging"); await micropip.install("packaging<25,>=23.2")
                await micropip.install("typing-extensions>=4.12.2")
                await micropip.install("/pyodide/wheels/pydantic_core-2.27.2-cp311-cp311-emscripten_3_1_46_wasm32.whl")
                await micropip.install("tenacity<9.0.0,>=8.2.3")
                await micropip.install("/pyodide/wheels/orjson-3.9.14-cp311-cp311-emscripten_3_1_46_wasm32.whl")
                await micropip.install("/pyodide/wheels/tiktoken-0.7.0-cp311-cp311-emscripten_3_1_46_wasm32.whl")
                await micropip.install("/pyodide/wheels/jiter-0.4.0-cp311-cp311-emscripten_3_1_46_wasm32.whl")
                await micropip.install('httpx<0.28.0,>=0.27.0')

                await micropip.install('langchain')    
                await micropip.install('langchain-community')
                await micropip.install('langchain-anthropic')
                await micropip.install('langchain-openai')
                await micropip.install('langchain-groq')
                await micropip.install('langchain-ollama')
                await micropip.install('qianfan')
                await micropip.install('dashscope')
                await micropip.install('httpx-sse'); await micropip.install('PyJWT'); await micropip.install('pyjwt')  # ZHIPU AI
                
                print("done")
            `)
            // return
            await pyodide.runPythonAsync(`
                import os 
                import tarfile
                def create_tar_gz_file(source_dir, output_filename):
                    with tarfile.open(output_filename, "w:gz") as tar:
                        # Walk through the directory
                        for root, dirs, files in os.walk(source_dir):
                            for file in files:
                                file_path = os.path.join(root, file)
                                # Calculate the arcname (relative path from source_dir to file)
                                arcname = os.path.relpath(file_path, start=source_dir)
                                # Add the file to the tar archive with the arcname
                                tar.add(file_path, arcname=f"/{arcname}")
                                # print(f"Added {file_path} as /{arcname}")
                    print(f".tar.gz file '{output_filename}' created successfully.")
                source_directory = "/"
                output_tar_gz_file = "image.tar.gz"
                create_tar_gz_file(source_directory, output_tar_gz_file) 
            `)
            const data = pyodide.FS.readFile("/home/pyodide/image.tar.gz")
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([data.buffer]));
            a.download = "image.tar.gz";
            a.click();
        }}>
            Generate package image for pyodide
        </button>
    </div>
}



function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = ()=>resolve();
        script.onerror = reject;
        document.head.append(script);
    });
}