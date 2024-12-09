import { Component, Group, Header, Left, Right, Row, Theme, TinyButton } from "./theme"
import { AlertDialog, Button, ButtonGroup, Card, CardBody, ChakraProvider, FormControl, FormLabel, Icon, IconButton, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement, Switch, Textarea, useDisclosure, Text, Flex, CardHeader, Avatar, Heading, Box, Checkbox, ComponentWithAs, ButtonProps, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverHeader, Tabs, TabList, Tab, TabPanels, TabPanel, Select, CardFooter, TextareaProps, useToast, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import styles from "../components/ui-lib.module.scss";
import buttonStyles from "../components/button.module.scss"
import chatStyles from "../components/chat.module.scss"
import homeStyles from "../components/home.module.scss"
import { memo, useEffect, useRef, useState } from "react";
import MaxIcon from "../icons/bootstrap/fullscreen.svg";
import MinIcon from "../icons/bootstrap/fullscreen-exit.svg";
import CloseIcon from "../icons/bootstrap/x-lg.svg";
import ConfirmIcon from "../icons/bootstrap/check-lg.svg";
import CancelIcon from "../icons/bootstrap/slash-circle.svg";
import DeleteIcon from "../icons/bootstrap/trash3.svg"
import { createRoot } from "react-dom/client";
import { MessageRole } from "../typing";
import { autoGrowTextArea, useMobileScreen, useWindowSize } from "../utils";
import ReedsTexture from "../icons/bg-reeds.bmp"
import { ReactElement } from "react-markdown/lib/react-markdown";
import { nanoid } from "nanoid";
import { renderToString } from "react-dom/server";
import { getIndent, getLang, isRtlLang, isVerticalLang } from "../locales";

export const Default: Theme = {
    wrapper: ChakraProvider,
    heading: ThemeHeading,
    textBlock: ThemeTextBlock,
    row: ThemeRow,
    component: ThemeComponent,
    plate: ThemePlate,
    group: ThemeGroup,
    messageCard: ThemeMessage,
    chatHistory: ThemeChatHistory,
    button: ThemeButton,
    tinyButton: ThemeTinyButton,
    buttonGroup: ThemeButtonGroup,
    buttonCard: ThemeButtonCard,
    chatCard: ThemeChatCard,
    infoCard: ThemeInfoCard,
    textArea: ThemeTextArea,
    checkBox: ThemeCheckBox,
    modal: ThemeModal,
    avatar: ThemeAvatar,
    list: ThemeList,
    listItem: ThemeListItem,
    tabs: ThemeTabs,
    select: ThemeSelect,
    showConfirm: showConfirm,
    showToast: showToast,
    popover: ThemePopover,
    tinyPopover: ThemeTinyPopover,
    popoverItem: ThemePopoverItem,
}

const FONT_FAMILY = "sans-serif, NotoSansMongolian"

function enumChildren(children: any): { header?: any, body?: any[], footer?: any } {
    if (!Array.isArray(children)) {
        children = [children]
    }
    let header: any = undefined
    let body: any[] | undefined = []
    let footer: any = undefined
    for (let child of children) {
        if (child?.type?.name == "Header") {
            header = child
        } else if (child?.type?.name == "Footer") {
            footer = child
        } else {
            body.push(child)
        }
    }
    if (body!.length <= 0) { body = undefined }
    return { header, body, footer }
}

function enumRow(children: any): { left?: any[], center?: any[], right?: any[] } {
    if (!Array.isArray(children)) {
        children = [children]
    }
    let left: [] | undefined = []
    let center: any[] | undefined = []
    let right: [] | undefined = []
    for (let child of children) {
        if (child?.type?.name == "Left") {
            left = child
        } else if (child?.type?.name == "Right") {
            right = child
        } else if (child?.type?.name == "Center") {
            center = child
        }
    }
    if (left!.length <= 0) { left = undefined }
    if (center!.length <= 0) { center = undefined }
    if (right!.length <= 0) { right = undefined }
    return { left, center, right }
}

function handleListItem(body?: any[]) {
    if (!body) { return body }
    let titles = ""
    for (let elem of body) {
        if (elem?.type?.name == "ListItem") {
            if (isVerticalLang()) {
                if (elem?.props?.title) {
                    titles += `<div>${splitMongolian(elem.props.title)}</div>`
                }
            } else {
                for (let i of elem?.props?.title.split(" ")) {
                    titles += `<div>${i}</div>`
                }
            }
        }
    }
    const mdiv = document.createElement("div")
    mdiv.innerHTML = titles
    mdiv.style.opacity = "0"
    mdiv.style.fontSize = "14px"
    mdiv.style.fontFamily = FONT_FAMILY
    mdiv.style.fontWeight = "bold"
    document.body.appendChild(mdiv)
    const width = mdiv.clientWidth + 10
    mdiv.remove()
    return body.map(elem => elem?.type?.name == "ListItem" ? <div style={{ width: "100%", height: "100%", fontSize: 14, display: "flex", ...(isRtlLang() ? { flexDirection: "row-reverse" } : {}) }}>
        <div style={{ width: width, fontFamily: FONT_FAMILY, fontWeight: "bold", color: "#285E61", ...(isRtlLang() ? { direction: "rtl" } : {}) }}>
            {isVerticalLang() ? <div dangerouslySetInnerHTML={{ __html: splitMongolian(elem.props.title) }} /> : elem?.props?.title}
        </div>
        <div style={{ flex: 1, maxHeight: window.innerHeight * (1-0.618), overflowY: "auto", display:"flex", flexDirection: "column", gap: 8}}>
            {elem?.props?.children}
            <div style={{fontSize:12, color:"gray"}}>{elem?.props?.subTitle}</div>
            <hr/>
        </div>
    </div> : elem)
}

function splitMongolian(text) {
    const re = /[\u1801-\u18AA]+/g
    text = text?.replaceAll(" ", "&nbsp;")
    return `
        <div style="display:flex;align-items: top;">
            ${text?.replaceAll(re, match =>
        `<span style="writing-mode: vertical-lr;">${match}</span>`
    )}
        </div>
    `
}

function ThemeHeading(props: { children?: any }) {
    if (isVerticalLang()) {
        return <Heading size={"sm"} paddingTop={0} paddingBottom={0} paddingLeft={4} paddingRight={4} width={"100%"} fontFamily={FONT_FAMILY} height={12}>
            <div style={{ WebkitTextStroke: 0.7 }} dangerouslySetInnerHTML={{ __html: splitMongolian(props.children) }} />
        </Heading>
    }
    if (isRtlLang()) {
        return <Heading size={"md"} paddingTop={2} paddingBottom={3} paddingLeft={4} paddingRight={4} width={"100%"} fontFamily={FONT_FAMILY} height={12} display={"flex"} flexDirection={"row-reverse"}>
            {props.children}
        </Heading>
    }
    return <Heading size={"md"} paddingTop={2} paddingBottom={3} paddingLeft={4} paddingRight={4} width={"100%"} height={12}>
        {props.children}
    </Heading>
}

function MongolianTextBlock(props: { children?: any }) {
    const ref = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState(0 as any)
    const [text, setText] = useState("")
    const [vertical, setVertical] = useState(true)
    useEffect(() => {
        if (!ref.current) return
        if (props.children.trim().length <= 0) {
            setHeight(8)
            setText(props.children)
            setVertical(false)
            return
        }
        if (props.children.length * 256 / ref.current.clientWidth < 100) {
            setVertical(false)
            setHeight(undefined)
            setText(splitMongolian(props.children))
            return
        }
        setHeight(Math.max(props.children.length * 256 / ref.current.clientWidth, 128))
        setText(props.children)
    }, [setHeight, setText, props.children, ref])
    return <div ref={ref} style={{ width: "100%", ...(height ? { height: height } : {}), ...(vertical ? { writingMode: "vertical-lr" } : {}) }} dangerouslySetInnerHTML={{ __html: text }} />
}
function ThemeTextBlock(props: { children?: any }) {
    if (isVerticalLang()) {
        return <div>{props.children.split("\n").map((ln, i) => <>
            <MongolianTextBlock>{ln}</MongolianTextBlock>
            {i < props.children.split("\n").length - 1 && ln.trim().length > 0 && <hr style={{ opacity: 1 }} />}
        </>)}</div>
    }
    return <div style={{ width: "100%", whiteSpace:"pre-line", textIndent: props.children.includes("\n")?getIndent():0, ...(isRtlLang()?{direction:"rtl"}:{}) }}>{
        props.children.split("\n").map(ln=><div>{ln.trim().length > 0 ? ln : <br />}</div>)
    }</div>
}

function ThemeRow(props: { children?: any }) {
    let { left, center, right } = enumRow(props.children)

    if (isRtlLang()) {
        let tmp = left
        left = right
        right = tmp
    }

    if (left && !center && !right) {
        return <table width={"100%"}>
            <tr><td width={"100%"} align="left" style={{ verticalAlign: "middle" }}>{left}</td></tr>
        </table>
    } else if (!left && center && !right) {
        return <table width={"100%"}>
            <tr><td width={"100%"} align="center" style={{ verticalAlign: "middle" }}>{center}</td></tr>
        </table>
    } else if (!left && !center && right) {
        return <table width={"100%"}>
            <tr><td width={"100%"} align="right" style={{ verticalAlign: "middle" }}>{right}</td></tr>
        </table>
    } else if (left && !center && right) {
        return <table width={"100%"}>
            <tr>
                {<td align="left" style={{ verticalAlign: "middle" }}>{left}</td>}
                {<td align="right" style={{ verticalAlign: "middle" }}>{right}</td>}
            </tr>
        </table>
    }
    return <table width={"100%"}>
        <tr>
            {<td width={"33%"} align="left" style={{ verticalAlign: "middle" }}>{left}</td>}
            {<td width={"34%"} align="center" style={{ verticalAlign: "middle" }}>{center}</td>}
            {<td width={"33%"} align="right" style={{ verticalAlign: "middle" }}>{right}</td>}
        </tr>
    </table>
}

function ThemeGroup(props: { children?: any, isAttached?: boolean }) {
    let children = props.children
    if (isRtlLang()) {
        let newChildren: any[] = []
        for (let child of children) {
            newChildren.push(child)
        }
        children = newChildren.reverse()
    }
    if (props.isAttached) {
        return <div style={{ display: "inline-flex", gap: 0 }}>
            {children?.map((elem, i) => {
                const position: "left" | "middle" | "right"
                    = i == 0 ? "right" : i == children.length - 1 ? "left" : "middle"
                if (elem?.type?.name == "ThemeSelect") {
                    return <ThemeSelect {...elem.props} embed={position} />
                }
                if (elem?.type?.name == "ThemeButton") {
                    return <ThemeButton {...elem.props} embed={position} />
                }
                if (elem?.type?.name == "ThemeTextArea") {
                    return <ThemeTextArea {...elem.props} embed={position} />
                }
                return elem
            })}
        </div>
    }
    return <div style={{ display: "inline-flex", gap: 8 }}>
        {children}
    </div>
}

function ThemeInfoCard(props: {
    icon?: JSX.Element | string
    title?: string
    subTitle?: string
    children?: any
    type?: "primary" | "plain"
    onClick?: () => void
}) {
    const { header, body, footer } = enumChildren(props.children)

    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null)

    const title = isVerticalLang() ? <span dangerouslySetInnerHTML={{ __html: splitMongolian(props.title) }}></span> : props.title
    const subTitle = isVerticalLang() ? <span dangerouslySetInnerHTML={{ __html: splitMongolian(props.subTitle) }}></span> : props.subTitle

    return <Card
        width={"100%"}
        {...(props.type ? {} : {
            background: isHovered ? "#EDF2F7" : "#F7FAFC"
        })}
        {...(props.onClick ? {
            onClick: props.onClick,
            onMouseEnter: () => { setIsHovered(true) },
            onMouseLeave: () => { setIsHovered(false) }
        } : {})}
        variant={props.type == "plain" ? "outline" : "elevated"}
    >
        {(props.title || props.icon || props.subTitle) &&<CardHeader padding={3} paddingBottom={0}>
            <Flex>
                <Flex
                    flex='1' gap='4' alignItems='center' flexWrap="nowrap" padding={0}
                    flexDirection={isRtlLang() ? "row-reverse" : "row"}
                >
                    {props.icon ? <ThemeAvatar icon={props.icon} /> : <div style={{ width: 4 }}></div>}
                    <Box width={"100%"}>
                        {isVerticalLang() && <Flex flexDirection={"row"}>
                            <Heading width={"100%"} size='sm' whiteSpace={"nowrap"} overflow={"hidden"} fontFamily={FONT_FAMILY}>
                                {title}
                            </Heading>
                            {props.subTitle && <Text fontSize={"12px"}>{subTitle}</Text>}
                        </Flex>}
                        {!isVerticalLang() && <><Heading size='sm' whiteSpace={"nowrap"} overflow={"hidden"} fontFamily={FONT_FAMILY}>
                            {title}
                        </Heading>
                            {props.subTitle && <Text fontSize={"12px"}>{subTitle}</Text>}</>}
                    </Box>
                </Flex>
            </Flex>
        </CardHeader>}
        {body && <CardBody>
            <Flex
                flex={1} gap={4} direction={"column"} padding={0}
            >
                {...body}
            </Flex>
        </CardBody>}
        {footer && <CardFooter padding={3} paddingTop={0} paddingBottom={2}>
            {footer}
        </CardFooter>}
    </Card>
}

