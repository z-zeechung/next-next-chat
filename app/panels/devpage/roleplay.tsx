import { ClientApi } from "@/app/client/api"
import { Message } from "@/app/message/Message"
import { Avatar, Button, ButtonGroup, Center, CheckBox, Group, InfoCard, Left, List, ListItem, Right, Row, Select, TextArea, TextBlock, TinyButton } from "@/app/themes/theme"
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

import WordIcon from "../../icons/file-icon-vectors/doc.svg"
import PPTIcon from "../../icons/file-icon-vectors/ppt.svg"
import PDFIcon from "../../icons/file-icon-vectors/pdf.svg"
import MarkdownIcon from "../../icons/file-icon-vectors/square-o/md.svg"
import HTMLIcon from "../../icons/file-icon-vectors/classic/html.svg"
import TxtIcon from "../../icons/file-icon-vectors/txt.svg"

import Locale, { isRtlLang } from "../../locales";
import { KnowledgeBase } from "../../knowledgebase/knowledgebase";

const IconMap = {
    "doc": <WordIcon style={{ width: "16px", height: "16px" }} />,
    "docx": <WordIcon style={{ width: "16px", height: "16px" }} />,
    "pdf": <PDFIcon style={{ width: "16px", height: "16px" }} />,
    "pptx": <PPTIcon style={{ width: "16px", height: "16px" }} />,
    "md": <MarkdownIcon style={{ width: "16px", height: "16px" }} />,
    "html": <HTMLIcon style={{ width: "16px", height: "16px" }} />,
    "htm": <HTMLIcon style={{ width: "16px", height: "16px" }} />,
    "mhtml": <HTMLIcon style={{ width: "16px", height: "16px" }} />,
}

