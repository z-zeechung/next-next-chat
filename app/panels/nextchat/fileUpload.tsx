import { useChatStore } from "@/app/store";
// import { Button, ButtonCard } from "@/app/themes/theme";
import { nanoid } from "nanoid";
import UploadIcon from "../../icons/bootstrap/box-arrow-up.svg"
import Locale from "../../locales"
import { Message } from "@/app/message/Message";

// export function UploadFile() {
//     const chatStore = useChatStore()
//     return <ButtonCard text={Locale.NextChat.ChatArea.UploadFile} icon={<UploadIcon/>} onClick={() => {
//         uploadFile(chatStore)
//     }} />
// }

export function uploadFile(chatStore){
    var input = document.createElement('input')
    input.type = 'file'
    input.multiple = false
    input.accept = "image/*,.doc,.docx,.ppt,.pptx,.pdf,.html,.htm,.txt,.md,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,text/html,text/plain"
    input.onchange = async (e) => {
        const file = input.files?.[0] as File
        let reader = new FileReader()
        reader.onload = async (e) => {
            var src = await chatStore.setLfsData(e.target?.result)
            chatStore.updateCurrentSession(
                session => (session.messages = session.messages.concat([
                    { type: isImageOrDocument(file), src, role: "system", content: `用户上传文件：${file.name}`, fileName: file.name } as Message
                ]))
            )
        }
        reader.readAsDataURL(file)
    }
    input.click()
}

function isImageOrDocument(file) {
    if (file.type.includes("image")) {
        return 'image';
    }
    return 'document';
}