function ThemeComponent(props: { children?: any, type?: "primary" | "plain", subHeader?: boolean, bodyOnly?: boolean }) {
    let { header, body, footer } = enumChildren(props.children)
    body = handleListItem(body)
    if (props.bodyOnly) {
        return <div style={{ flex: 1, overflow: "auto", margin: 0, gap: 12, display: "flex", flexDirection: "column" }}>{body}</div>
    }
    return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: props.type == "primary" ? "#319795" : "#fff", color: props.type == "primary" ? "#fff" : "#000", fontFamily: FONT_FAMILY }}>
        <div style={{ flexGrow: 0, margin: props.subHeader ? 0 : 10, marginBottom: props.subHeader ? 0 : 6 }}>{header?.props.children}</div>
        {(!props.type) && <hr />}
        <div style={{ flex: 1, overflow: "auto", margin: 12, gap: 12, display: "flex", flexDirection: "column", position:"relative" }}>{body}</div>
        {(!props.type) && <hr />}
        <div style={{ flexGrow: 0, margin: 12, marginTop: 6, gap: 8, display: "flex", flexDirection: "column" }}>{footer?.props.children}</div>
    </div>
}

function ThemePlate(props: { children?: any }) {
    return <div style={{ width: "100%", height: "100%", boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)" }}>
        {props.children}
    </div>
}

function ThemeTabs(props: {
    tab?: string
    onChange?: ((tab: string) => void)
    labels?: string[],
    children?: any
    type?: "primary" | "plain"
}): JSX.Element {
    const { header, body, footer } = enumChildren(props.children)
    return <ThemeComponent subHeader type={props.type}>
        <Header>
            <Tabs transform={isRtlLang() ? "scaleX(-1)" : undefined} isFitted index={props.labels?.indexOf(props?.tab ?? "")} onChange={i => { props?.onChange?.((props.labels?.[i]) ?? "") }} width={"100%"}>
                <TabList>
                    {props.labels?.map(label => {
                        let _label: any = label
                        if (isVerticalLang()) {
                            _label = <div dangerouslySetInnerHTML={{ __html: splitMongolian(label) }} />
                        }
                        return <Tab transform={isRtlLang() ? "scaleX(-1)" : undefined} fontSize={14}>{_label}</Tab>
                    })}
                </TabList>
            </Tabs>
        </Header>
        {body}
        {footer}
    </ThemeComponent>
}

function ThemeList(props: { children?: any, type?: "primary" | "plain" }): JSX.Element {
    return <ThemeComponent bodyOnly type={props.type}>
        {props.children}
    </ThemeComponent>
}

function ThemeButton(props: {
    icon?: JSX.Element
    text?: string
    onClick?: () => void
    type?: "text" | "primary" | "danger"
    disabled?: boolean
    embed?: "left" | "middle" | "right"
}): JSX.Element {
    if (!props.text) {
        const leftRadius = props.embed == "left" || props.embed == "middle" ? 0 : props.embed ? 12 : 20
        const rightRadius = props.embed == "right" || props.embed == "middle" ? 0 : props.embed ? 12 : 20
        return <IconButton
            aria-label=''
            icon={props.icon}
            {...(props.type == "text" ? { colorScheme: "teal", variant: "ghost" } : {})}
            {...(props.type == "primary" ? { colorScheme: "teal", variant: "solid" } : {})}
            {...(props.type == "danger" ? { variant: "solid", background: "red.400", color: "white" } : {})}
            {...(props.type == undefined ? { variant: "outline", background: "white", outline:"none", border:"none", shadow:"0 4px 8px rgba(0,0,0,0.1)" } : {})}
            {...(props.disabled ? { colorScheme: "gray", variant: "solid" } : {})}
            onClick={props.disabled ? () => { } : props.onClick}
            style={{ height: 36, width: 36 }}
            borderLeftRadius={leftRadius}
            borderRightRadius={rightRadius}
        />
    }
    const leftRadius = props.embed == "left" || props.embed == "middle" ? 0 : 12
    const rightRadius = props.embed == "right" || props.embed == "middle" ? 0 : 12
    return <Button
        {...(!isRtlLang() ? { leftIcon: props.icon } : {})}
        {...(isRtlLang() ? { rightIcon: props.icon } : {})}
        {...(props.type == "text" ? { colorScheme: "teal", variant: "ghost" } : {})}
        {...(props.type == "primary" ? { colorScheme: "teal", variant: "solid" } : {})}
        {...(props.type == "danger" ? { variant: "solid", background: "red.400", color: "white" } : {})}
        {...(props.type == undefined ? { variant: "outline", background: "white", outline:"none", border:"none", shadow:"0 4px 8px rgba(0,0,0,0.1)" } : {})}
        {...(props.disabled ? { colorScheme: "gray", variant: "solid" } : {})}
        onClick={props.disabled ? () => { } : props.onClick}
        style={{ height: 36, paddingLeft: 12, paddingRight: 12 }}
        borderLeftRadius={leftRadius}
        borderRightRadius={rightRadius}
        fontWeight={"normal"}
        fontSize={"small"}
        maxWidth={150}
    >
        <div style={{display:"inline-block", ...(["cn", "cnt"].includes(getLang())?{}:{whiteSpace:"break-spaces"})}}>
            {props.text}
        </div>
    </Button>
}

function ThemeTinyButton(props: {
    icon?: JSX.Element
    text?: string
    onClick?: () => void
    type?: "text" | "primary" | "danger"
    disabled?: boolean
    embed?: "left" | "middle" | "right"
}): JSX.Element {
    const leftRadius = props.embed == "left" || props.embed == "middle" ? 0 : 20
    const rightRadius = props.embed == "right" || props.embed == "middle" ? 0 : 20
    if (!props.text) {
        return <IconButton
            aria-label=''
            size={"xs"}
            icon={props.icon}
            {...(props.type == "text" ? { colorScheme: "teal", variant: "ghost", color: "gray.500" } : {})}
            {...(props.type == "primary" ? { colorScheme: "teal", variant: "solid" } : {})}
            {...(props.type == "danger" ? { variant: "solid", background: "red.400", color: "white" } : {})}
            {...(props.type == undefined ? { variant: "outline", background: "white", outline:"none", border:"1px lightgray solid" } : {})}
            {...(props.disabled ? { colorScheme: "gray", variant: "solid" } : {})}
            onClick={props.disabled ? () => { } : props.onClick}
            style={{ height: 24 }}
            borderLeftRadius={leftRadius}
            borderRightRadius={rightRadius}
        />
    }
    return <Button
        size={"xs"}
        {...(!isRtlLang() ? { leftIcon: props.icon } : {})}
        {...(isRtlLang() ? { rightIcon: props.icon } : {})}
        {...(props.type == "text" ? { colorScheme: "teal", variant: "ghost", color: "gray.500" } : {})}
        {...(props.type == "primary" ? { colorScheme: "teal", variant: "solid" } : {})}
        {...(props.type == "danger" ? { variant: "solid", background: "red.400", color: "white" } : {})}
        {...(props.type == undefined ? { variant: "outline", background: "white", outline:"none", border:"1px lightgray solid" } : {})}
        {...(props.disabled ? { colorScheme: "gray", variant: "solid" } : {})}
        onClick={props.disabled ? () => { } : props.onClick}
        style={{ height: 24, borderRadius: 12 }}
        borderLeftRadius={leftRadius}
        borderRightRadius={rightRadius}
        fontWeight={"normal"}
        fontSize={"x-small"}
    >
        {props.text}
    </Button>
}

function ThemeButtonCard(props: {
    icon?: JSX.Element
    text?: string
    onClick?: () => void
}) {
    return <Button
        height={75.35}
        width={75.35}
        flexDirection={"column"}
        fontSize={"x-small"}
        fontWeight={"normal"}
        padding={0}
        onClick={props.onClick}
    >
        <div style={{height:75, width:75, transform: isVerticalLang() ? "rotate(-90deg)" : "rotate(0deg)"}}>
            <div style={{height:30.5, paddingTop:14.5, paddingLeft:(75-16)/2, paddingRight:(75-16)/2, paddingBottom:0}}>
                <div style={{height:16, width:16, transform: isVerticalLang() ? "rotate(90deg)" : "rotate(0deg)"}}>
                    {props.icon}
                </div>
            </div>
            <div style={{
                width: 75, height:75-30.5, textWrap:"pretty", display:"flex", justifyContent:"center", alignItems:"center",
                lineHeight:0.9,
                ...(isVerticalLang() ? {writingMode:"vertical-lr", transform: "rotate(90deg)"} : {})
            }}>
                {props.text}
            </div>
        </div>
    </Button>
}

function ThemeTextArea(props: {
    placeholder?: string
    onInput?: (value: string) => void
    onChange?: (value: string) => void
    autoFocus?: boolean
    autoGrow?: boolean
    rows?: number
    value?: string
    disabled?: boolean
    embed?: "left" | "middle" | "right"
}) {
    const { width, height } = useWindowSize();
    const [rows, setRows] = useState(props.rows ?? 3)
    const ref = useRef(null)

    const [areaHeight, setAreaHeight] = useState(36 * (props.rows??1))

    const tlRadius = (props.embed == "left" || props.embed == "middle") ? 0 : 10
    const trRadius = (props.embed == "right" || props.embed == "middle") ? 0 : 10
    const blRadius = (props.embed == "left" || props.embed == "middle") ? (rows >= 2 ? 10 : 0) : 10
    const brRadius = (props.embed == "right" || props.embed == "middle")  ? (rows >= 2 ? 10 : 0) : 10

    useEffect(() => {
        if (props.autoGrow && ref.current) {
            if (isVerticalLang()) {
                const text = (ref.current as any)?.value
                const width = (ref.current as any)?.offsetWidth
                if (text.length * 256 / width < 100) {
                    const mdiv = document.createElement("div")
                    mdiv.style.opacity = "0"
                    mdiv.style.fontFamily = FONT_FAMILY
                    mdiv.innerText = text.split(" ").join("\n")
                    document.body.appendChild(mdiv)
                    console.log(mdiv.clientWidth)
                    setAreaHeight(Math.max(mdiv.clientWidth + 16, 36*rows))
                    mdiv.remove()
                } else {
                    setAreaHeight(Math.max(text.length * 256 / width, 128, 36*rows))
                }
            } else {
                const mdiv = document.createElement("div")
                mdiv.style.opacity = "0"
                mdiv.innerText = (ref.current as any)?.value
                mdiv.style.width = (ref.current as any)?.offsetWidth + "px"
                mdiv.style.fontFamily = FONT_FAMILY
                document.body.appendChild(mdiv)
                setRows(Math.max(mdiv.offsetHeight / 24, props.rows || 3))
                mdiv.remove()
            }
        }
    })

    return <Textarea
        ref={ref}
        resize="none"
        width={"100%"}
        rows={rows}
        fontSize={14}
        placeholder={props.placeholder}
        onInput={(e) => { if (props.onInput) props.onInput(e.currentTarget.value) }}
        onChange={(e) => { if (props.onChange) props.onChange(e.currentTarget.value) }}
        autoFocus={props.autoFocus}
        value={(rows == 1 && !props.autoGrow) ? props.value?.replaceAll("\n", "") : props.value}
        disabled={props.disabled}
        maxHeight={height / 2}
        fontFamily={FONT_FAMILY}
        style={{
            borderTopLeftRadius: tlRadius,
            borderTopRightRadius: trRadius,
            borderBottomLeftRadius: blRadius,
            borderBottomRightRadius: brRadius,
            ...(isRtlLang() ? { direction: "rtl" } : {}),
            ...(isVerticalLang() ? {
                ...(areaHeight == 36 ? {} : { writingMode: "vertical-lr" }),
                height: areaHeight
            } : {})
        }}
    />
}

async function showToast(children: any) {
    return new Promise<void>(resolve => {
        const div = document.createElement("div");
        div.className = styles.show;
        document.body.appendChild(div);

        const root = createRoot(div);
        const close = () => {
            div.classList.add(styles.hide);

            setTimeout(() => {
                root.unmount();
                div.remove();
                resolve()
            }, 300);
        };

        setTimeout(() => {
            close();
        }, 5000);

        root.render(
            <ChakraProvider>
                <div style={{
                    position: "fixed", bottom: 24, width: window.innerWidth, textAlign: "center"
                }}>
                    <div style={{
                        padding: 8, paddingLeft: 16, paddingRight: 16, border: "1px solid lightgray", borderRadius: 1000, display: "inline-block", fontFamily: FONT_FAMILY, background: "white"
                    }}>
                        {children}
                    </div>
                </div>
            </ChakraProvider>
        );
    })
}

function ThemePopover(props:{
    children?:any
    icon?:JSX.Element
    text?:string
    type?:"text" | "primary" | "danger"
}){
    return <Menu>
        <MenuButton
            as={IconButton}
            aria-label=''
            icon={props.icon}
            {...(props.type == "text" ? { colorScheme: "teal", variant: "ghost" } : {})}
            {...(props.type == "primary" ? { colorScheme: "teal", variant: "solid" } : {})}
            {...(props.type == "danger" ? { variant: "solid", background: "red.400", color: "white" } : {})}
            {...(props.type == undefined ? { variant: "outline", background: "white", outline:"none", border:"none", shadow:"0 4px 8px rgba(0,0,0,0.1)" } : {})}
            borderLeftRadius={12}
            borderRightRadius={12}
            fontWeight={"normal"}
            fontSize={"small"}
            style={{ height: 36, paddingLeft: 12, paddingRight: 12 }}
        >
            {props.text}
        </MenuButton>
        <MenuList>
            {props.children}
        </MenuList>
    </Menu>
}

function ThemeTinyPopover(props:{
    children?:any
    icon?:JSX.Element
    text?:string
    type?:"text" | "primary" | "danger"
}){
    return <Menu>
        <MenuButton
            size={"xs"}
            as={IconButton}
            aria-label=''
            icon={props.icon}
            {...(props.type == "text" ? { colorScheme: "teal", variant: "ghost", color: "gray.500" } : {})}
            {...(props.type == "primary" ? { colorScheme: "teal", variant: "solid" } : {})}
            {...(props.type == "danger" ? { variant: "solid", background: "red.400", color: "white" } : {})}
            {...(props.type == undefined ? { variant: "outline", background: "white", outline:"none", border:"1px lightgray solid" } : {})}
            borderRadius={100}
            fontWeight={"normal"}
            fontSize={"x-small"}
        >
            {props.text}
        </MenuButton>
        <MenuList>
            {props.children}
        </MenuList>
    </Menu>
}

function ThemePopoverItem(props:{
    text?:string
    icon?:JSX.Element
    onClick?:()=>void
}){
    return <MenuItem fontSize={"small"} icon={props.icon??<div style={{display:"inline-block",width:16,height:16}}/>} onClick={props.onClick}>
        {props.text}
    </MenuItem>
}

/** LEGACY */

function ThemeMessage(props?: {
    children?: any
    type?: MessageRole
}) {
    return <div className={chatStyles["chat-message-item"]}
        style={{
            background: props?.type == "user" ? "#319795" : (props?.type == "system" ? "#B2F5EA" : "#EDF2F7"),
            color: props?.type == "user" ? "#fff" : "#000",
        }}
    >
        {props?.children}
    </div>
}

// 预读取图片数据
// 大文件读取不能放在useEffect里，不然每次重渲都会读一次，开销很大
// let BackgroundTexture:string|undefined = undefined
// async function loadBackground(){
//     if(BackgroundTexture) return BackgroundTexture
//     return new Promise((resolve)=>{
//         const imageUrl = ReedsTexture.src;
//         const img = new Image();
//         img.onload = () => {
//             const canvas = document.createElement('canvas');
//             const ctx = canvas.getContext('2d');
//             canvas.width = img.width;
//             canvas.height = img.height;
//             ctx?.drawImage(img, 0, 0, img.width, img.height);
//             if(ctx == null) return
//             const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//             const data = imageData.data;
//             for (let i = 0; i < data.length; i += 4) {
//               if(data[i]==255){data[i+3]=0}
//               else{data[i]=255;data[i+1]=255;data[i+2]=255;data[i+3]=200}
//             }
//             ctx.putImageData(imageData, 0, 0);
//             const dataUrl = canvas.toDataURL('image/png'); 
//             resolve(dataUrl);
//             BackgroundTexture = dataUrl
//         };
//         img.src = imageUrl;
//     })
// }

function ThemeChatHistory(props?: {
    children?: any
    show?: boolean
}) {
    const isMobileScreen = useMobileScreen();
    const { width } = useWindowSize();
    const divRef = useRef(null)
    const imgRef = useRef(null)
    const [divWidth, setDivWidth] = useState(300)
    const [isHovered, setIsHovered] = useState(false);
    // useEffect(()=>{
    //     loadBackground().then((url)=>{
    //         if(imgRef.current){
    //             (imgRef.current as any).src = url
    //         }
    //     })

    //     const resizeObserver = new ResizeObserver(entries=>{
    //         for(let entry of entries){
    //             setDivWidth(entry.borderBoxSize[0].inlineSize)
    //         }
    //     })
    //     if(divRef.current){
    //         resizeObserver.observe(divRef.current)
    //     }
    //     return ()=>{
    //         if(divRef.current){
    //             resizeObserver.unobserve(divRef.current)
    //         }
    //     }
    // })

    return <div
        ref={divRef}
        className={`
            ${homeStyles.sidebar}
            ${props?.show && homeStyles["sidebar-show"]}
        `}
        style={{
            background: "#319795",
            color: "#fff",
            width: isMobileScreen ? "" : (isHovered ? 300 : Math.min(width * (1 / 3), 300))
        }}
        onMouseEnter={() => { setIsHovered(true) }}
        onMouseLeave={() => { setIsHovered(false) }}
    >
        {/* <img 
            ref={imgRef}
            style={{
                position:"absolute",
                bottom:"0",
                left:"0",
                width:divWidth
            }}
        /> */}
        {props?.children}
    </div>
}

function themePopover(button, children) {
    return <Popover>
        <PopoverTrigger>
            {button}
        </PopoverTrigger>
        <PopoverContent width={"fit-content"}>
            <PopoverArrow />
            <PopoverCloseButton size={"lg"} />
            <PopoverBody width={"fit-content"}>
                <table>
                    <tr>
                        <td>{children}</td>
                        <td width={"48px"}></td>
                    </tr>
                </table>
            </PopoverBody>
        </PopoverContent>
    </Popover>
}

function ThemeButtonOld(props: {
    icon?: JSX.Element
    text?: string
    onClick?: () => void
    type?: string
    disabled?: boolean
    embed?: "left" | "right"
    popover?: any
}) {
    let type = "outline"
    if (props.type == "primary") type = "solid"
    if (props.type == "text") type = "ghost"
    if (props.type == "danger") type = "solid"

    let danger = props.type == "danger"

    if (!props.text && !props.embed) {
        return <ThemeIconButton
            icon={props.icon}
            onClick={props.onClick}
            type={type}
            disabled={props.disabled}
            size="sm"
            popover={props.popover}
        />
    }

    const ret = <Button
        size={"sm"}
        colorScheme={danger ? "red" : (props.disabled ? 'gray' : 'teal')}
        leftIcon={isRtlLang() ? undefined : props.icon}
        rightIcon={isRtlLang() ? props.icon : undefined}
        onClick={() => {
            if (!props.disabled) {
                (props.onClick ?? (() => { }))()
            }
        }}
        variant={type}
        disabled={props.disabled}
        style={{
            fontSize: "14px",
            fontWeight: "normal",
            background: (type == "outline" && !props.disabled) ? "#fff" : ""
        }}
        {...props.embed && {
            width: "100%",
            height: "100%",
            ...(props.embed == "right" ? { borderLeftRadius: 0 } : { borderRightRadius: 0 })
        }}
    >
        {props.text}
    </Button>

    if (!props.popover) {
        return ret
    } else {
        return themePopover(ret, props.popover)
    }
}

function ThemeTinyButtonOld(props: {
    icon?: JSX.Element
    text?: string
    onClick?: () => void
    type?: string
    disabled?: boolean
    popover?: any
}) {
    let type = "outline"
    if (props.type == "primary") type = "solid"
    if (props.type == "text") type = "ghost"
    if (props.type == "danger") type = "solid"

    let danger = props.type == "danger"

    if (!props.text) {
        return <ThemeIconButton
            icon={props.icon}
            onClick={props.onClick}
            type={type}
            disabled={props.disabled}
            size="xs"
            popover={props.popover}
        />
    }

    const ret = <Button
        size={"xs"}
        colorScheme={danger ? "red" : (props.disabled ? 'gray' : 'teal')}
        leftIcon={isRtlLang() ? undefined : props.icon}
        rightIcon={isRtlLang() ? props.icon : undefined}
        onClick={() => {
            if (!props.disabled) {
                (props.onClick ?? (() => { }))()
            }
        }}
        variant={type}
        disabled={props.disabled}
        style={{
            fontSize: "12px",
            fontWeight: "normal",
            background: (type == "outline" && !props.disabled) ? "#fff" : "",
            borderRadius: "1000px",
            color: props.type == "text" ? "#000" : "",
            opacity: props.type == "text" ? "0.5" : ""
        }}
    >
        {props.text}
    </Button>

    if (!props.popover) {
        return ret
    } else {
        return themePopover(ret, props.popover)
    }
}

function ThemeIconButton(props: {
    icon?: JSX.Element
    onClick?: () => void
    type?: string
    disabled?: boolean
    size?: string
    popover?: any
}) {

    let danger = props.type == "danger"

    const ret = <IconButton
        aria-label=''
        size={props.size}
        colorScheme={danger ? "red" : (props.disabled ? 'gray' : 'teal')}
        icon={props.icon}
        onClick={() => {
            if (!props.disabled) {
                (props.onClick ?? (() => { }))()
            }
        }}
        variant={props.type}
        disabled={props.disabled}
        style={{
            background: (props.type == "outline" && !props.disabled) ? "#fff" : "",
            borderRadius: "1000px"
        }}
    />

    if (!props.popover) {
        return ret
    } else {
        return themePopover(ret, props.popover)
    }
}

function ThemeButtonGroup(props: { children: any }) {
    return <ButtonGroup>
        {props.children}
    </ButtonGroup>
}

function ThemeTextAreaOld(props: {
    placeholder?: string
    onInput?: (v: string) => void
    onChange?: (value: string) => void
    autoFocus?: boolean
    rows?: number
    leftAttachment?: JSX.Element
    rightAttachment?: JSX.Element
    value?: string
    disabled?: boolean
}): JSX.Element {

    let rightAttachment = props.rightAttachment
    if (props.rightAttachment?.type.name == "ThemeButton") {
        rightAttachment = <ThemeButton{...props.rightAttachment.props} embed={"right"} />
    }
    if (props.rightAttachment?.type.name == "ThemeSelect") {
        rightAttachment = <ThemeSelect{...props.rightAttachment.props} embed={"right"} />
    }

    let leftAttachment = props.leftAttachment
    if (props.leftAttachment?.type.name == "ThemeButton") {
        leftAttachment = <ThemeButton{...props.leftAttachment.props} embed={"left"} />
    }
    if (props.leftAttachment?.type.name == "ThemeSelect") {
        leftAttachment = <ThemeSelect{...props.leftAttachment.props} embed={"left"} />
    }

    const ref = useRef(null)
    const { width, height } = useWindowSize();
    if (props.rows == 1) {
        return ThemeInput(props)
    }
    return <InputGroup>
        {leftAttachment && <InputLeftAddon style={["ThemeButton", "ThemeSelect"].includes(props.leftAttachment?.type.name) ? { padding: 0 } : {}}>
            {leftAttachment}
        </InputLeftAddon>}
        <Textarea
            ref={ref as any}
            placeholder={props.placeholder}
            rows={ref.current ? Math.max(autoGrowTextArea(ref.current), props.rows ?? 2) : props.rows}
            resize={'none'}
            onInput={(e) => { if (props.onInput) props.onInput(e.currentTarget.value) }}
            onChange={(e) => { if (props.onChange) props.onChange(e.currentTarget.value) }}
            autoFocus={props.autoFocus}
            value={props.value}
            disabled={props.disabled}
            variant={props.disabled ? 'filled' : 'outline'}
            maxHeight={height / 2}    // 权宜之计
            borderTopRightRadius={props.rightAttachment ? 0 : undefined}
            style={{
                // ...(isVerticalLang()?{writingMode:"vertical-lr"}:{}),
                ...(isRtlLang() ? { direction: "rtl" } : {})
            }}
        />
        {rightAttachment && <InputRightAddon style={["ThemeButton", "ThemeSelect"].includes(props.rightAttachment?.type.name) ? { padding: 0 } : {}}>
            {rightAttachment}
        </InputRightAddon>}
    </InputGroup>
}

function ThemeButtonCardOld(props: {
    icon?: JSX.Element
    text?: string
    onClick?: () => void
    popover?: any
}) {
    const ret = <Button
        className={`
            ${buttonStyles["icon-button"]} 
            ${buttonStyles.shadow}
            clickable
        `}
        style={{
            width: 81,
            height: 83.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            fontSize: 12,
        }}
        onClick={props.onClick}
    >
        <i style={{ padding: "8px" }}>{props.icon}</i>
        {props.text}
    </Button>

    if (!props.popover) {
        return ret
    } else {
        return themePopover(ret, props.popover)
    }
}

function ThemeChatCard(props: {
    icon?: JSX.Element | string
    title?: string
    count?: number
    time?: Date
    onClick?: () => void
    selected?: boolean
    managed?: boolean
    onDelete?: () => void
}) {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null)

    return <>
        {!props.managed && <Card
            style={{
                background: isHovered ? "#E2E8F0" : "#EDF2F7",
                borderStyle: "solid",
                borderWidth: props.selected ? "2px" : "0px",
                borderColor: "#2C7A7B"
            }}
            onClick={props.onClick}
            onMouseEnter={() => { setIsHovered(true) }}
            onMouseLeave={() => { setIsHovered(false) }}
        >
            <CardHeader padding={"12px"}>
                <Flex >
                    <Flex flex='1' gap='4' alignItems='center' flexWrap="nowrap">
                        <ThemeAvatar icon={props.icon} />
                        <Box>
                            <Heading size='sm' whiteSpace={"nowrap"} overflow={"hidden"}>{props.title}</Heading>
                            <Text fontSize={"12px"}>{props.count}条对话</Text>
                        </Box>
                    </Flex>
                </Flex>
                <Text fontSize={"12px"} color={"gray"}>{props.time?.toLocaleString()}</Text>
            </CardHeader>
            <div
                style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12
                }}
            >
                <ThemeTinyButton
                    icon={<DeleteIcon />}
                    type="text"
                    onClick={props.onDelete}
                />
            </div>
        </Card>}
        {props.managed && <Card
            ref={ref as any}
            onMouseEnter={() => { setIsHovered(true) }}
            onMouseLeave={() => { setIsHovered(false) }}
            background={"#E2E8F0"}
        >
            <CardHeader padding={"12px"}>
                <Flex >
                    <Flex flex='1' gap='4' alignItems='center' flexWrap="nowrap">
                        <IconButton
                            aria-label=""
                            borderRadius={1000}
                            background={"red"}
                            color={"white"}
                            opacity={0.8}
                            icon={<CloseIcon />}
                            onClick={props.onDelete}
                        />
                        <Box>
                            <Heading size='sm' whiteSpace={"nowrap"} overflow={"hidden"}>
                                <span>{props.icon}</span>
                                {props.title}
                            </Heading>
                            <Text fontSize={"12px"}>{props.count}条对话</Text>
                        </Box>
                    </Flex>
                </Flex>
                <Text fontSize={"12px"} color={"gray"}>{props.time?.toLocaleString()}</Text>
            </CardHeader>
            <Checkbox
                colorScheme="teal"
                position={"absolute"}
                bottom={3}
                right={3}
                background={"#ffffffa0"}
                paddingLeft={2}
                paddingRight={2}
                borderRadius={1000}
                color={"#285E61"}
                onChange={(e) => {
                    if (!ref.current) return
                    if (e.currentTarget.checked) {
                        (ref.current as any).style.background = "#EDF2F7"
                    } else {
                        (ref.current as any).style.background = "#E2E8F0"
                    }
                }}
            >
                选择
            </Checkbox>
        </Card>}
    </>
}

