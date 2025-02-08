import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";
import { useEffect, useState } from "react";
import { getClientConfig } from "../config/client";
// import { Button, ButtonGroup, List, ListItem, TextArea } from "../themes/theme";

import SendIcon from "../icons/bootstrap/send.svg"
import RegisterIcon from "../icons/bootstrap/person.svg"
import { ClientApi } from "../client/api";
// import { Badge } from "@chakra-ui/react";
import { useAccount } from "../store/account";

export function AuthPage() {
  // const navigate = useNavigate();
  // const accessStore = useAccessStore();

  // const goHome = () => navigate(Path.Home);
  // const goChat = () => navigate(Path.Chat);
  // const resetAccessCode = () => {
  //   accessStore.update((access) => {
  //     access.openaiApiKey = "";
  //     access.accessCode = "";
  //   });
  // }; // Reset access code to empty string

  // useEffect(() => {
  //   if (getClientConfig()?.isApp) {
  //     navigate(Path.Settings);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const account = useAccount()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(undefined)

  const navigate = useNavigate()

  return <>
    {/* <div className={styles["auth-page"]}>
      <List>
        {error&&<ListItem>
          <Badge colorScheme="red" size={"xs"}>用户名或密码无效</Badge>
        </ListItem>}
        <ListItem title="用户名">
          <TextArea rows={1} value={username} onChange={(v)=>{setUsername(v)}}/>
        </ListItem>
        <ListItem title="密码">
          <TextArea rows={1} value={password} onChange={(v)=>{setPassword(v)}}/>
        </ListItem>
        <ListItem>
          <ButtonGroup>
            <Button text="注册" icon={<RegisterIcon/>}/>
            <Button text="登录" type="primary" icon={<SendIcon/>} onClick={()=>{
              ClientApi.login(username, password).then(e=>{
                setError(e)
                if(!e){
                  account.setLoginStatus(true)
                  navigate("/")
                }
              })
            }}/>
            <Button text="稍后再说" type="text" onClick={()=>{
              account.setLoginStatus(true)
              navigate("/")
            }}/>
          </ButtonGroup>
        </ListItem>
      </List>
    </div> */}
  </>

  // return (
  //   <div className={styles["auth-page"]}>
  //     <div className={`no-dark ${styles["auth-logo"]}`}>
  //       <BotIcon />
  //     </div>

  //     <div className={styles["auth-title"]}>{Locale.Auth.Title}</div>
  //     <div className={styles["auth-tips"]}>{Locale.Auth.Tips}</div>

  //     <input
  //       className={styles["auth-input"]}
  //       type="password"
  //       placeholder={Locale.Auth.Input}
  //       value={accessStore.accessCode}
  //       onChange={(e) => {
  //         accessStore.update(
  //           (access) => (access.accessCode = e.currentTarget.value),
  //         );
  //       }}
  //     />
  //     {!accessStore.hideUserApiKey ? (
  //       <>
  //         <div className={styles["auth-tips"]}>{Locale.Auth.SubTips}</div>
  //         <input
  //           className={styles["auth-input"]}
  //           type="password"
  //           placeholder={Locale.Settings.Access.OpenAI.ApiKey.Placeholder}
  //           value={accessStore.openaiApiKey}
  //           onChange={(e) => {
  //             accessStore.update(
  //               (access) => (access.openaiApiKey = e.currentTarget.value),
  //             );
  //           }}
  //         />
  //         <input
  //           className={styles["auth-input"]}
  //           type="password"
  //           placeholder={Locale.Settings.Access.Google.ApiKey.Placeholder}
  //           value={accessStore.googleApiKey}
  //           onChange={(e) => {
  //             accessStore.update(
  //               (access) => (access.googleApiKey = e.currentTarget.value),
  //             );
  //           }}
  //         />
  //       </>
  //     ) : null}

  //     <div className={styles["auth-actions"]}>
  //       <IconButton
  //         text={Locale.Auth.Confirm}
  //         type="primary"
  //         onClick={goChat}
  //       />
  //       <IconButton
  //         text={Locale.Auth.Later}
  //         onClick={() => {
  //           resetAccessCode();
  //           goHome();
  //         }}
  //       />
  //     </div>
  //   </div>
  // );
}
