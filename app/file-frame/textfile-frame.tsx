import { useEffect, useState } from "react";
import "./style.css"
import { Typography } from "antd";

export function TextFileFrame(props:{src:string}) {
    const [text, setText] = useState("")
    useEffect(()=>{
        fetch(props.src).then((res)=>res.text()).then((text)=>setText(text))
    })
    return <div className="textFrame">
        <Typography.Paragraph>
            {text}
        </Typography.Paragraph>
    </div>
}