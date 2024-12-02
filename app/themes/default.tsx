import { Theme } from "./theme"
import { AlertDialog, Button, ButtonGroup, Card, CardBody, ChakraProvider, FormControl, FormLabel, Icon, IconButton, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement, Switch, Textarea, useDisclosure, Text, Flex, CardHeader, Avatar, Heading, Box, Checkbox, ComponentWithAs, ButtonProps, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverHeader, Tabs, TabList, Tab, TabPanels, TabPanel, Select, CardFooter } from '@chakra-ui/react'
import styles from "../components/ui-lib.module.scss";
import buttonStyles from "../components/button.module.scss"
import chatStyles from "../components/chat.module.scss"
import homeStyles from "../components/home.module.scss"
import { memo, useEffect, useRef, useState } from "react";
import MaxIcon from "../icons/bootstrap/fullscreen.svg";
import MinIcon from "../icons/bootstrap/fullscreen-exit.svg";
import CloseIcon from "../icons/bootstrap/x-lg.svg";
import ConfirmIcon from "../icons/bootstrap/check-lg.svg";
import CancelIcon from "../icons/bootstrap/slash-circle.svg";
import DeleteIcon from "../icons/bootstrap/trash3.svg"
import { createRoot } from "react-dom/client";
import { MessageRole } from "../typing";
import { autoGrowTextArea, useMobileScreen, useWindowSize } from "../utils";
import ReedsTexture from "../icons/bg-reeds.bmp"
import { ReactElement } from "react-markdown/lib/react-markdown";
import { nanoid } from "nanoid";

export const Default:Theme = {
    wrapper:ChakraProvider,
    messageCard:ThemeMessage,
    chatHistory:ThemeChatHistory,
    button:ThemeButton,
    tinyButton:ThemeTinyButton,
    buttonGroup:ThemeButtonGroup,
    buttonCard:ThemeButtonCard,
    chatCard:ThemeChatCard,
    infoCard:ThemeInfoCard,
    textArea:ThemeTextArea,
    checkBox:ThemeCheckBox,
    modal:ThemeModal,
    avatar:ThemeAvatar,
    list:ThemeList,
    listItem:ThemeListItem,
    tabs:ThemeTabs,
    select:ThemeSelect,
    showConfirm:showConfirm
}

function ThemeMessage(props?:{
    children?:any
    type?:MessageRole
}){
    return <div className={chatStyles["chat-message-item"]}
        style={{
            background:props?.type=="user"?"#319795":(props?.type=="system"?"#B2F5EA":"#EDF2F7"),
            color:props?.type=="user"?"#fff":"#000",
        }}
    >
        {props?.children}
    </div>
}

// 预读取图片数据
// 大文件读取不能放在useEffect里，不然每次重渲都会读一次，开销很大
// let BackgroundTexture:string|undefined = undefined
// async function loadBackground(){
//     if(BackgroundTexture) return BackgroundTexture
//     return new Promise((resolve)=>{
//         const imageUrl = ReedsTexture.src;
//         const img = new Image();
//         img.onload = () => {
//             const canvas = document.createElement('canvas');
//             const ctx = canvas.getContext('2d');
//             canvas.width = img.width;
//             canvas.height = img.height;
//             ctx?.drawImage(img, 0, 0, img.width, img.height);
//             if(ctx == null) return
//             const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//             const data = imageData.data;
//             for (let i = 0; i < data.length; i += 4) {
//               if(data[i]==255){data[i+3]=0}
//               else{data[i]=255;data[i+1]=255;data[i+2]=255;data[i+3]=200}
//             }
//             ctx.putImageData(imageData, 0, 0);
//             const dataUrl = canvas.toDataURL('image/png'); 
//             resolve(dataUrl);
//             BackgroundTexture = dataUrl
//         };
//         img.src = imageUrl;
//     })
// }

