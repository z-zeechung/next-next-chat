import { Message } from "../message/Message";
import { JsonSchema, MessageRole, Tool } from "../typing";
import { ChatApi } from "./api";
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { jsonSchemaToZod } from "json-schema-to-zod";
import { z } from "zod";
import { AIMessage, AIMessageChunk, BaseMessage, ChatMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages"
import { BaseChatModel, BaseChatModelCallOptions, BaseChatModelParams, BindToolsInput } from "@langchain/core/language_models/chat_models"
import { ChatResult } from "@langchain/core/outputs"
import { CallbackManagerForLLMRun, CallbackManagerForToolRun } from "@langchain/core/callbacks/manager"
import { OutputFixingParser } from "langchain/output_parsers"
import { ControllablePromise } from "../utils/controllable-promise";
import { TextMessage } from "../message/TextMessage";

export function jsonSchemaWrapper(api: ChatApi): ChatApi {
    return (
        messages: Message[],
        onUpdate?: (message: string) => void,
        tools?: Tool[],
        schema?: JsonSchema
    ) => {
        return new ControllablePromise<string>(async resolve => {
            if (!schema) {
                resolve(api(messages, onUpdate, tools))
                return
            }
            // json schema to zod schema
            const zodCode = jsonSchemaToZod(schema)
            const createSchema = new Function("z", `return ${zodCode}`);
            const zodSchema = createSchema(z)
            const parser = StructuredOutputParser.fromZodSchema(zodSchema)
            // ensure the prompt isn't overlength
            parser.getFormatInstructions = ()=>{
                const _schema: JsonSchema = JSON.parse(JSON.stringify(schema))
                for(let prop in _schema.properties){
                    // remove enums with too many elements
                    if(_schema.properties[prop]["enum"]
                    && JSON.stringify(_schema.properties[prop]["enum"]).length >= 1000){
                        delete _schema.properties[prop]["enum"]
                    }
                }
                return StructuredOutputParser.fromZodSchema((new Function("z", `return ${jsonSchemaToZod(_schema)}`))(z)).getFormatInstructions()
            }
            const msgs: Message[] = [{ type: "text", role: "system", content: parser.getFormatInstructions() } as Message].concat(messages)
            class ChatFixJsonSchema extends BaseChatModel {
                _llmType(): string { return "chat-json-schema"; }
                async _generate(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult> {
                    const roles = {
                        "human": "user",
                        "ai": "assistant",
                        "system": "system",
                        "tool": "tool"
                    }
                    const resp = await api(
                        messages.map(m => {
                            return {
                                role: roles[m.getType()] as MessageRole,
                                content: m.content as string,
                                type: "text"
                            }
                        }),
                        undefined,
                        undefined,
                        schema
                    )
                    return {
                        generations: [
                            {
                                text: resp ?? "",
                                message: new ChatMessage({ role: "assistant", content: resp ?? "" })
                            }
                        ]
                    }

                }
            }
            const fixModel = new ChatFixJsonSchema({})
            const fixParser = OutputFixingParser.fromLLM(fixModel, parser);
            const parserResponse = await api(msgs, undefined, tools, schema);
            // if is tool call
            if(typeof parserResponse != "string"){
                resolve(parserResponse)
                return
            }
            const fixedResponse = await fixParser.parse(parserResponse);
            resolve(JSON.stringify(fixedResponse))
        })
    }
}

// the wrapped api must be capable of json output
export function toolCallWrapper(api: ChatApi): ChatApi{
    return (
        messages: Message[],
        onUpdate?: (message: string) => void,
        tools?: Tool[],
        schema?: JsonSchema
    ) => {
        return new ControllablePromise(async (resolve, reject, abort)=>{
            const controllableOnUpdate = (msg:string)=>{
                if(abort(msg)){
                    return
                }
                onUpdate?.(msg)
            }
            if(!tools || tools.length==0){
                const ret = await api(messages, controllableOnUpdate, undefined, schema)
                resolve(ret)
                return
            }
            const selectTool = JSON.parse(await api(
                [...messages, {type:"text", role:"system", content: "Analyze user input and context to choose your next action."}],
                undefined,
                undefined,
                {
                    title: "choose next action",
                    type:"object",
                    properties:{
                        nextStep:{
                            type:"string",
                            enum:["respond"].concat(tools.map(tool=>tool.function.name)),
                            description: `
                                Select your next action from the following options:
                                - respond: Reply directly to the user input.
                                ${tools.map(tool=>{
                                    const name = tool.function.name
                                    const description = tool.function.description ?? ""
                                    return `- ${name}: ${description}`
                                })}
                            `
                        }
                    }
                }
            ))
            if(selectTool.nextStep == "respond"){
                resolve(await api(messages, controllableOnUpdate, undefined, schema))
                return
            }else{
                const tool = tools.find(tool=>tool.function.name == selectTool.nextStep)
                if(!tool){
                    resolve(await api(messages, controllableOnUpdate, undefined, schema))
                    return
                }
                const toolResponse = await api(
                    messages,
                    undefined,
                    undefined,
                    {
                        title: "tool call",
                        type:"object",
                        ...(tool.function.parameters)
                    }
                )
                resolve({toolName: tool.function.name, ...(JSON.parse(toolResponse))})
            }
        })
    }
}