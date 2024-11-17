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
// import BrainIcon from "../icons/brain.svg";
// import RenameIcon from "../icons/rename.svg";
// import ExportIcon from "../icons/share.svg";
import ReturnIcon from "../icons/bootstrap/arrow-return-left.svg";
import CopyIcon from "../icons/bootstrap/copy.svg";
// import LoadingIcon from "../icons/three-dots.svg";
// import LoadingButtonIcon from "../icons/loading.svg";
// import PromptIcon from "../icons/prompt.svg";
// import MaskIcon from "../icons/mask.svg";
// import MaxIcon from "../icons/max.svg";
// import MinIcon from "../icons/min.svg";
import ResetIcon from "../icons/bootstrap/repeat.svg";
import BreakIcon from "../icons/bootstrap/file-break.svg";
// import SettingsIcon from "../icons/chat-settings.svg";
import DeleteIcon from "../icons/bootstrap/trash3.svg";
// import PinIcon from "../icons/pin.svg";
// import EditIcon from "../icons/rename.svg";
// import ConfirmIcon from "../icons/confirm.svg";
// import CancelIcon from "../icons/cancel.svg";
// import ImageIcon from "../icons/image.svg";
import MagicIcon from "../icons/bootstrap/magic.svg"
// import LightIcon from "../icons/light.svg";
// import DarkIcon from "../icons/dark.svg";
// import AutoIcon from "../icons/auto.svg";
// import BottomIcon from "../icons/bottom.svg";
import StopIcon from "../icons/bootstrap/pause-circle.svg";
import RobotIcon from "../icons/bootstrap/robot.svg";
// import UploadImageIcon from "../icons/bootstrap/image.svg"
import UploadFileIcon from "../icons/bootstrap/file-richtext.svg"
import MoreIcon from "../icons/bootstrap/plus-lg.svg"
import RolePlayIcon from "../icons/bootstrap/layout-wtf.svg"
// import KnowledgeDBIcon from "../icons/bootstrap/server.svg"
// import EnahnceIcon from "../icons/bootstrap/stars.svg"

// import TxtIcon from "../icons/file-icon-vectors/classic/txt.svg"
// import DocIcon from "../icons/file-icon-vectors/doc.svg"
// import PPTIcon from "../icons/file-icon-vectors/ppt.svg"
// import HTMLIcon from "../icons/file-icon-vectors/classic/html.svg"
// import PDFIcon from "../icons/file-icon-vectors/pdf.svg"

import UserIcon from "../icons/bootstrap/person.svg"
import AssistantIcon from "../icons/bootstrap/robot.svg"
import SystemIcon from "../icons/bootstrap/gear.svg"

// import { v4 as uuidv4 } from 'uuid';

import {
  SubmitKey,
  useChatStore,
  BOT_HELLO,
  useAccessStore,
  // Theme,
  useAppConfig,
  // DEFAULT_TOPIC,
  // ModelType,
} from "../store";

import {
  // copyToClipboard,
  // selectOrCopy,
  autoGrowTextArea,
  useMobileScreen,
  //getMessageTextContent,
  //getMessageImages,
  // isVisionModel,
} from "../utils";

// import { compressImage } from "@/app/utils/chat";

// import dynamic from "next/dynamic";

// import { ChatControllerPool } from "../client/controller";
// import { Prompt, usePromptStore } from "../store/prompt";
import Locale from "../locales";

// import { IconButton } from "../components/button";
import styles from "../components/chat.module.scss";

import {
  // Modal,
  // Select,
  // Selector,
  // showPrompt,
  showToast,
} from "../components/ui-lib";
import { useNavigate } from "react-router-dom";
import {
  CHAT_PAGE_SIZE,
  DEFAULT_SYSTEM_TEMPLATE,
  // LAST_INPUT_KEY,
  // Path,
  // REQUEST_TIMEOUT_MS,
  // UNFINISHED_INPUT,
} from "../constant";
// import { ContextPrompts, MaskAvatar, MaskConfig } from "../components/mask";
// import { ChatCommandPrefix, useChatCommand, useCommand } from "../command";
// import { ExportMessageModal } from "../components/exporter";
// import { getClientConfig } from "../config/client";
// import { useAllModels } from "../utils/hooks";
import { Message, MessageElement, revokeMessage} from "../message/Message";

// import btnstyles from "../components/button.module.scss";
// import { contentOfVecDB, createVecDB, deleteVecDB, insertIntoVecDB, queryVecDBs } from "../utils/vectordb";
import { Avatar, Button, ButtonCard, ButtonGroup, InfoCard, List, ListItem, MessageCard, showConfirm, TextArea, TinyButton } from "../themes/theme";
import { Card, grid, SimpleGrid } from "@chakra-ui/react";
// import emoji from "../emoji.json"
// import { title } from "process";
// import { readDoc, readHTML, readPDF, readTxt } from "../utils/readfile";
// import { chunkFile, resizeImage } from "./nextchat/misc";
// import { MarkdownMessage } from "../message/TextMessage";
// import { ImageMessage } from "../message/ImageMessage";
// import { nanoid } from "nanoid";
// import { DocumentMessage } from "../message/DocumentMessage";
import { ControllablePromise } from "../utils/controllable-promise";
import { Live2D } from "./nextchat/Live2D";
// import { wrapFunction } from "../client/function-call";
// import { Markdown } from "../components/markdown";
import { PluginMenu } from "./nextchat/plugins";
import { UploadFile } from "./nextchat/fileUpload";
// import ReactDOM from "react-dom";
import { DocxButton, PDFButton } from "./document-docx";
import { AudioButton } from "./audio";
import { ClientApi } from "../client/api";
import { runPyodide } from "../utils/pyodide";
import { SelectPromptModal } from "./nextchat/mask";

// const Markdown = dynamic(async () => (await import("../components/markdown")).Markdown, {
//   loading: () => <LoadingIcon />,
// });

// export function SessionConfigModel(props: { onClose: () => void }) {
//   const chatStore = useChatStore();
//   const session = chatStore.currentSession();
//   const maskStore = useMaskStore();
//   const navigate = useNavigate();

//   return (
//     <div className="modal-mask">
//       <Modal
//         title={Locale.Context.Edit}
//         onClose={() => props.onClose()}
//         actions={[
//           <IconButton
//             key="reset"
//             icon={<ResetIcon />}
//             bordered
//             text={Locale.Chat.Config.Reset}
//             onClick={async () => {
//               if (await showConfirm("", <>{Locale.Memory.ResetConfirm}</>)) {
//                 chatStore.updateCurrentSession(
//                   (session) => (session.memoryPrompt = ""),
//                 );
//               }
//             }}
//           />,
//           <IconButton
//             key="copy"
//             icon={<CopyIcon />}
//             bordered
//             text={Locale.Chat.Config.SaveAs}
//             onClick={() => {
//               navigate(Path.Masks);
//               setTimeout(() => {
//                 maskStore.create(session.mask);
//               }, 500);
//             }}
//           />,
//         ]}
//       >
//         <MaskConfig
//           mask={session.mask}
//           updateMask={(updater) => {
//             const mask = { ...session.mask };
//             updater(mask);
//             chatStore.updateCurrentSession((session) => (session.mask = mask));
//           }}
//           shouldSyncFromGlobal
//           extraListItems={
//             session.mask.modelConfig.sendMemory ? (
//               <ListItem
//                 //className="copyable"
//                 title={`${Locale.Memory.Title} (${session.lastSummarizeIndex} of ${session.messages.length})`}
//                 subTitle={session.memoryPrompt || Locale.Memory.EmptyContent}
//               ></ListItem>
//             ) : (
//               <></>
//             )
//           }
//         ></MaskConfig>
//       </Modal>
//     </div>
//   );
// }

// function PromptToast(props: {
//   showToast?: boolean;
//   showModal?: boolean;
//   setShowModal: (_: boolean) => void;
// }) {
//   const chatStore = useChatStore();
//   const session = chatStore.currentSession();
//   const context = session.mask.context;

//   return (
//     <div className={styles["prompt-toast"]} key="prompt-toast">
//       {props.showToast && (
//         <div
//           className={styles["prompt-toast-inner"] + " clickable"}
//           role="button"
//           onClick={() => props.setShowModal(true)}
//         >
//           <BrainIcon />
//           <span className={styles["prompt-toast-content"]}>
//             {Locale.Context.Toast(context.length)}
//           </span>
//         </div>
//       )}
//       {props.showModal && (
//         <SessionConfigModel onClose={() => props.setShowModal(false)} />
//       )}
//     </div>
//   );
// }

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

// export type RenderPompt = Pick<Prompt, "title" | "content">;

// export function PromptHints(props: {
//   prompts: RenderPompt[];
//   onPromptSelect: (prompt: RenderPompt) => void;
// }) {
//   const noPrompts = props.prompts.length === 0;
//   const [selectIndex, setSelectIndex] = useState(0);
//   const selectedRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setSelectIndex(0);
//   }, [props.prompts.length]);

