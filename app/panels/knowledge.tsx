import { PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Dropdown, Flex, Form, Input, Layout, List, Modal, Row, Splitter, Tag, Tooltip, Typography, Upload, UploadFile } from "antd";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { addToKB, createKB, deleteFromKB, deleteKB, getInspectDataOfKB, getKB, listKBs, queryFromKB } from "../knowledgebase/knowledgebase";
import { title } from "process";
import { Markdown } from "../components/markdown";
import { copyMessage } from "../message/Message";
import { InspectKeywordKB } from "./knowledge/InspectKeywordKB";

export function KnowledgeBase(){
    const [creatingKB, setCreatingKB] = useState<"keyword"|"">("")
    const [managingKB, setManagingKB] = useState("")
    const [inspectingKB, setInspectingKB] = useState("")
    const [kbList, setKBList] = useState(listKBs())
    const contentRef = useRef<HTMLDivElement>(null)
    const [contentWidth, setContentWidth] = useState(0)
    useEffect(()=>{
        if(contentRef.current){
            setContentWidth(contentRef.current.clientWidth)
        }
    }, [contentRef.current])
    return <Layout style={{width: '100%', height: '100%'}}>
        <Layout.Header style={{background:"#f5f5f5"}}>

        </Layout.Header>
        <Layout.Content ref={contentRef} style={{overflowY:"scroll"}}>
            <CardGrid width={contentWidth} list={kbList.map((kb, i)=><Card
                key={i}
                actions={[
                    <a key={"manage"} onClick={()=>{
                        setManagingKB(kb.id)
                    }}>管理</a>,
                    <a key={"inspect"} onClick={()=>{
                        setInspectingKB(kb.id)
                    }}>查看</a>,
                    <Dropdown key={"more"} menu={{items:[
                        {
                            key:"delete",
                            label:"删除",
                            danger:true,
                            onClick:()=>{
                                Modal.confirm({
                                    content:"",
                                    onOk:()=>{
                                        deleteKB(kb.id)
                                        setKBList(kbList.filter(k=>k.id !== kb.id))
                                    },
                                    okButtonProps:{danger:true}
                                })
                            }
                        }
                    ]}}>
                        更多
                    </Dropdown>
                ]}
            >
                <Card.Meta
                    title={kb.name}
                    description={{
                        "keyword":"传统知识库",
                        "vector":"向量知识库"
                    }[kb.type]+`，${[...new Set(kb.chunkIndex.map(c=>c.src.title))].length} 篇文档`}
                />
            </Card>)}/>
        </Layout.Content>
        <Layout.Footer>
            <Flex
                style={{width:"100%"}}
                justify="end"
            >
                <Dropdown 
                    menu={{items:[
                        {
                            key:"keyword",
                            label:"传统知识库",
                            onClick:()=>{setCreatingKB("keyword")}
                        }
                    ]}}
                >
                    <Button>新建知识库</Button>
                </Dropdown>
            </Flex>
        </Layout.Footer>
        {creatingKB !== "" && <CreateKBModal 
            type={creatingKB}
            onClose={()=>{setCreatingKB("")}}
        />}
        {managingKB !== "" && <ManageKBModal 
            id={managingKB}
            onClose={()=>{setManagingKB("")}}
        />}
        {inspectingKB !== "" && <InspectKBModal
            id={inspectingKB}
            onClose={()=>{setInspectingKB("")}}
        />}
    </Layout>
}

function CreateKBModal(props:{type, onClose}){
    const [name, setName] = useState("")
    const [files, setFiles] = useState<(UploadFile)[]>([])
    return <Modal
        open={props.type !== ""}
        onCancel={props.onClose}
        styles={{
            body:{overflow:"scroll", maxHeight:"50vh"}
        }}
        footer={null}
    >
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
            validateMessages={{
                required: "${name} 不能为空",
                string:{
                    range: "${name} 长度应不少于 ${min} 个字符"
                }
            }}
        >
            <Form.Item<string>
                label="知识库名称" name={"知识库名称"}
                rules={[{
                    required: true,
                    max: 20,
                    min: 3
                }]}
            >
                <Input maxLength={20} value={name} onChange={(e)=>{setName(e.target.value)}}/>
            </Form.Item>
            <Form.Item
                label="上传文件"
            >
                <Upload
                    onChange={(e)=>{
                        setFiles(e.fileList)
                    }}
                    multiple
                    accept=".doc,.docx,.ppt,.pptx,.pdf,.html,.htm,.txt,.md,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,text/html,text/plain"
                >
                    <Button>上传</Button>
                </Upload>
            </Form.Item>
            <Form.Item label={null}>
                <Flex gap={"middle"}>
                    <Button 
                        type="primary" htmlType="submit"
                        onClick={async ()=>{
                            const id = await createKB(name, props.type)
                            await addToKB(id, files.map(file=>file.originFileObj).filter(file=>file !== undefined) as File[])
                            props.onClose()
                        }}
                    >
                        创建知识库
                    </Button>
                    <Button onClick={props.onClose}>取消</Button>
                </Flex>
            </Form.Item>
        </Form>
    </Modal>
}

