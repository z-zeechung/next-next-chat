import { deprecate } from "util";
import { MessageRole } from "../typing";
import { DocumentMessage, DocumentMessageElement } from "./DocumentMessage";
import { ImageMessage, ImageMessageElement } from "./ImageMessage";
import { TextMessage, TextMessageElement } from "./TextMessage";
import { CompositeMessage, CompositeMessageElement } from "./CompositeMessage";
import { renderToString } from "react-dom/server";
import { Markdown } from "../components/markdown";
import { readHTML } from "../utils/readfile";
import { notification } from "antd";
import { message as antdMessage } from 'antd';

export type Message = (
    | TextMessage 
    | ImageMessage 
    | DocumentMessage 
    // | CompositeMessage
)
    &
{
    /** @deprecated */
    id?: string
    /** @deprecated */
    date?: Date
    /** @deprecated */
    streaming?: boolean
    /** @deprecated */
    isError?: boolean
}

export function MessageElement(props: {
    message: Message
    getLfsData: (string) => Promise<string>
}) {
    switch (props.message.type) {
        case "text": return <TextMessageElement message={props.message} />
        case "image": return <ImageMessageElement message={props.message} getLfsData={props.getLfsData} />
        case "document": return <DocumentMessageElement message={props.message} getLfsData={props.getLfsData} />
        // case "composite": return <CompositeMessageElement message={props.message} />
    }
}

export async function copyMessage(message: Message) {
    switch (message.type) {
        case "text":
            const html = renderToString(<Markdown content={message.content} />)
            const text = new DOMParser().parseFromString(html, 'text/html').body.textContent ?? "";
            const clipboardItem = new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([text], { type: 'text/plain' }),
            });
            await navigator.clipboard.write([clipboardItem])
            break
        case "image":
            const imgElement = document.createElement("img")
            imgElement.src = message.src
            await imgElement.decode()
            const canvas = document.createElement('canvas');
            canvas.width = imgElement.naturalWidth;
            canvas.height = imgElement.naturalHeight;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(imgElement, 0, 0);
            canvas.toBlob(async (blob) => {
                const clipboardItem = new ClipboardItem({ 
                    'image/png': blob!,
                });
                await navigator.clipboard.write([clipboardItem]);
            }, 'image/png');
            break
    }
    antdMessage.open({
        type: 'success',
        content: "成功复制到剪贴板",
    });
}

/** @deprecated */
export function revokeMessage(message: Message) {
    switch (message.type) {
        case "document":
        case "image": {
            fetch(message.src, { method: "DELETE" })
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