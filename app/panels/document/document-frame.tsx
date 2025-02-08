import UserIcon from "../../icons/bootstrap/person.svg"
import AssistantIcon from "../../icons/bootstrap/robot.svg"
import SystemIcon from "../../icons/bootstrap/gear.svg"
import CopyIcon from "../../icons/bootstrap/copy.svg";
import DeleteIcon from "../../icons/bootstrap/trash3.svg";
import ResetIcon from "../../icons/bootstrap/repeat.svg";
import StopIcon from "../../icons/bootstrap/pause-circle.svg";
import HideGadgetsIcon from "../../icons/bootstrap/chevron-bar-right.svg"
import ShowGadgetsIcon from "../../icons/bootstrap/chevron-bar-left.svg"

// import { MarkdownMessage } from "@/app/message/TextMessage"
import { useChatStore } from "@/app/store"
// import { Button, Card, CardBody, Divider, Stack, Text } from "@chakra-ui/react"
// import { Avatar, ButtonGroup, MessageCard, TextArea, TinyButton, Button as ThemeButton } from "@/app/themes/theme";
import { Message, MessageElement, revokeMessage } from "@/app/message/Message";
import { useRef, useState } from "react";

export function DocumentFrame(props: {
    children?: any,
    gadgets?: { text: string, icon: any, onClick: () => void }[]
}) {

    const chatStore = useChatStore()
    const session = chatStore.currentSession()

    const [showGadgets, setShowGadgets] = useState(true)

    return <div style={{
        position: "relative",
        height:"100%",
        width:"100%"
    }}>
        {/* <div style={{
            position:"absolute",
            overflow:"scroll",
            left:0,
            right:0,
            top:0,
            bottom:0
        }}>
            {props.children}
        </div>
        {!showGadgets?
            <div style={{
                position: "absolute",
                right: 8,
                top: 8,
                display:!showGadgets?"flex":"none",
                zIndex:100
            }}>
                <TinyButton text="展开" type="primary" icon={<ShowGadgetsIcon/>} onClick={()=>{
                        setShowGadgets(true)
                }}/>
            </div>
                :
            <div style={{
                position: "absolute",
                right: 8,
                top: 8,
                bottom: 8,
                display:showGadgets?"flex":"none",
                gap:"6px",
                flexDirection:"column",
                width:200,
                zIndex:100
            }}>
                <div style={{
                    display:"flex",
                    flexDirection:"row-reverse"
                }}>
                    <TinyButton text="收起" type="primary" icon={<HideGadgetsIcon/>} onClick={()=>{
                        setShowGadgets(false)
                    }}/>
                </div>
                <Card padding={0}>
                    <CardBody padding={0}>
                        {(props.gadgets ?? []).map((gadget, idx) => {
                            return <>
                                <Button background={"white"}
                                    fontWeight={"normal"}
                                    leftIcon={gadget.icon}
                                    onClick={gadget.onClick}
                                    width={"100%"}
                                    {...(idx != 0 ? { borderTopRadius: 0 } : {})}
                                    {...(idx != (props.gadgets ?? []).length - 1 ? { borderBottomRadius: 0 } : {})}
                                >
                                    <div style={{width:"100%"}}>
                                        {gadget.text}
                                    </div>
                                </Button>
                                {idx != (props.gadgets ?? []).length - 1 ? <Divider /> : <></>}
                            </>
                        })}
                    </CardBody>
                </Card>
                <Card style={{
                    overflow:"scroll",
                    height:"100%",
                    padding:6,
                    display:"flex",
                    flexDirection:"column",
                    gap:10
                }}>
                    {[{type:"text", role:"assistant", content:"有什么我可以帮助您的吗🪄"} as Message].concat(session.messages).map((msg, i) => <div key={i}>
                        {msg.role == "user" ? <UserIcon /> : 
                            (msg.role == "system" ? <SystemIcon /> :
                                (session.avatar ? <div dangerouslySetInnerHTML={{ __html: session.avatar}} /> : <AssistantIcon />)
                            )
                        }
                        <MessageCard type={msg.role}>
                            <MessageElement message={msg} />
                        </MessageCard>
                    </div> )}
                </Card>
                <TextArea rows={1} rightAttachment={
                    <ThemeButton text="发送" type="primary" />
                } />
            </div>
        } */}
    </div>
}