import { Button, ButtonCard, Modal } from "@/app/themes/theme";
import { useState } from "react";
import PluginIcon from "../../icons/bootstrap/puzzle.svg"
import Locale from "@/app/locales"

export function PluginMenu(props: {
    children
}) {

    const [show, setShow] = useState(false)

    return <>
        <ButtonCard text={Locale.NextChat.ChatArea.ChatPlugins} icon={<PluginIcon style={{ transform: "rotate(45deg)", scale: "1.15" }} />} popover={
            <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                {props.children.map((btn) => btn)}
                <Button text={Locale.NextChat.ChatArea.More} onClick={() => {
                    setShow(!show)
                }} />
            </div>
        } />
        {show && <PluginMenuModal onClose={() => {
            setShow(false)
        }} />}
    </>
}

function PluginMenuModal(props: {
    onClose
}) {
    return <Modal
        title={Locale.NextChat.ChatArea.ManagePlugins}
        onClose={props.onClose}
    >

    </Modal>
}