function ThemeInfoCardOld(props: {
    icon?: JSX.Element | string
    title?: string
    subTitle?: string
    children?: JSX.Element
}) {
    return <Card
        background={"#F7FAFC"}
    >
        <CardHeader padding={"12px"}>
            <Flex >
                <Flex flex='1' gap='4' alignItems='center' flexWrap="nowrap">
                    {props.icon ? <ThemeAvatar icon={props.icon} /> : <div style={{ width: 4 }}></div>}
                    <Box>
                        <Heading size='sm' whiteSpace={"nowrap"} overflow={"hidden"}>
                            {props.title}
                        </Heading>
                        {props.subTitle && <Text fontSize={"12px"}>{props.subTitle}</Text>}
                    </Box>
                </Flex>
            </Flex>
        </CardHeader>
        {props.children && <CardBody>
            {props.children}
        </CardBody>}
        <CardFooter padding={2}>

        </CardFooter>
    </Card>
}

function ThemeInput(props: {
    placeholder?: string
    onInput?: (v: string) => void
    onChange?: (value: string) => void
    autoFocus?: boolean
    rows?: number
    leftAttachment?: JSX.Element
    rightAttachment?: JSX.Element
    value?: string
    disabled?: boolean
}) {
    let rightAttachment = props.rightAttachment
    if (props.rightAttachment?.type.name == "ThemeButton") {
        rightAttachment = <ThemeButton{...props.rightAttachment.props} embed={"right"} />
    }
    if (props.rightAttachment?.type.name == "ThemeSelect") {
        rightAttachment = <ThemeSelect{...props.rightAttachment.props} embed={"right"} />
    }

    let leftAttachment = props.leftAttachment
    if (props.leftAttachment?.type.name == "ThemeButton") {
        leftAttachment = <ThemeButton{...props.leftAttachment.props} embed={"left"} />
    }
    if (props.leftAttachment?.type.name == "ThemeSelect") {
        leftAttachment = <ThemeSelect{...props.leftAttachment.props} embed={"left"} />
    }

    return <InputGroup>
        {leftAttachment && <InputLeftAddon style={["ThemeButton", "ThemeSelect"].includes(props.leftAttachment?.type.name) ? { padding: 0 } : {}}>
            {leftAttachment}
        </InputLeftAddon>}
        <Input
            placeholder={props.placeholder}
            onInput={(e) => { if (props.onInput) props.onInput(e.currentTarget.value) }}
            onChange={(e) => { if (props.onChange) props.onChange(e.currentTarget.value) }}
            autoFocus={props.autoFocus}
            value={props.value}
            disabled={props.disabled}
            variant={props.disabled ? 'filled' : 'outline'}
        />
        {rightAttachment && <InputRightAddon style={["ThemeButton", "ThemeSelect"].includes(props.rightAttachment?.type.name) ? { padding: 0 } : {}}>
            {rightAttachment}
        </InputRightAddon>}
    </InputGroup>
}

