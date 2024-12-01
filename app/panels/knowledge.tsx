import { useState } from "react";
import { Button, ButtonCard, ButtonGroup, InfoCard, List, ListItem, Modal, showConfirm, TextArea } from "../themes/theme";
import { showToast } from "../components/ui-lib";
import { KnowledgeBase as KnowledgeBaseClass } from "../knowledgebase/knowledgebase";
import { SimpleGrid } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { Markdown } from "../components/markdown";

import AddIcon from "../icons/bootstrap/plus-lg.svg"
import WhatsThisIcon from "../icons/bootstrap/question-lg.svg"
import ISeeIcon from "../icons/bootstrap/lightbulb.svg"
import KeywordIcon from "../icons/bootstrap/body-text.svg"
import VectorIcon from "../icons/bootstrap/bar-chart-steps.svg"
import GraphIcon from "../icons/bootstrap/share.svg"
import ConfirmIcon from "../icons/bootstrap/check-lg.svg"
import CancelIcon from "../icons/bootstrap/slash-circle.svg"
import DeleteIcon from "../icons/bootstrap/trash3.svg"
import EditIcon from "../icons/bootstrap/pencil.svg"
import KnowledgeBaseIcon from "../icons/bootstrap/journals.svg"

import { useNavigate } from "react-router-dom";
import Locale from "../locales";

export function KnowledgeBaseButton(){
  const navigate = useNavigate()
  return <ButtonCard text={Locale.NextChat.ChatArea.KnowledgeBase} icon={<KnowledgeBaseIcon />} onClick={()=>{
    navigate("/knowledge")
  }}/>
}

export function KnowledgeBase() {

  const [creatingKB, setCreatingKB] = useState(undefined as "vector" | "keyword" | "graph" | undefined)
  const [editingKB, setEditingKB] = useState(undefined as string | undefined)
  const [showWhatsThis,  setShowWhatsThis] = useState(false)

  const typeNameMap = { vector: Locale.KnowledgeBase.VectorKB, keyword: Locale.KnowledgeBase.KeywordKB, graph: Locale.KnowledgeBase.GraphKB }
  const typeIconMap = {vector: <VectorIcon />, keyword: <KeywordIcon />, graph: <GraphIcon />}

  const [storeList, setStoreList] = useState(KnowledgeBaseClass.list())

  return <>
    <div style={{ height: "100%", padding: 16, overflowY: "auto" }}>
      <SimpleGrid templateColumns={`repeat(auto-fill, minmax(${250}px, 1fr))`} gap={4}>
        {storeList.map(kb =>
          <InfoCard icon={typeIconMap[kb.type]} title={kb.id} subTitle={Locale.KnowledgeBase.SubTitle(typeNameMap[kb.type], kb.docs.length)}>
            <ButtonGroup>
              <Button text={Locale.KnowledgeBase.Edit} icon={<EditIcon />} type="primary" onClick={() => {
                setEditingKB(kb.id)
              }} />
              <Button text={Locale.KnowledgeBase.Delete} icon={<DeleteIcon/>} type="primary" onClick={() => {
                showConfirm(Locale.KnowledgeBase.DeleteKB, <>{Locale.KnowledgeBase.ConfirmDeleteKB(kb.id)}</>).then(async _ => {
                  await new KnowledgeBaseClass(kb.id).delete()
                  setStoreList(KnowledgeBaseClass.list())
                })
              }} />
            </ButtonGroup>
          </InfoCard>
        )}
      </SimpleGrid>
    </div>
    <hr />
    <div style={{ textAlign: "end", padding: 12 }}>
      <ButtonGroup>
        <Button text={Locale.KnowledgeBase.New} type="primary" icon={<AddIcon />} popover={
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Button text={Locale.KnowledgeBase.KeywordKB} icon={<KeywordIcon/>} onClick={() => setCreatingKB("keyword")} />
            <Button text={Locale.KnowledgeBase.VectorKB} icon={<VectorIcon/>} onClick={() => setCreatingKB("vector")} />
            <Button text={Locale.KnowledgeBase.GraphKB} icon={<GraphIcon/>} onClick={() => setCreatingKB("graph")} />
          </div>
        } />
        <Button text={Locale.KnowledgeBase.WhatsThis} icon={<WhatsThisIcon />} onClick={() => setShowWhatsThis(true)} />
      </ButtonGroup>
    </div>

    {creatingKB && <CreateKbModal useCreatingKB={[creatingKB, setCreatingKB]} useStoreList={[storeList, setStoreList]} />}

    {editingKB && <EditKbModal useEditingKB={[editingKB, setEditingKB]} useStoreList={[storeList, setStoreList]} />}

    {showWhatsThis && <Modal
      title={Locale.KnowledgeBase.WhatsThis}
      onClose={() => setShowWhatsThis(false)}
      footer={<Button text={Locale.KnowledgeBase.ISee} icon={<ISeeIcon />} onClick={() => setShowWhatsThis(false)}/>}
    >
      <Markdown content={Locale.KnowledgeBase.Explaination}/>
    </Modal>}
  </>
}