export function RolePlay(props: any) {
    const [prompt, setPrompt] = props.usePrompt
    const [greeting, setGreeting] = props.useGreeting
    const [promise, setPromise] = props.usePromise
    const [avatar, setAvatar] = props.useAvatar
    const [search, setSearch] = props.useSearch
    const [paint, setPaint] = props.usePaint
    const [script, setScript] = props.useScript
    const [roleName, setRoleName] = props.useRoleName
    const [documents, setDocuments] = props.useDocuments

    const kbid = "nnchat-devrole-attatchment-tempstore-kb"

    // return <div style={{
    //     width: "100%",
    //     height: "100%",
    //     display: "flex",
    //     flexDirection: "column",
    //     padding: 12
    // }}>
    //     <div style={{ position: "relative", justifyItems: "center", paddingTop: 32, paddingBottom: 32 }}>
    //         <div style={{ position: "relative", width: 64, height: 64 }}>
    //             <div style={{ scale: 3, display: "inline-flex" }}><Avatar icon={avatar} /></div>
    //             <div style={{ position: "absolute", right: -24, bottom: -8 }}>
    //                 <TinyButton text={Locale.DevPage.Alter} icon={<ImageIcon />} type="primary" />
    //             </div>
    //         </div>
    //     </div>
    return <List>
        <Row>
            <Center>
                <div style={{ position: "relative", width: 96, height: 96 }}>
                    <div style={{ scale: 3, position: "absolute", left: 32, top: 32 }}><Avatar icon={avatar} /></div>
                    <div style={{
                        position: "absolute",
                        ...(isRtlLang() ? { right: 48 } : { left: 48 }),
                        bottom: -8
                    }}>
                        <TinyButton text={Locale.DevPage.Alter} icon={<ImageIcon />} type="primary" />
                    </div>
                </div>
            </Center>
        </Row>
        <ListItem title={Locale.DevPage.RoleName}>
            <TextArea rows={1} value={roleName} onChange={(v) => { setRoleName(v) }} />
        </ListItem>
        <ListItem title={Locale.DevPage.Prompt}>
            <TextArea value={prompt} onChange={(v) => { setPrompt(v) }} />
        </ListItem>
        <ListItem title={Locale.DevPage.InitDialog}>
            {greeting.map((msg: Message, i) => {
                return <Group isAttached>
                    <Select
                        options={[Locale.DevPage.User, roleName, Locale.DevPage.System]}
                        value={{ "user": Locale.DevPage.User, "assistant": roleName, "system": Locale.DevPage.System }[msg.role]}
                        onChange={(v) => {
                            setGreeting(greeting.map((m, idx) => idx == i ?
                                { type: msg.type, role: Object.fromEntries(Object.entries({ "user": Locale.DevPage.User, "assistant": roleName, "system": Locale.DevPage.System }).map(([key, value]) => [value, key]))[v], content: msg.content }
                                : m))
                        }}
                    />
                    <TextArea rows={1} value={msg.content} autoGrow
                        onChange={(v) => {
                            setGreeting(greeting.map((m, idx) => idx == i ?
                                { type: msg.type, role: msg.role, content: v }
                                : m))
                        }}
                    />
                    <Button icon={<DeleteIcon />} type="text" onClick={() => {
                        if (greeting.length <= 1) { return }
                        setGreeting(greeting.filter((v, idx) => idx != i))
                    }} />
                </Group>
            })}
            <div />
            <Group>
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
                            { type: "text", role: "system", content: Locale.DevPage.ReverseRolePrompt },
                            ...sendMessages
                        ].map((v, _) => {
                            if (v.role == "user") {
                                v.role = "assistant"
                            } else if (v.role == "assistant") {
                                v.role = "user"
                                v.content = Locale.DevPage.AssistantSays + v.content
                            } else if (v.role == "system") {
                                v.role = "assistant"
                                v.content = Locale.DevPage.SystemSays + v.content
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
            </Group>
        </ListItem>
        <ListItem title={Locale.DevPage.ActivateTool}>
            <SimpleGrid templateColumns={`repeat(auto-fill, minmax(${150}px, 1fr))`} gap={4}>
                <InfoCard>
                    <Row>
                        <Left>
                            <CheckBox text={Locale.DevPage.WebSearch} checked={search} onClick={() => setSearch(!search)} />
                        </Left>
                    </Row>
                </InfoCard>
                <InfoCard>
                    <Row>
                        <Left>
                            <CheckBox text={Locale.DevPage.Scripting} checked={script} onClick={() => setScript(!script)} />
                        </Left>
                    </Row>
                </InfoCard>
                <InfoCard>
                    <Row>
                        <Left>
                            <CheckBox text={Locale.DevPage.ImageGen} checked={paint} onClick={() => setPaint(!paint)} />
                        </Left>
                    </Row>
                </InfoCard>
                <InfoCard>
                    <Row>
                        <Left>
                            <Button type="text" text="更多" icon={<AddIcon />} />
                        </Left>
                    </Row>
                </InfoCard>
            </SimpleGrid>
        </ListItem>
        <ListItem title={Locale.DevPage.UploadFile}>
            {documents.map(doc => <Row>
                <Left>
                    <div style={{ display: "flex", gap: 8 }}>
                        {IconMap[(doc as string).split('.').slice(-1)[0].toLowerCase()] ?? <TxtIcon style={{ width: "16px", height: "16px" }} />}
                        <TextBlock>{doc}</TextBlock>
                    </div>
                </Left>
                <Right>
                    <TinyButton text={Locale.DevPage.Delete} type="primary" onClick={async () => {
                        await new KnowledgeBase(kbid).deleteDoc(doc)
                    }} />
                </Right>
            </Row>)}
            <Row>
                <Left>
                    <Button text={Locale.DevPage.Upload} onClick={async () => {
                        if (documents.length <= 0) {
                            await new KnowledgeBase(kbid).delete()
                        }
                        var input = document.createElement('input')
                        input.type = 'file'
                        input.multiple = true
                        input.accept = ".doc,.docx,.ppt,.pptx,.pdf,.html,.htm,.txt,.md,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,text/html,text/plain"
                        input.onchange = (async (e) => {
                            new KnowledgeBase(kbid, "keyword").add(Array.from((e.target as any).files)).then(() => {
                                setDocuments(new KnowledgeBase(kbid).listDocs())
                            })
                        })
                        input.click()
                    }} />
                </Left>
            </Row>
        </ListItem>
        <ListItem title="杂项：">
            <Row>
                <Left>
                    <CheckBox text="单次交互" />
                </Left>
                <Right>
                    <TextBlock>大模型直接响应本轮输入，忽略历史消息</TextBlock>
                </Right>
            </Row>
        </ListItem>
    </List>
    // </div>
}