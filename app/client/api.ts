import { getClientConfig } from "../config/client";
import {
  ACCESS_CODE_PREFIX,
  // Azure,
  CAPTION_API_URL,
  CHAT_API_URL,
  EMBED_API_URL,
  // ModelProvider,
  PAINT_API_URL,
  SEARCH_API_URL,
  // SERVER_URL,
  ServiceProvider,
  STT_API_URL,
  VIDEO_CAPTION_URL,
} from "../constant";
import { ModelType, useAccessStore, useChatStore } from "../store";
// import { ChatGPTApi } from "./platforms/openai";
// import { GeminiProApi } from "./platforms/google";
// import { ClaudeApi } from "./platforms/anthropic";
// import { LocalApi } from "./local";
import { Message } from "../message/Message";
import { ControllablePromise } from "../utils/controllable-promise";
import { wrapFunction } from "./function-call";
// import { MarkdownMessage } from "../message/TextMessage";
export const ROLES = ["system", "user", "assistant"] as const;
export type MessageRole = (typeof ROLES)[number];

export const Models = ["gpt-3.5-turbo", "gpt-4"] as const;
export type ChatModel = ModelType;

export interface MultimodalContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
  };
  html?: string
}


// 纯糟粕，已用新的Message系统取代

// export interface RequestMessage {
//   role: MessageRole;
//   //content: string | MultimodalContent;
//   content: string
//   // markdown?: string
//   /**
//    * 要渲染的内容输到markdown里面去，
//    * 哪怕是高级内容也以html形式内嵌到markdown（图片转base64嵌入之类的）
//    * 给ai看的内容输到content里面去，以防html项过长
//    * 如果markdown被留空，则拿content顶上
//    * 看看这套机制好不好用，没啥毛病就用下去了
//    */
// }


