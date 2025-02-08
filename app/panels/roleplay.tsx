import { Avatar, Button, Card, Col, Flex, Input, Modal, Pagination, Row, Tag, Tooltip, Typography } from "antd";
import { useWindowSize } from "../utils";
import { useEffect, useRef, useState } from "react";
import { getLang } from "../locales";
import emojiList from "./nextchat/emoji-list.json"
import { GlobalOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Markdown } from "../components/markdown";
import ClearIcon from "../icons/broom_high_contrast.svg"

export function RolePlay(props:{
    onClose
    setPrompt
    currentRole?:{
        avatar: string,
        name: string
    }
}) {
    const { width, height } = useWindowSize()
    const [bodySize, setBodySize] = useState([0, 0])
    const bodyRef = useRef<HTMLDivElement>(null)
    useEffect(()=>{
        if(bodyRef.current){
            setBodySize([bodyRef.current.clientWidth, bodyRef.current.clientHeight])
        }
    }, [bodyRef.current])
    const [roleList, setRoleList] = useState<{file:string, name: string}[]>([])
    useEffect(()=>{
        fetch("/prompts/index.json").then(async res=>{
            const json = await res.json()
            setRoleList(json.map(r=>{return {
                file: r.file,
                name: r.name[getLang()]
            }}))
        })
    }, [])
    const [_pageSize, setPageSize] = useState(0)
    const pageSize = props.currentRole? _pageSize+1 : _pageSize
    const [offset, setOffset] = useState(0)
    return <Modal
        width={1000}
        onCancel={props.onClose}
        styles={{
            body: {
                height: height - 280
            }
        }}
        title={"选择角色"}
        open={true}
        footer={<Pagination total={roleList.length} pageSize={pageSize} showSizeChanger={false} onChange={(page, pageSize)=>{setOffset((page-1)*pageSize)}} />}
    >
        <div style={{width: "100%", height: "100%"}} ref={bodyRef}>
            <CardGrid 
                width={bodySize[0]} 
                height={bodySize[1]} 
                list={[
                    ...(props.currentRole?[{currentRole:true, name:props.currentRole.name, avatar:props.currentRole.avatar}]:[]),
                    ...roleList
                ].slice(offset, offset+pageSize)} 
                setPageSize={setPageSize} 
                setPrompt={props.setPrompt} 
                onClose={props.onClose}/>
        </div>
    </Modal>
}

function CardGrid(props:{width, height, list: {file?:string, name: string, currentRole?: boolean, avatar?:string}[], setPageSize, setPrompt, onClose}){
    const GRID_WIDTH = 300;
    const GRID_HEIGHT = 180;
    const cols = [1, 2, 3, 4, 6, 8, 12].reduce((prev, curr) => {
        const num = props.width / GRID_WIDTH
        return (Math.abs(num - curr) < Math.abs(num - prev) ? curr : prev);
    }, Infinity);
    const rows = Math.round(props.height / GRID_HEIGHT)

    useEffect(()=>{
        props.setPageSize(rows * cols)
    }, [rows, cols])

    return <Flex vertical style={{width: "100%", height: "100%"}}>
        {Array.from({length: rows}).map((_, i)=>{
            return <Row key={i} style={{height: props.height / rows}}>
                {Array.from({length: cols}).map((_, j)=>{
                    return <Col key={j} span={24/cols} style={{padding:6}}>{
                        props.list[i*cols+j]&&( ! props.list[i*cols+j].currentRole 
                            ? <RoleCard file={props.list[i*cols+j]?.file} name={props.list[i*cols+j]?.name} height={props.height / rows - 12} setPrompt={props.setPrompt} onClose={props.onClose}/>
                            : <CurrentRoleCard name={props.list[i*cols+j].name} avatar={props.list[i*cols+j].avatar??""} setPrompt={props.setPrompt}/>
                        )
                    }</Col>
                })}
            </Row>
        })}
    </Flex>
}

function RoleCard(props:{file?:string, name?: string, height, setPrompt, onClose}){
    const [avatar, setAvatar] = useState(<></>)
    const [_avatar, _setAvatar] = useState("")
    const [author, setAuthor] = useState("")
    const [description, setDescription] = useState("")
    const [homepage, setHomePage] = useState("")
    const [prompt, setPrompt] = useState("")
    const [tools, setTools] = useState([])
    useEffect(()=>{
        if(props.file){
            fetch(`/prompts/prompts/${props.file}`).then(async res=>{
                const json = await res.json()
                if(json?.avatar){
                    if(emojiList.includes(json.avatar)){
                        setAvatar(<Avatar style={{fontSize:"2em", background:"none"}} gap={0}>{json.avatar}</Avatar>)
                    }else{
                        setAvatar(<Avatar src={<img src={json.avatar} />} />)
                    }
                    _setAvatar(json.avatar)
                }
                setAuthor(json?.author)
                setDescription(json?.description[getLang()])
                setHomePage(json?.homepage)
                setPrompt(json.prompt)
                setTools(json?.tools??[])
            })
        }
    }, [props.file])
    return <Card style={{width:"100%", height:"100%"}}
        hoverable
        title={<Flex gap={"small"}>
            {avatar}
            <Tooltip title={props.name}><span style={{maxWidth:120, overflow:"clip", textOverflow:"ellipsis"}}>{props.name}</span></Tooltip>
        </Flex>}
        extra={<Flex>
            {homepage&&<Tooltip title={homepage}><a onClick={(e)=>{window.open(homepage)}}><Tag color="success" icon={<GlobalOutlined />}/></a></Tooltip>}
            {author&&<Tag icon={<UserOutlined />} style={{maxWidth:84, overflow:"clip", textOverflow:"ellipsis"}}>
                <Tooltip title={author}>{author}</Tooltip>
            </Tag>}
        </Flex>}
        styles={{
            header:{
                paddingLeft: 8,
                paddingRight: 0,
                cursor:"auto",
            },
            body:{
                padding:12,
                height: props.height-64,
                cursor:"auto",
            }
        }}
    >
        <Typography.Paragraph style={{fontSize:"0.9em", cursor:"pointer", height:"100%" }} onClick={()=>{
            props.setPrompt({
                avatar: _avatar,
                prompt,
                name: props.name,
                description,
                author,
                tools: tools
            })
            props.onClose()
        }}>
            {description}
        </Typography.Paragraph>
    </Card>
}

function CurrentRoleCard(props:{
    name: string, 
    avatar: string,
    setPrompt
}){
    return <Card
        style={{width:"100%", height:"100%", position:"relative"}}
        title={<Flex gap={"small"}>
            {
                emojiList.includes(props.avatar)
                ? <Avatar style={{fontSize:"2em", background:"none"}} gap={0}>{props.avatar}</Avatar>
                : <Avatar src={<img src={props.avatar} />} />
            }
            正在使用
        </Flex>}
        extra={<Button 
            size="small" icon={<ClearIcon width={16} height={16} viewBox="0 0 32 32"/>}
            onClick={()=>{
                props.setPrompt({
                    avatar: undefined,
                    prompt: undefined,
                    name: undefined,
                    description: undefined,
                    author: undefined,
                    tools: []
                })
            }}
        >停用</Button>}
        styles={{
            header:{
                paddingLeft: 8,
                paddingRight: 12,
                cursor:"auto",
            },
            body:{
                padding:12,
                cursor:"auto",
            }
        }}
    >
        <Markdown content={`
**当前启用角色**： \`${props.name}\`    
        `}/>
    </Card>
}