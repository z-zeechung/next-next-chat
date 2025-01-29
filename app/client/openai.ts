import OpenAI from "openai";
import { Message } from "../message/Message";
import { JsonSchema, Tool } from "../typing";
import { ControllablePromise } from "../utils/controllable-promise";
import { ChatApi } from "./api";
import { jsonSchemaWrapper } from "./api-wrappers";

export function getOpenAiApi(
    baseUrl: string,
    apiKey: string,
    model: string,
    search?: boolean    // has search ability
): ChatApi {
    const openai = new OpenAI({ baseURL: baseUrl, apiKey: apiKey, dangerouslyAllowBrowser: true })
    const api = (
        messages: Message[],
        onUpdate?: (message: string) => void,
        tools?: Tool[],
        schema?: JsonSchema
    )=>{
        return new ControllablePromise<string>(async (resolve, reject, abort)=>{
            const enableSearch = search&&tools?.find(tool=>tool.function.name=="web_search")
            if(search){tools = tools?.filter(tool=>tool.function.name!="web_search")}
            const completion = await openai.chat.completions.create({
                model: model,
                messages: messages as any,
                stream: true,
                tools: tools?.length??0>=1?tools:undefined,
                response_format: {type: schema?"json_object":"text"},
                ...(enableSearch?{
                    enable_search:true
                }:{})
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
    return jsonSchemaWrapper(api)
}