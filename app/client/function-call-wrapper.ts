import { ChatResult } from "@langchain/core/outputs"
import { ControllablePromise } from "../utils/controllable-promise"
import { BaseCallbackHandler } from "@langchain/core/callbacks/base"
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AIMessage, AIMessageChunk, BaseMessage, ChatMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { BaseChatModel, BaseChatModelCallOptions, BaseChatModelParams, BindToolsInput } from "@langchain/core/language_models/chat_models"
import { Message } from "../message/Message";
import { CallbackManagerForLLMRun, CallbackManagerForToolRun } from "@langchain/core/callbacks/manager"
import { z, ZodObject } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { OutputFixingParser } from "langchain/output_parsers"
import { wrapFunction } from "./function-call";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { Runnable } from "@langchain/core/runnables";
import { Tool, ToolRunnableConfig } from "@langchain/core/tools";


export function wrapFunctionCall(
    fn: (messages: Message[], onUpdate?: (message: string) => void) => ControllablePromise<string>
): (
    messages: Message[], 
    onUpdate?: (message: string) => void, 
    tools?: {
        function: Function,
        description?: {
            function?: string,
            params?: {}
        }
    }[]
) => ControllablePromise<string>{
    return (
        messages: Message[], 
        onUpdate?: (message: string) => void, 
        tools?: {
            function: Function,
            description?: {
                function?: string,
                params?: {}
            }
        }[]
    ): ControllablePromise<string> => {
        const msgs: BaseMessage[] = messages.map(msg => new (msg.role == "user" ? HumanMessage : msg.role == "assistant" ? AIMessage : SystemMessage)(msg.content))
        let chunk = ""
        class StreamCallbackHandler extends BaseCallbackHandler {
            name: string = "onUpdate";
            async handleLLMNewToken(token) {
                chunk += token
                onUpdate?.(chunk)
            }
        }
        async function generate(){
            const chat = new ChatNNCHAT({fn, callbacks: [new StreamCallbackHandler()]})
            const result = (await chat.invoke([
                new SystemMessage(`
                    as an ai agent, you have access to the following tools:
                        ${JSON.stringify(tools!.map(tool=>{return {[tool.function.name]: tool.description}}))}
                    currently, you are directly responding to the user. if you wanna invoke a tool, stop current generation and standby for further instructions.
                    note that you'll have to output tool call params in the follwing round of generation, RATHER THAN the current one. so FOR NOW, you should not output any tool call params.
                `),
                ...msgs
            ])).text
            msgs.push(new AIMessage(result))
            chunk += "\n\n"

            const _tools = tools?.map(tool=>new NNCHATTool(tool))??[]
            const schemas = _tools.map(tool=>tool.zodSchema).concat([
                z.object({
                    toolName: z.literal("stop").describe("when you finished tool call, call this to terminate current generation"),
                }
            )])
            const parser = StructuredOutputParser.fromZodSchema(schemas.length>1?z.union(schemas):schemas[0])
            const parserModel = new ChatNNCHAT({ fn })
            let parserMessages: BaseMessage[] = [new SystemMessage(parser.getFormatInstructions()), ...msgs, new SystemMessage("determine your next step based on the history messages, output in the format specified in the system prompt.")]
            const parserResponse = (await parserModel.invoke(parserMessages)).text;
            const fixParser = OutputFixingParser.fromLLM(parserModel, parser);
            const fixedResponse = await fixParser.parse(parserResponse);

            if(fixedResponse.toolName=="stop"){
                return true
            }else{
                const result = await _tools.find(tool=>tool.name==fixedResponse.toolName)?._call(fixedResponse)
                msgs.push(new SystemMessage(`
                    TOOL CALL MESSAGE
                    you, the agent, has just invoked a tool with following command:
                        ${JSON.stringify(fixedResponse)}
                    this is the return value of this tool:
                        ${JSON.stringify(result)}
                `))
                return false
            }
        }
        return new ControllablePromise(async resolve=>{
            while(true){
                const finish = await generate()
                if(finish){
                    resolve(chunk.slice(0, -2))
                    return
                }
            }
        })
    }
}

class NNCHATTool extends Tool {
    name: string;
    description: string;
    info: {
        name: string;
        type: string;
        description: string;
        params: {
            name: string;
            type: string;
            description: any;
        }[];
    }
    fn
    zodSchema
    constructor(nntool: {
        function: Function,
        description?: {
            function?: string,
            params?: {}
        }
    }) {
        super();
        this.info = wrapFunction(nntool.function, nntool.description)
        this.name = this.info.name
        this.description = this.info.description
        this.fn = nntool.function
        this.zodSchema = z.object({
            toolName: z.literal(this.name),
            ...Object.fromEntries(this.info.params.map(param=>[param.name, z.string().describe(param.description)]))
        })
    }
    async _call(arg: any): Promise<any> {
        const params: any[] = []
        for(let p of this.info.params){
            params.push(arg[p.name])
        }
        return this.fn(...params)
    }
}

