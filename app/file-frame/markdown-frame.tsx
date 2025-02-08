import { useEffect, useState } from "react";
// import { TextBlock } from "../themes/theme";
import { Markdown } from "../components/markdown";
import "./style.css"

export function MarkdownFrame(props:{src:string}) {
    const [text, setText] = useState("")
    useEffect(()=>{
        fetch(props.src).then((res)=>res.text()).then((text)=>setText(text))
    })
    return <div className="textFrame">
        <Markdown content={text}/>
    </div>
}