export interface KnowledgeBase {
    
    id: string

    type: "vector" | "keyword" | "graph"

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

export abstract class KnowledgeStore{

    abstract query(id:string, query: string, count: number): Promise<QueryResult[]>

    abstract append(id:string, docs: Document[]): Promise<void>

    abstract deleteDoc(id:string, docId: string): Promise<void>

    abstract delete(id:string): Promise<void>
}