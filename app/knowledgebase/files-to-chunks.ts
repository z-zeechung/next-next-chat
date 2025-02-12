import { nanoid } from "nanoid";
import { readDocument } from "../utils/readfile";
import { Chunk } from "./knowledgebase";
import { MarkdownTextSplitter } from "langchain/text_splitter";

export async function files2chunks(files: File[], setLfsData: (file:File)=>Promise<string>): Promise<Chunk[]>{
    const splitter = new MarkdownTextSplitter({
        chunkSize: 512,
        chunkOverlap: 64
    })
    const chunks: Chunk[] = [];
    for (const file of files){
        let content: string = await readDocument(file);
        content = content.replace(/\!\[(.*?)\]\(.*?\)/g, " image:[$1] ")
        content = content.replace(/\[(.*?)\]\(.*?\)/g, " href:[$1] ")
        const url = await setLfsData(file);
        const fileChunks: Chunk[] = (await splitter.splitText(content)).map(c=>{return {
            id: nanoid(),
            content: c,
            src:{
                title: file.name,
                url: url
            }
        }})
        chunks.push(...fileChunks);
    }
    return chunks;
}