function ThemeCheckBox(props: {
    checked?: boolean
    text?: string
    onClick?: (checked: boolean) => void
}): JSX.Element {
    const id = nanoid()
    return <FormControl display='flex' alignItems='center' style={{ height: 36 }} {...(isRtlLang()?{flexDirection:"row-reverse"}:{})}>
        <FormLabel htmlFor={id} mb='0' {...(isRtlLang()?{style:{direction:"rtl"}}:{})} fontSize={14} gap={4} display={"flex"}>
            <Switch
                id={id}
                isChecked={props.checked}
                onChange={(e) => {
                    if (props.onClick)
                        props.onClick(e.currentTarget.checked)
                }}
                colorScheme={'teal'}
                style={{direction:"ltr"}}
                {...(isRtlLang()?{transform:"scaleX(-1)"}:{})}
            />
            {isVerticalLang()?<div dangerouslySetInnerHTML={{__html:splitMongolian(props.text)}}/>:props.text}
        </FormLabel>
    </FormControl>
}

function ThemeModal(props: {
    title?: string
    children?: any
    max?: boolean
    footer?: JSX.Element
    onClose?: () => void
    headerActions?: boolean
}): JSX.Element {
    const [max, setMax] = useState(props.max)
    return <div className="modal-mask" style={{ background: "#0000" }}>
        <div className={
            styles["modal-container"] +
            ` ${max && styles["modal-container-max"]}`
        }>
            <div className={styles["modal-header"]}>
                <Heading size={isVerticalLang()?"xs":'sm'} whiteSpace={"nowrap"} overflow={"hidden"} fontFamily={FONT_FAMILY}>{
                    isVerticalLang()?<div style={{ WebkitTextStroke: 0.3 }} dangerouslySetInnerHTML={{ __html: splitMongolian(props.title) }} />:props.title    
                }</Heading>
                {(props.headerActions ?? true) && <div className={styles["modal-header-actions"]}>
                    <ButtonGroup>
                        <ThemeButton
                            type="text"
                            onClick={() => setMax(!max)}
                            icon={max ? <MinIcon /> : <MaxIcon />}
                        />
                        <ThemeButton
                            type="text"
                            onClick={props.onClose}
                            icon={<CloseIcon />}
                        />
                    </ButtonGroup>
                </div>}
            </div>
            <div className={styles["modal-content"]}>{props.children}</div>
            <div className={styles["modal-footer"]}>
                <div style={{ width: "100%" }}>
                    {props.footer}
                </div>
            </div>
        </div>
    </div>
}

