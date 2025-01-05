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

import OnnxIcon from "../icons/onnx.svg"
import NNCHATIcon from "../icons/nnchat.svg"

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
import { Message, MessageElement, revokeMessage } from "../message/Message";

// import { Avatar, Button, ButtonCard, ButtonGroup, Component, Footer, Group, Header, Heading, InfoCard, Left, List, ListItem, MessageCard, Modal, Popover, PopoverCard, PopoverItem, Right, Row, Select, showConfirm, showToast, TextArea, TextBlock, TinyButton, TinyPopover } from "../themes/theme";
import { Card, grid, SimpleGrid } from "@chakra-ui/react";
import { ControllablePromise } from "../utils/controllable-promise";
import { Live2D } from "./nextchat/Live2D";
import { PluginMenu } from "./nextchat/plugins";
import { uploadFile, UploadFile } from "./nextchat/fileUpload";
import { DocxPopoverItem, PDFPopoverItem } from "./document-docx";
import { AudioPopoverItem } from "./audio";
import { ClientApi, useApiConfig } from "../client/api";
import { SelectPromptModal } from "./nextchat/mask";
import { KnowledgeBaseButton } from "./knowledge";
import { Markdown } from "../components/markdown";
import { SideBar } from "../components/sidebar";
import { runPyodide } from "../pyodide/pyodide";

