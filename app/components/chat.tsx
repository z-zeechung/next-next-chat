// import { useDebouncedCallback } from "use-debounce";
import React, {
  useState,
  // useRef,
  // useEffect,
  // useMemo,
  // useCallback,
  // Fragment,
  // RefObject,
  // memo,
} from "react";

// import SendWhiteIcon from "../icons/send-white.svg";
// import BrainIcon from "../icons/brain.svg";
import RenameIcon from "../icons/rename.svg";
// import ExportIcon from "../icons/share.svg";
import ReturnIcon from "../icons/bootstrap/arrow-90deg-left.svg";
import MenuIcon from "../icons/bootstrap/menu-button-wide.svg";
// import CopyIcon from "../icons/copy.svg";
// import LoadingIcon from "../icons/three-dots.svg";
// import LoadingButtonIcon from "../icons/loading.svg";
// import PromptIcon from "../icons/prompt.svg";
// import MaskIcon from "../icons/mask.svg";
// import MaxIcon from "../icons/max.svg";
// import MinIcon from "../icons/min.svg";
// import ResetIcon from "../icons/reload.svg";
// import BreakIcon from "../icons/break.svg";
// import SettingsIcon from "../icons/chat-settings.svg";
// import DeleteIcon from "../icons/clear.svg";
// import PinIcon from "../icons/pin.svg";
// import EditIcon from "../icons/rename.svg";
// import ConfirmIcon from "../icons/confirm.svg";
// import CancelIcon from "../icons/cancel.svg";
// import ImageIcon from "../icons/image.svg";

// import LightIcon from "../icons/light.svg";
// import DarkIcon from "../icons/dark.svg";
// import AutoIcon from "../icons/auto.svg";
// import BottomIcon from "../icons/bottom.svg";
// import StopIcon from "../icons/pause.svg";
// import RobotIcon from "../icons/robot.svg";

import {
  // SubmitKey,
  useChatStore,
  // BOT_HELLO,
  // useAccessStore,
  // Theme,
  // useAppConfig,
  DEFAULT_TOPIC,
  // ModelType,
} from "../store";

import {
  // copyToClipboard,
  // selectOrCopy,
  // autoGrowTextArea,
  useMobileScreen,
//  getMessageTextContent,
//  getMessageImages,
  // isVisionModel,
} from "../utils";

// import { compressImage } from "@/app/utils/chat";

// import dynamic from "next/dynamic";

// import { ChatControllerPool } from "../client/controller";
// import { Prompt, usePromptStore } from "../store/prompt";
// import Locale from "../locales";

// import { IconButton } from "./button";
import styles from "./chat.module.scss";

// import {
//   List,
//   ListItem,
//   Modal,
//   Select,
//   Selector,
//   showConfirm,
//   showPrompt,
//   showToast,
// } from "./ui-lib";
import { useNavigate } from "react-router-dom";
import {
  // CHAT_PAGE_SIZE,
  // DEFAULT_EMOJI,
  // LAST_INPUT_KEY,
  Path,
  // REQUEST_TIMEOUT_MS,
  // UNFINISHED_INPUT,
} from "../constant";
// import { Avatar } from "./emoji";
// import { ContextPrompts, MaskAvatar, MaskConfig } from "./mask";
// import { useMaskStore } from "../store/mask";
// import { ChatCommandPrefix, useChatCommand, useCommand } from "../command";
// import { prettyObject } from "../utils/format";
// import { ExportMessageModal } from "./exporter";
// import { getClientConfig } from "../config/client";
// import { useAllModels } from "../utils/hooks";
// import { MultimodalContent } from "../client/api";
// import { inherits } from "util";
import { NextChat } from "../panels/nextchat";
// import { TestPage } from "../panels/testpage";
// import emoji from "../emoji.json"
// import { AutoGPT } from "../panels/autogpt";
// import { Button, Select } from "../themes/theme";
import { ALL_LANG_OPTIONS, changeLang, getLang } from "../locales";
import { Button, Select } from "antd";
// import { renderToString } from "react-dom/server";
// import { Message } from "../message/Message";
// import { MarkdownMessage } from "../message/TextMessage";
// import { DocumentDocx } from "../panels/document-docx";

// const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
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
//               if (await showConfirm(Locale.Memory.ResetConfirm)) {
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
//                 className="copyable"
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

// function useSubmitHandler() {
//   const config = useAppConfig();
//   const submitKey = config.submitKey;
//   const isComposing = useRef(false);