export interface LLMConfig {
  model: string;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface ChatOptions {
  messages: Message[];
  config: LLMConfig;
  smart?: boolean;

  onUpdate?: (message: string, chunk: string) => void;
  onFinish: (message: string) => void;
  onError?: (err: Error) => void;
  onController?: (controller: AbortController) => void;
}

export interface LLMUsage {
  used: number;
  total: number;
}

export interface LLMModel {
  name: string;
  available: boolean;
  provider: LLMModelProvider;
}

export interface LLMModelProvider {
  id: string;
  providerName: string;
  providerType: string;
}

// export abstract class LLMApi {
//   // abstract chat(options: ChatOptions): Promise<void>;
//   // abstract usage(): Promise<LLMUsage>;
//   // abstract models(): Promise<LLMModel[]>;

//   abstract chat(
//     messages: Message[],
//     onUpdate?: (message: string) => void,
//     options?: {
//       model?: "regular" | "smart" /*| "long-context" | "multi-modal"*/
//     }
//   ): ControllablePromise<string>
// }

// export abstract class EmbedApi {
//   abstract embed(strs: string[]): Promise<number[][]>;
//   abstract length(): number;
//   abstract id(): string
// }

// export abstract class CaptionApi {
//   abstract caption(img: File): Promise<string>;
// }

// export abstract class RerankApi {
//   abstract rerank(query: string, candidates: string[]): Promise<number[]>
// }

// type ProviderName = "openai" | "azure" | "claude" | "palm";

// interface Model {
//   name: string;
//   provider: ProviderName;
//   ctxlen: number;
// }

// interface ChatProvider {
//   name: ProviderName;
//   apiConfig: {
//     baseUrl: string;
//     apiKey: string;
//     summaryModel: Model;
//   };
//   models: Model[];

//   chat: () => void;
//   usage: () => void;
// }

// 好了，现在是全都重构了一遍了
// // 按理说应该把platforms底下的接口全部移除
// // 设置函数改为无参
// // 但怕乱改把哪给改坏了
// // 所以现在就只是把原有构造函数无效化
// // 同时直接将llm定向至自己的平台nnchat
// const zeechung = new ZeeChungApi()
// const local = new LocalApi()

type FileLike = File | Blob | string

async function parseFileLike(file: FileLike): Promise<string> {
  if (file instanceof File) {
    return await new Promise<string>((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  } else if (file instanceof Blob) {
    return await new Promise<string>((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsDataURL(new File([file], "file"))
    })
  }
  return file as string
}

function testJson(json:string){
  try {
    JSON.parse(json)
    return true
  } catch (e) {
    return false
  }
}

export class ClientApi {

  // static async login(username: string, password: string) {
  //   const resp = await fetch(`${SERVER_URL}/login`, {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       username: username,
  //       password: password
  //     })
  //   })
  //   const text = JSON.parse(await resp.text())
  //   if (text.error) {
  //     return text.error
  //   }
  //   const token = text.token
  //   localStorage.setItem("nnchat-account-token", token)
  //   localStorage.setItem("nnchat-account-username", username)
  //   localStorage.setItem("nnchat-account-password", password)
  // }

  static chat(
    messages: Message[],
    onUpdate?: (message: string) => void,
    options?: {
      model?: "regular" | "smart" | "long"
      tools?: {
        function: Function,
        description?: {
          function?: string,
          params?: {}
        }
      }[]
    }
  ){
    return new ControllablePromise<string>(async (resolve, reject, abort) => {
      const resp = await fetch(CHAT_API_URL, {
        method: "POST",
        body:JSON.stringify({
          messages: messages.map(msg => {
            return {
              role: msg.role,
              content: msg.content
            }
          }),
          model: options?.model ?? "regular",
          tools: (options?.tools ?? []).map(tool => wrapFunction(tool.function, tool.description))
        })
      })
      const reader = resp.body?.getReader()
      const decoder = new TextDecoder()
      let msg = ""
      async function read() {
        reader?.read().then(async ({ done, value }) => {
          if (done || abort(msg) || !testJson(decoder.decode(value))) {
            resolve(msg)
          } else {
            const resp = JSON.parse(decoder.decode(value))
            if(resp["result"]){
              msg += resp["result"]
              onUpdate?.(msg)
            } 
            if(resp["tool_call"]){
              var result = await options?.tools?.find(tool => tool.function.name == resp["tool_call"]["name"])?.function(...Object.values(JSON.parse(resp["tool_call"]["args"])))
              const subpromise = ClientApi.chat(
                [
                  ...messages,
                  {type:"text", role:"assistant", content:`
                    我想要调用函数：${resp["tool_call"]["name"]}
                    调用函数的参数为：${resp["tool_call"]["args"]}
                  `},
                  {type:"text", role:"user", content:`函数执行结果：${JSON.stringify(result)}`}
                ],
                (m)=>{
                  if(abort(msg+"\n"+m)){
                    subpromise.abort()
                  }else{
                    onUpdate?.(msg+"\n"+m)
                  }
                }
              )
              subpromise.then(m=>{
                resolve(msg+"\n"+m)
              })
            }
            read()
          }
        })
      }
      read()
    })
  }

  // static chat(
  //   messages: Message[],
  //   onUpdate?: (message: string) => void,
  //   options?: {
  //     model?: "regular" | "smart" | "long"
  //     tools?: {
  //       function: Function,
  //       description?: {
  //         function?: string,
  //         params?: {}
  //       }
  //     }[]
  //   }
  // ): ControllablePromise<string> {
  //   // return zeechung.chat(messages, onUpdate, options)
  //   async function cb(messages, chunk, resolve, reject, abort) {
  //     const resp = await fetch(`${SERVER_URL}/chat`, {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         token: localStorage.getItem("nnchat-account-token"),
  //         messages: messages.map(msg => {
  //           return {
  //             role: msg.role,
  //             content: msg.content
  //           }
  //         }),
  //         model: options?.model ?? "regular",
  //         tools: (options?.tools ?? []).map(tool => wrapFunction(tool.function, tool.description))
  //       })
  //     })
  //     if (!resp.ok) { reject("[Connection Error]") }
  //     const reader = resp.body?.getReader()
  //     const decoder = new TextDecoder()
  //     let toolcall = ""
  //     let functionName = ""
  //     async function read() {
  //       reader?.read().then(async ({ done, value }) => {
  //         for (let json of decoder.decode(value).split("\n")) {
  //           try {
  //             // console.log(json)
  //             const response = JSON.parse(json)
  //             if (abort(chunk)) {
  //               resolve(chunk)
  //             } else if (response.error == "INVALID_TOKEN") {
  //               await ClientApi.updateToken()
  //               cb(messages, chunk, resolve, reject, abort)
  //             } else if (response.result) {
  //               chunk += response.result
  //               onUpdate?.(chunk)
  //               read()
  //             } else if (response.toolcall != undefined) {
  //               toolcall += response.toolcall
  //               functionName = response.function
  //               read()
  //             } else {
  //               if (toolcall != "") {
  //                 var result = await options?.tools?.find(tool => tool.function.name == functionName)?.function(...Object.values(JSON.parse(toolcall)))
  //                 console.log(`[Tool Call] ${JSON.stringify({
  //                   toolcall: JSON.parse(toolcall),
  //                   result: result
  //                 }, null, 2)}`)
  //                 cb(messages.concat([
  //                   {
  //                     role: "assistant",
  //                     content: toolcall
  //                   },
  //                   {
  //                     role: "system",
  //                     content: JSON.stringify({
  //                       returnValue: result
  //                     })
  //                   }
  //                 ]), chunk, resolve, reject, abort)
  //               } else {
  //                 resolve(chunk)
  //               }
  //             }
  //           } catch (error) { }
  //         }
  //       })
  //     }
  //     read()
  //   }
  //   return new ControllablePromise(async (resolve, reject, abort) => {
  //     cb(messages, "", resolve, reject, abort)
  //   })
  // }

  static caption(
    img: FileLike,
    prompt?: string,
    onUpdate?: (message: string) => void
  ): ControllablePromise<string> {
    return new ControllablePromise(async (resolve, reject, abort) => {
      const resp = await fetch(CAPTION_API_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem("nnchat-account-token"),
          image: await parseFileLike(img),
          prompt: prompt ?? "描述图像内容"
        })
      })
      if (!resp.ok) { reject("[Connection Error]") }
      const reader = resp.body?.getReader()
      const decoder = new TextDecoder()
      let chunk = ''
      async function read() {
        reader?.read().then(async ({ done, value }) => {
          if(done){
            resolve(chunk)
          }else{
            for(let json of decoder.decode(value).split("\n")){
              try{
                const resp = JSON.parse(json)
                chunk += resp['result']
                onUpdate?.(chunk)
              }catch(e){}
            }
            read()
          }
        })
      }
      read()
    })
  }
  static embed = (strs: string[]):Promise<number[][]> => {
    return new Promise(resolve=>{
      fetch(EMBED_API_URL, {
        method:"POST",
        body: JSON.stringify(strs)
      }).then(response => response.json())
      .then(data => {
        resolve(data);
      })
    })
  }
  // static rerank = (query: string, candidates: string[]) => {
  //   return local.rerank(query, candidates)
  // }
  static stt(
    audio: FileLike
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      fetch(STT_API_URL, {
        method: 'POST',
        body: JSON.stringify({
          // src: "https://dashscope.oss-cn-beijing.aliyuncs.com/samples/audio/sensevoice/rich_text_example_1.wav"
          src: await parseFileLike(audio)
        })
      })
        .then(response => response.text())
        .then(data => {
          resolve(data);
        })
    })
  }
  static async paint(
    prompt: string,
    image?: FileLike
  ):Promise<string> {
    const resp = await fetch(PAINT_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        ...(image?{image: await parseFileLike(image)}:{})
      })
    })
    const img_url = await resp.text()
    const img_resp = await fetch(img_url);
    const blob = await img_resp.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return dataUrl as string;
  }
  static async search(
    query: string,
    count = 4,
    index = 0
  ):Promise<{result:{url:string, digest:string}[]}> {
    const resp = await fetch(SEARCH_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        query,
        count,
        index
      })
    })
    const data = await resp.json()
    return data
  }

  static async videoCaption(
    video: FileLike,
    prompt?: string,
    onUpdate?: (chunk: string) => void,
  ){
    return new Promise(async (resolve, reject) => {
      const resp = await fetch(VIDEO_CAPTION_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem("nnchat-account-token"),
          image: await parseFileLike(video),
          prompt: prompt ?? "描述视频内容"
        })
      })
      if (!resp.ok) { reject("[Connection Error]") }
      const reader = resp.body?.getReader()
      const decoder = new TextDecoder()
      let chunk = ''
      async function read() {
        reader?.read().then(async ({ done, value }) => {
          if(done){
            resolve(chunk)
          }else{
            for(let json of decoder.decode(value).split("\n")){
              try{
                const resp = JSON.parse(json)
                chunk += resp['result']
                onUpdate?.(chunk)
              }catch(e){}
            }
            read()
          }
        })
      }
      read()
    })
  }

  // public llm: LLMApi;
  // public embed: EmbedApi;
  // public caption: CaptionApi
  // public rerank: RerankApi

  // constructor(provider: ModelProvider = ModelProvider.GPT) {
  //   /*switch (provider) {
  //     case ModelProvider.GeminiPro:
  //       this.llm = new GeminiProApi();
  //       break;
  //     case ModelProvider.Claude:
  //       this.llm = new ClaudeApi();
  //       break;
  //     default:
  //       this.llm = new ChatGPTApi();
  //   }*/
  //   let nnchat = new NNChatApi()
  //   let local = new LocalApi()
  //   this.llm = nnchat
  //   this.caption = nnchat
  //   this.embed = local
  //   this.rerank = local
  // }

  // private config() { }

  // private prompts() { }

  // private masks() { }

  // private async share(messages: Message[], avatarUrl: string | null = null) {
  //   const msgs = messages
  //     .map((m) => ({
  //       from: m.role === "user" ? "human" : "gpt",
  //       value: m.content,
  //     }))
  //     .concat([
  //       {
  //         from: "human",
  //         value:
  //           "Share from [NextChat]: https://github.com/Yidadaa/ChatGPT-Next-Web",
  //       },
  //     ]);
  //   // 敬告二开开发者们，为了开源大模型的发展，请不要修改上述消息，此消息用于后续数据清洗使用
  //   // Please do not modify this message

  //   console.log("[Share]", messages, msgs);
  //   const clientConfig = getClientConfig();
  //   const proxyUrl = "/sharegpt";
  //   const rawUrl = "https://sharegpt.com/api/conversations";
  //   const shareUrl = clientConfig?.isApp ? rawUrl : proxyUrl;
  //   const res = await fetch(shareUrl, {
  //     body: JSON.stringify({
  //       avatarUrl,
  //       items: msgs,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     method: "POST",
  //   });

  //   const resJson = await res.json();
  //   console.log("[Share]", resJson);
  //   if (resJson.id) {
  //     return `https://shareg.pt/${resJson.id}`;
  //   }
  // }

  // private static async updateToken() {
  //   const resp = await fetch(`${SERVER_URL}/login`, {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       username: localStorage.getItem("nnchat-account-username"),
  //       password: localStorage.getItem("nnchat-account-password")
  //     })
  //   })
  //   const text = JSON.parse(await resp.text())
  //   if (text.error) {
  //     return text.error
  //   }
  //   const token = text.token
  //   localStorage.setItem("nnchat-account-token", token)
  // }
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
