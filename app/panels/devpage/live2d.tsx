import { Button, CheckBox, Footer, Group, InfoCard, Left, List, ListItem, Right, Row, Select, showToast, TextArea, TextBlock, TinyButton } from "@/app/themes/theme";
import { compileLive2dModel } from "./compile-live2d-model";
import { captureLive2DMotion, motionLive2D } from "../nextchat/Live2D";
import { ClientApi } from "@/app/client/api";

export function Live2D(props: any) {

    const [motions, setMotions] = props.useLive2DMotions

    return <List>
        <TextBlock>上传Live2D模型：</TextBlock>
        <ListItem title="人物身高：" subTitle="估测Live2D人物的自然身高，单位为厘米">
            <TextArea rows={1} value={props.useLive2DHeight[0]} onChange={(t) => {
                props.useLive2DHeight[1](t)
            }} />
        </ListItem>
        <ListItem title="配置文件：" subTitle="例如 model.json">
            <FileUpload useLive2DFile={props.useLive2DConfig} hooks={props} postfix=".json" />
        </ListItem>
        <ListItem title="模型文件：" subTitle="例如 model.moc">
            <FileUpload useLive2DFile={props.useLive2DModel} hooks={props} postfix=".moc" />
        </ListItem>
        <ListItem title="物理文件：" subTitle="例如 physics.json">
            <FileUpload useLive2DFile={props.useLive2DPhysics} hooks={props} postfix=".json" />
        </ListItem>
        <ListItem title="贴图文件：" subTitle="例如 texture.png">
            <FilesUpload useLive2DFiles={props.useLive2DTextures} hooks={props} postfix=".png" />
        </ListItem>
        <ListItem title="动作文件：" subTitle="例如 idle.mtn">
            {motions.map(file => <InfoCard title={file.name}>
                <Row>
                    <Left>
                        <TextBlock>动作描述：</TextBlock>
                    </Left>
                    <Right>
                        <Group isAttached>
                            <TextArea rows={1} />
                            <Button text="自动生成" type="primary" onClick={() => {
                                // showToast(<TextBlock>
                                //     录制开始，请不要摇晃鼠标
                                // </TextBlock>)
                                captureLive2DMotion(file.name).then(blob => {
                                    console.log(blob)
                                    ClientApi.videoCaption(blob, "描述视频中人物的动作神态，并根据动作神态判断人物想要表达的情绪，尤其注意人物面部活动所传达的情绪，返回内容以“我感到……”开头。不要解释、不要标点、不要语气词、不要多余文本。返回内容示例：1. 我感到很开心 2. 我感到十分的沮丧 3. 我很生气 4. 我感觉被冷落 5. 我对此充满信心 6. 我对此感兴趣", (m)=>{
                                        console.log(m)
                                    })
                                })
                            }} />
                        </Group>
                    </Right>
                </Row>
                <Footer>
                    <Row>
                        <Left>
                            <CheckBox text="设为待机动作" checked={props.useLive2DIdleMotion[0] == file.name} onClick={() => {
                                if (props.useLive2DIdleMotion[0] == file.name) {
                                    props.useLive2DIdleMotion[1]("无")
                                } else {
                                    props.useLive2DIdleMotion[1](file.name)
                                }
                            }} />
                        </Left>
                        <Right>
                            <Group>
                                {(props.useLive2DIdleMotion[0]) != file.name && props.useLive2DUrl[0] && <TinyButton text="触发" type="primary" onClick={() => {
                                    motionLive2D(file.name)
                                }} />}
                                <TinyButton text="删除" onClick={() => {
                                    setMotions(motions.filter(f => f != file))
                                }} />
                            </Group>
                        </Right>
                    </Row>
                </Footer>
            </InfoCard>)}
            <Row>
                <Left>
                    <Group>
                        <Button text="上传" onClick={() => {
                            const input = document.createElement("input")
                            input.type = "file"
                            input.accept = ".mtn"
                            input.multiple = true
                            input.onchange = (e) => { setMotions([...motions, ...(e.target as any).files]) }
                            input.click()
                        }} />
                    </Group>
                </Left>
            </Row>
        </ListItem>
        <Row>
            <Left>
                <TextBlock>{props?.useLive2DUrl[0] ? "要刷新模型，请先点击“卸载”，再重新加载模型：" : "上传所有文件后，请点击“加载”："}</TextBlock>
            </Left>
            <Right>
                {!props.useLive2DUrl[0] && <Button text="加载" type="primary" onClick={() => { updateLive2DModel(props) }} />}
                {props.useLive2DUrl[0] && <Button text="卸载" onClick={() => { props.useLive2DUrl[1](undefined) }} />}
            </Right>
        </Row>
    </List>
}

function updateLive2DModel(props) {
    compileLive2dModel(
        props.useLive2DConfig[0],
        props.useLive2DModel[0],
        props.useLive2DPhysics[0],
        props.useLive2DTextures[0],
        props.useLive2DMotions[0].filter(f => f.name != props.useLive2DIdleMotion[0]),
        props.useLive2DMotions[0].find(f => f.name == props.useLive2DIdleMotion[0])
    ).then(
        (url) => {
            // fetch(url).then(res => res.text()).then(text => {
            //     console.log(text)
            // })
            URL.revokeObjectURL(props.useLive2DUrl[0])
            props.useLive2DUrl[1](url)
        }
    )
}

function FileUpload(props: {
    useLive2DFile
    postfix
    hooks
}) {
    const [file, setFile] = props.useLive2DFile
    return <>
        {!file && <Row>
            <Left>
                <Button text="上传" onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = props.postfix
                    input.onchange = (e) => {
                        setFile((e.target as any).files[0])
                        // updateLive2DModel(props.hooks)
                    }
                    input.click()
                }} />
            </Left>
        </Row>}
        {file && <Row>
            <Left><TextBlock>{`${file.name}`}</TextBlock></Left>
            <Right><Button text="删除" onClick={() => {
                setFile(null)
                // updateLive2DModel(props.hooks)
            }} /></Right>
        </Row>}
    </>
}

function FilesUpload(props: {
    useLive2DFiles
    postfix
    hooks
}) {
    const [files, setFiles] = props.useLive2DFiles
    return <>
        {files.map(file => <Row>
            <Left><TextBlock>{`${file.name}`}</TextBlock></Left>
            <Right><Button text="删除" onClick={() => {
                setFiles(files.filter(f => f != file))
                // updateLive2DModel(props.hooks)
            }} /></Right>
        </Row>)}
        <Row>
            <Left>
                <Button text="上传" onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = props.postfix
                    input.multiple = true
                    input.onchange = (e) => {
                        setFiles([...files, ...(e.target as any).files])
                        // updateLive2DModel(props.hooks)
                    }
                    input.click()
                }} />
            </Left>
        </Row>
    </>
}