//   useEffect(() => {
//     const onCompositionStart = () => {
//       isComposing.current = true;
//     };
//     const onCompositionEnd = () => {
//       isComposing.current = false;
//     };

//     window.addEventListener("compositionstart", onCompositionStart);
//     window.addEventListener("compositionend", onCompositionEnd);

//     return () => {
//       window.removeEventListener("compositionstart", onCompositionStart);
//       window.removeEventListener("compositionend", onCompositionEnd);
//     };
//   }, []);

//   const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     // Fix Chinese input method "Enter" on Safari
//     if (e.keyCode == 229) return false;
//     if (e.key !== "Enter") return false;
//     if (e.key === "Enter" && (e.nativeEvent.isComposing || isComposing.current))
//       return false;
//     return (
//       (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
//       (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
//       (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
//       (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
//       (config.submitKey === SubmitKey.Enter &&
//         !e.altKey &&
//         !e.ctrlKey &&
//         !e.shiftKey &&
//         !e.metaKey)
//     );
//   };

//   return {
//     submitKey,
//     shouldSubmit,
//   };
// }

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

// function useScrollToBottom(
//   scrollRef: RefObject<HTMLDivElement>,
//   detach: boolean = false,
// ) {
//   // for auto-scroll

//   const [autoScroll, setAutoScroll] = useState(true);
//   function scrollDomToBottom() {
//     const dom = scrollRef.current;
//     if (dom) {
//       requestAnimationFrame(() => {
//         setAutoScroll(true);
//         dom.scrollTo(0, dom.scrollHeight);
//       });
//     }
//   }

//   // auto scroll
//   useEffect(() => {
//     if (autoScroll && !detach) {
//       scrollDomToBottom();
//     }
//   });

//   return {
//     scrollRef,
//     autoScroll,
//     setAutoScroll,
//     scrollDomToBottom,
//   };
// }

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

