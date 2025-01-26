import WordIcon from "../../icons/file-icon-vectors/doc.svg"
import PPTIcon from "../../icons/file-icon-vectors/ppt.svg"
import PDFIcon from "../../icons/file-icon-vectors/pdf.svg"
import MarkdownIcon from "../../icons/file-icon-vectors/square-o/md.svg"
import HTMLIcon from "../../icons/file-icon-vectors/classic/html.svg"
import TickIcon from "../../icons/bootstrap/check-lg.svg"
import RefreshIcon from "../../icons/bootstrap/arrow-repeat.svg"
import SelectIcon from "../../icons/bootstrap/check2-circle.svg"
import LoadingIcon from "../../icons/three-dots.svg";
import AddIcon from "../../icons/bootstrap/plus-lg.svg"
import DeleteIcon from "../../icons/bootstrap/clipboard2-x.svg"
import GenerateIcon from "../../icons/bootstrap/pencil-square.svg"
import ExportIcon from "../../icons/bootstrap/download.svg"
import UploadFileIcon from "../../icons/bootstrap/file-text.svg"
import { asBlob } from 'html-docx-js-typescript'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useEffect, useRef, useState } from "react";
import "./essay.css"
import { Input, Loading, showToast } from "../../components/ui-lib"
import { ErrorBoundary } from "../../components/error"
import { IconButton } from "../../components/button"
import { useChatStore } from "../../store"
import styles from "../../components/chat.module.scss";
import dynamic from "next/dynamic"
import { Button, ButtonGroup, CheckBox, List, ListItem, Modal, TextArea } from "@/app/themes/theme"
import { renderToString } from "react-dom/server"
import emoji from "../../emoji.json"
import { insertIntoVecDB } from "@/app/utils/vectordb"
import { chunkFile } from "./misc"
// import { MarkdownMessage } from "@/app/message/TextMessage"
import { DocumentMessage } from "@/app/message/DocumentMessage"
import { nanoid } from "nanoid"
import { insertIntoSessionIDB } from "@/app/utils/indexedDB"

export function GenerateEssayIcon(){
    const [currentIndex, setCurrentIndex] = useState(0);
    const svgs = [
        <WordIcon style={{width:"16px", height:"16px"}} key={1}/>, 
        <PPTIcon style={{width:"16px", height:"16px"}} key={2}/>, 
        <PDFIcon style={{width:"16px", height:"16px"}} key={3}/>,
        <MarkdownIcon style={{width:"16px", height:"16px"}} key={4}/>,
        <HTMLIcon style={{width:"16px", height:"16px"}} key={5}/>
    ]
    let timerId:any = null
    useEffect(()=>{
        timerId = setInterval(()=>{
            setCurrentIndex((prev)=>((prev+1)%svgs.length))
        }, 2500)
        return () => clearInterval(timerId as NodeJS.Timeout);
    })
    return <TransitionGroup className="carousel-inner">
        <CSSTransition
          key={currentIndex} 
          timeout={500}
          classNames="fade"
        >
          {svgs[currentIndex]}
        </CSSTransition>
    </TransitionGroup>
}

const Markdown = dynamic(async () => (await import("../../components/markdown")).Markdown, {
    loading: () => <LoadingIcon />,
});