function ThemeChatHistory(props?:{
    children?:any
    show?:boolean
}){
    const isMobileScreen = useMobileScreen();
    const { width } = useWindowSize();
    const divRef = useRef(null)
    const imgRef = useRef(null)
    const [divWidth, setDivWidth] = useState(300)
    const [isHovered, setIsHovered] = useState(false);
    // useEffect(()=>{
    //     loadBackground().then((url)=>{
    //         if(imgRef.current){
    //             (imgRef.current as any).src = url
    //         }
    //     })

    //     const resizeObserver = new ResizeObserver(entries=>{
    //         for(let entry of entries){
    //             setDivWidth(entry.borderBoxSize[0].inlineSize)
    //         }
    //     })
    //     if(divRef.current){
    //         resizeObserver.observe(divRef.current)
    //     }
    //     return ()=>{
    //         if(divRef.current){
    //             resizeObserver.unobserve(divRef.current)
    //         }
    //     }
    // })
    
    return <div
        ref={divRef}
        className={`
            ${homeStyles.sidebar}
            ${props?.show&&homeStyles["sidebar-show"]}
        `}
        style={{
            background:"#319795",
            color:"#fff",
            width:isMobileScreen?"":(isHovered?300:Math.min(width*(1/3), 300))
        }}
        onMouseEnter={()=>{setIsHovered(true)}}
        onMouseLeave={()=>{setIsHovered(false)}}
    >
        {/* <img 
            ref={imgRef}
            style={{
                position:"absolute",
                bottom:"0",
                left:"0",
                width:divWidth
            }}
        /> */}
        {props?.children}
    </div>
}

function themePopover(button, children){
    return <Popover>
    <PopoverTrigger>
        {button}
    </PopoverTrigger>
    <PopoverContent width={"fit-content"}>
        <PopoverArrow />
        <PopoverCloseButton size={"lg"}/>
        <PopoverBody width={"fit-content"}>
            <table>
                <tr>
                    <td>{children}</td>
                    <td width={"48px"}></td>
                </tr>
            </table>
        </PopoverBody>
    </PopoverContent>
</Popover>
}

function ThemeButton(props: {
    icon?:JSX.Element
    text?:string
    onClick?:() => void
    type?:string
    disabled?:boolean
    embed?:"left"|"right"
    popover?:any
}){
    let type = "outline"
    if(props.type=="primary") type="solid"
    if(props.type=="text") type="ghost"
    if(props.type=="danger") type="solid"

    let danger = props.type=="danger"

    if(!props.text&&!props.embed){
        return <ThemeIconButton
            icon={props.icon}
            onClick={props.onClick}
            type={type}
            disabled={props.disabled}
            size="sm"
            popover={props.popover}
        />
    }

    const ret = <Button 
        size={"sm"}
        colorScheme={danger?"red":(props.disabled?'gray':'teal')}
        leftIcon={props.icon}
        onClick={()=>{
            if(!props.disabled){
                (props.onClick??(()=>{}))()
            }
        }}
        variant={type}
        disabled={props.disabled}
        style={{
            fontSize:"14px",
            fontWeight:"normal",
            background:(type=="outline"&&!props.disabled)?"#fff":""
        }}
        {... props.embed&&{
            width:"100%",
            height:"100%",
            ...(props.embed=="right"?{borderLeftRadius:0}:{borderRightRadius:0})
        }}
    >
        {props.text}
    </Button>

    if(!props.popover){
        return ret
    }else{
        return themePopover(ret, props.popover)
    }
}

function ThemeTinyButton(props: {
    icon?:JSX.Element
    text?:string
    onClick?:() => void
    type?:string
    disabled?:boolean
    popover?:any
}){
    let type = "outline"
    if(props.type=="primary") type="solid"
    if(props.type=="text") type="ghost"
    if(props.type=="danger") type="solid"

    let danger = props.type=="danger"

    if(!props.text){
        return <ThemeIconButton
            icon={props.icon}
            onClick={props.onClick}
            type={type}
            disabled={props.disabled}
            size="xs"
            popover={props.popover}
        />
    }

    const ret = <Button
        size={"xs"}
        colorScheme={danger?"red":(props.disabled?'gray':'teal')}
        leftIcon={props.icon}
        onClick={()=>{
            if(!props.disabled){
                (props.onClick??(()=>{}))()
            }
        }}
        variant={type}
        disabled={props.disabled}
        style={{
            fontSize:"12px",
            fontWeight:"normal",
            background:(type=="outline"&&!props.disabled)?"#fff":"",
            borderRadius:"1000px",
            color:props.type=="text"?"#000":"",
            opacity:props.type=="text"?"0.5":""
        }}
    >
        {props.text}
    </Button>

    if(!props.popover){
        return ret
    }else{
        return themePopover(ret, props.popover)
    }
}

