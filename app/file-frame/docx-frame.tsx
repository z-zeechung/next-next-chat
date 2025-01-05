import { memo, useEffect, useRef } from "react";
import * as docx from 'docx-preview';

function _DocxFrame(props:{src}) {
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

export const DocxFrame = memo(_DocxFrame)