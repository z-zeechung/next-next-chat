'use client'

import { FormEvent } from "react";
import { MessageRole } from "../typing";
import { Default } from "./default";
import { createPersistStore } from "../utils/store";
import { renderToString } from "react-dom/server";

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

export let ThemeWrapper = themes["default"]().wrapper
export let Heading = themes["default"]().heading
export let TextBlock = themes["default"]().textBlock
export let Row = themes["default"]().row
export let Component = themes["default"]().component
export let Plate = themes["default"]().plate
export let Group = themes["default"]().group
/** @deprecated */
export let MessageCard = themes["default"]().messageCard
/** @deprecated */
export let ChatHistory = themes["default"]().chatHistory
export let Button = themes["default"]().button
export let TinyButton = themes["default"]().tinyButton
/** @deprecated */
export let ButtonGroup = themes["default"]().buttonGroup
export let ButtonCard = themes["default"]().buttonCard
/** @deprecated */
export let ChatCard = themes["default"]().chatCard
export let InfoCard = themes["default"]().infoCard
export let TextArea = themes["default"]().textArea
export let CheckBox = themes["default"]().checkBox
/** @deprecated */
export let Modal = themes["default"]().modal
export let Avatar = themes["default"]().avatar
/** @deprecated */
export let List = themes["default"]().list
// export let ListItem = theme.listItem
export let Tabs = themes["default"]().tabs
export let Select = themes["default"]().select
export let showConfirm = themes["default"]().showConfirm
export let showToast = themes["default"]().showToast
export let Popover = themes["default"]().popover
export let TinyPopover = themes["default"]().tinyPopover
export let PopoverCard = themes["default"]().popoverCard
export let PopoverItem = themes["default"]().popoverItem

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