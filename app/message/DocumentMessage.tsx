import { memo, useEffect, useRef, useState } from "react"
import { MessageRole } from "../typing"
import { Message } from "./Message"
import { getFromSessionIDB, removeFromSessionIDB } from "../utils/indexedDB"
import { asBlob } from "html-docx-js-typescript"
import { renderToString } from "react-dom/server"
import { Markdown } from "../components/markdown"
import { readDoc } from "../utils/readfile"
import * as docx from 'docx-preview';
import { useWindowSize } from "../utils"
import { TinyButton } from "../themes/theme"
import { DocxDisplay } from "./document/DocxDisplay"
import { FileFrame } from "../file-frame/file-frame"

export interface DocumentMessage {
    type: "document"
    fileName?: string
    src: string
    role: MessageRole
    content: string
}

export function DocumentMessageElement(props: { message: DocumentMessage, getLfsData: (string)=>Promise<string> }) {
    const [small, setSmall] = useState(true)
    const { width, height } = useWindowSize();
    // const [src, setSrc] = useState("")

    const fileName = props.message.fileName ?? ""

    useEffect(()=>{
        // props.getLfsData(props.message.src).then(src=>{setSrc(src)})
    })

    return <div style={{
        width: window.innerWidth / 2.5,
        height: window.innerHeight / 2.5,
        overflow: "scroll",
    }}>
        <FileFrame src={props.message.src} name={fileName}/>
    </div>

    // return <>
    //     <div style={{
    //         overflow: "scroll",
    //         borderRadius: "10px"
    //     }}>
    //         <div style={{
    //             width: small ? 1000 / 3 : width * 0.7,
    //             height: small ? 618 / 3 : height * 0.7,
    //             overflow: "scroll",
    //             position: "relative"
    //         }}>
    //             <div style={{
    //                 zoom: small ? 0.5 : 1,
    //                 width: "100%",
    //                 height: "100%"
    //             }}>
    //                 {fileName.endsWith(".docx") && <DocxDisplay src={src} />}
    //             </div>
    //         </div>
    //         {/* <div style={{
    //             display: "flex",
    //             flexDirection: "row",
    //             position: "absolute",
    //             right: "4px",
    //             bottom: "4px",
    //             background: "#EDF2F77f",
    //             alignItems: "center",
    //             padding: "1px",
    //             paddingLeft: "6px",
    //             borderRadius: "1000px"
    //         }}>
    //             <div style={{ opacity: 0.7 }}>{fileName}</div>
    //             <div style={{ width: "4px" }} />
    //             <TinyButton
    //                 text={small ? "放大" : "缩小"}
    //                 type="text"
    //                 onClick={() => {
    //                     setSmall(!small)
    //                 }}
    //             />
    //         </div> */}
    //     </div>
    // </>
}

// export class DocumentMessage implements Message {

//     id: string
//     date = new Date()
//     role: MessageRole
//     content: string
//     transient: boolean
//     streaming: boolean
//     isError: boolean
//     type: string

//     sessionId: string
//     fileName: string

//     constructor(role: MessageRole, sessionId: string, messageId: string, fileName: string, summary: string, options?: { streaming?: boolean, transient?: boolean, isError?: boolean }) {
//         this.role = role
//         this.content = summary
//         this.transient = (options ?? {}).transient ?? false
//         this.streaming = (options ?? {}).streaming ?? false
//         this.isError = (options ?? {}).isError ?? false
//         this.type = "document"
//         this.sessionId = sessionId
//         this.id = messageId
//         this.fileName = fileName
//     }

//     static render(props: { msg: DocumentMessage }) {
//         const { width, height } = useWindowSize();
//         const [small, setSmall] = useState(true)
//         return <>
//             <div style={{
//                 overflow:"scroll",
//                 borderRadius:"10px"
//             }}>
//                 <div style={{
//                     width: small ? 1000 / 3 : width * 0.7,
//                     height: small ? 618 / 3 : height * 0.7,
//                     overflow: "scroll",
//                     position: "relative"
//                 }}>
//                     <div style={{
//                         zoom: small ? 0.5 : 1,
//                         width: "100%",
//                         height: "100%"
//                     }}>
//                         <DocumentMessage._render msg={props.msg} />
//                     </div>
//                 </div>
//             </div>
//             <div style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 position: "absolute",
//                 right: "4px",
//                 bottom: "4px",
//                 background: "#EDF2F77f",
//                 alignItems: "center",
//                 padding: "1px",
//                 paddingLeft: "6px",
//                 borderRadius: "1000px"
//             }}>
//                 <div style={{ opacity: 0.7 }}>{props.msg.fileName}</div>
//                 <div style={{ width: "4px" }} />
//                 <TinyButton
//                     text={small ? "放大" : "缩小"}
//                     type="text"
//                     onClick={() => {
//                         setSmall(!small)
//                     }}
//                 />
//             </div>
//         </>
//     }

