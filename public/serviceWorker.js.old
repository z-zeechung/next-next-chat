const CHATGPT_NEXT_WEB_CACHE = "chatgpt-next-web-cache";

self.addEventListener("activate", function (event) {
  console.log("ServiceWorker activated.");
});

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CHATGPT_NEXT_WEB_CACHE).then(function (cache) {
      return cache.addAll([]);
    }),
  );
});

function onupgradeneeded(event) {
  var db = event.target.result;
  objectStore = db.createObjectStore("GENERIC_STORAGE", {
    keyPath: ["ID"],
    autoIncrement: false
  })
  objectStore.createIndex("ID_INDEX", "ID", { unique: true });
}

self.addEventListener("fetch", (e) => {
  if(/.+\:\/\/.+\/idb\//.test(e.request.url)){
    if(e.request.method=="PUT"){
      e.respondWith(new Promise((resolve, reject)=>{
        const request = indexedDB.open("local-idb-for-large-files-indexed-by-url", 1);
        request.onupgradeneeded = onupgradeneeded
        request.onerror = function(event) {
          console.log("Database error: " + event.target.errorCode);
        };
        request.onsuccess = async function(event) {
          const db = event.target.result;
          var content = await read(e.request.body)
          var request = db.transaction(["GENERIC_STORAGE"], "readwrite")
                          .objectStore("GENERIC_STORAGE")
                          .add({
                            ID: e.request.url,
                            DATA: content
                          })
          request.onerror = function (event) {
            console.log("Database error: " + event.target.errorCode);
          };
          request.onsuccess = function (event) {
            resolve(new Response({ status: 200 }))
          };
        };
      }))
    }
    if(e.request.method=="GET"){
      e.respondWith(new Promise((resolve, reject)=>{
        const request = indexedDB.open("local-idb-for-large-files-indexed-by-url", 1);
        request.onupgradeneeded = onupgradeneeded
        request.onerror = function(event) {
          console.log("Database error: " + event.target.errorCode);
        };
        request.onsuccess = async function(event) {
          const db = event.target.result;
          var request = db.transaction("GENERIC_STORAGE", "readwrite")
                          .objectStore("GENERIC_STORAGE")
                          .index("ID_INDEX").get(e.request.url);
          request.onerror = function () {
            console.log("Database error: " + event.target.errorCode);
          };
          request.onsuccess = function (e) {
            var result = e.target.result;
            resolve(new Response(result?.DATA, { status: 200 }))
          };
        };
      }))
    }
    if(e.request.method=="DELETE"){
      e.respondWith(new Promise((resolve, reject)=>{
        const request = indexedDB.open("local-idb-for-large-files-indexed-by-url", 1);
        request.onupgradeneeded = onupgradeneeded
        request.onerror = function(event) {
          console.log("Database error: " + event.target.errorCode);
        };
        request.onsuccess = async function(event) {
          const db = event.target.result;
          var store = db.transaction("GENERIC_STORAGE", "readwrite")
                  .objectStore("GENERIC_STORAGE")
          var cursor = store.index("ID_INDEX")
                            .openCursor()
          cursor.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              if(cursor.value.ID==e.request.url){
                store.delete(cursor.primaryKey);
              }else{
                cursor.continue();
              }
            } else {
              resolve(new Response({ status: 200 }))
            }
          }
        };
      }))
    }
  }
});

async function read(stream){
  return new Promise((resolve, reject)=>{
    const reader = stream.getReader();
    var chunk = new Uint8Array(0);
    function _read() {
      reader.read().then(async({ value, done }) => {
          if (done) {
              await reader.releaseLock()
              resolve(chunk);
          }else{
            chunk = concatUint8Arrays(chunk, value)
            _read();
          }
      }).catch(err => {
        console.log(err);
      });
    }
    _read()
  })
}

function concatUint8Arrays(a, b) {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}