//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (noPrompts || e.metaKey || e.altKey || e.ctrlKey) {
//         return;
//       }
//       // arrow up / down to select prompt
//       const changeIndex = (delta: number) => {
//         e.stopPropagation();
//         e.preventDefault();
//         const nextIndex = Math.max(
//           0,
//           Math.min(props.prompts.length - 1, selectIndex + delta),
//         );
//         setSelectIndex(nextIndex);
//         selectedRef.current?.scrollIntoView({
//           block: "center",
//         });
//       };

//       if (e.key === "ArrowUp") {
//         changeIndex(1);
//       } else if (e.key === "ArrowDown") {
//         changeIndex(-1);
//       } else if (e.key === "Enter") {
//         const selectedPrompt = props.prompts.at(selectIndex);
//         if (selectedPrompt) {
//           props.onPromptSelect(selectedPrompt);
//         }
//       }
//     };

//     window.addEventListener("keydown", onKeyDown);

//     return () => window.removeEventListener("keydown", onKeyDown);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [props.prompts.length, selectIndex]);

//   if (noPrompts) return null;
//   return (
//     <div className={styles["prompt-hints"]}>
//       {props.prompts.map((prompt, i) => (
//         <div
//           ref={i === selectIndex ? selectedRef : null}
//           className={
//             styles["prompt-hint"] +
//             ` ${i === selectIndex ? styles["prompt-hint-selected"] : ""}`
//           }
//           key={prompt.title + i.toString()}
//           onClick={() => props.onPromptSelect(prompt)}
//           onMouseEnter={() => setSelectIndex(i)}
//         >
//           <div className={styles["hint-title"]}>{prompt.title}</div>
//           <div className={styles["hint-content"]}>{prompt.content}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function ClearContextDivider() {
//   const chatStore = useChatStore();

//   return (
//     <div
//       className={styles["clear-context"]}
//       onClick={() =>
//         chatStore.updateCurrentSession(
//           (session) => (session.clearContextIndex = undefined),
//         )
//       }
//     >
//       <div className={styles["clear-context-tips"]}>{Locale.Context.Clear}</div>
//       <div className={styles["clear-context-revert-btn"]}>
//         {Locale.Context.Revert}
//       </div>
//     </div>
//   );
// }

// function ChatAction(props: {
//   text: string;
//   icon: JSX.Element;
//   onClick: () => void;
// }) {
//   const iconRef = useRef<HTMLDivElement>(null);
//   const textRef = useRef<HTMLDivElement>(null);
//   const [width, setWidth] = useState({
//     full: 16,
//     icon: 16,
//   });

//   function updateWidth() {
//     if (!iconRef.current || !textRef.current) return;
//     const getWidth = (dom: HTMLDivElement) => dom.getBoundingClientRect().width;
//     const textWidth = getWidth(textRef.current);
//     const iconWidth = getWidth(iconRef.current);
//     setWidth({
//       full: textWidth + iconWidth,
//       icon: iconWidth,
//     });
//   }

//   return (
//     <div
//       className={`${styles["chat-input-action"]} clickable`}
//       onClick={() => {
//         props.onClick();
//         setTimeout(updateWidth, 1);
//       }}
//       onMouseEnter={updateWidth}
//       onTouchStart={updateWidth}
//       style={
//         {
//           "--icon-width": `${width.icon}px`,
//           "--full-width": `${width.full}px`,
//         } as React.CSSProperties
//       }
//     >
//       <div ref={iconRef} className={styles["icon"]}>
//         {props.icon}
//       </div>
//       <div className={styles["text"]} ref={textRef}>
//         {props.text}
//       </div>
//     </div>
//   );
// }

// function StaticChatAction(props: {
//   text: string;
//   icon: JSX.Element;
//   onClick: () => void;
// }) {
//   const iconRef = useRef<HTMLDivElement>(null);
//   const textRef = useRef<HTMLDivElement>(null);

//   function getWidth() {
//     if (!iconRef.current || !textRef.current) return 16;
//     const getWidth = (dom: HTMLDivElement) => dom.getBoundingClientRect().width;
//     const textWidth = getWidth(textRef.current);
//     const iconWidth = getWidth(iconRef.current);
//     return textWidth + iconWidth
//   }
//   return (
//     <div
//       className={`${styles["chat-input-action"]} clickable`}
//       onClick={() => {
//         props.onClick();
//       }}
//       style={{width:getWidth()}}
//     >
//       <div ref={iconRef} className={styles["icon"]}>
//         {props.icon}
//       </div>
//       <div className={styles["text"]} ref={textRef} style={{transform:"none", transition:"none", opacity:"initial"}}>
//         {props.text}
//       </div>
//     </div>
//   );
// }

// function FragmentChatAction(props: {
//   text: string;
//   icon: JSX.Element;
//   onClick: () => void;
// }) {
//   const iconRef = useRef<HTMLDivElement>(null);
//   const textRef = useRef<HTMLDivElement>(null);

//   function getWidth() {
//     if (!iconRef.current || !textRef.current) return 16;
//     const getWidth = (dom: HTMLDivElement) => dom.getBoundingClientRect().width;
//     const textWidth = getWidth(textRef.current);
//     const iconWidth = getWidth(iconRef.current);
//     return textWidth + iconWidth
//   }

//   return (
//     <div
//       className={`${styles["chat-input-action"]} clickable`}
//       onClick={() => {
//         props.onClick();
//       }}
//       style={{width:getWidth(), border:"none", boxShadow:"none"}}
//     >
//       <div ref={iconRef} className={styles["icon"]}>
//         {props.icon}
//       </div>
//       <div className={styles["text"]} ref={textRef} style={{transform:"none", transition:"none", opacity:"initial", fontSize:"12px"}}>
//         {props.text}
//       </div>
//     </div>
//   );
// }

// export function ToolboxButton(props: {
//   onClick?: () => void;
//   icon?: JSX.Element;
//   text?: string;
//   bordered?: boolean;
//   shadow?: boolean;
//   className?: string;
//   title?: string;
//   disabled?: boolean;
//   tabIndex?: number;
//   autoFocus?: boolean;
// }) {
//   return (
//     <button
//       className={
//         btnstyles["icon-button"] +
//         ` ${false&&btnstyles.border} ${props.shadow && btnstyles.shadow} ${
//           props.className ?? ""
//         } clickable `
//       }
//       onClick={props.onClick}
//       title={props.title}
//       disabled={props.disabled}
//       role="button"
//       tabIndex={props.tabIndex}
//       autoFocus={props.autoFocus}
//       style={{
//         display:"inline-block",
//         width:"72px",
//         paddingLeft:"0px",
//         paddingRight:"0px",
//         height:"83px"
//       }}
//     >
//       <div
//         style={{
//           textAlign:"center",
//           alignContent:"center",
//           alignItems:"center",
//         }}
//       >
//         {props.icon}
//         <div className={btnstyles["icon-button-text"]}>
//           {props.text}
//         </div>
//       </div>
//     </button>
//   );
// }

