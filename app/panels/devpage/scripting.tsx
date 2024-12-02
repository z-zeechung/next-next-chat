import { Select } from '@/app/themes/theme';
import MonacoEditor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';

export function Scripting(props: {
    useJavaScript
}) {
    const [javascript, setJavaScript]: [string, Function] = props.useJavaScript
    const divRef = useRef(null)
    const [height, setHeight] = useState(10000)

    useEffect(() => {
        if (divRef.current) {
            setHeight((divRef.current as HTMLElement).clientHeight)
        }
    }, [setHeight])

    return <div style={{
        height: "100%",
        width: "100%",
        position: "relative"
    }}>

        <div ref={divRef} style={{
            height: "100%",
            width: "100%",
            position: "absolute"
        }}>
            <MonacoEditor
                height={height - 1}
                onChange={(v) => { setJavaScript(v) }}
                theme={"vs"}
                defaultLanguage={"javascript"}
                value={javascript}
                options={{
                    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditorConstructionOptions.html  
                    minimap: {
                        enabled: false,
                    },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    hideCursorInOverviewRuler: true,
                    matchBrackets: 'never',
                    overviewRulerBorder: false,
                    renderLineHighlight: 'none',
                    wordWrap: 'on',
                    tabSize: 2
                }}
            />
        </div>
        <div style={{ position: "absolute", right: 16, top: 0 }}>
            <Select options={["JavaScript", "Python", "Scratch"]} />
        </div>
    </div>
}