function ThemeIconButton(props: {
    icon?:JSX.Element
    onClick?:() => void
    type?:string
    disabled?:boolean
    size?:string
    popover?:any
}){

    let danger = props.type=="danger"

    const ret = <IconButton 
        aria-label=''
        size={props.size}
        colorScheme={danger?"red":(props.disabled?'gray':'teal')}
        icon={props.icon} 
        onClick={()=>{
            if(!props.disabled){
                (props.onClick??(()=>{}))()
            }
        }}
        variant={props.type}
        disabled={props.disabled}
        style={{
            background:(props.type=="outline"&&!props.disabled)?"#fff":"",
            borderRadius:"1000px"
        }}
    />

    if(!props.popover){
        return ret
    }else{
        return themePopover(ret, props.popover)
    }
}

function ThemeButtonGroup(props:{children:any}){
    return <ButtonGroup>
        {props.children}
    </ButtonGroup>
}

function ThemeTextArea(props: {
    placeholder?:string
    onInput?:(v:string)=>void
    onChange?:(value:string)=>void
    autoFocus?:boolean
    rows?:number
    leftAttachment?:JSX.Element
    rightAttachment?:JSX.Element
    value?:string
    disabled?:boolean
}): JSX.Element {

    let rightAttachment = props.rightAttachment
    if(props.rightAttachment?.type.name == "ThemeButton"){
        rightAttachment = <ThemeButton{...props.rightAttachment.props} embed={"right"}/>
    }
    if(props.rightAttachment?.type.name == "ThemeSelect"){
        rightAttachment = <ThemeSelect{...props.rightAttachment.props} embed={"right"}/>
    }

    let leftAttachment = props.leftAttachment
    if(props.leftAttachment?.type.name == "ThemeButton"){
        leftAttachment = <ThemeButton{...props.leftAttachment.props} embed={"left"}/>
    }
    if(props.leftAttachment?.type.name == "ThemeSelect"){
        leftAttachment = <ThemeSelect{...props.leftAttachment.props} embed={"left"}/>
    }

    const ref = useRef(null)
    const { width, height } = useWindowSize();
    if(props.rows==1){
        return ThemeInput(props)
    }
    return <InputGroup>
        {leftAttachment&&<InputLeftAddon style={["ThemeButton", "ThemeSelect"].includes(props.leftAttachment?.type.name)?{padding:0}:{}}>
            {leftAttachment}
        </InputLeftAddon>}
        <Textarea 
            ref={ref as any}
            placeholder={props.placeholder} 
            rows={ref.current?Math.max(autoGrowTextArea(ref.current), props.rows??2):props.rows}
            resize={'none'}
            onInput={(e)=>{if(props.onInput)props.onInput(e.currentTarget.value)}}
            onChange={(e)=>{if(props.onChange)props.onChange(e.currentTarget.value)}}
            autoFocus={props.autoFocus}
            value={props.value}
            disabled={props.disabled}
            variant={props.disabled?'filled':'outline'}
            maxHeight={height/2}    // 权宜之计
            borderTopRightRadius={props.rightAttachment?0:undefined}
        />
        {rightAttachment&&<InputRightAddon style={["ThemeButton", "ThemeSelect"].includes(props.rightAttachment?.type.name)?{padding:0}:{}}>
            {rightAttachment}
        </InputRightAddon>}
    </InputGroup>
}

function ThemeButtonCard(props:{
    icon?:JSX.Element
    text?:string
    onClick?:()=>void
    popover?:any
}){
    const ret = <Button
        className={`
            ${buttonStyles["icon-button"]} 
            ${buttonStyles.shadow}
            clickable
        `}
        style={{
            width:81,
            height:83.5,
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            textAlign:"center",
            fontSize:12,
        }}
        onClick={props.onClick}
    >
        <i style={{padding:"8px"}}>{props.icon}</i>
        {props.text}
    </Button>

    if(!props.popover){
        return ret
    }else{
        return themePopover(ret, props.popover)
    }
}

