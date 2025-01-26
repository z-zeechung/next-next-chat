import { getClientConfig } from "../config/client"
import { ACCESS_CODE_PREFIX, ServiceProvider } from "../constant"
import { DocumentMessage } from "../message/DocumentMessage"
import { Message } from "../message/Message"
import { useAccessStore, useChatStore } from "../store"
import { readDocument, readDocx } from "../utils/readfile"
import { createPersistStore } from "../utils/store"
import { getOpenAiApi } from "./openai"
import { ControllablePromise } from "../utils/controllable-promise"
import { Tool } from "../typing"
import { ImageMessage } from "../message/ImageMessage"
import { Tongyi } from "./tongyi"
import { DeepSeek } from "./deepseek"
import { BochaAI } from "./bochaai"
import { Qianfan } from "./qianfan"
import { Moonshot } from "./moonshot"
import { Spark } from "./spark"

export interface Provider {
    name: string,
    fields: string[],
    chat?: ChatProvider,
    caption?: CaptionProvider,
    paint?: PaintProvider,
    search?: SearchProvider
}

const Providers = new Map<string, Provider>([
    ["tongyi", Tongyi],
    ["deepseek", DeepSeek],
    ["qianfan", Qianfan],
    ["moonshot", Moonshot],
    ["spark", Spark],
    ["bochaai", BochaAI],
    ["exa", {
        name: "Exa",
        fields: []
    }],
    ["duckduckgo", {
        name: "DuckDuckGo",
        fields: []
    }]
])


interface ChatProvider {
    models: ChatModel[],
    default: string,
    defaultSmart: string,
    defaultLong: string,
    getApi: (options?: any) => ChatApi
}
interface ChatModel {
    name: string,
    context: number
}
export type ChatApi = (
    messages: Message[],
    onUpdate?: (message: string) => void,
    tools?: Tool[]
) => ControllablePromise<string>

const ChatProviders = new Map<string, ChatProvider>([
    ["tongyi", Tongyi.chat!],
    ["deepseek", DeepSeek.chat!],
    ["qianfan", Qianfan.chat!],
    ["moonshot", Moonshot.chat!],
    // ["spark", Spark.chat!]
])


interface CaptionProvider {
    models: CaptionModel[],
    default: string,
    getApi: (options?: any) => CaptionApi
}
interface CaptionModel {
    name: string
}
export type CaptionApi = (
    img: string,
    prompt?: string,
    onUpdate?: (message: string) => void
) => ControllablePromise<string>
const CaptionProviders = new Map<string, CaptionProvider>([
    ["tongyi", Tongyi.caption!],
    ["qianfan", Qianfan.caption!],
    ["moonshot", Moonshot.caption!]
])


interface PaintProvider {
    models: PaintModel[],
    default: string,
    getApi: (options?: any) => PaintApi
}
interface PaintModel {
    name: string
}
export type PaintApi = (
    prompt: string,
    negativePrompt: string
) => Promise<string>
const PaintProviders = new Map<string, PaintProvider>([
    ["tongyi", Tongyi.paint!],
    ["qianfan", Qianfan.paint!]
])


interface SearchProvider {
    getApi: (options?: any) => SearchApi
}
export type SearchApi = (
    query: string,
    count: number
) => Promise<{ url: string, digest: string }[]>
const SearchProviders = new Map<string, SearchProvider>([
    ["bochaai", BochaAI.search!]
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
    },
    caption: {
        provider: undefined as string | undefined,
        model: undefined as string | undefined,
    },
    paint: {
        provider: undefined as string | undefined,
        model: undefined as string | undefined,
    },
    search: {
        provider: undefined as string | undefined,
    }
}

const STORAGE_NAME = "nnchat-client-api-states"

