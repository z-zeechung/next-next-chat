'use client'

import { FormEvent } from "react";
import { MessageRole } from "../typing";
import { Default } from "./default";
import { createPersistStore } from "../utils/store";

export interface Theme {
    wrapper:
    (props: {
        children?: any
    }) => any
    heading:
    (props: {
        children?: any
    }) => JSX.Element
    textBlock:
    (props: {
        children?: any
    }) => JSX.Element
    row:
    (props: {
        children?: any
    }) => JSX.Element
    component:
    (props: {
        children?: any
        type?: "primary" | "plain"
    }) => JSX.Element
    plate:
    (props: {
        children?: any
    }) => JSX.Element
    tabs:
    (props: {
        tab?: string
        onChange?: ((tab: string) => void)
        labels?: string[]
        children?: any
        type?: "primary" | "plain"
    }) => JSX.Element
    group:
    (props: {
        children?: any
        isAttached?: boolean
    }) => JSX.Element
    messageCard: (props?: {
        children?: any
        type?: MessageRole
    }) => JSX.Element
    chatHistory: (props?: {
        children?: any
        show?: boolean
    }) => JSX.Element
    button:
    (props: {
        icon?: JSX.Element
        text?: string
        onClick?: () => void
        type?: "text" | "primary" | "danger"
        disabled?: boolean
        /**  @deprecated */
        popover?: any
    }) => JSX.Element
    tinyButton:
    (props: {
        icon?: JSX.Element
        text?: string
        onClick?: () => void
        type?: "text" | "primary" | "danger"
        disabled?: boolean
        /**  @deprecated */
        popover?: any
    }) => JSX.Element
    buttonGroup:
    (props: {
        children: any
    }) => JSX.Element
    buttonCard:
    (props: {
        icon?: JSX.Element
        text?: string
        onClick?: () => void
        popover?: any
    }) => JSX.Element
    chatCard:
    (props: {
        icon?: JSX.Element | string
        title?: string
        count?: number
        time?: Date
        onClick?: () => void
        selected?: boolean
        managed?: boolean
        onDelete?: () => void
    }) => JSX.Element
    infoCard: (props: {
        icon?: JSX.Element | string
        title?: string
        subTitle?: string
        children?: any
        type?: "primary" | "plain"
        onClick?: () => void
    }) => JSX.Element
    textArea:
    (props: {
        placeholder?: string
        onInput?: (value: string) => void
        onChange?: (value: string) => void
        autoFocus?: boolean
        autoGrow?: boolean
        rows?: number
        /** @deprecated */
        leftAttachment?: JSX.Element
        /** @deprecated */
        rightAttachment?: JSX.Element
        value?: string
        disabled?: boolean
    }) => JSX.Element
    checkBox:
    (props: {
        checked?: boolean
        text?: string
        onClick?: (checked: boolean) => void
    }) => JSX.Element
    modal:
    (props: {
        title?: string
        children?: any
        max?: boolean
        footer?: JSX.Element
        onClose?: () => void
    }) => JSX.Element
    avatar:
    (props: {
        icon?: JSX.Element | string
    }) => JSX.Element
    list:
    (props: {
        children?: any
        type?: "primary" | "plain"
    }) => JSX.Element
    // listItem:
    //     (props:{
    //         title?: string
    //         subTitle?: string
    //         children?: any
    //     })=>JSX.Element
    select:
    (props: {
        options?: string[]
        value?: string
        onChange?: (value: string) => void
    }) => JSX.Element
    showConfirm:
    (title?: string, content?: JSX.Element, danger?: boolean) => Promise<boolean>
    showToast:
    (children: any) => Promise<void>
    popover:
    (props: {
        children?: any
        icon?: JSX.Element
        text?: string
        type?: "text" | "primary" | "danger"
    }) => JSX.Element
    tinyPopover:
    (props: {
        children?: any
        icon?: JSX.Element
        text?: string
        type?: "text" | "primary" | "danger"
    }) => JSX.Element
    popoverCard:
    (props: {
        children?: any
        icon?: JSX.Element
        text?: string
    }) => JSX.Element
    popoverItem:
    (props: {
        text?: string
        icon?: JSX.Element
        onClick?: () => void
    }) => JSX.Element
}

const themes = {
    default: () => { return Default("#BEF2E5", "#C5E7F1", "#79CEED") },
}