class ChatNNCHAT extends BaseChatModel {
    fn: (messages: Message[], onUpdate?: (message: string) => void) => ControllablePromise<string>
    constructor(oprions: { fn: (messages: Message[], onUpdate?: (message: string) => void) => ControllablePromise<string> } & BaseChatModelParams) {
        super(oprions)
        this.fn = oprions.fn
    }
    _llmType(): string {
        return "nnchat"
    }
    _generate(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult> {
        const roles = {
            "human": "user",
            "ai": "assistant",
            "system": "system"
        }
        return new Promise(async resolve => {
            let counter = 0
            const result = await this.fn(
                messages.map(msg => { return { type: "text", content: msg.content, role: roles[msg.getType()] } as Message }),
                (m) => { 
                    runManager?.handleLLMNewToken(m.slice(counter))
                    counter = m.length 
                }
            )
            const response = {
                generations: [
                    {
                        text: result ?? "",
                        message: new ChatMessage({ role: "assistant", content: result ?? "" })
                    }
                ]
            }
            resolve(response)
        })
    }
}

// class ChatNNCHATWithToolCall extends BaseChatModel {
//     fn: (messages: Message[], onUpdate?: (message: string) => void) => ControllablePromise<string>
//     onUpdate?: (message: string) => void
//     tools?: NNCHATTool[];
//     constructor(oprions: { fn: (messages: Message[], onUpdate?: (message: string) => void) => ControllablePromise<string>, onUpdate?: (message: string) => void, tools?: NNCHATTool[]} & BaseChatModelParams) {
//         super(oprions)
//         this.onUpdate = oprions.onUpdate
//         this.fn = oprions.fn
//         this.tools = oprions.tools??undefined
//     }
//     _llmType(): string {
//         return "nnchat-with-toolcall"
//     }
//     async _generate(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult> {
//         if(!this.tools){
//             const chat = new ChatNNCHAT({fn: this.fn})
//             const result = (await chat.invoke(messages)).text
//             return({
//                 generations: [
//                     {
//                         text: result ?? "",
//                         message: new AIMessage({ content: result ?? "" })
//                     }
//                 ]
//             })
//         }else{
//             const schemas = this.tools.map(tool=>tool.zodSchema).concat(z.object({
//                 toolName: z.literal("respond").describe("respond directly to the user input"),
//             }))
//             const parser = StructuredOutputParser.fromZodSchema(schemas.length>1?z.union(schemas):schemas[0])
//             const parserModel = new ChatNNCHAT({ fn: this.fn })
//             let parserMessages: BaseMessage[] = [new SystemMessage(parser.getFormatInstructions()), ...messages, new SystemMessage("determine your next step based on the history messages, output in the format specified in the system prompt")]
//             const parserResponse = (await parserModel.invoke(parserMessages)).text;
//             const fixParser = OutputFixingParser.fromLLM(parserModel, parser);
//             const fixedResponse = await fixParser.parse(parserResponse);
//             if(fixedResponse.toolName=="respond"){
//                 const chat = new ChatNNCHAT({fn: this.fn})
//                 const result = (await chat.invoke(messages)).text
//                 console.log(result)
//                 return({
//                     generations: [
//                         {
//                             text: result ?? "",
//                             message: new AIMessage({ content: result ?? "" })
//                         }
//                     ]
//                 })
//             }else{
//                 const message = new AIMessage("")
//                 message.tool_calls = [{
//                     name: fixedResponse.toolName,
//                     args: fixedResponse
//                 }]
//                 return({
//                     generations: [
//                         {
//                             text: "",
//                             message
//                         }
//                     ]
//                 })
//             }
//         }
//     }
//     bindTools(tools: BindToolsInput[], kwargs?: Partial<BaseChatModelCallOptions> | undefined): Runnable<BaseLanguageModelInput, AIMessageChunk, BaseChatModelCallOptions> {
//         return new ChatNNCHATWithToolCall({
//             ...this,
//             tools
//         })
//     }
// }

// const schemas = tools!.map(tool=>{return wrapFunction(tool.function, tool.description)}).map(tool=>z.object({
//     toolName: z.literal(tool.name).describe(tool.description),
//     ...Object.fromEntries(tool.params.map(param=>[param.name, z.string().describe(param.description)]))
// }))
// const parser = StructuredOutputParser.fromZodSchema(schemas.length>1?z.union(schemas):schemas[0])
// const parserModel = new ChatNNCHAT({ fn })
// let parserMessages: any = [{type:"text", role:"system", content:parser.getFormatInstructions()}, ...messages, {type: "text", role:"system", content:"determine your next step based on the history messages, output in the format specified in the system prompt"}]
// parserMessages = parserMessages.map(msg => new (msg.role == "user" ? HumanMessage : msg.role == "assistant" ? AIMessage : SystemMessage)(msg.content))
// const parserResponse = (await parserModel.invoke(parserMessages)).text;
// const fixParser = OutputFixingParser.fromLLM(parserModel, parser);
// const fixedResponse = await fixParser.parse(parserResponse);
// console.log(fixedResponse)