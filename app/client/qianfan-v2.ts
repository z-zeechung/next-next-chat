import { Message } from "../message/Message";
import { ChatApi, Provider } from "./api";
import { toolCallWrapper } from "./api-wrappers";
import { getDeepseekR1Api } from "./deepseek";
import { getOpenAiApi } from "./openai";

export const QianfanV2: Provider = {
    name: "Qianfan (百度千帆)",
    fields: ["apiKey"],
    site: "https://console.bce.baidu.com/iam/#/iam/apikey/list",
    chat: {
        models: [
            {
                name: "ernie-4.0-8k",
                context: 8 * 1024,
                search: true
            },
            {
                name: "ernie-4.0-turbo-128k",
                context: 128 * 1024,
                search: true
            },
            {
                name: "ernie-3.5-128k",
                context: 128 * 1024,
                search: true
            },
            {
                name: "deepseek-v3",
                context: 16 * 1024
            },
            {
                name: "deepseek-r1",
                context: 16 * 1024,
                reason: true
            },
            {
                name: "deepseek-r1-distill-qianfan-llama-70b",
                context: 16 * 1024,
                reason: true
            }
        ],
        default: "ernie-4.0-turbo-128k",
        defaultSmart: "ernie-4.0-8k",
        defaultReason: "deepseek-r1",
        defaultLong: "ernie-3.5-128k",
        getApi(options: { apiKey: string, model: string }) {
            if (["deepseek-r1", "deepseek-r1-distill-qianfan-llama-70b"].includes(options.model)) {
                return getDeepseekR1Api(
                    "https://qianfan.baidubce.com/v2",
                    options.apiKey,
                    options.model,
                )
            }
            const api = getOpenAiApi(
                "https://qianfan.baidubce.com/v2",
                options.apiKey,
                options.model,
                options.model!="deepseek-v3",
                handleQianfanV2Messages
            )
            return toolCallWrapper(api)
        },
    }
}

function handleQianfanV2Messages(messages: Message[]): Message[] {
    const handleSystem: Message[] = []
    for(let m of messages){
        if(m.role=="system"){
            handleSystem.push({role:"user", type:"text", content:`
########################################################
SYSTEM MESSAGE
########################################################

${m.content}

########################################################
            `})
        }else{
            handleSystem.push(m)
        }
    }
    const handleOrder: Message[] = []
    if(handleSystem[0].role=="assistant"){
        handleOrder.push({role:"user", type:"text", content:EMPTY_MESSAGE})
    }
    for(let m of handleSystem){
        if(m.role=="assistant"&&handleOrder[handleOrder.length-1].role!="user"){
            handleOrder.push({role:"user", type:"text", content:EMPTY_MESSAGE})
        }
        if(m.role=="user"&&(handleOrder.length!=0&&handleOrder[handleOrder.length-1].role!="assistant")){
            handleOrder.push({role:"assistant", type:"text", content:EMPTY_MESSAGE})
        }
        handleOrder.push(m)
    }
    return handleOrder
}

const EMPTY_MESSAGE = `
#########################################################
EMPTY MESSAGE
#########################################################

THIS MESSAGE IS EMPTY. IGNORE IT.

#########################################################
`