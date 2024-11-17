// import { IconButton } from "../../components/button";
import { ErrorBoundary } from "../../components/error";

import styles from "../../components/mask.module.scss";

// import DownloadIcon from "../../icons/download.svg";
// import UploadIcon from "../../icons/upload.svg";
// import EditIcon from "../../icons/edit.svg";
import AddIcon from "../../icons/bootstrap/plus-circle.svg";
// import CloseIcon from "../../icons/close.svg";
// import DeleteIcon from "../../icons/delete.svg";
// import EyeIcon from "../../icons/eye.svg";
// import CopyIcon from "../../icons/copy.svg";
// import DragIcon from "../../icons/drag.svg";
import TickIcon from "../../icons/bootstrap/check-circle.svg"
import DisableIcon from "../../icons/bootstrap/ban.svg"

// import { v4 as uuidv4 } from 'uuid';

// import { DEFAULT_MASK_AVATAR, Mask, useMaskStore } from "../../store/mask";
import {
  // ModelConfig,
  // ModelType,
  // useAppConfig,
  useChatStore,
} from "../../store";
// import { MultimodalContent, ROLES } from "../../client/api";
// import {
//   Input,
//   List,
//   ListItem,
//   Popover,
//   Select,
//   showConfirm,
// } from "../../components/ui-lib";
import Locale, { AllLangs, ALL_LANG_OPTIONS, Lang } from "../../locales";
import { useNavigate } from "react-router-dom";

// import chatStyle from "../../components/chat.module.scss";
import { useEffect, useRef, useState } from "react";
// import {
//   copyToClipboard,
//   downloadAs,
//   //getMessageImages,
//   readFromFile,
// } from "../../utils";
// import { Updater } from "../../typing";
// import { ModelConfigList } from "../../components/model-config";
// import { FileName, Path } from "../../constant";
// import { BUILTIN_MASK_STORE } from "../../masks";
// import { nanoid } from "nanoid";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   OnDragEndResponder,
// } from "@hello-pangea/dnd";
//import { getMessageTextContent } from "../../utils";
// import { Emoji } from "emoji-picker-react";
import { Button, InfoCard, Modal, TextArea } from "@/app/themes/theme";
import { Card, SimpleGrid } from "@chakra-ui/react";
import prompts from "@/app/prompts.json";
// import { Message } from "@/app/message/Message";
// import { MarkdownMessage } from "@/app/message/TextMessage";

// drag and drop helper function
// function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
//   const result = [...list];
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);
//   return result;
// }

// function Avatar(props: { avatar?: JSX.Element }) {
//   return (
//     <div className="user-avatar">
//       {props.avatar}
//     </div>
//   );
// }