function ThemeAvatar(props: { icon?: JSX.Element | string }) {
    try {
        if (props?.icon?.["type"]?.()?.type == "svg") return <Avatar icon={<>{props.icon}</>} size={"sm"} />
    } catch (e) { }
    return <Avatar icon={<div style={{ scale: "2" }}>{props.icon}</div>} size={"sm"} style={{ background: "#ffffff00" }} />
}

function ThemeListOld(props: { children?: any }) {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 24
    }}>
        {props.children}
    </div>
}

function ThemeListItem(props: {
    title?: string
    subTitle?: string
    children?: any
}) {
    const titleElem = <div
        style={{
            position: "absolute",
            left: 16,
            top: -15,
            background: "#ffff",
            color: "gray",
            fontWeight: "bold",
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 1000,
        }}
    >
        {props.title}
    </div>

    const subTitleElem = <div
        style={{
            position: "absolute",
            right: 16,
            top: -12,
            background: "#ffff",
            color: "gray",
            fontSize: 14,
            paddingLeft: 14,
            paddingRight: 14,
            borderRadius: 1000,
        }}
    >
        {props.subTitle}
    </div>

    if (props?.children?.type?.name == "ThemeList") {
        return <div
            style={{
                marginTop: 16,
                position: "relative",
                border: "1px solid #E2E8F0",
                borderRadius: 6,
                paddingTop: 30,
                paddingBottom: 8,
                paddingLeft: 16,
                paddingRight: 16,
            }}
        >
            {props.subTitle && subTitleElem}
            {props.title && titleElem}
            <table style={{ width: "100%" }}>
                <tr style={{ width: "100%" }}>
                    <td style={{ width: "10%" }} />
                    <td>{props.children}</td>
                </tr>
            </table>
        </div>
    }

    if (props?.children?.type?.name == "ThemeTextArea") {
        return <div
            style={{
                display: "inline-block",
                position: "relative"
            }}
        >
            {props.children}
            {props.subTitle && subTitleElem}
            {props.title && titleElem}
        </div>
    }

    return <div
        style={{
            marginTop: 16,
            position: "relative",
            border: "1px solid #E2E8F0",
            borderRadius: 6,
            paddingTop: 10,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16
        }}
    >
        {props.subTitle && subTitleElem}
        {props.title && titleElem}
        {props.children}
    </div>
}

