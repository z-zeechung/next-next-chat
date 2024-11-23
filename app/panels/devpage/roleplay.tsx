import { ClientApi } from "@/app/client/api"
import { Message } from "@/app/message/Message"
import { Avatar, Button, ButtonGroup, CheckBox, Select, TextArea, TinyButton } from "@/app/themes/theme"
import { Card, CardBody, CardFooter, SimpleGrid } from "@chakra-ui/react"

import UserIcon from "../../icons/bootstrap/person.svg"
import AssistantIcon from "../../icons/bootstrap/robot.svg"
import SystemIcon from "../../icons/bootstrap/gear.svg"
import DefaultAvatarIcon from "../../icons/bootstrap/camera.svg"
import ImageIcon from "../../icons/bootstrap/file-earmark-image.svg"
import DeleteIcon from "../../icons/bootstrap/trash3.svg"
import DropDownIcon from "../../icons/bootstrap/chevron-down.svg"
import AddIcon from "../../icons/bootstrap/plus-lg.svg"
import AutoIcon from "../../icons/bootstrap/play-fill.svg"

import Locale from "../../locales";

export function RolePlay(props: any) {
    const [prompt, setPrompt] = props.usePrompt
    const [greeting, setGreeting] = props.useGreeting
    const [promise, setPromise] = props.usePromise
    const [avatar, setAvatar] = props.useAvatar
    const [search, setSearch] = props.useSearch
    const [paint, setPaint] = props.usePaint
    const [script, setScript] = props.useScript

    return <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 12
    }}>
        <div style={{ position: "relative", justifyItems: "center", paddingTop: 32, paddingBottom: 32 }}>
            <div style={{ position: "relative", width: 64, height: 64 }}>
                <div style={{ scale: 3, display: "inline-flex" }}><Avatar icon={avatar} /></div>
                <div style={{ position: "absolute", right: -24, bottom: -8 }}>
                    <TinyButton text={Locale.DevPage.Alter} icon={<ImageIcon />} type="primary" />
                </div>
            </div>
        </div>
        <table style={{ borderCollapse: "separate", borderSpacing: 8 }}>
            <tr>
                <td><b>{Locale.DevPage.RoleName}</b></td>
                <td><TextArea
                    rows={1}
                /></td>
            </tr>
            <tr>
                <td style={{verticalAlign:"top"}}><b>{Locale.DevPage.Prompt}</b></td>
                <td><TextArea
                    // rows={3}
                    value={prompt}
                    onChange={(v) => { setPrompt(v) }}
                /></td>
            </tr>
            <tr>
                <td style={{verticalAlign:"top"}}><b>{Locale.DevPage.InitDialog}</b></td>
                <td>
                    <Card>
                        <CardBody display={"flex"} flexDirection={"column"} gap={2}>
                            {greeting.map((msg: Message, i) => {
                                return <TextArea rows={1} value={msg.content}
                                    onChange={(v) => {
                                        setGreeting(greeting.map((m, idx) => idx == i ?
                                            { type: msg.type, role: msg.role, content: v }
                                            : m))
                                    }}
                                    leftAttachment={
                                        <Select
                                            options={[Locale.DevPage.User, "N²CHAT", Locale.DevPage.System]}
                                            value={{ "user": Locale.DevPage.User, "assistant": "N²CHAT", "system": Locale.DevPage.System }[msg.role]}
                                            onChange={(v) => {
                                                setGreeting(greeting.map((m, idx) => idx == i ?
                                                    { type: msg.type, role: Object.fromEntries(Object.entries({ "user": Locale.DevPage.User, "assistant": "N²CHAT", "system": Locale.DevPage.System }).map(([key, value]) => [value, key]))[v], content: msg.content }
                                                    : m))
                                            }}
                                        />
                                    }
                                    rightAttachment={
                                        <Button icon={<DeleteIcon />} onClick={() => {
                                            if (greeting.length <= 1) { return }
                                            setGreeting(greeting.filter((v, idx) => idx != i))
                                        }} />
                                    }
                                />
                            })}
                            <div />
                            <ButtonGroup>
                                <Button text={Locale.DevPage.Append} icon={<AddIcon />} onClick={() => {
                                    setGreeting([
                                        ...greeting,
                                        { type: "text", role: greeting[greeting.length - 1].role == "user" ? "assistant" : "user", content: "" }
                                    ])
                                }} />
                                <Button text={Locale.DevPage.AutoGen} icon={<AutoIcon />} onClick={() => {
                                    const _greeting = greeting.slice()
                                    let sendMessages = JSON.parse(JSON.stringify(greeting))
                                    let role = "assistant"
                                    if (_greeting[_greeting.length - 1].role == "assistant") {
                                        sendMessages = [
                                            {
                                                type: "text", role: "system", content: `
                                                你是小充，是一名科技爱好者，最近正在开发一款智能助手应用。
                                                这天，你刚下课回到宿舍，调试你开发的应用。现在你正在与你开发的智能助手交谈。
                                            ` },
                                            ...sendMessages
                                        ].map((v, _) => {
                                            if (v.role == "user") {
                                                v.role = "assistant"
                                            } else if (v.role == "assistant") {
                                                v.role = "user"
                                                v.content = `智能助手说：${v.content}`
                                            } else if (v.role == "system") {
                                                v.role = "assistant"
                                                v.content = `以下为系统提示信息：${v.content}`
                                            }
                                            return v
                                        })
                                        role = "user"
                                    }
                                    const p = ClientApi.chat(sendMessages, (m) => {
                                        setGreeting([
                                            ..._greeting,
                                            { type: "text", role: role, content: m }
                                        ])
                                    })
                                    setPromise(p)
                                    p.then(m => {
                                        setGreeting([
                                            ..._greeting,
                                            { type: "text", role: role, content: m }
                                        ])
                                        setPromise(undefined)
                                    })
                                }} />
                                <Button text={Locale.DevPage.Clear} icon={<DeleteIcon />} onClick={() => {
                                    promise?.abort()
                                    setPromise(undefined)
                                    setGreeting([{ type: "text", role: "assistant", content: Locale.DevPage.Greeting }])
                                }} />
                            </ButtonGroup>
                        </CardBody>
                    </Card>
                </td>
            </tr>
            <tr>
                <td style={{verticalAlign:"top"}}><b>{Locale.DevPage.ActivateTool}</b></td>
                <td>
                    <SimpleGrid templateColumns={`repeat(auto-fill, minmax(${150}px, 1fr))`} gap={4}>
                        <Card>
                            <CardBody>
                                <CheckBox text={Locale.DevPage.WebSearch} checked={search} onClick={() => setSearch(!search)} />
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CheckBox text={Locale.DevPage.Scripting} checked={script} onClick={() => setScript(!script)} />
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CheckBox text={Locale.DevPage.ImageGen} checked={paint} onClick={() => setPaint(!paint)} />
                            </CardBody>
                        </Card>
                    </SimpleGrid>
                </td>
            </tr>
            <tr>
                <td style={{verticalAlign:"top"}}><b></b></td>
                <td style={{display:"flex", flexDirection:"row-reverse"}}>
                    <ButtonGroup>
                        <Button text={Locale.DevPage.Upload}/>
                        <Button text={Locale.DevPage.Save}/>
                        <Button text={Locale.DevPage.Export}/>
                    </ButtonGroup>
                </td>
            </tr>
        </table>
    </div>
}