import { createContext, useEffect, useRef, useState } from "react";
import { autoGrowTextArea, useMobileScreen, useWindowSize } from "../utils";
import { Box, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Stack, StackDivider } from "@chakra-ui/react";
import { Message, MessageElement } from "../message/Message";
import { Button, List, MessageCard, TextArea, TinyButton, ListItem, Avatar, Tabs } from "../themes/theme";

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
import { RolePlay } from "./devpage/roleplay";
import { Scripting } from "./devpage/scripting";
import { runPython } from "../utils/pyodide";
import { DEFAULT_SYSTEM_TEMPLATE } from "../constant";

export function DevPage() {

    const [chatAreaSize, setChatAreaSize] = useState([0, 0])
    const isMobileScreen = useMobileScreen();

    const useMessages = useState([] as Message[])
    const useMeta = useState({})
    const useShow = useState(true)
    const usePromise = useState(undefined as ControllablePromise<any> | undefined)
    const usePrompt = useState("")
    const useGreeting = useState([
        { type: "text", role: "assistant", content: "有什么我可以帮助您的吗🪄" }
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

    return <Layout useChatAreaSize={[chatAreaSize, setChatAreaSize]} useShow={useShow}>
        <DevArea
            usePrompt={usePrompt}
            useGreeting={useGreeting}
            usePromise={usePromise}
            useAvatar={useAvatar}
            useJavaScript={useJavaScript}
            useSearch={useSearch}
            usePaint={usePaint}
            useScript={useScript}
        />
        <ChatArea
            width={chatAreaSize[0]}
            height={chatAreaSize[1]}
            mobile={isMobileScreen ? true : false}
            useMessages={useMessages}
            useMeta={useMeta}
            useShow={useShow}
            usePromise={usePromise}
            usePrompt={usePrompt}
            useGreeting={useGreeting}
            useAvatar={useAvatar}
            useSearch={useSearch}
            usePaint={usePaint}
            useScript={useScript}
        />
    </Layout>
}

function Layout(props: { children, useChatAreaSize, useShow }) {
    const isMobileScreen = useMobileScreen();
    return isMobileScreen
        ?
        <MobileLayout {...props}>
            {props.children}
        </MobileLayout>
        :
        <DesktopLayout useChatAreaSize={props.useChatAreaSize}>
            {props.children}
        </DesktopLayout>
}

function DevArea(props: any) {
    return <Tabs labels={["角色扮演", "数字人", "脚本"]}>
        <RolePlay {...props} />
        <></>
        <Scripting {...props} />
        <></>
    </Tabs>
    // return <RolePlay {...props}/>
}

function DesktopLayout(props: { children: JSX.Element[], useChatAreaSize }) {
    const { width, height } = useWindowSize()
    const [left, setLeft] = useState(0.4)
    const [hover, setHover] = useState(false)
    // const [chatAreaSize, setChatAreaSize] = props.useChatAreaSize

    // const boxRef = useRef(null)
    // const [boxHeight, setBoxHeight] = useState(height)

    // useEffect(() => {
    //     if (boxRef.current) {
    //         setBoxHeight((boxRef.current as HTMLElement).clientHeight)
    //     }
    //     setChatAreaSize([width - Math.max(left * width, 300) - 24, boxHeight - 80])
    // }, [setChatAreaSize])

    return <div style={{ width: "100%", height: "100%" }}>
        <table style={{ width: "100%", height: "100%", borderCollapse: "separate", borderSpacing: 8 }}>
            <tr style={{ height: "100%" }}>
                <td width={"33%"}>
                    <Card width={"100%"} height={"100%"}>
                        <CardBody width={"100%"} height={"100%"} padding={0}>
                            {props.children[0]}
                        </CardBody>
                    </Card>
                </td>
                <td width={"67%"}>
                    <Card width={"100%"} height={"100%"}>
                        <CardBody width={"100%"} height={"100%"} padding={0}>
                            {props.children[1]}
                        </CardBody>
                    </Card>
                </td>
            </tr>
        </table>
    </div>
}

function MobileLayout(props: { children: JSX.Element[], useChatAreaSize, useShow }) {
    const boxRef = useRef(null)
    const { width, height } = useWindowSize()
    const [boxHeight, setBoxHeight] = useState(height)
    const [chatAreaSize, setChatAreaSize] = props.useChatAreaSize
    const [show, setShow] = props.useShow

    useEffect(() => {
        if (boxRef.current) {
            setBoxHeight((boxRef.current as HTMLElement).clientHeight)
        }
        setChatAreaSize([width * 0.7, boxHeight - 16])
    }, [setChatAreaSize])

    return <div ref={boxRef} style={{ width: "100%", height: "100%", position: "relative" }}>
        {props.children[0]}
        {show && <div style={{
            position: "absolute",
            right: 4,
            top: 4,
            display: "flex",
            flexDirection: "column",
            gap: "8",
            width: 300,
            height: boxHeight,
            padding: 4
        }}>
            <Card width={"100%"} height={"100%"}>
                <CardBody width={"100%"} height={"100%"} padding={0}>
                    {props.children[1]}
                </CardBody>
            </Card>
        </div>}
        {!show && <div style={{
            position: "absolute",
            right: 12,
            top: 12
        }}>
            <TinyButton text="展开" onClick={() => {
                setShow(true)
            }} />
        </div>}
    </div>
}

function ChatArea(props: {
    width, height, mobile?, useMessages, useMeta, useShow, usePromise, usePrompt, useGreeting, useAvatar, useSearch, usePaint, useScript
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

    const boxRef = useRef(null)
    const inputRef = useRef(null)
    const [chatHeight, setChatHeight] = useState(0)

    const tools = (appendMessage:(message:Message)=>void)=>[
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
                    try{
                        return await runPython(code)
                    }catch(e){
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
                    appendMessage({type:"image", role:"assistant", src:img, content:prompt})
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
    ]

    useEffect(() => {
        if (boxRef.current && inputRef.current) {
            setChatHeight((boxRef.current as HTMLElement).clientHeight - (inputRef.current as HTMLElement).clientHeight - 48)
        }
    })

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
                            <Button text="发送" type="primary" onClick={async () => {
                                if (input.trim().length <= 0) { return }
                                let _messages = messages.concat([{ type: "text", role: "user", content: input }])
                                setMessages(_messages.slice().concat([
                                    { type: "text", role: "assistant", content: "" }
                                ]))
                                const promise = ClientApi.chat(
                                    [
                                        {type:"text", role:"system", content:DEFAULT_SYSTEM_TEMPLATE},
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
                                        tools:tools((msg)=>{
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
                    text="停止"
                    onClick={() => {
                        if (promise) {
                            promise.abort()
                            setPromise(undefined)
                        }
                    }}
                />}
                {!promise && <TinyButton text="清空" type="primary" onClick={() => {
                    setMessages([])
                    setMeta({})
                }} />}
                <TinyButton text="切换模型" />
                {props.mobile && <TinyButton text="收起" onClick={() => {
                    setShow(false)
                }} />}
            </ButtonGroup>
        </div>
    </div>
}