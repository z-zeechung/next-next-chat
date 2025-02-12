import localforage from "localforage";
import { Chunk } from "./knowledgebase";
import { stem } from "./stemmer";
import { BM25Retriever } from "@langchain/community/retrievers/bm25";
import { labelPropagation } from '@antv/algorithm';

type BM25Documents = {
    pageContent: string,
    metadata: Chunk
}[]

const mem = {} as {[id:string]:BM25Documents}

export function createKeywordKB(id: string){

}

export async function addToKeywordKB(id: string, chunks: Chunk[]){
    if(!mem[id]){
        mem[id] = (await localforage.getItem(`nnchat-keyword-knowledge-base-bm25-documents-${id}`))??[]
    }
    for(let chunk of chunks){
        mem[id].push({
            metadata: chunk,
            pageContent: (await stem(chunk.content)).join(' ')
        })
    }
    await localforage.setItem(`nnchat-keyword-knowledge-base-bm25-documents-${id}`, mem[id])
}

export async function queryFromKeywordKB(id: string, query: string, count: number = 4): Promise<(Chunk&{score: number})[]>{
    if(!mem[id]){
        mem[id] = (await localforage.getItem(`nnchat-keyword-knowledge-base-bm25-documents-${id}`))??[]
    }
    const retriever = BM25Retriever.fromDocuments(mem[id], {k:count, includeScore:true})
    const results = await retriever._getRelevantDocuments((await stem(query)).join(' '))
    return results.map(result => {return {
        ...(result.metadata as Chunk),
        score: result.metadata.bm25Score
    }}).filter(result => result.score > 0)
}

export async function deleteFromKeywordKB(id: string, chunkIds: string[]){
    if(!mem[id]){
        mem[id] = (await localforage.getItem(`nnchat-keyword-knowledge-base-bm25-documents-${id}`))??[]
    }
    mem[id] = mem[id].filter(chunk => !chunkIds.includes(chunk.metadata.id))
    await localforage.setItem(`nnchat-keyword-knowledge-base-bm25-documents-${id}`, mem[id])
}

export async function deleteKeywordKB(id: string){
    if(mem[id]){
        delete mem[id]
    }
    await localforage.removeItem(`nnchat-keyword-knowledge-base-bm25-documents-${id}`)
}

export async function getInspectDataOfKeywordKB(id:string){
    if(!mem[id]){
        mem[id] = (await localforage.getItem(`nnchat-keyword-knowledge-base-bm25-documents-${id}`))??[]
    }
    const database = mem[id]
    type InspectData = {
        nodes: {
            id: string,
        }[],
        edges: {
            id: string,
            source: string,
            target: string,
            score: number
        }[]
    }
    const nodes = new Set<string>()
    const edges = new Map<string, number>()
    let total = new Map<string, number>()
    for(let chunk of database){
        const kws = chunk.pageContent.split(' ')
        for(let kw of kws){
            const count = total.get(kw)??0
            total.set(kw, count+1)
        }
    }
    const kwSize = [...total].length
    for(let chunk of database){
        let kwsMap = new Map()
        for(let kw of chunk.pageContent.split(' ')){
            const count = kwsMap.get(kw)??0
            kwsMap.set(kw, count+1)
        }
        let kws = [...kwsMap]
        for(let i=0;i<kws.length;i++){
            for(let j=i+1;j<kws.length;j++){
                let src = kws[i][0]
                let srcIdf = Math.log(kwSize/(total.get(src)!))
                let srcTfIdf = kwsMap.get(src)! * srcIdf
                let tar = kws[j][0]
                let tarIdf = Math.log(kwSize/(total.get(tar)!))
                let tarTfIdf = kwsMap.get(tar)! * tarIdf
                if(src > tar){
                    [src, tar] = [tar, src]
                }
                if(!nodes.has(src)){
                    nodes.add(src)
                }
                if(!nodes.has(tar)){
                    nodes.add(tar)
                }
                const score = edges.get(`${src} ${tar}`)??0
                edges.set(`${src} ${tar}`, score+srcTfIdf*tarTfIdf)
            }
        }
    }
    const filteredEdges = [...edges]
        .filter(
            ([key, value]) => value > 256
         && (()=>{
                const [A, B] = key.split(' ')
                return A!=B
            })()
        )
        .map(([key, value]) => ({id: key, source: key.split(' ')[0], target: key.split(' ')[1], value, score: value})).sort((a, b) => b.score - a.score).slice(0, 512)
    const filteredNodes = [...nodes].filter(node => filteredEdges.some(edge => edge.source === node || edge.target === node)).map(id => ({
        id
    }))
    let data = {
        nodes: filteredNodes,
        edges: filteredEdges
    } as InspectData
    const clusteredData = labelPropagation(data, false)
    data.nodes = clusteredData.clusters
    .map((cluster, i) => {
      const nodes = cluster.nodes.map((node) => ({
        id: node.id,
        data: {
            cluster: `${i}`
        }
      }));
      return nodes;
    })
    .flat();
    return data
}