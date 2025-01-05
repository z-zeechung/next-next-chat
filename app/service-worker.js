const localforage = require("localforage");

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
    }
  });