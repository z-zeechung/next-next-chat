import { useEffect, useState } from "react";
import { TextBlock } from "../themes/theme";
import { Markdown } from "../components/markdown";
import "./style.css"

export function HTMLFrame(props:{src:string}) {
    const [url, setUrl] = useState("")
    useEffect(()=>{
        fetch(props.src).then(res=>res.arrayBuffer()).then(data=>{
            const blob = new Blob([data], {type: "text/html"})
            const url = URL.createObjectURL(blob)
            setUrl(url)
        })
    }, [props.src])
    return <div style={{
        width: "100%",
        height: "100%",
        background: "white",
    }}>
        <iframe src={url} width={"100%"} height={"100%"}/>
    </div>
}