function Chat_() {

  // type RenderMessage = Message & { preview?: boolean };

  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  // const config = useAppConfig();
  // const fontSize = config.fontSize;

  // const [showExport, setShowExport] = useState(false);

  // const inputRef = useRef<HTMLTextAreaElement>(null);
  // const [userInput, setUserInput] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const { submitKey, shouldSubmit } = useSubmitHandler();
  // const scrollRef = useRef<HTMLDivElement>(null);
  // const isScrolledToBottom = scrollRef?.current
  //   ? Math.abs(
  //       scrollRef.current.scrollHeight -
  //         (scrollRef.current.scrollTop + scrollRef.current.clientHeight),
  //     ) <= 1
  //   : false;
  // const { setAutoScroll, scrollDomToBottom } = useScrollToBottom(
  //   scrollRef,
  //   isScrolledToBottom,
  // );
  // const [hitBottom, setHitBottom] = useState(true);
  const isMobileScreen = useMobileScreen();
  const navigate = useNavigate();
  // const [attachImages, setAttachImages] = useState<string[]>([]);
  // const [uploading, setUploading] = useState(false);

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
  // const [inputRows, setInputRows] = useState(2);
  // const measure = useDebouncedCallback(
  //   () => {
  //     const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
  //     const inputRows = Math.min(
  //       20,
  //       Math.max(2 + Number(!isMobileScreen), rows),
  //     );
  //     setInputRows(inputRows);
  //   },
  //   100,
  //   {
  //     leading: true,
  //     trailing: true,
  //   },
  // );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(measure, [userInput]);

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
  // const onInput = (text: string) => {
  //   setUserInput(text);
  //   const n = text.trim().length;

  //   // clear search results
  //   if (n === 0) {
  //     setPromptHints([]);
  //   } else if (text.startsWith(ChatCommandPrefix)) {
  //     setPromptHints(chatCommands.search(text));
  //   } else if (!config.disablePromptHint && n < SEARCH_TEXT_LIMIT) {
  //     // check if need to trigger auto completion
  //     if (text.startsWith("/")) {
  //       let searchText = text.slice(1);
  //       onSearch(searchText);
  //     }
  //   }
  // };

  // const doSubmit = (userInput: string) => {
  //   if (userInput.trim() === "") return;
  //   const matchCommand = chatCommands.match(userInput);
  //   if (matchCommand.matched) {
  //     setUserInput("");
  //     setPromptHints([]);
  //     matchCommand.invoke();
  //     return;
  //   }
  //   setIsLoading(true);
  //   chatStore
  //     .onUserInput(userInput, attachImages)
  //     .then(() => setIsLoading(false));
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
  //       if (m.isError || new Date(m.date).getTime() < stopTiming) {
  //         if (m.streaming) {
  //           m.streaming = false;
  //         }

  //         if (m.content.length === 0) {
  //           m.isError = true;
  //           m.content = prettyObject({
  //             error: true,
  //             message: "empty response",
  //           });
  //         }
  //       }
  //     });

  //     auto sync mask config from global config
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
  //   setIsLoading(true);
  //   const textContent = /*getMessageTextContent(userMessage)*/userMessage.content;
  //   //const images = getMessageImages(userMessage);
  //   chatStore.onUserInput(textContent, /*images*/).then(() => setIsLoading(false));
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

  // const context: RenderMessage[] = useMemo(() => {
  //   return session.mask.hideContext ? [] : session.mask.context.slice();
  // }, [session.mask.context, session.mask.hideContext]);
  // const accessStore = useAccessStore();

  // if (
  //   context.length === 0 &&
  //   session.messages.at(0)?.content !== BOT_HELLO.content
  // ) {
  //   const copiedHello = Object.assign({}, BOT_HELLO);
  //   if (!accessStore.isAuthorized()) {
  //     copiedHello.content = Locale.Error.Unauthorized;
  //   }
  //   context.push(copiedHello);
  // }

  // preview messages
  // const renderMessages = useMemo(() => {
  //   return context
  //     .concat(session.messages as RenderMessage[])
  //     .concat(
  //       isLoading
  //         ? [
  //             new MarkdownMessage("assistant", "......")
  //             // {
  //             //   ...createMessage({
  //             //     role: "assistant",
  //             //     content: "……",
  //             //   }),
  //             //   preview: true,
  //             // },
  //           ]
  //         : [],
  //     )
  //     .concat(
  //       userInput.length > 0 && config.sendPreviewBubble
  //         ? [
  //             new MarkdownMessage("user", userInput)
  //             // {
  //             //   ...createMessage({
  //             //     role: "user",
  //             //     content: userInput,
  //             //   }),
  //             //   preview: true,
  //             // },
  //           ]
  //         : [],
  //     );
  // }, [
  //   config.sendPreviewBubble,
  //   context,
  //   isLoading,
  //   session.messages,
  //   userInput,
  // ]);

  // const [msgRenderIndex, _setMsgRenderIndex] = useState(
  //   Math.max(0, renderMessages.length - CHAT_PAGE_SIZE),
  // );
  // function setMsgRenderIndex(newIndex: number) {
  //   newIndex = Math.min(renderMessages.length - CHAT_PAGE_SIZE, newIndex);
  //   newIndex = Math.max(0, newIndex);
  //   _setMsgRenderIndex(newIndex);
  // }

  // const messages = useMemo(() => {
  //   const endRenderIndex = Math.min(
  //     msgRenderIndex + 3 * CHAT_PAGE_SIZE,
  //     renderMessages.length,
  //   );
  //   return renderMessages.slice(msgRenderIndex, endRenderIndex);
  // }, [msgRenderIndex, renderMessages]);

  // const onChatBodyScroll = (e: HTMLElement) => {
  //   const bottomHeight = e.scrollTop + e.clientHeight;
  //   const edgeThreshold = e.clientHeight;

  //   const isTouchTopEdge = e.scrollTop <= edgeThreshold;
  //   const isTouchBottomEdge = bottomHeight >= e.scrollHeight - edgeThreshold;
  //   const isHitBottom =
  //     bottomHeight >= e.scrollHeight - (isMobileScreen ? 4 : 10);

  //   const prevPageMsgIndex = msgRenderIndex - CHAT_PAGE_SIZE;
  //   const nextPageMsgIndex = msgRenderIndex + CHAT_PAGE_SIZE;

  //   if (isTouchTopEdge && !isTouchBottomEdge) {
  //     setMsgRenderIndex(prevPageMsgIndex);
  //   } else if (isTouchBottomEdge) {
  //     setMsgRenderIndex(nextPageMsgIndex);
  //   }

  //   setHitBottom(isHitBottom);
  //   setAutoScroll(isHitBottom);
  // };
  // function scrollToBottom() {
  //   setMsgRenderIndex(renderMessages.length - CHAT_PAGE_SIZE);
  //   scrollDomToBottom();
  // }

  // // clear context index = context length + index in messages
  // const clearContextIndex =
  //   (session.clearContextIndex ?? -1) >= 0
  //     ? session.clearContextIndex! + context.length - msgRenderIndex
  //     : -1;

  // const [showPromptModal, setShowPromptModal] = useState(false);

  // const clientConfig = useMemo(() => getClientConfig(), []);

  // const autoFocus = !isMobileScreen; // wont auto focus on mobile screen
  // const showMaxIcon = !isMobileScreen && !clientConfig?.isApp;

  // useCommand({
  //   fill: setUserInput,
  //   submit: (text) => {
  //     doSubmit(text);
  //   },
  //   code: (text) => {
  //     if (accessStore.disableFastLink) return;
  //     console.log("[Command] got code from url: ", text);
  //     showConfirm(Locale.URLCommand.Code + `code = ${text}`).then((res) => {
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
  //         showConfirm(
  //           Locale.URLCommand.Settings +
  //             `\n${JSON.stringify(payload, null, 4)}`,
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

  const [panel, setPanel] = useState("nextchat")

  // function handlePanel(p:string){
  //   setPanel(p)
  // }

  // function panels(p:string){
  //   if(p=="nextchat"){return <NextChat/>}
  //   if(p=="autogpt"){return <AutoGPT/>}
  //   if(p=="document-docx"){return <DocumentDocx/>}
  //   if(p=="testpage"){return <TestPage/>}
  //   return <></>
  // }
  
  return (
    <div className={styles.chat} key={session.id}>
      <div className="window-header" data-tauri-drag-region>

        {panel=="nextchat"?<>{isMobileScreen && (
          <div className="window-actions">
            <div className={"window-action-button"}>
              <Button
                icon={<MenuIcon />}
                // text="聊天列表"
                onClick={() => navigate(Path.Home)}
                type="text"
              />
            </div>
          </div>
        )}

        <div className={`window-header-title ${styles["chat-body-title"]}`}>
          {/*<div
            className={`window-header-main-title ${styles["chat-body-main-title"]}`}
            onClickCapture={() => setIsEditingMessage(true)}
          >
            {!session.topic ? DEFAULT_TOPIC : session.topic}
          </div>
          <div className="window-header-sub-title">
            {Locale.Chat.SubTitle(session.messages.length)}
          </div>*/}
          <div
            className={`window-header-main-title`}
          >
            {!session.topic ? DEFAULT_TOPIC : session.topic}
          </div>
        </div></>:<>
        <div className="window-actions">
            <div className={"window-action-button"}>
              <Button
                icon={<ReturnIcon />}
                //text="返回"
                onClick={() => setPanel("nextchat")}
              />
            </div>
          </div>
        </>}

        <div className="window-actions">
          <div className="window-action-button">
            <Select //options={Object.values(ALL_LANG_OPTIONS)}
            value={ALL_LANG_OPTIONS[getLang()]}
            onChange={(value) => {
              changeLang(Object.values(ALL_LANG_OPTIONS).reduce((acc, key, index) => Object.assign(acc, {[key]: Object.keys(ALL_LANG_OPTIONS)[index]}), {})[value])
            }
            }
            />
          </div>
          {/* {!isMobileScreen && (
            <div className="window-action-button">
              <IconButton
                icon={<RenameIcon />}
                bordered
                onClick={() => setIsEditingMessage(true)}
              />
            </div>
          )}
          <div className="window-action-button">
            <IconButton
              icon={<ExportIcon />}
              bordered
              title={Locale.Chat.Actions.Export}
              onClick={() => {
                setShowExport(true);
              }}
            />
          </div>
          {showMaxIcon && (
            <div className="window-action-button">
              <IconButton
                icon={config.tightBorder ? <MinIcon /> : <MaxIcon />}
                bordered
                onClick={() => {
                  config.update(
                    (config) => (config.tightBorder = !config.tightBorder),
                  );
                }}
              />
            </div>
          )} */}
        </div>

        {/* <PromptToast
          showToast={!hitBottom}
          showModal={showPromptModal}
          setShowModal={setShowPromptModal}
        /> */}
      </div>

      {/* {panels(panel)} */}
      <NextChat/>

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
    </div>
  );
}

export function Chat() {
  const chatStore = useChatStore();
  const sessionIndex = chatStore.currentSessionIndex;
  return <Chat_ key={sessionIndex}></Chat_>;
}
