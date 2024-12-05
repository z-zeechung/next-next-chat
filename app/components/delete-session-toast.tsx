import { Group, showToast, TextBlock, TinyButton } from "../themes/theme";
import Locale from "../locales"

export function deteteSessionToast(onClick:()=>void){
    return showToast(<Group>
        <TextBlock>
            {Locale.NextChat.ChatArea.AlreadyDeletedChat}
        </TextBlock>
        <TinyButton text={Locale.NextChat.ChatArea.Revert} onClick={()=>{onClick()}} type="primary"/>
    </Group>)
}