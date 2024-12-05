'use client'

import { FormEvent } from "react";
import { Default } from "./default"
import { MessageRole } from "../typing";

export interface Theme{
    wrapper:
        (props:{
            children?:any
        })=>JSX.Element
    heading:
        (props:{
            children?: any
        })=>JSX.Element
    textBlock:
        (props:{
            children?:any
        })=>JSX.Element
    row:
        (props:{
            children?:any
        })=>JSX.Element
    component:
        (props:{
            children?: any
            type?: "primary" | "plain"
        })=>JSX.Element
    plate:
        (props:{
            children?:any
        })=>JSX.Element
    tabs:
        (props:{
            tab?:string
            onChange?:((tab:string)=>void)
            labels?:string[]
            children?: any
            type?: "primary" | "plain"
        })=>JSX.Element
    group:
        (props:{
            children?: any
            isAttached?: boolean
        })=>JSX.Element
    messageCard:(props?:{
        children?:any
        type?:MessageRole
    })=>JSX.Element
    chatHistory:(props?:{
        children?:any
        show?:boolean
    })=>JSX.Element
    button: 
        (props: {
            icon?:JSX.Element
            text?:string
            onClick?:() => void
            type?:"text" | "primary" | "danger"
            disabled?:boolean
            /**  @deprecated */
            popover?:any
        }) => JSX.Element
    tinyButton:
        (props: {
            icon?:JSX.Element
            text?:string
            onClick?:() => void
            type?:"text" | "primary" | "danger"
            disabled?:boolean
            /**  @deprecated */
            popover?:any
        }) => JSX.Element
    buttonGroup:
        (props:{
            children:any
        })=>JSX.Element
    buttonCard:
        (props:{
            icon?:JSX.Element
            text?:string
            onClick?:()=>void
            popover?:any
        })=>JSX.Element
    chatCard:
        (props:{
            icon?:JSX.Element | string
            title?:string
            count?:number
            time?:Date
            onClick?:()=>void
            selected?:boolean
            managed?:boolean
            onDelete?:()=>void
        })=>JSX.Element
    infoCard:(props: {
        icon?: JSX.Element | string
        title?: string
        subTitle?: string
        children?: any
        type?: "primary" | "plain"
        onClick?: () => void
    })=>JSX.Element
    textArea:
        (props:{
            placeholder?:string
            onInput?:(value:string)=>void
            onChange?:(value:string)=>void
            autoFocus?:boolean
            autoGrow?:boolean
            rows?:number
            /** @deprecated */
            leftAttachment?:JSX.Element
            /** @deprecated */
            rightAttachment?:JSX.Element
            value?:string
            disabled?:boolean
        })=>JSX.Element
    checkBox:
        (props:{
            checked?:boolean
            text?:string
            onClick?:(checked:boolean)=>void
        })=>JSX.Element
    modal:
        (props:{
            title?:string
            children?:any
            max?:boolean
            footer?:JSX.Element
            onClose?:()=>void
        })=>JSX.Element
    avatar:
        (props:{
            icon?:JSX.Element | string
        })=>JSX.Element
    list:
        (props:{
            children?:any
            type?: "primary" | "plain"
        })=>JSX.Element
    // listItem:
    //     (props:{
    //         title?: string
    //         subTitle?: string
    //         children?: any
    //     })=>JSX.Element
    select:
        (props:{
            options?:string[]
            value?:string
            onChange?:(value:string)=>void
        })=>JSX.Element
    showConfirm:
        (title?:string, content?:JSX.Element, danger?:boolean)=>Promise<boolean>
    showToast:
        (children: any)=>Promise<void>
}

let theme:Theme = Default

export let ThemeWrapper = theme.wrapper
export let Heading = theme.heading
export let TextBlock = theme.textBlock
export let Row = theme.row
export let Component = theme.component
export let Plate = theme.plate
export let Group = theme.group
/** @deprecated */
export let MessageCard = theme.messageCard
/** @deprecated */
export let ChatHistory = theme.chatHistory
export let Button = theme.button
export let TinyButton = theme.tinyButton
/** @deprecated */
export let ButtonGroup = theme.buttonGroup
export let ButtonCard = theme.buttonCard
/** @deprecated */
export let ChatCard = theme.chatCard
export let InfoCard = theme.infoCard
export let TextArea = theme.textArea
export let CheckBox = theme.checkBox
/** @deprecated */
export let Modal = theme.modal
export let Avatar = theme.avatar
/** @deprecated */
export let List = theme.list
// export let ListItem = theme.listItem
export let Tabs = theme.tabs
export let Select = theme.select
export let showConfirm = theme.showConfirm
export let showToast = theme.showToast

export function Header(props:{children:any}) {
    return <>{props.children}</>
}

// export function Body(props:{children:any}) {
//     return <>{props.children}</>
// }

export function Footer(props:{children:any}) {
    return <>{props.children}</>
}

export function Left(props:{children:any}) {
    return <>{props.children}</>
}

export function Center(props:{children:any}) {
    return <>{props.children}</>
}

export function Right(props:{children:any}) {
    return <>{props.children}</>
}

export function ListItem(props:{
    title?:string
    subTitle?:string
    children:any
}) {
    return <>{props.children}</>
}