export const useApiConfig = createPersistStore(
    DEFAULT_STATE,
    (set, get) => ({
        setProvider: (api: "chat" | "chat-smart" | "chat-long" | "caption" | "paint" | "search", provider: string) => {
            if (api == "caption") {
                set({
                    ...(get()),
                    caption: {
                        provider,
                        model: CaptionProviders.get(provider)!.default
                    }
                })
                return
            } else if (api == "paint") {
                set({
                    ...(get()),
                    paint: {
                        provider,
                        model: PaintProviders.get(provider)!.default
                    }
                })
                return
            } else if (api == "search") {
                set({
                    ...(get()),
                    search: {
                        provider,
                    }
                })
                return
            }
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
        getProvider(api: "chat" | "chat-smart" | "chat-long" | "caption" | "paint" | "search") {
            if (api == "caption") {
                return get().caption.provider
            } else if (api == "paint") {
                return get().paint.provider
            } else if (api == "search") {
                return get().search.provider
            }
            const name = { chat: "chat", "chat-smart": "chatSmart", "chat-long": "chatLong" }[api]
            return get()[name].provider
        },
        getProviders(api: "chat" | "chat-smart" | "chat-long" | "caption" | "paint" | "search"): string[] {
            if (api == "caption") {
                return Array.from(CaptionProviders.keys()).sort()
            } else if (api == "paint") {
                return Array.from(PaintProviders.keys()).sort()
            } else if (api == "search") {
                return Array.from(SearchProviders.keys()).sort()
            }
            return Array.from(ChatProviders.keys()).sort()
        },
        getProviderName(id) {
            return Providers.get(id)?.name
        },
        setModel(api: "chat" | "chat-smart" | "chat-long" | "caption" | "paint", model: string) {
            if (api == "caption") {
                set({
                    ...(get()),
                    caption: {
                        ...(get().caption),
                        model
                    }
                })
                return
            } else if (api == "paint") {
                set({
                    ...(get()),
                    paint: {
                        ...(get().paint),
                        model
                    }
                })
                return
            }
            const name = { chat: "chat", "chat-smart": "chatSmart", "chat-long": "chatLong" }[api]
            set({
                ...(get()),
                [name]: {
                    ...(get()[name]),
                    model
                },
            })
        },
        getModel(api: "chat" | "chat-smart" | "chat-long" | "caption" | "paint") {
            if (api == "caption") {
                return get().caption.model
            } else if (api == "paint") {
                return get().paint.model
            }
            const name = { chat: "chat", "chat-smart": "chatSmart", "chat-long": "chatLong" }[api]
            return get()[name].model
        },
        getModels(api: "chat" | "chat-smart" | "chat-long" | "caption" | "paint") {
            if (api == "caption") {
                return CaptionProviders.get(get().caption.provider!)!.models.map(model => model.name)
            } else if (api == "paint") {
                return PaintProviders.get(get().paint.provider!)!.models.map(model => model.name)
            }
            const name = { chat: "chat", "chat-smart": "chatSmart", "chat-long": "chatLong" }[api]
            const provider = get()[name].provider
            return ChatProviders.get(provider)!.models.map(model => model.name)
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
            if (get().caption.provider) {
                ret.push({ provider: get().caption.provider!, fields: Providers.get(get().caption.provider!)!.fields })
            }
            if (get().paint.provider) {
                ret.push({ provider: get().paint.provider!, fields: Providers.get(get().paint.provider!)!.fields })
            }
            if (get().search.provider) {
                ret.push({ provider: get().search.provider!, fields: Providers.get(get().search.provider!)!.fields })
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
    static chat(
        messages: Message[],
        onUpdate?: (message: string) => void,
        options?: {
            model?: "regular" | "smart" | "long"
            tools?: Tool[]
        }
    ): ControllablePromise<string> {
        const state: typeof DEFAULT_STATE = localStorage.getItem(STORAGE_NAME) ? JSON.parse(localStorage.getItem(STORAGE_NAME)!).state : DEFAULT_STATE
        const name = { "regular": "chat", "smart": "chatSmart", "long": "chatLong" }[options?.model ?? "regular"]
        const provider = state[name].provider
        const fields = state.fields[provider]
        fields["model"] = state[name].model!

        const api = ChatProviders.get(provider)?.getApi(fields)

        let tools: Tool[] = options?.tools ?? []
        if (options?.tools?.find(tool => tool.function.name == "vision")) {
            tools = tools.filter(tool => tool.function.name != "vision")
            tools.push({
                type: "function",
                function: {
                    name: "vision",
                    description: "询问视觉模型以获取图像内容",
                    parameters: {
                        type: "object",
                        properties: {
                            "image": {
                                type: "string",
                                description: "图像的文件名称，你可以在历史记录中看到可用的图像名称",
                                enum: messages.filter(m => m.type == "image").map(m => (m as ImageMessage).fileName)
                            },
                            "prompt": {
                                type: "string",
                                description: "你想询问的关于图像的内容。请注意，由于视觉模型看不到你与用户的历史对话，因此你要替用户把问题问清楚"
                            }
                        },
                        required: ["image", "prompt"]
                    },
                }
            })
        }
        if (options?.model != "long" && options?.tools?.find(tool => tool.function.name == "long_context")) {
            tools = tools.filter(tool => tool.function.name != "long_context")
            tools.push({
                type: "function",
                function: {
                    name: "long_context",
                    description: "调用长文本模型来解析文档",
                    parameters: {
                        type: "object",
                        properties: {
                            "doc": {
                                type: "string",
                                description: "文档的文件名称，你可以在历史记录中看到可用的文档名称",
                                enum: messages.filter(m => m.type == "document").map(m => (m as DocumentMessage).fileName)
                            },
                            "prompt": {
                                type: "string",
                                description: "你想询问的关于文档的内容。"
                            }
                        },
                        required: ["doc", "prompt"]
                    },
                }
            })
        }

        return new ControllablePromise<string>(async (resolve, reject, abort) => {
            const resp = await api?.(
                messages,
                (m) => {
                    if (abort(m)) {
                        return
                    }
                    onUpdate?.(m)
                },
                tools
            )!
            if (typeof resp != "string") {
                try {
                    const toolName = resp["toolName"]
                    if (toolName == "vision") {
                        onUpdate?.(`\`\`\` toolcall
                        [{
                            "title": "正在观察图片",
                            "status": "pending",
                            "description": ${JSON.stringify(resp["prompt"])}
                        }]
\`\`\`              `)
                        const url = (messages.find(m => m.type == "image" && m.fileName == resp["image"]) as ImageMessage).src
                        resolve(await ClientApi.caption(
                            url,
                            resp["prompt"],
                            (m) => {
                                if (abort(m)) {
                                    return
                                }
                                onUpdate?.(`\`\`\` toolcall
                                ${JSON.stringify([
                                    {
                                        title: "完成",
                                        status: "success"
                                    },
                                    {
                                        status: "pending",
                                        content: m
                                    }
                                ])}
\`\`\`                      `)
                            }
                        ))
                    } else if (toolName == "long_context") {
                        onUpdate?.(`\`\`\` toolcall
                        [{
                            "title": "正在阅读文档",
                            "status": "pending",
                            "description": ${JSON.stringify(resp["prompt"])}
                        }]
\`\`\`              `)
                        const url = (messages.find(m => m.type == "document" && m.fileName == resp["doc"]) as DocumentMessage).src
                        const blob = (await (await fetch(url)).blob())
                        let text = await readDocument(new File([blob], resp["doc"]))
                        text = text.replace(/\!\[(.*?)\]\(.*?\)/g, " image:[$1] ")
                        text = text.replace(/\[(.*?)\]\(.*?\)/g, " href:[$1] ")
                        resolve(await ClientApi.chat(
                            [
                                {
                                    type: "text", role: "system", content: `
                                ################################################
                                    ${resp["doc"]}
                                ################################################

                                ${text}
                            `},
                                { type: "text", role: "user", content: resp["prompt"] }
                            ],
                            (m) => {
                                if (abort(m)) {
                                    return
                                }
                                onUpdate?.(`\`\`\` toolcall
                                ${JSON.stringify([
                                    {
                                        title: "完成",
                                        status: "success"
                                    },
                                    {
                                        status: "pending",
                                        content: m
                                    }
                                ])}
\`\`\`                     `)
                            },
                            { model: "long" }
                        ))
                    } else {
                        const result = await tools.find(tool => tool.function.name == resp["toolName"])!.call!(resp)
                        const _messages = messages.slice()
                        _messages.push({
                            role: "assistant", content: "",
                            tool_calls: [{ id: resp["toolName"], type: "function", function: { arguments: JSON.stringify(resp), name: resp["toolName"] } }],
                        } as any)
                        _messages.push({
                            type: "text", role: "tool", content: `调用${resp["toolName"]}工具的返回结果：${result}`,
                            tool_call_id: resp["toolName"]
                        } as any)
                        resolve(ClientApi.chat(
                            _messages,
                            (m) => {
                                if (abort(m)) {
                                    return
                                }
                                onUpdate?.(m)
                            },
                            { model: options?.model }
                        ))
                    }
                } catch(e) {
                    console.log("[TOOLCALL ERROR]", e)
                    resolve(await api?.(
                        messages,
                        (m) => {
                            if (abort(m)) {
                                return
                            }
                            onUpdate?.(m)
                        }
                    ) ?? "")
                }
            } else {
                resolve(resp)
            }
        })
    }
    static caption(
        img: string,
        prompt?: string,
        onUpdate?: (message: string) => void
    ): ControllablePromise<string> {
        const state: typeof DEFAULT_STATE = localStorage.getItem(STORAGE_NAME) ? JSON.parse(localStorage.getItem(STORAGE_NAME)!).state : DEFAULT_STATE
        const provider = state.caption.provider!
        const fields = state.fields[provider]
        fields["model"] = state.caption.model!

        const api = CaptionProviders.get(provider)?.getApi(fields)

        return new ControllablePromise<string>(async (resolve, rejects, abort) => {
            resolve(await api?.(
                img, prompt, onUpdate
            ) ?? "")
        })
    }
    static async embed(strs: string[]):Promise<number[][]>{return []}
    stt
    static paint(
        prompt: string,
        negativePrompt: string
    ): Promise<string> {
        const state: typeof DEFAULT_STATE = localStorage.getItem(STORAGE_NAME) ? JSON.parse(localStorage.getItem(STORAGE_NAME)!).state : DEFAULT_STATE
        const provider = state.paint.provider!
        const fields = state.fields[provider]
        fields["model"] = state.paint.model!

        const api = PaintProviders.get(provider)?.getApi(fields)

        return new Promise<string>(async resolve => {
            resolve(await api!(
                prompt, negativePrompt
            ))
        })
    }
    static search(
        query: string,
        count = 4,
    ): Promise<{ url: string, digest: string }[]> {
        const state: typeof DEFAULT_STATE = localStorage.getItem(STORAGE_NAME) ? JSON.parse(localStorage.getItem(STORAGE_NAME)!).state : DEFAULT_STATE
        const provider = state.search.provider!
        const fields = state.fields[provider]

        const api = SearchProviders.get(provider)?.getApi(fields)

        return new Promise(async resolve => {
            resolve(await api!(
                query, count
            ))
        })
    }
    videoCaption
    tts
}


function getFunctionParams(func: Function): string[] {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
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

export function blobToDataURL(blob, type): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.readAsDataURL(new File([blob], "", { type }));
    });
}

export async function resizeImage(src, min, max): Promise<string> {
    return new Promise(async resolve => {
        const img = new Image();
        img.src = src
        const newSize = handleImageSize(img, min, max)
        const canvas = document.createElement("canvas")
        canvas.width = newSize.width
        canvas.height = newSize.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, newSize.width, newSize.height)
        canvas.toBlob(async (blob) => {
            const url = await blobToDataURL(blob, "image/jpeg")
            resolve(url)
        })
    })
}
function handleImageSize(image, min, max) {
    const minSize = min; // 最小尺寸
    const maxSize = max; // 最大尺寸

    let width = image.width;
    let height = image.height;

    // 计算当前尺寸与最大尺寸的比例
    const scaleWidth = width / maxSize;
    const scaleHeight = height / maxSize;

    // 取较大的比例作为缩放比例
    const scaleFactor = Math.max(scaleWidth, scaleHeight);

    // 如果图片尺寸超过最大尺寸，则进行缩放
    if (scaleFactor > 1) {
        width /= scaleFactor;
        height /= scaleFactor;
    }

    // 确保尺寸不小于最小尺寸
    if (width < minSize || height < minSize) {
        const minScaleFactor = Math.min(image.width / minSize, image.height / minSize);
        width = image.width / minScaleFactor;
        height = image.height / minScaleFactor;
    }

    // 返回缩放后的尺寸
    return {
        width: Math.round(width),
        height: Math.round(height)
    };
}