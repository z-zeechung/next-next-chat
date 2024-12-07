import { createContext, useEffect, useRef, useState } from "react";
import { autoGrowTextArea, useMobileScreen, useWindowSize } from "../utils";
import { Box, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Stack, StackDivider } from "@chakra-ui/react";
import { Message, MessageElement } from "../message/Message";
import { Button, List, MessageCard, TextArea, TinyButton, ListItem, Avatar, Tabs, Component, Header, Row, Left, Right, Select, Footer, Plate, Group } from "../themes/theme";

import { ControllablePromise } from "../utils/controllable-promise";
import { ClientApi } from "../client/api";

import UserIcon from "../icons/bootstrap/person.svg"
import AssistantIcon from "../icons/bootstrap/robot.svg"
import SystemIcon from "../icons/bootstrap/gear.svg"
import DefaultAvatarIcon from "../icons/bootstrap/camera.svg"
import ImageIcon from "../icons/bootstrap/file-earmark-image.svg"
import DeleteIcon from "../icons/bootstrap/trash3.svg"
import DropDownIcon from "../icons/bootstrap/chevron-down.svg"
import AddIcon from "../icons/bootstrap/plus-lg.svg"
import AutoIcon from "../icons/bootstrap/play-fill.svg"
import ReturnIcon from "../icons/bootstrap/arrow-90deg-left.svg";

import { RolePlay } from "./devpage/roleplay";
import { Scripting } from "./devpage/scripting";
import { runPython } from "../utils/pyodide";
import { DEFAULT_SYSTEM_TEMPLATE } from "../constant";

import Locale, { ALL_LANG_OPTIONS, changeLang, getLang, isRtlLang } from "../locales";
import { KnowledgeBase } from "../knowledgebase/knowledgebase";
import { useNavigate } from "react-router-dom";
import { Live2D } from "./devpage/live2d";
import { Live2D as Live2DComponent } from "./nextchat/Live2D";

