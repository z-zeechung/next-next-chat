import DeleteIcon from "../icons/bootstrap/trash3.svg";
import BotIcon from "../icons/bot.svg";

import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useChatStore } from "../store";

import Locale from "../locales";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_EMOJI, Path } from "../constant";
// import { MaskAvatar } from "./mask";
import { Mask } from "../store/mask";
import { useRef, useEffect } from "react";
import { showConfirm } from "./ui-lib";
import { useMobileScreen } from "../utils";
// import { ChatCard, Footer, InfoCard, Left, Right, Row, TinyButton } from "../themes/theme";
// import emoji from "../emoji.json"

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: string;
  index: number;
  narrow?: boolean;
  mask: Mask;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [props.selected]);

  const { pathname: currentPath } = useLocation();
  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={`${styles["chat-item"]} ${
            props.selected &&
            (currentPath === Path.Chat || currentPath === Path.Home) &&
            styles["chat-item-selected"]
          }`}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={`${props.title}\n${Locale.ChatItem.ChatItemCount(
            props.count,
          )}`}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={styles["chat-item-avatar"] + " no-dark"}>
                {/* <MaskAvatar
                  avatar={props.mask.avatar}
                  model={props.mask.modelConfig.model}
                /> */}
              </div>
              <div className={styles["chat-item-narrow-count"]}>
                {props.count}
              </div>
            </div>
          ) : (
            <>
              <div className={styles["chat-item-title"]}>{props.title}</div>
              <div className={styles["chat-item-info"]}>
                <div className={styles["chat-item-count"]}>
                  {Locale.ChatItem.ChatItemCount(props.count)}
                </div>
                <div className={styles["chat-item-date"]}>{props.time}</div>
              </div>
            </>
          )}

          <div
            className={styles["chat-item-delete"]}
            onClickCapture={(e) => {
              props.onDelete?.();
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: { narrow?: boolean, managing?:boolean }) {
  const [sessions, selectedIndex, selectSession, moveSession] = useChatStore(
    (state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.moveSession,
    ],
  );
  const chatStore = useChatStore();
  const navigate = useNavigate();
  const isMobileScreen = useMobileScreen();

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveSession(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display:"flex",
              flexDirection:"column",
              gap:"8px"
            }}
          >
            {sessions.map((item, i) => (<>
              {/* <InfoCard
                icon={item.avatar?<div dangerouslySetInnerHTML={{__html:item.avatar}}/>:(item.emoji??emoji[DEFAULT_EMOJI])}
                title={item.topic.length>0?item.topic:Locale.NextChat.ChatArea.DefaultTopic}
                subTitle={Locale.NextChat.SideBar.CountOfChats(item.messages.length)}
                onClick={()=>{
                  navigate(Path.Chat);
                  selectSession(i);
                }}
              >
                <Footer>
                  <Row>
                    <Left>
                      <div style={{fontSize:"12px", color:"gray"}}>
                        {new Date(item.lastUpdate).toLocaleString()}
                      </div>
                    </Left>
                    <Right>
                      <TinyButton
                        icon={<DeleteIcon />}
                        type="text"
                        onClick={()=>{
                          chatStore.deleteSession(i);
                        }}
                      />
                    </Right>
                  </Row>
                </Footer>
              </InfoCard> */}
              {false && `<ChatCard
                icon={item.avatar?<div dangerouslySetInnerHTML={{__html:item.avatar}}/>:(item.emoji??emoji[DEFAULT_EMOJI])}
                title={item.topic}
                time={new Date(item.lastUpdate)}
                count={item.messages.length}
                key={item.id}
                //id={item.id}
                //index={i}
                selected={i === selectedIndex}
                onClick={() => {
                  navigate(Path.Chat);
                  selectSession(i);
                }}
                onDelete={async () => {
                  /*if (
                    (!props.narrow && !isMobileScreen) ||
                    (await showConfirm(Locale.Home.DeleteChat))
                  ) {
                    chatStore.deleteSession(i);
                  }*/
                  chatStore.deleteSession(i);
                }}
                managed={props.managing}
                //narrow={props.narrow}
                //mask={item.mask}
              />`}
            </>))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
