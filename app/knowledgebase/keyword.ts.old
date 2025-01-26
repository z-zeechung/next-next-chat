import localForage from "localforage";
import { Document, KnowledgeStore, QueryResult } from "./knowledgebase";
import { chunk, jina } from "./jina";
import Index from "./flexsearch/index";
import { encode as default_encoder } from "./flexsearch/lang/latin/default.js";
import {franc} from 'franc'
import initJieba, { cut_for_search } from 'jieba-wasm';
import { estimateTokenLength } from "../utils/token";

let JIEBA_INITED = false

export class KeywordStore implements KnowledgeStore{
    private async useIndex(id, cb:(index: Index)=>Promise<void>){
        const index = new Index({});
        const keys = await localForage.getItem<string[] | undefined>(KwsId(id))
        if(keys){
            for(let key of keys){
                let data = await localForage.getItem(KwsExId(id, key))
                if(data){
                    await index.import(key, data)
                }
            }
        }
        await cb(index)
        let exKeys:string[] = []
        await index.export(async (key, data)=>{
            await localForage.setItem(KwsExId(id, key), data)
            exKeys.push(key)
        })
        await localForage.setItem(KwsId(id), exKeys)
    }
    private async configLang(index:Index, text:string){
        if(text.length < 20){
            text = text.repeat(Math.floor(20 / text.length) + 1)
        }
        const lang = franc(text)
        switch (lang){
            case "cmn":
                if(!JIEBA_INITED){
                    await (initJieba as any)();
                    JIEBA_INITED = true
                }
                index.encode = (str)=>{
                    return cut_for_search(str, true)
                }
                index.tokenize = "strict"
                break
            // TODO
            // case "jpn":
            //     break
            // case "vie":
            //     break
            case "rus":
            case "deu":
                index.encode = default_encoder
                index.tokenize = "full"
                break
            default:
                index.encode = default_encoder
                index.tokenize = "forward"
                break
        }
    }
    async query(id: string, query: string, count: number): Promise<QueryResult[]> {
        return new Promise(async (resolve, reject)=>{
            await this.useIndex(id, async (index)=>{
                await this.configLang(index, query)
                const keywords = index.encode(query)
                const results = {}
                for(let keyword of keywords){
                    const ids = await index.search(keyword, count)
                    for(let id of ids){
                        if(!results[id]){
                            results[id] = 1
                        }else{
                            results[id] += 1
                        }
                    }
                }
                let resultList = Object.keys(results).map(key => ({
                    id: key,
                    score: results[key]
                }));
                resultList.sort((a, b) => {
                    return b.score - a.score;
                });
                resultList = resultList.slice(0, count)
                let ret:QueryResult[] = []
                for(let result of resultList){
                    const id = result.id
                    const src = `${id}`.split("-").slice(0, -1).join("-")
                    const {chunk, offset} = await localForage.getItem(`${id}`) as any
                    ret.push({src, content:chunk, offset})
                }
                resolve(ret)
            })
        })
    }
    async append(id: string, docs: Document[]): Promise<void> {
        await this.useIndex(id, async (index)=>{
            for(let doc of docs){
                const chunks = chunk(doc.text)
                let offset = 0
                for(let i=0;i<chunks.length;i++){
                    await this.configLang(index, chunks[i])
                    await index.add(doc.id+`-${i}`, chunks[i])
                    await localForage.setItem(doc.id+`-${i}`, {chunk:chunks[i], offset})
                    offset += chunks[i].length
                }
            }
        })
    }
    async deleteDoc(id: string, docId: string): Promise<void> {
        await this.useIndex(id, async (index)=>{
            for(let i=0; ;i++){
                if(!(await localForage.getItem(`${docId}-${i}`))){
                    break
                }
                await index.remove(`${docId}-${i}`)
                await localForage.removeItem(`${docId}-${i}`)
            }
        })
    }
    async delete(id: string): Promise<void> {
        const keys = await localForage.getItem<string[] | undefined>(KwsId(id))
        if(keys){
            for(let key of keys){
                await localForage.removeItem(KwsExId(id, key))
            }
        }
        await localForage.removeItem(KwsId(id))
        await localForage.removeItem(KwsDocStoreId(id))
    }
    async export(id: string): Promise<Uint8Array> {
        const keys = await localForage.getItem<string[]>(KwsId(id))
        const exs:any[] = []
        if(keys){
            for(let key of keys){
                exs.push({key, data: await localForage.getItem(KwsExId(id, key))})
            }
        }
        const docStore = await localForage.getItem(KwsDocStoreId(id))
        const exp = {keys, exs, docStore}
        return new TextEncoder().encode(JSON.stringify(exp))
    }
    async import(id: string, data: Uint8Array): Promise<void> {
        this.delete(id)
        const exp = JSON.parse(new TextDecoder().decode(data))
        await localForage.setItem(KwsId(id), exp.keys)
        await localForage.setItem(KwsDocStoreId(id), exp.docStore)
        for(let ex of exp.exs){
            await localForage.setItem(KwsExId(id, ex.key), ex.data)
        }
    }
}

const KwsId = (id)=>`nnchat-kws-id-${id}`
const KwsDocStoreId = (id)=>`nnchat-kws-doc-id-${id}`
const KwsExId = (id, key)=>`nnchat-kws-ex-id-${id}-${key}`