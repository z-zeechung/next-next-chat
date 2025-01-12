import { RollbackOutlined } from "@ant-design/icons";
import Locale from "../locales"
import { Button, Flex, message } from "antd";

export function deteteSessionToast(onClick:()=>void, silent:boolean){
    if(silent) return new Promise<void>(r=>{r()})
    return new Promise<void>(resolve=>{
        message.info(<Flex gap={"middle"}>
            {Locale.NextChat.ChatArea.AlreadyDeletedChat}
            <Button size="small" shape="round" color="primary" variant="filled" icon={<RollbackOutlined />} onClick={onClick}>{Locale.NextChat.ChatArea.Revert}</Button>
        </Flex>
        , undefined, ()=>{resolve()})
    })
}