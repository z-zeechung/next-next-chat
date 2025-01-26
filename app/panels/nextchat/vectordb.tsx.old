import { ErrorBoundary } from "../../components/error";
import { Input, showToast } from "../../components/ui-lib";
import styles from "../../components/mask.module.scss";
import { IconButton } from "../../components/button";
import AddIcon from "../../icons/bootstrap/plus-circle.svg";
import WhatsThisIcon from "../../icons/bootstrap/question.svg"
import ManageIcon from "../../icons/bootstrap/wrench-adjustable.svg"
import DeleteIcon from "../../icons/bootstrap/x-lg.svg"
import ClearIcon from "../../icons/bootstrap/trash3.svg"
import EnableIcon from "../../icons/bootstrap/magic.svg"
import DisableIcon from "../../icons/bootstrap/ban.svg"
import DisableAllIcon from "../../icons/bootstrap/ban-fill.svg"
import { useEffect, useState } from "react";
import { clearVecDB, contentOfVecDB, createVecDB, deleteFromVecDB, deleteVecDB, insertIntoVecDB, listVecDBs, queryVecDBs } from "../../utils/vectordb";
import { createRoot } from "react-dom/client";
import { ChatSession, useChatStore } from "../../store";
import { v4 as uuidv4 } from 'uuid';
import { Button, ButtonGroup, InfoCard, List, ListItem, Modal, showConfirm, TextArea } from "@/app/themes/theme";
import { Card, SimpleGrid } from "@chakra-ui/react";
import { chunkFile } from "./misc";

const PREFIX = "COMMON_VECDB_"

