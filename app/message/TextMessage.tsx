import { MessageRole } from "../typing";
import { Message } from "./Message";

import dynamic from "next/dynamic";
import LoadingIcon from "../icons/three-dots.svg";
import { nanoid } from "nanoid";
import { Markdown } from "../components/markdown";

export interface TextMessage{
    type: "text"
    role: MessageRole
    content: string
}

export function TextMessageElement(props:{message:TextMessage}){
    return <Markdown content={props.message.content}/>
}

// export class MarkdownMessage implements Message{

//     id = nanoid()
//     date = new Date()
//     role:MessageRole
//     content:string
//     transient: boolean
//     streaming: boolean
//     isError: boolean
//     type: string
    
//     constructor(role:MessageRole, content:string, options?:{streaming?:boolean, transient?:boolean, isError?:boolean}){
//         this.role = role
//         this.content = content
//         this.transient = (options??{}).transient??false
//         this.streaming = (options??{}).streaming??false
//         this.isError = (options??{}).isError??false
//         this.type = "markdown"
//     }

//     static render(props:{msg:MarkdownMessage}){
//         return <Markdown content={props.msg.content}/>
//     }

//     static revoke(msg:MarkdownMessage){
        
//     }
// }