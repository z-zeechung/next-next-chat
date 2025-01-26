import { DEFAULT_SYSTEM_TEMPLATE } from "../constant"
import { Message } from "../message/Message"
import { ControllablePromise } from "../utils/controllable-promise"
import { estimateTokenLength } from "../utils/token"
import Locale from "../locales"
import { ClientApi } from "../client/api"

export function nextchatSession(
  messages: Message[],
  onUpdate?: (message: string, meta: {}) => void,
  options?: {
    model?: "regular" | "smart" | "long"
    tools?: {
      function: Function,
      description?: {
        function?: string,
        params?: {}
      }
    }[]
  },
  meta?: any
): ControllablePromise<{message, meta}> {
  return new ControllablePromise((resolve, reject, abort) => {
    const max_tokens = {"regular":4*1024, "smart":4*1024, "long":128*1024}[options?.model ?? "regular"]
    const sendMessages = [
      {type:"text", role:"system", content:DEFAULT_SYSTEM_TEMPLATE},
      ...messages
    ] as Message[]
    const chatPromise = ClientApi.chat(
      sendMessages,
      (message)=>{
        if(abort({message, meta:meta})){
          chatPromise.abort()
        }else{
          onUpdate?.(message, meta)
        }
      },
      options as any
    );
    chatPromise.then(async message=>{
      resolve({message, meta:meta})
    })
  })
}