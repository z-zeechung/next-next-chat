// import { ClientApi } from '../client/api'
// import { HNSW, MememoIndexJSON } from 'mememo';
import Dexie from "dexie";
import { HNSW } from "../../private_modules/mememo";
import { ClientApi } from "../client/api";
import { getFromIDB, insertIntoIDB, openIDB, removeFromIDB } from "./indexedDB";
import { nanoid } from "nanoid";

const PREFIX = "LOCALVECDB_"

interface DB{
    id:string
    documents: string[]
}

const mememoId = (vecDBId)=>`mememo-index-store-${vecDBId}`;

`async function deleteMememoDB(vecDBId:string){
    return new Promise(resolve=>{
        const request = indexedDB.deleteDatabase(mememoId(vecDBId, docId))
        request.onsuccess = resolve
        request.onerror = resolve
    })
}`

// const DB_PREFIX = PREFIX+"VecDB_"

// type VecGroup = {
//     api: string,
//     doc: string,
//     index: {keys: string[], values: number[][]}
// }

// type VecDB = {
//     vectorGroups:VecGroup[],
// }

// function loadObject(key:string){
//     let obj = localStorage.getItem(key)
//     if(obj==null){return null}
//     return JSON.parse(obj)
// }

// function dumpObject(key:string, obj:any){
//     localStorage.setItem(key, JSON.stringify(obj))
// }

// function deleteObject(key:string){
//     localStorage.removeItem(key)
// }

// export function createVecDB(id:string){
//     let vecDBList:string[] = loadObject(PREFIX+"vecDBList")??[]
//     if(vecDBList.includes(id)) {return;}
//     vecDBList = vecDBList.concat([id])
//     dumpObject(PREFIX+"vecDBList", vecDBList)
// }

/**@deprecated */
export function createVecDB(id:string){
    let dbList = JSON.parse(localStorage.getItem(PREFIX+"DBLIST")??"{}")
    if(dbList[id]) {return}
    dbList[id] = {
        id:id,
        documents:[]
    }
    localStorage.setItem(PREFIX+"DBLIST", JSON.stringify(dbList))
}

// export function deleteVecDB(id:string){
//     let vecDBList:string[] = loadObject(PREFIX+"vecDBList")??[]
//     vecDBList = vecDBList.filter(vecDB => vecDB !== id)
//     dumpObject(PREFIX+"vecDBList", vecDBList)
//     let vecDB:VecDB = loadObject(DB_PREFIX+id)
//     if(vecDB==null) {return}
//     /*for(let g of vecDB.vectorGroups){
//         g.index.clear()
//     }*/
//     deleteObject(DB_PREFIX+id)
// }

/**@deprecated */
export function deleteVecDB(id:string){
    let dbList = JSON.parse(localStorage.getItem(PREFIX+"DBLIST")??"{}")
    delete dbList[id]
    localStorage.setItem(PREFIX+"DBLIST", JSON.stringify(dbList))
    removeFromIDB(id)
    return new Promise(resolve=>{
        const request = indexedDB.deleteDatabase(mememoId(id))
        request.onsuccess = resolve
        request.onerror = resolve
    })
}

// export function listVecDBs():string[]{
//     return loadObject(PREFIX+"vecDBList")??[]
// }

/**@deprecated */
export function listVecDBs():string[]{
    let dbList = JSON.parse(localStorage.getItem(PREFIX+"DBLIST")??"{}")
    let ret:string[] = []
    for(let i in dbList){
        ret.push(i)
    }
    return ret
}

// export function insertIntoVecDB(vecDbId:string, docId:string, content:{title:string, content:string}[]){
//     (async()=>{
//         let vecDBList:string[] = loadObject(PREFIX+"vecDBList")??[]
//         if(!vecDBList.includes(vecDbId)) {createVecDB(vecDbId)}
//         let vecDB:VecDB = loadObject(DB_PREFIX+vecDbId)??{
//             vectorGroups:[],
//             documents:[]
//         }
//         let api = new ClientApi().embed
//         let apiID = api.id()
//         if(vecDB.vectorGroups.map((g)=>{return g.api==apiID?g.doc:""}).includes(docId)) {return}
//         let batch = await api.embed(content.map((c)=>{return c.title}))
//         //let index = new HNSW({ distanceFunction: 'cosine', useIndexedDB:false });
//         //await index.bulkInsert(content.map((c)=>{return c.content}), batch)
//         vecDB.vectorGroups = vecDB.vectorGroups.concat([{
//             api: api.id(),
//             doc: docId,
//             index:{keys:content.map((c)=>{return c.content}), values:batch}
//         }])
//         dumpObject(DB_PREFIX+vecDbId, vecDB)
        
//     }).call(null)
// }

/**@deprecated */
export async function insertIntoVecDB(vecDbId:string, docId:string, content:{title:string, content:string}[]){
    let dbList = JSON.parse(localStorage.getItem(PREFIX+"DBLIST")??"{}")
    if(!dbList[vecDbId]){createVecDB(vecDbId); dbList = JSON.parse(localStorage.getItem(PREFIX+"DBLIST")??"{}")}
    let db:DB = dbList[vecDbId]
    if(!db.documents.includes(docId)){db.documents.push(docId)}
    const index = new HNSW({ distanceFunction: 'cosine', useIndexedDB: true, indexedDBId:mememoId(vecDbId) });
        var ball = await getFromIDB(vecDbId)
        if(ball){
            index.loadIndex(ball);
        }
    await index.bulkInsert(
        content.map(c=>nanoid()), 
        await ClientApi.embed(content.map(c=>c.title)),
        docId,
        content.map(c=>c.content)
    );
        await insertIntoIDB(vecDbId, index.exportIndex())
    localStorage.setItem(PREFIX+"DBLIST", JSON.stringify(dbList))
}

