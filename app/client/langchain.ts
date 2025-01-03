import { env } from "process";
import { Message } from "../message/Message";
import { runPyodide } from "../pyodide/pyodide";
import { ControllablePromise } from "../utils/controllable-promise";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatAlibabaTongyi } from "@langchain/community/chat_models/alibaba_tongyi";
import { ChatMinimax } from "@langchain/community/chat_models/minimax";
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import Locale from "../locales"
import { ChatMoonshot } from "@langchain/community/chat_models/moonshot";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { ChatTencentHunyuan } from "@langchain/community/chat_models/tencent_hunyuan/web";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGroq } from "@langchain/groq";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatYandexGPT } from "@langchain/yandex/chat_models";


interface LangChainChatModel {
    endpoint,
    defaultFields?,
    openaiConfig?
}

export const LangChainChatProviders = new Map<string, LangChainChatModel>([
    ["anthropic", {
        endpoint: ChatAnthropic   
    }],
    ["openai", {
        endpoint: ChatOpenAI,
    }],
    ["groq", {
        endpoint: ChatGroq
    }],
    ["mistral", {
        endpoint: ChatMistralAI
    }],
    ["cohere", {
        endpoint: ChatCohere
    }],
    ["yandex", {
        endpoint: ChatYandexGPT,
        defaultFields: {modelVersion: "latest"}
    }],
    ["tongyi", {
        endpoint: ChatAlibabaTongyi,
    }],
    ["minimax", {
        endpoint: ChatMinimax,
        defaultFields: { botSetting: [{ bot_name: Locale.NextChat.Name, content: Locale.NextChat.SystemPrompt(), },] },
    }],
    ["moonshot", {
        endpoint: ChatMoonshot,
    }],
    ["deepseek", {
        endpoint: ChatOpenAI,
        openaiConfig: {baseURL: "https://api.deepseek.com/v1"}
    }],
]);

export function getLangChainChatModel(provider: string, fields: object, model: string): (messages: Message[], onUpdate?: (message: string) => void) => ControllablePromise<string> {
    return function (messages: Message[], onUpdate?: (message: string) => void): ControllablePromise<string> {
        return new ControllablePromise(async (resolve, reject, cancel) => {
            let chunk = ""
            class StreamCallbackHandler extends BaseCallbackHandler {
                name: string = "onUpdate";
                async handleLLMNewToken(token) {
                    chunk += token
                    onUpdate?.(chunk)
                }
            }
            const p: any = LangChainChatProviders.get(provider)
            fields["streaming"] = true
            fields["model"] = model
            fields["callbacks"] = [new StreamCallbackHandler()]
            if (p.defaultFields) { fields = { ...p.defaultFields, ...fields } }
            const chat = p.openaiConfig?new p.endpoint(fields, p.openaiConfig):new p.endpoint(fields)
            const msgs: BaseMessage[] = messages.map(msg => new (msg.role == "user" ? HumanMessage : msg.role == "assistant" ? AIMessage : SystemMessage)(msg.content))
            resolve((await chat.invoke(msgs)).text)
        })
    }
}