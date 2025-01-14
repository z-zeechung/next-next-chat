import { Provider } from "./api";
import { getOpenAiApi } from "./openai";

export const DeepSeek: Provider = {
    name: "DeepSeek (深度求索)",
    fields: ["apiKey"],
    chat: {
        models: [{name:"deepseek-chat", context:64*1024}],
        default: "deepseek-chat",
        defaultSmart: "deepseek-chat",
        defaultLong: "deepseek-chat",
        getApi(options: { apiKey: string, model: string }){
            return getOpenAiApi(
                "https://api.deepseek.com/v1",
                options.apiKey,
                options.model
            )
        }
    }
}