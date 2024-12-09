import { useState } from "react"
import { Button, PopoverItem, TextArea } from "../themes/theme"
import { ClientApi } from "../client/api"
import { useNavigate } from "react-router"
import Locale from "../locales";

import AudioIcon from "../icons/bootstrap/music-note-beamed.svg"

export function AudioPopoverItem(){
    const navigate = useNavigate()
    return <PopoverItem text={Locale.NextChat.ChatArea.Audio} icon={<AudioIcon />} onClick={() => {
        navigate("/audio")
    }}/>
}

export function AudioPage() {

    const [text, setText] = useState('')

    return <div>
        
    </div>
}