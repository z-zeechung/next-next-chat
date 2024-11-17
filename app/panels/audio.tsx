import { useState } from "react"
import { Button, TextArea } from "../themes/theme"
import { ClientApi } from "../client/api"
import { useNavigate } from "react-router"

import AudioIcon from "../icons/bootstrap/music-note-beamed.svg"

export function AudioButton(){
    const navigate = useNavigate()
    return <Button text="音频" type="primary" icon={<AudioIcon />} onClick={() => {
        navigate("/audio")
    }}/>
}

export function AudioPage() {

    const [text, setText] = useState('')

    return <div>
        <Button text="选择音频" onClick={async () => {
            var input = document.createElement('input')
            input.type = 'file'
            input.multiple = false
            input.onchange = (async (e) => {
                setText(await ClientApi.stt(input.files[0]));
            })
            input.click()
        }} />
        识别结果：<TextArea
            value={text}
        />

        <br/>
        语音识别接口，即ClientApi.stt，使用方法如上所示。输入可以是音频文件或音频URL，返回识别后的文本<br/>
        UI系统的文档我还没写，我抓紧补上<br/>
        剩下的交给你自由发挥喽，没啥头绪可以先试着把通义听悟复现出来
    </div>
}