function ThemeChatCard(props:{
    icon?:JSX.Element | string
    title?:string
    count?:number
    time?:Date
    onClick?:()=>void
    selected?:boolean
    managed?:boolean
    onDelete?:()=>void
}){
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null)

    return <>
        {!props.managed&&<Card
            style={{
                background:isHovered?"#E2E8F0":"#EDF2F7",
                borderStyle:"solid",
                borderWidth:props.selected?"2px":"0px",
                borderColor:"#2C7A7B"
            }}
            onClick={props.onClick}
            onMouseEnter={()=>{setIsHovered(true)}}
            onMouseLeave={()=>{setIsHovered(false)}}
        >
            <CardHeader padding={"12px"}>
                <Flex >
                    <Flex flex='1' gap='4' alignItems='center' flexWrap="nowrap">
                        <ThemeAvatar icon={props.icon}/>
                        <Box>
                            <Heading size='sm' whiteSpace={"nowrap"} overflow={"hidden"}>{props.title}</Heading>
                            <Text fontSize={"12px"}>{props.count}条对话</Text>
                        </Box>
                        </Flex>
                    </Flex>
                <Text fontSize={"12px"} color={"gray"}>{props.time?.toLocaleString()}</Text>
            </CardHeader>
            <div
                style={{
                    position:"absolute",
                    bottom:12,
                    right:12
                }}
            >
                <ThemeTinyButton 
                    icon={<DeleteIcon/>}
                    type="text"
                    onClick={props.onDelete}
                />
            </div>
        </Card>}
        {props.managed&&<Card
            ref={ref as any}
            onMouseEnter={()=>{setIsHovered(true)}}
            onMouseLeave={()=>{setIsHovered(false)}}
            background={"#E2E8F0"}
        >
            <CardHeader padding={"12px"}>
                <Flex >
                    <Flex flex='1' gap='4' alignItems='center' flexWrap="nowrap">
                        <IconButton 
                            aria-label="" 
                            borderRadius={1000}
                            background={"red"}
                            color={"white"}
                            opacity={0.8}
                            icon={<CloseIcon/>}
                            onClick={props.onDelete}
                        />
                        <Box>
                            <Heading size='sm' whiteSpace={"nowrap"} overflow={"hidden"}>
                                <span>{props.icon}</span>
                                {props.title}
                            </Heading>
                            <Text fontSize={"12px"}>{props.count}条对话</Text>
                        </Box>
                        </Flex>
                    </Flex>
                <Text fontSize={"12px"} color={"gray"}>{props.time?.toLocaleString()}</Text>
            </CardHeader>
            <Checkbox 
                colorScheme="teal"
                position={"absolute"}
                bottom={3}
                right={3}
                background={"#ffffffa0"}
                paddingLeft={2}
                paddingRight={2}
                borderRadius={1000}
                color={"#285E61"}
                onChange={(e)=>{
                    if(!ref.current) return
                    if(e.currentTarget.checked){
                        (ref.current as any).style.background="#EDF2F7"
                    }else{
                        (ref.current as any).style.background="#E2E8F0"
                    }
                }}
            >
                选择
            </Checkbox>
        </Card>}
    </>
}

function ThemeInfoCard(props: {
    icon?: JSX.Element | string
    title?: string
    subTitle?: string
    children?: JSX.Element
}) {
    return <Card
        background={"#F7FAFC"}
    >
        <CardHeader padding={"12px"}>
            <Flex >
                <Flex flex='1' gap='4' alignItems='center' flexWrap="nowrap">
                    {props.icon?<ThemeAvatar icon={props.icon} />:<div style={{width:4}}></div>}
                    <Box>
                        <Heading size='sm' whiteSpace={"nowrap"} overflow={"hidden"}>
                            {props.title}
                        </Heading>
                        {props.subTitle&&<Text fontSize={"12px"}>{props.subTitle}</Text>}
                    </Box>
                </Flex>
            </Flex>
        </CardHeader>
        {props.children&&<CardBody>
            {props.children}
        </CardBody>}
        <CardFooter padding={2}>
            
        </CardFooter>
    </Card>
}

