import { Select } from '@/app/themes/theme';
import MonacoEditor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';

export function Scripting(props:{
    useCustomScript
}) {
    return <div style={{
        width: '100%',
        height: '100%',
        position: "relative"
    }}>
        <MonacoEditor
            theme={"vs"}
            defaultLanguage={"javascript"}
            value={props.useCustomScript[0]}
            onChange={props.useCustomScript[1]}
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
                wordWrap: 'off',
                tabSize: 2
            }}
        />
        <div style={{
            position: "absolute",
            top: 0,
            right: 0
        }}>
            <Select
                options={["JavaScript"]}
            />
        </div>
    </div>
}