function ThemeTabsOld(props: {
    tab?: string
    onChange?: ((tab: string) => void)
    labels?: string[],
    children?: any[]
}): JSX.Element {
    const [cardMenuIndex, setCardMenuIndex] = useState(0)
    const [parentSize, setParentSize] = useState({ width: 0, height: 0 })
    const ref = useRef<HTMLDivElement>(null)
    const parentRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        ref.current!.style.height = `${parentRef.current!.clientHeight - 200}px`
    })
    return <div ref={parentRef} style={{ overflow: "scroll", height: "100%" }}>
        <Tabs
            ref={ref}
            colorScheme="teal"
            isFitted
            variant='enclosed'
            index={props.tab ? props.labels?.indexOf(props.tab) : cardMenuIndex}
            padding={0}
            onChange={(index) => {
                setCardMenuIndex(index)
                props.onChange?.(props.labels?.[index] ?? "")
            }
            }>
            <TabList mb='1em'>
                {props.labels?.map((label, idx) => {
                    return <Tab>
                        {label}
                    </Tab>
                })}
            </TabList>
            <TabPanels>
                {props.children?.map((comp, idx) => {
                    return <TabPanel display={"flex"} flexDirection={"column"} padding={0}>
                        <div style={{
                            width: "100%",
                            height: "100%",
                            overflow: "scroll"
                        }}>
                            {comp}
                        </div>
                    </TabPanel>
                })}
            </TabPanels>
        </Tabs>
    </div>
}