function ThemeInput(props: {
    placeholder?:string
    onInput?:(v:string)=>void
    onChange?:(value:string)=>void
    autoFocus?:boolean
    rows?:number
    leftAttachment?:JSX.Element
    rightAttachment?:JSX.Element
    value?:string
    disabled?:boolean
}){
    let rightAttachment = props.rightAttachment
    if(props.rightAttachment?.type.name == "ThemeButton"){
        rightAttachment = <ThemeButton{...props.rightAttachment.props} embed={"right"}/>
    }
    if(props.rightAttachment?.type.name == "ThemeSelect"){
        rightAttachment = <ThemeSelect{...props.rightAttachment.props} embed={"right"}/>
    }

    let leftAttachment = props.leftAttachment
    if(props.leftAttachment?.type.name == "ThemeButton"){
        leftAttachment = <ThemeButton{...props.leftAttachment.props} embed={"left"}/>
    }
    if(props.leftAttachment?.type.name == "ThemeSelect"){
        leftAttachment = <ThemeSelect{...props.leftAttachment.props} embed={"left"}/>
    }

    return <InputGroup>
        {leftAttachment&&<InputLeftAddon style={["ThemeButton", "ThemeSelect"].includes(props.leftAttachment?.type.name)?{padding:0}:{}}>
            {leftAttachment}
        </InputLeftAddon>}
        <Input
            placeholder={props.placeholder}
            onInput={(e)=>{if(props.onInput)props.onInput(e.currentTarget.value)}}
            onChange={(e)=>{if(props.onChange)props.onChange(e.currentTarget.value)}}
            autoFocus={props.autoFocus}
            value={props.value}
            disabled={props.disabled}
            variant={props.disabled?'filled':'outline'}
        />
        {rightAttachment&&<InputRightAddon style={["ThemeButton", "ThemeSelect"].includes(props.rightAttachment?.type.name)?{padding:0}:{}}>
            {rightAttachment}
        </InputRightAddon>}
    </InputGroup>
}

function ThemeCheckBox(props: {
    checked?:boolean
    text?:string
    onClick?:(checked:boolean)=>void
}): JSX.Element {
    const id = nanoid()
    return <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor={id} mb='0'>
            {props.text}
        </FormLabel>
        <Switch
            id={id} 
            isChecked={props.checked}
            onChange={(e)=>{
                if (props.onClick)
                    props.onClick(e.currentTarget.checked)
            }}
            colorScheme={'teal'}
        />
    </FormControl>
}

function ThemeModal(props: {
    title?:string
    children?:any
    max?:boolean
    footer?:JSX.Element
    onClose?:()=>void
    headerActions?:boolean
}): JSX.Element {
    const [max, setMax] = useState(props.max)
    return <div className="modal-mask" style={{background:"#0000"}}>
        <div className={
            styles["modal-container"] + 
            ` ${max && styles["modal-container-max"]}`
        }>
            <div className={styles["modal-header"]}>
                <div 
                    className={styles["modal-title"]}
                >
                    {props.title}
                </div>
                {(props.headerActions??true)&&<div className={styles["modal-header-actions"]}>
                    <ButtonGroup>
                        <ThemeButton
                            type="text"
                            onClick={() => setMax(!max)}
                            icon={max?<MinIcon/>:<MaxIcon/>}
                        />
                        <ThemeButton
                            type="text"
                            onClick={props.onClose}
                            icon={<CloseIcon/>}
                        />
                    </ButtonGroup>
                </div>}
            </div>
            <div className={styles["modal-content"]}>{props.children}</div>
            <div className={styles["modal-footer"]}>{props.footer}</div>
        </div>
    </div>
}

function ThemeAvatar(props:{icon?:JSX.Element | string}){
    try{
        if(props?.icon?.["type"]?.()?.type == "svg") return <Avatar icon={<>{props.icon}</>} size={"sm"}/>
    }catch(e){}
    return <Avatar icon={<div style={{scale:"2"}}>{props.icon}</div>} size={"sm"} style={{background:"#ffffff00"}}/>
}

function ThemeList(props:{children?:any}){
    return <div style={{
        display:"flex",
        flexDirection:"column",
        gap:24
    }}>
        {props.children}
    </div>
}

