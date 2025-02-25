import { memo, useEffect, useState } from "react"

function PdfFrame_(props:{src:string}){
    const [src, setSrc] = useState("")
    useEffect(()=>{
        fetch(props.src).then(res=>res.arrayBuffer()).then(data=>{
            const blob = new Blob([data], {type: "application/pdf"})
            const url = URL.createObjectURL(blob)
            setSrc(url)
        })
    }, [props.src])
    return <div style={{
        width: "100%",
        height: "100%",
    }}>
        <iframe src={src} width={"100%"} height={"100%"}/>
    </div>
}

export const PdfFrame = memo(PdfFrame_)