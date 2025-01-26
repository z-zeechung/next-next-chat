import { useDebouncedCallback } from "use-debounce";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  // useCallback,
  Fragment,
  RefObject,
} from "react";

import SendWhiteIcon from "../icons/send-white.svg";
import ReturnIcon from "../icons/bootstrap/arrow-return-left.svg";
import CopyIcon from "../icons/bootstrap/copy.svg";
import ResetIcon from "../icons/bootstrap/repeat.svg";
import BreakIcon from "../icons/bootstrap/file-break.svg";
import DeleteIcon from "../icons/bootstrap/trash3.svg";
import MagicIcon from "../icons/bootstrap/magic.svg"
import StopIcon from "../icons/bootstrap/pause-circle.svg";
import RobotIcon from "../icons/bootstrap/robot.svg";
import UploadFileIcon from "../icons/bootstrap/file-richtext.svg"
import MoreIcon from "../icons/bootstrap/plus-lg.svg"
import RolePlayIcon from "../icons/bootstrap/layout-wtf.svg"

import UserIcon from "../icons/bootstrap/person.svg"
import AssistantIcon from "../icons/bootstrap/robot.svg"
import SystemIcon from "../icons/bootstrap/gear.svg"

import PluginIcon from "../icons/bootstrap/puzzle.svg"
import UploadIcon from "../icons/bootstrap/upload.svg"
import CustomIcon from "../icons/bootstrap/code-slash.svg"
import SearchIcon from "../icons/bootstrap/search.svg"
import ScriptingIcon from "../icons/bootstrap/terminal.svg"
import ImageIcon from "../icons/bootstrap/image.svg"
import BrushIcon from "../icons/bootstrap/brush.svg"
import WhatsThisIcon from "../icons/bootstrap/question-lg.svg"
import ISeeIcon from "../icons/bootstrap/lightbulb.svg"
import CheckOutIcon from "../icons/bootstrap/arrow-right-circle.svg"
import ConfigIcon from "../icons/bootstrap/gear.svg";

import DownloadIcon from "../icons/bootstrap/download.svg"

import OnnxIcon from "../icons/onnx.svg"
import NNCHATIcon from "../icons/nnchat.svg"
import NNCHATBanner from "../icons/nnchat-banner.svg"

import RegularModelIcon from "../icons/nnchat-regular-model.svg"
import AdvancedModelIcon from "../icons/nnchat-advanced-model.svg"

import {
  SubmitKey,
  useChatStore,
  BOT_HELLO,
  useAccessStore,
  useAppConfig,
} from "../store";

import {
  autoGrowTextArea,
  useMobileScreen,
  useWindowSize,
} from "../utils";

import Locale, { ALL_LANG_OPTIONS, changeLang, getLang, isRtlLang } from "../locales";

import styles from "../components/chat.module.scss";

import { useNavigate } from "react-router-dom";
import {
  CHAT_PAGE_SIZE,
  DEFAULT_SYSTEM_TEMPLATE,
} from "../constant";
import { copyMessage, Message, MessageElement, revokeMessage } from "../message/Message";

// import { Avatar, Button, ButtonCard, ButtonGroup, Component, Footer, Group, Header, Heading, InfoCard, Left, List, ListItem, MessageCard, Modal, Popover, PopoverCard, PopoverItem, Right, Row, Select, showConfirm, showToast, TextArea, TextBlock, TinyButton, TinyPopover } from "../themes/theme";
import { Card, grid, SimpleGrid } from "@chakra-ui/react";
import { ControllablePromise } from "../utils/controllable-promise";
import { Live2D } from "./nextchat/Live2D";
import { PluginMenu } from "./nextchat/plugins";
import { uploadFile, UploadFile } from "./nextchat/fileUpload";
import { DocxPopoverItem, PDFPopoverItem } from "./document-docx";
import { AudioPopoverItem } from "./audio";
import { ClientApi, useApiConfig } from "../client/api";
// import { SelectPromptModal } from "./nextchat/mask";
// import { KnowledgeBaseButton } from "./knowledge";
import { Markdown } from "../components/markdown";
// import { SideBar } from "../components/sidebar";
import { runPyodide } from "../pyodide/pyodide";

