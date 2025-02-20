import { Provider } from "./api";
import { toolCallWrapper } from "./api-wrappers";
import { getDeepseekR1Api } from "./deepseek";
import { getOpenAiApi } from "./openai";

export const VolcanoArk: Provider = {
    name: "VolcanoArk (火山方舟)",
    fields: ["apiKey"],
    site: "https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey",
    chat: {
        models: [
            {
                name: "doubao-1-5-pro-32k-250115",
                context: 32 * 1024,
                search: true
            },
            {
                name: "doubao-1-5-pro-256k-250115",
                context: 256 * 1024,
                search: true
            },
            {
                name: "doubao-lite-128k-240828",
                context: 128 * 1024,
                search: true
            },
            {
                name: "deepseek-v3-241226",
                context: 16 * 1024,
            },
            {
                name: "deepseek-r1-250120",
                context: 16 * 1024,
                reason: true
            },
            {
                name: "deepseek-r1-distill-qwen-32b-250120",
                context: 32 * 1024,
                reason: true
            }
        ],
        default: "doubao-1-5-pro-32k-250115",
        defaultSmart: "deepseek-v3-241226",
        defaultReason: "deepseek-r1-250120",
        defaultLong: "doubao-lite-128k-240828",
        getApi(options: { apiKey: string, model: string }) {
            if (["deepseek-r1-250120", "deepseek-r1-distill-qwen-32b-250120"].includes(options.model)) {
                return getDeepseekR1Api(
                    "https://ark.cn-beijing.volces.com/api/v3",
                    options.apiKey,
                    options.model,
                )
            }
            const api = getOpenAiApi(
                "https://ark.cn-beijing.volces.com/api/v3",
                options.apiKey,
                options.model,
                options.model!="deepseek-v3-241226"
            )
            if (options.model == "deepseek-v3-241226") {
                return toolCallWrapper(api)
            } else {
                return api
            }
        }
    }
}