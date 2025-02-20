import { Markdown } from "@/app/components/markdown";
import { CodeOutlined, DownOutlined, EditOutlined, EnterOutlined, FullscreenExitOutlined, FullscreenOutlined, PictureOutlined, PlusOutlined, SearchOutlined, SettingOutlined, UploadOutlined } from "@ant-design/icons"
import { Attachments, Bubble, BubbleProps, Prompts, Sender } from "@ant-design/x"
import { Avatar, Button, Dropdown, Flex, Input, Layout, message, Modal, theme, Typography } from "antd"
import Locale, { ALL_LANG_OPTIONS, changeLang, getLang, isRtlLang } from "../../locales";
import confirm from "antd/es/modal/confirm";
import { copyMessage, Message } from "@/app/message/Message";
import { ImageMessage } from "@/app/message/ImageMessage";
import { DocumentMessage } from "@/app/message/DocumentMessage";
import { FileFrame } from "@/app/file-frame/file-frame";
import { useMobileScreen, useWindowSize } from "@/app/utils";
import { uploadFile } from "./fileUpload";
import localforage from "localforage";
// import { AddIcon } from "@chakra-ui/icons";
import { useChatStore } from "@/app/store";
import { memo, useEffect, useState } from "react";
import emojiList from "../nextchat/emoji-list.json"

import SendWhiteIcon from "../../icons/send-white.svg";
import ReturnIcon from "../../icons/bootstrap/arrow-return-left.svg";
import CopyIcon from "../../icons/bootstrap/copy.svg";
import ResetIcon from "../../icons/bootstrap/repeat.svg";
import BreakIcon from "../../icons/bootstrap/file-break.svg";
import DeleteIcon from "../../icons/bootstrap/trash3.svg";
import MagicIcon from "../../icons/bootstrap/magic.svg"
import StopIcon from "../../icons/bootstrap/pause-circle.svg";
import RobotIcon from "../../icons/bootstrap/robot.svg";
import UploadFileIcon from "../../icons/bootstrap/file-richtext.svg"
import MoreIcon from "../../icons/bootstrap/plus-lg.svg"
import UserIcon from "../../icons/bootstrap/person.svg"
import AssistantIcon from "../../icons/bootstrap/robot.svg"
import SystemIcon from "../../icons/bootstrap/gear.svg"
import PluginIcon from "../../icons/hammer_and_wrench_high_contrast.svg"
import UploadIcon from "../../icons/bootstrap/upload.svg"
import CustomIcon from "../../icons/bootstrap/code-slash.svg"
import SearchIcon from "../../icons/bootstrap/search.svg"
import ScriptingIcon from "../../icons/bootstrap/terminal.svg"
import ImageIcon from "../../icons/bootstrap/image.svg"
import BrushIcon from "../../icons/bootstrap/brush.svg"
import WhatsThisIcon from "../../icons/bootstrap/question-lg.svg"
import ISeeIcon from "../../icons/bootstrap/lightbulb.svg"
import CheckOutIcon from "../../icons/bootstrap/arrow-right-circle.svg"
import ConfigIcon from "../../icons/bootstrap/gear.svg";
import DownloadIcon from "../../icons/bootstrap/download.svg"
import OnnxIcon from "../../icons/onnx.svg"
import NNCHATIcon from "../../icons/nnchat.svg"
import NNCHATBanner from "../../icons/nnchat-banner.svg"
import RegularModelIcon from "../../icons/nnchat-regular-model.svg"
import AdvancedModelIcon from "../../icons/nnchat-advanced-model.svg"
import RolePlayIcon from "../../icons/performing_arts_high_contrast.svg"
import ReasonIcon from "../../icons/whale_high_contrast.svg"
import ReasonActivatedIcon from "../../icons/whale_color.svg"

const RenderMarkdown: BubbleProps['messageRender'] = (content) => <div style={{ userSelect: "text" }}><Markdown content={content} /></div>;

export const Dialog = memo(Dialog_)