export function GenerateEssayModal(props:{
    setVisible:(visible:boolean)=>void
}){
    const chatStore = useChatStore()
    const session = chatStore.currentSession()
    const [currentModal, setCurrentModal] = useState("init")
    const [generateTitle, setGenerateTitle] = useState(false)
    const [role, setRole] = useState("")
    const [theme, setTheme] = useState("")
    const [title, setTitle] = useState("")
    const [requirements, setRequirements] = useState("")
    const [generatedTitles, setGeneratedTitles] = useState([] as string[])
    const [generatingTitles, setGeneratingTitles] = useState(false)
    const [generatingOutline, setGeneratingOutline] = useState(false)
    // const [body, setBody] = useState("")
    // let bodyContent = ""
    const [outline, setOutline] = useState("")

    function cleanMessages(){
        
    }

    async function generateTitles(count:number){
        setGeneratingTitles(true)
        let prompt = `我希望你作为${role}，以${theme}为主题生成${count}个PPT标题，要求能吸引人的注意。返回要求如下：
        【The response should be a list of ${count} items separated by \"\n\" (例如: 香蕉\n天气\n说明)】
        【返回的标题不用标序号，不需要用引号引出，每一行不要包含任何多余内容】`
        chatStore.onUserInput(prompt, undefined, "", false).then(()=>{
            let m = session.messages[session.messages.length-1].content as string
            setGeneratedTitles(m.split("\n"))
            setGeneratingTitles(false)
        })
    }

    async function regenerateTitles(count:number){
        setGeneratedTitles([])
        setGeneratingTitles(true)
        let prompt = `我对上述几个标题感到不满意。请你重新作为${role}，以${theme}为主题生成${count}个PPT标题，要求能吸引人的注意。返回要求如下：
        【The response should be a list of ${count} items separated by \"\n\" (例如: 香蕉\n天气\n说明)】
        【返回的标题不用标序号，不需要用引号引出，每一行不要包含任何多余内容】`
        chatStore.onUserInput(prompt, undefined, "", false).then(()=>{
            let m = session.messages[session.messages.length-1].content as string
            setGeneratedTitles(m.split("\n"))
            setGeneratingTitles(false)
        })
    }

    async function generateOutline(){
        setGeneratingOutline(true)
        let safeRequirements = requirements.replace("\n", " ").replace("\r", "")
        safeRequirements = safeRequirements==""?"无":safeRequirements
        let prompt = `我希望你使用markdown的格式，以${title}为题，生成一个只有标题的大纲，并且请遵循以下要求：
        1.如果要创建标题，请在单词或短语前面添加井号 (#) 。# 的数量代表了标题的级别。
        2.不能使用无序或者有序列表,必须全部使用添加井号 (#)的方式表示大纲结构。
        3.第一级(#)表示大纲的标题,第二级(##)表示章节的标题,第三级(###)表示章节的重点。
        4.对大纲来说，要求${safeRequirements}
        5.大纲的第一章是${title}的简介，最后一章是总结`
        chatStore.onUserInput(prompt, undefined, "", false).then(()=>{
            setGeneratingOutline(false)
        })
    }

    // async function generateBody(outline:string){
    //     for(let ln of outline.split("\n")){
    //         if(ln.includes("###")){
    //             let safeRequirements = requirements.replace("\n", " ").replace("\r", "")
    //             safeRequirements = safeRequirements==""?"无":safeRequirements
    //             let prompt = `请根据用户要求：“${safeRequirements}”，生成“${ln}”段落的正文。
    //             请确保生成的文本为plain text，不要包含标题，不要以任何特殊格式输出。只输出该段落文本，不要输出任何额外信息。`
    //             setMessageCount(messageCount+2)
    //             await chatStore.onUserInput(prompt, undefined, "", false).then((m)=>{
    //                 bodyContent += (ln+"\n"+m+"\n")
    //                 setBody(bodyContent)
    //             })
    //         }else if(ln.includes("##")){
    //             setMessageCount(messageCount+1)
    //             chatStore.update(sessionPool=>{
    //                 sessionPool.sessions[sessionPool.currentSessionIndex].messages 
    //                     = sessionPool.sessions[sessionPool.currentSessionIndex].messages.concat([
    //                         createMessage({role:"system", content:`开始生成章节：${ln}`})
    //                     ])
    //             })
    //             bodyContent += (ln+"\n")
    //             setBody(bodyContent)
    //         }else if(ln.includes("#")){
    //             setMessageCount(messageCount+1)
    //             chatStore.update(sessionPool=>{
    //                 sessionPool.sessions[sessionPool.currentSessionIndex].messages 
    //                     = sessionPool.sessions[sessionPool.currentSessionIndex].messages.concat([
    //                         createMessage({role:"system", content:`开始生成主题：${ln}`})
    //                     ])
    //             })
    //             bodyContent += (ln+"\n")
    //             setBody(bodyContent)
    //         }
    //     }
    // }

    return (<>
        {currentModal == "init" && <Modal
            title="生成文章"
            onClose={() => {
                props.setVisible(false)
            }}
            footer={<Button
                text="下一步"
                type={"primary"}
                icon={<TickIcon/>}
                onClick={() => {
                    if (role == "") { showToast("角色不能为空！"); return }
                    if (theme == "") { showToast("主题不能为空！"); return }
                    if (title == "" && (!generateTitle)) { showToast("标题不能为空！"); return }
                    if (generateTitle) {
                        setCurrentModal("gentitle")
                        generateTitles(3)
                    } else {
                        generateOutline()
                        setCurrentModal("genoutline")
                    }
                }}
            />}
        ><ErrorBoundary>
                <List>
                    <ListItem title="角色">
                        <TextArea
                            rows={1}
                            value={role}
                            onChange={(v) => { setRole(v) }}
                        />
                    </ListItem>
                    <ListItem title="主题">
                        <TextArea
                            value={theme}
                            onChange={(v) => { setTheme(v) }}
                        />
                    </ListItem>
                    <ListItem title="标题">
                        <TextArea
                            rows={1}
                            value={title}
                            onChange={(v) => { setTitle(v) }}
                            disabled={generateTitle}
                            leftAttachment={<CheckBox
                                checked={generateTitle}
                                onClick={(chk) => {
                                    setGenerateTitle(chk)
                                }}
                                text="生成标题"
                            />}
                        />
                    </ListItem>
                    <ListItem title="要求">
                        <TextArea
                            value={requirements}
                            onChange={(v) => { setRequirements(v) }}
                        />
                    </ListItem>
                </List>
            </ErrorBoundary></Modal>}
        {currentModal == "gentitle" && <Modal
            title={"选择标题" + title}
            onClose={() => {
                cleanMessages()
                props.setVisible(false)
            }}
            footer={<>
                <Button
                    text="换一换"
                    disabled={generatingTitles}
                    onClick={() => { regenerateTitles(3) }}
                    type={"primary"}
                    icon={<RefreshIcon/>}
                />
            </>}
        ><ErrorBoundary>
                &nbsp;为您生成如下标题：
                <br />&nbsp;
                <List>
                    {generatedTitles.length > 0 ?
                        generatedTitles.filter(m => m != "").map((m, idx) => {
                            return <ListItem
                                title={m}
                                key={idx}
                            >
                                <Button
                                    text="选择"
                                    onClick={() => {
                                        setTitle(m)
                                        generateOutline()
                                        setCurrentModal("genoutline")
                                    }}
                                    icon={<SelectIcon/>}
                                />
                            </ListItem>
                        })
                        : <LoadingIcon />}
                </List>
            </ErrorBoundary></Modal>}
        {currentModal == "genoutline" && <Modal
            title="生成大纲"
            onClose={() => {
                cleanMessages()
                props.setVisible(false)
            }}
            max={true}
            footer={<ButtonGroup>
                <Button
                    text="重新生成"
                    onClick={()=>{
                        session.messages.push(new MarkdownMessage("user", "我对刚刚生成的大纲不满意，请你重新生成。"))
                        generateOutline()
                    }}
                    icon={<RefreshIcon/>}
                    disabled={generatingOutline}
                />
                <Button
                    text="下一步"
                    type={"primary"}
                    icon={<TickIcon/>}
                    onClick={() => {
                        // generateBody(
                        //     session.messages[session.messages.length - 1].content as string
                        // )
                        setCurrentModal("genbody")
                    }}
                    disabled={generatingOutline}
                />
            </ButtonGroup>}
        ><ErrorBoundary>
                {/* <textarea
                    className={styles["chat-input"]}
                    value={session.messages[session.messages.length - 1].content as string}
                    onChange={(e) => {
                        chatStore.update((sessionPool) => {
                            let msg = sessionPool.sessions[sessionPool.currentSessionIndex].messages
                            msg[msg.length - 1].content = e.currentTarget.value
                        })
                    }}
                    disabled={generatingOutline}
                /> */}
                <OutlineBoard
                    value={session.messages[session.messages.length - 1].content as string}
                    disabled={generatingOutline}
                    onChange={(v) => {
                        chatStore.update((sessionPool) => {
                            let msg = sessionPool.sessions[sessionPool.currentSessionIndex].messages
                            msg[msg.length - 1].content = v
                        })
                    }}
                    setOutline={setOutline}
                />
            </ErrorBoundary></Modal>}
        {currentModal == "genbody" &&
            // <Modal
            //     title="生成正文"
            //     onClose={() => {
            //         cleanMessages()
            //         props.setVisible(false)
            //     }}
            //     max={true}
            // ><ErrorBoundary>
            //         <Markdown
            //             content={body + session.messages[session.messages.length - 1].content}
            //         />
            //     </ErrorBoundary></Modal>
            <GenerateBodyModal
                title={title}
                outline={outline}
                requirements={requirements}
                onClose={() => {
                    cleanMessages()
                    props.setVisible(false)
                }}
            />
        }
    </>)
}