function CreateKbModal(props: {
  useCreatingKB
  useStoreList
}) {

  const [creatingKB, setCreatingKB] = props.useCreatingKB
  const [storeList, setStoreList] = props.useStoreList
  const [name, setName] = useState("")

  const typeNameMap = { vector: Locale.KnowledgeBase.VectorKB, keyword: Locale.KnowledgeBase.KeywordKB, graph: Locale.KnowledgeBase.GraphKB }

  return <Modal
    onClose={() => setCreatingKB(undefined)}
    title={Locale.KnowledgeBase.NewKB(typeNameMap[creatingKB])}
    footer={<ButtonGroup>
      <Button text={Locale.KnowledgeBase.Cancel} icon={<CancelIcon/>} onClick={() => setCreatingKB(undefined)} />
      <Button text={Locale.KnowledgeBase.Confirm} icon={<ConfirmIcon/>} type="primary" onClick={() => {
        if (name.trim().length <= 0) {
          showToast(Locale.KnowledgeBase.KBNameNotEmpty)
        }
        if (KnowledgeBaseClass.list().find(kb => kb.id === name)) {
          showToast(Locale.KnowledgeBase.KBAlreadyExists)
        }
        new KnowledgeBaseClass(name, creatingKB)
        showToast(Locale.KnowledgeBase.SuccessfullyCreatedKB(typeNameMap[creatingKB], name))
        setCreatingKB(undefined)
        setStoreList(KnowledgeBaseClass.list())
      }} />
    </ButtonGroup>}
  >
    <List>
      <ListItem title={Locale.KnowledgeBase.Name}>
        <TextArea rows={1} value={name} onChange={v => setName(v)} />
      </ListItem>
    </List>
  </Modal>
}

function EditKbModal(props: {
  useEditingKB
  useStoreList
}) {
  const [editingKB, setEditingKB] = props.useEditingKB
  const [storeList, setStoreList] = props.useStoreList

  const kbType = new KnowledgeBaseClass(editingKB).type

  return <Modal
    title={Locale.KnowledgeBase.EditKB(editingKB)}
    onClose={() => { setEditingKB(undefined) }}
    footer={<ButtonGroup>
      <Button text={Locale.KnowledgeBase.AddDoc} icon={<AddIcon/>} type="primary" onClick={() => {
        var input = document.createElement('input')
        input.type = 'file'
        input.multiple = true
        input.accept = ".docx"
        input.onchange = (async (e) => {
          new KnowledgeBaseClass(editingKB).add(Array.from((e.target as any).files)).then(()=>{
            setStoreList(KnowledgeBaseClass.list())
            showToast(Locale.KnowledgeBase.SuccessfullyAddDocument)
            setEditingKB(undefined)
          })
        })
        input.click()
      }} />
      <Button text={Locale.KnowledgeBase.Done} icon={<ConfirmIcon/>} type="primary" onClick={()=>{setEditingKB(undefined)}}/>
    </ButtonGroup>}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 12}}>
      {new KnowledgeBaseClass(editingKB).listDocs().map(doc=>
        <InfoCard title={doc}>
            {kbType!="graph" && <Button text={Locale.KnowledgeBase.Delete} icon={<DeleteIcon/>} onClick={async ()=>{
              await new KnowledgeBaseClass(editingKB).deleteDoc(doc)
              setStoreList(KnowledgeBaseClass.list())
              showToast(Locale.KnowledgeBase.SuccessfullyDeletedDocument(doc))
            }}/>}
        </InfoCard>
      )}
    </div>
  </Modal>
}