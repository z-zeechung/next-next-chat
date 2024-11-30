import { ClientApi } from "../client/api";
import { Message } from "../message/Message";
import { estimateTokenLength } from "../utils/token";
import { EXTRACT_ENTITY_CHAT, EXTRACT_ENTITY_COMPLETION } from "./graph/prompts";
import { chunk } from "./jina";
import { Document, KnowledgeStore, QueryResult } from "./knowledgebase";
import Index from "./flexsearch/index";
import localForage from "localforage";
import { franc } from 'franc'
import initJieba, { cut_for_search } from 'jieba-wasm';
let JIEBA_INITED = false
import { encode as default_encoder } from "./flexsearch/lang/latin/default.js";

interface Chunk {
    docId: string,
    text: string,
    offset: number
}

interface RawER {
    entities: Map<string, {
        type: "ORG" | "PERSON" | "GEO" | "EVENT" | "ITEM" | "IDEA" | "ATTR",
        descriptions: Chunk[]
    }>,
    relationships: Map<{ src: string, tar: string }, {
        type: "EQUAL" | "IS" | "OTHER",
        descriptions: Chunk[]
    }>
}

type Graph = Map<string, {
    type: "ORG" | "PERSON" | "GEO" | "EVENT" | "ITEM" | "IDEA" | "ATTR" | "UNKNOWN",
    description: string,
    docId: string,
    offset: number,
    targets: {
        name: string,
        type: "EQUAL" | "IS" | "OTHER",
        description: string
    }[]
}>