function OutlineBoard(props:{
    value:string,
    disabled:boolean,
    onChange:(v:string)=>void
    setOutline:(o:string)=>void
}){
    const isH1 = (text:string) => ((!text.includes("## ")) && text.includes("# "))
    const isH2 = (text:string) => ((!text.includes("### ")) && text.includes("## "))
    const isH3 = (text:string) => text.includes("### ")
    let tree:any[] = []
    let md:string[] = props.value.split("\n")
    for(let ln of md){
        if(isH1(ln)){
            tree.push({node:ln.replace("# ", ""), children:[]})
            continue
        }
        if((isH2(ln)||isH3(ln))&&tree.length<0){
            tree.push({node:"未命名", children:[]})
        }
        if(isH2(ln)){
            tree[tree.length-1].children.push({node:ln.replace("## ", ""), children:[]})
            continue
        }
        if(isH3(ln)&&tree[tree.length-1].children.length<0){
            tree[tree.length-1].children.push({node:"未命名", children:[]})
        }
        if(isH3(ln)){
            const arr = tree[tree.length-1].children
            arr[arr.length-1].children.push(ln.replace("### ", ""))
        }
    }
    function treeToMd(){
        let ret = ""
        for(let elem1 of tree){
            ret += "# "+elem1.node+"\n"
            for(let elem2 of elem1.children){
                ret += "## "+elem2.node+"\n"
                for(let text of elem2.children){
                    ret += "### "+text+"\n"
                }
            }
        }
        return ret
    }
    props.setOutline(treeToMd())
    return <List>
        {tree.map((elem, idx1)=><ListItem title={(idx1+1)+""} key={idx1}>
            <List>
                <ListItem title="标题">
                    <TextArea
                        rows={1}
                        value={elem.node}
                        onChange={(v)=>{
                            tree[idx1].node = v
                            props.onChange(treeToMd())
                        }}
                        disabled={props.disabled}
                    />
                </ListItem>
                {elem.children.map((elem, idx2)=><ListItem title={(idx1+1)+"."+(idx2+1)} key={idx2}>
                    <List>
                        <ListItem title="标题">
                            <TextArea
                                rows={1}
                                value={elem.node}
                                onChange={(v)=>{
                                    tree[idx1].children[idx2].node = v
                                    props.onChange(treeToMd())
                                }}
                                disabled={props.disabled}
                            />
                        </ListItem>
                        {elem.children.map((text, idx3)=><ListItem title={(idx1+1)+"."+(idx2+1)+"."+(idx3+1)} key={idx3}>
                            <TextArea
                                rows={1}
                                value={text}
                                onChange={(v)=>{
                                    tree[idx1].children[idx2].children[idx3] = v
                                    props.onChange(treeToMd())
                                }}
                                disabled={props.disabled}
                                {...(!props.disabled&&{
                                    rightAttachment:<Button
                                    text="删除"
                                    type="primary"
                                    onClick={()=>{
                                        tree[idx1].children[idx2].children = tree[idx1].children[idx2].children.filter((elem, idx)=>idx!=idx3)
                                        props.onChange(treeToMd())
                                    }}
                                    icon={<DeleteIcon/>}
                                />
                                })}
                            />
                        </ListItem>)}
                        {!props.disabled&&<ListItem>
                            <ButtonGroup>
                                <Button
                                    text="新增"
                                    onClick={()=>{
                                        elem.children.push("新章节")
                                        props.onChange(treeToMd())
                                    }}
                                    icon={<AddIcon/>}
                                />
                                <Button
                                    text="删除"
                                    type="primary"
                                    onClick={()=>{
                                        tree[idx1].children=tree[idx1].children.filter((elem, idx)=>idx!=idx2)
                                        props.onChange(treeToMd())
                                    }}
                                    icon={<DeleteIcon/>}
                                />
                            </ButtonGroup>
                        </ListItem>}
                    </List>
                </ListItem>)}
                {!props.disabled&&<ListItem>
                    <ButtonGroup>
                        <Button
                            text="新增"
                            onClick={()=>{
                                elem.children.push({node:"新章节", children:[]})
                                props.onChange(treeToMd())
                            }}
                            icon={<AddIcon/>}
                        />
                        <Button
                            text="删除"
                            type="primary"
                            onClick={()=>{
                                tree = tree.filter((elem, idx)=>idx!=idx1)
                                props.onChange(treeToMd())
                            }}
                            icon={<DeleteIcon/>}
                        />
                    </ButtonGroup>
                </ListItem>}
            </List>
        </ListItem>)}
        {!props.disabled&&<ListItem>
            <Button
                text="新增"
                onClick={()=>{
                    tree.push({node:"新章节", children:[]})
                    props.onChange(treeToMd())
                }}
                icon={<AddIcon/>}
            />
        </ListItem>}
    </List>
}