function CardGrid(props:{width, list: any[]}){
    const GRID_WIDTH = 300;
    const cols = [1, 2, 3, 4, 6, 8, 12].reduce((prev, curr) => {
        const num = props.width / GRID_WIDTH
        return (Math.abs(num - curr) < Math.abs(num - prev) ? curr : prev);
    }, Infinity);

    return <Flex vertical style={{width: "100%", height: "100%"}}>
        {Array.from({length: props.list.length / cols + 1}).map((_, i)=>{
            return <Row key={i}>
                {Array.from({length: cols}).map((_, j)=>{
                    return <Col key={j} span={24/cols} style={{padding:6}}>{
                        props.list[i*cols+j]
                    }</Col>
                })}
            </Row>
        })}
    </Flex>
}

function ManageKBModal(props:{id, onClose}){
    const kb = getKB(props.id)!
    const _index:{title: string, chunkIds: string[]}[] = []
    for(const chunk of kb.chunkIndex){
        if(_index.find(i=>i.title === chunk.src.title)){
            _index.find(i=>i.title === chunk.src.title)!.chunkIds.push(chunk.id)
        }else{
            _index.push({
                title: chunk.src.title,
                chunkIds: [chunk.id]
            })
        }
    }
    const [index, setIndex] = useState(_index)
    return <Modal
        open={true}
        onCancel={props.onClose}
        title={kb.name+" | "+{
            "keyword":"传统知识库",
            "vector":"向量知识库"
        }[kb.type]}
    >
        <List
            itemLayout="horizontal"
            dataSource={index.map(index=>{return {
                title: index.title,
            }})}
            renderItem={(item)=><List.Item
                actions={[
                    <Button key={"list-edit"} danger size="small"
                        onClick={async ()=>{
                            await deleteFromKB(props.id, index.find(i=>i.title==item.title)!.chunkIds)
                            setIndex(index.filter(i=>i.title!==item.title))
                        }}
                    >删除</Button>
                ]}
            >
                <List.Item.Meta
                    title={item.title}
                    description={`${index.find(i=>i.title==item.title)!.chunkIds.length} 个切片`}
                />
            </List.Item>}
        />
    </Modal>
}

function InspectKBModal(props:{id, onClose}){
    const kb = getKB(props.id)!
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([{
        score: 0.987654321,
        content:"foobar",
        src: {
            title: "foobar",
            url: "https://www.baidu.com"
        }
    }])
    return <Modal
        open={true}
        onCancel={props.onClose}
        title={kb.name+" | "+{
            "keyword":"传统知识库",
            "vector":"向量知识库"
        }[kb.type]}
        style={{top:"10vh"}}
        width={1000}
    >
        <Splitter style={{width:"100%", height:"60vh"}}>
            <Splitter.Panel defaultSize={"61.8%"} min="30%" max={"80%"}>
                <InspectKeywordKB id={props.id}/>
            </Splitter.Panel>
            <Splitter.Panel defaultSize={"38.2%"} min="20%" max={"80%"}>
                <Flex justify="center" gap={"small"}>
                    <Input value={query} onChange={e=>setQuery(e.target.value)}/>
                    <Button type="primary" onClick={async()=>{
                        setResults(await queryFromKB(props.id, query, 10))
                    }}>检索</Button>
                </Flex>
                <List
                    itemLayout="horizontal"
                    dataSource={results}
                    renderItem={(item)=><List.Item>
                        <List.Item.Meta
                            title={<Flex>
                                <Tag >{(item.score).toFixed(1)}%</Tag>
                                <Tag onClick={()=>{
                                    copyMessage({role:"system", content:item.content, type:"text"})
                                }}>复制</Tag>
                                <Tag >{item.src.title}</Tag>
                            </Flex>}
                            description={<Tooltip title={<div style={{height:"20vh", overflow:"scroll"}} onClick={()=>{copyMessage({role:"system", content:item.content, type:"text"})}}>
                                <Markdown content={item.content}/>
                            </div>}>
                                <div style={{height:"5em", overflow:"clip"}}>
                                    {item.content}
                                </div>
                            </Tooltip>}
                        />
                    </List.Item>}
                />
            </Splitter.Panel>
        </Splitter>
    </Modal>
}