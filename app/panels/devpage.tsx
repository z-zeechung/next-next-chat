import { createContext, useEffect, useRef, useState } from "react";
import { autoGrowTextArea, useMobileScreen, useWindowSize } from "../utils";
import { Box, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Stack, StackDivider } from "@chakra-ui/react";
import { Message, MessageElement } from "../message/Message";
import { Button, List, MessageCard, TextArea, TinyButton, ListItem, Avatar, Tabs, Component, Header, Row, Left, Right, Select, Footer, Plate, Group, TextBlock, showToast, Popover, PopoverItem } from "../themes/theme";

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

import Locale, { ALL_LANG_OPTIONS, ALL_LANGS, AllLangs, changeLang, getISOLang, getLang, isRtlLang, LOCAL_ALL_LANG_OPTIONS } from "../locales";
import { KnowledgeBase } from "../knowledgebase/knowledgebase";
import { useNavigate } from "react-router-dom";
import { Live2D } from "./devpage/live2d";
import { Live2D as Live2DComponent } from "./nextchat/Live2D";

import JAVASCRIPT_TEMPLATE from "./devpage/javascript-template.txt"
import { blobToBase64, compileLive2dModel } from "./devpage/compile-live2d-model";
import { renderToString } from "react-dom/server";

import brotliPromise from 'brotli-wasm';

let i18nData = JSON.parse(JSON.stringify(LOCAL_ALL_LANG_OPTIONS))
for(let lang in i18nData){i18nData[lang]={}}

