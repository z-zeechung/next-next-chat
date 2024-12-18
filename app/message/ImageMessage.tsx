import { nanoid } from "nanoid";
import { Message } from "./Message";
import { MessageRole } from "../typing";
import { memo, useEffect, useRef, useState } from "react";
import { getFromSessionIDB, removeFromSessionIDB } from "../utils/indexedDB"
import { Card } from "@chakra-ui/react";
import { TinyButton } from "../themes/theme";
import DownloadIcon from "../icons/bootstrap/download.svg"
import { FileFrame } from "../file-frame/file-frame";

export interface ImageMessage {
    type: "image"
    src: string
    role: MessageRole
    content: string
}

export const ImageMessageElement = memo(_ImageMessageElement)

function _ImageMessageElement(props: { message: ImageMessage, getLfsData: (string)=>Promise<string> }) {

    const [url, setUrl] = useState("")

    useEffect(() => {
        props.getLfsData(props.message.src).then(src=>{setUrl(src)})
    })

    return <div style={{
            width: window.innerWidth / 2.5,
        height: window.innerHeight / 2.5,
        overflow: "scroll",
    }}>
        <FileFrame src={url} name={".png"}/>
    </div>

    return <div style={{ position: "relative" }}>
        <img src={url} style={{ borderRadius: "10px" }} />
        {/* <div style={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            right: "4px",
            bottom: "4px",
            background: "#fff7",
            alignItems: "center",
            padding: "1px",
            paddingLeft: "6px",
            borderRadius: "1000px",
        }}>
            <div style={{ color: "black" }}>{props.message.src.split("/").reverse()[0]}</div>
        </div> */}
    </div>
}

// export class ImageMessage implements Message {

//     id: string
//     date = new Date()
//     role: MessageRole
//     content: string
//     transient: boolean
//     streaming: boolean
//     isError: boolean
//     type: string

//     sessonId: string
//     fileName: string

//     constructor(role: MessageRole, sessonId: string, messageId: string, fileName:string, desc: string, options?: { streaming?: boolean, transient?: boolean, isError?: boolean }) {
//         this.role = role
//         this.content = desc
//         this.transient = (options ?? {}).transient ?? false
//         this.streaming = (options ?? {}).streaming ?? false
//         this.isError = (options ?? {}).isError ?? false
//         this.type = "image"
//         this.sessonId = sessonId
//         this.id = messageId
//         this.fileName = fileName
//     }

//     static render(props:{msg: ImageMessage}) {
//         const ref = useRef(null)
//         const [loaded, setLoaded] = useState(false)
//         useEffect(() => {
//             getFromSessionIDB(props.msg.sessonId, props.msg.id).then(src=>{
//                 if (ref.current) {
//                     (ref.current as any).src = src
//                     setLoaded(true)
//                 }
//             })
//         })
//         return <div style={{position:"relative"}}>
//             <img ref={ref} style={{borderRadius:"10px"}}/>
//             {loaded&&<div style={{
//                 display:"flex",
//                 flexDirection:"row",
//                 position:"absolute",
//                 right: "4px",
//                 bottom: "4px",
//                 background: "#EDF2F77f",
//                 alignItems:"center",
//                 padding:"1px",
//                 paddingLeft:"6px",
//                 borderRadius:"1000px"
//             }}>
//                 <div style={{opacity:0.7}}>{props.msg.fileName}</div>
//                 <div style={{width:"4px"}}/>
//                 <TinyButton
//                     text="下载"
//                     type="text"
//                     icon={<DownloadIcon/>}
//                     onClick={()=>{
//                         const a = document.createElement('a');
//                         a.href = (ref.current as any).src;
//                         a.download = props.msg.fileName;
//                         document.body.appendChild(a);
//                         a.click();
//                         document.body.removeChild(a);
//                     }}
//                 />
//             </div>}
//         </div>
//     }

//     static revoke(msg:ImageMessage){
//         removeFromSessionIDB(msg.sessonId, msg.id)
//     }
// }