import { nanoid } from "nanoid";
import { Document, KnowledgeStore, QueryResult } from "./knowledgebase";
import { HNSW, MememoNode } from "./mememo";
import localForage from "localforage";
import { ClientApi } from "../client/api";
import { chunk, jina } from "./jina";
import Dexie from "dexie";
import { estimateTokenLength } from "../utils/token";

export class VectorStore implements KnowledgeStore{
    async deleteDoc(id: string, docId: string): Promise<void> {
        const myDexie = new Dexie(VdbId(id));
        myDexie.version(1).stores({
            mememo: 'key'
        });
        const db = myDexie.table<MememoNode>('mememo');
        let keys:string[] = []
        await db.each(obj=>{
            if(obj.document == docId){
                keys.push(obj.key)
            }
        })
        for(let key of keys){
            await db.update(key, {isDeleted: true, value: [], document: "", content: ""})
        }
    }
    async query(id: string, query: string, count: number): Promise<QueryResult[]> {
        const index = new HNSW({ distanceFunction: 'cosine', useIndexedDB: true, indexedDBId:VdbId(id) });
        const ball = await localForage.getItem(BallId(id))
        if (ball) {
            index.loadIndex(ball)
        }
        let res = await index.query((await ClientApi.embed([query]))[0], count)
        return res.contents.map(r=>JSON.parse(r))
    }
    async append(id: string, docs: Document[]): Promise<void> {
        const index = new HNSW({ distanceFunction: 'cosine', useIndexedDB: true, indexedDBId:VdbId(id) });
        const ball = await localForage.getItem(BallId(id))
        if (ball) {
            await index.loadIndex(ball)
        }
        for(let doc of docs){
            const chunks = chunk(doc.text)
            let offset = 0
            await index.bulkInsert(
                chunks.map(_=>nanoid()),
                await ClientApi.embed(chunks),
                doc.id,
                chunks.map(chunk=>{
                    const ret: QueryResult = {src: doc.id, content: chunk, offset: offset}
                    offset += chunk.length
                    return JSON.stringify(ret)
                })
            )
        }
        await localForage.setItem(BallId(id), index.exportIndex())
    }
    async delete(id: string): Promise<void> {
        await localForage.removeItem(BallId(id))
        Dexie.delete(VdbId(id))
    }    
    async export(id: string): Promise<Uint8Array> {
        const ball = await localForage.getItem(BallId(id))
        const nodes: MememoNode[] = []
        const myDexie = new Dexie(VdbId(id));
        myDexie.version(1).stores({
            mememo: 'key'
        });
        const db = myDexie.table<MememoNode>('mememo');
        await db.each(obj=>{
            nodes.push(obj)
        })
        const exp = {ball, nodes}
        return new TextEncoder().encode(JSON.stringify(exp))
    }
    async import(id: string, data: Uint8Array): Promise<void> {
        await this.delete(id)
        const exp = JSON.parse(new TextDecoder().decode(data))
        const ball = exp.ball
        const nodes = exp.nodes
        await localForage.setItem(BallId(id), ball)
        const myDexie = new Dexie(VdbId(id));
        myDexie.version(1).stores({
            mememo: 'key'
        });
        const db = myDexie.table<MememoNode>('mememo');
        await db.bulkPut(nodes as MememoNode[])
    }
}

const VdbId = (id: string) => `nnchat_vectorstore_${id}`;
const BallId = (id: string) => `nnchat_vectorstore_ball_${id}`;