function Dialog_(props:{
    chatWidth, maxMsgWidth, quickStartWidth, 
    doSubmit, 
    useUserInput, 
    useChatPromise, 
    useUseSmart,
    useUseReason,
    useSearchPlugin, usePaintPlugin, useScriptPlugin
    setIsSelectingPrompt
}) {
    const chatStore = useChatStore()
    const session = chatStore.currentSession()
    const { 
        chatWidth, maxMsgWidth, quickStartWidth, 
        doSubmit, 
        useUserInput: [userInput, setUserInput], 
        useChatPromise: [chatPromise, setChatPromise],
        useUseSmart: [useSmart, setUseSmart],
        useUseReason: [useReason, setUseReason],
        useSearchPlugin: [searchPlugin, setSearchPlugin],
        usePaintPlugin: [paintPlugin, setPaintPlugin],
        useScriptPlugin: [scriptPlugin, setScriptPlugin],
    } = props
    const {width, height} = useWindowSize()
    const [modifiedMessage, setModifiedMessage] = useState("")
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [expandFile, setExpandFile] = useState<{src, fileName}|undefined>(undefined)
    const isMobileScreen = useMobileScreen()
    return <Flex justify={"center"} align={"center"} vertical gap={"middle"} style={{ height: "100%", width: chatWidth, margin: "auto" }}>
        {expandFile&&(!isMobileScreen)&&<Modal
            width={1000}
            styles={{
                body: {
                    height: height - 280,
                    overflowY: "scroll"
                }
            }}
            title={expandFile?.fileName}
            open={true}
            onCancel={() => { setExpandFile(undefined) }}
            footer={<Button type="primary" icon={<FullscreenExitOutlined />} onClick={() => {setExpandFile(undefined)}}>收起</Button>}
        >
            <FileFrame src={expandFile?.src} name={expandFile?.fileName} />
        </Modal>}
        {expandFile&&isMobileScreen&&<Layout style={{
            position:"fixed",
            zIndex: 1000,
            width,
            height,
            top: 0,
            left: 0,
        }}>
            <Layout.Header style={{background: "#f5f5f5", position:"relative"}}>
                <Button icon={<EnterOutlined />} style={{
                    position:"absolute",
                    left:10,
                    top:10
                }} onClick={()=>{setExpandFile(undefined)}}>返回</Button>
                <Flex align="center" justify="center" style={{paddingTop:15}}>
                    <Typography.Title level={5}>
                        {expandFile.fileName}    
                    </Typography.Title>    
                </Flex>    
            </Layout.Header>    
            <Layout.Content style={{zoom: 0.618, overflow:"scroll"}}>
                <FileFrame src={expandFile?.src} name={expandFile?.fileName} />
            </Layout.Content>
        </Layout>}
        <Bubble.List
            style={{ width: "100%" }}
            roles={{
                system: {
                    placement: "start",
                    avatar: { icon: <SettingOutlined />, style: { background: "none", color: "darkgray" } },
                    variant: "borderless",
                    messageRender: RenderMarkdown,
                },
                assistant: {
                    placement: "start",
                    avatar: session.avatar
                    ? emojiList.includes(session.avatar)
                    ? <Avatar style={{userSelect:"none", fontSize:"2em", background:"none"}} gap={0}>{session.avatar}</Avatar>
                    : <Avatar style={{userSelect:"none", background:"none"}} src={session.avatar} />
                    : <Avatar style={{background:"none"}} icon={<NNCHATIcon width={32} height={32} />}/>,
                    variant: "borderless",
                    messageRender: RenderMarkdown,
                },
                user: {
                    placement: "end",
                    // avatar: { icon: "👤" },
                    messageRender: RenderMarkdown,
                    variant: "filled",
                    shape: "corner",
                    styles:{
                        content:{
                            maxHeight: height / 2,
                            overflowY:"scroll"
                        }
                    }
                },
            }}
            items={
                [
                    ...(session.messages.length == 0 && userInput.trim().length == 0 ? [
                        { type: "text", role: "assistant", content: 
                            session.greeting?session.greeting:Locale.NextChat.ChatArea.Greeting, 
                        greeting: true }
                    ] : []),
                    ...session.messages,
                    ...(userInput.trim().length > 0 ? [{ type: "text", role: "user", content: userInput, userInput: true }] : [])
                ].map(
                    (msg, idx) => {
                        const footer = msg.role == "assistant" && idx == session.messages.length - 1 && chatPromise
                            ? <Button type="text" size="small" icon={<StopIcon />} onClick={() => { chatPromise.abort() }} style={{ opacity: 0.7 }}>停止</Button>
                            : <Flex gap={"small"} style={{ opacity: 0.7 }}>
                                {["text", "image"].includes(msg.type) && <Button
                                    type="text" size="small" icon={<CopyIcon />}
                                    onClick={() => {
                                        copyMessage(msg as Message)
                                    }}
                                >{Locale.NextChat.ChatArea.Copy}</Button>}
                                {["document", "image"].includes(msg.type) && <Button
                                    type="text" size="small" icon={<DownloadIcon />}
                                    onClick={async () => {
                                        const url = await localforage.getItem((msg as ImageMessage | DocumentMessage).src) as any
                                        const a = document.createElement("a")
                                        a.href = url
                                        a.download = (msg as ImageMessage | DocumentMessage).fileName ?? ""
                                        a.click()
                                    }}
                                >下载</Button>}
                                <Button
                                    type="text" size="small" icon={<DeleteIcon />}
                                    onClick={() => {
                                        chatStore.updateCurrentSession(session => {
                                            session.messages.splice(idx, 1)
                                        })
                                    }}
                                >
                                    {Locale.NextChat.ChatArea.Delete}
                                </Button>
                                {msg.role == "user" && <Button
                                    type="text" size="small" icon={<EditOutlined />}
                                    onClick={() => {
                                        chatStore.updateCurrentSession(session => {
                                            for (let idx = 0; idx < session.messages.length; idx++) {
                                                session.messages[idx]["modify"] = false
                                            }
                                            session.messages[idx]["modify"] = true
                                        })
                                        setModifiedMessage(msg.content)
                                    }}
                                >修改</Button>}
                                {msg.role == "assistant" && <Button
                                    type="text" size="small" icon={<ResetIcon />}
                                    onClick={() => {
                                        chatStore.updateCurrentSession(session => { session.messages = session.messages.slice(0, idx) })
                                        const userMsgs = session.messages.filter(msg => msg.role == "user")
                                        const input = userMsgs[userMsgs.length - 1]?.content ?? ""
                                        chatStore.updateCurrentSession(session => { session.messages = session.messages.slice(0, session.messages.length - 1) })
                                        doSubmit(input)
                                    }}
                                >{Locale.NextChat.ChatArea.Retry}</Button>}
                            </Flex>
                        if (msg.type == "document") {
                            return {
                                role: msg.role,
                                content: JSON.stringify({
                                    fileName: (msg as DocumentMessage).fileName,
                                    src: (msg as DocumentMessage).src
                                }),
                                footer: footer,
                                messageRender: (content) => <FileMessageRenderer content={content} idx={idx} setExpandFile={setExpandFile}/>
                            }
                        } else if (msg.type == "image") {
                            return {
                                role: msg.role,
                                content: JSON.stringify({
                                    src: (msg as ImageMessage).src,
                                    fileName: (msg as ImageMessage).fileName
                                }),
                                footer: footer,
                                messageRender: (content) => <ImageMessageRenderer content={content} chatWidth={chatWidth} />
                            }
                        } else {
                            return {
                                role: msg.role,
                                content: msg.content,
                                ...(msg["greeting"] || msg["userInput"] || msg["modify"] ? { footer: undefined } : { footer }),
                                loading: chatPromise && idx == session.messages.length - 1 && msg.role == "assistant" && msg.content.trim().length == 0,
                                ...(msg["modify"] ? {
                                    messageRender: (msg) => {
                                        return <Flex vertical gap={"small"}>
                                            <Input.TextArea value={modifiedMessage} onChange={(e) => { setModifiedMessage(e.currentTarget.value) }} autoSize={{ minRows: 3, maxRows: Math.max(3, height / 3 / 24) }} style={{ width: chatWidth }} />
                                            <Flex justify="end" gap={"middle"}>
                                                <Button onClick={() => {
                                                    setModifiedMessage("")
                                                    chatStore.updateCurrentSession(session => { session.messages[idx]["modify"] = false })
                                                }}>取消</Button>
                                                <Button type="primary" onClick={() => {
                                                    chatStore.updateCurrentSession(session => { session.messages = session.messages.slice(0, idx - 2) })
                                                    doSubmit(modifiedMessage)
                                                    setModifiedMessage("")
                                                }}>发送</Button>
                                            </Flex>
                                        </Flex>
                                    }, variant: "borderless"
                                } : {}),
                            }
                        }
                    }
                )
            }
        />
        {session.messages.length == 0 && userInput.trim()=="" && <Flex style={{width:"100%", paddingBottom: 32}} gap={"small"} wrap>
            <Button shape="round" icon={<UploadOutlined width={16} height={16} />} onClick={()=>{uploadFile(chatStore)}}>{Locale.NextChat.ChatArea.UploadFile}</Button>
            {/* <Button 
                shape="round" 
                icon={<div style={{width:14, height:14, position:"relative"}}>
                    <div style={{width:16, height:16, position:"absolute", top:-1, left:-1}}>
                        {useSmart ? <AdvancedModelIcon /> : <RegularModelIcon />}
                    </div>
                </div>}
                onClick={()=>{
                    message.open({
                        content: Locale.NextChat.ChatArea.SwitchedToModel(useSmart ? "regular" : "smart"),
                        icon: <div style={{ width: 16, height: 16, marginRight: 8 }}>{!useSmart ? <AdvancedModelIcon /> : <RegularModelIcon />}</div>,
                    })
                    setUseSmart(!useSmart)
                }}
            >{Locale.NextChat.ChatArea.SwitchModel}</Button> */}
            <Button color={useReason?"primary":undefined} variant={useReason?"filled":undefined} shape="round"
                icon={useReason?<ReasonActivatedIcon width={16} height={16} viewBox="0 0 32 32"/>:<ReasonIcon width={16} height={16} viewBox="0 0 32 32"/>}
                onClick={() => {setUseReason(!useReason)}}
            >深度思考</Button>
            <Button shape="round" icon={<RolePlayIcon width={16} height={16}/>} onClick={() => { props.setIsSelectingPrompt(true) }}>角色扮演</Button>
            <Dropdown menu={{
                items:[
                    {
                        key: "search",
                        icon: <SearchOutlined width={16} height={16} />,
                        label: "联网搜索",
                        extra: searchPlugin?"已启用":""
                    },
                    {
                        key: "paint",
                        icon: <PictureOutlined width={16} height={16}/>,
                        label: "图像生成",
                        extra: paintPlugin?"已启用":""
                    },
                    {
                        key:"script",
                        icon:<CodeOutlined width={16} height={16}/>,
                        label: "脚本执行",
                        extra: scriptPlugin?"已启用":""
                    }
                ],
                onClick:(info)=>{
                    switch(info.key){
                        case "search":
                            message.info(`已${searchPlugin?"停用":"启用"}联网搜索`); setSearchPlugin(!searchPlugin)
                            break
                        case "paint":
                            message.info(`已${paintPlugin?"停用":"启用"}图像生成`); setPaintPlugin(!paintPlugin)
                            break
                        case "script":
                            message.info(`已${scriptPlugin?"停用":"启用"}脚本执行`); setScriptPlugin(!scriptPlugin)
                            break
                    }
                }
            }}>
                <Button shape="round" icon={<PluginIcon width={16} height={16} viewBox="0 0 32 32"/>}>
                    启用工具
                    {searchPlugin&&<SearchOutlined width={14} height={14} style={{opacity:0.7}}/>}
                    {paintPlugin&&<PictureOutlined width={14} height={14} style={{opacity:0.7}}/>}
                    {scriptPlugin&&<CodeOutlined width={14} height={14} style={{opacity:0.7}}/>}
                </Button>
            </Dropdown>
        </Flex>}
        <Sender
            onSubmit={(msg) => {
                setUserInput("")
                setShowMoreOptions(false)
                doSubmit(msg)
            }}
            value={userInput}
            onChange={(v) => {
                setUserInput(v)
            }}
            header={<Sender.Header title={<Flex style={{ width: "100%", height: "100%" }} gap={"small"} wrap>
                {/**<Button size="small" shape="round"
                    icon={useSmart ? <AdvancedModelIcon /> : <RegularModelIcon />}
                    onClick={() => {
                        message.open({
                            content: Locale.NextChat.ChatArea.SwitchedToModel(useSmart ? "regular" : "smart"),
                            icon: <div style={{ width: 16, height: 16, marginRight: 8 }}>{!useSmart ? <AdvancedModelIcon /> : <RegularModelIcon />}</div>,
                        })
                        setUseSmart(!useSmart)
                    }}
                >{Locale.NextChat.ChatArea.SwitchModel}</Button>*/}
                <Button color={useReason?"primary":undefined} variant={useReason?"filled":undefined} size="small" shape="round"
                    icon={useReason?<ReasonActivatedIcon width={14} height={14} viewBox="0 0 32 32"/>:<ReasonIcon width={14} height={14} viewBox="0 0 32 32"/>}
                    onClick={() => {setUseReason(!useReason)}}
                >深度思考</Button>
                <Button size="small" shape="round" icon={<UploadIcon width="14" height="14" viewBox="0 0 16 16"/>} onClick={() => { uploadFile(chatStore) }}>{Locale.NextChat.ChatArea.UploadFile}</Button>
                <Button size="small" shape="round" icon={<RolePlayIcon />} onClick={() => { props.setIsSelectingPrompt(true) }}>{Locale.NextChat.ChatArea.RolePlay}</Button>
                <Dropdown menu={{
                    items:[
                        {
                            key: "search",
                            icon: <SearchOutlined />,
                            label: "联网搜索",
                            extra: searchPlugin?"已启用":""
                        },
                        {
                            key: "paint",
                            icon: <PictureOutlined/>,
                            label: "图像生成",
                            extra: paintPlugin?"已启用":""
                        },
                        {
                            key:"script",
                            icon:<CodeOutlined/>,
                            label: "脚本执行",
                            extra: scriptPlugin?"已启用":""
                        }
                    ],
                    onClick:(info)=>{
                        switch(info.key){
                            case "search":
                                message.info(`已${searchPlugin?"停用":"启用"}联网搜索`); setSearchPlugin(!searchPlugin)
                                break
                            case "paint":
                                message.info(`已${paintPlugin?"停用":"启用"}图像生成`); setPaintPlugin(!paintPlugin)
                                break
                            case "script":
                                message.info(`已${scriptPlugin?"停用":"启用"}脚本执行`); setScriptPlugin(!scriptPlugin)
                                break
                        }
                    }
                }}>
                    <Button size="small" shape="round" icon={<PluginIcon width={14} height={14} viewBox="0 0 32 32"/>}>
                        启用工具
                        {searchPlugin&&<SearchOutlined width={14} height={14} style={{opacity:0.7}}/>}
                        {paintPlugin&&<PictureOutlined width={14} height={14} style={{opacity:0.7}}/>}
                        {scriptPlugin&&<CodeOutlined width={14} height={14} style={{opacity:0.7}}/>}
                    </Button>
                </Dropdown>
                <Button size="small" shape="round" icon={<BreakIcon style={{ fill: "red", opacity: "0.8" }} width="14" height="14" viewBox="0 0 16 16" />} onClick={() => { chatStore.deleteSession(chatStore.currentSessionIndex); }}>{Locale.NextChat.ChatArea.DeleteChat}</Button>
                <Button size="small" shape="round" icon={<DeleteIcon style={{ fill: "red", opacity: "0.8" }} width="14" height="14" viewBox="0 0 16 16" />} onClick={async () => {
                    confirm({
                        title: Locale.NextChat.ChatArea.ClearDataPrompt,
                        okCancel: true,
                        okText: "确认",
                        cancelText: "取消",
                        okButtonProps: { danger: true },
                        onOk: async () => {
                            localStorage.clear();
                            await localforage.clear()
                            location.reload();
                        }
                    })
                }}>{Locale.NextChat.ChatArea.ClearData}</Button>
            </Flex>} open={showMoreOptions} onOpenChange={() => { setShowMoreOptions(!showMoreOptions) }} />}
            prefix={<Button icon={showMoreOptions ? <DownOutlined /> : <PlusOutlined />} type="default" shape="circle" onClick={() => { setShowMoreOptions(!showMoreOptions) }} />}
            placeholder={Locale.NextChat.ChatArea.SendPrompt}
            loading={chatPromise && true}
            onCancel={() => { chatPromise?.abort() }}
        />
    </Flex>
}