function ThemeListItem(props:{
    title?: string
    subTitle?: string
    children?: any
}){
    const titleElem = <div
        style={{
            position:"absolute",
            left:16,
            top:-15,
            background:"#ffff",
            color:"gray",
            fontWeight:"bold",
            paddingLeft:16,
            paddingRight:16,
            borderRadius:1000,
        }}
    >
        {props.title}
    </div>

    const subTitleElem = <div
    style={{
        position:"absolute",
        right:16,
        top:-12,
        background:"#ffff",
        color:"gray",
        fontSize:14,
        paddingLeft:14,
        paddingRight:14,
        borderRadius:1000,
    }}
    >
        {props.subTitle}
    </div>

    if(props?.children?.type?.name=="ThemeList"){
        return <div
            style={{
                marginTop:16,
                position:"relative",
                border:"1px solid #E2E8F0",
                borderRadius:6,
                paddingTop:30,
                paddingBottom:8,
                paddingLeft:16,
                paddingRight:16,
            }}
        >
            {props.subTitle&&subTitleElem}
            {props.title&&titleElem}
            <table style={{width:"100%"}}>
                <tr style={{width:"100%"}}>
                    <td style={{width:"10%"}}/>
                    <td>{props.children}</td>
                </tr>
            </table>
        </div>
    }

    if(props?.children?.type?.name=="ThemeTextArea"){
        return <div
            style={{
                display:"inline-block",
                position:"relative"
            }}
        >
            {props.children}
            {props.subTitle&&subTitleElem}
            {props.title&&titleElem}
        </div>
    }

    return <div
        style={{
            marginTop:16,
            position:"relative",
            border:"1px solid #E2E8F0",
            borderRadius:6,
            paddingTop:10,
            paddingBottom:8,
            paddingLeft:16,
            paddingRight:16
        }}
    >
        {props.subTitle&&subTitleElem}
        {props.title&&titleElem}
        {props.children}
    </div>
}

function ThemeTabs(props:{
    tab?:string
    onChange?:((tab:string)=>void)
    labels?:string[],
    children?:any[]
}):JSX.Element{
    const [cardMenuIndex, setCardMenuIndex] = useState(0)
    const [parentSize, setParentSize] = useState({width:0, height:0})
    const ref = useRef<HTMLDivElement>(null)
    useEffect(()=>{
        if(ref.current){
            setParentSize({
                width:ref.current.parentElement?.clientWidth??0,
                height:ref.current.parentElement?.clientHeight??0
            })
        }
    })
    return <Tabs 
        ref={ref}
        colorScheme="teal" 
        isFitted 
        variant='enclosed' 
        index={props.tab?props.labels?.indexOf(props.tab):cardMenuIndex} 
        width={"100%"}
        height={"100%"}
        padding={0}
        onChange={(index)=>{
            setCardMenuIndex(index)
            props.onChange?.(props.labels?.[index]??"")
        }
    }>
        <TabList mb='1em'>
            {props.labels?.map((label, idx)=>{
                return <Tab>
                    {label}
                </Tab>
            })}
        </TabList>
        <TabPanels>
            {props.children?.map((comp, idx)=>{
                return <TabPanel display={"flex"} flexDirection={"column"} padding={0}>
                    <div style={{
                        width:parentSize.width,
                        height:parentSize.height-70,
                        overflow:"scroll"
                    }}>
                        {comp}
                    </div>
                </TabPanel>
            })}
        </TabPanels>
    </Tabs>
}

function ThemeSelect(props:{
    options?:string[]
    value?:string
    onChange?:(value:string)=>void
    embed?:"left"|"right"
}):JSX.Element{
    return <Select 
        value={props.value} 
        onChange={(e)=>{props.onChange?.(e.currentTarget.value)}}
        {... props.embed&&{
            ...(props.embed=="right"?{borderLeftRadius:0}:{borderRightRadius:0}),
        }}
        style={{padding:4, paddingRight:32}}
    >
        {props.options?.map((v, i)=><option value={v}>
            {v}
        </option>)}
    </Select>
}

async function showConfirm(title?:string, content?:JSX.Element, danger?:boolean){
    const div = document.createElement("div");
    div.className = "";
    document.body.appendChild(div);
  
    const root = createRoot(div);
    const closeModal = () => {
      root.unmount();
      div.remove();
    };

    if(title==""){title=undefined}
  
    return new Promise<boolean>((resolve) => {
      root.render(
        <ChakraProvider><ThemeModal
          title={title??"确认"}
          headerActions={false}
          footer={<ThemeButtonGroup>
            <ThemeButton
              text={"取消"}
              onClick={() => {
                resolve(false);
                closeModal();
              }}
              icon={<CancelIcon/>}
            ></ThemeButton>
            <ThemeButton
              text={"确认"}
              type={danger?"danger":"primary"}
              onClick={() => {
                resolve(true);
                closeModal();
              }}
              icon={<ConfirmIcon/>}
            ></ThemeButton>
          </ThemeButtonGroup>}
          onClose={closeModal}
        >
          {content}
        </ThemeModal></ChakraProvider>,
      );
    });
}