function GenerateBodyModal(props:{
    title:string
    outline:string
    requirements:string
    onClose:()=>void
}){
    const isH1 = (text:string) => ((!text.includes("## ")) && text.includes("# "))
    const isH2 = (text:string) => ((!text.includes("### ")) && text.includes("## "))
    const isH3 = (text:string) => text.includes("### ")
    let tree:any[] = []
    let md:string[] = props.outline.split("\n")
    for(let ln of md){
        if(isH1(ln)){
            tree.push(ln.replace("# ", ""))
            continue
        }
        if(isH2(ln)){
            tree.push({node:ln.replace("## ", ""), children:[]})
            continue
        }
        if(isH3(ln)){
            const arr = tree[tree.length-1].children
            arr.push(ln.replace("### ", ""))
        }
    }

    const [count, setCount] = useState(0)
    const [text, setText] = useState("")
    const [generating, setGenerating]= useState(false)

    const chatStore = useChatStore()
    const session = chatStore.currentSession()

    async function generate(count:number){
        let buf = text+"## "+tree[count].node+"\n"; setText(buf)
        chatStore.update(sessionPool => {
            sessionPool.sessions[sessionPool.currentSessionIndex].messages
                = sessionPool.sessions[sessionPool.currentSessionIndex].messages.concat([
                    new MarkdownMessage("system", `开始生成章节：${tree[count].node}` )
                ])
        })
        setGenerating(true)
        for(let t of tree[count].children){
            buf = buf + "### " + t + "\n"; setText(buf)
            let safeRequirements = props.requirements.replace("\n", " ").replace("\r", "")
            safeRequirements = safeRequirements == "" ? "无" : safeRequirements
            let prompt = `请根据用户要求：“${safeRequirements}”，生成“${t}”段落的正文。
                          请确保生成的文本为plain text，不要包含标题，不要以任何特殊格式输出。只输出该段落文本，不要输出任何额外信息。`
            const m = await chatStore.onUserInput(t, undefined, prompt)
            buf = buf+m+"\n"; setText(buf)
        }
        setGenerating(false)
    }

    async function download(suffix: string, cb: (text: string) => any) {
        const blob = await cb(text)
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${props.title}.${suffix}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    return <Modal
        title="生成正文"
        max={true}
        onClose={()=>{
            if(generating) return
            props.onClose()
        }}
        footer={<ButtonGroup>
            <Button
                text="导出"
                icon={<ExportIcon/>}
                popover={<table>
                    <tr>
                        <td style={{padding:"4px"}}><Button
                            text="导出为Word文档"
                            type="primary"
                            icon={<WordIcon style={{width:"16px", height:"16px"}}/>}
                            onClick={()=>{
                                download("docx", async (t)=>(await asBlob(`
                                    <!DOCTYPE html>
                                    <html lang="en">
                                    <head>
                                    <!-- 一定要在这里标明编码，否则乱码 -->
                                    <meta charset="UTF-8">
                                    <title></title>
                                    </head>
                                    <body>
                                    ${renderToString(<Markdown content={t}/>)}
                                    </body>
                                    </html>
                                `)))
                            }}
                        /></td>
                        <td style={{padding:"4px"}}><Button
                            text="导出为PPT文档"
                            type="primary"
                            icon={<PPTIcon style={{width:"16px", height:"16px"}}/>}
                        /></td>
                    </tr>
                    <tr>
                        <td style={{ padding: "4px" }}><Button
                            text="导出为PDF"
                            type="primary"
                            icon={<PDFIcon style={{ width: "16px", height: "16px" }} />}
                            onClick={async () => {
                                var pdfMake = require("pdfmake/build/pdfmake")

                                var html = renderToString(<Markdown content={text} />)
                                var div = document.createElement("div")
                                div.style.opacity = "0"
                                div.style.position = "absolute"
                                div.style.left = "0"
                                div.style.top = "0"
                                div.style.width = "180mm"
                                // div.style.height = "297mm"
                                // div.style.padding = "75px"
                                div.innerHTML = html
                                document.body.appendChild(div)
                                function traverseElement(element) {
                                    if (element.nodeType === Node.ELEMENT_NODE && element.textContent.trim() !== '') {
                                        var style = window.getComputedStyle(element);
                                        // var fontSize = style.fontSize;
                                        // var fontWeight = style.fontWeight;
                                        element.childNodes.forEach(child => {
                                            traverseElement(child);
                                        });
                                        for(let child of element.childNodes){
                                            if(child.nodeType === Node.TEXT_NODE){
                                                var span = document.createElement("span")
                                                var c_arr:string[] = []
                                                for(let c of child.textContent.trim()){
                                                    c_arr.push(c)
                                                }
                                                span.innerHTML = renderToString(<>{c_arr.map((c, i)=>{
                                                    return <span key={i} className="char_span" style={{fontFamily:"serif"}}>
                                                        {c}
                                                    </span>
                                                })}</>)
                                                element.replaceChild(span, child);
                                            }
                                        }
                                    }
                                }
                                traverseElement(div);
                                var content: any = []
                                function traverseElement2(element) {
                                    if (element.nodeType === Node.ELEMENT_NODE && element.textContent.trim() !== '') {
                                        var style = window.getComputedStyle(element);
                                        // var fontSize = style.fontSize;
                                        // var fontWeight = style.fontWeight;
                                        element.childNodes.forEach(child => {
                                            traverseElement2(child);
                                        });
                                        
                                        if(element.className=="char_span"){
                                            var size = (style.fontSize.split("").filter(i=>"0123456789.".includes(i))).join("")
                                                content.push({
                                                    image:textBecomeImg(element.textContent, style.fontWeight, style.fontStyle),
                                                    width:size,
                                                    absolutePosition: {
                                                        x: element.offsetLeft+80,
                                                        y: element.offsetTop%1000+75
                                                    },
                                                    actuall_y: element.offsetTop
                                                })
                                                content.push({
                                                    text:element.textContent,
                                                    fontSize:size,
                                                    style:{
                                                        opacity: 0
                                                    },
                                                    absolutePosition: {
                                                        x: element.offsetLeft+80,
                                                        y: element.offsetTop%1000+75-2
                                                    },
                                                    actuall_y: element.offsetTop
                                                })
                                        }
                                    }
                                }
                                traverseElement2(div)
                                content.sort((a, b)=>(a.actuall_y<b.actuall_y))
                                var pageCount = 1
                                for(let elem of content){
                                    if(elem.actuall_y/1000>=pageCount){
                                        pageCount++
                                        elem.pageBreak = 'before'
                                    }
                                }
                                document.body.removeChild(div)
                                div.style.opacity = "1"
                                html = div.innerHTML
                                // console.log(content)
                                // var content = htmlToPdfmake(html)
                                // return

                                const fontURL = (font)=>document.location.origin + document.location.pathname.split('/').slice(0, -1).join('/') + '/' + font
                                pdfMake.fonts = {
                                    DefaultFont: {
                                        normal: fontURL("placeholder.ttf"),
                                        bold: fontURL("placeholder.ttf"),
                                        italics: fontURL("placeholder.ttf"),
                                        bolditalics: fontURL("placeholder.ttf")
                                    }
                                };
                                const dd = {
                                    content: content,
                                    pageSize: 'A3',
                                    defaultStyle: {
                                        font: 'DefaultFont'
                                    },
                                };
                                const pdf = pdfMake.createPdf(dd);
                                pdf.download(props.title)
                            }}
                        /></td>
                        <td style={{padding:"4px"}}><Button
                            text="导出为HTML"
                            type="primary"
                            icon={<HTMLIcon style={{width:"16px", height:"16px"}}/>}
                            onClick={()=>{
                                download("html", (t)=>new Blob([renderToString(<Markdown content={t}/>)], { type: "text/html" }))
                            }}
                        /></td>
                    </tr>
                    <tr>
                        <td style={{padding:"4px"}}><Button
                            text="导出为Markdown"
                            type="primary"
                            icon={<MarkdownIcon style={{width:"16px", height:"16px"}}/>}
                            onClick={()=>{
                                download("md", (t)=>new Blob([t], { type: 'text/plain' }))
                            }}  
                        /></td>
                        <td style={{padding:"4px"}}><Button
                            text="将文本插入对话"
                            type="primary"
                            icon={<UploadFileIcon/>}
                            disabled={generating}
                            onClick={async ()=>{
                                const blob = new Blob([text], { type: 'text/plain' });
                                const file = new File([blob], props.title, {
                                    type: 'text/plain',
                                    lastModified: Date.now()
                                });
                                let chunks = await chunkFile(file)
                                insertIntoVecDB("SESSION_VECDB_"+session.id, props.title, chunks.map(t=>{return {title:t, content:t}}))
                                const id = nanoid()
                                await new Promise(resolve=>{
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        const arrayBuffer = e.target!.result;
                                        const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer);
                                        insertIntoSessionIDB(session.id, id, uint8Array).then(resolve)
                                    };
                                    reader.readAsArrayBuffer(file);
                                })
                                chatStore.updateCurrentSession(
                                    session => (session.messages = session.messages.concat([
                                        new DocumentMessage("system", session.id, id, props.title+".md", "")
                                        // createMessage({
                                        //     role: "system",
                                        //     content: `用户向知识库注入文档：${props.title}`,
                                        //     markdown: renderToString(<>
                                        //         <table style={{ borderColor: "#0000" }}>
                                        //             <tr style={{ borderColor: "#0000" }}>
                                        //                 <td style={{ verticalAlign: "middle", borderColor: "#0000" }}>{<UploadFileIcon />}</td>
                                        //                 <td style={{ verticalAlign: "middle", borderColor: "#0000" }}><b>{props.title}</b></td>
                                        //             </tr>
                                        //         </table>
                                        //     </>)
                                        // })
                                    ])))
                                showToast("已将生成内容插入对话")
                            }}
                        /></td>
                    </tr>
                </table>}
            />
            {count<tree.length&&<Button
                text="生成"
                icon={<GenerateIcon/>}
                type="primary"
                onClick={async ()=>{
                    if(typeof tree[count] == "string"){
                        setText(text+"# "+tree[count]+"\n")
                        chatStore.update(sessionPool => {
                            sessionPool.sessions[sessionPool.currentSessionIndex].messages
                                = sessionPool.sessions[sessionPool.currentSessionIndex].messages.concat([
                                    new MarkdownMessage( "system",  `开始生成主题：${tree[count]}`)
                                ])
                        })
                        generate(count+1)
                    }else{
                        generate(count)
                    }
                    setCount(count+1)
                }}
                disabled={generating}
            />}
        </ButtonGroup>}
    >
        <ErrorBoundary>
            <Markdown
                content={generating?text+session.messages[session.messages.length - 1].content:text}
            />
        </ErrorBoundary>
    </Modal>
}



