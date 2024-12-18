import { DocxFrame } from "./docx-frame"
import { ImageFrame } from "./image-frame"
import { MarkdownFrame } from "./markdown-frame"
import { PdfFrame } from "./pdf-frame"
import { TextFileFrame } from "./textfile-frame"

export function FileFrame(props:{
    src: string
    name: string
}) {
    switch(props.name.split(".").slice(-1)[0]){
        case "jpg": case "jpeg": case "png": case "gif": case "tif": case "tiff": case "bmp":
            return <ImageFrame src={props.src}/>
        case "docx":
            return <DocxFrame src={props.src}/>
        case "pdf":
            return <PdfFrame src={props.src}/>
        case "txt":
            return <TextFileFrame src={props.src}/>
        case "md":
            return <MarkdownFrame src={props.src}/>
    }
    return <div>{props.name}</div>
}