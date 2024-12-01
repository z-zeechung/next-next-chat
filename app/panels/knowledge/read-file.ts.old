import { ClientApi } from "@/app/client/api";
import { readDoc, readDocx, readHTML, readPDF, readPPTx, readTxt } from "@/app/utils/readfile";
import { jina } from "./jina";

export async function readFile(file:File, parseImage?:boolean){
    const read = ()=>{
        switch(file.name.split('.').pop()?.toLowerCase()){
            case 'html':
            case 'htm':
                return readHTML(file)
            case 'doc':
                return readDoc(file)
            case 'docx':
                return readDocx(file)
            case 'pptx':
                return readPPTx(file)
            case 'pdf':
                return readPDF(file)
            default:
                return readTxt(file)
        }
    }
    let text = await read()
    if(parseImage){
        const RE = /\!\[.*?\]\((.*?)\)/g
        function multiMatch(regex, text) {
            let match
            const matches = [] as any[]
            while ((match = regex.exec(text)) !== null) {
                matches.push(match[1])
            }
            return matches
        }
        const matches = multiMatch(RE, text)
        for(let url of new Set(matches)){
            let desc = await ClientApi.caption(url, `
                使用markdown语法，将图片中识别到的文字转换为markdown格式输出。你必须做到：
                1. 输出和使用识别到的图片的相同的语言，例如，识别到英语的字段，输出的内容必须是英语。
                2. 不要解释和输出无关的文字，直接输出图片中的内容。例如，严禁输出 “以下是我根据图片内容生成的markdown文本：”这样的例子，而是应该直接输出markdown。
                3. 内容不要包含在\`\`\`markdown \`\`\`中、段落公式使用 $$ $$ 的形式、行内公式使用 $ $ 的形式、忽略掉长直线、忽略掉页码。
                再次强调，不要解释和输出无关的文字，直接输出图片中的内容。
            `)
            desc = "{image content: "+desc.split("\n").join(" ").trim()+"}"
            text = text.replaceAll(`(${url})`, desc)
        }
    }else{
        text = text.replace(/\!\[(.*?)\]\(.*?\)/g, " image:[$1] ")
    }
    text = text.replace(/\[(.*?)\]\(.*?\)/g, " href:[$1] ")

    return text
}

export function chunk(text: string, size=512){
    let ret = [] as string[]
    let cur = ""
    for(let t of jina(text)??[""]){
        cur += t
        if(cur.replaceAll(' ', "").length > size){
            ret.push(cur)
            cur = ""
        }
    }
    return ret
}