import { DocxFrame } from "./docx-frame"
import { HTMLFrame } from "./html-frame"
import { ImageFrame } from "./image-frame"
import { MarkdownFrame } from "./markdown-frame"
import { PdfFrame } from "./pdf-frame"
import { PptxFrame } from "./pptx-frame"
import { TextFileFrame } from "./textfile-frame"

export function FileFrame(props:{
    src: string
    name: string
}) {
    switch(props.name.split(".").slice(-1)[0].toLowerCase()){
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
        case "html": case "htm": 
            return <HTMLFrame src={props.src}/>
        case "pptx":
            return <PptxFrame src={props.src}/>
    }
    return <div>{props.name}</div>
}