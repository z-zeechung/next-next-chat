import { EmbedApi, RerankApi } from "./api";

let ort: any

let embed_tokenizer: any;
let embed_session:   any;
let rerank_tokenizer: any;
let rerank_session:   any;

let inited = false

const init = async()=>{
    // 俟后实现根据所处浏览器内核环境
    // 选择性导入WASM、WebGL、WebGPU、WebNN的接口
    // import * as ort from 'onnxruntime-web'
    ort = await require("onnxruntime-web")

    const TokenizerWasm = await require("tokenizers-wasm")
    let embed_tokenizer_json = (await (await fetch("/embed_model/tokenizer.json")).text())
    embed_tokenizer = new TokenizerWasm.TokenizerWasm(embed_tokenizer_json)
    embed_session = await ort.InferenceSession.create("/embed_model/sentence_embedding_chinese_tiny.onnx")
    let rerank_tokenizer_json = (await (await fetch("/rerank_model/tokenizer.json")).text())
    rerank_tokenizer = new TokenizerWasm.TokenizerWasm(rerank_tokenizer_json)
    rerank_session = await ort.InferenceSession.create("/rerank_model/nlp_corom_passage-ranking_chinese-tiny.onnx")
}

export class LocalApi implements EmbedApi, RerankApi{

    async embed(strs: string[]): Promise<number[][]> {
        if(!inited){
            await init()
            inited = true
        }
        let ret: number[][] = []
        for(let str of strs){
            let sequence = embed_tokenizer.encode(str, true).input_ids
            let vector = await embed_session.run({
                "input_ids": new ort.Tensor(Int32Array.from(sequence), [1, sequence.length]),
                "attention_mask": new ort.Tensor(Int8Array.from({length: sequence.length}, () => 1), [1, sequence.length])
            })
            ret = ret.concat([[...(vector.output2.data as Float32Array)]])
        }
        return ret
    }

    length():number{
        return 256
    }

    id():string{
        return "local"
    }

    async rerank(query: string, candidates: string[]): Promise<number[]> {
        if(!inited){
            await init()
            inited = true
        }
        let inputs = {
            source_sentence: [query],
            sentences_to_compare: candidates
        }
        function tokenize(data:(typeof inputs)){
            function encode(text:string){return Array.from(rerank_tokenizer.encode(text, true).input_ids) as number[]}
            let ret = {
                input_ids: [] as number[][],
                token_type_ids: [] as number[][],
                attention_mask: [] as number[][],
            }
            let src_seq:number[] = encode(data.source_sentence[0])
            for(let text of data.sentences_to_compare){
                let seq:number[] = encode(text)
                seq = seq.slice(1)
                ret.token_type_ids.push(new Array(src_seq.length).fill(0).concat(new Array(seq.length).fill(1)))
                seq = src_seq.concat(seq)
                ret.attention_mask.push(new Array(seq.length).fill(1))
                ret.input_ids.push(seq)
            }
            function pad(out:(typeof ret)){
                let max_len = Math.max(... out.input_ids.map(seq=>seq.length))
                for(let i=0;i<out.input_ids.length;i++){
                    out.input_ids[i] = out.input_ids[i].concat(new Array(max_len-out.input_ids[i].length).fill(0))
                    out.token_type_ids[i] = out.token_type_ids[i].concat(new Array(max_len-out.token_type_ids[i].length).fill(0))
                    out.attention_mask[i] = out.attention_mask[i].concat(new Array(max_len-out.attention_mask[i].length).fill(0))
                }
                return out
            }
            return pad(ret)
        }
        let tokenized = tokenize(inputs)
        let vector = await rerank_session.run({
            "input_ids": new ort.Tensor(Int32Array.from(tokenized.input_ids.reduce((acc, curr) => acc.concat(curr), [])), [tokenized.input_ids.length, tokenized.input_ids[0].length]),
            "token_type_ids": new ort.Tensor(Int32Array.from(tokenized.token_type_ids.reduce((acc, curr) => acc.concat(curr), [])), [tokenized.token_type_ids.length, tokenized.token_type_ids[0].length]),
            "attention_mask": new ort.Tensor(Int32Array.from(tokenized.attention_mask.reduce((acc, curr) => acc.concat(curr), [])), [tokenized.attention_mask.length, tokenized.attention_mask[0].length]),
        })
        return [... vector.output.cpuData]
    }
} 