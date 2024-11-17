import { memo, useEffect, useRef, useState } from "react";
import { DocumentFrame } from "./document/document-frame";
import Editor, { Command, EditorZone, IContextMenuContext, INTERNAL_CONTEXT_MENU_KEY, IRangeStyle } from '@hufe921/canvas-editor'
import TestIcon from "../icons/bootstrap/0-circle-fill.svg"
import SendIcon from "../icons/bootstrap/send.svg"
import CopyIcon from "../icons/bootstrap/copy.svg"
import ReplaceIcon from "../icons/bootstrap/pencil-square.svg"
import ReturnIcon from "../icons/bootstrap/box-arrow-up-left.svg"
import RobotIcon from "../icons/bootstrap/robot.svg";
import DocIcon from "../icons/file-icon-vectors/doc.svg"
import PDFIcon from "../icons/file-icon-vectors/pdf.svg"
import { renderToString } from "react-dom/server";
import { IControl } from "@hufe921/canvas-editor/dist/src/editor/interface/Control";
import { IPositionContextChangePayload } from "@hufe921/canvas-editor/dist/src/editor/interface/Listener";
import { Button, ButtonGroup, Card, CardBody, Input, InputGroup, InputRightAddon, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { ClientApi } from "../client/api";
// import { MarkdownMessage } from "../message/TextMessage";
import { Markdown } from "../components/markdown";
import { TextArea, Button as ThemeButton } from "../themes/theme";
import docxPlugin from '@hufe921/canvas-editor-plugin-docx'
import { ControllablePromise } from "../utils/controllable-promise";
import { showToast } from "../components/ui-lib";
import { useChatStore } from "../store";
import { useNavigate } from "react-router-dom";
import { ContextCard } from "./document/context-card";
import { useWindowSize } from "../utils";

let documentDiv = document.createElement("div")
var instance = undefined as Editor | undefined

let onScaleChange = undefined as (() => void) | undefined
let setTab = undefined as ((tab:string)=>void) | undefined
let setText = undefined as ((text:string)=>void) | undefined

export function DocxButton() {
    const navigate = useNavigate()
    return <ThemeButton text="Word文档" type="primary" icon={<DocIcon style={{ width: "16px", height: "16px" }} />} onClick={() => {
        var input = document.createElement('input')
        input.type = 'file'
        input.multiple = false
        input.accept = ".docx"
        input.onchange = () => {
            if ((input.files ?? []).length <= 0) { return }
            const file = input.files![0]
            documentDiv = document.createElement("div")
            documentDiv.style.display = "none"
            documentDiv.style.overflow = "scroll"
            document.body.appendChild(documentDiv)
            const subDiv = document.createElement("div")
            documentDiv.appendChild(subDiv)
            instance?.destroy()
            instance = new Editor(subDiv, [], {})
            instance.use(docxPlugin);
            instance.listener.pageScaleChange = () => { onScaleChange?.() }
            instance?.register.contextMenuList([
                {
                    name: "智能改写",
                    when: ()=>{return instance?.command.getRangeText().trim() !== ""},
                    callback: () => {setText?.(instance?.command.getRangeText()??""); setTab?.("rewrite")}
                },
                {
                    name: "智能释义",
                    when: ()=>{return instance?.command.getRangeText().trim() !== ""},
                    callback: () => {setText?.(instance?.command.getRangeText()??""); setTab?.("explain")}
                },
                {
                    name: "智能翻译",
                    when: ()=>{return instance?.command.getRangeText().trim() !== ""},
                    callback: () => {setText?.(instance?.command.getRangeText()??""); setTab?.("translate")}
                },
                {
                    name: "智能总结",
                    when: ()=>{return instance?.command.getRangeText().trim() !== ""},
                    callback: () => {setText?.(instance?.command.getRangeText()??""); setTab?.("conclude")}
                },
            ])
            new Promise(async resolve => {
                await (instance?.command as any | undefined)?.executeImportDocx({
                    arrayBuffer: await file.arrayBuffer()
                })
                resolve(undefined)
            }).then(() => {
                navigate("/docx")
            })
        }
        input.click()
    }}
    />
}

export function PDFButton() {
    const navigate = useNavigate()
    const {width, height} = useWindowSize()
    return <ThemeButton text="PDF文档" type="primary" icon={<PDFIcon style={{ width: "16px", height: "16px" }} />} onClick={() => {
        var input = document.createElement('input')
        input.type = 'file'
        input.multiple = false
        input.accept = ".pdf"
        input.onchange = () => {
            if ((input.files ?? []).length <= 0) { return }
            const file = input.files![0]
            documentDiv = document.createElement("div")
            documentDiv.style.display = "none"
            documentDiv.style.overflow = "scroll"
            document.body.appendChild(documentDiv)
            const subDiv = document.createElement("iframe")
            subDiv.src = URL.createObjectURL(file)
            subDiv.style.width = `${width}px`
            subDiv.style.height = "100%"
            documentDiv.appendChild(subDiv)
            
            navigate("/docx")
        }
        input.click()
    }}
    />
}

// export async function setDocxDocument(file:File){
//     instance.destroy()
//     instance = new Editor(subDiv, [], {})
//     instance.use(docxPlugin);
//     (instance.command as any).executeImportDocx({
//         arrayBuffer: await file.arrayBuffer()
//     })
// }

// var mouse_x = 0
// var mouse_y = 0
// var cur_mouse_x = 0
// var cur_mouse_y = 0

let onCardClose = undefined as (() => void) | undefined

export function DocumentDocx() {

    const ref = useRef(null)
    // const menuCardRef = useRef(null)

    // const chatStore = useChatStore()
    // const session = chatStore.currentSession()

    // const [cardMenuIndex, setCardMenuIndex] = useState(-1)
    // const [cardMenuPosition, setCardMenuPosition] = useState([0, 0])

    const [[cardX, cardY], setCardPosition] = useState([0, 0])
    const [tab, _setTab] = useState(undefined as string | undefined)

    const [text, _setText] = useState("")
    // const [rewrite, setRewrite] = useState("")
    // const [rewritePromise, setRewritePromise] = useState(new ControllablePromise(() => { }))
    // const [selectChangeStyle, setSelectChangeStyle] = useState(false)
    // const [changeStyle, setChangeStyle] = useState("")
    // const [explaination, setExplaination] = useState("")
    // const [explainationPromise, setExplainationPromise] = useState(new ControllablePromise(() => { }))
    // const [translation, setTranslation] = useState("")
    // const [transTarLang, setTransTarLang] = useState(undefined as undefined | string)
    // const [translationPromise, setTranslationPromise] = useState(new ControllablePromise(() => { }))
    // const [conclusion, setConclusion] = useState("")
    // const [conclusionPromise, setConclusionPromise] = useState(new ControllablePromise(() => { }))

    const [model, setModel] = useState("regular" as "regular" | "smart")

    // function close_menu_card() {
    // setCardMenuIndex(-1)
    // rewritePromise.abort()
    // setRewrite("")
    // explainationPromise.abort()
    // setExplaination("")
    // translationPromise.abort()
    // setTranslation("")
    // conclusionPromise.abort()
    // setConclusion("")
    // }

    useEffect(() => {

        documentDiv.style.position = "absolute"
        documentDiv.style.display = ""
        // docxDiv.style.left = `${(ref.current as any as HTMLDivElement).getBoundingClientRect().left}px`
        // docxDiv.style.right = `${window.innerWidth-(ref.current as any as HTMLDivElement).getBoundingClientRect().right}px`
        function scale_change() {
            if ((ref.current as any as HTMLDivElement).clientWidth > documentDiv.clientWidth) {
                const left = ((ref.current as any as HTMLDivElement).clientWidth - documentDiv.clientWidth) / 2
                documentDiv.style.left = `${left}px`
                documentDiv.style.right = ""
            } else {
                documentDiv.style.left = `${(ref.current as any as HTMLDivElement).getBoundingClientRect().left}px`
                documentDiv.style.right = `${window.innerWidth - (ref.current as any as HTMLDivElement).getBoundingClientRect().right}px`
            }
        }
        scale_change()
        onScaleChange = scale_change
        documentDiv.style.top = `${(ref.current as any as HTMLDivElement).getBoundingClientRect().top}px`
        documentDiv.style.bottom = `${window.innerHeight - (ref.current as any as HTMLDivElement).getBoundingClientRect().bottom}px`

        setTab = _setTab
        setText = _setText

        // function mouse_click_cb(event) {
        //     if (cardMenuIndex >= 0) {
        //         var rect = (menuCardRef.current as any as HTMLElement).getBoundingClientRect()
        //         if (!(cur_mouse_x > rect.left && cur_mouse_x < rect.right && cur_mouse_y > rect.top && cur_mouse_y < rect.bottom)) {
        //             close_menu_card()
        //         }
        //     }
        // }
        // function mouse_rightclick_cb(event) {
        //     mouse_x = event.pageX;
        //     mouse_y = event.pageY;
        // }
        // function mouse_motion_cb(event) {
        //     cur_mouse_x = event.clientX
        //     cur_mouse_y = event.clientY
        // }
        // document.body.addEventListener('click', mouse_click_cb)
        // document.body.addEventListener("contextmenu", mouse_rightclick_cb)
        // document.addEventListener('mousemove', mouse_motion_cb);

        function mouse_rightclick_cb(event) {
            if(documentDiv.contains(event.target)){
                if(!tab){
                    setCardPosition([event.pageX, event.pageY])
                }else{
                    onCardClose?.()
                    _setTab(undefined)
                }
            }
        }
        document.body.addEventListener("click", mouse_rightclick_cb)
        document.body.addEventListener("contextmenu", mouse_rightclick_cb)

        // function when() {
        //     return instance?.command.getRangeText().trim() !== ""
        // }
        // instance?.register.contextMenuList([
        //     {
        //         name: "智能改写",
        //         when: when,
        //         callback: () => {
        //             // setCardMenuPosition([mouse_x, mouse_y])
        //             // setCardMenuIndex(0)
        //             // setText(instance?.command.getRangeText()??"")
        //         }
        //     },
        //     {
        //         name: "智能释义",
        //         when: when,
        //         callback: (command: Command, context: IContextMenuContext) => {
        //             // setCardMenuPosition([mouse_x, mouse_y])
        //             // setCardMenuIndex(1)
        //             // setText(command.getRangeText())
        //             // explainationPromise.abort()
        //             // setExplainationPromise(ClientApi.chat([
        //             //     {
        //             //         type: "text", role: "user", content: `
        //             //             释义如下文本：
        //             //             ${command.getRangeText()}
        //             //         `}
        //             // ], (msg) => {
        //             //     setExplaination(msg)
        //             // }, { model: model }))
        //         }
        //     },
        //     {
        //         name: "智能翻译",
        //         when: when,
        //         callback: (command: Command) => {
        //             // setCardMenuPosition([mouse_x, mouse_y])
        //             // setCardMenuIndex(2)
        //             // setText(command.getRangeText())
        //             // translationPromise.abort()
        //             // setTranslationPromise(ClientApi.chat([
        //             //     {
        //             //         type: "text", role: "user", content: `
        //             //             翻译如下文本。如果源文本是中文，则将其翻译成英文。否则，将其翻译为中文。\n
        //             //             直接输出翻译后的文本，不要解释，不要输出任何额外内容。\n
        //             //             ${command.getRangeText()}
        //             //         `}
        //             // ], (msg) => {
        //             //     setTranslation(msg)
        //             // }, { model: model }))
        //         }
        //     },
        //     {
        //         name: "智能总结",
        //         when: when,
        //         callback: (command: Command, context: IContextMenuContext) => {
        //             // setCardMenuPosition([mouse_x, mouse_y])
        //             // setCardMenuIndex(3)
        //             // setText(command.getRangeText())
        //             // conclusionPromise.abort()
        //             // setConclusionPromise(ClientApi.chat([
        //             //     {
        //             //         type: "text", role: "user", content: `
        //             //             总结如下文本：
        //             //             ${command.getRangeText()}
        //             //         `}
        //             // ], (msg) => {
        //             //     setConclusion(msg)
        //             // }, { model: model }))
        //         }
        //     },
        // ])

        return () => {
            // document.body.removeEventListener('click', mouse_click_cb);
            // document.body.removeEventListener("contextmenu", mouse_rightclick_cb)
            // document.removeEventListener('mousemove', mouse_motion_cb);
            onScaleChange = undefined
            document.body.removeEventListener("click", mouse_rightclick_cb)
            document.body.removeEventListener("contextmenu", mouse_rightclick_cb)
            // instance?.register.getContextMenuList().forEach(menu => {
            //     if (!menu.key) {
            //         menu.when = () => false
            //     }
            // })

            documentDiv.style.display = "none"
            documentDiv.style.position = "relative"
        }
    })

    return <div style={{ height: "100%" }}><DocumentFrame
        gadgets={[
            {
                text: "切换模型",
                icon: <div style={{ position: "relative" }}>
                    <RobotIcon style={{ fill: (model == "smart" ? "#FFFB2B" : "#1D93AB"), opacity: "0.8" }} />
                    <div style={{
                        position: "absolute",
                        right: model == "smart" ? -8 : -16,
                        bottom: -8,
                        background: "#0007",
                        borderRadius: 1000,
                        fontSize: 10,
                        color: "white",
                        fontStyle: "initial"
                    }}>&nbsp;&nbsp;{model == "smart" ? "4" : "3.5"}&nbsp;&nbsp;</div>
                </div>,
                onClick: () => {
                    showToast(`已切换至${model == "regular" ? "高级" : "普通"}模型`)
                    setModel(model == "smart" ? "regular" : "smart")
                }
            }
        ]}
    >
        <div ref={ref} style={{
            width: "100%",
            height: "100%"
        }} />

        <ContextCard
            useTab={[tab as any, _setTab]}
            left={cardX}
            top={cardY}
            text={text}
            setOnCardClose={(cb)=>{onCardClose = cb}}
        />
    </DocumentFrame></div>
}

function copyToClipboard(text) {
    // 检查navigator.clipboard API是否可用
    if (navigator.clipboard) {
        // 尝试向剪贴板写入文本
        navigator.clipboard.writeText(text);
        showToast("已复制到剪贴板！")
    } else {
        // 对于不支持navigator.clipboard API的浏览器，使用老旧的document.execCommand方法
        // 注意：document.execCommand()已被废弃，并可能在未来的浏览器版本中移除
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast("已复制到剪贴板！")
    }
}

function htmlToText(content) {
    function extractTextFromHTML(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        let text = '';
        function traverse(node) {
            // script元素和style元素不能吃进来
            if (node.nodeName.toLowerCase() == "script" || node.nodeName.toLowerCase() == "style") {
                return
            }
            // 隐藏的结点忽略，防止读入其中存储的意义不明的js。说的就是你，百度
            if (node.style?.display == "none") {
                return
            }
            if (node.nodeName == "#text") {
                text += node.nodeValue;
            } else if (node.nodeType === 1) {
                node.childNodes.forEach(traverse);
            }
        }
        traverse(doc.body);
        return text;
    }
    return extractTextFromHTML(content)
}