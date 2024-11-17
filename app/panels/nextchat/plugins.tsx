import { Button, ButtonCard, Modal } from "@/app/themes/theme";
import { useState } from "react";
import PluginIcon from "../../icons/bootstrap/puzzle.svg"

export function PluginMenu(props: {
    children
}) {

    const [show, setShow] = useState(false)

    return <>
        <ButtonCard text="对话插件" icon={<PluginIcon style={{ transform: "rotate(45deg)", scale: "1.15" }} />} popover={
            <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                {props.children.map((btn) => btn)}
                <Button text="更多" onClick={() => {
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
        title="管理插件"
        onClose={props.onClose}
    >

    </Modal>
}