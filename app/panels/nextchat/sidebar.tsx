import { useChatStore } from "@/app/store";
import { EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import { AddIcon } from "@chakra-ui/icons";
import { Button, Checkbox, Col, Dropdown, Flex, Row } from "antd";
import Locale, { ALL_LANG_OPTIONS, changeLang, getLang, isRtlLang } from "../../locales";
import confirm from "antd/es/modal/confirm";

import SendWhiteIcon from "../../icons/send-white.svg";
import ReturnIcon from "../../icons/bootstrap/arrow-return-left.svg";
import CopyIcon from "../../icons/bootstrap/copy.svg";
import ResetIcon from "../../icons/bootstrap/repeat.svg";
import BreakIcon from "../../icons/bootstrap/file-break.svg";
import DeleteIcon from "../../icons/bootstrap/trash3.svg";
import MagicIcon from "../../icons/bootstrap/magic.svg"
import StopIcon from "../../icons/bootstrap/pause-circle.svg";
import RobotIcon from "../../icons/bootstrap/robot.svg";
import UploadFileIcon from "../../icons/bootstrap/file-richtext.svg"
import MoreIcon from "../../icons/bootstrap/plus-lg.svg"
import RolePlayIcon from "../../icons/bootstrap/layout-wtf.svg"
import UserIcon from "../../icons/bootstrap/person.svg"
import AssistantIcon from "../../icons/bootstrap/robot.svg"
import SystemIcon from "../../icons/bootstrap/gear.svg"
import PluginIcon from "../../icons/bootstrap/puzzle.svg"
import UploadIcon from "../../icons/bootstrap/upload.svg"
import CustomIcon from "../../icons/bootstrap/code-slash.svg"
import SearchIcon from "../../icons/bootstrap/search.svg"
import ScriptingIcon from "../../icons/bootstrap/terminal.svg"
import ImageIcon from "../../icons/bootstrap/image.svg"
import BrushIcon from "../../icons/bootstrap/brush.svg"
import WhatsThisIcon from "../../icons/bootstrap/question-lg.svg"
import ISeeIcon from "../../icons/bootstrap/lightbulb.svg"
import CheckOutIcon from "../../icons/bootstrap/arrow-right-circle.svg"
import ConfigIcon from "../../icons/bootstrap/gear.svg";
import DownloadIcon from "../../icons/bootstrap/download.svg"
import OnnxIcon from "../../icons/onnx.svg"
import NNCHATIcon from "../../icons/nnchat.svg"
import NNCHATBanner from "../../icons/nnchat-banner.svg"
import RegularModelIcon from "../../icons/nnchat-regular-model.svg"
import AdvancedModelIcon from "../../icons/nnchat-advanced-model.svg"
import { memo } from "react";

export const Sidebar = memo(Sidebar_)

function Sidebar_(props: {
    useSelectedMessages,
    useManagingMessages,
    useChatPromise,
    useUseSmart,
    useMobileTab
}) {
    const chatStore = useChatStore()
    const session = chatStore.currentSession()
    const {
        useSelectedMessages: [selectedMessages, setSelectedMessages],
        useManagingMessages: [managingMessages, setManagingMessages],
        useChatPromise: [chatPromise, setChatPromise],
        useUseSmart: [useSmart, setUseSmart],
        useMobileTab: [mobileTab, setMobileTab]
    } = props
    function clearSelectedMessages() { setSelectedMessages([]) }
    function addSelectedMessage(id: string) { setSelectedMessages((prev) => [...prev, id]) }
    function removeSelectedMessage(id: string) { setSelectedMessages((prev) => prev.filter((item) => item !== id)) }
    function isMessageSelected(id: string) { return selectedMessages.includes(id) }
    function isSelectedAllMessages() { return selectedMessages.length === chatStore.sessions.length }
    function selectAllMessages() { setSelectedMessages(chatStore.sessions.map((item) => item.id)) }
    function isNoneMessageSelected() { return selectedMessages.length === 0 }
    return <>
        {!managingMessages && <Row gutter={8}>
            <Col span={12}>
                <Button icon={<AddIcon />} style={{ width: "100%" }} onClick={() => {
                    chatStore.newSession()
                    setMobileTab("chat")
                }}>
                    {Locale.NextChat.SideBar.NewChat}
                </Button>
            </Col>
            <Col span={12}>
                <Button icon={<SettingOutlined />} style={{ width: "100%" }} onClick={() => { clearSelectedMessages(); setManagingMessages(true); }}>
                    {Locale.NextChat.SideBar.Manage}
                </Button>
            </Col>
        </Row>}
        {managingMessages && <Row gutter={4}>
            <Col span={8}>
                <Flex style={{ height: "100%", width: "100%" }} align="center" justify="center">
                    <Checkbox
                        checked={isSelectedAllMessages()}
                        indeterminate={!isNoneMessageSelected() && !isSelectedAllMessages()}
                        onClick={() => { isSelectedAllMessages() ? clearSelectedMessages() : selectAllMessages() }}
                    >全选</Checkbox>
                </Flex>
            </Col>
            <Col span={8}>
                <Dropdown
                    disabled={isNoneMessageSelected()}
                    menu={{
                        items: [
                            {
                                key: 'delete',
                                label: "删除选中对话",
                                danger: true,
                                icon: <DeleteIcon />,
                                onClick: () => {
                                    confirm({
                                        title: '确认要删除这些对话吗？',
                                        okCancel: true,
                                        okText: "确认",
                                        cancelText: "取消",
                                        onOk: () => {
                                            let sessions = chatStore.sessions.map(sess => sess.id).slice()
                                            for (let id of selectedMessages) {
                                                let idx = 0
                                                for (let i = 0; i < sessions.length; i++) {
                                                    if (sessions[i] == id) {
                                                        idx = i
                                                        break
                                                    }
                                                }
                                                chatStore.deleteSession(idx, true)
                                                sessions = sessions.filter(s => s != id)
                                            }
                                            clearSelectedMessages()
                                            setManagingMessages(false)
                                        },
                                        onCancel: () => {
                                            clearSelectedMessages()
                                            setManagingMessages(false)
                                        }
                                    })
                                }
                            }
                        ]
                    }}
                    arrow
                >
                    <Button icon={<EllipsisOutlined />} style={{ width: "100%" }}>选项</Button>
                </Dropdown>
            </Col>
            <Col span={8}>
                <Button style={{ width: "100%" }} onClick={() => { setManagingMessages(false); clearSelectedMessages() }}>完成</Button>
            </Col>
        </Row>}
        <Flex style={{width:"100%", flex:1, overflowY: "scroll"}}>
            <Conversations
                activeKey={!managingMessages ? session.id : undefined}
                items={chatStore.sessions.map(sess => {
                    return {
                        key: sess.id,
                        label: <>
                            {managingMessages && <span style={{ width: 24, display: "inline-block" }}>{sess.emoji ?? "✨"}</span>}
                            {sess.topic.length == 0 ? Locale.NextChat.ChatArea.DefaultTopic : sess.topic}
                        </>,
                        icon: managingMessages ? <Checkbox checked={isMessageSelected(sess.id)} onClick={() => {
                            isMessageSelected(sess.id) ? removeSelectedMessage(sess.id) : addSelectedMessage(sess.id)
                        }} /> : (sess.emoji ?? "✨"),
                    }
                })}
                style={{
                    borderRadius: 12,
                    userSelect: "none",
                    width: "100%",
                    padding:0
                }}
                menu={!managingMessages ? (c) => {
                    return {
                        items: [
                            {
                                key: "delete",
                                label: Locale.NextChat.ChatArea.Delete,
                                icon: <DeleteIcon />,
                                danger: true,
                            }
                        ],
                        onClick: (info) => {
                            const id = c.key
                            if (info.key == "delete") {
                                let idx = 0
                                for (let i = 0; i < chatStore.sessions.length; i++) {
                                    if (chatStore.sessions[i].id == id) {
                                        idx = i
                                        break
                                    }
                                }
                                chatStore.deleteSession(idx)
                            }
                        }
                    }
                } : undefined}
                onActiveChange={async (v) => {
                    if (managingMessages) return
                    setSelectedMessages([])
                    setUseSmart(false)
                    chatStore.updateCurrentSession(session => {
                        for (let message of session.messages) {
                            message["modify"] = false;
                            message["expand"] = false;
                        }
                    })
                    chatPromise?.abort()
                    setChatPromise(undefined)
                    let idx = 0
                    for (let i = 0; i < chatStore.sessions.length; i++) {
                        if (chatStore.sessions[i].id == v) {
                            idx = i
                            break
                        }
                    }
                    chatStore.selectSession(idx)
                    setMobileTab("chat")
                }}
            />
        </Flex>
    </>
}