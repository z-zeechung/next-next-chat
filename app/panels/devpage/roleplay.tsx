import { ClientApi } from "@/app/client/api"
import { Message } from "@/app/message/Message"
import { Avatar, Button, ButtonGroup, CheckBox, InfoCard, List, ListItem, Select, TextArea, TinyButton } from "@/app/themes/theme"
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

import Locale from "../../locales";
import { KnowledgeBase } from "../../knowledgebase/knowledgebase";

const IconMap = {
    "doc": <WordIcon style={{width:"16px", height:"16px"}}/>,
    "docx": <WordIcon style={{width:"16px", height:"16px"}}/>,
    "pdf": <PDFIcon style={{width:"16px", height:"16px"}}/>,
    "pptx": <PPTIcon style={{width:"16px", height:"16px"}}/>,
    "md": <MarkdownIcon style={{width:"16px", height:"16px"}}/>,
    "html": <HTMLIcon style={{width:"16px", height:"16px"}}/>,
    "htm": <HTMLIcon style={{width:"16px", height:"16px"}}/>,
    "mhtml": <HTMLIcon style={{width:"16px", height:"16px"}}/>,
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
        <List>
            <ListItem title={Locale.DevPage.RoleName}>
                <TextArea rows={1} value={roleName} onChange={(v) => { setRoleName(v) }} />
            </ListItem>
            <ListItem title={Locale.DevPage.Prompt}>
                <TextArea value={prompt} onChange={(v) => { setPrompt(v) }} />
            </ListItem>
            <ListItem title={Locale.DevPage.InitDialog}>
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
                                        options={[Locale.DevPage.User, roleName, Locale.DevPage.System]}
                                        value={{ "user": Locale.DevPage.User, "assistant": roleName, "system": Locale.DevPage.System }[msg.role]}
                                        onChange={(v) => {
                                            setGreeting(greeting.map((m, idx) => idx == i ?
                                                { type: msg.type, role: Object.fromEntries(Object.entries({ "user": Locale.DevPage.User, "assistant": roleName, "system": Locale.DevPage.System }).map(([key, value]) => [value, key]))[v], content: msg.content }
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
                                        {type: "text", role: "system", content: Locale.DevPage.ReverseRolePrompt},
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
                        </ButtonGroup>
                    </CardBody>
                </Card>
            </ListItem>
            <ListItem title={Locale.DevPage.ActivateTool}>
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
            </ListItem>
            <ListItem title={Locale.DevPage.UploadFile}>
                <SimpleGrid templateColumns={`repeat(auto-fill, minmax(${150}px, 1fr))`} gap={4}>
                    {documents.map(doc=><InfoCard title={doc.length<=10 ? doc : doc.slice(0, 10)+"..."} icon={IconMap[(doc as string).split('.').slice(-1)[0].toLowerCase()]??<TxtIcon style={{width:"16px", height:"16px"}}/>}>
                        <TinyButton text={Locale.DevPage.Delete} type="primary" onClick={async ()=>{
                            await new KnowledgeBase(kbid).deleteDoc(doc)
                        }}/>
                    </InfoCard>)}
                </SimpleGrid>
                <p>&nbsp;</p>
                <Button text={Locale.DevPage.Upload} onClick={async ()=>{
                    if(documents.length <= 0){
                        await new KnowledgeBase(kbid).delete()
                    }
                    var input = document.createElement('input')
                    input.type = 'file'
                    input.multiple = true
                    input.accept = ".doc,.docx,.ppt,.pptx,.pdf,.html,.htm,.txt,.md,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,text/html,text/plain"
                    input.onchange = (async (e) => {
                      new KnowledgeBase(kbid, "keyword").add(Array.from((e.target as any).files)).then(()=>{
                        setDocuments(new KnowledgeBase(kbid).listDocs())
                      })
                    })
                    input.click()
                }}/>
            </ListItem>
            <ListItem>
                <ButtonGroup>
                    <Button text={Locale.DevPage.Upload} />
                    <Button text={Locale.DevPage.Save} />
                    <Button text={Locale.DevPage.Export} />
                </ButtonGroup>
            </ListItem>
        </List>
    </div>
}