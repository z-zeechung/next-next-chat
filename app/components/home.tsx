"use client";

require("../polyfill");

import { useState, useEffect } from "react";

import styles from "./home.module.scss";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";

import { getCSSVar, useMobileScreen } from "../utils";

import dynamic from "next/dynamic";
import { /*ModelProvider,*/ Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

import { getISOLang, getLang } from "../locales";

import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { useAppConfig } from "../store/config";
import { getClientConfig } from "../config/client";
// import { ClientApi } from "../client/api";
import { useAccessStore } from "../store";
// import { identifyDefaultClaudeModel } from "../utils/checkers";
// import { useAccount } from "../store/account";
import { Button } from "../themes/theme";
import ReturnIcon from "../icons/bootstrap/arrow-90deg-left.svg";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

// const Settings = dynamic(async () => (await import("./settings")).Settings, {
//   loading: () => <Loading noLogo />,
// });

const Chat = dynamic(async () => (await import("./chat")).Chat, {
  loading: () => <Loading noLogo />,
});

// const AuthPage = dynamic(async () => (await import("./auth")).AuthPage, {
//   loading: () => <Loading noLogo />,
// });

const DocumentDocx = dynamic(async () => (await import("../panels/document-docx")).DocumentDocx, {
  loading: () => <Loading noLogo />,
});

const DevPage = dynamic(async () => (await import("../panels/devpage")).DevPage, {
  loading: () => <Loading noLogo />,
});

const AudioPage = dynamic(async () => (await import("../panels/audio")).AudioPage, {
  loading: ( ) => <Loading noLogo />,
})

const KnowledgeBase = dynamic(async () => (await import("../panels/knowledge")).KnowledgeBase, {
  loading: () => <Loading noLogo />,
})

const TestPage = dynamic(async () => (await import("../panels/testpage")).TestPage, {
  loading: () => <Loading noLogo />,
})

// const NewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
//   loading: () => <Loading noLogo />,
// });

// const MaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
//   loading: () => <Loading noLogo />,
// });

// export function useSwitchTheme() {
//   const config = useAppConfig();

//   useEffect(() => {
//     document.body.classList.remove("light");
//     document.body.classList.remove("dark");

//     if (config.theme === "dark") {
//       document.body.classList.add("dark");
//     } else if (config.theme === "light") {
//       document.body.classList.add("light");
//     }

//     const metaDescriptionDark = document.querySelector(
//       'meta[name="theme-color"][media*="dark"]',
//     );
//     const metaDescriptionLight = document.querySelector(
//       'meta[name="theme-color"][media*="light"]',
//     );

//     if (config.theme === "auto") {
//       metaDescriptionDark?.setAttribute("content", "#151515");
//       metaDescriptionLight?.setAttribute("content", "#fafafa");
//     } else {
//       const themeColor = getCSSVar("--theme-color");
//       metaDescriptionDark?.setAttribute("content", themeColor);
//       metaDescriptionLight?.setAttribute("content", themeColor);
//     }
//   }, [config.theme]);
// }

function useHtmlLang() {
  useEffect(() => {
    const lang = getISOLang();
    const htmlLang = document.documentElement.lang;

    if (lang !== htmlLang) {
      document.documentElement.lang = lang;
    }
  }, []);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

// const loadAsyncGoogleFont = () => {
//   const linkEl = document.createElement("link");
//   const proxyFontUrl = "/google-fonts";
//   const remoteFontUrl = "https://fonts.googleapis.com";
//   const googleFontUrl =
//     getClientConfig()?.buildMode === "export" ? remoteFontUrl : proxyFontUrl;
//   linkEl.rel = "stylesheet";
//   linkEl.href =
//     googleFontUrl +
//     "/css2?family=" +
//     encodeURIComponent("Noto Sans:wght@300;400;700;900") +
//     "&display=swap";
//   document.head.appendChild(linkEl);
// };

import chatStyles from "./chat.module.scss";
function Embedded(props:{element}){
  const navigate = useNavigate()
  return <div className={chatStyles.chat}>
    <div className="window-header" data-tauri-drag-region>
    <div className="window-actions">
            <div className={"window-action-button"}>
              <Button
                icon={<ReturnIcon />}
                text="返回"
                onClick={() => navigate("/")}
              />
            </div>
          </div>
    </div>
    {props.element}
  </div>
}

function Screen() {
  const config = useAppConfig();
  const location = useLocation();
  // const account = useAccount();
  // const navigate = useNavigate()
  const isHome = location.pathname === Path.Home;
  // const isAuth = location.pathname === Path.Auth;
  // const isAuth = !account.loginStatus;
  const isMobileScreen = useMobileScreen();
  const shouldTightBorder =
    getClientConfig()?.isApp || (config.tightBorder && !isMobileScreen);

  // useEffect(() => {
  //   loadAsyncGoogleFont();
  // }, []);

  // useEffect(()=>{
  //   if(isAuth) {navigate("/auth")}
  // })

  return (
    <div
      className={
        styles.container
        //  + ` ${shouldTightBorder ? styles["tight-container"] : styles.container} ${
        //   getLang() === "ar" ? styles["rtl-screen"] : ""
        // }`
        + ` ${styles["tight-container"]} `
      }
      style={{
        display:"flex"
      }}
    >
          {/*<SideBar className={isHome ? styles["sidebar-show"] : ""} />*/}
          {[
            "/", 
            "/chat"
          ].includes(location.pathname) && <SideBar show={isHome} />}

          <div className={styles["window-content"]} id={SlotID.AppBody} style={{flex:1}}>
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/chat" element={<Chat />} />
              {/* <Route path="/auth" element={<AuthPage />}/> */}
              <Route path="/test" element={<TestPage />}/>
              <Route path="/docx" element={<Embedded element={<DocumentDocx/>}/>}/>
              <Route path="/devrole" element={<Embedded element={<DevPage/>}/>}/>
              <Route path="/audio" element={<Embedded element={<AudioPage/>}/>}/>
              <Route path="/knowledge" element={<Embedded element={<KnowledgeBase/>}/>}/>
              {/* <Route path={Path.NewChat} element={<NewChat />} /> */}
              {/* <Route path={Path.Masks} element={<MaskPage />} /> */}
              {/* <Route path={Path.Settings} element={<Settings />} /> */}
            </Routes>
          </div>
    </div>
  );
}

export function useLoadData() {
  const config = useAppConfig();

  // var api: ClientApi;
  // if (config.modelConfig.model.startsWith("gemini")) {
  //   api = new ClientApi(ModelProvider.GeminiPro);
  // } else if (identifyDefaultClaudeModel(config.modelConfig.model)) {
  //   api = new ClientApi(ModelProvider.Claude);
  // } else {
  //   api = new ClientApi(ModelProvider.GPT);
  // }
  useEffect(() => {
    (async () => {
      const models = [] // await api.llm.models();
      config.mergeModels(models);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function Home() {
  // useSwitchTheme();
  useLoadData();
  useHtmlLang();

  useEffect(() => {
    console.log("[Config] got config from build time", getClientConfig());
    useAccessStore.getState().fetch();
  }, []);

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  );
}