/*function MaskConfig(props: {
  mask: Mask;
  updateMask: Updater<Mask>;
  extraListItems?: JSX.Element;
  readonly?: boolean;
  shouldSyncFromGlobal?: boolean;
}) {
  const [showPicker, setShowPicker] = useState(false);

  const updateConfig = (updater: (config: ModelConfig) => void) => {
    if (props.readonly) return;

    const config = { ...props.mask.modelConfig };
    updater(config);
    props.updateMask((mask) => {
      mask.modelConfig = config;
      // if user changed current session mask, it will disable auto sync
      mask.syncGlobalConfig = false;
    });
  };

  const copyMaskLink = () => {
    const maskLink = `${location.protocol}//${location.host}/#${Path.NewChat}?mask=${props.mask.id}`;
    copyToClipboard(maskLink);
  };

  const globalConfig = useAppConfig();

  return (
    <>
      <ContextPrompts
        context={props.mask.context}
        updateContext={(updater) => {
          const context = props.mask.context.slice();
          updater(context);
          props.updateMask((mask) => (mask.context = context));
        }}
      />

      <List>
        <ListItem title={Locale.Mask.Config.Avatar}>
          <Popover
            content={
              <AvatarPicker
                onEmojiClick={(emoji) => {
                  props.updateMask((mask) => (mask.avatar = emoji));
                  setShowPicker(false);
                }}
              ></AvatarPicker>
            }
            open={showPicker}
            onClose={() => setShowPicker(false)}
          >
            <div
              onClick={() => setShowPicker(true)}
              style={{ cursor: "pointer" }}
            >
              <MaskAvatar
                avatar={props.mask.avatar}
                model={props.mask.modelConfig.model}
              />
            </div>
          </Popover>
        </ListItem>
        <ListItem title={Locale.Mask.Config.Name}>
          <input
            type="text"
            value={props.mask.name}
            onInput={(e) =>
              props.updateMask((mask) => {
                mask.name = e.currentTarget.value;
              })
            }
          ></input>
        </ListItem>
        <ListItem
          title={Locale.Mask.Config.HideContext.Title}
          subTitle={Locale.Mask.Config.HideContext.SubTitle}
        >
          <input
            type="checkbox"
            checked={props.mask.hideContext}
            onChange={(e) => {
              props.updateMask((mask) => {
                mask.hideContext = e.currentTarget.checked;
              });
            }}
          ></input>
        </ListItem>

        {!props.shouldSyncFromGlobal ? (
          <ListItem
            title={Locale.Mask.Config.Share.Title}
            subTitle={Locale.Mask.Config.Share.SubTitle}
          >
            <IconButton
              icon={<CopyIcon />}
              text={Locale.Mask.Config.Share.Action}
              onClick={copyMaskLink}
            />
          </ListItem>
        ) : null}

        {props.shouldSyncFromGlobal ? (
          <ListItem
            title={Locale.Mask.Config.Sync.Title}
            subTitle={Locale.Mask.Config.Sync.SubTitle}
          >
            <input
              type="checkbox"
              checked={props.mask.syncGlobalConfig}
              onChange={async (e) => {
                const checked = e.currentTarget.checked;
                if (
                  checked &&
                  (await showConfirm(Locale.Mask.Config.Sync.Confirm))
                ) {
                  props.updateMask((mask) => {
                    mask.syncGlobalConfig = checked;
                    mask.modelConfig = { ...globalConfig.modelConfig };
                  });
                } else if (!checked) {
                  props.updateMask((mask) => {
                    mask.syncGlobalConfig = checked;
                  });
                }
              }}
            ></input>
          </ListItem>
        ) : null}
      </List>

      <List>
        <ModelConfigList
          modelConfig={{ ...props.mask.modelConfig }}
          updateConfig={updateConfig}
        />
        {props.extraListItems}
      </List>
    </>
  );
}*/

// function ContextPromptItem(props: {
//   index: number;
//   prompt: Message;
//   update: (prompt: Message) => void;
//   remove: () => void;
// }) {
//   const [focusingInput, setFocusingInput] = useState(false);

//   return (
//     <div className={chatStyle["context-prompt-row"]}>
//       {!focusingInput && (
//         <>
//           <div className={chatStyle["context-drag"]}>
//             <DragIcon />
//           </div>
//           <Select
//             value={props.prompt.role}
//             className={chatStyle["context-role"]}
//             onChange={(e) =>
//               props.update({
//                 ...props.prompt,
//                 role: e.target.value as any,
//               })
//             }
//           >
//             {ROLES.map((r) => (
//               <option key={r} value={r}>
//                 {r}
//               </option>
//             ))}
//           </Select>
//         </>
//       )}
//       <Input
//         value={/*getMessageTextContent(props.prompt)*/props.prompt.content}
//         type="text"
//         className={chatStyle["context-content"]}
//         rows={focusingInput ? 5 : 1}
//         onFocus={() => setFocusingInput(true)}
//         onBlur={() => {
//           setFocusingInput(false);
//           // If the selection is not removed when the user loses focus, some
//           // extensions like "Translate" will always display a floating bar
//           window?.getSelection()?.removeAllRanges();
//         }}
//         onInput={(e) =>
//           props.update({
//             ...props.prompt,
//             content: e.currentTarget.value as any,
//           })
//         }
//       />
//       {!focusingInput && (
//         <IconButton
//           icon={<DeleteIcon />}
//           className={chatStyle["context-delete-button"]}
//           onClick={() => props.remove()}
//           bordered
//         />
//       )}
//     </div>
//   );
// }

