import { getClientConfig } from "../config/client"
import { ACCESS_CODE_PREFIX, ServiceProvider } from "../constant"
import { DocumentMessage } from "../message/DocumentMessage"
import { Message } from "../message/Message"
import { useAccessStore, useChatStore } from "../store"
import { readDocument, readDocx } from "../utils/readfile"
import { createPersistStore } from "../utils/store"
import { wrapFunctionCall } from "./function-call-wrapper"
import { getLangChainChatModel, LangChainChatProviders } from "./langchain"
import { z } from "zod";

interface Provider {
    name: string,
    fields: string[]
}

const Providers = new Map<string, Provider>([
    ["anthropic", {
        name: "Anthropic",
        fields: ["apiKey"],
    }],
    ["openai", {
        name: "OpenAI",
        fields: ["apiKey"],
    }],
    ["groq", {
        name: "Groq",
        fields: ["apiKey"],
    }],
    ["mistral", {
        name: "Mistral AI",
        fields: ["apiKey"],
    }],
    ["cohere", {
        name: "Cohere",
        fields: ["apiKey"],
    }],
    ["yandex", {
        name: "YandexGPT",
        fields: ["folderID", "apiKey", "iamToken"],
    }],
    ["tongyi", {
        name: "Tongyi (通义千问)",
        fields: ["alibabaApiKey"],
    }],
    ["minimax", {
        name: "Minimax",
        fields: ["minimaxGroupId", "minimaxApiKey"],
    }],
    ["moonshot", {
        name: "Moonshot (月之暗面)",
        fields: ["apiKey"],
    }],
    ["deepseek", {
        name: "DeepSeek (深度求索)",
        fields: ["apiKey"],
    }]
])


interface ChatModel {
    models: string[],
    default: string,
    defaultSmart: string,
    defaultLong: string,
    untested?: boolean
}

const ChatProviders = new Map<string, ChatModel>([
    ["anthropic", {
        models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku", "claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
        default: "claude-3-5-sonnet-20241022",
        defaultSmart: "claude-3-opus",
        defaultLong: "claude-3-5-haiku",
        untested: true
    }],
    ["openai", {
        models: ["gpt-4o", "gpt-4o-mini", "o1", "o1-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-instruct"],
        default: "gpt-4o-mini",
        defaultSmart: "o1",
        defaultLong: "o1-mini"
    }],
    // ["groq", {
    //     models: ["gemma2-9b-it", "llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama-guard-3-8b", "llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"],
    //     default: "llama-3.3-70b-versatile",
    //     defaultSmart: "llama-3.3-70b-versatile",
    //     defaultLong: "llama-3.3-70b-versatile",
    //     untested: true
    // }],
    // ["mistral", {
    //     models: ["mistral-large-latest", "pixtral-large-latest", "ministral-3b-latest", "ministral-8b-latest", "mistral-small-latest", "codestral-latest", "open-mistral-nemo", "open-codestral-mamba"],
    //     default: "mistral-small-latest",
    //     defaultSmart: "mistral-large-latest",
    //     defaultLong: "ministral-8b-latest",
    //     untested: true
    // }],
    // ["cohere", {
    //     models: ["command-r-plus", "command-r", "command", "command-light", "c4ai-aya-expanse-8b", "c4ai-aya-expanse-32b"],
    //     default: "command-light",
    //     defaultSmart: "command",
    //     defaultLong: "command-r",
    //     untested: true
    // }],
    // ["yandex", {
    //     models: ["yandexgpt-lite", "yandexgpt", "yandexgpt-32k", "llama-lite", "llama"],
    //     default: "yandexgpt-lite",
    //     defaultSmart: "yandexgpt",
    //     defaultLong: "yandexgpt-32k",
    //     untested: true
    // }],
    ["tongyi", {
        models: ["qwen-max", "qwen-plus", "qwen-turbo", "qwen-long", "qwen-math-plus", "qwen-math-turbo", "qwen-coder-plus", "qwen-coder-turbo", "qwq-32b-preview", "qwen2.5-72b-instruct", "qwen2.5-32b-instruct", "qwen2.5-14b-instruct", "qwen2.5-7b-instruct", "qwen2.5-3b-instruct", "qwen2.5-1.5b-instruct", "qwen2.5-0.5b-instruct", "qwen2-72b-instruct", "qwen2-57b-a14b-instruct", "qwen2-7b-instruct", "qwen2-1.5b-instruct", "qwen2-0.5b-instruct", "qwen1.5-110b-chat", "qwen1.5-72b-chat", "qwen1.5-32b-chat", "qwen1.5-14b-chat", "qwen1.5-7b-chat", "qwen1.5-1.8b-chat", "qwen1.5-0.5b-chat", "qwen-72b-chat", "qwen-14b-chat", "qwen-7b-chat", "qwen-1.8b-chat", "qwen2.5-math-72b-instruct", "qwen2.5-math-7b-instruct", "qwen2.5-math-1.5b-instruct", "qwen2-math-72b-instruct", "qwen2-math-7b-instruct", "qwen2.5-coder-32b-instruct", "qwen2.5-coder-14b-instruct", "qwen2.5-coder-7b-instruct", "qwen2.5-coder-3b-instruct", "qwen2.5-coder-1.5b-instruct", "qwen2.5-coder-0.5b-instruct", "baichuan2-13b-chat-v1", "baichuan2-7b-chat-v1", "chatglm-6b-v2"],
        default: "qwen-plus",
        defaultSmart: "qwen-max",
        defaultLong: "qwen-long",
    }],
    // ["minimax", {
    //     models: ["abab7-chat-preview", "abab6.5s-chat", "abab6.5g-chat", "abab6.5t-chat", "abab5.5s-chat", "abab5.5-chat"],
    //     default: "abab6.5s-chat",
    //     defaultSmart: "abab7-chat-preview",
    //     defaultLong: "abab6.5s-chat",
    // }],
    // ["moonshot", {
    //     models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    //     default: "moonshot-v1-8k",
    //     defaultSmart: "moonshot-v1-8k",
    //     defaultLong: "moonshot-v1-128k",
    // }],
    ["deepseek", {
        models: ["deepseek-chat"],
        default: "deepseek-chat",
        defaultSmart: "deepseek-chat",
        defaultLong: "deepseek-chat",
    }]
])