export const useTheme = createPersistStore(
    {
        theme: "default"
    },
    (set, get) => ({
        setTheme(theme) {
            set(() => ({
                theme: theme
            }))
        },
        get(componentName, props) {
            const theme_name = get().theme
            const theme: Theme = (themes[theme_name]??themes["default"])()
            return theme[componentName](props)
        }
    }),
    {
        name: "nnchat-theme-state-storage"
    }
)

const WrapperTheme: Theme = {
    wrapper(props) {
        return useTheme().get("wrapper", props)
    },
    heading(props) {
        return useTheme().get("heading", props)
    },
    textBlock(props) {
        return useTheme().get("textBlock", props)
    },
    row(props) {
        return useTheme().get("row", props)
    },
    component(props) {
        return useTheme().get("component", props)
    },
    plate(props) {
        return useTheme().get("plate", props)
    },
    group(props) {
        return useTheme().get("group", props)
    },
    messageCard(props) {
        return useTheme().get("messageCard", props)
    },
    chatHistory(props) {
        return useTheme().get("chatHistory", props)
    },
    button(props) {
        return useTheme().get("button", props)
    },
    tinyButton(props) {
        return useTheme().get("tinyButton", props)
    },
    buttonGroup(props) {
        return useTheme().get("buttonGroup", props)
    },
    buttonCard(props) {
        return useTheme().get("buttonCard", props)
    },
    chatCard(props) {
        return useTheme().get("chatCard", props)
    },
    infoCard(props) {
        return useTheme().get("infoCard", props)
    },
    textArea(props) {
        return useTheme().get("textArea", props)
    },
    checkBox(props) {
        return useTheme().get("checkBox", props)
    },
    modal(props) {
        return useTheme().get("modal", props)
    },
    avatar(props) {
        return useTheme().get("avatar", props)
    },
    list(props) {
        return useTheme().get("list", props)
    },
    tabs(props) {
        return useTheme().get("tabs", props)
    },
    select(props) {
        return useTheme().get("select", props)
    },
    showConfirm(props) {
        return useTheme().get("showConfirm", props)
    },
    showToast(props) {
        return useTheme().get("showToast", props)
    },
    popover(props) {
        return useTheme().get("popover", props)
    },
    tinyPopover(props) {
        return useTheme().get("tinyPopover", props)
    },
    popoverCard(props) {
        return useTheme().get("popoverCard", props)
    },
    popoverItem(props) {
        return useTheme().get("popoverItem", props)
    }
}

export let ThemeWrapper = WrapperTheme.wrapper
export let Heading = WrapperTheme.heading
export let TextBlock = WrapperTheme.textBlock
export let Row = WrapperTheme.row
export let Component = WrapperTheme.component
export let Plate = WrapperTheme.plate
export let Group = WrapperTheme.group
/** @deprecated */
export let MessageCard = WrapperTheme.messageCard
/** @deprecated */
export let ChatHistory = WrapperTheme.chatHistory
export let Button = WrapperTheme.button
export let TinyButton = WrapperTheme.tinyButton
/** @deprecated */
export let ButtonGroup = WrapperTheme.buttonGroup
export let ButtonCard = WrapperTheme.buttonCard
/** @deprecated */
export let ChatCard = WrapperTheme.chatCard
export let InfoCard = WrapperTheme.infoCard
export let TextArea = WrapperTheme.textArea
export let CheckBox = WrapperTheme.checkBox
/** @deprecated */
export let Modal = WrapperTheme.modal
export let Avatar = WrapperTheme.avatar
/** @deprecated */
export let List = WrapperTheme.list
// export let ListItem = theme.listItem
export let Tabs = WrapperTheme.tabs
export let Select = WrapperTheme.select
export let showConfirm = WrapperTheme.showConfirm
export let showToast = WrapperTheme.showToast
export let Popover = WrapperTheme.popover
export let TinyPopover = WrapperTheme.tinyPopover
export let PopoverCard = WrapperTheme.popoverCard
export let PopoverItem = WrapperTheme.popoverItem

export function Header(props: { children: any }) {
    return <>{props.children}</>
}

// export function Body(props:{children:any}) {
//     return <>{props.children}</>
// }

export function Footer(props: { children: any }) {
    return <>{props.children}</>
}

export function Left(props: { children: any }) {
    return <>{props.children}</>
}

export function Center(props: { children: any }) {
    return <>{props.children}</>
}

export function Right(props: { children: any }) {
    return <>{props.children}</>
}

export function ListItem(props: {
    title?: string
    subTitle?: string
    children: any
}) {
    return <>{props.children}</>
}