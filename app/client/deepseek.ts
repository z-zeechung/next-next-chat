import OpenAI from "openai";
import { ChatApi, Provider } from "./api";
import { getOpenAiApi } from "./openai";
import { Message } from "../message/Message";
import { JsonSchema, Tool } from "../typing";
import { ControllablePromise } from "../utils/controllable-promise";

export const DeepSeek: Provider = {
    name: "DeepSeek (深度求索)",
    fields: ["apiKey"],
    site:"https://platform.deepseek.com/api_keys",
    chat: {
        models: [{name:"deepseek-chat", context:64*1024}, {name:"deepseek-reasoner", context:64*1024, reason: true}],
        default: "deepseek-chat",
        defaultSmart: "deepseek-chat",
        defaultReason: "deepseek-reasoner",
        defaultLong: "deepseek-chat",
        getApi(options: { apiKey: string, model: string }){
            if(options.model === "deepseek-reasoner"){
                return getDeepseekR1Api(
                    "https://api.deepseek.com/v1",
                    options.apiKey,
                    options.model,
                )
            }
            return getOpenAiApi(
                "https://api.deepseek.com/v1",
                options.apiKey,
                options.model
            )
        }
    }
}



export function getDeepseekR1Api(
    baseUrl: string,
    apiKey: string,
    model: string,
    search?: boolean    // has search ability
): ChatApi {
    const openai = new OpenAI({ baseURL: baseUrl, apiKey: apiKey, dangerouslyAllowBrowser: true })
    const api = (
        messages: Message[],
        onUpdate?: (message: string) => void
    )=>{
        return new ControllablePromise<string>(async (resolve, reject, abort)=>{
            const completion = await openai.chat.completions.create({
                model: model,
                messages: messages as any,
                stream: true
            })
            let fullContent = "``` think\n"
            let finishedThinking = false
            for await (const chunk of completion) {
                if(chunk.choices[0].delta.content){
                    if(!finishedThinking){
                        if(!fullContent.endsWith("\n")) fullContent += "\n"
                        fullContent += "```\n\n"
                        finishedThinking = true
                    }
                    fullContent += chunk.choices[0].delta.content
                }else{
                    fullContent += chunk.choices[0].delta["reasoning_content"]??""
                }
                onUpdate?.(fullContent)
                if(abort(fullContent)){
                    return
                }
            }
            resolve(fullContent)
        })
    }
    return api
}