//     static _render(props: { msg: DocumentMessage }) {
//         if (props.msg.fileName.endsWith(".pdf")) {
//             const ref = useRef(null)
//             useEffect(() => {
//                 getFromSessionIDB(props.msg.sessionId, props.msg.id).then(arr => {
//                     if (ref.current) {
//                         const blob = new Blob([arr], { type: "application/pdf" })
//                         const url = URL.createObjectURL(blob);
//                         (ref.current as any as HTMLIFrameElement).src = url
//                         return () => {
//                             URL.revokeObjectURL(url)
//                         }
//                     }
//                 })
//             })
//             return <iframe src="" ref={ref} style={{ width: "100%", height: "100%" }} />
//         } else if (props.msg.fileName.endsWith(".docx")) {
//             const ref = useRef(null)
//             useEffect(() => {
//                 getFromSessionIDB(props.msg.sessionId, props.msg.id).then(arr => {
//                     if (ref.current) {
//                         const containerElement = ref.current as any;
//                         docx.renderAsync(new Blob([arr]), containerElement)
//                     }
//                 })
//             })
//             return <div ref={ref} />
//         } else if (props.msg.fileName.endsWith(".md")) {
//             const ref = useRef(null)
//             useEffect(() => {
//                 getFromSessionIDB(props.msg.sessionId, props.msg.id).then(arr => {
//                     if (ref.current) {
//                         const text = new TextDecoder('utf-8').decode(arr);
//                         var iframeDoc = ((ref.current as any).contentDocument ||
//                             (ref.current as any).contentWindow.document)
//                         iframeDoc.body.innerHTML = renderToString(<Markdown content={text} />)
//                     }
//                 })
//             })
//             return <iframe src="" ref={ref} style={{ width: "100%", height: "100%" }} />
//         } else if (props.msg.fileName.endsWith(".htm") || props.msg.fileName.endsWith(".html") || props.msg.fileName.endsWith(".mhtml")) {
//             const ref = useRef(null)
//             useEffect(() => {
//                 getFromSessionIDB(props.msg.sessionId, props.msg.id).then(arr => {
//                     if (ref.current) {
//                         const parser = new DOMParser();
//                         const doc = parser.parseFromString(new TextDecoder("utf-8").decode(arr), "text/html");
//                         (ref.current as any as HTMLIFrameElement).contentDocument!.body.innerHTML = doc.body.innerHTML
//                     }
//                 })
//             })
//             return <iframe ref={ref} style={{ width: "100%", height: "100%" }} />
//         } else if (props.msg.fileName.endsWith(".doc")) {
//             const ref = useRef(null)
//             useEffect(() => {
//                 getFromSessionIDB(props.msg.sessionId, props.msg.id).then(arr => {
//                     if (ref.current) {
//                         let blob = new Blob([arr]);
//                         let file = new File([blob], props.msg.fileName);
//                         readDoc(file).then(text => {
//                             (ref.current as any as HTMLDivElement).innerText = text
//                         })
//                     }
//                 })
//             })
//             return <div ref={ref} style={{
//                 fontFamily: "monospace",
//                 whiteSpace: "pre",
//                 overflow: "scroll"
//             }} />
//         } else {
//             const ref = useRef(null)
//             useEffect(() => {
//                 getFromSessionIDB(props.msg.sessionId, props.msg.id).then(arr => {
//                     if (ref.current) {
//                         const blob = new Blob([arr])
//                         const url = URL.createObjectURL(blob);
//                         (ref.current as any as HTMLIFrameElement).src = url
//                         return () => {
//                             URL.revokeObjectURL(url)
//                         }
//                     }
//                 })
//             })
//             return <iframe src="" ref={ref} style={{ width: "100%", height: "100%" }} />
//         }
//     }

//     static revoke(msg:DocumentMessage){
//         removeFromSessionIDB(msg.sessionId, msg.id)
//     }
// }