export function DevPage() {

    const navigate = useNavigate()

    const [chatAreaSize, setChatAreaSize] = useState([0, 0])
    const isMobileScreen = useMobileScreen();

    const useMessages = useState([] as Message[])
    const useMeta = useState({})
    const useShow = useState(true)
    const usePromise = useState(undefined as ControllablePromise<any> | undefined)
    const usePrompt = useState("你是$N^2$CHAT，一个智能助手。")
    const useGreeting = useState([
        { type: "text", role: "assistant", content: Locale.DevPage.Greeting }
    ] as Message[])
    const useAvatar = useState(
        <div style={{
            background: "gray",
            width: 16,
            height: 16,
            borderRadius: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{ scale: 0.7, color: "white" }}><DefaultAvatarIcon /></div>
        </div>
    )
    const useJavaScript = useState("#include <stdio.h>\nint main(){\n\tprintf(\"Hello World\\n\");\n}")
    const useSearch = useState(false)
    const usePaint = useState(false)
    const useScript = useState(false)
    const useRoleName = useState("N²CHAT")
    const useDocuments = useState<string[]>([])

    const useLive2DHeight = useState("170")
    const useLive2DConfig = useState<File | undefined>(undefined)
    const useLive2DModel = useState<File | undefined>(undefined)
    const useLive2DPhysics = useState<File | undefined>(undefined)
    const useLive2DTextures = useState<File[]>([])
    const useLive2DMotions = useState<File[]>([])
    const useLive2DIdleMotion = useState("无")
    const useLive2DUrl = useState<string | undefined>(undefined)

    const tabs = [Locale.DevPage.RolePlay, Locale.DevPage.Live2D, Locale.DevPage.Script]
    const [tab, setTab] = useState(tabs[0])

    return <Component>
        <Header>
            <Row>
                <Left>
                    <Button
                        icon={<ReturnIcon />}
                        text={Locale.NextChat.ChatArea.Return}
                        onClick={() => navigate("/")}
                    />
                </Left>
                <Right>
                    <Select options={Object.values(ALL_LANG_OPTIONS)}
                        value={ALL_LANG_OPTIONS[getLang()]}
                        onChange={(value) => {
                            changeLang(Object.values(ALL_LANG_OPTIONS).reduce((acc, key, index) => Object.assign(acc, { [key]: Object.keys(ALL_LANG_OPTIONS)[index] }), {})[value])
                        }
                        }
                    />
                </Right>
            </Row>
        </Header>
        <div style={{ width: "100%", height: "100%", display: "flex", gap: 16, flexDirection: isRtlLang() ? "row-reverse" : "row" }}>
            <div style={{ height: "100%", width: "43%" }}>
                <Plate>
                    <Tabs type="plain" tab={tab} labels={tabs} onChange={setTab} >
                        {tab == tabs[0] && <RolePlay {...{ usePrompt, useGreeting, usePromise, useAvatar, useJavaScript, useSearch, usePaint, useScript, useRoleName, useDocuments }} />}
                        {tab == tabs[1] && <Live2D {...{ useLive2DConfig, useLive2DModel, useLive2DPhysics, useLive2DTextures, useLive2DMotions, useLive2DIdleMotion, useLive2DUrl, useLive2DHeight }} />}
                        <Footer>
                            <Row>
                                <Right>
                                    <Group>
                                        <Button text={Locale.DevPage.Upload} />
                                        <Button text={Locale.DevPage.Save} />
                                        <Button text={Locale.DevPage.Export} />
                                    </Group>
                                </Right>
                            </Row>
                        </Footer>
                    </Tabs>
                </Plate>
            </div>
            <div style={{ height: "100%", width: "57%"}}>
                <Plate>
                    <ChatArea {...{ useMessages, useMeta, useShow, usePromise, usePrompt, useGreeting, useAvatar, useSearch, usePaint, useScript, useDocuments, useLive2DUrl, useLive2DHeight }} />
                </Plate>
            </div>
        </div>
    </Component>
}

function ChatArea(props: {
    width?, height?, mobile?, useMessages, useMeta, useShow, usePromise, usePrompt, useGreeting, useAvatar, useSearch, usePaint, useScript, useDocuments, useLive2DUrl, useLive2DHeight
}) {
    const [messages, setMessages] = props.useMessages
    const [meta, setMeta] = props.useMeta
    const [show, setShow] = props.useShow
    const [promise, setPromise] = props.usePromise

    const [input, setInput] = useState("")
    const { width, height } = useWindowSize()
    const isMobile = useMobileScreen()

    const [prompt, setPrompt] = props.usePrompt
    const [greeting, setGreeting] = props.useGreeting
    const [avatar, setAvatar] = props.useAvatar

    const [search, setSearch] = props.useSearch
    const [paint, setPaint] = props.usePaint
    const [script, setScript] = props.useScript

    const [documents, setDocuments] = props.useDocuments

    const boxRef = useRef(null)
    const inputRef = useRef(null)
    const [chatHeight, setChatHeight] = useState(0)

    const tools = (appendMessage: (message: Message) => void) => [
        ...(search ? [
            {
                function: function web(query) {
                    return ClientApi.search(query, 8, 0);
                },
                description: {
                    function: "查询网络信息，你可以用这个来访问搜索引擎",
                    params: {
                        query: "你要查找的关键词"
                    }
                }
            }
        ] : []),
        ...(script ? [
            {
                function: async function runPythonScript(code) {
                    try {
                        return await runPython(code)
                    } catch (e) {
                        return JSON.stringify(e)
                    }
                },
                description: {
                    function: "执行python脚本",
                    params: {
                        code: "你要执行的python代码。很抱歉，我们暂时不支持pip包。"
                    }
                }
            }
        ] : []),
        ...(paint ? [
            {
                function: async function drawImage(prompt) {
                    const img = await ClientApi.paint(prompt) as string
                    appendMessage({ type: "image", role: "assistant", src: img, content: prompt })
                    return "图片画好了，已经展示给用户了，剩下的你就不用管了"
                },
                description: {
                    function: "绘制图画",
                    params: {
                        prompt: "提示词，按照stable diffusion的格式"
                    }
                }
            }
        ] : []),
        ...(documents.length > 0 ? [
            {
                function: async function getFromKB(query) {
                    const results = await new KnowledgeBase("nnchat-devrole-attatchment-tempstore-kb").query(query, 4)
                    return JSON.stringify(results)
                },
                description: {
                    function: "查询知识库。这个知识库的内容是用户自定义的文档。",
                    params: {
                        query: "要查询的内容"
                    }
                }
            }
        ] : [])
    ]

    useEffect(() => {
        if (boxRef.current && inputRef.current) {
            setChatHeight((boxRef.current as HTMLElement).clientHeight - (inputRef.current as HTMLElement).clientHeight - 48)
        }
    }, [setChatHeight, boxRef, inputRef])

    return <Component type="plain">
        <Header>
            <Row>
                <Right>
                    <ButtonGroup>
                        {promise && <TinyButton
                            text={Locale.DevPage.Stop}
                            onClick={() => {
                                if (promise) {
                                    promise.abort()
                                    setPromise(undefined)
                                }
                            }}
                        />}
                        {!promise && <TinyButton text={Locale.DevPage.Clear} type="primary" onClick={() => {
                            setMessages([])
                            setMeta({})
                        }} />}
                        <TinyButton text={Locale.DevPage.ChangeModel} />
                        {props.mobile && <TinyButton text={Locale.DevPage.Collapse} onClick={() => {
                            setShow(false)
                        }} />}
                    </ButtonGroup>
                </Right>
            </Row>
        </Header>
        {greeting.concat(messages).map((msg, i) => <div>
            {msg.role == "user" ? <UserIcon /> :
                (msg.role == "system" ? <SystemIcon /> :
                    (avatar)
                )
            }
            <MessageCard type={msg.role}>
                <MessageElement message={msg} />
            </MessageCard>
        </div>)}
        <div style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            pointerEvents: "none"
        }}>
            <Live2DComponent src={props.useLive2DUrl[0]} height={Number.parseInt(props.useLive2DHeight[0])/100} zoom={0.618} />
        </div>
        <Footer>
            <Group isAttached>
                <TextArea
                    rows={1}
                    value={input}
                    onChange={v => {
                        setInput(v)
                    }}
                />
                <Button text={Locale.DevPage.Send} type="primary" onClick={async () => {
                    if (input.trim().length <= 0) { return }
                    let _messages = messages.concat([{ type: "text", role: "user", content: input }])
                    setMessages(_messages.slice().concat([
                        { type: "text", role: "assistant", content: "" }
                    ]))
                    const promise = ClientApi.chat(
                        [
                            { type: "text", role: "system", content: Locale.NextChat.SystemPrompt() },
                            ...(prompt.trim != "" ? [{ type: "text", role: "system", content: prompt }] : []),
                            ...greeting,
                            ...messages.slice(),
                            { type: "text", role: "user", content: input }
                        ],
                        msg => {
                            setMessages(_messages.slice().concat([
                                { type: "text", role: "assistant", content: msg }
                            ]))
                        },
                        {
                            tools: tools((msg) => {
                                _messages.push(msg)
                            })
                        }
                    )
                    setPromise(promise)
                    promise.then(resp => {
                        setPromise(undefined)
                        setMessages(_messages.slice().concat([
                            { type: "text", role: "assistant", content: resp }
                        ]))
                    })
                    setInput("")
                }} />
            </Group>
        </Footer>
    </Component>

    return <div style={{
        width: "100%", height: "100%", position: "relative", padding: 24, paddingTop: 0
    }}>
        <table style={{ width: "100%", height: "100%" }}>
            <tr style={{ width: "100%", height: "100%" }}>
                <td style={{ width: "100%", height: "100%" }}>
                    <div style={{ width: "100%", height: "100%", overflow: "scroll", display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>&nbsp;</div>
                        {greeting.concat(messages).map((msg, i) => <div>
                            {msg.role == "user" ? <UserIcon /> :
                                (msg.role == "system" ? <SystemIcon /> :
                                    (avatar)
                                )
                            }
                            <MessageCard type={msg.role}>
                                <MessageElement message={msg} />
                            </MessageCard>
                        </div>)}
                        <div>&nbsp;</div>
                    </div>
                </td>
            </tr>
            <tr style={{ width: "100%" }}>
                <td style={{ width: "100%" }}>
                    <TextArea
                        rows={1}
                        value={input}
                        onChange={v => {
                            setInput(v)
                        }}
                        rightAttachment={
                            <Button text={Locale.DevPage.Send} type="primary" onClick={async () => {
                                if (input.trim().length <= 0) { return }
                                let _messages = messages.concat([{ type: "text", role: "user", content: input }])
                                setMessages(_messages.slice().concat([
                                    { type: "text", role: "assistant", content: "" }
                                ]))
                                const promise = ClientApi.chat(
                                    [
                                        { type: "text", role: "system", content: Locale.NextChat.SystemPrompt() },
                                        ...(prompt.trim != "" ? [{ type: "text", role: "system", content: prompt }] : []),
                                        ...greeting,
                                        ...messages.slice(),
                                        { type: "text", role: "user", content: input }
                                    ],
                                    msg => {
                                        setMessages(_messages.slice().concat([
                                            { type: "text", role: "assistant", content: msg }
                                        ]))
                                    },
                                    {
                                        tools: tools((msg) => {
                                            _messages.push(msg)
                                        })
                                    }
                                )
                                setPromise(promise)
                                promise.then(resp => {
                                    setPromise(undefined)
                                    setMessages(_messages.slice().concat([
                                        { type: "text", role: "assistant", content: resp }
                                    ]))
                                })
                                setInput("")
                            }} />
                        }
                    />
                </td>
            </tr>
        </table>
        <div style={{
            position: "absolute",
            right: 4,
            top: 4
        }}>
            <ButtonGroup>
                {promise && <TinyButton
                    text={Locale.DevPage.Stop}
                    onClick={() => {
                        if (promise) {
                            promise.abort()
                            setPromise(undefined)
                        }
                    }}
                />}
                {!promise && <TinyButton text={Locale.DevPage.Clear} type="primary" onClick={() => {
                    setMessages([])
                    setMeta({})
                }} />}
                <TinyButton text={Locale.DevPage.ChangeModel} />
                {props.mobile && <TinyButton text={Locale.DevPage.Collapse} onClick={() => {
                    setShow(false)
                }} />}
            </ButtonGroup>
        </div>
    </div>
}