// export function ContextPrompts(props: {
//   context: Message[];
//   updateContext: (updater: (context: Message[]) => void) => void;
// }) {
//   const context = props.context;

//   const addContextPrompt = (prompt: Message, i: number) => {
//     props.updateContext((context) => context.splice(i, 0, prompt));
//   };

//   const removeContextPrompt = (i: number) => {
//     props.updateContext((context) => context.splice(i, 1));
//   };

//   const updateContextPrompt = (i: number, prompt: Message) => {
//     props.updateContext((context) => {
//       //const images = getMessageImages(context[i]);
//       context[i] = prompt;
//       /*if (images.length > 0) {
//         const text = getMessageTextContent(context[i]);
//         const newContext: MultimodalContent[] = [{ type: "text", text }];
//         for (const img of images) {
//           newContext.push({ type: "image_url", image_url: { url: img } });
//         }
//         context[i].content = newContext;
//       }*/
//     });
//   };

//   const onDragEnd: OnDragEndResponder = (result) => {
//     if (!result.destination) {
//       return;
//     }
//     const newContext = reorder(
//       context,
//       result.source.index,
//       result.destination.index,
//     );
//     props.updateContext((context) => {
//       context.splice(0, context.length, ...newContext);
//     });
//   };

//   return (
//     <>
//       <div className={chatStyle["context-prompt"]} style={{ marginBottom: 20 }}>
//         <DragDropContext onDragEnd={onDragEnd}>
//           <Droppable droppableId="context-prompt-list">
//             {(provided) => (
//               <div ref={provided.innerRef} {...provided.droppableProps}>
//                 {context.map((c, i) => (
//                   <Draggable
//                     draggableId={c.id || i.toString()}
//                     index={i}
//                     key={c.id}
//                   >
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                       >
//                         <ContextPromptItem
//                           index={i}
//                           prompt={c}
//                           update={(prompt) => updateContextPrompt(i, prompt)}
//                           remove={() => removeContextPrompt(i)}
//                         />
//                         <div
//                           className={chatStyle["context-prompt-insert"]}
//                           onClick={() => {
//                             addContextPrompt(
//                               {type:"text", role:"user", content:""},
//                               i + 1,
//                             );
//                           }}
//                         >
//                           <AddIcon />
//                         </div>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>

//         {props.context.length === 0 && (
//           <div className={chatStyle["context-prompt-row"]}>
//             <IconButton
//               icon={<AddIcon />}
//               text={Locale.Context.Add}
//               bordered
//               className={chatStyle["context-prompt-button"]}
//               onClick={() =>
//                 addContextPrompt(
//                   {type:"text", role:"user", content:""},
//                   props.context.length,
//                 )
//               }
//             />
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

