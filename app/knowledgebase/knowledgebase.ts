"use client"

import { nanoid } from "nanoid"
import { VectorStore } from "./vector"
import { KeywordStore } from "./keyword"
import { GraphStore } from "./graph"
import { readDoc, readDocx, readHTML, readPDF, readPPTx, readTxt } from "../utils/readfile"

export class KnowledgeBase {

    id: string
    type: "vector" | "keyword" | "graph"
    docs: {title:string, id:string}[]

    constructor(id: string, type: "vector" | "keyword" | "graph" = "vector"){
        this.id = id
        this.type = type
        this.docs = []
        KnowledgeBase.useList((list)=>{
            if(!list.find((kb)=>{
                if(kb.id === id){
                    this.type = kb.type
                    this.docs = kb.docs
                    return true
                }
            })){
                list.push(this)
            }
            return list
        })
    }

    static list(): KnowledgeBase[] {
        let ret: KnowledgeBase[] = []
        this.useList((list)=>{
            ret = list
            return list
        })
        return ret
    }

    private static useList(cb: (list: KnowledgeBase[])=>void){
        const list: KnowledgeBase[] = JSON.parse(localStorage.getItem("nnchat-knowledgebase-list")??"[]")
        const newList = cb(list)
        localStorage.setItem("nnchat-knowledgebase-list", JSON.stringify(newList??list))
    }

    async add(files: File[]){
        const docs: Document[] = []
        for(let file of files){
            let title = file.name
            {
                let i = 1
                let name = title.split(".").slice(0,-1).join(".")
                let ext = title.split(".").slice(-1)[0]
                while (this.docs.find((doc)=>doc.title === title)){
                    title = `${name} (${i}).${ext}`
                    i++
                }
            }
            let content: string
            switch(file.name.split(".").slice(-1)[0].toLowerCase()){
                case "html":
                case "htm":
                case "mhtml":
                    content = await readHTML(file)
                    break
                case "pdf":
                    content = await readPDF(file)
                    break
                case "docx":
                    content = await readDocx(file)
                    break
                case "doc":
                    content = await readDoc(file)
                    break
                case "pptx":
                    content = await readPPTx(file)
                    break
                default:
                    content = await readTxt(file)
            }
            const id = nanoid()
            docs.push({id, text: content})
            this.docs.push({title, id})
        }
        let store: KnowledgeStore
        switch(this.type){
            case "vector":
                store = new VectorStore()
                break
            case "keyword":
                store = new KeywordStore()
                break
            case "graph":
                store = new GraphStore()
                break
        }
        await store.append(this.id, docs)
        KnowledgeBase.useList((list)=>{
            list.find((kb)=>kb.id === this.id)!.docs = this.docs
            return list
        })
    }

    listDocs():string[]{
        return Array.from(this.docs, (doc)=>doc.title)
    }

    async query(query: string, count: number): Promise<QueryResult[]>{
        let store: KnowledgeStore
        switch(this.type){
            case "vector":
                store = new VectorStore()
                break
            case "keyword":
                store = new KeywordStore()
                break
            case "graph":
                store = new GraphStore()
                break
        }
        return await store.query(this.id, query, count)
    }

    async deleteDoc(title:string){
        const id = this.docs.find((doc)=>doc.title === title)?.id
        if(id){
            this.docs.filter((doc)=>doc.title !== title)
            let store: KnowledgeStore
            switch(this.type){
                case "vector":
                    store = new VectorStore()
                    break
                case "keyword":
                    store = new KeywordStore()
                    break
                case "graph":
                    store = new GraphStore()
                    break
            }
            await store.deleteDoc(this.id, id)
        }
        KnowledgeBase.useList((list)=>{
            list.find((kb)=>kb.id === this.id)!.docs = this.docs
            return list
        })
    }

    async delete(){
        let store: KnowledgeStore
        switch(this.type){
            case "vector":
                store = new VectorStore()
                break
            case "keyword":
                store = new KeywordStore()
                break
            case "graph":
                store = new GraphStore()
                break
        }
        await store.delete(this.id)
        KnowledgeBase.useList((list)=>{
            list = list.filter((kb)=>kb.id !== this.id)
            return list
        })
    }
}

export interface Document{
    id: string
    text: string
}

export interface QueryResult{
    src: string
    content: string
    offset: number
}

export interface KnowledgeStore{

    query(id:string, query: string, count: number): Promise<QueryResult[]>

    append(id:string, docs: Document[]): Promise<void>

    deleteDoc(id:string, docId: string): Promise<void>

    delete(id:string): Promise<void>
}