function Toolbox(props:{children:any[]}){
  /*const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const [width, setWidth] = useState(0)
  const [buttonWidth, setButtonWidth] = useState(-1)
  // 监听其中一个按钮的宽度作为按钮宽度
  let children = [
    <div key={uuidv4()} ref={buttonRef} style={{display:"inline-block"}}>{props.children[0]}</div>
  ].concat(props.children.slice(1).map(m=><div key={uuidv4()} style={{display:"inline-block"}}>
    {m}
  </div>))

  // 监听组件大小变化
  useEffect(()=>{
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width)
      }
    });
    const buttonResizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if(entry.contentRect.width==0){}
        else if(buttonWidth<0)
          setButtonWidth(entry.contentRect.width)
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if(buttonRef.current){
      buttonResizeObserver.observe(buttonRef.current)
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      if(buttonRef.current){
        buttonResizeObserver.unobserve(buttonRef.current)
      }
    };
  })

  // 等分数组
  function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
    if (chunkSize <= 0) {
      chunkSize=arr.length;
    }
    let result: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  }

  return <div ref={containerRef}>
    {<table style={{width:"100%", textAlign:"center"}}>
      {chunkArray(children, Math.floor(width/buttonWidth)).map((row:any)=>{
        return <tr key={uuidv4()}>
          {row.map((elem:any, idx:number)=>{
            return <td key={uuidv4()}>{elem}</td>
          })}
          {
            //当元素只有一行时，填充剩余列使元素看起来像左对齐
          (()=>{
            let pad:any = []
            for(let i=0;i<Math.min(Math.floor(width/buttonWidth), 32)-row.length;i++){
              pad = pad.concat([<td key={uuidv4()} style={{width:buttonWidth}}/>])
            }
            return pad
          })()}
        </tr>
      })}
    </table>}
  </div>*/

  // 在根节点挂个透明元素，测量其宽度
  // let testButton = document.createElement("div")
  // testButton.style.display = "inline-block"
  // testButton.style.opacity = "0"
  // testButton.style.position = "absolute"
  // testButton.style.padding = "0"
  // testButton.style.margin = "0"
  // testButton.innerHTML = renderToString(props.children[0])
  // document.body.appendChild(testButton)
  // const buttonWidth = testButton.clientWidth
  // testButton.remove()

  // 早知道有现成的我还写个锤子啊（恼）
  return <SimpleGrid templateColumns={`repeat(auto-fill, minmax(${72}px, 1fr))`} gap={4}>
    {props.children.map((elem, idx)=><Card key={idx} background={"#00000000"} shadow={"none"} align={"center"}>
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

// export function ChatActions(props: {
//   uploadImage: () => void;
//   setAttachImages: (images: string[]) => void;
//   setUploading: (uploading: boolean) => void;
//   showPromptModal: () => void;
//   scrollToBottom: () => void;
//   showPromptHints: () => void;
//   hitBottom: boolean;
//   uploading: boolean;
// }) {
//   const config = useAppConfig();
//   const navigate = useNavigate();
//   const chatStore = useChatStore();

//   // switch themes
//   const theme = config.theme;
//   function nextTheme() {
//     const themes = [Theme.Auto, Theme.Light, Theme.Dark];
//     const themeIndex = themes.indexOf(theme);
//     const nextIndex = (themeIndex + 1) % themes.length;
//     const nextTheme = themes[nextIndex];
//     config.update((config) => (config.theme = nextTheme));
//   }

//   // stop all responses
//   const couldStop = ChatControllerPool.hasPending();
//   const stopAll = () => ChatControllerPool.stopAll();

//   // switch model
//   const currentModel = chatStore.currentSession().mask.modelConfig.model;
//   const allModels = useAllModels();
//   const models = useMemo(() => {
//     const filteredModels = allModels.filter((m) => m.available);
//     const defaultModel = filteredModels.find((m) => m.isDefault);

//     if (defaultModel) {
//       const arr = [
//         defaultModel,
//         ...filteredModels.filter((m) => m !== defaultModel),
//       ];
//       return arr;
//     } else {
//       return filteredModels;
//     }
//   }, [allModels]);
//   const [showModelSelector, setShowModelSelector] = useState(false);
//   const [showUploadImage, setShowUploadImage] = useState(false);

//   useEffect(() => {
//     const show = isVisionModel(currentModel);
//     setShowUploadImage(show);
//     if (!show) {
//       props.setAttachImages([]);
//       props.setUploading(false);
//     }

//     // if current model is not available
//     // switch to first available model
//     const isUnavaliableModel = !models.some((m) => m.name === currentModel);
//     if (isUnavaliableModel && models.length > 0) {
//       // show next model to default model if exist
//       let nextModel: ModelType = (
//         models.find((model) => model.isDefault) || models[0]
//       ).name;
//       chatStore.updateCurrentSession(
//         (session) => (session.mask.modelConfig.model = nextModel),
//       );
//       showToast(nextModel);
//     }
//   }, [chatStore, currentModel, models]);

//   return (
//     <div className={styles["chat-input-actions"]}>
//       {couldStop && (
//         <ChatAction
//           onClick={stopAll}
//           text={Locale.Chat.InputActions.Stop}
//           icon={<StopIcon />}
//         />
//       )}
//       {!props.hitBottom && (
//         <ChatAction
//           onClick={props.scrollToBottom}
//           text={Locale.Chat.InputActions.ToBottom}
//           icon={<BottomIcon />}
//         />
//       )}
//       {props.hitBottom && (
//         <ChatAction
//           onClick={props.showPromptModal}
//           text={Locale.Chat.InputActions.Settings}
//           icon={<SettingsIcon />}
//         />
//       )}

//       {showUploadImage && (
//         <ChatAction
//           onClick={props.uploadImage}
//           text={Locale.Chat.InputActions.UploadImage}
//           icon={props.uploading ? <LoadingButtonIcon /> : <ImageIcon />}
//         />
//       )}
//       <ChatAction
//         onClick={nextTheme}
//         text={Locale.Chat.InputActions.Theme[theme]}
//         icon={
//           <>
//             {theme === Theme.Auto ? (
//               <AutoIcon />
//             ) : theme === Theme.Light ? (
//               <LightIcon />
//             ) : theme === Theme.Dark ? (
//               <DarkIcon />
//             ) : null}
//           </>
//         }
//       />

//       <ChatAction
//         onClick={props.showPromptHints}
//         text={Locale.Chat.InputActions.Prompt}
//         icon={<PromptIcon />}
//       />

//       <ChatAction
//         onClick={() => {
//           navigate(Path.Masks);
//         }}
//         text={Locale.Chat.InputActions.Masks}
//         icon={<MaskIcon />}
//       />

//       <ChatAction
//         text={Locale.Chat.InputActions.Clear}
//         icon={<BreakIcon />}
//         onClick={() => {
//           chatStore.updateCurrentSession((session) => {
//             if (session.clearContextIndex === session.messages.length) {
//               session.clearContextIndex = undefined;
//             } else {
//               session.clearContextIndex = session.messages.length;
//               session.memoryPrompt = ""; // will clear memory
//             }
//           });
//         }}
//       />

//       <ChatAction
//         onClick={() => setShowModelSelector(true)}
//         text={currentModel}
//         icon={<RobotIcon />}
//       />

//       {showModelSelector && (
//         <Selector
//           defaultSelectedValue={currentModel}
//           items={models.map((m) => ({
//             title: m.displayName,
//             value: m.name,
//           }))}
//           onClose={() => setShowModelSelector(false)}
//           onSelection={(s) => {
//             if (s.length === 0) return;
//             chatStore.updateCurrentSession((session) => {
//               session.mask.modelConfig.model = s[0] as ModelType;
//               session.mask.syncGlobalConfig = false;
//             });
//             showToast(s[0]);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export function EditMessageModal(props: { onClose: () => void }) {
//   const chatStore = useChatStore();
//   const session = chatStore.currentSession();
//   const [messages, setMessages] = useState(session.messages.slice());

//   return (
//     <div className="modal-mask">
//       <Modal
//         title={Locale.Chat.EditMessage.Title}
//         onClose={props.onClose}
//         actions={[
//           <IconButton
//             text={Locale.UI.Cancel}
//             icon={<CancelIcon />}
//             key="cancel"
//             onClick={() => {
//               props.onClose();
//             }}
//           />,
//           <IconButton
//             type="primary"
//             text={Locale.UI.Confirm}
//             icon={<ConfirmIcon />}
//             key="ok"
//             onClick={() => {
//               chatStore.updateCurrentSession(
//                 (session) => (session.messages = messages),
//               );
//               props.onClose();
//             }}
//           />,
//         ]}
//       >
//         <List>
//           <ListItem
//             title={Locale.Chat.EditMessage.Topic.Title}
//             subTitle={Locale.Chat.EditMessage.Topic.SubTitle}
//           >
//             <input
//               type="text"
//               value={session.topic}
//               onInput={(e) =>
//                 chatStore.updateCurrentSession(
//                   (session) => (session.topic = e.currentTarget.value),
//                 )
//               }
//             ></input>
//           </ListItem>
//         </List>
//         <ContextPrompts
//           context={messages}
//           updateContext={(updater) => {
//             const newMessages = messages.slice();
//             updater(newMessages);
//             setMessages(newMessages);
//           }}
//         />
//       </Modal>
//     </div>
//   );
// }

// export function DeleteImageButton(props: { deleteImage: () => void }) {
//   return (
//     <div className={styles["delete-image"]} onClick={props.deleteImage}>
//       <DeleteIcon />
//     </div>
//   );
// }

function _Chat() {
  type RenderMessage = Message & { preview?: boolean };

  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const config = useAppConfig();
  // const fontSize = config.fontSize;
  // const [showExport, setShowExport] = useState(false);

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
  // const [attachImages, setAttachImages] = useState<string[]>([]);
  // const [uploading, setUploading] = useState(false);

  const [useSmart, setUseSmart] = useState(false)
  const changeModelIcon = <div style={{ position: "relative"}}>
    <RobotIcon style={{ fill: (useSmart ? "#FFFB2B" : "#1D93AB"), opacity: "0.8" }} />
    <div style={{
      position: "absolute",
      right: useSmart?-8:-16,
      bottom: -8,
      background: "#0007",
      borderRadius: 1000,
      fontSize: 10,
      color: "white",
      fontStyle:"initial"
    }}>&nbsp;&nbsp;{useSmart ? "4" : "3.5"}&nbsp;&nbsp;</div>
  </div>
  const changeModel = () => {
    showToast(`已切换至${!useSmart ? "高级" : "普通"}模型`)
    setUseSmart(!useSmart)
  }

  // prompt hints
  // const promptStore = usePromptStore();
  // const [promptHints, setPromptHints] = useState<RenderPompt[]>([]);
  // const onSearch = useDebouncedCallback(
  //   (text: string) => {
  //     const matchedPrompts = promptStore.search(text);
  //     setPromptHints(matchedPrompts);
  //   },
  //   100,
  //   { leading: true, trailing: true },
  // );

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

  // chat commands shortcuts
  // const chatCommands = useChatCommand({
  //   new: () => chatStore.newSession(),
  //   newm: () => navigate(Path.NewChat),
  //   prev: () => chatStore.nextSession(-1),
  //   next: () => chatStore.nextSession(1),
  //   clear: () =>
  //     chatStore.updateCurrentSession(
  //       (session) => (session.clearContextIndex = session.messages.length),
  //     ),
  //   del: () => chatStore.deleteSession(chatStore.currentSessionIndex),
  // });

  // only search prompts when user input is short
  // const SEARCH_TEXT_LIMIT = 30;
  const onInput = (text: string) => {
    setUserInput(text);
    // const n = text.trim().length;

    // // clear search results
    // if (n === 0) {
    //   setPromptHints([]);
    // } else if (text.startsWith(ChatCommandPrefix)) {
    //   setPromptHints(chatCommands.search(text));
    // } else if (!config.disablePromptHint && n < SEARCH_TEXT_LIMIT) {
    //   // check if need to trigger auto completion
    //   if (text.startsWith("/")) {
    //     let searchText = text.slice(1);
    //     onSearch(searchText);
    //   }
    // }
  };

  // const [toolCallRequest, setToolCallRequest] = useState(undefined as undefined | string)
  // const [toolCallResponse, setToolCallResponse] = useState(undefined as undefined | string)

  const [searchPlugin, setSearchPlugin] = useState(false)
  const [paintPlugin, setPaintPlugin] = useState(false)
  const [scriptPlugin, setScriptPlugin] = useState(false)

  const tools = (appendMessage:(message:Message)=>void)=>[
    // {
    //   function: function getImageDescription(imageFileName, prompt){
    //     return new Promise(async (resolve)=>{
    //       for(let msg of session.messages){
    //         if(msg.type=="image"){
    //           if(msg.content.includes(imageFileName)){
    //             var src = await getFromSessionIDB((msg as ImageMessage).sessonId, msg.id)
    //             function dataURLtoFile(dataurl, filename) {
    //               const arr = dataurl.split(',');
    //               const mime = arr[0].match(/:(.*?);/)[1];
    //               const bstr = atob(arr[1]);
    //               let n = bstr.length;
    //               const u8arr = new Uint8Array(n);
    //               while(n--){
    //                   u8arr[n] = bstr.charCodeAt(n);
    //               }
    //               const blob = new Blob([u8arr], {type:mime});
    //               return new File([blob], filename, {
    //                   type: mime,
    //                   lastModified: Date.now()
    //               });
    //             }
    //             setToolCallRequest(`图片文件：${imageFileName}\n要求：${prompt}`)
    //             var ret = await ClientApi.caption(dataURLtoFile(src, ""), prompt ,(msg)=>{
    //               setToolCallResponse(msg)
    //             })
    //             setToolCallRequest(undefined)
    //             setToolCallResponse(undefined)
    //             resolve(ret)
    //           }
    //         }
    //       }
    //       resolve("错误的文件名！")
    //     })
    //   },
    //   description: {
    //     function: "调用一个视觉多模态模型，获取对图片的描述。你可以在历史记录中看到用户都上传过哪些图片。如果需要的话，你可以多次调用这个函数，直至能做出令人满意的答复",
    //     params:{
    //       imageFileName: "图片的文件名",
    //       prompt: "你对图片内容的询问。这是一个相对智能的模型，你可以问一些更复杂的问题"
    //     }
    //   }
    // },
    // {
    //   function: function getContent(fileName, prompt){
    //     return new Promise(async resolve=>{
    //       for(let msg of session.messages){
    //         if(msg.type=="document"&&(msg as DocumentMessage).content.includes(fileName)){
    //           var src = await getFromSessionIDB((msg as DocumentMessage).sessionId, msg.id)
    //           const blob = new Blob([src]);
    //           const file = new File([blob], fileName, {
    //             lastModified: Date.now()
    //           });
    //           let text = ""
    //           if(file.name.endsWith(".doc") || file.name.endsWith(".docx")){
    //               text =await readDoc(file)
    //           }else if(file.name.endsWith(".pdf")){
    //               text =await readPDF(file)
    //           }else if(file.name.endsWith(".htm") || file.name.endsWith(".html") || file.name.endsWith(".mhtml")){
    //               text =await readHTML(file)
    //           }else{
    //               text = await readTxt(file)
    //           }
    //           setToolCallRequest(`文件：${fileName}\n要求：${prompt}`)
    //           let content = await ClientApi.chat(
    //             [
    //               new MarkdownMessage("system", "你是一个能回答文档问题的智能助手。你总是会有针对性地输出简短扼要的回答。"),
    //               new MarkdownMessage("system", text),
    //               new MarkdownMessage("user", prompt)
    //             ],
    //             (msg)=>{
    //               setToolCallResponse(msg)
    //             },
    //             {
    //               model:"long"
    //             }
    //           )
    //           setToolCallRequest(undefined)
    //           setToolCallResponse(undefined)
    //           resolve(content)
    //         }
    //       }
    //       resolve("错误的文件名！")
    //     })
    //   },
    //   description:{
    //     function: "获取文件内容。你可以在历史记录中看到用户都上传过哪些文件",
    //     params:{
    //       fileName: "文件名",
    //       prompt:"你对文件内容的询问。这是一个相对智能的模型，你可以问一些更复杂的问题。为了避免过长的输出，请问有针对性的问题，避免浪费额度"
    //     }
    //   }
    // },
    // {
    //   function: function runJavaScript(code){
    //     return new Promise(async resolve=>{
    //       const log = console.log
    //       var output = ""
    //       console.log = (content)=>{output+=JSON.stringify(content)+"\n"}
    //       try{
    //         eval(code)
    //       }catch(e){
    //         console.log = log
    //         resolve(JSON.stringify(e))
    //       }
    //       console.log = log
    //       resolve(output)
    //     })
    //   },
    //   description:{
    //     function: "运行js脚本。如果出现了报错，请修正代码，然后再重新执行。",
    //     params:{
    //       code: "一段js脚本。输出请使用console.log"
    //     }
    //   }
    // },
    ...(scriptPlugin ? [
      {
          function: async function runPythonScript(code) {
              try{
                  return await new Promise(async resolve=>{
                    return runPyodide(pyodide=>{
                      const result = pyodide.runPython(code)
                      resolve(result)
                    }) 
                  })
              }catch(e){
                  return JSON.stringify(e)
              }
          },
          description: {
              function: "执行python脚本",
              params: {
                  code: "你要执行的python代码。很抱歉，我们暂时不支持pip包。"
              }
          }
      }
  ] : []),
    // {
    //   function: function calculator(formula){
    //     return new Promise(async resolve=>{
    //       resolve("计算结果是"+await runPython(formula))
    //     })
    //   },
    //   description:{
    //     function: "计算器",
    //     params:{
    //       code: "一个python风格的算式"
    //     }
    //   }
    // },
    // {
    //   function: function pip(packageName){
    //     return new Promise(async resolve=>{
    //       resolve("Unimplemented!")
    //     })
    //   },
    //   description:{
    //     function: "用来给本地的python运行时安装pip包，安装后的pip包会被保存在本地，能够随时调用。如果你需要某个pip包，调用这个函数安装。不保证支持所有pip包。",
    //     params:{
    //       packageName:"pip包的名称"
    //     }
    //   }
    // },
    ...(searchPlugin ? [
      {
          function: function web(query) {
              return ClientApi.search(query, 8, 0);
          },
          description: {
              function: "查询网络信息，你可以用这个来访问搜索引擎",
              params: {
                  query: "你要查找的关键词"
              }
          }
      }
  ] : []),
  ...(paintPlugin ? [
    {
        function: async function drawImage(prompt) {
            const img = await ClientApi.paint(prompt) as string
            appendMessage({type:"image", role:"assistant", src:img, content:prompt})
            return "图片画好了，已经展示给用户了，剩下的你就不用管了"
        },
        description: {
            function: "绘制图画",
            params: {
                prompt: "提示词，按照stable diffusion的格式"
            }
        }
    }
] : []),
    // {
    //   function: function getChatHistory(query){
    //     return new Promise(async resolve=>{
    //       resolve("Unimplemented!")
    //     })
    //   },
    //   description:{
    //     keywords: "询问历史对话当中的信息",
    //     params:{
    //       query:"想问的内容。为了避免过长的输出，请问有针对性的问题，避免浪费额度。"
    //     }
    //   }
    // }
  ]

  // async function doEnhancedGeneration(input:string){
  //   // 这是一个很简陋的试验品，需要优化。不排除移除的可能
  //   if (input.trim() === "") {return;}
  //   setUserInput("");
  //   setIsLoading(true);
  //   chatStore.onUserInput(
  //     `用户输入内容：${input}\n请你根据用户输入的请求，拟定回答时的要点。输出内容应当简短，以回答纲要和关键信息为重点`,
  //     attachImages,
  //     (session.prompt??"")+(getActivatedVecDBs().length>0?
  //         `作为一个智能助手🤖，你有能力💪访问🔍知识库📚，从而获得最新信息📰或用户自定义知识📖。以下为从知识库📚请求所得信息📋：${
  //           JSON.stringify(await queryVecDBs(getActivatedVecDBs(), input, 4, 0))
  //         }`
  //     :""),
  //     useSmart
  //   ).then(async ()=>{
  //     setIsLoading(false);
  //     chatStore.onUserInput(
  //       `现在，请依据你生成的要点，回答用户问题`,
  //       attachImages,
  //       (session.prompt??""),
  //       useSmart
  //     )
  //     setAttachImages([]);
  //     localStorage.setItem(LAST_INPUT_KEY, userInput);
  //     setPromptHints([]);
  //     if (!isMobileScreen) inputRef.current?.focus();
  //     setAutoScroll(true);
  //   })
  // }

  const [chatPromise, setChatPromise] = useState(undefined as ControllablePromise<any> | undefined)

  const doSubmit = (userInput: string) => {
    let _messages = session.messages.slice()
    _messages = _messages.concat([{ type: "text", role: "user", content: userInput }])
    chatStore.updateCurrentSession(sess=>{
      sess.messages = [
        ..._messages,
        { type: "text", role: "assistant", content: "" }
      ]
    })
    const promise = ClientApi.chat(
      [
        {type:"text", role:"system", content:DEFAULT_SYSTEM_TEMPLATE},
        ..._messages
      ],
      msg=>{
        chatStore.updateCurrentSession(sess=>{
          sess.messages = [
            ..._messages,
            { type: "text", role: "assistant", content: msg }
          ]
        })
      },
      {
        model: useSmart?"smart":"regular",
        tools: tools((m)=>{_messages.push(m)})
      }
    )
    setChatPromise(promise)
    promise.then((msg)=>{
      setChatPromise(undefined)
      chatStore.updateCurrentSession(sess=>{
      sess.messages = [
          ..._messages,
          { type: "text", role: "assistant", content: msg }
        ]
      })
    })
    setUserInput("");
  }

  // const doSubmit = (userInput: string) => {

  //   if(useEnhancedGeneration){
  //     doEnhancedGeneration(userInput)
  //     return
  //   }

  //   if (userInput.trim() === "") return;
  //   const matchCommand = chatCommands.match(userInput);
  //   if (matchCommand.matched) {
  //     setUserInput("");
  //     setPromptHints([]);
  //     matchCommand.invoke();
  //     return;
  //   }
  //   //setIsLoading(true);
  //   /*chatStore
  //     .onUserInput(userInput, attachImages, prompt, useSmart)
  //     .then(() => setIsLoading(false));*/
  //   (async ()=>{
  //     setChatPromise(chatStore.onUserInput(
  //       userInput, 
  //       attachImages, 
  //       (session.prompt??"")+(getActivatedVecDBs().length>0?
  //         `作为一个智能助手，你有能力访问知识库，从而获得最新信息或用户自定义知识。以下为从知识库请求所得信息：${
  //           JSON.stringify(await queryVecDBs(getActivatedVecDBs(), userInput, 4, 0))
  //         }`
  //       :""), 
  //       useSmart,
  //       // tools as any
  //     ))
  //   })()/*.then(() => setIsLoading(false))*/;
  //   setAttachImages([]);
  //   localStorage.setItem(LAST_INPUT_KEY, userInput);
  //   setUserInput("");
  //   setPromptHints([]);
  //   if (!isMobileScreen) inputRef.current?.focus();
  //   setAutoScroll(true);
  // };

  // const onPromptSelect = (prompt: RenderPompt) => {
  //   setTimeout(() => {
  //     setPromptHints([]);

  //     const matchedChatCommand = chatCommands.match(prompt.content);
  //     if (matchedChatCommand.matched) {
  //       // if user is selecting a chat command, just trigger it
  //       matchedChatCommand.invoke();
  //       setUserInput("");
  //     } else {
  //       // or fill the prompt
  //       setUserInput(prompt.content);
  //     }
  //     inputRef.current?.focus();
  //   }, 30);
  // };

  // stop response
  // const onUserStop = (messageId: string) => {
  //   ChatControllerPool.stop(session.id, messageId);
  // };

  // useEffect(() => {
  //   chatStore.updateCurrentSession((session) => {
  //     const stopTiming = Date.now() - REQUEST_TIMEOUT_MS;
  //     session.messages.forEach((m) => {
  //       // check if should stop all stale messages
  //       // if (m.isError || new Date(m.date).getTime() < stopTiming) {
  //       //   if (m.streaming) {
  //       //     m.streaming = false;
  //       //   }

  //       //   if (m.content.length === 0) {
  //       //     m.isError = true;
  //       //     m.content = prettyObject({
  //       //       error: true,
  //       //       message: "empty response",
  //       //     });
  //       //   }
  //       // }
  //     });

  //     // auto sync mask config from global config
  //     if (session.mask.syncGlobalConfig) {
  //       console.log("[Mask] syncing from global, name = ", session.mask.name);
  //       session.mask.modelConfig = { ...config.modelConfig };
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // check if should send message
  // const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   // if ArrowUp and no userInput, fill with last input
  //   if (
  //     e.key === "ArrowUp" &&
  //     userInput.length <= 0 &&
  //     !(e.metaKey || e.altKey || e.ctrlKey)
  //   ) {
  //     setUserInput(localStorage.getItem(LAST_INPUT_KEY) ?? "");
  //     e.preventDefault();
  //     return;
  //   }
  //   if (shouldSubmit(e) && promptHints.length === 0) {
  //     doSubmit(userInput);
  //     e.preventDefault();
  //   }
  // };
  // const onRightClick = (e: any, message: Message) => {
  //   // copy to clipboard
  //   if (selectOrCopy(e.currentTarget, /*getMessageTextContent(message)*/message.content)) {
  //     if (userInput.length === 0) {
  //       setUserInput(/*getMessageTextContent(message)*/message.content);
  //     }

  //     e.preventDefault();
  //   }
  // };

  // const deleteMessage = (msgId?: string) => {
  //   chatStore.updateCurrentSession(
  //     (session) =>
  //       (session.messages = session.messages.filter((m) => m.id !== msgId)),
  //   );
  // };

  // const onDelete = (msgId: string) => {
  //   deleteMessage(msgId);
  // };

  // const onResend = (message: Message) => {
  //   // when it is resending a message
  //   // 1. for a user's message, find the next bot response
  //   // 2. for a bot's message, find the last user's input
  //   // 3. delete original user input and bot's message
  //   // 4. resend the user's input

  //   const resendingIndex = session.messages.findIndex(
  //     (m) => m.id === message.id,
  //   );

  //   if (resendingIndex < 0 || resendingIndex >= session.messages.length) {
  //     console.error("[Chat] failed to find resending message", message);
  //     return;
  //   }

  //   let userMessage: Message | undefined;
  //   let botMessage: Message | undefined;

  //   if (message.role === "assistant") {
  //     // if it is resending a bot's message, find the user input for it
  //     botMessage = message;
  //     for (let i = resendingIndex; i >= 0; i -= 1) {
  //       if (session.messages[i].role === "user") {
  //         userMessage = session.messages[i];
  //         break;
  //       }
  //     }
  //   } else if (message.role === "user") {
  //     // if it is resending a user's input, find the bot's response
  //     userMessage = message;
  //     for (let i = resendingIndex; i < session.messages.length; i += 1) {
  //       if (session.messages[i].role === "assistant") {
  //         botMessage = session.messages[i];
  //         break;
  //       }
  //     }
  //   }

  //   if (userMessage === undefined) {
  //     console.error("[Chat] failed to resend", message);
  //     return;
  //   }

  //   // delete the original messages
  //   deleteMessage(userMessage.id);
  //   deleteMessage(botMessage?.id);

  //   // resend the message
  //   //setIsLoading(true);
  //   const textContent = /*getMessageTextContent(message)*/message.content;
  //   //const images = getMessageImages(userMessage);
  //   chatStore.onUserInput(textContent/*, images*/).then(() => setIsLoading(false));
  //   inputRef.current?.focus();
  // };

  // const onPinMessage = (message: Message) => {
  //   chatStore.updateCurrentSession((session) =>
  //     session.mask.context.push(message),
  //   );

  //   showToast(Locale.Chat.Actions.PinToastContent, {
  //     text: Locale.Chat.Actions.PinToastAction,
  //     onClick: () => {
  //       setShowPromptModal(true);
  //     },
  //   });
  // };

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
              {type:"text", role:"assistant", content:"......"}
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
            {type:"text", role:"user", content:userInput}
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

  // const messages = useMemo(() => {
  //   const endRenderIndex = Math.min(
  //     msgRenderIndex + 3 * CHAT_PAGE_SIZE,
  //     renderMessages.length,
  //   );
  //   return renderMessages.slice(msgRenderIndex, endRenderIndex);
  // }, [msgRenderIndex, renderMessages]);

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
  // function scrollToBottom() {
  //   setMsgRenderIndex(renderMessages.length - CHAT_PAGE_SIZE);
  //   scrollDomToBottom();
  // }

  // clear context index = context length + index in messages
  // const clearContextIndex =
  //   (session.clearContextIndex ?? -1) >= 0
  //     ? session.clearContextIndex! + context.length - msgRenderIndex
  //     : -1;

  // const [showPromptModal, setShowPromptModal] = useState(false);

  // const clientConfig = useMemo(() => getClientConfig(), []);

  const autoFocus = !isMobileScreen; // wont auto focus on mobile screen
  // const showMaxIcon = !isMobileScreen && !clientConfig?.isApp;

  // useCommand({
  //   fill: setUserInput,
  //   submit: (text) => {
  //     doSubmit(text);
  //   },
  //   code: (text) => {
  //     if (accessStore.disableFastLink) return;
  //     console.log("[Command] got code from url: ", text);
  //     showConfirm("", <>{Locale.URLCommand.Code + `code = ${text}`}</>).then((res) => {
  //       if (res) {
  //         accessStore.update((access) => (access.accessCode = text));
  //       }
  //     });
  //   },
  //   settings: (text) => {
  //     if (accessStore.disableFastLink) return;

  //     try {
  //       const payload = JSON.parse(text) as {
  //         key?: string;
  //         url?: string;
  //       };

  //       console.log("[Command] got settings from url: ", payload);

  //       if (payload.key || payload.url) {
  //         showConfirm("", 
  //           <>{Locale.URLCommand.Settings +
  //             `\n${JSON.stringify(payload, null, 4)}`}</>,
  //         ).then((res) => {
  //           if (!res) return;
  //           if (payload.key) {
  //             accessStore.update(
  //               (access) => (access.openaiApiKey = payload.key!),
  //             );
  //           }
  //           if (payload.url) {
  //             accessStore.update((access) => (access.openaiUrl = payload.url!));
  //           }
  //           accessStore.update((access) => (access.useCustomConfig = true));
  //         });
  //       }
  //     } catch {
  //       console.error("[Command] failed to get settings from url: ", text);
  //     }
  //   },
  // });

  // edit / insert message modal
  // const [isEditingMessage, setIsEditingMessage] = useState(false);

  // remember unfinished input
  // useEffect(() => {
  //   // try to load from local storage
  //   const key = UNFINISHED_INPUT(session.id);
  //   const mayBeUnfinishedInput = localStorage.getItem(key);
  //   if (mayBeUnfinishedInput && userInput.length === 0) {
  //     setUserInput(mayBeUnfinishedInput);
  //     localStorage.removeItem(key);
  //   }

  //   const dom = inputRef.current;
  //   return () => {
  //     localStorage.setItem(key, dom?.value ?? "");
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const handlePaste = useCallback(
  //   async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
  //     const currentModel = chatStore.currentSession().mask.modelConfig.model;
  //     if (!isVisionModel(currentModel)) {
  //       return;
  //     }
  //     const items = (event.clipboardData || window.clipboardData).items;
  //     for (const item of items) {
  //       if (item.kind === "file" && item.type.startsWith("image/")) {
  //         event.preventDefault();
  //         const file = item.getAsFile();
  //         if (file) {
  //           const images: string[] = [];
  //           images.push(...attachImages);
  //           images.push(
  //             ...(await new Promise<string[]>((res, rej) => {
  //               setUploading(true);
  //               const imagesData: string[] = [];
  //               compressImage(file, 256 * 1024)
  //                 .then((dataUrl) => {
  //                   imagesData.push(dataUrl);
  //                   setUploading(false);
  //                   res(imagesData);
  //                 })
  //                 .catch((e) => {
  //                   setUploading(false);
  //                   rej(e);
  //                 });
  //             })),
  //           );
  //           const imagesLength = images.length;

  //           if (imagesLength > 3) {
  //             images.splice(3, imagesLength - 3);
  //           }
  //           setAttachImages(images);
  //         }
  //       }
  //     }
  //   },
  //   [attachImages, chatStore],
  // );

  // async function uploadImage() {
  //   const images: string[] = [];
  //   images.push(...attachImages);

  //   images.push(
  //     ...(await new Promise<string[]>((res, rej) => {
  //       const fileInput = document.createElement("input");
  //       fileInput.type = "file";
  //       fileInput.accept =
  //         "image/png, image/jpeg, image/webp, image/heic, image/heif";
  //       fileInput.multiple = true;
  //       fileInput.onchange = (event: any) => {
  //         setUploading(true);
  //         const files = event.target.files;
  //         const imagesData: string[] = [];
  //         for (let i = 0; i < files.length; i++) {
  //           const file = event.target.files[i];
  //           compressImage(file, 256 * 1024)
  //             .then((dataUrl) => {
  //               imagesData.push(dataUrl);
  //               if (
  //                 imagesData.length === 3 ||
  //                 imagesData.length === files.length
  //               ) {
  //                 setUploading(false);
  //                 res(imagesData);
  //               }
  //             })
  //             .catch((e) => {
  //               setUploading(false);
  //               rej(e);
  //             });
  //         }
  //       };
  //       fileInput.click();
  //     })),
  //   );

  //   const imagesLength = images.length;
  //   if (imagesLength > 3) {
  //     images.splice(3, imagesLength - 3);
  //   }
  //   setAttachImages(images);
  // }

  const [showOption, setShowOption] = useState(false);
  function handleShowOption(shown:boolean){
    setShowOption(shown)
  }

  // const [useEnhancedGeneration, setUseEnhancedGeneration] = useState(false)
  // const enhanceGenerationIcon = <EnahnceIcon style={useEnhancedGeneration?{fill:"#1D93AB", opacity:"0.8"}:{}}/>
  // const enhanceGeneration = ()=>{
  //   showToast(`已${useEnhancedGeneration?"关闭":"开启"}增强回答模式`)
  //   setUseEnhancedGeneration(!useEnhancedGeneration)
  // }

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

  // const [isConfiguringVectorDB, setIsConfiguringVectorDB] = useState(false)
  // const setActivatedVecDBs = (vecDBs:string[])=>{
  //   chatStore.updateCurrentSession((session)=>{
  //     session.vectorDBs = vecDBs
  //   })
  // }
  // const getActivatedVecDBs = ()=>{
  //   return chatStore.currentSession().vectorDBs
  // }
  // const configureVectorDBIcon = <div style={{ position: "relative" }}>
  //   <KnowledgeDBIcon style={getActivatedVecDBs().filter(id => id.startsWith("COMMON_VECDB_")).length > 0 ? { fill: "#1D93AB", opacity: "0.8" } : {}} />
  //   {getActivatedVecDBs().filter(id => id.startsWith("COMMON_VECDB_")).length > 0 && <div style={{
  //     position: "absolute",
  //     right: -8,
  //     bottom: -8,
  //     background: "#0007",
  //     borderRadius: 1000,
  //     fontSize: 10,
  //     color: "white",
  //     fontStyle:"initial"
  //   }}>&nbsp;&nbsp;{getActivatedVecDBs().filter(id => id.startsWith("COMMON_VECDB_")).length}&nbsp;&nbsp;</div>}
  // </div>

  // const [isUploadingImage, setIsUploadingImage] = useState(false)

  // const [isUploadingFile, setIsUploadingFile] = useState(false)

  // const [isGeneratingEssay, setIsGeneratingEssay] = useState(false)

  return (
    <>
      <div
        className={styles["chat-body"]}
        ref={scrollRef}
        onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        onMouseDown={() => inputRef.current?.blur()}
        onTouchStart={() => {
          inputRef.current?.blur();
          setAutoScroll(false);
        }}
      >
        {[{type:"text", role:"assistant", content:session.greeting??"有什么我可以帮助您的吗🪄"} as Message].concat(session.messages).map((msg, i) => <Fragment key={i}>
          <div className={msg.role == "user" ? styles["chat-message-user"] : styles["chat-message"]}>
            <div className={styles["chat-message-container"]} style={{paddingBottom:"5px", paddingTop:"5px"}}>
              <div style={{display:"flex", flexDirection:msg.role == "user"?"row-reverse":"row", gap:"10px", alignItems:"center"}}>
                {msg.role == "user" ? (
                  <Avatar icon={<UserIcon />} />
                ) : (msg.role == "system" ? <Avatar icon={<SystemIcon />} /> :
                  <Avatar
                    icon={session.avatar ? <div dangerouslySetInnerHTML={{
                      __html: session.avatar
                    }} /> : <AssistantIcon />}
                  />
                )}
                {i!=0&&<ButtonGroup>
                  <TinyButton
                    text="复制"
                    type="text"
                    icon={<CopyIcon/>}
                  />
                  <TinyButton
                    text="删除"
                    type="text"
                    icon={<DeleteIcon/>}
                    onClick={()=>{
                      chatStore.updateCurrentSession(sess=>{
                        revokeMessage(msg)
                        sess.messages = sess.messages.filter((msg, mi)=>mi!=i-1)
                      })
                    }}
                  />
                  {msg.role=="assistant"&&<TinyButton
                    text="重试"
                    type="text"
                    icon={<ResetIcon/>}
                  />}
                </ButtonGroup>}
              </div>
              <div style={{gap:"6px", display:"flex", flexDirection:"column"}}>
                <MessageCard type={msg.role}>
                  <MessageElement message={msg}/>
                  {/* {msg.streaming && (toolCallRequest || toolCallResponse) &&
                    <><p>&nbsp;</p>
                    <InfoCard
                      title="函数调用"
                    >
                      <Markdown content={toolCallRequest??""}/>
                      <p>&nbsp;</p>
                      <Markdown content={toolCallResponse??""}/>
                    </InfoCard></>
                  } */}
                </MessageCard>
                <div style={{display:"flex", flexDirection:msg.role == "user"?"row-reverse":"row", gap:"10px", alignItems:"center"}}>
                    {msg.streaming&&<TinyButton
                      text="停止"
                      type="primary"
                      icon={<StopIcon/>}
                      onClick={()=>{
                        chatPromise?.abort()
                      }}
                    />}
                </div>
              </div>
            </div>
          </div>
        </Fragment>)}
        {(()=>{`{messages.map((message, i) => {
          const isUser = message.role === "user";
          const isContext = i < context.length;
          const showActions =
            i > 0 &&
            !(message.preview || message.content.length === 0) &&
            !isContext;
          const showTyping = message.preview || message.streaming;

          const shouldShowClearContextDivider = i === clearContextIndex - 1;

          return (
            <Fragment key={message.id}>
              <div
                className={
                  isUser ? styles["chat-message-user"] : styles["chat-message"]
                }
              >
                <div className={styles["chat-message-container"]}>
                  <div className={styles["chat-message-header"]} style={{display:"flex", gap:"12px"}}>
                    <div className={styles["chat-message-avatar"]}>
                      <div className={styles["chat-message-edit"]}>
                        <IconButton
                          icon={<EditIcon />}
                          onClick={async () => {
                            const newMessage = await showPrompt(
                              Locale.Chat.Actions.Edit,
                              /*getMessageTextContent(message)*/message.content,
                              10,
                            );
                            let newContent: string /*| MultimodalContent[]*/ =
                              newMessage;
                            //const images = getMessageImages(message);
                            /*if (images.length > 0) {
                              newContent = [{ type: "text", text: newMessage }];
                              for (let i = 0; i < images.length; i++) {
                                newContent.push({
                                  type: "image_url",
                                  image_url: {
                                    url: images[i],
                                  },
                                });
                              }
                            }*/
                            chatStore.updateCurrentSession((session) => {
                              const m = session.mask.context
                                .concat(session.messages)
                                .find((m) => m.id === message.id);
                              if (m) {
                                m.content = newContent;
                              }
                            });
                          }}
                        ></IconButton>
                      </div>
                      {isUser ? (
                        <Avatar icon={<UserIcon/>} />
                      ) : (
                        <>
                          {["system"].includes(message.role) ? (
                            <Avatar icon={<SystemIcon/>} />
                          ) : (
                            <Avatar
                              icon={session.avatar?<div dangerouslySetInnerHTML={{
                                __html:session.avatar
                              }}/>:<AssistantIcon />}
                            />
                          )}
                        </>
                      )}
                    </div>

                    {!isContext&&<ButtonGroup>
                      {!isUser&&!["system"].includes(message.role)&&<TinyButton
                        text={Locale.Chat.Actions.Retry}
                        icon={<ResetIcon />}
                        onClick={() => onResend(message)}
                        type="text"
                      />}
                      {!isUser&&<TinyButton
                        text={Locale.Chat.Actions.Delete}
                        icon={<DeleteIcon />}
                        onClick={() => onDelete(message.id ?? i)}
                        type="text"
                      />}
                      {/*<TinyButton
                        text={Locale.Chat.Actions.Pin}
                        icon={<PinIcon />}
                        onClick={() => onPinMessage(message)}
                        type="text"
                      />*/}
                      {!["system"].includes(message.role)&&<TinyButton
                        text={Locale.Chat.Actions.Copy}
                        icon={<CopyIcon />}
                        onClick={() =>
                          copyToClipboard(
                            /*getMessageTextContent(message)*/message.content,
                          )
                        }
                        type="text"
                      />}
                    </ButtonGroup>}
                  </div>
                  {showTyping && (
                    <div className={styles["chat-message-status"]}>
                      {isUser?"正在输入":"正在响应"}
                    </div>
                  )}
                  <MessageCard
                    type={(() => {
                      if (isUser) return "user"
                      if (["system"].includes(message.role)) return "system"
                      return "assistant"
                    })()}
                  >
                    {message.element}
                    {
                      // <Markdown
                      //   content={message.content}
                      //   loading={
                      //     (message.preview || message.streaming) &&
                      //     message.content.length === 0 &&
                      //     !isUser
                      //   }
                      //   onContextMenu={(e) => onRightClick(e, message)}
                      //   onDoubleClickCapture={() => {
                      //     if (!isMobileScreen) return;
                      //     setUserInput(/*getMessageTextContent(message)*/message.content);
                      //   }}
                      //   fontSize={fontSize}
                      //   parentRef={scrollRef}
                      //   defaultShow={i >= messages.length - 6}
                      // />
                    }
                    {/*getMessageTextContent(message)*/message.content.length == 1 && (
                      <img
                        className={styles["chat-message-item-image"]}
                        //src={getMessageImages(message)[0]}
                        alt=""
                      />
                    )}
                    {/*getMessageImages(message).length > 1 && (
                      <div
                        className={styles["chat-message-item-images"]}
                        style={
                          {
                            "--image-count": getMessageImages(message).length,
                          } as React.CSSProperties
                        }
                      >
                        {getMessageImages(message).map((image, index) => {
                          return (
                            <img
                              className={
                                styles["chat-message-item-image-multi"]
                              }
                              key={index}
                              src={image}
                              alt=""
                            />
                          );
                        })}
                      </div>
                    )*/}
                  </MessageCard>
                  {message.streaming && <div className={styles["chat-input-actions"]}><TinyButton
                    text={Locale.Chat.Actions.Stop}
                    icon={<StopIcon />}
                    onClick={() => onUserStop(message.id ?? i)}
                    type="text"
                  /></div>}
                  {!message.streaming && <div className={styles["chat-message-action-date"]}>
                    {isContext
                      ? ""
                      : message.date.toLocaleString()}
                  </div>}
                </div>
              </div>
              {shouldShowClearContextDivider && <ClearContextDivider />}
            </Fragment>
          );
        })}`; return <></>})()}
      </div>

      <div className={styles["chat-input-panel"]}
        style={{
          display:"flex",
          gap:"12px"
        }}
      >
        {/*<PromptHints prompts={promptHints} onPromptSelect={onPromptSelect} />*/}

        {/*<ChatActions
          uploadImage={uploadImage}
          setAttachImages={setAttachImages}
          setUploading={setUploading}
          showPromptModal={() => setShowPromptModal(true)}
          scrollToBottom={scrollToBottom}
          hitBottom={hitBottom}
          uploading={uploading}
          showPromptHints={() => {
            // Click again to close
            if (promptHints.length > 0) {
              setPromptHints([]);
              return;
            }

            inputRef.current?.focus();
            setUserInput("/");
            onSearch("");
          }}
        />*/}
        <table>
          <tr>
            <td style={{width:"100%"}}>
            <TinyButton
            onClick={()=>{handleShowOption(!showOption)}}
            text={showOption?"返回":"更多"}
            icon={showOption?<ReturnIcon/>:<MoreIcon/>}
            type={showOption?"primary":undefined}
          />
            </td>
            <td>
              {/**
               * 空间有限，别啥都往这塞
               * 原则上此处只显示标识状态的图标
               */}
              {/* <ButtonGroup>
                {(session.avatar || session.prompt)&&<TinyButton icon={rolePlayIcon} onClick={()=>{setIsSelectingPrompt(true)}} type="text"/>}
                <TinyButton icon={changeModelIcon} onClick={changeModel} type="text"/>
                {useEnhancedGeneration&&<TinyButton icon={enhanceGenerationIcon} onClick={enhanceGeneration} type="text"/>}
                {getActivatedVecDBs().filter(id => id.startsWith("COMMON_VECDB_")).length > 0&&<TinyButton icon={configureVectorDBIcon} onClick={()=>{setIsConfiguringVectorDB(true)}} type="text"/>}
              </ButtonGroup> */}
              <TinyButton text="对话选项" type="primary" popover={<div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                <Button text="角色扮演" icon={rolePlayIcon} onClick={()=>{setIsSelectingPrompt(true)    }}/>
                <Button text="切换模型" icon={changeModelIcon} onClick={changeModel}/>
                <Button text="联网搜索" onClick={()=>{setSearchPlugin(!searchPlugin);showToast(`已${!searchPlugin ? "开启" : "关闭"}联网搜索`)}}/>
                <Button text="脚本执行" onClick={()=>{setScriptPlugin(!scriptPlugin);showToast(`已${!scriptPlugin ? "开启" : "关闭"}脚本执行`)}}/>
                <Button text="图像生成" onClick={()=>{setPaintPlugin(!paintPlugin);showToast(`已${!paintPlugin ? "开启" : "关闭"}图像生成`)}}/>
              </div>}/>
            </td>
          </tr>
        </table>
        {/*<label
          className={`${styles["chat-input-panel-inner"]} ${
            attachImages.length != 0
              ? styles["chat-input-panel-inner-attach"]
              : ""
          }`}
          htmlFor="chat-input"
        >*/}
          {!showOption && <><TextArea
            //id="chat-input"
            //ref={inputRef}
            //className={styles["chat-input"]}
            placeholder={Locale.Chat.Input(submitKey)}
            onInput={(v) => onInput(v)}
            value={userInput}
            //onKeyDown={onInputKeyDown}
            //onFocus={scrollToBottom}
            //onClick={scrollToBottom}
            //onPaste={handlePaste}
            rows={inputRows}
            autoFocus={autoFocus}
            //style={{
            //  fontSize: config.fontSize,
            //}}
            rightAttachment={<Button
              icon={<SendWhiteIcon/>}
              text={Locale.Chat.Send}
              type="primary"
              onClick={() => doSubmit(userInput)}
            />}
          />
            {/*attachImages.length != 0 && (
            <div className={styles["attach-images"]}>
              {attachImages.map((image, index) => {
                return (
                  <div
                    key={index}
                    className={styles["attach-image"]}
                    style={{ backgroundImage: `url("${image}")` }}
                  >
                    <div className={styles["attach-image-mask"]}>
                      <DeleteImageButton
                        deleteImage={() => {
                          setAttachImages(
                            attachImages.filter((_, i) => i !== index),
                          );
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )*/}
          </>}
          {showOption&&<Toolbox>
            <ButtonCard text="角色扮演" icon={rolePlayIcon} onClick={()=>{setIsSelectingPrompt(true)    }}/>
            {/*<ToolboxButton text="更改主题" icon={config.theme=="light"?<LightIcon/>:<DarkIcon/>} onClick={()=>{
              config.update(
                (config) => (config.theme = (config.theme=="light"?"dark":"light") as any as Theme),
              );
            }}/>*/}
            <ButtonCard text="切换模型" icon={changeModelIcon} onClick={changeModel}/>
            <UploadFile/>
            {/* <ButtonCard text="上传图片" icon={<UploadImageIcon/>} onClick={()=>{
              var input = document.createElement('input')
              input.type = 'file'
              input.multiple=false
              input.accept="image/*"
              input.onchange = async (e)=>{
                const img = input.files?.[0] as File
                let reader = new FileReader()
                reader.onload = async (e) => {
                  var id = `/idb/${nanoid()}/${img.name}`
                  await fetch(id, {
                    method:"PUT",
                    body:e.target?.result
                  })
                  chatStore.updateCurrentSession(
                    session => (session.messages = session.messages.concat([
                      {type:"image", src:id, role:"user", content:`用户上传图片：${img.name}`}
                    ]))
                  )
                }
                reader.readAsArrayBuffer(img)
              }
              input.click()
            }}/>
            <ButtonCard text="上传文档" icon={<UploadFileIcon/>} onClick={()=>{
              if(!session.vectorDBs.includes("SESSION_VECDB_"+session.id)){
                session.vectorDBs = session.vectorDBs.concat(["SESSION_VECDB_"+session.id])
              }
              var input = document.createElement('input')
              input.type = 'file'
              input.multiple=false
              input.accept=".doc,.docx,.ppt,.pptx,.pdf,.html,.htm,.txt,.md,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,text/html,text/plain"
              input.onchange=(async (e)=>{
                if((input.files??[]).length<=0) {setIsUploadingFile(false); return}
                await new Promise(resolve=>{
                  const reader = new FileReader();
                  reader.onload = async function(e) {
                      const arrayBuffer = e.target!.result;
                      const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer);
                      var id = `/idb/${nanoid()}/${input.files![0].name}`
                      await fetch(id, {
                        method:"PUT",
                        body:e.target?.result
                      })
                      chatStore.updateCurrentSession(
                        session => (session.messages = session.messages.concat([
                          {type:"document", src:id, role:"user", content:`用户向上传文档：${input.files![0].name}`}
                        ]))
                      )
                  };
                  reader.readAsArrayBuffer(input.files![0]);
                })
              })
              input.click()
            }}/> */}
            <PluginMenu>
              <Button text="联网搜索" onClick={()=>{setSearchPlugin(!searchPlugin);showToast(`已${!searchPlugin ? "开启" : "关闭"}联网搜索`)}}/>
              <Button text="脚本执行" onClick={()=>{setScriptPlugin(!scriptPlugin);showToast(`已${!scriptPlugin ? "开启" : "关闭"}脚本执行`)}}/>
              <Button text="图像生成" onClick={()=>{setPaintPlugin(!paintPlugin);showToast(`已${!paintPlugin ? "开启" : "关闭"}图像生成`)}}/>
            </PluginMenu>
            {/* <ButtonCard text="增强回答"  
              icon={enhanceGenerationIcon}
              onClick={enhanceGeneration}/> */}
            {/* <ButtonCard text="生成文章" icon={<GenerateEssayIcon/>} onClick={()=>{setIsGeneratingEssay(true)}}/> */}
            <ButtonCard 
              text="智能办公" 
              icon={<div style={{ position: "relative" }}>
                <UploadFileIcon/>
                <div style={{
                    position: "absolute",
                    right: -5,
                    bottom: -5,
                    fontStyle: "initial",
                    zoom: 0.8,
                    transform: "scaleX(-1)"
                  }}><MagicIcon/></div>
              </div>}
              popover={<div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                <DocxButton/>
                <PDFButton/>
                <AudioButton/>
              </div>}
            />
            {/* <ButtonCard text="知识库"   
              icon={configureVectorDBIcon}
              onClick={() => { setIsConfiguringVectorDB(true) }}
            /> */}
            <ButtonCard text="删除对话" icon={<BreakIcon style={{ fill: "red", opacity: "0.8" }} />} onClick={async () => {
              chatStore.deleteSession(chatStore.currentSessionIndex);
            }} />
            <ButtonCard text="清除数据" icon={<DeleteIcon style={{ fill: "red", opacity: "0.8" }} />} onClick={async () => {
              if (await showConfirm("", <>{"这将会清除所有的设置及聊天记录。要继续吗？"}</>, true)) {
                chatStore.clearAllData();
              }
            }} />
            {/* <ButtonCard text="Auto GPT" icon={<div style={{fontStyle:"initial"}}>🤖</div>} onClick={()=>{
              props.setPanel("autogpt")
            }}/> */}
        </Toolbox>}
        {/*</label>*/}

        <div style={{
            position:"absolute",
            top:-window.innerHeight*0.5,
            right:0
        }}>
              {session.live2d&&<Live2D src={session.live2d.src} height={session.live2d.height} zoom={0.5}/>}
        </div>

      </div>

      {/* {showExport && (
        <ExportMessageModal onClose={() => setShowExport(false)} />
      )} */}

      {/* {isEditingMessage && (
        <EditMessageModal
          onClose={() => {
            setIsEditingMessage(false);
          }}
        />
      )} */}

      {isSelectingPrompt&&<SelectPromptModal onClose={()=>{setIsSelectingPrompt(false)}}/>}

      {/* {isConfiguringVectorDB&&<ConfigureVectorDBModal 
        setVisible={setIsConfiguringVectorDB}
        setActivatedVecDBs={setActivatedVecDBs}
        getActivatedVecDBs={getActivatedVecDBs}
      />} */}

      {/* {isUploadingImage&&<div className="modal-mask">
        <Modal
          title="上传图片"
        >
            &nbsp;上传中，请稍候……
        </Modal>  
      </div>} */}

      {/* {isUploadingFile&&<div className="modal-mask">
        <Modal
          title="上传文件"
        >
          &nbsp;上传中，请稍候……
        </Modal>  
      </div>} */}

      {/* {isGeneratingEssay&&<GenerateEssayModal 
        setVisible={(visible)=>{setIsGeneratingEssay(visible)}}
      />} */}

    </>
  );
}

export function NextChat() {
  const chatStore = useChatStore();
  const sessionIndex = chatStore.currentSessionIndex;
  return <_Chat key={sessionIndex}></_Chat>;
}
