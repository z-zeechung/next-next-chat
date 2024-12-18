import { useEffect, useState } from "react";
import { TextBlock } from "../themes/theme";
import "./style.css"

export function TextFileFrame(props:{src:string}) {
    const [text, setText] = useState("")
    useEffect(()=>{
        fetch(props.src).then((res)=>res.text()).then((text)=>setText(text))
    })
    return <div className="textFrame">
        <TextBlock>
            {text}
        </TextBlock>
    </div>
}