function ThemeSelect(props: {
    options?: string[]
    value?: string
    onChange?: (value: string) => void
    embed?: "left" | "middle" | "right"
}): JSX.Element {
    const [width, setWidth] = useState(0)
    const select = <Select
        onChange={(e) => { props.onChange?.(e.currentTarget.value) }}
        value={props.value}
        style={{ padding: 4, paddingRight: 36, height: 36 }}
        width={width}
        fontSize={14}
        size={"sm"}
        borderRadius={12}
        fontFamily={FONT_FAMILY}
        {...props.embed == "left" && { borderLeftRadius: 0 }}
        {...props.embed == "middle" && { borderRadius: 0 }}
        {...props.embed == "right" && { borderRightRadius: 0 }}
    >
        {props.options?.map((v, i) => {
            const mdiv = document.createElement("div")
            mdiv.innerText = v
            mdiv.style.opacity = "0"
            mdiv.style.fontSize = "16px"
            document.body.appendChild(mdiv)
            const _width = mdiv.clientWidth + 48
            if (_width > width) { setWidth(_width) }
            mdiv.remove()
            return <option value={v}>
                {v}
            </option>
        })}
    </Select>
    return <div style={{ display: "inline-block" }}>
        {select}
    </div>
}

async function showConfirm(title?: string, content?: JSX.Element, danger?: boolean) {
    const div = document.createElement("div");
    div.className = "";
    document.body.appendChild(div);

    const root = createRoot(div);
    const closeModal = () => {
        root.unmount();
        div.remove();
    };

    if (title == "") { title = undefined }

    return new Promise<boolean>((resolve) => {
        root.render(
            <ChakraProvider><ThemeModal
                title={title ?? "确认"}
                headerActions={false}
                footer={<ThemeButtonGroup>
                    <ThemeButton
                        text={"取消"}
                        onClick={() => {
                            resolve(false);
                            closeModal();
                        }}
                        icon={<CancelIcon />}
                    ></ThemeButton>
                    <ThemeButton
                        text={"确认"}
                        type={danger ? "danger" : "primary"}
                        onClick={() => {
                            resolve(true);
                            closeModal();
                        }}
                        icon={<ConfirmIcon />}
                    ></ThemeButton>
                </ThemeButtonGroup>}
                onClose={closeModal}
            >
                {content}
            </ThemeModal></ChakraProvider>,
        );
    });
}