const DEFAULT_STATE = {
    fields: {} as object,
    chat: {
        provider: undefined as string | undefined,
        model: undefined as string | undefined,
    },
    chatSmart: {
        provider: undefined as string | undefined,
        model: undefined as string | undefined,
    },
    chatLong: {
        provider: undefined as string | undefined,
        model: undefined as string | undefined,
    }
}

const STORAGE_NAME = "nnchat-client-api-states"

export const useApiConfig = createPersistStore(
    DEFAULT_STATE,
    (set, get) => ({
        setProvider: (api: "chat" | "chat-smart" | "chat-long", provider: string) => {
            const name = { chat: "chat", "chat-smart": "chatSmart", "chat-long": "chatLong" }[api]
            const current = get()[name].provider
            if (current == provider) {
                return
            }
            set({
                ...(get()),
                [name]: {
                    provider,
                    model: ChatProviders.get(provider)![{ "chat": "default", "chat-smart": "defaultSmart", "chat-long": "defaultLong" }[api]]
                },
            })
        },
        getProvider(api: "chat" | "chat-smart" | "chat-long") {
            const name = { chat: "chat", "chat-smart": "chatSmart", "chat-long": "chatLong" }[api]
            return get()[name].provider
        },
        getProviders(api: "chat" | "chat-smart" | "chat-long"): string[] {
            return Array.from(ChatProviders.keys()).sort()
        },
        getProviderName(id){
            return Providers.get(id)?.name
        },
        setModel(api: "chat" | "chat-smart" | "chat-long", model: string) {
            const name = { chat: "chat", "chat-smart": "chatSmart", "chat-long": "chatLong" }[api]
            set({
                ...(get()),
                [name]: {
                    ...(get()[name]),
                    model
                },
            })
        },
        getModel(api: "chat" | "chat-smart" | "chat-long") {
            const name = { chat: "chat", "chat-smart": "chatSmart", "chat-long": "chatLong" }[api]
            return get()[name].model
        },
        getModels(api: "chat" | "chat-smart" | "chat-long") {
            const name = { chat: "chat", "chat-smart": "chatSmart", "chat-long": "chatLong" }[api]
            const provider = get()[name].provider
            return ChatProviders.get(provider)!.models
        },
        setField(provider: string, field: string, value: string) {
            const _fields = JSON.parse(JSON.stringify(get().fields))
            _fields[provider] = _fields[provider] || {}
            _fields[provider][field] = value
            set({
                ...(get()),
                fields: _fields,
            })
        },
        getField(provider: string, field: string) {
            return get().fields[provider]?.[field]
        },
        getFields(): { provider: string, fields: string[] }[] {
            let ret: { provider: string, fields: string[] }[] = []
            if (get().chat.provider) {
                ret.push({ provider: get().chat.provider!, fields: Providers.get(get().chat.provider!)!.fields })
            }
            if (get().chatSmart.provider) {
                ret.push({ provider: get().chatSmart.provider!, fields: Providers.get(get().chatSmart.provider!)!.fields })
            }
            if (get().chatLong.provider) {
                ret.push({ provider: get().chatLong.provider!, fields: Providers.get(get().chatLong.provider!)!.fields })
            }
            ret = ret.filter((item, index, self) => index === self.findIndex((t) => t.provider === item.provider))
            ret.sort((a, b) => {
                return a.provider.localeCompare(b.provider)
            })
            return ret
        },
    }),
    {
        name: STORAGE_NAME,
    }
)


