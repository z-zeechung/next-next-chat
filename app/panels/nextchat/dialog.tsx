import { Markdown } from "@/app/components/markdown";
import { DownOutlined, EditOutlined, FullscreenExitOutlined, FullscreenOutlined, SettingOutlined } from "@ant-design/icons"
import { Attachments, Bubble, BubbleProps, Prompts, Sender } from "@ant-design/x"
import { Button, Flex, Input, message, Typography } from "antd"
import Locale, { ALL_LANG_OPTIONS, changeLang, getLang, isRtlLang } from "../../locales";
import confirm from "antd/es/modal/confirm";
import { copyMessage, Message } from "@/app/message/Message";
import { ImageMessage } from "@/app/message/ImageMessage";
import { DocumentMessage } from "@/app/message/DocumentMessage";
import { FileFrame } from "@/app/file-frame/file-frame";
import { useWindowSize } from "@/app/utils";
import { uploadFile } from "./fileUpload";
import localforage from "localforage";
import { AddIcon } from "@chakra-ui/icons";
import { useChatStore } from "@/app/store";
import { memo, useState } from "react";

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
import RolePlayIcon from "../../icons/bootstrap/layout-wtf.svg"
import UserIcon from "../../icons/bootstrap/person.svg"
import AssistantIcon from "../../icons/bootstrap/robot.svg"
import SystemIcon from "../../icons/bootstrap/gear.svg"
import PluginIcon from "../../icons/bootstrap/puzzle.svg"
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

const RenderMarkdown: BubbleProps['messageRender'] = (content) => <div style={{ userSelect: "text" }}><Markdown content={content} /></div>;

export const Dialog = memo(Dialog_)

