import { useEffect, useState } from "react"

export function ImageFrame(props: { src: string, name: string}) {
    if(props.name.endsWith(".svg")) {
        return <SvgFrame src={props.src}/>
    }
    return <div>
        <img src={props.src} width={"100%"} height={"100%"} />
    </div>
}

function SvgFrame(props:{src:string}){
    const [xml, setXml] = useState("")
    useEffect(()=>{
        fetch(props.src).then(xml=>{
            return xml.text()
        }).then(xml=>{
            setXml(xml)
        })
    })
    return <div dangerouslySetInnerHTML={{__html: xml}} />
}