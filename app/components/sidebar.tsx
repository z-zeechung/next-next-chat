import { useEffect, useRef, useMemo, useState } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/bootstrap/plus-circle.svg";
import CloseIcon from "../icons/close.svg";
import DeleteIcon from "../icons/delete.svg";
import MaskIcon from "../icons/mask.svg";
import PluginIcon from "../icons/plugin.svg";
import DragIcon from "../icons/drag.svg";
import ManageIcon from "../icons/bootstrap/wrench-adjustable.svg"
import ReturnIcon from "../icons/bootstrap/arrow-return-left.svg";

import Locale from "../locales";

import { useAppConfig, useChatStore } from "../store";

import {
  DEFAULT_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { isIOS, useMobileScreen, useWindowSize } from "../utils";
import dynamic from "next/dynamic";
import { showConfirm, showToast } from "./ui-lib";
// import { Avatar, Button, ChatHistory, Component, Footer, Header, Heading, Left, Modal, Right, Row } from "../themes/theme";
// import { Box, Card, CardBody, CardHeader, Flex, Text, useStatStyles } from "@chakra-ui/react";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey) {
        if (e.key === "ArrowUp") {
          chatStore.nextSession(-1);
        } else if (e.key === "ArrowDown") {
          chatStore.nextSession(1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
  const lastUpdateTime = useRef(Date.now());

  const toggleSideBar = () => {
    config.update((config) => {
      if (config.sidebarWidth < MIN_SIDEBAR_WIDTH) {
        config.sidebarWidth = DEFAULT_SIDEBAR_WIDTH;
      } else {
        config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
      }
    });
  };

  const onDragStart = (e: MouseEvent) => {
    // Remembers the initial width each time the mouse is pressed
    startX.current = e.clientX;
    startDragWidth.current = config.sidebarWidth;
    const dragStartTime = Date.now();

    const handleDragMove = (e: MouseEvent) => {
      if (Date.now() < lastUpdateTime.current + 20) {
        return;
      }
      lastUpdateTime.current = Date.now();
      const d = e.clientX - startX.current;
      const nextWidth = limit(startDragWidth.current + d);
      config.update((config) => {
        if (nextWidth < MIN_SIDEBAR_WIDTH) {
          config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
        } else {
          config.sidebarWidth = nextWidth;
        }
      });
    };

    const handleDragEnd = () => {
      // In useRef the data is non-responsive, so `config.sidebarWidth` can't get the dynamic sidebarWidth
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);

      // if user click the drag icon, should toggle the sidebar
      const shouldFireClick = Date.now() - dragStartTime < 300;
      if (shouldFireClick) {
        toggleSideBar();
      }
    };

    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
  };

  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragStart,
    shouldNarrow,
  };
}