function ImageMessageRenderer(props:{content, chatWidth}){
    const { fileName, src } = JSON.parse(props.content)
    const [url, setUrl] = useState("")
    useEffect(() => {
        localforage.getItem(src).then(async (url:any)=>{
            setUrl(url)
        })
    }, [src])
    return <div style={{ borderRadius: 16, maxWidth: props.chatWidth / 2, pointerEvents: "none", userSelect: "none", overflow: "hidden", background: "white" }}>
        {url&&<FileFrame src={url} name={fileName} />}
    </div>
}

function FileMessageRenderer(props:{content, idx, setExpandFile}){
    const { fileName, src } = JSON.parse(props.content)
    return <Attachments.FileCard style={{ userSelect: "none", width: 236 }} item={{
        uid: `${props.idx}`,
        name: fileName,
        // description: <Flex justify="right" style={{ width: 165 }}>
        //     <Button
        //         style={{ width: 72 }} type="text" shape="round" iconPosition="end" size="small" icon={<FullscreenOutlined />}
        //         onClick={() => {
        //             localforage.getItem(src).then(async (url:any)=>{
        //                 console.log(url)
        //                 props.setExpandFile({
        //                     url, fileName
        //                 })
        //             })
        //         }}
        //     >
        //         展开
        //     </Button>
        // </Flex>
    }} />
}