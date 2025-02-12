import { nanoid } from "nanoid"
import { addToKeywordKB, createKeywordKB, deleteFromKeywordKB, deleteKeywordKB, getInspectDataOfKeywordKB, queryFromKeywordKB } from "./keyword-kb"
import { files2chunks } from "./files-to-chunks"
import { addToKbLfs, clearKbLfs } from "./kb-lfs"


export interface KnowledgeBase{
    name: string,
    id: string,
    type: "keyword" | "vector",
    chunkIndex: {
        id: string,
        src: { title: string }
    }[]
}

export interface Chunk{
    id: string,
    content: string,
    src: {
        title: string,
        url: string
    }
}

export async function createKB(title: string, type: "keyword" | "vector"): Promise<string>{
    const id = nanoid()
    const newKB: KnowledgeBase = {
        name: title,
        id: id,
        type: type,
        chunkIndex: []
    }
    if(type==="keyword"){
        await createKeywordKB(id)
    }
    const kbs: KnowledgeBase[] = JSON.parse(localStorage.getItem("nnchat-knowledge-base-list") || "[]")
    kbs.push(newKB)
    localStorage.setItem("nnchat-knowledge-base-list", JSON.stringify(kbs))
    return id
}

export function listKBs(): KnowledgeBase[]{
    return JSON.parse(localStorage.getItem("nnchat-knowledge-base-list") || "[]")
}

export function getKB(id: string): KnowledgeBase | undefined {
    return listKBs().find(kb => kb.id === id)
}

export function deleteKB(id: string): void{
    const metadata = getKB(id)
    if(metadata?.type==="keyword"){
        deleteKeywordKB(id)
    }
    const kbs: KnowledgeBase[] = JSON.parse(localStorage.getItem("nnchat-knowledge-base-list") || "[]")
    const newKbs = kbs.filter(kb => kb.id !== id)
    localStorage.setItem("nnchat-knowledge-base-list", JSON.stringify(newKbs))
    clearKbLfs(id)
}

export async function addToKB(id: string, files: File[]): Promise<void>{
    const type = getKB(id)?.type
    const chunks = await files2chunks(files, (file)=>{return addToKbLfs(id, file)})
    if(type==="keyword"){
        await addToKeywordKB(id, chunks)
    }
    const kbs: KnowledgeBase[] = JSON.parse(localStorage.getItem("nnchat-knowledge-base-list") || "[]")
    kbs.find(kb => kb.id === id)?.chunkIndex.push(...chunks.map(chunk => ({id: chunk.id, src: { title: chunk.src.title}})))
    localStorage.setItem("nnchat-knowledge-base-list", JSON.stringify(kbs))
}

export async function queryFromKB(id: string, query: string, count: number =4): Promise<(Chunk&{score: number})[]>{
    const metadata = getKB(id)
    if(metadata?.type==="keyword"){
        return await queryFromKeywordKB(id, query, count)
    }
    return undefined as any
}

export async function deleteFromKB(id: string, chunkIds: string[]): Promise<void>{
    const metadata = getKB(id)
    if(metadata?.type==="keyword"){
        await deleteFromKeywordKB(id, chunkIds)
    }
    const kbs: KnowledgeBase[] = JSON.parse(localStorage.getItem("nnchat-knowledge-base-list") || "[]")
    const index = kbs.find(kb => kb.id === id)
    if(index){
        index.chunkIndex = index.chunkIndex.filter(chunk => !chunkIds.includes(chunk.id))
    }
    localStorage.setItem("nnchat-knowledge-base-list", JSON.stringify(kbs))
}

export async function getInspectDataOfKB(id: string){
    const metadata = getKB(id)
    if(metadata?.type==="keyword"){
        return await getInspectDataOfKeywordKB(id)
    }
} 