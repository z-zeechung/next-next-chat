import { memo, useEffect, useState } from "react";
import "./style.css"

function PptxFrame_(props:{src:string}) {
    const [url, setUrl] = useState("")
    useEffect(()=>{
        fetch(props.src).then(res=>res.arrayBuffer()).then(data=>{
            const blob = new Blob([data], {type: "text/html"})
            const url = URL.createObjectURL(blob)
            setUrl("/PPTXjs-1.21.1/ppt-frame.html?"+url)
        })
    }, [props.src])
    return <div style={{
        width: "100%",
        height: "100%",
        background: "white",
        position: "relative",
    }}>
        <div style={{
            scale:0.5,
            width: "200%",
            height: "calc(200% - 50px)",
            position: "absolute",
            top: "calc(-50% + 25px)",
            left: "-50%",
        }}>
            <iframe src={url} width={"100%"} height={"100%"}/>
        </div>
    </div>
}

export const PptxFrame = memo(PptxFrame_)