export class ClientApi {
    static async chat(
        messages: Message[],
        onUpdate?: (message: string) => void,
        options?: {
            model?: "regular" | "smart" | "long"
            tools?: {
                function: Function,
                schemas: {
                    function: z.ZodLiteral<string>,
                    params: {[key: string]: z.ZodAny}
                }
            }[]
        }
    ) {
        const state: typeof DEFAULT_STATE = localStorage.getItem(STORAGE_NAME) ? JSON.parse(localStorage.getItem(STORAGE_NAME)!).state : DEFAULT_STATE
        const name = { "regular": "chat", "smart": "chatSmart", "long": "chatLong" }[options?.model ?? "regular"]
        const provider = state[name].provider
        if (!provider) { return "" }
        const fields = state.fields[provider]
        const model = state[name].model!
        let fn
        if (LangChainChatProviders.keys().find((item) => item === provider)) {
            fn = getLangChainChatModel(provider, fields, model) // (messages, onUpdate)
        }

        const tools = options?.tools??[]
        if(options?.model!="long" && messages.find(msg=>msg.type=="document")){
            tools.push({
                function: async (fileName: string, prompt: string) => {
                    function washImages(text: string){
                        text = text.replace(/\!\[(.*?)\]\(.*?\)/g, " image:[$1] ")
                        text = text.replace(/\[(.*?)\]\(.*?\)/g, " href:[$1] ")
                        return text
                    }
                    const blob = (await (await fetch((messages.find(msg=>msg.type=="document"&&msg.fileName==fileName) as DocumentMessage).src)).blob())
                    const file = new File([blob], fileName)
                    let text = await readDocument(file)
                    if(["docx", "htm", "html", "mhtml", "md", "pptx"].includes((fileName.split(".").pop()??"").toLowerCase())){
                        text = washImages(text)
                    }
                    const ret = await ClientApi.chat([{type:"text", role:"system", content:text}, {type:"text", role:"user", content:prompt}], undefined, {model: "long"})
                    return ret
                },
                schemas: {
                    function: z.literal("readDocument").describe(
                        "Use this tool to ask questions about the content of a user-uploaded document. " +
                        "The tool will read the document and provide answers based on its content."
                    ),
                    params: {
                        fileName: (()=>{
                            const files: string[] = []
                            for(let msg of messages){
                                if(msg.type=="document" && msg.fileName){
                                    files.push(msg.fileName)
                                }
                            }
                            if(files.length==1){
                                return z.literal(files[0])
                            }else{
                                return z.union(files.map((file)=>z.literal(file)))
                            }
                        })().describe(
                            "The name of the document to ask about. " +
                            `Available documents are listed above.`
                        ),
                        prompt: z.string().describe(
                            "The question or prompt to ask about the document. " +
                            "Be specific and clear to get the best results."
                        )
                    }
                }
            })
        }

        fn = wrapFunctionCall(fn)

        const ret = await fn(messages, onUpdate, tools)
        if(typeof ret != "string"){
            const tfn = (tools ?? []).find(tool => tool.schemas.function.value == ret.toolName).function
            const paramNames = getFunctionParams(tfn)
            const params = paramNames.map(param => ret[param])
            const result = await tfn(...params)
            messages.push({type:"text", role:"system", content:`
                TOOL CALL MESSAGE
                you, the agent, has just invoked a tool with following command:
                    ${JSON.stringify(ret)}
                this is the return value of this tool:
                    ${JSON.stringify(result)}
            `})
            return await fn(messages, onUpdate, [])
        }
        return ret
    }
    caption
    embed
    stt
    paint
    search
    videoCaption
    tts
}


function getFunctionParams(func:Function):string[] {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    return result || [];
}


export function getHeaders() {
    const accessStore = useAccessStore.getState();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };
    const modelConfig = useChatStore.getState().currentSession().mask.modelConfig;
    const isGoogle = modelConfig.model.startsWith("gemini");
    const isAzure = accessStore.provider === ServiceProvider.Azure;
    const authHeader = isAzure ? "api-key" : "Authorization";
    const apiKey = isGoogle
        ? accessStore.googleApiKey
        : isAzure
            ? accessStore.azureApiKey
            : accessStore.openaiApiKey;
    const clientConfig = getClientConfig();
    const makeBearer = (s: string) => `${isAzure ? "" : "Bearer "}${s.trim()}`;
    const validString = (x: string) => x && x.length > 0;

    // when using google api in app, not set auth header
    if (!(isGoogle && clientConfig?.isApp)) {
        // use user's api key first
        if (validString(apiKey)) {
            headers[authHeader] = makeBearer(apiKey);
        } else if (
            accessStore.enabledAccessControl() &&
            validString(accessStore.accessCode)
        ) {
            headers[authHeader] = makeBearer(
                ACCESS_CODE_PREFIX + accessStore.accessCode,
            );
        }
    }

    return headers;
}