// export function deleteFromVecDB(vecDbId:string, docId:string){
//     (async ()=>{
//         let vecDB:VecDB = loadObject(DB_PREFIX+vecDbId)
//         if (vecDB==null) {return}
//         /*for(let g of vecDB.vectorGroups){
//             if(g.doc==docId){
//                 await g.index.clear()
//             }
//         }*/
//         vecDB.vectorGroups = vecDB.vectorGroups.filter((g: any)=>g.doc!=docId)
//         dumpObject(DB_PREFIX+vecDbId, vecDB)
//     }).call(null)
// }

/**@deprecated */
export async function deleteFromVecDB(vecDbId:string, docId:string){
    let dbList = JSON.parse(localStorage.getItem(PREFIX+"DBLIST")??"{}")
    if(!dbList[vecDbId]){createVecDB(vecDbId); dbList = JSON.parse(localStorage.getItem(PREFIX+"DBLIST")??"{}")}
    let db:DB = dbList[vecDbId]
    if(!db.documents.includes(docId)){return}
        // 没有像mememo那样用dexie读取indexeddb
        // 不知道dexie的indexeddb版本号是怎么算的，写的明明是1，生成出来的却是10，姑且这样填上了
        // 以后若升级indexeddb，存在很大隐患，应当关注
        await new Promise(async (resolve)=>{
            const idb = await openIDB(mememoId(vecDbId), 10)
            var store = idb.transaction("mememo", "readwrite")
                        .objectStore("mememo")
            var cursor = store.openCursor()
            cursor.onsuccess = (e) => {
            const cursor = e.target.result;
                if (cursor) {
                    if(cursor.value.document==docId){
                        const request = store.put({
                            ...cursor.value,
                            isDeleted: true 
                        }); 
                    }
                    cursor.continue();
                } else {
                    resolve(undefined)
                }
            }
        })
    db.documents = db.documents.filter(doc=>doc!=docId)
    localStorage.setItem(PREFIX+"DBLIST", JSON.stringify(dbList))
}

// export function clearVecDB(id:string){
//     let vecDB:VecDB = loadObject(DB_PREFIX+id)
//     if(vecDB==null) {return}
//     /*for(let g of vecDB.vectorGroups){
//         g.index.clear()
//     }*/
//     vecDB.vectorGroups = []
//     dumpObject(DB_PREFIX+id, vecDB)
// }

/**@deprecated */
export async function clearVecDB(vecDbId:string){
    await deleteVecDB(vecDbId)
    createVecDB(vecDbId)
}

// export function contentOfVecDB(id:string):string[]{
//     let vecDB:VecDB = loadObject(DB_PREFIX+id)
//     if(vecDB==null) {return []}
//     let ret:string[] = []
//     let apiID = new ClientApi().embed.id()
//     for(let g of vecDB.vectorGroups){
//         if(g.api==apiID){
//             ret = ret.concat([g.doc])
//         }
//     }
//     return ret
// }

/**@deprecated */
export function contentOfVecDB(id:string):string[]{
    let dbList = JSON.parse(localStorage.getItem(PREFIX+"DBLIST")??"{}")
    if(!dbList[id]){return []}
    let db:DB = dbList[id]
    return db.documents
}

// export async function queryVecDBs(vecDBs:string[], query:string, count:number, threshold=0.9):Promise<string[]>{
//     let results:{key:string, distance:number}[] = []
//     let vec = (await new ClientApi().embed.embed([query]))[0]
//     let apiId = new ClientApi().embed.id()
//     for(let vecDbId of vecDBs){
//         let vecDB:VecDB = loadObject(DB_PREFIX+vecDbId)??{vectorGroups:[]}
//         for(let g of vecDB.vectorGroups){
//             if(g.api==apiId){
//                 let index = await new HNSW({ distanceFunction: 'cosine', useIndexedDB:false });
//                 await index.bulkInsert(g.index.keys, g.index.values)
//                 let qres = await index.query(vec, count)
//                 for(let i=0;i<qres.keys.length;i++){
//                     results = results.concat([{key:qres.keys[i], distance:qres.distances[i]}])
//                 }
//             }
//         }
//     }
//     results = results.filter(v => v.distance<=1-threshold)
//     results.sort((a, b)=>a.distance-b.distance)
//     let ret:string[] = []
//     let i = 0
//     for(let pair of results){
//         if(i>=count) {break}
//         ret = ret.concat([pair.key])
//         i++
//     }
//     return ret
// }

/**@deprecated */
export async function queryVecDBs(vecDBs: string[], query: string, count: number, threshold = 0.9): Promise<string[]> {
    let results: { key: string, distance: number }[] = []
    let vec = (await ClientApi.embed([query]))[0]
    let dbList = JSON.parse(localStorage.getItem(PREFIX + "DBLIST") ?? "{}")
    for (let vecDbId of vecDBs) {
        if (!dbList[vecDbId]) { continue }
        const index = new HNSW({ distanceFunction: 'cosine', useIndexedDB: true, indexedDBId: mememoId(vecDbId) });
            var ball = await getFromIDB(vecDbId)
            if(ball){
                index.loadIndex(ball);
            }
        let qres = await index.query(vec, count)
        for (let i = 0; i < qres.contents.length; i++) {
            results = results.concat([{ key: qres.contents[i], distance: qres.distances[i] }])
        }
    }
    results = results.filter(v => v.distance<=1-threshold)
    results.sort((a, b)=>a.distance-b.distance)
    let ret:string[] = []
    let i = 0
    for(let pair of results){
        if(i>=count) {break}
        ret = ret.concat([pair.key])
        i++
    }
    return ret
}