export function SideBar(props: { /*className?: string*/ show?: boolean }) {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragStart, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();
  const isMobileScreen = useMobileScreen();
  const isIOSMobile = useMemo(
    () => isIOS() && isMobileScreen,
    [isMobileScreen],
  );

  const [managing, setManaging] = useState(false)

  useHotKey();

  const [isHovered, setIsHovered] = useState(false);
  const { width } = useWindowSize();

  return (<>
    {/*<div
      className={`${styles.sidebar} ${props.className} ${
        shouldNarrow && styles["narrow-sidebar"]
      }`}
      style={{
        // #3016 disable transition on ios mobile screen
        transition: isMobileScreen && isIOSMobile ? "none" : undefined,
      }}
    >*/}
    {false && `<ChatHistory
      show={props.show}
    >
      {/*<div className={styles["sidebar-header"]} data-tauri-drag-region>
        <div className={styles["sidebar-title"]} data-tauri-drag-region>
          NextChat
        </div>
        <div className={styles["sidebar-sub-title"]}>
          Build your own AI assistant.
        </div>
        <div className={styles["sidebar-logo"] + " no-dark"}>
          <ChatGptIcon />
        </div>
      </div>*/}

      {/*<div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<MaskIcon />}
          text={shouldNarrow ? undefined : Locale.Mask.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => {
            if (config.dontShowMaskSplashScreen !== true) {
              navigate(Path.NewChat, { state: { fromHome: true } });
            } else {
              navigate(Path.Masks, { state: { fromHome: true } });
            }
          }}
          shadow
        />
        <IconButton
          icon={<PluginIcon />}
          text={shouldNarrow ? undefined : Locale.Plugin.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => showToast(Locale.WIP)}
          shadow
        />
      </div>*/}

      <div className={styles["sidebar-header"]}>
        <div className={styles["sidebar-title"]}>
          &nbsp;&nbsp;{Locale.NextChat.SideBar.ChatList}
          <span
            style={{
              position: "absolute",
              right: 0
            }}
          >
            <Button
              icon={managing ? <ReturnIcon /> : <ManageIcon />}
              text={managing ? Locale.NextChat.SideBar.Exit : Locale.NextChat.SideBar.Manage}
              onClick={() => { setManaging(!managing) }}
            />
          </span>
        </div>
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} managing={managing} />
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<DeleteIcon />}
              onClick={async () => {
                if (await showConfirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>
          <div className={styles["sidebar-action"]} style={{ display: "none" }}>
            <Link to={Path.Settings} style={{ textDecoration: "none" }}>
              <IconButton icon={<SettingsIcon />} shadow text="设置" />
            </Link>
          </div>
          {/*<div className={styles["sidebar-action"]}>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <IconButton icon={<GithubIcon />} shadow />
            </a>
          </div>*/}
        </div>
        <div>
          {<Button
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : Locale.NextChat.SideBar.NewChat}
            onClick={() => {
              //if (config.dontShowMaskSplashScreen) {
              if (true) {
                let lastSession = chatStore.sessions[0]
                if (lastSession.messages.length <= 0) {
                  chatStore.update(sessions => {
                    sessions.sessions[0].lastUpdate = Date.now()
                  })
                  chatStore.selectSession(0)
                } else {
                  chatStore.newSession();
                  navigate(Path.Chat);
                }
              } else {
                navigate(Path.NewChat);
              }
            }}
          />}
        </div>
      </div>

      <div
        className={styles["sidebar-drag"]}
        onPointerDown={(e) => onDragStart(e as any)}
        style={{ display: "none" }}
      >
        <DragIcon />
      </div>
      {/*</div>*/}
    </ChatHistory>`}
    <div 
      style={{width: isMobileScreen ? "" : (isHovered ? 300 : Math.min(width * (1 / 3), 300)), height:"100%"}}
      // style={{width:"100%", height:"100%"}}
      onMouseEnter={() => { setIsHovered(true) }}
      onMouseLeave={() => { setIsHovered(false) }}
    >
      {/* <Component type="primary">
        <Header>
          <Row>
            <Left>
              <Heading>{Locale.NextChat.SideBar.ChatList}</Heading>
            </Left>
            <Right>
              <Button
                icon={managing ? <ReturnIcon /> : <ManageIcon />}
                text={managing ? Locale.NextChat.SideBar.Exit : Locale.NextChat.SideBar.Manage}
                onClick={() => { setManaging(!managing) }}
              />
            </Right>
          </Row>
        </Header>
        <ChatList narrow={shouldNarrow} managing={managing} />
        <Footer>
          <Row>
            <Right>
              <Button
                icon={<AddIcon />}
                text={shouldNarrow ? undefined : Locale.NextChat.SideBar.NewChat}
                onClick={() => {
                  //if (config.dontShowMaskSplashScreen) {
                  if (true) {
                    let lastSession = chatStore.sessions[0]
                    if (lastSession.messages.length <= 0) {
                      chatStore.update(sessions => {
                        sessions.sessions[0].lastUpdate = Date.now()
                      })
                      chatStore.selectSession(0)
                    } else {
                      chatStore.newSession();
                      navigate(Path.Chat);
                    }
                  } else {
                    navigate(Path.NewChat);
                  }
                }}
              />
            </Right>
          </Row>
        </Footer>
      </Component> */}
    </div>
  </>);
}
