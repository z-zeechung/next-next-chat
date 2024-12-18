import { deprecate } from "util";
import { MessageRole } from "../typing";
import { DocumentMessage, DocumentMessageElement } from "./DocumentMessage";
import { ImageMessage, ImageMessageElement } from "./ImageMessage";
import { TextMessage, TextMessageElement } from "./TextMessage";
import { CompositeMessage, CompositeMessageElement } from "./CompositeMessage";

export type Message = (TextMessage | ImageMessage | DocumentMessage | CompositeMessage) 
                      & 
                      {
                        /** @deprecated */
                        id?: string
                        /** @deprecated */
                        date?:Date
                        /** @deprecated */
                        streaming?: boolean
                        /** @deprecated */
                        isError?: boolean
                      }

export function MessageElement(props:{
    message:Message
    getLfsData: (string)=>Promise<string>
}){
    switch(props.message.type){
        case "text": return <TextMessageElement message={props.message}/>
        case "image": return <ImageMessageElement message={props.message} getLfsData={props.getLfsData}/>
        case "document": return <DocumentMessageElement message={props.message} getLfsData={props.getLfsData}/>
        case "composite": return <CompositeMessageElement message={props.message}/>
    }
}

export function revokeMessage(message:Message){
    switch(message.type){
        case "document":
        case "image": {
            fetch(message.src, {method:"DELETE"})
            return
        }
    }
}

// export interface Message{
//     id:string
//     date:Date
//     role: MessageRole
//     content: string
//     transient: boolean
//     streaming: boolean
//     isError: boolean

//     type: string
// }

// export function MessageRenderer(props:{msg:Message}){
//     switch(props.msg.type){
//         case("markdown"): return <MarkdownMessage.render msg={props.msg as MarkdownMessage}/>
//         case("image"):    return <ImageMessage.render msg={props.msg as ImageMessage}/>
//         case("document"): return <DocumentMessage.render msg={props.msg as DocumentMessage}/>
//         default:          return <>{props.msg.type}</>
//     }
// }

// export function revokeMessage(msg:Message){
//     switch(msg.type){
//         case("markdown"): MarkdownMessage.revoke(msg as MarkdownMessage); return;
//         case("image"):    ImageMessage.revoke(msg as ImageMessage); return;
//         case("document"): DocumentMessage.revoke(msg as DocumentMessage); return;
//         default:          return;
//     }
// }