function Dialog_(props:{
    chatWidth, maxMsgWidth, quickStartWidth, 
    doSubmit, 
    useUserInput, 
    useChatPromise, 
    useUseSmart
}) {
    const chatStore = useChatStore()
    const session = chatStore.currentSession()
    const { 
        chatWidth, maxMsgWidth, quickStartWidth, 
        doSubmit, 
        useUserInput: [userInput, setUserInput], 
        useChatPromise: [chatPromise, setChatPromise],
        useUseSmart: [useSmart, setUseSmart]
    } = props
    const {width, height} = useWindowSize()
    const [modifiedMessage, setModifiedMessage] = useState("")
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    return <Flex justify={"center"} align={"center"} vertical gap={"middle"} style={{ height: "100%", width: chatWidth, margin: "auto" }}>
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
                    avatar: { icon: <NNCHATIcon width={32} height={32} />, style: { background: "none" } },
                    variant: "borderless",
                    messageRender: RenderMarkdown,
                },
                user: {
                    placement: "end",
                    // avatar: { icon: "👤" },
                    messageRender: RenderMarkdown,
                    variant: "filled",
                    shape: "corner",
                },
            }}
            items={
                [
                    ...(session.messages.length == 0 && userInput.trim().length == 0 ? [{ type: "text", role: "assistant", content: Locale.NextChat.ChatArea.Greeting, greeting: true }] : []),
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
                                        const data = await (await fetch((msg as ImageMessage | DocumentMessage).src)).blob()
                                        const url = URL.createObjectURL(data)
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
                                messageRender: (content) => {
                                    const { fileName, src } = JSON.parse(content)
                                    if (msg["expand"]) {
                                        return <div style={{ width: maxMsgWidth, height: height / 2, borderRadius: 16, overflow: "hidden", position: "relative" }}>
                                            <div style={{ width: "100%", height: "100%", overflow: "scroll" }}>
                                                <FileFrame src={src} name={fileName} />
                                            </div>
                                            <Button
                                                style={{ position: "absolute", right: 24, bottom: 16 }} size="small" variant="filled" color="primary" shape="round" icon={<FullscreenExitOutlined />} iconPosition="end"
                                                onClick={() => {
                                                    chatStore.updateCurrentSession(session => {
                                                        session.messages[idx]["expand"] = false
                                                    })
                                                }}
                                            >
                                                收起
                                            </Button>
                                        </div>
                                    }
                                    return <Attachments.FileCard style={{ userSelect: "none", width: 236 }} item={{
                                        uid: `${idx}`,
                                        name: fileName,
                                        description: <Flex justify="right" style={{ width: 165 }}>
                                            <Button
                                                style={{ width: 72 }} type="text" shape="round" iconPosition="end" size="small" icon={<FullscreenOutlined />}
                                                onClick={() => {
                                                    chatStore.updateCurrentSession(session => {
                                                        session.messages[idx]["expand"] = true
                                                    })
                                                }}
                                            >
                                                展开
                                            </Button>
                                        </Flex>
                                    }} />
                                }
                            }
                        } else if (msg.type == "image") {
                            return {
                                role: msg.role,
                                content: JSON.stringify({
                                    src: (msg as ImageMessage).src,
                                    fileName: (msg as ImageMessage).fileName
                                }),
                                footer: footer,
                                messageRender: (content) => {
                                    const { fileName, src } = JSON.parse(content)
                                    return <div style={{ borderRadius: 16, maxWidth: chatWidth / 2, pointerEvents: "none", userSelect: "none", overflow: "hidden", background: "white" }}>
                                        <FileFrame src={src} name={fileName} />
                                    </div>
                                }
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
        {session.messages.length == 0 && <Prompts
            style={{ maxHeight: height / 3, overflowY: "scroll", userSelect: "none" }}
            title={<Flex gap={"small"}>
                <Typography.Title level={4}>🚀</Typography.Title>
                <Flex vertical>
                    <Typography.Title level={4}>{Locale.NextChat.ChatArea.QuickStart}</Typography.Title>
                    <Typography.Text>{Locale.NextChat.ChatArea.YouCanSeeInMore}</Typography.Text>
                </Flex>
            </Flex>}
            items={[
                {
                    key: "1",
                    label: Locale.NextChat.ChatArea.UploadFile,
                    icon: "📤",
                    description: Locale.NextChat.ChatArea.UploadDesc,
                    children: [
                        {
                            key: "1-1",
                            label: Locale.NextChat.ChatArea.Upload,
                            icon: <UploadIcon />,
                        }
                    ],
                },
                {
                    key: "2",
                    label: Locale.NextChat.ChatArea.RolePlay,
                    icon: "🎭",
                    description: Locale.NextChat.ChatArea.RolePlayDesc,
                    children: [
                        {
                            key: "2-1",
                            label: Locale.NextChat.ChatArea.SelectRole,
                            icon: <RolePlayIcon />
                        },
                        {
                            key: "2-2",
                            label: Locale.NextChat.ChatArea.NewRole,
                            icon: <MoreIcon />
                        }
                    ]
                },
                {
                    key: "3",
                    label: Locale.NextChat.ChatArea.ChatPlugins,
                    icon: "🧩",
                    description: Locale.NextChat.ChatArea.PluginDesc,
                    children: [
                        {
                            key: "3-1",
                            label: Locale.NextChat.ChatArea.EnablePlugin,
                            icon: <PluginIcon style={{ transform: "rotate(45deg)", scale: "1.15" }} />
                        }
                    ]
                },
            ]}
            onItemClick={(info) => {
                switch (info.data.key) {
                    case "1-1":
                        uploadFile(chatStore)
                        break
                }
            }}
            wrap
            styles={{
                item: {
                    flex: 'none',
                    width: quickStartWidth,
                    border: 0,
                },
            }}
        />}
        <Sender
            onSubmit={(msg) => {
                setUserInput("")
                doSubmit(msg)
            }}
            value={userInput}
            onChange={(v) => {
                setUserInput(v)
            }}
            header={<Sender.Header title={<Flex style={{ width: "100%", height: "100%" }} gap={"small"} wrap>
                <Button size="small" shape="round"
                    icon={useSmart ? <AdvancedModelIcon /> : <RegularModelIcon />}
                    onClick={() => {
                        message.open({
                            content: Locale.NextChat.ChatArea.SwitchedToModel(useSmart ? "regular" : "smart"),
                            icon: <div style={{ width: 16, height: 16, marginRight: 8 }}>{!useSmart ? <AdvancedModelIcon /> : <RegularModelIcon />}</div>,
                        })
                        setUseSmart(!useSmart)
                    }}
                >{Locale.NextChat.ChatArea.SwitchModel}</Button>
                <Button size="small" shape="round" icon={<UploadIcon />} onClick={() => { uploadFile(chatStore) }}>{Locale.NextChat.ChatArea.UploadFile}</Button>
                <Button size="small" shape="round" icon={<BreakIcon style={{ fill: "red", opacity: "0.8" }} />} onClick={() => { chatStore.deleteSession(chatStore.currentSessionIndex); }}>{Locale.NextChat.ChatArea.DeleteChat}</Button>
                <Button size="small" shape="round" icon={<DeleteIcon style={{ fill: "red", opacity: "0.8" }} />} onClick={async () => {
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
            prefix={<Button icon={showMoreOptions ? <DownOutlined /> : <AddIcon />} type="default" shape="circle" onClick={() => { setShowMoreOptions(!showMoreOptions) }} />}
            placeholder={Locale.NextChat.ChatArea.SendPrompt}
            loading={chatPromise && true}
            onCancel={() => { chatPromise?.abort() }}
        />
    </Flex>
}