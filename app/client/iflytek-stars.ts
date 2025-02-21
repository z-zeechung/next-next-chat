import { Message } from "../message/Message";
import { Provider } from "./api";
import { toolCallWrapper } from "./api-wrappers";
import { getDeepseekR1Api } from "./deepseek";
import { getOpenAiApi } from "./openai";

export const iFlytekStars: Provider = {
    name: "iFLYTEK Stars (讯飞星辰)",
    fields: [
        "apiKey",
        // "DeepSeek-V3 serviceId",
        // "DeepSeek-R1 serviceId",
        // "DeepSeek-R1-Distill-Llama-70B serviceId",
    ],
    site: "https://training.xfyun.cn/modelService",
    chat: {
        models: [
            {
                name: "DeepSeek-V3",
                context: 16 * 1024
            },
            {
                name: "DeepSeek-R1",
                context: 16 * 1024,
                reason: true
            },
            {
                name: "DeepSeek-R1-Distill-Llama-70B",
                context: 16 * 1024,
                reason: true
            }
        ],
        default: "DeepSeek-V3",
        defaultSmart: "DeepSeek-V3",
        defaultReason: "DeepSeek-R1",
        defaultLong: "DeepSeek-V3",
        getApi(options: { apiKey: string, model: string }) {
            options.model = {
                "DeepSeek-V3": "xdeepseekv3",
                "DeepSeek-R1": "xdeepseekr1",
                "DeepSeek-R1-Distill-Llama-70B": "xdeepseekr1llama70b"
            }[options.model]!
            if (["xdeepseekr1", "xdeepseekr1llama70b"].includes(options.model)) {
                return getDeepseekR1Api(
                    "https://maas-api.cn-huabei-1.xf-yun.com/v1",
                    options.apiKey,
                    options.model,
                )
            }
            const api = getOpenAiApi(
                "https://maas-api.cn-huabei-1.xf-yun.com/v1",
                options.apiKey,
                options.model,
                false,
                handleStarMessages
            )
            return toolCallWrapper(api)
        },
    }
}

function handleStarMessages(messages: Message[]): Message[] {
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