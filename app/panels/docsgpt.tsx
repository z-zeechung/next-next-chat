import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { Markdown } from "../components/markdown";
import NNCHATIcon from "../icons/nnchat.svg"
import { useNavigate } from "react-router-dom";

export function DocsGPT(){
    const navigate = useNavigate()
    const ref = useRef<HTMLIFrameElement>(null)
    useEffect(()=>{
        if(ref.current&&ref.current.contentWindow){
            ref.current.contentWindow.localStorage.setItem = (key, value)=>{
                localStorage.setItem("nnchat-3rd-party-docsgpt-"+key, value)
            }
            ref.current.contentWindow.localStorage.getItem = (key)=>{
                return localStorage.getItem("nnchat-3rd-party-docsgpt-"+key)
            }
        }
    })
    return <>
        <iframe ref={ref} src="/3rd-party/docsgpt.html" style={{position:"absolute", width:"100%", height:"100%", border:"none", top:0, left:0}}/>
        <Button icon={<NNCHATIcon/>} style={{position:"fixed", top:16, right:16}} onClick={()=>{navigate("/")}}>
            <Markdown content="回到 $N^2\text{CHAT}$"/>
        </Button>
    </>
}