var canvas = document.createElement('canvas');
var fontsize = 64
var fontcolor = "black"
//小于32字加1  小于60字加2  小于80字加4    小于100字加6
var buHeight = 0;
if (fontsize <= 32) { buHeight = 1; }
else if (fontsize > 32 && fontsize <= 60) { buHeight = 2; }
else if (fontsize > 60 && fontsize <= 80) { buHeight = 4; }
else if (fontsize > 80 && fontsize <= 100) { buHeight = 6; }
else if (fontsize > 100) { buHeight = 10; }
//对于g j 等有时会有遮挡，这里增加一些高度
canvas.height = fontsize + buHeight;
var context = canvas.getContext('2d');
// 宽度直接等于高度，方块字就这点好
canvas.width = canvas.height

function textBecomeImg(text, fontWeight, fontFamily){

    // 擦除(0,0)位置大小为200x200的矩形，擦除的意思是把该区域变为透明
    context!.clearRect(0, 0, canvas.width, canvas.height);
    context!.fillStyle = fontcolor;
    context!.font=`${fontWeight} ${fontsize}px ${fontFamily.includes("italic")?"cursive":"serif"}`;
    //top（顶部对齐） hanging（悬挂） middle（中间对齐） bottom（底部对齐） alphabetic是默认值
    context!.textBaseline = 'middle'; 
    // 绘制坐标
    var x = 0
    var y = fontsize/2

    // 字形修正
    //if(text=="“"||text=="‘"){x=-fontsize/2.3}
    if(isEmoji(text)){context!.font=`${fontWeight} ${fontsize*0.8}px serif`;}

    context!.fillText(text,x,y)
 
    var dataUrl = canvas.toDataURL('image/png');//注意这里背景透明的话，需要使用png
    return dataUrl;
}

function isChineseChar(char: string): boolean {
    return /[\u3400-\u9fff]/.test(char);
}

function isEmoji(char: string): boolean {
    return char.match(
        /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/g
    ) !== null;
}