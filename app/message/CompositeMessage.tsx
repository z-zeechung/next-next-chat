import { MessageRole } from "../typing"
import { Message } from "./Message"

export interface CompositeMessage{
    type: "composite"
    role: MessageRole
    content: string
    children: Message[]
}

export function CompositeMessageElement(props:{message:CompositeMessage}){
    return <>TODO</>
}