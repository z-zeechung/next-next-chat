const localforage = require("localforage");
// const { initPyodide } = require("./backend/init-pyodide");
// const { docsgptRoute } = require("./backend/docsgpt");

var pyodide = undefined
// initPyodide((p)=>{pyodide = p})
// function waitUntilLoaded() {
//     return new Promise((resolve, reject) => {
//         const checkPyodide = () => {
//             if (pyodide !== undefined) {
//                 resolve(pyodide);
//             } else {
//                 setTimeout(checkPyodide, 100);
//             }
//         };
//         checkPyodide();
//     });
// }

// docsgptRoute(undefined, undefined, undefined, waitUntilLoaded)

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    if (url.hostname==="lfs.nnchat.sw") {
        if(url.pathname.startsWith("/getItem/")){
            event.respondWith((async ()=>{
                const id = url.pathname.split("/")[2];
                const item = await localforage.getItem(id);
                return new Response(item, {headers: {'Content-Type': 'application/json'}})
            })());
        }
    }else if(url.hostname==="docsgpt.nnchat.sw"){
        // if(url.pathname=="/api/upload"){
        //     console.log(event.request.body)
        // }else{
        //     event.respondWith((async()=>{
        //         let payload = event.request.body
        //         if (payload && payload.constructor.name === 'ReadableStream') {
        //             payload = await readStream(payload);
        //         }
        //         console.log(event.request.method, url.pathname, payload)
        //         const resp = await docsgptRoute(event.request.method, url.pathname, payload, waitUntilLoaded)
        //         console.log(resp)
        //         return new Response(resp, {headers: {'Content-Type': 'application/json'}})
        //     })())
        // }
    }
  });

  async function readStream(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder(); 
    let result = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
    }
    return result;
}