export function DevPage() {

    const navigate = useNavigate()

    const [chatAreaSize, setChatAreaSize] = useState([0, 0])
    const isMobileScreen = useMobileScreen();

    const useLanguage = useState(getLang())
    function switchLanguage(language){
        const code = Object.keys(LOCAL_ALL_LANG_OPTIONS).find(k=>LOCAL_ALL_LANG_OPTIONS[k]===language) ?? getLang()
        useLanguage[1](code)
        _setRoleName(i18nData[code]["roleName"]??"N²CHAT")
        _setPrompt(i18nData[code]["prompt"]??"")
        _setGreeting(i18nData[code]["greeting"]??[{ type: "text", role: "assistant", content: ALL_LANGS[code].DevPage.Greeting }])
    }
    useEffect(()=>{
        return ()=>{
            let i18nData = JSON.parse(JSON.stringify(LOCAL_ALL_LANG_OPTIONS))
            for(let lang in i18nData){i18nData[lang]={}}
        }
    })

    const [roleName, _setRoleName] = useState("N²CHAT")
    const useRoleName = [roleName, (v)=>{
        i18nData[useLanguage[0]]["roleName"] = v
        _setRoleName(v)
    }]
    const [prompt, _setPrompt] = useState("你是$N^2$CHAT，一个智能助手。")
    const usePrompt = [prompt, (v)=>{
        i18nData[useLanguage[0]]["prompt"] = v
        _setPrompt(v)
    }]
    const [greeting, _setGreeting] = useState([
        { type: "text", role: "assistant", content: Locale.DevPage.Greeting }
    ] as Message[])
    const useGreeting = [greeting, (v)=>{
        i18nData[useLanguage[0]]["greeting"] = v
        _setGreeting(v)
    }]
    const useMessages = useState([] as Message[])
    const useMeta = useState({})
    const useShow = useState(true)
    const usePromise = useState(undefined as ControllablePromise<any> | undefined)
    const defaultAvatar = <div style={{
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
    const useAvatar = useState(defaultAvatar)
    const useCustomScript = useState(JAVASCRIPT_TEMPLATE)
    const useSearch = useState(false)
    const usePaint = useState(false)
    const useScript = useState(false)
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
                        {tab == tabs[0] && <RolePlay {...{ usePrompt, useGreeting, usePromise, useAvatar, useSearch, usePaint, useScript, useRoleName, useDocuments, useLanguage, switchLanguage }} />}
                        {tab == tabs[1] && <Live2D {...{ useLive2DConfig, useLive2DModel, useLive2DPhysics, useLive2DTextures, useLive2DMotions, useLive2DIdleMotion, useLive2DUrl, useLive2DHeight }} />}
                        {tab == tabs[2] && <Scripting useCustomScript={useCustomScript} />}
                        <Footer>
                            <Row>
                                <Right>
                                    <Group>
                                        <Button text={Locale.DevPage.Upload} type="primary" onClick={() => {
                                            const input = document.createElement("input")
                                            input.accept = ".nnr"
                                            input.type = "file"
                                            input.onchange = async (e) => {
                                                async function readBase64(dataUrl: string) {
                                                    return await (await fetch(dataUrl)).blob()
                                                }
                                                const arr = new Uint8Array((await ((e.target as any).files[0] as File).arrayBuffer()).slice(4))
                                                const brotli = await brotliPromise;
                                                const textDecoder = new TextDecoder()
                                                const json = textDecoder.decode(brotli.decompress(arr))
                                                const data = JSON.parse(json)
                                                useRoleName[1](data?.i18n[getLang()]?.roleName ?? "N²CHAT")
                                                usePrompt[1](data?.i18n[getLang()]?.prompt ?? "你是$N^2$CHAT，一个智能助手。")
                                                useGreeting[1](data?.i18n[getLang()]?.greeting ?? [{ type: "text", role: "assistant", content: Locale.DevPage.Greeting }])
                                                if (data?.avatar) { useAvatar[1](<div style={{ display: "inline-block" }} dangerouslySetInnerHTML={{ __html: data?.avatar ?? "" }} />) }
                                                else { useAvatar[1](defaultAvatar) }
                                                useSearch[1](data?.search ?? false)
                                                usePaint[1](data?.paint ?? false)
                                                useScript[1](data?.script ?? false)
                                                useLive2DHeight[1](data?.useLive2DHeight ?? "170")
                                                let live2dConfig = undefined as any; if (data?.live2dConfig) { live2dConfig = new File([data?.live2dConfig], data?.live2dConfigName); useLive2DConfig[1](live2dConfig) }
                                                let live2dModel = undefined as any; if (data?.live2dModel) { live2dModel = new File([await readBase64(data?.live2dModel)], data?.live2dModelName); useLive2DModel[1](live2dModel) }
                                                let live2dPhysics = undefined as any; if (data?.live2dPhysics) { live2dPhysics = new File([data?.live2dPhysics], data?.live2dPhysicsName); useLive2DPhysics[1](live2dPhysics) }
                                                const textures: File[] = [] as any
                                                if (data?.live2dTextures?.length > 0) {
                                                    for (let i = 0; i < data?.live2dTextures?.length; i++) {
                                                        textures.push(new File([await readBase64(data?.live2dTextures[i])], data?.live2dTexturesName[i]))
                                                    }
                                                    useLive2DTextures[1](textures)
                                                }
                                                let live2dMotions: File[] = [] as any; if (data?.live2dMotions?.length > 0) { live2dMotions = data?.live2dMotions.map((item, idx) => new File([item], data?.live2dMotionsName[idx])); useLive2DMotions[1](live2dMotions) }
                                                useLive2DIdleMotion[1](data?.live2DIdleMotion ?? "无")
                                                if (data?.live2dConfig || data?.live2dModel || data?.live2dTextures?.length > 0) {
                                                    const idleMotion = data?.live2DIdleMotion ?? "无"
                                                    const url = await compileLive2dModel(
                                                        live2dConfig,
                                                        live2dModel,
                                                        live2dPhysics,
                                                        textures,
                                                        live2dMotions.filter(f => f.name != idleMotion),
                                                        live2dMotions.find(f => f.name == idleMotion)
                                                    )
                                                    URL.revokeObjectURL(useLive2DUrl[0] ?? "")
                                                    useLive2DUrl[1](url)
                                                }
                                                useCustomScript[1](data?.customScript ?? JAVASCRIPT_TEMPLATE)
                                            }
                                            input.click()
                                        }} />
                                        <Button text={Locale.DevPage.Save} />
                                        <Popover text={Locale.DevPage.Export}>
                                            <PopoverItem text="导出角色文件" onClick={async () => {
                                                function readFile(file?: File, isText?) {
                                                    if (!file) return undefined
                                                    if (isText) return file.text()
                                                    return blobToBase64(file)
                                                }
                                                async function readFiles(files: File[], isText?) {
                                                    const bufs: any[] = []
                                                    for (let file of files) {
                                                        bufs.push(await readFile(file, isText))
                                                    }
                                                    return bufs
                                                }
                                                const data = {
                                                    i18n: i18nData,
                                                    avatar: renderToString(useAvatar[0]),
                                                    search: useSearch[0],
                                                    paint: usePaint[0],
                                                    script: useScript[0],
                                                    live2dHeight: useLive2DHeight[0],
                                                    live2dConfig: await readFile(useLive2DConfig[0], true),
                                                    live2dConfigName: useLive2DConfig[0]?.name,
                                                    live2dModel: await readFile(useLive2DModel[0]),
                                                    live2dModelName: useLive2DModel[0]?.name,
                                                    live2dPhysics: await readFile(useLive2DPhysics[0], true),
                                                    live2dPhysicsName: useLive2DPhysics[0]?.name,
                                                    live2dTextures: await readFiles(useLive2DTextures[0]),
                                                    live2dTexturesName: useLive2DTextures[0]?.map(x => x.name),
                                                    live2dMotions: await readFiles(useLive2DMotions[0], true),
                                                    live2dMotionsName: useLive2DMotions[0]?.map(x => x.name),
                                                    live2dIdleMotion: useLive2DIdleMotion[0] == "无" ? undefined : useLive2DIdleMotion[0],
                                                    customScript: useCustomScript[0],
                                                }
                                                const json = JSON.stringify(data)
                                                // console.log(data)

                                                const brotli = await brotliPromise;
                                                const textEncoder = new TextEncoder();
                                                const uncompressedData = textEncoder.encode(json);
                                                const compressedData = brotli.compress(uncompressedData, { quality: 3 });
                                                const magic = new Uint8Array([0x0d, 0x00, 0x07, 0x21]);
                                                const dataWithMagic = new Uint8Array(magic.length + compressedData.length);
                                                dataWithMagic.set(magic, 0);
                                                dataWithMagic.set(compressedData, magic.length);

                                                const a = document.createElement("a");
                                                a.href = URL.createObjectURL(new Blob([dataWithMagic], { type: "application/octet-stream" }));
                                                a.download = `${useRoleName[0]}.nnr`;
                                                a.click();
                                            }} />
                                            <PopoverItem text="导出元数据" onClick={() => {
                                                const data = {
                                                    name: useRoleName[0],
                                                    avatar: renderToString(useAvatar[0])
                                                }
                                                const json = JSON.stringify(data)
                                                const a = document.createElement("a");
                                                a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
                                                a.download = `${useRoleName[0]}.json`;
                                                a.click();
                                            }} />
                                            <PopoverItem text="导出归档角色文件" onClick={async () => {
                                                const data = {
                                                    i18n: i18nData,
                                                    avatar: renderToString(useAvatar[0]),
                                                    search: useSearch[0],
                                                    paint: usePaint[0],
                                                    script: useScript[0],
                                                    live2d: (useLive2DConfig[0] || useLive2DModel[0] || useLive2DTextures[0].length > 0) ?
                                                        await (await fetch(await compileLive2dModel(
                                                            useLive2DConfig[0],
                                                            useLive2DModel[0],
                                                            useLive2DPhysics[0],
                                                            useLive2DTextures[0],
                                                            useLive2DMotions[0].filter(f => f.name != useLive2DIdleMotion[0]),
                                                            useLive2DMotions[0].find(f => f.name == useLive2DIdleMotion[0])
                                                        ))).text()
                                                        : undefined,
                                                    customScript: useCustomScript[0],
                                                }
                                                const json = JSON.stringify(data)

                                                const brotli = await brotliPromise;
                                                const textEncoder = new TextEncoder();
                                                const uncompressedData = textEncoder.encode(json);
                                                const compressedData = brotli.compress(uncompressedData, { quality: 9 });
                                                const magic = new Uint8Array([0x07, 0x21, 0x0d, 0x00]);
                                                const dataWithMagic = new Uint8Array(magic.length + compressedData.length);
                                                dataWithMagic.set(magic, 0);
                                                dataWithMagic.set(compressedData, magic.length);

                                                const a = document.createElement("a");
                                                a.href = URL.createObjectURL(new Blob([dataWithMagic], { type: "application/octet-stream" }));
                                                a.download = `${useRoleName[0]}.nnra`;
                                                a.click();
                                            }} />
                                        </Popover>
                                    </Group>
                                </Right>
                            </Row>
                        </Footer>
                    </Tabs>
                </Plate>
            </div>
            <div style={{ height: "100%", width: "57%" }}>
                <Plate>
                    <ChatArea {...{ useMessages, useMeta, useShow, usePromise, usePrompt, useGreeting, useAvatar, useSearch, usePaint, useScript, useDocuments, useLive2DUrl, useLive2DHeight, useCustomScript }} />
                </Plate>
            </div>
        </div>
    </Component>
}

function ChatArea(props: {
    width?, height?, mobile?, useMessages, useMeta, useShow, usePromise, usePrompt, useGreeting, useAvatar, useSearch, usePaint, useScript, useDocuments, useLive2DUrl, useLive2DHeight, useCustomScript
}) {
    const [messages, setMessages] = props.useMessages
    const [meta, setMeta] = props.useMeta
    const [show, setShow] = props.useShow
    const [promise, setPromise] = props.usePromise

    const [input, setInput] = useState("")
    const { width, height } = useWindowSize()
    const isMobile = useMobileScreen()
    const [model, setModel] = useState<"regular" | "smart">("regular")

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
                        <TinyButton text={Locale.DevPage.ChangeModel} onClick={() => {
                            setModel(model == "regular" ? "smart" : "regular")
                            showToast(<TextBlock>{Locale.NextChat.ChatArea.SwitchedToModel(model == "regular" ? "smart" : "regular")}</TextBlock>)
                        }} />
                        {props.mobile && <TinyButton text={Locale.DevPage.Collapse} onClick={() => {
                            setShow(false)
                        }} />}
                    </ButtonGroup>
                </Right>
            </Row>
        </Header>
        {greeting.concat(messages).map((msg, i) =>
            <MessageCard type={msg.role}>
                <Header>
                    {msg.role == "user" ? (
                        <Avatar icon={<UserIcon />} />
                    ) : (msg.role == "system" ? <Avatar icon={<SystemIcon />} /> :
                        <Avatar icon={msg.role == "user" ? <UserIcon /> :
                            (msg.role == "system" ? <SystemIcon /> :
                                (avatar)
                            )
                        } />
                    )}
                </Header>
                <MessageElement message={msg} />
            </MessageCard>
        )}
        <div style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            pointerEvents: "none"
        }}>
            <Live2DComponent src={props.useLive2DUrl[0]} height={Number.parseInt(props.useLive2DHeight[0]) / 100} zoom={0.618} />
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
                    const apis = {
                        getInput() { return input },
                        setInput,
                        getMessages() { return messages },
                        updateMessages(messages) {
                            setMessages(
                                messages.slice().map(m => {
                                    if (m?.type) { return m }
                                    return { type: "text", ...m }
                                })
                            )
                        },
                        getPrompt() { return prompt },
                        getInitDialog() { return greeting },
                        getPlugins() { return [] },
                        getModel() { return model },
                        setPromise,
                        createControllablePromise(cb) {
                            return new ControllablePromise(cb)
                        },
                        chat: (messages, onUpdate, options) => {
                            return ClientApi.chat([
                                { type: "text", role: "system", content: Locale.NextChat.SystemPrompt() },
                                ...messages,
                            ], onUpdate, options)
                        },
                        embed: ClientApi.embed,
                        async storeLargeData(data) { return "" },
                        async execPython(code) { return "" },
                        isSingleInteraction() { return false }
                    }
                    const onSendMessage = new Function('apis', props.useCustomScript[0])();
                    await onSendMessage(apis)
                    return
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