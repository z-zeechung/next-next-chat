import OpenAI from "openai";
import { Message } from "../message/Message";
import { Tool } from "../typing";
import { ControllablePromise } from "../utils/controllable-promise";
import { ChatApi } from "./api";

export function getOpenAiApi(
    baseUrl: string,
    apiKey: string,
    model: string
): ChatApi {
    const openai = new OpenAI({ baseURL: baseUrl, apiKey: apiKey, dangerouslyAllowBrowser: true })
    return (
        messages: Message[],
        onUpdate?: (message: string) => void,
        tools?: Tool[]
    )=>{
        return new ControllablePromise(async (resolve, reject, abort)=>{
            const completion = await openai.chat.completions.create({
                model: model,
                messages: messages as any,
                stream: true,
                tools: tools?.length??0>=1?tools:undefined
            })
            let toolcall: string | undefined = undefined
            let fullContent = ""
            for await (const chunk of completion) {
                if(chunk.choices[0].delta.tool_calls){
                    if(chunk.choices[0].delta.tool_calls[0].function?.arguments){
                        fullContent += chunk.choices[0].delta.tool_calls[0].function?.arguments
                    }
                    if(!toolcall){
                        toolcall = chunk.choices[0].delta.tool_calls[0].function?.name
                    }
                }else if(!toolcall){
                    fullContent = fullContent + (chunk.choices[0].delta.content??"");
                    onUpdate?.(fullContent)
                }
                if(abort(fullContent)){
                    return
                }
            }
            if(toolcall){
                try{
                    const ret = JSON.parse(fullContent)
                    ret["toolName"] = toolcall
                    resolve(ret)
                }catch{
                    resolve(fullContent)
                }
            }else{
                resolve(fullContent)
            }
        })
    }
}