import { Avatar, Button, Checkbox, Col, Collapse, Drawer, Dropdown, Flex, Input, Layout, List, Menu, message, Modal, Row, Select, Space, Typography } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { Attachments, Bubble, BubbleProps, Conversations, Prompts, Sender } from '@ant-design/x';
import { GPTVis } from '@antv/gpt-vis';
import { AddIcon } from "@chakra-ui/icons";
import Title from "antd/es/typography/Title";
import { DocumentMessage } from "../message/DocumentMessage";
import { ArrowsAltOutlined, CheckOutlined, CloudDownloadOutlined, DownCircleOutlined, DownloadOutlined, DownOutlined, EditOutlined, EllipsisOutlined, FullscreenExitOutlined, FullscreenOutlined, GlobalOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons'
import { FileFrame } from "../file-frame/file-frame";
import { ImageMessage } from "../message/ImageMessage";
import confirm from "antd/es/modal/confirm";
import localforage from "localforage";
import { Dialog } from "./nextchat/dialog";
import { Sidebar } from "./nextchat/sidebar";
import { ModelConfig } from "./nextchat/model-config";

function Chat_() {

  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const config = useAppConfig();

  const [userInput, setUserInput] = useState("");

  const navigate = useNavigate();

  const [useSmart, setUseSmart] = useState(false)

  const [searchPlugin, setSearchPlugin] = useState(false)
  const [paintPlugin, setPaintPlugin] = useState(false)
  const [scriptPlugin, setScriptPlugin] = useState(false)

  const [chatPromise, setChatPromise] = useState(undefined as ControllablePromise<any> | undefined)

  const doSubmit = (userInput: string) => {
    setCollapseSidebar(true)
    const sessionId = session.id
    const getCurrentSession = () => { return chatStore.sessions.find(s => s.id == sessionId)! }
    const updateCurrentSession = (cb: (sess) => void) => {
      chatStore.update(({ sessions, currentSessionIndex }) => {
        cb(sessions.find(s => s.id == sessionId))
      })
    }
    let _messages = getCurrentSession().messages.slice()
    _messages = _messages.concat([{ type: "text", role: "user", content: userInput }])
    updateCurrentSession(sess => {
      sess.messages = [
        ..._messages,
        { type: "text", role: "assistant", content: "" }
      ]
    })
    const promise = ClientApi.chat(
      [
        { type: "text", role: "system", content: Locale.NextChat.SystemPrompt() },
        ..._messages
      ],
      msg => {
        updateCurrentSession(sess => {
          sess.messages = [
            ..._messages,
            { type: "text", role: "assistant", content: msg }
          ]
        })
      },
      {
        model: useSmart ? "smart" : "regular",
        tools: [
          { type: "function", function: { name: "vision" } },
          { type: "function", function: { name: "long_context" } },
          {
            type: "function",
            function: {
              name: "generate_image",
              description: "调用绘画模型生成图片",
              parameters: {
                type: "object",
                properties: {
                  "positive_prompt": {
                    type: "string",
                    description: "正向提示词，用来指定希望模型生成的内容"
                  },
                  "negative_prompt": {
                    type: "string",
                    description: "反向提示词，用来指定不希望模型生成的内容"
                  },
                  "file_name": {
                    type: "string",
                    description: "生成的图片的文件名，注意不要和历史记录中已有的图片重名"
                  }
                },
                required: ["positive_prompt", "negative_prompt", "file_name"]
              },
            },
            async call(params: { positive_prompt: string, negative_prompt: string, file_name: string }) {
              updateCurrentSession(sess => {
                sess.messages = [
                  ..._messages,
                  {
                    type: "text", role: "assistant", content: `\`\`\` toolcall
                    ${JSON.stringify([{
                      title: "正在绘制图片",
                      status: "pending",
                      description: params.positive_prompt
                    }])}
\`\`\`            ` }
                ]
              })
              const url = await ClientApi.paint(params.positive_prompt, params.negative_prompt)
              const blob = await (await fetch(url)).blob()
              const lfsUrl = await chatStore.setLfsData(await blob.arrayBuffer())
              return `
                已成功生成图片“${params.file_name}”！
                图片尚未插入到对话记录中，你可以通过(${params.file_name})[${lfsUrl}]来向用户展示图片。
              `
            }
          },
          {
            type: "function",
            function: {
              name: "web_search",
              description: "搜索网络内容，或是用户说的你不理解的事物",
              parameters: {
                type: "object",
                properties: {
                  "query": {
                    type: "string",
                    description: "你要查询的内容"
                  },
                  "count": {
                    type: "number",
                    description: "要查询的条数"
                  }
                },
                required: ["query"]
              },
            },
            async call(params: { query: string, count?: number }) {
              updateCurrentSession(sess => {
                sess.messages = [
                  ..._messages,
                  {
                    type: "text", role: "assistant", content: `\`\`\` toolcall
                    ${JSON.stringify([{
                      title: "正在搜索",
                      status: "pending",
                      description: params.query
                    }])}
\`\`\`            ` }
                ]
              })
              const result = await ClientApi.search(params.query, params.count)
              return JSON.stringify(result)
            }
          }
        ]
      }
    )
    setChatPromise(promise)
    promise.then(async (msg) => {
      setChatPromise(undefined)
      updateCurrentSession(sess => {
        sess.messages = [
          ..._messages,
          { type: "text", role: "assistant", content: msg }
        ]
      })
      if (session.topic.length <= 0) {
        const emojiRe = /((\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff]))(.*)/
        const topic = await ClientApi.chat([
          ...(session.messages),
          { type: "text", role: "system", content: Locale.NextChat.ChatArea.MakeTopicPrompt }
        ], undefined, { model: "smart" })
        updateCurrentSession(sess => {
          const matchResult = emojiRe.exec(topic)
          const emoji = matchResult?.[1] ?? topic[0]
          const _topic = matchResult?.[5] ?? topic
          sess.topic = _topic
          sess.emoji = emoji
        })
      }
    })
    setUserInput("");
  }

  const [showOption, setShowOption] = useState(false);
  function handleShowOption(shown: boolean) {
    setShowOption(shown)
  }

  const [isSelectingPrompt, setIsSelectingPrompt] = useState(false)
  const rolePlayIcon = <div style={{ position: "relative" }}>
    <RolePlayIcon style={session.avatar || session.prompt ? { fill: "#1D93AB", opacity: "0.8" } : {}} />
    <div
      dangerouslySetInnerHTML={{ __html: session.avatar ?? "" }}
      style={{
        position: "absolute",
        right: -8,
        bottom: -8,
        fontStyle: "initial"
      }}></div>
  </div>

  const [isShowingWhatsThis, setIsShowingWhatsThis] = useState(false)

  const [isShowingConfigProviders, setIsShowingConfigProviders] = useState(false)

  const { width, height } = useWindowSize()

  const [collapseSidebar, setCollapseSidebar] = useState(false)

  const [managingMessages, setManagingMessages] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState([] as string[])
  function clearSelectedMessages() { setSelectedMessages([]) }

  const isMobileScreen = useMobileScreen()

  const sidebarWidth = width > 900 ? 300 : 220
  const bodyWidth = width - sidebarWidth
  const desktopChatWidth = bodyWidth > 3 * sidebarWidth
    ? bodyWidth * 0.8
    : collapseSidebar ? width - 150 : bodyWidth - 50
  const mobileChatWidth = width - 50
  const chatWidth = isMobileScreen ? mobileChatWidth : desktopChatWidth
  const quickStartCount = Math.floor(chatWidth / 300)
  const quickStartWidth = chatWidth / quickStartCount * 0.9
  const maxMsgWidth = chatWidth * 0.8

  const SelectLanguage = (props: { mobile?}) => {
    return <Select
      style={{ userSelect: "none", width: props.mobile ? "100%" : undefined }}
      prefix={"🌐"}
      popupMatchSelectWidth={false}
      defaultValue={ALL_LANG_OPTIONS[getLang()]}
      options={Object.values(ALL_LANG_OPTIONS).map(o => { return { value: o, label: o } })}
      onChange={(value) => {
        changeLang(Object.values(ALL_LANG_OPTIONS).reduce((acc, key, index) => Object.assign(acc, { [key]: Object.keys(ALL_LANG_OPTIONS)[index] }), {})[value])
      }}
    />
  }

  const [mobileTab, setMobileTab] = useState<"chat" | "menu">("chat")

  if (isMobileScreen) {
    return <>
      {mobileTab == "chat" && <Layout style={{ height: "100%", userSelect: "text" }}>
        <Header style={{ background: "#f5f5f5", paddingLeft: 24, paddingRight: 24 }}>
          <Row style={{ height: "100%" }}>
            <Col span={10}>
              <Flex style={{ width: "100%", height: "100%" }} align="center" justify="start" >
                <Button type="text" icon={<MenuOutlined />} onClick={() => {
                  setMobileTab("menu")
                }}>{Locale.NextChat.SideBar.ChatList}</Button>
              </Flex>
            </Col>
            <Col span={8}>
              <Flex style={{ height: "100%" }} align="center">
                <Title level={5} style={{ userSelect: "none" }}>{session.topic.length == 0 ? Locale.NextChat.ChatArea.DefaultTopic : session.topic}</Title>
              </Flex>
            </Col>
            <Col span={6} />
          </Row>
        </Header>
        <Content style={{ padding: "32px", justifyItems: "center", paddingTop: 0 }}>
          <Dialog
            chatWidth={chatWidth} maxMsgWidth={maxMsgWidth} quickStartWidth={quickStartWidth}
            doSubmit={doSubmit}
            useUserInput={[userInput, setUserInput]}
            useChatPromise={[chatPromise, setChatPromise]}
            useUseSmart={[useSmart, setUseSmart]}
          />
        </Content>
      </Layout>}
      {mobileTab == "menu" && <Layout style={{ height: "100%" }}>
        <Content style={{ padding: 12, height: "100%" }}>
          <Flex vertical gap={"middle"} style={{ height: "100%" }}>
            <Flex align="center" justify="center">
              <NNCHATBanner height={"32"} width={"128"} style={{ userSelect: "none" }} />
            </Flex>
            <Sidebar
              useSelectedMessages={[selectedMessages, setSelectedMessages]}
              useManagingMessages={[managingMessages, setManagingMessages]}
              useChatPromise={[chatPromise, setChatPromise]}
              useUseSmart={[useSmart, setUseSmart]}
              useMobileTab={[mobileTab, setMobileTab]}
            />
            <Row gutter={8}>
              <Col span={12}>
                <Button icon={<OnnxIcon />} style={{ width: "100%" }} onClick={() => { setIsShowingConfigProviders(true) }}>
                  模型设置
                </Button>
                <Drawer
                  styles={{
                    body:{
                      padding: 0
                    }
                  }}
                  style={{ userSelect: "none" }}
                  height={height*0.7}
                  title="模型设置"
                  placement="bottom"
                  closable={false}
                  onClose={() => { setIsShowingConfigProviders(false) }}
                  open={isShowingConfigProviders}
                  extra={<Button type="primary" icon={<CheckOutlined />} onClick={() => { setIsShowingConfigProviders(false) }}>完成</Button>}
                >
                  <Collapse
                    style={{borderRadius: 0}}
                    bordered={false}
                    defaultActiveKey={["providers", "settings"]}
                    items={[
                      {
                        key: "providers",
                        children: <ModelConfig.Providers/>
                      },
                      {
                        key: "settings",
                        children: <ModelConfig.Models/>
                      }
                    ]}
                  />
                </Drawer>
              </Col>
              <Col span={12}>
                <SelectLanguage mobile />
              </Col>
            </Row>
          </Flex>
        </Content>
      </Layout>}
    </>
  }

  return <Layout style={{ height: "100%", userSelect: "text" }}>
    <Sider width={sidebarWidth} collapsed={collapseSidebar} style={{
      background: "#f5f5f5",
      padding: 12,
    }}>
      {!collapseSidebar && <Flex vertical gap={"middle"} style={{ height: "100%" }}>
        <table>
          <tr>
            <td>
              <NNCHATBanner height={"32"} width={"128"} style={{ userSelect: "none" }} />
            </td>
            <td align="right">
              <Button variant="link" color="default" icon={<MenuFoldOutlined />} iconPosition={"end"}
                onClick={() => {
                  setCollapseSidebar(true)
                  clearSelectedMessages()
                  setManagingMessages(false)
                }}
              >收起</Button>
            </td>
          </tr>
        </table>
        <Sidebar
          useSelectedMessages={[selectedMessages, setSelectedMessages]}
          useManagingMessages={[managingMessages, setManagingMessages]}
          useChatPromise={[chatPromise, setChatPromise]}
          useUseSmart={[useSmart, setUseSmart]}
          useMobileTab={[mobileTab, setMobileTab]}
        />
      </Flex>}
      {
        collapseSidebar && <>
          <Menu mode="inline" style={{ background: "#f5f5f5", height: "100%" }}
            items={[
              {
                key: "extend",
                label: "展开",
                icon: <MenuUnfoldOutlined />
              },
              {
                key: "divider1",
                type: "divider"
              },
              {
                key: "new",
                label: Locale.NextChat.SideBar.NewChat,
                icon: <AddIcon />
              },
              {
                key: "manage",
                label: Locale.NextChat.SideBar.Manage,
                icon: <SettingOutlined />
              },
              {
                key: "divider2",
                type: "divider"
              },
            ]}
            onClick={(info) => {
              switch (info.key) {
                case "extend":
                  setCollapseSidebar(false)
                  break
                case "new":
                  chatStore.newSession()
                  setCollapseSidebar(false)
                  break
                case "manage":
                  clearSelectedMessages();
                  setManagingMessages(true);
                  setCollapseSidebar(false)
                  break
              }
            }}
          />
        </>
      }
    </Sider>
    <Layout>
      <Header style={{ background: "#f5f5f5", }}>
        <Row style={{ height: "100%" }}>
          <Col span={12}>
            <Flex style={{ height: "100%" }} align="center">
              <Title level={5} style={{ marginBottom: 0, userSelect: "none" }}>{session.topic.length == 0 ? Locale.NextChat.ChatArea.DefaultTopic : session.topic}</Title>
            </Flex>
          </Col>
          <Col span={12}>
            <Flex style={{ width: "100%", height: "100%" }} align="center" justify="end" gap={"small"}>
              <Button icon={<OnnxIcon />} onClick={() => { setIsShowingConfigProviders(true) }}>
                模型设置
              </Button>
              <Modal
                style={{ userSelect: "none" }}
                width={1000}
                title="模型设置"
                open={isShowingConfigProviders}
                onCancel={() => { setIsShowingConfigProviders(false) }}
                footer={<Button type="primary" icon={<CheckOutlined />} onClick={() => { setIsShowingConfigProviders(false) }}>完成</Button>}
              >
                <Row>
                  <Col span={12} style={{ padding: 12, height: height - 300, overflowY: "scroll" }}>
                    <ModelConfig.Providers />
                  </Col>
                  <Col span={12} style={{ padding: 12, height: height - 300, overflowY: "scroll" }}>
                    <ModelConfig.Models />
                  </Col>
                </Row>
              </Modal>
              <SelectLanguage />
            </Flex>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "32px", justifyItems: "center", paddingTop: 0 }}>
        <Dialog
          chatWidth={chatWidth} maxMsgWidth={maxMsgWidth} quickStartWidth={quickStartWidth}
          doSubmit={doSubmit}
          useUserInput={[userInput, setUserInput]}
          useChatPromise={[chatPromise, setChatPromise]}
          useUseSmart={[useSmart, setUseSmart]}
        />
      </Content>
    </Layout>
  </Layout>

  // return <Component>
  //   <Header>
  //     <Row>
  //       <Left>
  //         <Heading>{session.topic.length > 0 ? (session.emoji + " " + session.topic) : Locale.NextChat.ChatArea.DefaultTopic}</Heading>
  //       </Left>
  //       <Right>
  //         <Group>
  //           <Button text="模型设置" type="primary" onClick={() => setIsShowingConfigProviders(true)} />
  //           <Select options={Object.values(ALL_LANG_OPTIONS)}
  //             value={ALL_LANG_OPTIONS[getLang()]}
  //             onChange={(value) => {
  //               changeLang(Object.values(ALL_LANG_OPTIONS).reduce((acc, key, index) => Object.assign(acc, { [key]: Object.keys(ALL_LANG_OPTIONS)[index] }), {})[value])
  //             }
  //             }
  //           />
  //         </Group>
  //       </Right>
  //     </Row>
  //   </Header>
  //   {isShowingConfigProviders && <Modal title="模型设置" onClose={() => setIsShowingConfigProviders(false)}>
  //     <div style={{ display: "flex", flexDirection: "row" }}>
  //       <List>
  //         {apiConfig.getFields().map(({ provider, fields }) => {
  //           return [
  //             <Row>
  //               <Left>
  //                 <Heading>{provider}</Heading>
  //               </Left>
  //             </Row>,
  //             ...(fields.map(field=>{
  //               return <ListItem title={field+": "}>
  //                 <TextArea rows={1} onChange={(v)=>apiConfig.setField(provider, field, v)} value={apiConfig.getField(provider, field)??""} />
  //               </ListItem>
  //             }))
  //           ]
  //         }).flatMap(item => item)}
  //       </List>
  //       <List>
  //         <Row>
  //           <Left>
  //             <Heading>文字模型</Heading>
  //           </Left>
  //         </Row>
  //         <ListItem title="常规模型">
  //           <Group>
  //             <TextBlock>服务商：</TextBlock>
  //             <Select
  //               options={[...(apiConfig.getProvider("chat") ? [] : ["选择服务商……"]), ...apiConfig.getProviders("chat")]}
  //               value={apiConfig.getProvider("chat") ?? "选择服务商……"}
  //               onChange={(v) => {
  //                 if (v == "选择服务商…") return
  //                 apiConfig.setProvider("chat", v)
  //               }} />
  //             <TextBlock>模型：</TextBlock>
  //             {apiConfig.getProvider("chat") && <Select
  //               options={apiConfig.getModels("chat")}
  //               value={apiConfig.getModel("chat")}
  //               onChange={(v) => { apiConfig.setModel("chat", v) }}
  //             />}
  //           </Group>
  //         </ListItem>
  //         <ListItem title="高级模型">
  //           <Group>
  //             <TextBlock>服务商：</TextBlock>
  //             <Select
  //               options={[...(apiConfig.getProvider("chat-smart") ? [] : ["选择服务商……"]), ...apiConfig.getProviders("chat-smart")]}
  //               value={apiConfig.getProvider("chat-smart") ?? "选择服务商……"}
  //               onChange={(v) => {
  //                 if (v == "选择服务商…") return
  //                 apiConfig.setProvider("chat-smart", v)
  //               }} />
  //             <TextBlock>模型：</TextBlock>
  //             {apiConfig.getProvider("chat-smart") && <Select
  //               options={apiConfig.getModels("chat-smart")}
  //               value={apiConfig.getModel("chat-smart")}
  //               onChange={(v) => { apiConfig.setModel("chat-smart", v) }}
  //             />}
  //           </Group>
  //         </ListItem>
  //         <ListItem title="长文本模型">
  //           <Group>
  //             <TextBlock>服务商：</TextBlock>
  //             <Select
  //               options={[...(apiConfig.getProvider("chat-long") ? [] : ["选择服务商……"]), ...apiConfig.getProviders("chat-long")]}
  //               value={apiConfig.getProvider("chat-long") ?? "选择服务商……"}
  //               onChange={(v) => {
  //                 if (v == "选择服务商…") return
  //                 apiConfig.setProvider("chat-long", v)
  //               }} />
  //             <TextBlock>模型：</TextBlock>
  //             {apiConfig.getProvider("chat-long") && <Select
  //               options={apiConfig.getModels("chat-long")}
  //               value={apiConfig.getModel("chat-long")}
  //               onChange={(v) => { apiConfig.setModel("chat-long", v) }}
  //             />}
  //           </Group>
  //         </ListItem>
  //       </List>
  //     </div>
  //   </Modal>}

  //   {[
  //     { type: "text", role: "assistant", content: session.greeting ?? Locale.NextChat.ChatArea.Greeting },
  //     ...session.messages,
  //     ...(userInput.trim().length > 0 ? [{ type: "text", role: "user", content: userInput }] : [])
  //   ].map((msg: any, i) => <MessageCard type={msg.role}>
  //     <Header>
  //       {msg.role == "user" ? (
  //         <Avatar icon={<UserIcon />} />
  //       ) : (msg.role == "system" ? <Avatar icon={<SystemIcon />} /> :
  //         <Avatar
  //           icon={session.avatar ? <div dangerouslySetInnerHTML={{
  //             __html: session.avatar
  //           }} /> : <AssistantIcon />}
  //         />
  //       )}
  //       {i != 0 && <>
  //         <TinyButton
  //           text={Locale.NextChat.ChatArea.Copy}
  //           type="text"
  //           icon={<CopyIcon />}
  //         />
  //         <TinyButton
  //           text={Locale.NextChat.ChatArea.Delete}
  //           type="text"
  //           icon={<DeleteIcon />}
  //           onClick={() => {
  //             chatStore.updateCurrentSession(sess => {
  //               revokeMessage(msg)
  //               sess.messages = sess.messages.filter((msg, mi) => mi != i - 1)
  //             })
  //           }}
  //         />
  //         {msg.role == "assistant" && <TinyButton
  //           text={Locale.NextChat.ChatArea.Retry}
  //           type="text"
  //           icon={<ResetIcon />}
  //         />}
  //       </>}
  //     </Header>
  //     <MessageElement message={msg} getLfsData={chatStore.getLfsData} />
  //   </MessageCard>)}
  //   {session.messages.length <= 0 && userInput.trim().length <= 0 && <InfoCard title={Locale.NextChat.ChatArea.QuickStart} icon={"🚀"} type="plain">
  //     <TextBlock>{Locale.NextChat.ChatArea.YouCanSeeInMore}</TextBlock>
  //     <SimpleGrid templateColumns={`repeat(auto-fill, minmax(${300}px, 1fr))`} gap={4}>
  //       <InfoCard title={Locale.NextChat.ChatArea.UploadFile} icon={"📤"}>
  //         <TextBlock>{Locale.NextChat.ChatArea.UploadDesc}</TextBlock>
  //         <Footer>
  //           <Row>
  //             <Right>
  //               <TinyButton text={Locale.NextChat.ChatArea.Upload} icon={<UploadIcon />} type="primary" onClick={() => { uploadFile(chatStore) }} />
  //             </Right>
  //           </Row>
  //         </Footer>
  //       </InfoCard>
  //       <InfoCard title={Locale.NextChat.ChatArea.RolePlay} icon={"🎭"}>
  //         <TextBlock>{Locale.NextChat.ChatArea.RolePlayDesc}</TextBlock>
  //         <Footer>
  //           <Row>
  //             <Right>
  //               <Group>
  //                 <TinyButton text={Locale.NextChat.ChatArea.SelectRole} icon={<RolePlayIcon />} type="primary" onClick={() => { setIsSelectingPrompt(true) }} />
  //                 <TinyButton text={Locale.NextChat.ChatArea.NewRole} icon={<MoreIcon />} type="primary" onClick={() => { navigate("/devrole") }} />
  //               </Group>
  //             </Right>
  //           </Row>
  //         </Footer>
  //       </InfoCard>
  //       <InfoCard title={Locale.NextChat.ChatArea.ChatPlugins} icon={"🧩"}>
  //         <TextBlock>{Locale.NextChat.ChatArea.PluginDesc}</TextBlock>
  //         <Footer>
  //           <Row>
  //             <Right>
  //               <Group>
  //                 <TinyPopover text={Locale.NextChat.ChatArea.EnablePlugin} icon={<PluginIcon style={{ transform: "rotate(45deg)", scale: "1.15" }} />} type="primary">
  //                   <PopoverItem text={Locale.NextChat.ChatArea.WebSearch} icon={<SearchIcon />} onClick={() => { setSearchPlugin(!searchPlugin); showToast(<TextBlock>{!searchPlugin ? Locale.NextChat.ChatArea.Activated(Locale.NextChat.ChatArea.WebSearch) : Locale.NextChat.ChatArea.Deactivated(Locale.NextChat.ChatArea.WebSearch)}</TextBlock>) }} />
  //                   <PopoverItem text={Locale.NextChat.ChatArea.Scripting} icon={<ScriptingIcon />} onClick={() => { setScriptPlugin(!scriptPlugin); showToast(<TextBlock>{!scriptPlugin ? Locale.NextChat.ChatArea.Activated(Locale.NextChat.ChatArea.Scripting) : Locale.NextChat.ChatArea.Deactivated(Locale.NextChat.ChatArea.Scripting)}</TextBlock>) }} />
  //                   <PopoverItem text={Locale.NextChat.ChatArea.GenImage} icon={
  //                     <div style={{ width: 16, height: 16, position: "relative" }}><ImageIcon /><BrushIcon style={{ position: "absolute", right: -4, bottom: -6, zoom: 0.8 }} /></div>
  //                   } onClick={() => { setPaintPlugin(!paintPlugin); showToast(<TextBlock>{!paintPlugin ? Locale.NextChat.ChatArea.Activated(Locale.NextChat.ChatArea.GenImage) : Locale.NextChat.ChatArea.Deactivated(Locale.NextChat.ChatArea.GenImage)}</TextBlock>) }} />
  //                 </TinyPopover>
  //                 {/* <TinyButton text={Locale.NextChat.ChatArea.NewPlugin} icon={<CustomIcon />} type="primary" onClick={() => { showToast(<TextBlock>WIP...</TextBlock>) }} /> */}
  //               </Group>
  //             </Right>
  //           </Row>
  //         </Footer>
  //       </InfoCard>
  //       {/* <InfoCard title={Locale.NextChat.ChatArea.KnowledgeBase} icon={"📚"}>
  //         <TextBlock>{Locale.NextChat.ChatArea.KBDesc}</TextBlock>
  //         <Footer>
  //           <Row>
  //             <Right>
  //               <Group>
  //                 <TinyButton text={Locale.NextChat.ChatArea.KBDetail} icon={<WhatsThisIcon />} type="primary" onClick={() => { setIsShowingWhatsThis(true) }} />
  //                 <TinyButton text={Locale.NextChat.ChatArea.SeeKB} icon={<CheckOutIcon />} type="primary" onClick={() => { navigate("/knowledge") }} />
  //               </Group>
  //             </Right>
  //           </Row>
  //         </Footer>
  //       </InfoCard> */}
  //       {/* <InfoCard title={Locale.NextChat.ChatArea.IntelligentOffice} icon={"📑"}>
  //         <TextBlock>⚠ This module is under refactor.</TextBlock>
  //       </InfoCard> */}
  //     </SimpleGrid>
  //   </InfoCard>}
  //   <Footer>
  //     <Row>
  //       <Left>
  //         <TinyButton
  //           onClick={() => { handleShowOption(!showOption) }}
  //           text={showOption ? Locale.NextChat.ChatArea.Return : Locale.NextChat.ChatArea.More}
  //           icon={showOption ? <ReturnIcon /> : <MoreIcon />}
  //           type={showOption ? "primary" : undefined}
  //         />
  //       </Left>
  //       <Right>
  //         <TinyPopover text={Locale.NextChat.ChatArea.ChatOptions} icon={<ConfigIcon />} type="primary">
  //           <PopoverItem text={Locale.NextChat.ChatArea.RolePlay} icon={rolePlayIcon} onClick={() => { setIsSelectingPrompt(true) }} />
  //           <PopoverItem text={Locale.NextChat.ChatArea.SwitchModel} icon={changeModelIcon} onClick={changeModel} />
  //           <PopoverItem text={Locale.NextChat.ChatArea.WebSearch} icon={<SearchIcon />} onClick={() => { setSearchPlugin(!searchPlugin); showToast(<TextBlock>{!searchPlugin ? Locale.NextChat.ChatArea.Activated(Locale.NextChat.ChatArea.WebSearch) : Locale.NextChat.ChatArea.Deactivated(Locale.NextChat.ChatArea.WebSearch)}</TextBlock>) }} />
  //           <PopoverItem text={Locale.NextChat.ChatArea.Scripting} icon={<ScriptingIcon />} onClick={() => { setScriptPlugin(!scriptPlugin); showToast(<TextBlock>{!scriptPlugin ? Locale.NextChat.ChatArea.Activated(Locale.NextChat.ChatArea.Scripting) : Locale.NextChat.ChatArea.Deactivated(Locale.NextChat.ChatArea.Scripting)}</TextBlock>) }} />
  //           <PopoverItem text={Locale.NextChat.ChatArea.GenImage} icon={
  //             <div style={{ width: 16, height: 16, position: "relative" }}><ImageIcon /><BrushIcon style={{ position: "absolute", right: -4, bottom: -6, zoom: 0.8 }} /></div>
  //           } onClick={() => { setPaintPlugin(!paintPlugin); showToast(<TextBlock>{!paintPlugin ? Locale.NextChat.ChatArea.Activated(Locale.NextChat.ChatArea.GenImage) : Locale.NextChat.ChatArea.Deactivated(Locale.NextChat.ChatArea.GenImage)}</TextBlock>) }} />
  //         </TinyPopover>
  //       </Right>
  //     </Row>
  //     {!showOption && <Group isAttached>
  //       <TextArea
  //         placeholder={Locale.NextChat.ChatArea.SendPrompt}
  //         onInput={(v) => onInput(v)}
  //         value={userInput}
  //         rows={3.5}
  //         autoGrow
  //         autoFocus={autoFocus}
  //       />
  //       <Button
  //         icon={<SendWhiteIcon />}
  //         text={Locale.NextChat.ChatArea.Send}
  //         type="primary"
  //         onClick={() => doSubmit(userInput)}
  //       />
  //     </Group>}
  //     {showOption && <Toolbox>
  //       <ButtonCard text={Locale.NextChat.ChatArea.RolePlay} icon={rolePlayIcon} onClick={() => { setIsSelectingPrompt(true) }} />
  //       <ButtonCard text={Locale.NextChat.ChatArea.SwitchModel} icon={changeModelIcon} onClick={changeModel} />
  //       <UploadFile />
  //       <PopoverCard text={Locale.NextChat.ChatArea.ChatPlugins} icon={<PluginIcon style={{ transform: "rotate(45deg)", scale: "1.15" }} />}>
  //         <PopoverItem text={Locale.NextChat.ChatArea.WebSearch} icon={<SearchIcon />} onClick={() => { setSearchPlugin(!searchPlugin); showToast(<TextBlock>{!searchPlugin ? Locale.NextChat.ChatArea.Activated(Locale.NextChat.ChatArea.WebSearch) : Locale.NextChat.ChatArea.Deactivated(Locale.NextChat.ChatArea.WebSearch)}</TextBlock>) }} />
  //         <PopoverItem text={Locale.NextChat.ChatArea.Scripting} icon={<ScriptingIcon />} onClick={() => { setScriptPlugin(!scriptPlugin); showToast(<TextBlock>{!scriptPlugin ? Locale.NextChat.ChatArea.Activated(Locale.NextChat.ChatArea.Scripting) : Locale.NextChat.ChatArea.Deactivated(Locale.NextChat.ChatArea.Scripting)}</TextBlock>) }} />
  //         <PopoverItem text={Locale.NextChat.ChatArea.GenImage} icon={
  //           <div style={{ width: 16, height: 16, position: "relative" }}><ImageIcon /><BrushIcon style={{ position: "absolute", right: -4, bottom: -6, zoom: 0.8 }} /></div>
  //         } onClick={() => { setPaintPlugin(!paintPlugin); showToast(<TextBlock>{!paintPlugin ? Locale.NextChat.ChatArea.Activated(Locale.NextChat.ChatArea.GenImage) : Locale.NextChat.ChatArea.Deactivated(Locale.NextChat.ChatArea.GenImage)}</TextBlock>) }} />
  //       </PopoverCard>
  //       {/* <KnowledgeBaseButton />
  //       <PopoverCard
  //         text={Locale.NextChat.ChatArea.IntelligentOffice}
  //         icon={<div style={{ position: "relative" }}>
  //           <UploadFileIcon />
  //           <div style={{
  //             position: "absolute",
  //             right: -5,
  //             bottom: -5,
  //             fontStyle: "initial",
  //             zoom: 0.8,
  //             transform: "scaleX(-1)"
  //           }}><MagicIcon /></div>
  //         </div>}
  //       >
  //         <DocxPopoverItem />
  //         <PDFPopoverItem />
  //         <AudioPopoverItem />
  //       </PopoverCard> */}
  //       <ButtonCard text={Locale.NextChat.ChatArea.DeleteChat} icon={<BreakIcon style={{ fill: "red", opacity: "0.8" }} />} onClick={async () => {
  //         chatStore.deleteSession(chatStore.currentSessionIndex);
  //       }} />
  //       <ButtonCard text={Locale.NextChat.ChatArea.ClearData} icon={<DeleteIcon style={{ fill: "red", opacity: "0.8" }} />} onClick={async () => {
  //         if (await showConfirm("", <>{Locale.NextChat.ChatArea.ClearDataPrompt}</>, true)) {
  //           chatStore.clearAllData();
  //         }
  //       }} />
  //     </Toolbox>}
  //   </Footer>

  //   {isSelectingPrompt && <SelectPromptModal onClose={() => { setIsSelectingPrompt(false) }} />}

  //   {isShowingWhatsThis && <Modal title={Locale.KnowledgeBase.WhatsThis} onClose={() => { setIsShowingWhatsThis(false) }} >
  //     <TextBlock>{Locale.KnowledgeBase.Explaination}</TextBlock>
  //     <Footer>
  //       <Row>
  //         <Right>
  //           <Button text={Locale.KnowledgeBase.ISee} type="primary" icon={<ISeeIcon />} onClick={() => { setIsShowingWhatsThis(false) }} />
  //         </Right>
  //       </Row>
  //     </Footer>
  //   </Modal>}

  // </Component>

}

let hadMadeNewChat = false

export function NextChat() {
  const chatStore = useChatStore();
  const [sessionIndex, setSessionIndex] = useState(chatStore.currentSessionIndex);

  const [isHovered, setIsHovered] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!hadMadeNewChat && chatStore.sessions[0].messages.length > 0) {
      chatStore.newSession()
    }
    hadMadeNewChat = true
    // if(chatStore.sessions[0].messages.length=0&&chatStore.sessions[0].topic.length>0){
    //   chatStore.sessions[0].lastUpdate = Date.now()
    // }
  })

  return <Chat_ key={sessionIndex} />

  // return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: isRtlLang() ? "row-reverse" : "row" }}>
  //   <div>
  //     <SideBar />
  //   </div>
  //   <div style={{ flex: 1 }}>
  //     <_Chat key={sessionIndex} />
  //   </div>
  // </div>
}
