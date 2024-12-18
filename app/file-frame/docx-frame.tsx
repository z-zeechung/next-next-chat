import { useEffect, useRef } from "react";
import * as docx from 'docx-preview';

export function DocxFrame(props:{src}) {
    const ref = useRef(null)
    useEffect(() => {
        fetch(props.src, {method:"GET"}).then(value=>{
            value.arrayBuffer().then(value=>{
                if (ref.current) {
                    const containerElement = ref.current as any;
                    docx.renderAsync(new Blob([value]), containerElement)
                }
            })
        })
    })
    return <div ref={ref} />
}