export class GraphStore extends KnowledgeStore {
    async query(id: string, query: string, count: number): Promise<QueryResult[]> {
        const index = new Index()
        configLang(index, query)
        const keys = await localForage.getItem<string[] | undefined>(gsExKwsKeysId(id))
        if (keys) {
            for (let key of keys) {
                let data = await localForage.getItem(gsKwsKeysId(id, key))
                if (data) {
                    await index.import(key, data)
                }
            }
        }
        const keywords = index.encode(query)
        const results = {}
        for (let keyword of keywords) {
            const ids = await index.search(keyword, count)
            for (let id of ids) {
                if (!results[id]) {
                    results[id] = 1
                } else {
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
        const nodes = resultList.map(result => result.id)
        const graph = await localForage.getItem<Graph>(gsId(id))
        const ret: QueryResult[] = []
        for (let node of nodes) {
            const retInfos:string[] = []
            function recurse(node: string, depth: number) {
                const nodeData = graph!.get(`${node}`)
                if (nodeData) {
                    retInfos.push(nodeData.description)
                    for(let data of nodeData.targets){
                        if(estimateTokenLength(retInfos.join("\n"))>512){
                            return
                        }
                        retInfos.push(data.description)
                        recurse(data.name, depth + 1)
                    }
                }
            }
            recurse(node, 0)
            const r:QueryResult = {
                src: graph!.get(`${node}`)!.docId,
                content: retInfos.join("\n"),
                offset: graph!.get(`${node}`)!.offset
            }
            if(r.content.trim().length>0){
                ret.push(r)
            }
        }
        return ret
    }
    async append(id: string, docs: Document[]): Promise<void> {
        const rawEr: RawER = { entities: new Map(), relationships: new Map() }
        for (let doc of docs) {
            const chunks = chunk(doc.text)
            let offset = chunks[0].length
            const firstReply = extractER(
                await ClientApi.chat([{ type: "text", role: "user", content: EXTRACT_ENTITY_COMPLETION(chunks[0]) }], undefined, { model: "long" }),
                doc.id,
                0,
                rawEr
            )
            console.log(firstReply)
            console.log(rawEr)
            let messages: Message[] = [
                { type: "text", role: "user", content: chunks[0] },
                { type: "text", role: "assistant", content: firstReply }
            ]
            for (let chunk of chunks.slice(1)) {
                const reply = extractER(
                    await ClientApi.chat([
                        { type: "text", role: "system", content: EXTRACT_ENTITY_CHAT },
                        ...messages,
                        { type: "text", role: "user", content: chunk }
                    ], undefined, { model: "long" }),
                    doc.id,
                    offset,
                    rawEr
                )
                offset += chunk.length
                messages.push({ type: "text", role: "user", content: chunk })
                messages.push({ type: "text", role: "assistant", content: reply })
                console.log(reply)
                console.log(rawEr)
            }
        }
        let graph: Graph = new Map()
        const storedGraph = await localForage.getItem<Graph>(gsId(id))
        if (storedGraph) {
            graph = storedGraph
        }
        rawEr.entities.forEach(async (e, k) => {
            const description = e.descriptions.length == 1 ?
                e.descriptions[0].text :
                await ClientApi.chat([
                    {
                        type: "text", role: "user", content: `总结如下文本，要求囊括每一条的所有要点。直接输出结果，不要输出额外的信息：
                                        ${JSON.stringify(e.descriptions.map(d => d.text))}
                                    ` },
                ], undefined, { model: "long" })
            if (graph.has(k)) {
                graph.get(k)!.description += description
                if (estimateTokenLength(graph.get(k)!.description) > 128) {
                    graph.get(k)!.description = await ClientApi.chat([
                        {
                            type: "text", role: "user", content: `总结如下文本，要求囊括每一条的所有要点。直接输出结果，不要输出额外的信息：
                            ${graph.get(k)!.description}
                        请注意，该段文本前面部分的信息密度要高于后面部分，因此你应当关注前面部分的信息。` },
                    ], undefined, { model: "long" })
                }
                if (graph.get(k)?.type == "UNKNOWN") {
                    graph.get(k)!.type = e.type
                }
                return
            }
            let { docId, length, offset } = { docId: e.descriptions[0].docId, length: estimateTokenLength(e.descriptions[0].text), offset: e.descriptions[0].offset }
            for (let i = 1; i < e.descriptions.length; i++) {
                const d = e.descriptions[i]
                if (d.text.length > length) {
                    docId = d.docId
                    length = estimateTokenLength(d.text)
                    offset = d.offset
                }
            }
            graph.set(k, {
                type: e.type,
                description: description,
                docId: docId,
                offset: offset,
                targets: []
            })
        })
        console.log(graph)
        rawEr.relationships.forEach(async (r, k) => {
            let { docId, length, offset } = { docId: r.descriptions[0].docId, length: estimateTokenLength(r.descriptions[0].text), offset: r.descriptions[0].offset }
            for (let i = 1; i < r.descriptions.length; i++) {
                const d = r.descriptions[i]
                if (d.text.length > length) {
                    docId = d.docId
                    length = estimateTokenLength(d.text)
                    offset = d.offset
                }
            }
            const { src, tar } = k
            if (!graph.has(src)) {
                graph.set(src, {
                    type: "UNKNOWN",
                    description: "",
                    docId: docId,
                    offset: offset,
                    targets: []
                })
            }
            if (!graph.has(tar)) {
                graph.set(tar, {
                    type: "UNKNOWN",
                    description: "",
                    docId: docId,
                    offset: offset,
                    targets: []
                })
            }
            const description = r.descriptions.length == 1 ?
                r.descriptions[0].text :
                await ClientApi.chat([
                    {
                        type: "text", role: "user", content: `总结如下文本，要求囊括每一条的所有要点。直接输出结果，不要输出额外的信息：
                                        ${JSON.stringify(r.descriptions.map(d => d.text))}
                                    ` },
                ], undefined, { model: "long" })
            if (graph.get(src)?.targets.map(t => t.name).includes(tar)) {
                graph.get(src)?.targets.map(async t => {
                    let rdesc = t.description
                    if (estimateTokenLength(rdesc) > 128) {
                        rdesc = await ClientApi.chat([
                            {
                                type: "text", role: "user", content: `总结如下文本，要求囊括每一条的所有要点。直接输出结果，不要输出额外的信息：
                                ${t.description + description}
                            请注意，该段文本前面部分的信息密度要高于后面部分，因此你应当关注前面部分的信息。` },
                        ], undefined, { model: "long" })
                    }
                    return {
                        name: tar,
                        type: r.type,
                        description: rdesc
                    }
                })
                return
            }
            graph.get(src)!.targets.push({
                name: tar,
                type: r.type,
                description: description
            })
        })
        console.log(graph)
        await localForage.setItem(gsId(id), graph)
        const index = new Index()
        const keys = await localForage.getItem<string[] | undefined>(gsExKwsKeysId(id))
        if (keys) {
            for (let key of keys) {
                let data = await localForage.getItem(gsKwsKeysId(id, key))
                if (data) {
                    await index.import(key, data)
                }
            }
        }
        index.tokenize = "full"
        graph.forEach(async (v, k) => {
            await index.append(k, k)
        })
        let exKeys: string[] = []
        index.export(async (key, data) => {
            await localForage.setItem(gsKwsKeysId(id, key), data)
            exKeys.push(key)
            await localForage.setItem(gsExKwsKeysId(id), exKeys)
        })
    }
    deleteDoc(id: string, docId: string): Promise<void> {
        throw new Error("Documents cannot be deleted from the graph knowledge base.");
    }
    async delete(id: string): Promise<void> {
        const keys = await localForage.getItem<string[] | undefined>(gsExKwsKeysId(id))
        if (keys) {
            for (let key of keys) {
                await localForage.removeItem(gsKwsKeysId(id, key))
            }
        }
        await localForage.removeItem(gsExKwsKeysId(id))
        await localForage.removeItem(gsId(id))
    }

}


const gsId = (id: string) => `nnchat-gs-${id}`
const gsKwsKeysId = (id: string, key: string) => `nnchat-gs-kws-keys-${id}-${key}`
const gsExKwsKeysId = (id: string) => `nnchat-gs-ex-kws-keys-${id}`


function extractER(text: string, docId: string, offset: number, rawEr: RawER) {
    const ENTITY_REGEX = /\(entity\|(.+?)\|(ORG|PERSON|GEO|EVENT|ITEM|IDEA|ATTR)\|(.+?)\)/g
    const RELATIONSHIP_REGEX = /\(relationship\|(.+?)\|(.+?)\|(EQUAL|IS|OTHER)\|(.+?)\)/g
    function multiMatch(regex, text) {
        let match
        const matches = [] as any[]
        while ((match = regex.exec(text)) !== null) {
            matches.push(match)
        }
        return matches
    }
    var entities = multiMatch(ENTITY_REGEX, text).map(e => {
        return {
            name: e[1],
            type: e[2],
            description: e[3]
        }
    })
    var relationships = multiMatch(RELATIONSHIP_REGEX, text).map(e => {
        return {
            source: e[1],
            target: e[2],
            type: e[3],
            description: e[4]
        }
    })
    let entityList: string[] = []
    for (let rel of relationships) {
        entityList.push(rel.source)
        entityList.push(rel.target)
    }
    function toChunk(text: string): Chunk {
        return {
            docId: docId,
            text: text,
            offset: offset
        }
    }
    entities = entities.filter(e => entityList.includes(e.name))
    for (let entity of entities) {
        if (rawEr.entities.has(entity.name)) {
            rawEr.entities.get(entity.name)?.descriptions.push(toChunk(entity.description))
        } else {
            rawEr.entities.set(entity.name, {
                type: entity.type,
                descriptions: [toChunk(entity.description)]
            })
        }
    }
    for (let rel of relationships) {
        if (rawEr.relationships.has({ src: rel.source, tar: rel.target })) {
            rawEr.relationships.get({ src: rel.source, tar: rel.target })?.descriptions.push(toChunk(rel.description))
        } else {
            rawEr.relationships.set({ src: rel.source, tar: rel.target }, {
                type: rel.type,
                descriptions: [toChunk(rel.description)]
            })
        }
    }

    return relationships.map(e => `(relationship|${e.source}|${e.target}|${e.type}|${e.description})`).join("\n")
        + "\n"
        + entities.map(e => `(entity|${e.name}|${e.type}|${e.description})`).join("\n")
}

async function configLang(index: Index, text: string) {
    if (text.length < 20) {
        text = text.repeat(Math.floor(20 / text.length) + 1)
    }
    const lang = franc(text)
    switch (lang) {
        case "cmn":
            if (!JIEBA_INITED) {
                await (initJieba as any)();
                JIEBA_INITED = true
            }
            index.encode = (str) => {
                return cut_for_search(str, true)
            }
            break
        // TODO
        // case "jpn":
        //     break
        // case "vie":
        //     break
        case "rus":
        case "deu":
            index.encode = default_encoder
            break
        default:
            index.encode = default_encoder
            break
    }
}