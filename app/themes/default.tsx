import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, ChakraProvider, extendTheme, Flex, FormControl, FormLabel, Heading, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Select, Switch, Tab, TabList, Tabs, Text, Textarea } from "@chakra-ui/react";
import { Header, Theme, TinyButton } from "./theme";
import { getLang, isRtlLang, isVerticalLang } from "../locales";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "../utils";
import { nanoid } from "nanoid";
import "./default.css"
import { CloseIcon } from '@chakra-ui/icons'
import styled from 'styled-components';
import { rgb2hsl, hsl2rgb } from "../utils/color";
import { createRoot } from "react-dom/client";

const FONT_FAMILY = "sans-serif, NotoSansMongolian"

const c400 = "#48BB78"
const c700 = "#276749"

export const Default = (
    themeColor1,
    themeColor2,
    ornamentColor,
) => {
    const self = {
        wrapper(props: { children: any }) {
            const [th, ts, tl] = rgb2hsl(Number(`0x${themeColor1.slice(1,3)}`), Number(`0x${themeColor1.slice(3,5)}`), Number(`0x${themeColor1.slice(5,7)}`))
            const [tr, tg, tb] = hsl2rgb(th, ts, 70)
            const convertL = (color, L)=>{
                const [h, s, l] = rgb2hsl(Number(`0x${color.slice(1,3)}`), Number(`0x${color.slice(3,5)}`), Number(`0x${color.slice(5,7)}`))
                const [r, g, b] = hsl2rgb(h, s, L)
                return `rgba(${r},${g},${b},1)`
            }
            const Container = styled.div`
                --theme-color-1: rgba(${tr},${tg},${tb},1);
                --theme-color-2: ${themeColor2};
                --button-color-50: ${convertL(themeColor2, 97)};
                --button-color-100: ${convertL(themeColor2, 87)};
                --button-color-200: ${convertL(themeColor2, 75)};
                --button-color-300: ${convertL(themeColor2, 61)};
                --button-color-400: ${convertL(themeColor2, 50)};
                --button-color-500: ${convertL(themeColor2, 42)};
                --button-color-600: ${convertL(themeColor2, 35)};
                --button-color-700: ${convertL(themeColor2, 27)};
                --button-color-800: ${convertL(themeColor2, 23)};
                --button-color-900: ${convertL(themeColor2, 19)};
                --ornament-color: ${ornamentColor};
            `;
            return <Container style={{width:"100%", height:"100%"}}>
                <ChakraProvider>
                    {props.children}
                </ChakraProvider>
            </Container>
        },
        heading(props: { children?: any }) {
            if (isVerticalLang()) {
                return <div className="themeHeadingMn" dangerouslySetInnerHTML={{ __html: splitMongolian(props.children) }} />
            }
            if (isRtlLang()) {
                return <div className="themeHeadingRtl">
                    {props.children}
                </div>
            }
            return <div className="themeHeading">
                {props.children}
            </div>
        },
        textBlock(props: { children?: any }) {
            if (isRtlLang()) {
                return <div className="themeTextBlockRtl">{props.children}</div>
            }
            return <div className="themeTextBlock">{props.children}</div>
        },
        row(props: { children?: any }) {
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
        },
        component(props: { children?: any, type?: "primary" | "plain", subHeader?: boolean, bodyOnly?: boolean }) {
            let { header, body, footer } = enumChildren(props.children)
            body = self.handleListItem(body)
            return <div className={"themeComponent " + (props.type == "primary" ? "themeComponentPrimary " : " ")}>
                <div className={"themeComponentHeader" + (props.subHeader ? " themeComponentSubHeader " : " ")}>{header?.props.children}</div>
                {(!props.type) && <hr />}
                <div className="themeComponentBody">{body}</div>
                {(!props.type) && <hr />}
                <div className="themeComponentFooter">{footer?.props.children}</div>
            </div>
        },
        plate(props: { children?: any }) {
            return <div style={{ width: "100%", height: "100%", boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)" }}>
                {props.children}
            </div>
        },
        group(props: { children?: any, isAttached?: boolean }) {
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
                        if (elem?.type?.name == "select") {
                            return <self.select key={i} {...elem.props} embed={position} />
                        }
                        if (elem?.type?.name == "button") {
                            return <self.button key={i} {...elem.props} embed={position} />
                        }
                        if (elem?.type?.name == "textArea") {
                            // return <self.textArea key={i} {...elem.props} embed={position} />
                            return <></>
                        }
                        return elem
                    })}
                </div>
            }
            return <div style={{ display: "inline-flex", gap: 8 }}>
                {children}
            </div>
        },
        button(props: {
            icon?: JSX.Element
            text?: string
            onClick?: () => void
            type?: "text" | "primary" | "danger"
            disabled?: boolean
            embed?: "left" | "middle" | "right"
            tiny?: boolean
        }): JSX.Element {
            return <button onClick={props.onClick} disabled={props.disabled} className={`
            themeButton 
            ${props.type == "primary" && " themeButtonPrimary"} 
            ${props.type == "text" && " themeButtonGhost"}
            ${["zh_Hans", "zh_Hant"].includes(getLang()) && " themeButtonDenseScript"} 
            ${props.embed == "left" && " themeButtonEmbedLeft"} 
            ${props.embed == "middle" && " themeButtonEmbedMiddle"} 
            ${props.embed == "right" && " themeButtonEmbedRight"} 
            ${props.tiny && " themeButtonTiny"}
        `}>
                {props.icon}
                <div className="themeButtonText">{props.text}</div>
            </button>
        },
        tinyButton(props: {
            icon?: JSX.Element
            text?: string
            onClick?: () => void
            type?: "text" | "primary" | "danger"
            disabled?: boolean
            embed?: "left" | "middle" | "right"
        }): JSX.Element {
            return <self.button {...props} tiny />
        },
        buttonCard(props: {
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
                <div style={{ height: 75, width: 75, transform: isVerticalLang() ? "rotate(-90deg)" : "rotate(0deg)" }}>
                    <div style={{ height: 30.5, paddingTop: 14.5, paddingLeft: (75 - 16) / 2, paddingRight: (75 - 16) / 2, paddingBottom: 0 }}>
                        <div style={{ height: 16, width: 16, transform: isVerticalLang() ? "rotate(90deg)" : "rotate(0deg)" }}>
                            {props.icon}
                        </div>
                    </div>
                    <div style={{
                        width: 75, height: 75 - 30.5, textWrap: "pretty", display: "flex", justifyContent: "center", alignItems: "center",
                        lineHeight: 0.9,
                        ...(isVerticalLang() ? { writingMode: "vertical-lr", transform: "rotate(90deg)" } : {})
                    }}>
                        {props.text}
                    </div>
                </div>
            </Button>
        },
        infoCard(props: {
            icon?: JSX.Element | string
            title?: string
            subTitle?: string
            children?: any
            type?: "primary" | "plain"
            onClick?: () => void
        }) {
            // const { header, body, footer } = enumChildren(props.children)

            // const [isHovered, setIsHovered] = useState(false);
            // const ref = useRef(null)

            // const title = isVerticalLang() ? <span dangerouslySetInnerHTML={{ __html: splitMongolian(props.title) }}></span> : props.title
            // const subTitle = isVerticalLang() ? <span dangerouslySetInnerHTML={{ __html: splitMongolian(props.subTitle) }}></span> : props.subTitle

            // return <Card
            //     width={"100%"}
            //     {...(props.type ? {} : {
            //         background: isHovered ? "#EDF2F7" : "#F7FAFC"
            //     })}
            //     {...(props.onClick ? {
            //         onClick: props.onClick,
            //         onMouseEnter: () => { setIsHovered(true) },
            //         onMouseLeave: () => { setIsHovered(false) }
            //     } : {})}
            //     variant={props.type == "plain" ? "outline" : "elevated"}
            // >
            //     {(props.title || props.icon || props.subTitle) && <CardHeader padding={3} paddingBottom={0}>
            //         <Flex>
            //             <Flex
            //                 flex='1' gap='4' alignItems='center' flexWrap="nowrap" padding={0}
            //                 flexDirection={isRtlLang() ? "row-reverse" : "row"}
            //             >
            //                 {props.icon ? <self.avatar icon={props.icon} /> : <div style={{ width: 4 }}></div>}
            //                 <Box width={"100%"}>
            //                     {isVerticalLang() && <Flex flexDirection={"row"}>
            //                         <Heading width={"100%"} size='sm' whiteSpace={"nowrap"} overflow={"hidden"} fontFamily={FONT_FAMILY}>
            //                             {title}
            //                         </Heading>
            //                         {props.subTitle && <Text fontSize={"12px"}>{subTitle}</Text>}
            //                     </Flex>}
            //                     {!isVerticalLang() && <><Heading size='sm' whiteSpace={"nowrap"} overflow={"hidden"} fontFamily={FONT_FAMILY}>
            //                         {title}
            //                     </Heading>
            //                         {props.subTitle && <Text fontSize={"12px"}>{subTitle}</Text>}</>}
            //                 </Box>
            //             </Flex>
            //         </Flex>
            //     </CardHeader>}
            //     <CardBody padding={body?4:0}>
            //         <Flex
            //             flex={1} gap={4} direction={"column"} padding={0}
            //         >
            //             {...(body??[])}
            //         </Flex>
            //     </CardBody>
            //     {footer && <CardFooter padding={3} paddingTop={0} paddingBottom={2}>
            //         {footer}
            //     </CardFooter>}
            // </Card>
        },
        textArea(props: {
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
            // const { width, height } = useWindowSize();
            // const [rows, setRows] = useState(props.rows ?? 3)
            // const ref = useRef(null)

            // const [areaHeight, setAreaHeight] = useState(36 * (props.rows ?? 1))

            // const tlRadius = (props.embed == "left" || props.embed == "middle") ? 0 : 10
            // const trRadius = (props.embed == "right" || props.embed == "middle") ? 0 : 10
            // const blRadius = (props.embed == "left" || props.embed == "middle") ? (rows >= 2 ? 10 : 0) : 10
            // const brRadius = (props.embed == "right" || props.embed == "middle") ? (rows >= 2 ? 10 : 0) : 10

            // useEffect(() => {
            //     if (props.autoGrow && ref.current) {
            //         if (isVerticalLang()) {
            //             const text = (ref.current as any)?.value
            //             const width = (ref.current as any)?.offsetWidth
            //             if (text.length * 256 / width < 100) {
            //                 const mdiv = document.createElement("div")
            //                 mdiv.style.opacity = "0"
            //                 mdiv.style.fontFamily = FONT_FAMILY
            //                 mdiv.innerText = text.split(" ").join("\n")
            //                 document.body.appendChild(mdiv)
            //                 // console.log(mdiv.clientWidth)
            //                 setAreaHeight(Math.max(mdiv.clientWidth + 16, 36 * rows))
            //                 mdiv.remove()
            //             } else {
            //                 setAreaHeight(Math.max(text.length * 256 / width, 128, 36 * rows))
            //             }
            //         } else {
            //             const mdiv = document.createElement("div")
            //             mdiv.style.opacity = "0"
            //             mdiv.innerText = (ref.current as any)?.value
            //             mdiv.style.width = (ref.current as any)?.offsetWidth + "px"
            //             mdiv.style.fontFamily = FONT_FAMILY
            //             document.body.appendChild(mdiv)
            //             setRows(Math.max(mdiv.offsetHeight / 24, props.rows || 3))
            //             mdiv.remove()
            //         }
            //     }
            // })

            // return <Textarea
            //     className="themeTextArea"
            //     ref={ref}
            //     rows={rows}
            //     placeholder={props.placeholder}
            //     onInput={(e) => { if (props.onInput) props.onInput(e.currentTarget.value) }}
            //     onChange={(e) => { if (props.onChange) props.onChange(e.currentTarget.value) }}
            //     autoFocus={props.autoFocus}
            //     value={(rows == 1 && !props.autoGrow) ? props.value?.replaceAll("\n", "") : props.value}
            //     disabled={props.disabled}
            //     style={{
            //         maxHeight:height / 2,
            //         borderTopLeftRadius: tlRadius,
            //         borderTopRightRadius: trRadius,
            //         borderBottomLeftRadius: blRadius,
            //         borderBottomRightRadius: brRadius,
            //         ...(isRtlLang() ? { direction: "rtl" } : {}),
            //         ...(isVerticalLang() ? {
            //             ...(areaHeight == 36 ? {} : { writingMode: "vertical-lr" }),
            //             height: areaHeight
            //         } : {})
            //     }}
            // />
        },
        checkBox(props: {
            checked?: boolean
            text?: string
            onClick?: (checked: boolean) => void
        }): JSX.Element {
            const id = nanoid()
            return <FormControl display='flex' alignItems='center' style={{ height: 36 }} {...(isRtlLang() ? { flexDirection: "row-reverse" } : {})}>
                <FormLabel htmlFor={id} mb='0' {...(isRtlLang() ? { style: { direction: "rtl" } } : {})} fontSize={14} gap={4} display={"flex"}>
                    <Switch
                        id={id}
                        isChecked={props.checked}
                        onChange={(e) => {
                            if (props.onClick)
                                props.onClick(e.currentTarget.checked)
                        }}
                        className="themeSwitch"
                    />
                    {isVerticalLang() ? <div dangerouslySetInnerHTML={{ __html: splitMongolian(props.text) }} /> : props.text}
                </FormLabel>
            </FormControl>
        },
        modal(props: {
            title?: string
            children?: any
            onClose?: () => void
            headerActions?: boolean
        }) {
            const { header, body, footer } = enumChildren(props.children)
            return <>
                <div className="themeModalBackground" />
                <div className="themeModal">
                    <div className="themeModalHeader">
                        <div className="themeModalTitle">{props.title}</div>
                        <div className="themeModalClose">
                            <TinyButton type="text" icon={<CloseIcon width={"16px"} height={"16px"} />} onClick={props.onClose} />
                        </div>
                    </div>
                    <hr />
                    <div className="themeModalBody">
                        {body}
                    </div>
                    <hr />
                    <div className="themeModalFooter">
                        {footer}
                    </div>
                </div>
            </>
        },
        avatar(props: { icon?: JSX.Element | string }) {
            try {
                if (props?.icon?.["type"]?.()?.type == "svg") return <Avatar icon={<>{props.icon}</>} size={"sm"} />
            } catch (e) { }
            return <Avatar icon={<div style={{ scale: "2" }}>{props.icon}</div>} size={"sm"} style={{ background: "#ffffff00" }} />
        },
        list(props: { children?: any, type?: "primary" | "plain" }): JSX.Element {
            return <self.component bodyOnly type={"plain"}>
                {props.children}
            </self.component>
        },
        tabs(props: {
            tab?: string
            onChange?: ((tab: string) => void)
            labels?: string[],
            children?: any
            type?: "primary" | "plain"
        }): JSX.Element {
            const { header, body, footer } = enumChildren(props.children)
            return <self.component subHeader type={props.type}>
                <Header>
                    <Tabs transform={isRtlLang() ? "scaleX(-1)" : undefined} isFitted index={props.labels?.indexOf(props?.tab ?? "")} onChange={i => { props?.onChange?.((props.labels?.[i]) ?? "") }} width={"100%"}>
                        <TabList>
                            {props.labels?.map((label, i) => {
                                let _label: any = label
                                if (isVerticalLang()) {
                                    _label = <div dangerouslySetInnerHTML={{ __html: splitMongolian(label) }} />
                                }
                                return <Tab key={i} transform={isRtlLang() ? "scaleX(-1)" : undefined} fontSize={14}>{_label}</Tab>
                            })}
                        </TabList>
                    </Tabs>
                </Header>
                {body}
                {footer}
            </self.component>
        },
        select(props: {
            options?: string[]
            value?: string
            onChange?: (value: string) => void
            embed?: "left" | "middle" | "right"
        }) {
            return <></>
            // const [width, setWidth] = useState(0)
            // const select = <Select
            //     onChange={(e) => { props.onChange?.(e.currentTarget.value) }}
            //     value={props.value}
            //     style={{ padding: 4, paddingRight: 36, height: 36, borderColor:"lightgray", boxShadow: "none"}}
            //     width={width}
            //     fontSize={14}
            //     size={"sm"}
            //     borderRadius={12}
            //     fontFamily={FONT_FAMILY}
            //     {...props.embed == "left" && { borderLeftRadius: 0 }}
            //     {...props.embed == "middle" && { borderRadius: 0 }}
            //     {...props.embed == "right" && { borderRightRadius: 0 }}
            // >
            //     {props.options?.map((v, i) => {
            //         const mdiv = document.createElement("div")
            //         mdiv.innerText = v
            //         mdiv.style.opacity = "0"
            //         mdiv.style.fontSize = "16px"
            //         document.body.appendChild(mdiv)
            //         const _width = mdiv.clientWidth + 48
            //         if (_width > width) { setWidth(_width) }
            //         mdiv.remove()
            //         return <option key={i} value={v}>
            //             {v}
            //         </option>
            //     })}
            // </Select>
            // return <div style={{ display: "inline-block" }}>
            //     {select}
            // </div>
        },
        popover(props: {
            children?: any
            icon?: JSX.Element
            text?: string
            type?: "text" | "primary" | "danger"
        }) {
            return <Menu>
                <MenuButton
                    as={Button}
                    aria-label=''
                    leftIcon={props.icon}
                    className={`
                        themeButton 
                        ${props.type == "primary" && " themeButtonPrimary"} 
                        ${props.type == "text" && " themeButtonGhost"}
                        ${["zh_Hans", "zh_Hant"].includes(getLang()) && " themeButtonDenseScript"}
                    `}
                >
                    {props.text}
                </MenuButton>
                <MenuList>
                    {props.children}
                </MenuList>
            </Menu>
        },
        tinyPopover(props: {
            children?: any
            icon?: JSX.Element
            text?: string
            type?: "text" | "primary" | "danger"
        }) {
            return <Menu>
                <MenuButton
                    size={"xs"}
                    as={Button}
                    aria-label=''
                    leftIcon={props.icon}
                    className={`
                        themeButton 
                        ${props.type == "primary" && " themeButtonPrimary"} 
                        ${props.type == "text" && " themeButtonGhost"}
                        ${["zh_Hans", "zh_Hant"].includes(getLang()) && " themeButtonDenseScript"}
                        ${" themeButtonTiny"}
                    `}
                >
                    {props.text}
                </MenuButton>
                <MenuList>
                    {props.children}
                </MenuList>
            </Menu>
        },
        popoverCard(props: {
            children?: any
            icon?: JSX.Element
            text?: string
        }) {
            return <Menu>
                <MenuButton
                    size={"xs"}
                    as={Button}
                    aria-label=''
                    height={75.35}
                    width={75.35}
                    flexDirection={"column"}
                    fontSize={"x-small"}
                    fontWeight={"normal"}
                    padding={0}
                >
                    <div style={{ height: 75, width: 75, transform: isVerticalLang() ? "rotate(-90deg)" : "rotate(0deg)" }}>
                        <div style={{ height: 30.5, paddingTop: 14.5, paddingLeft: (75 - 16) / 2, paddingRight: (75 - 16) / 2, paddingBottom: 0 }}>
                            <div style={{ height: 16, width: 16, transform: isVerticalLang() ? "rotate(90deg)" : "rotate(0deg)" }}>
                                {props.icon}
                            </div>
                        </div>
                        <div style={{
                            width: 75, height: 75 - 30.5, textWrap: "pretty", display: "flex", justifyContent: "center", alignItems: "center",
                            lineHeight: 0.9,
                            ...(isVerticalLang() ? { writingMode: "vertical-lr", transform: "rotate(90deg)" } : {})
                        }}>
                            {props.text}
                        </div>
                    </div>
                </MenuButton>
                <MenuList>
                    {props.children}
                </MenuList>
            </Menu>
        },
        popoverItem(props: {
            text?: string
            icon?: JSX.Element
            onClick?: () => void
        }) {
            return <MenuItem fontSize={"small"} icon={props.icon ?? <div style={{ display: "inline-block", width: 16, height: 16 }} />} onClick={props.onClick}>
                {props.text}
            </MenuItem>
        },
        handleListItem(body?: any[]) {
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
            return body.map((elem, i) => elem?.type?.name == "ListItem" ? <div key={i} style={{ width: "100%", height: "100%", fontSize: 14, display: "flex", ...(isRtlLang() ? { flexDirection: "row-reverse" } : {}) }}>
                <div style={{ width: width, fontFamily: FONT_FAMILY, fontWeight: "bold", ...(isRtlLang() ? { direction: "rtl" } : {}) }}>
                    {isVerticalLang() ? <div dangerouslySetInnerHTML={{ __html: splitMongolian(elem.props.title) }} /> : elem?.props?.title}
                </div>
                <div style={{ flex: 1, maxHeight: window.innerHeight * (1 - 0.618), overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                    {elem?.props?.children}
                    <div style={{ fontSize: 12, color: "gray" }}>{elem?.props?.subTitle}</div>
                    <hr />
                </div>
            </div> : elem)
        },

        // deprecated
        messageCard(props) {
            const { header, body, footer } = enumChildren(props.children)
            return <div className={"themeMessageCard " + props.type}>
                <div className={"themeMessageCardHeader " + props.type}>{header}</div>
                <div className={"themeMessageCardBody " + props.type}>
                    <div className={"themeMessageCardBodyItem " + props.type}>{body}</div>
                </div>
                <div className={"themeMessageCardFooter " + props.type}>{footer}</div>
            </div>
        },
        chatHistory(props) {
            return <></>
        },
        buttonGroup(props) {
            return <></>
        },
        chatCard(props) {
            return <></>
        },
        listItem(props) {
            return <></>
        },
        showConfirm() { return undefined as any },
        async showToast(children: any): Promise<void> { 
            return new Promise<void>(resolve => {
                const div = document.createElement("div");
                document.body.appendChild(div);
        
                const root = createRoot(div);
                const close = () => {        
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
                    <self.wrapper>
                        <div className="themeToast">
                            {children}
                        </div>
                    </self.wrapper>
                );
            })
        }
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
    return self
}