import { Avatar, Button, Col, Flex, Layout, Menu, Row, Select, Typography } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { Attachments, Bubble, BubbleProps, Conversations, Prompts, Sender } from '@ant-design/x';
import { GPTVis } from '@antv/gpt-vis';
import { AddIcon } from "@chakra-ui/icons";
import Title from "antd/es/typography/Title";
import { DocumentMessage } from "../message/DocumentMessage";
import { DownCircleOutlined, DownOutlined, EditOutlined, GlobalOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons'

function useSubmitHandler() {
  const config = useAppConfig();
  const submitKey = config.submitKey;
  const isComposing = useRef(false);

  useEffect(() => {
    const onCompositionStart = () => {
      isComposing.current = true;
    };
    const onCompositionEnd = () => {
      isComposing.current = false;
    };

    window.addEventListener("compositionstart", onCompositionStart);
    window.addEventListener("compositionend", onCompositionEnd);

    return () => {
      window.removeEventListener("compositionstart", onCompositionStart);
      window.removeEventListener("compositionend", onCompositionEnd);
    };
  }, []);

  const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Fix Chinese input method "Enter" on Safari
    if (e.keyCode == 229) return false;
    if (e.key !== "Enter") return false;
    if (e.key === "Enter" && (e.nativeEvent.isComposing || isComposing.current))
      return false;
    return (
      (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
      (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
      (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
      (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
      (config.submitKey === SubmitKey.Enter &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.metaKey)
    );
  };

  return {
    submitKey,
    shouldSubmit,
  };
}

function Toolbox(props: { children: any[] }) {
  return <SimpleGrid templateColumns={`repeat(auto-fill, minmax(${72}px, 1fr))`} gap={4}>
    {props.children.map((elem, idx) => <Card key={idx} background={"#00000000"} shadow={"none"} align={"center"}>
      {elem}
    </Card>)}
  </SimpleGrid>
}

function useScrollToBottom(
  scrollRef: RefObject<HTMLDivElement>,
  detach: boolean = false,
) {
  // for auto-scroll

  const [autoScroll, setAutoScroll] = useState(true);
  function scrollDomToBottom() {
    const dom = scrollRef.current;
    if (dom) {
      requestAnimationFrame(() => {
        setAutoScroll(true);
        dom.scrollTo(0, dom.scrollHeight);
      });
    }
  }

  // auto scroll
  useEffect(() => {
    if (autoScroll && !detach) {
      scrollDomToBottom();
    }
  });

  return {
    scrollRef,
    autoScroll,
    setAutoScroll,
    scrollDomToBottom,
  };
}

function _Chat() {
  type RenderMessage = Message & { preview?: boolean };

  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const config = useAppConfig();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { submitKey, shouldSubmit } = useSubmitHandler();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = scrollRef?.current
    ? Math.abs(
      scrollRef.current.scrollHeight -
      (scrollRef.current.scrollTop + scrollRef.current.clientHeight),
    ) <= 1
    : false;
  const { setAutoScroll, scrollDomToBottom } = useScrollToBottom(
    scrollRef,
    isScrolledToBottom,
  );
  const [hitBottom, setHitBottom] = useState(true);
  const isMobileScreen = useMobileScreen();
  const navigate = useNavigate();

  const [useSmart, setUseSmart] = useState(false)
  const changeModelIcon = <div style={{ position: "relative" }}>
    <RobotIcon style={{ fill: (useSmart ? "#FFFB2B" : "#1D93AB"), opacity: "0.8" }} />
    <div style={{
      position: "absolute",
      right: useSmart ? -8 : -16,
      bottom: -8,
      background: "#0007",
      borderRadius: 1000,
      fontSize: 10,
      color: "white",
      fontStyle: "initial"
    }}>&nbsp;&nbsp;{useSmart ? "4" : "3.5"}&nbsp;&nbsp;</div>
  </div>
  const changeModel = () => {
    // showToast(`已切换至${!useSmart ? "高级" : "普通"}模型`)
    showToast(<TextBlock>{Locale.NextChat.ChatArea.SwitchedToModel(useSmart ? "regular" : "smart")}</TextBlock>)
    setUseSmart(!useSmart)
  }

  // auto grow input
  const [inputRows, setInputRows] = useState(2);
  const measure = useDebouncedCallback(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(
        20,
        Math.max(2 + Number(!isMobileScreen), rows),
      );
      setInputRows(inputRows);
    },
    100,
    {
      leading: true,
      trailing: true,
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, [userInput]);

  const onInput = (text: string) => {
    setUserInput(text);
  };

  const [searchPlugin, setSearchPlugin] = useState(false)
  const [paintPlugin, setPaintPlugin] = useState(false)
  const [scriptPlugin, setScriptPlugin] = useState(false)

  const tools = (appendMessage: (message: Message) => void) => []

  const [chatPromise, setChatPromise] = useState(undefined as ControllablePromise<any> | undefined)

  const doSubmit = (userInput: string) => {
    let _messages = session.messages.slice()
    _messages = _messages.concat([{ type: "text", role: "user", content: userInput }])
    chatStore.updateCurrentSession(sess => {
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
        chatStore.updateCurrentSession(sess => {
          sess.messages = [
            ..._messages,
            { type: "text", role: "assistant", content: msg }
          ]
        })
      },
      {
        model: useSmart ? "smart" : "regular",
        tools: tools((m) => { _messages.push(m) })
      }
    )
    setChatPromise(promise)
    promise.then(async (msg) => {
      setChatPromise(undefined)
      chatStore.updateCurrentSession(sess => {
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
        chatStore.updateCurrentSession(sess => {
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

  const context: RenderMessage[] = useMemo(() => {
    return session.mask.hideContext ? [] : session.mask.context.slice();
  }, [session.mask.context, session.mask.hideContext]);
  const accessStore = useAccessStore();

  if (
    context.length === 0 &&
    session.messages.at(0)?.content !== BOT_HELLO.content
  ) {
    const copiedHello = Object.assign({}, BOT_HELLO);
    if (!accessStore.isAuthorized()) {
      copiedHello.content = Locale.Error.Unauthorized;
    }
    context.push(copiedHello);
  }

  // preview messages
  const renderMessages = useMemo(() => {
    return context
      .concat(session.messages as RenderMessage[])
      .concat(
        isLoading
          ? [
            { type: "text", role: "assistant", content: "......" }
            // new MarkdownMessage("assistant", "......")
            // {
            //   ...new MarkdownMessage("assistant", "......"),
            //   preview: true,
            // },
          ]
          : [],
      )
      .concat(
        userInput.length > 0 && config.sendPreviewBubble
          ? [
            { type: "text", role: "user", content: userInput }
            // new MarkdownMessage("user", userInput)
            // {
            //   ...createMessage({
            //     role: "user",
            //     content: userInput,
            //   }),
            //   preview: true,
            // },
          ]
          : [],
      );
  }, [
    config.sendPreviewBubble,
    context,
    isLoading,
    session.messages,
    userInput,
  ]);

  const [msgRenderIndex, _setMsgRenderIndex] = useState(
    Math.max(0, renderMessages.length - CHAT_PAGE_SIZE),
  );
  function setMsgRenderIndex(newIndex: number) {
    newIndex = Math.min(renderMessages.length - CHAT_PAGE_SIZE, newIndex);
    newIndex = Math.max(0, newIndex);
    _setMsgRenderIndex(newIndex);
  }

  const onChatBodyScroll = (e: HTMLElement) => {
    const bottomHeight = e.scrollTop + e.clientHeight;
    const edgeThreshold = e.clientHeight;

    const isTouchTopEdge = e.scrollTop <= edgeThreshold;
    const isTouchBottomEdge = bottomHeight >= e.scrollHeight - edgeThreshold;
    const isHitBottom =
      bottomHeight >= e.scrollHeight - (isMobileScreen ? 4 : 10);

    const prevPageMsgIndex = msgRenderIndex - CHAT_PAGE_SIZE;
    const nextPageMsgIndex = msgRenderIndex + CHAT_PAGE_SIZE;

    if (isTouchTopEdge && !isTouchBottomEdge) {
      setMsgRenderIndex(prevPageMsgIndex);
    } else if (isTouchBottomEdge) {
      setMsgRenderIndex(nextPageMsgIndex);
    }

    setHitBottom(isHitBottom);
    setAutoScroll(isHitBottom);
  };

  const autoFocus = !isMobileScreen; // wont auto focus on mobile screen

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
  const apiConfig = useApiConfig()

  const RenderMarkdown: BubbleProps['messageRender'] = (content) => <div style={{userSelect:"text"}}><Markdown content={content} /></div>;

  const { width, height } = useWindowSize()

  const [collapseSidebar, setCollapseSidebar] = useState(false)

  const [showMoreOptions, setShowMoreOptions] = useState(false)

  return <Layout style={{ height: "100%" }}>
    <Sider width={"20%"} collapsed={collapseSidebar} style={{
      background: "#f5f5f5",
      padding: 12,
    }}>
      {!collapseSidebar && <Flex vertical gap={"middle"} style={{ height: "100%" }}>
        <Flex style={{ width: "100%", paddingTop: 8 }}>
          <Row style={{ width: "100%" }}>
            <Col span={18}>
            <Flex gap={"small"}>
              <div style={{zoom: 2}}>
                <NNCHATIcon/>
              </div>
              <Markdown content="## $N^2\text{CHAT}$" />
            </Flex>
            </Col>
          </Row>
          <Row>
            <Col span={6} style={{ paddingRight: 36 }}>
              <Button type="text" icon={<MenuFoldOutlined />} iconPosition={"end"} onClick={() => { setCollapseSidebar(true) }}>收起</Button>
            </Col>
          </Row>
        </Flex>
        <Flex gap={"small"}>
          <Button icon={<AddIcon />} onClick={() => {
            chatStore.newSession()
          }}>
            {Locale.NextChat.SideBar.NewChat}
          </Button>
          <Button icon={<SettingOutlined />}>
            {Locale.NextChat.SideBar.Manage}
          </Button>
        </Flex>
        <Conversations
          items={chatStore.sessions.map(sess => {
            return {
              key: sess.id,
              label: sess.topic.length == 0 ? Locale.NextChat.ChatArea.DefaultTopic : sess.topic,
              icon: sess.emoji ?? "✨",
            }
          })}
          style={{
            background: "white",
            borderRadius: 12
          }}
          menu={(c) => {
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
          }}
          onActiveChange={(v) => {
            let idx = 0
            for (let i = 0; i < chatStore.sessions.length; i++) {
              if (chatStore.sessions[i].id == v) {
                idx = i
                break
              }
            }
            chatStore.selectSession(idx)
          }}
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
                type:"divider"
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
                type:"divider"
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
              <Title level={5} style={{ marginBottom: 0 }}>{session.topic.length == 0 ? Locale.NextChat.ChatArea.DefaultTopic : session.topic}</Title>
            </Flex>
          </Col>
          <Col span={12}>
            <Flex style={{ width: "100%", height: "100%" }} align="center" justify="end" gap={"small"}>
              <Button icon={<NNCHATIcon/>}>模型设置</Button>
              <Select
                popupMatchSelectWidth={false}
                defaultValue={ALL_LANG_OPTIONS[getLang()]}
                options={Object.values(ALL_LANG_OPTIONS).map(o => { return { value: o, label: o } })}
                onChange={(value) => {
                  changeLang(Object.values(ALL_LANG_OPTIONS).reduce((acc, key, index) => Object.assign(acc, { [key]: Object.keys(ALL_LANG_OPTIONS)[index] }), {})[value])
                }}
              />
            </Flex>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "32px", justifyItems: "center", paddingTop: 0 }}>
        <Flex justify={"center"} align={"center"} vertical gap={"middle"} style={{ height: "100%", width: width * 0.618 }}>
          <Bubble.List
            style={{ width: "100%" }}
            roles={{
              system: {
                placement: "start",
                avatar: { icon:<SettingOutlined/>, style:{background:"none", color:"darkgray"} },
                variant: "borderless",
                messageRender: RenderMarkdown,
                footer: <Flex gap={"small"}>
                  <Button type="text" size="small" icon={<CopyIcon/>}>{Locale.NextChat.ChatArea.Copy}</Button>
                  <Button type="text" size="small" icon={<DeleteIcon/>}>{Locale.NextChat.ChatArea.Delete}</Button>
                </Flex>
              },
              assistant: {
                placement: "start",
                avatar: { icon: <NNCHATIcon width={32} height={32}/>, style:{background:"none"} },
                variant: "borderless",
                messageRender: RenderMarkdown,
                footer: <Flex gap={"small"}>
                  <Button type="text" size="small" icon={<CopyIcon/>}>{Locale.NextChat.ChatArea.Copy}</Button>
                  <Button type="text" size="small" icon={<DeleteIcon/>}>{Locale.NextChat.ChatArea.Delete}</Button>
                  <Button type="text" size="small" icon={<ResetIcon/>}>{Locale.NextChat.ChatArea.Retry}</Button>
                </Flex>
              },
              user: {
                placement: "end",
                // avatar: { icon: "👤" },
                messageRender: RenderMarkdown,
                variant: "filled",
                shape: "corner",
                footer: <Flex gap={"small"}>
                  <Button type="text" size="small" icon={<CopyIcon/>}>{Locale.NextChat.ChatArea.Copy}</Button>
                  <Button type="text" size="small" icon={<DeleteIcon/>}>{Locale.NextChat.ChatArea.Delete}</Button>
                  <Button type="text" size="small" icon={<EditOutlined />}>修改</Button>
                </Flex>
              },
            }}
            items={
              [
                ...(session.messages.length==0&&userInput.trim().length==0?[{ type: "text", role: "assistant", content: Locale.NextChat.ChatArea.Greeting, greeting: true}]:[]),
                ...session.messages,
                ...(userInput.trim().length > 0 ? [{ type: "text", role: "user", content: userInput, userInput: true}] : [])
              ].map(
                (msg, idx) => {
                  if (msg.type == "document") {
                    return {
                      role: msg.role,
                      content: JSON.stringify({
                        fileName: (msg as DocumentMessage).fileName,
                        src: (msg as DocumentMessage).src
                      }),
                      messageRender: (content) => {
                        const { fileName, src } = JSON.parse(content)
                        return <Attachments.FileCard item={{
                          uid: `${idx}`,
                          name: fileName
                        }} />
                      }
                    }
                  } else {
                    return {
                      role: msg.role,
                      content: msg.content,
                      ...(msg["greeting"]||msg["userInput"]?{footer:undefined}:{})
                    }
                  }
                }
              )
            }
          />
          {session.messages.length == 0 && <Prompts
            title={<Flex gap={"small"}>
              <Title level={4}>🚀</Title>
              <Flex vertical>
                <Title level={4}>{Locale.NextChat.ChatArea.QuickStart}</Title>
                <Typography.Text>{Locale.NextChat.ChatArea.YouCanSeeInMore}</Typography.Text>
              </Flex>
            </Flex>}
            items={[
              {
                key: "1",
                label: Locale.NextChat.ChatArea.UploadFile,
                icon: "📤",
                description: Locale.NextChat.ChatArea.UploadDesc,
                children: [
                  {
                    key: "1-1",
                    label: Locale.NextChat.ChatArea.Upload,
                    icon: <UploadIcon />,
                  }
                ],
              },
              {
                key: "2",
                label: Locale.NextChat.ChatArea.RolePlay,
                icon: "🎭",
                description: Locale.NextChat.ChatArea.RolePlayDesc,
                children: [
                  {
                    key: "2-1",
                    label: Locale.NextChat.ChatArea.SelectRole,
                    icon: <RolePlayIcon />
                  },
                  {
                    key: "2-2",
                    label: Locale.NextChat.ChatArea.NewRole,
                    icon: <MoreIcon />
                  }
                ]
              },
              {
                key: "3",
                label: Locale.NextChat.ChatArea.ChatPlugins,
                icon: "🧩",
                description: Locale.NextChat.ChatArea.PluginDesc,
                children: [
                  {
                    key: "3-1",
                    label: Locale.NextChat.ChatArea.EnablePlugin,
                    icon: <PluginIcon style={{ transform: "rotate(45deg)", scale: "1.15" }} />
                  }
                ]
              },
            ]}
            onItemClick={(info) => {
              switch (info.data.key) {
                case "1-1":
                  uploadFile(chatStore)
                  break
              }
            }}
            wrap
            styles={{
              item: {
                flex: 'none',
                width: 'calc(33% - 6px)',
                border: 0,
              },
            }}
          />}
          <Sender
            onSubmit={(msg) => {
              setUserInput("")
              doSubmit(msg)
            }}
            value={userInput}
            onChange={(v) => {
              setUserInput(v)
            }}
            header={<Sender.Header open={showMoreOptions} onOpenChange={()=>{setShowMoreOptions(!showMoreOptions)}}>

            </Sender.Header>}
            prefix={<Button icon={showMoreOptions?<DownOutlined />:<AddIcon/>} type="default" shape="circle" onClick={()=>{setShowMoreOptions(!showMoreOptions)}}/>}
          />
        </Flex>
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

  useEffect(()=>{
    if(!hadMadeNewChat&&chatStore.sessions[0].messages.length>0){
      chatStore.newSession()
    }
    hadMadeNewChat = true
    // if(chatStore.sessions[0].messages.length=0&&chatStore.sessions[0].topic.length>0){
    //   chatStore.sessions[0].lastUpdate = Date.now()
    // }
  })

  return <_Chat key={sessionIndex} />

  // return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: isRtlLang() ? "row-reverse" : "row" }}>
  //   <div>
  //     <SideBar />
  //   </div>
  //   <div style={{ flex: 1 }}>
  //     <_Chat key={sessionIndex} />
  //   </div>
  // </div>
}
