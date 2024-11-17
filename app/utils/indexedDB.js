function checkEnv(){
  if (!window.indexedDB) { window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB; }
  if (!window.IDBTransaction) { window.IDBTransaction = window.webkitIDBTransaction || window.msIDBTransaction; }
  if (!window.IDBKeyRange) { window.IDBKeyRange = window.webkitIDBKeyRange || window.msIDBKeyRange }

  if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
  }
}

export const openIDB = openDB

function openDB(dbName, version = 1) {
  checkEnv()
  return new Promise(resolve => {
    //  注意兼容浏览器
    var indexedDB = window.indexedDB
    let db;
    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version);
    // 数据库打开成功回调
    request.onsuccess = function (event) {
      db = event.target.result; // 数据库对象
      // console.log("数据库打开成功");
      resolve(db)
      // console.log(DB)
    };
    // 数据库打开失败的回调
    request.onerror = function (event) {
      resolve()
      // console.log(event);
    };
    // 数据库有更新时候的回调
    request.onupgradeneeded = function (event) {
      // // 数据库创建或升级的时候会触发
      // console.log("onupgradeneeded");
      // db = event.target.result; // 数据库对象
      // var objectStore;
      // // 创建存储库
      // objectStore = db.createObjectStore("users", {
      //   keyPath: "userId", // 这是主键
      //   // autoIncrement: true // 实现自增
      // });
      // // 创建索引，在后面查询数据的时候可以根据索引查
      // objectStore.createIndex("nameIndex", "name", { unique: false }); 
      // objectStore.createIndex("ageIndex", "age", { unique: false });
      // objectStore.createIndex("sexIndex", "sex", { unique: false });
      var db = event.target.result;

      var objectStore = db.createObjectStore("SESSION_STORAGE", {
        keyPath: ["SESSION_ID_MESSAGE_ID"],
        autoIncrement: false
      })
      objectStore.createIndex("SESSION_ID_INDEX", "SESSION_ID", { unique: false });
      objectStore.createIndex("SESSION_ID_MESSAGE_ID_INDEX", "SESSION_ID_MESSAGE_ID", { unique: true });

      objectStore = db.createObjectStore("GENERIC_STORAGE", {
        keyPath: ["ID"],
        autoIncrement: false
      })
      objectStore.createIndex("ID_INDEX", "ID", { unique: true });
    };
  })
}



// 通用存储

export async function insertIntoIDB(id, data) {
  removeFromIDB(id)
  const DB = await openDB("NNCHAT_DB")
  return new Promise(resolve => {
    var request = DB.transaction(["GENERIC_STORAGE"], "readwrite")
                    .objectStore("GENERIC_STORAGE")
                    .add({
                      ID: id,
                      DATA: data
                    })
    request.onerror = function () {
      resolve()
    };
    request.onsuccess = function (e) {
      resolve()
    };
  })
}

export async function getFromIDB(id) {
  const DB = await openDB("NNCHAT_DB")
  return new Promise(resolve => {
    var request = DB.transaction("GENERIC_STORAGE", "readwrite")
                    .objectStore("GENERIC_STORAGE")
                    .index("ID_INDEX").get(id);
    request.onerror = function () {
      // console.log("事务失败");
      resolve()
    };
    request.onsuccess = function (e) {
      var result = e.target.result;
      // console.log("索引查询结果：", result.DATA);
      resolve(result?.DATA)
    };
  })
}

export async function removeFromIDB(id) {
  const DB = await openDB("NNCHAT_DB")
  return new Promise(resolve => {
    var store = DB.transaction("GENERIC_STORAGE", "readwrite")
                  .objectStore("GENERIC_STORAGE")
    var cursor = store.index("ID_INDEX")
                      .openCursor()
    cursor.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if(cursor.value.ID==id){
          store.delete(cursor.primaryKey);
        }else{
          cursor.continue();
        }
      } else {
        resolve()
      }
    }
  })
}



// session存储

export async function insertIntoSessionIDB(sessionId, messageId, data) {
  const DB = await openDB("NNCHAT_DB")
  return new Promise(resolve => {
    var SESSION_ID_MESSAGE_ID = `SESSION_ID_${sessionId}_MESSAGE_ID_${messageId}`
    var request = DB.transaction(["SESSION_STORAGE"], "readwrite")
      .objectStore("SESSION_STORAGE")
      .add({
        SESSION_ID_MESSAGE_ID: SESSION_ID_MESSAGE_ID,
        SESSION_ID: sessionId,
        DATA: data
      })
    request.onerror = function () {
      resolve()
    };
    request.onsuccess = function (e) {
      resolve()
    };
  })
}

export async function getFromSessionIDB(sessionId, messageId) {
  const DB = await openDB("NNCHAT_DB")
  return new Promise(resolve => {
    var SESSION_ID_MESSAGE_ID = `SESSION_ID_${sessionId}_MESSAGE_ID_${messageId}`
    var request = DB.transaction("SESSION_STORAGE", "readwrite")
      .objectStore("SESSION_STORAGE")
      .index("SESSION_ID_MESSAGE_ID_INDEX").get(SESSION_ID_MESSAGE_ID);
    request.onerror = function () {
      // console.log("事务失败");
      resolve()
    };
    request.onsuccess = function (e) {
      var result = e.target.result;
      // console.log("索引查询结果：", result.DATA);
      resolve(result?.DATA)
    };
  })
}

export async function removeFromSessionIDB(sessionId, messageId) {
  const DB = await openDB("NNCHAT_DB")
  var SESSION_ID_MESSAGE_ID = `SESSION_ID_${sessionId}_MESSAGE_ID_${messageId}`
  return new Promise(resolve=>{
    const tx = DB.transaction("SESSION_STORAGE", 'readwrite');
    const store = tx.objectStore("SESSION_STORAGE");
    const index = store.index("SESSION_ID_MESSAGE_ID_INDEX");
    index.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            if (cursor.value.SESSION_ID_MESSAGE_ID === SESSION_ID_MESSAGE_ID) { 
                cursor.delete();
                resolve()
            }
            cursor.continue();
        }
    };
  })
}

export async function clearSessionIDB(sessionId) {
  const DB = await openDB("NNCHAT_DB")
  return new Promise(resolve => {
    var store = DB.transaction("SESSION_STORAGE", "readwrite")
                  .objectStore("SESSION_STORAGE")
    var cursor = store.index("SESSION_ID_INDEX")
                      .openCursor(IDBKeyRange.only(sessionId))
    cursor.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      } else {
        resolve()
      }
    }
  })
}

export async function clearAllSessionIDBs(){
  const DB = await openDB("NNCHAT_DB")
  return new Promise(resolve=>{
    DB.transaction("SESSION_STORAGE", "readwrite")
      .objectStore("SESSION_STORAGE")
      .clear()
      .onsuccess = function() {
        resolve()
      };
  })
}