export function ConfigureVectorDBModal(props: {
    setVisible:(isVisible:boolean) => void,
    getActivatedVecDBs:()=>string[],
    setActivatedVecDBs:(vecDBs:string[])=>void
}){
    
    const [currentModal, setCurrentModal] = useState("config")

    const [vecDBList, setVecDBList] = useState(listVecDBs())

    const [newVecDbId, setNewVecDbId] = useState("")
    const [initDocList, setInitDocList] = useState([] as File[])

    const [vecDBToConfig, setVecDBToConfig] = useState("")
    const [vecDBContentList, setVecDBContentList] = useState([] as string[])

    //const [activatedVecDBs, setActivatedVecDBs] = useState([] as string[])

    return (<>
        {currentModal=="config"&&<Modal
            title="管理知识库"
            onClose={()=>{props.setVisible(false)}}
            footer={<ButtonGroup>
                {(props.getActivatedVecDBs().filter(id=>id.startsWith(PREFIX)).length>0)&&<Button
                    text="停用所有"
                    type={"primary"}
                    onClick={()=>{
                        props.setActivatedVecDBs(props.getActivatedVecDBs().filter(id=>(!id.startsWith(PREFIX))))
                    }}
                    icon={<DisableAllIcon/>}
                    key={uuidv4()}
                />}
                <Button
                    text="这是什么"
                    icon={<WhatsThisIcon/>}
                    onClick={()=>{setCurrentModal("what's this")}}
                    key={uuidv4()}
                />
            </ButtonGroup>}
        >
            <ErrorBoundary>
                <div className={styles["mask-page"]} style={{gap:8}}>
                    <Button
                        icon={<AddIcon/>}
                        text={"新建知识库"}
                        onClick={() => {setCurrentModal("add")}}
                    />
                    <p/>
                    {vecDBList.filter(name => name.startsWith(PREFIX)).length > 0 ? <SimpleGrid templateColumns={`repeat(auto-fill, minmax(${200}px, 1fr))`} gap={4}>
                        {vecDBList.map((m, index) => {
                            if (!m.startsWith(PREFIX)) { return }
                            return (<Card key={index} background={"#00000000"} shadow={"none"}>
                                <InfoCard title={m.substring(PREFIX.length)} subTitle={`${contentOfVecDB(m).length}篇文档`}>
                                    <ButtonGroup>
                                        <Button
                                            text={props.getActivatedVecDBs().includes(m) ? "停用" : "启用"}
                                            onClick={() => {
                                                let copy = [...props.getActivatedVecDBs()]
                                                if (props.getActivatedVecDBs().includes(m)) { copy = copy.filter(v => v !== m) }
                                                else { copy = copy.concat([m]) }
                                                props.setActivatedVecDBs(copy)
                                            }}
                                            type={props.getActivatedVecDBs().includes(m) ? "primary" : "text"}
                                            icon={props.getActivatedVecDBs().includes(m) ? <DisableIcon /> : <EnableIcon />}
                                        />
                                        <Button
                                            text="管理"
                                            icon={<ManageIcon />}
                                            onClick={() => { setVecDBToConfig(m); setVecDBContentList(contentOfVecDB(m)); setCurrentModal("configVecDB") }}
                                            type="text"
                                        />
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Button
                                            text="删除"
                                            icon={<DeleteIcon />}
                                            onClick={async () => {
                                                props.setVisible(false)
                                                if (!(await showConfirm("", <>这将删除所选知识库。要继续吗？</>))) { props.setVisible(true); return }
                                                props.setVisible(true)
                                                deleteVecDB(m)
                                                setVecDBList(listVecDBs())
                                                showToast(`已删除知识库！`)
                                            }}
                                            type="text"
                                        />
                                        <Button
                                            text="清空"
                                            icon={<ClearIcon />}
                                            onClick={async () => {
                                                props.setVisible(false)
                                                if (!(await showConfirm("", <>{"这将清空所选知识库。要继续吗？"}</>))) { props.setVisible(true); return }
                                                props.setVisible(true)
                                                clearVecDB(m)
                                                showToast(`已清空知识库数据！`)
                                            }}
                                            type="text"
                                        />
                                    </ButtonGroup>
                                </InfoCard>
                            </Card>)
                        })}
                    </SimpleGrid> : <>&nbsp;暂时没有知识库</>}
                </div>
            </ErrorBoundary>
        </Modal>}
        {currentModal=="add"&&<Modal
            title="新建知识库"
            onClose={()=>{setNewVecDbId("");setInitDocList([]);setCurrentModal("config")}}
        >
            <ErrorBoundary>
                <div className={styles["mask-page"]}>
                    <List>
                        <ListItem
                            title="名称"
                        >
                            <TextArea
                                rows={1}
                                onInput={(v)=>{
                                    setNewVecDbId(v)
                                }}
                            />
                        </ListItem>
                        <ListItem
                            title="内容"
                            subTitle={`已添加${initDocList.length}篇`}
                        >
                            <Button
                                text="添加"
                                icon={<AddIcon/>}
                                onClick={()=>{
                                    var input = document.createElement('input')
                                    input.type = 'file'
                                    input.multiple=true
                                    input.accept=".doc,.docx,.ppt,.pptx,.pdf,.html,.htm,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,text/html,text/plain"
                                    input.onchange=((e)=>{
                                        let list = initDocList
                                        if(input.files==null) {return}
                                        let contains = (file:File, files:File[])=>{
                                            for(let f of files){
                                                if(f.name==file.name){return true}
                                            }
                                            return false
                                        }
                                        for(let f of input.files){
                                            if(contains(f, list)) {showToast(`已忽略重复添加的文档“${f.name}”`); continue}
                                            list = list.concat([f])
                                        }
                                        setInitDocList(list)
                                    })
                                    input.click()
                                }}
                            />
                        </ListItem>
                    </List>
                    <Button 
                        text="确定"
                        onClick={()=>{
                            if(newVecDbId==""){
                                showToast("知识库名称不能为空！")
                                return
                            }
                            if(listVecDBs().includes(PREFIX+newVecDbId)){
                                showToast("不能与已存在的知识库重名！")
                                return
                            }
                            createVecDB(PREFIX+newVecDbId)
                            props.setVisible(false)
                            InsertProgress(initDocList, PREFIX+newVecDbId, ()=>{
                                setCurrentModal("config")
                                props.setVisible(true)
                            })
                            setNewVecDbId("")
                            setInitDocList([])
                            setVecDBList(listVecDBs())
                        }}
                    />
                </div>
            </ErrorBoundary>
        </Modal>}
        {currentModal=="what's this"&&<Modal
            title="这是什么？"
            onClose={()=>{setCurrentModal("config")}}
        >
        
        </Modal>}
        {currentModal=="configVecDB"&&<Modal
            title="管理知识库"
            onClose={()=>{setCurrentModal("config")}}
        >
            <ErrorBoundary>
            <div className={styles["mask-page"]}>
                <Button
                    icon={<AddIcon/>}
                    text={"添加文档"}
                    onClick={async () => {
                        var input = document.createElement('input')
                        input.type = 'file'
                        input.multiple=true
                        input.accept=".doc,.docx,.ppt,.pptx,.pdf,.html,.htm,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,text/html,text/plain"
                        input.onchange=((e)=>{
                            if(input.files==null || input.files.length<=0) {return}
                            let list:File[] = []
                            for(let f of input.files){
                                list = list.concat([f])
                            }
                            props.setVisible(false)
                            InsertProgress(list, vecDBToConfig, ()=>{
                                props.setVisible(true)
                                setVecDBContentList(contentOfVecDB(vecDBToConfig))
                            })
                        })
                        input.click()
                    }}
                />
                <p/>
                {vecDBContentList.length>0?<List>
                    {vecDBContentList.map((m)=>{
                        return <ListItem
                            title={m}
                            key={uuidv4()}
                        >
                            <Button
                                icon={<DeleteIcon/>}
                                text="删除"
                                onClick={()=>{
                                    deleteFromVecDB(vecDBToConfig, m)
                                    setVecDBContentList(contentOfVecDB(vecDBToConfig))
                                }}
                            />
                        </ListItem>
                    })}
                </List>:<>&nbsp;知识库为空</>}
            </div>
            </ErrorBoundary>
        </Modal>}
    </>)
}

async function InsertProgress(files: File[], vecDB: string, onClose:()=>void){
    if(files.length<=0) {onClose();return}
    const div = document.createElement("div")
    div.className = "modal-mask";
    document.body.appendChild(div)
    const root = createRoot(div)
    const closeModal = ()=>{
        root.unmount()
        div.remove()
        onClose()
    }

    function Progress(){
        const [info, setInfo] = useState("准备中……")
        useEffect(()=>{
            (async ()=>{
                for(let i=0;i<files.length;i++){
                    setInfo(`正在处理 ${files[i].name} （${i+1}/${files.length}）`)
                    let chunks = await chunkFile(files[i])
                    insertIntoVecDB(vecDB, files[i].name, chunks.map(t=>{return {title:t, content:t}}))
                }
                setInfo("完毕")
                closeModal()
            })()
            return ()=>{};
        })
        return (<Modal
            title="正在处理……"
            onClose={closeModal}
        >
            {info}
        </Modal>)
    }

    root.render(<Progress/>)
}