export function MaskPage(props: { onClose: () => void}) {
  const navigate = useNavigate();

  // const maskStore = useMaskStore();
  const chatStore = useChatStore();

  // const [filterLang, setFilterLang] = useState<Lang | undefined>(
  //   () => localStorage.getItem("Mask-language") as Lang | undefined,
  // );
  // useEffect(() => {
  //   if (filterLang) {
  //     localStorage.setItem("Mask-language", filterLang);
  //   } else {
  //     localStorage.removeItem("Mask-language");
  //   }
  // }, [filterLang]);

  //const allMasks = maskStore
  //  .getAll()
  //  .filter((m) => !filterLang || m.lang === filterLang);
  const allMasks = prompts

  const [searchMasks, setSearchMasks] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const masks = searchText.length > 0 ? searchMasks : allMasks;

  // refactored already, now it accurate
  const onSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      const result = allMasks.filter((m) =>
        (m.name??"").toLowerCase().includes(text.toLowerCase()),
      );
      setSearchMasks(result);
    } else {
      setSearchMasks(allMasks);
    }
  };

  // const [editingMaskId, setEditingMaskId] = useState<string | undefined>();
  // const editingMask =
  //   maskStore.get(editingMaskId) ?? BUILTIN_MASK_STORE.get(editingMaskId);
  // const closeMaskModal = () => setEditingMaskId(undefined);

  //const downloadAll = () => {
  //  downloadAs(JSON.stringify(masks.filter((v) => !v.builtin)), FileName.Masks);
  //};

  // const importFromFile = () => {
  //   readFromFile().then((content) => {
  //     try {
  //       const importMasks = JSON.parse(content);
  //       if (Array.isArray(importMasks)) {
  //         for (const mask of importMasks) {
  //           if (mask.name) {
  //             maskStore.create(mask);
  //           }
  //         }
  //         return;
  //       }
  //       //if the content is a single mask.
  //       if (importMasks.name) {
  //         maskStore.create(importMasks);
  //       }
  //     } catch {}
  //   });
  // };

  return (
    <ErrorBoundary>
      <div className={styles["mask-page"]}>

        <div className={styles["mask-page-body"]}>
          <div className={styles["mask-filter"]}>
            <TextArea
              //type="text"
              //className={styles["search-bar"]}
              placeholder={"搜索角色……"}
              autoFocus
              onInput={(v) => onSearch(v)}
              rows={1}
              rightAttachment={<Button
                icon={<AddIcon/>}
                text={Locale.Mask.Page.Create}
                onClick={() => {
                  // const createdMask = maskStore.create();
                  // setEditingMaskId(createdMask.id);
                  navigate("/devrole")
                }}
              />}
            />
          </div>

          {(chatStore.currentSession().avatar||chatStore.currentSession().prompt)&&<><SimpleGrid templateColumns={`repeat(auto-fill, minmax(${250}px, 1fr))`} gap={4}>
            <Card background={"#00000000"} shadow={"none"}>
              <InfoCard
                icon={<div dangerouslySetInnerHTML={{__html:chatStore.currentSession().avatar??""}}/>}
                title="正在使用"
              >
                <Button
                  text="停用"
                  type="primary"
                  onClick={()=>{
                    chatStore.updateCurrentSession(s=>{
                      s.avatar = undefined
                      s.prompt = undefined
                      s.live2d = undefined
                      s.greeting = undefined
                    })
                  }}
                  icon={<DisableIcon/>}
                />
              </InfoCard>
            </Card>
          </SimpleGrid>

          <div style={{padding:8}}/></>}
              
          <SimpleGrid templateColumns={`repeat(auto-fill, minmax(${250}px, 1fr))`} gap={4}>
            {masks.map((m, idx) => (
              /*<div className={styles["mask-item"]} key={m.path}>
                <div className={styles["mask-header"]}>
                  <div className={styles["mask-icon"]}>
                    <Avatar avatar={m.avatar} />
                  </div>
                  <div className={styles["mask-title"]}>
                    <div className={styles["mask-name"]}>{m.name}</div>
                  </div>
                </div>
                <div className={styles["mask-actions"]}>
                  <Button
                    icon={<TickIcon/>}
                    text={"使用"}
                    type="text"
                    onClick={() => {
                      getPrompt(m.path, props.setPrompt)
                    }}
                  />
                </div>
              </div>*/
              <Card key={idx} background={"#00000000"} shadow={"none"}>
                <InfoCard
                  icon={<div dangerouslySetInnerHTML={{__html:m.avatar}}/>}
                  title={m.name}
                >
                  <Button
                    icon={<TickIcon />}
                    text={"使用"}
                    type="text"
                    onClick={() => {
                      chatStore.updateCurrentSession(session=>{
                        session.avatar = m.avatar
                        session.prompt = m.prompt
                        session.live2d = m.live2d
                        session.greeting = m.greeting
                      })
                      props.onClose()
                    }}
                  />
                </InfoCard>
              </Card>
            ))}
          </SimpleGrid>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export function SelectPromptModal(props: { onClose: () => void}){
  return (<Modal
      title="选择角色"
      onClose={props.onClose}
    >
      <MaskPage onClose={props.onClose}/>
    </Modal>)
}