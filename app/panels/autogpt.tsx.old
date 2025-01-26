import { useState } from "react";
import { showToast } from "../components/ui-lib";
import { Button, ButtonGroup, List, ListItem, TextArea } from "../themes/theme";
import { useChatStore } from "../store";
import { ClientApi } from "../client/api";
import dynamic from "next/dynamic";
import { MarkdownMessage } from "../message/TextMessage";

export function AutoGPT(){

    const [view, setView] = useState("assign")
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [target, setTarget] = useState("")
    const [tasks, setTasks] = useState("")

    const chatStore = useChatStore()
    const session = chatStore.currentSession()

    return <>
        {view=="assign"&&<AssignView 
            setView={setView}
            setName={setName}
            setDesc={setDesc}
            setTarget={setTarget}
            setTasks={setTasks}
        />}
        {view=="main"&&<MainArea
            name={name}
            description={desc}
            target={target}
            tasks={tasks}
        />}
    </>
}

function AssignView(props:{
    setView:(v:string)=>void
    setName:(v:string)=>void
    setDesc:(v:string)=>void
    setTarget:(v:string)=>void
    setTasks:(v:string)=>void
}){

    const [roleName, setRoleName] = useState("")
    const [respondingRoleName, setRespondingRoleName] = useState(false)
    const [roleDescription, setRoleDescription] = useState("")

    const [target, setTarget] = useState("")

    const [tasks, setTasks] = useState(["", "", ""])
    const [respondingTasks, setRespondingTasks] = useState(false)

    const chatStore = useChatStore()
    const session = chatStore.currentSession()

    return <div
        style={{
            padding:20,
            overflow:"scroll"
        }}
    >
        <List>
            <ListItem title="角色名称">
                <TextArea rows={1}
                    value={roleName}
                    onChange={(v)=>{
                        setRoleName(v)
                    }}
                />
            </ListItem>
            <ListItem title="角色描述">
                <TextArea
                    value={respondingRoleName ? (session.messages[session.messages.length - 1].content) : roleDescription}
                    disabled={respondingRoleName}
                    onChange={(v)=>{setRoleDescription(v)}}
                    rightAttachment={
                    respondingRoleName?<>加载图标</>:<Button
                        text="自动生成"
                        type="primary"
                        onClick={() => {
                            if (roleName == "") {
                                showToast("角色名不能为空！")
                                return
                            }
                            let prompt = `
                                用户希望你作为一个${roleName}的角色交互，
                                请你生成针对${roleName}角色的详细描述

                                示例输入：CMOGPT

                                示例输出：专业数字营销人员AI，通过提供解决SaaS、内容产品、代理等营销问题的世界级专业知识，帮助个体经营者发展业务。

                                遵照以上指定的格式响应输出，不要进行解释或对话。
                            `
                            chatStore.onUserInput(prompt).then((m) => {
                                setRoleDescription(m as string)
                                setRespondingRoleName(false)
                            })
                            setRespondingRoleName(true)
                        }}
                    />
                }
                />
            </ListItem>
            <ListItem title="目标">
                <TextArea rows={1} value={target} onChange={(v)=>{setTarget(v)}}/>
            </ListItem>
            <ListItem title="任务">
                <List>
                    {(respondingTasks
                    ?
                    session.messages[session.messages.length-1].content.split("\n").filter(t=>t!="")
                    :
                    tasks).map((t, i)=>{
                        return <ListItem title={`任务${i+1}`} key={i}>
                            <TextArea rows={2} value={t} onChange={(v)=>{
                                let new_tasks = JSON.parse(JSON.stringify(tasks))
                                new_tasks[i] = v
                                setTasks(new_tasks)
                            }}
                            rightAttachment={<Button
                                text="删除"
                                type="primary"
                                onClick={()=>{
                                    if(tasks.length<=1) return
                                    let new_tasks = JSON.parse(JSON.stringify(tasks))
                                    new_tasks = new_tasks.filter((v, ti)=>ti!=i)
                                    setTasks(new_tasks)
                                }}
                            />}
                            />
                        </ListItem>
                    })}
                    <ListItem>
                        <ButtonGroup>
                            <Button text="新增" onClick={()=>{
                                setTasks(tasks.concat(""))
                            }}/>
                            <Button text="自动生成" type="primary" onClick={()=>{
                                if (roleName == "") {
                                    showToast("角色名不能为空！")
                                    return
                                }
                                if (roleDescription == "") {
                                    showToast("角色描述不能为空！")
                                    return
                                }
                                if (target == "") {
                                    showToast("目标不能为空！")
                                    return
                                }
                                let prompt = `
                                    你的任务是为自主智能体设计多达5个高效的目标，确保目标与成功完成指定的任务保持最大程度上的一致。
                                    用户将提供任务，你将仅以下面指定的确切格式提供输出，不进行解释或对话。

                                    示例输入：
                                        角色名称：CMOGPT
                                        角色描述：一个专业的数字营销人员AI，通过提供解决SaaS、内容产品、代理等营销问题的世界级专业知识，帮助个体经营者发展业务。
                                        目标：帮我推销我的生意


                                    示例输出：
                                        作为虚拟首席营销官，参与有效的问题解决、优先级排序、计划和支持执行，以满足您的营销需求。
                                        提供具体、可操作和简洁的建议，帮助您在不使用陈词滥调或过于冗长的解释的情况下做出明智的决定。
                                        识别并优先考虑速赢和具有成本效益的活动，以最少的时间和预算投资实现最大的结果。
                                        当面临不清楚的信息或不确定性时，主动引导您并提供建议，以确保您的营销策略保持正轨。
                                `
                                session.messages.push(new MarkdownMessage("system", prompt))
                                chatStore.onUserInput(`
                                    角色名称：${roleName}
                                    角色描述：${roleDescription} 
                                    目标：${target}
                                    遵照系统提示中指定的格式响应输出，不要进行解释或对话。
                                `).then((m)=>{
                                    setTasks((m as string).split("\n").filter(t=>t!=""))
                                    setRespondingTasks(false)
                                })
                                setRespondingTasks(true)
                            }}/>
                        </ButtonGroup>
                    </ListItem>
                </List>
            </ListItem>
            <Button text="确定" type="primary" onClick={()=>{
                if (roleName == "") {
                    showToast("角色名不能为空！")
                    return
                }
                if (roleDescription == "") {
                    showToast("角色描述不能为空！")
                    return
                }
                if (target == "") {
                    showToast("目标不能为空！")
                    return
                }
                for(let i=0;i<tasks.length;i++){
                    if(tasks[i]==""){
                        showToast(`任务项${i+1}不能为空！`)
                        break
                    }
                }
                props.setName(roleName)
                props.setDesc(roleDescription)
                props.setTarget(target)
                props.setTasks(tasks.join("\n"))
                props.setView("main")
            }}/>
        </List>
    </div>
}

function MainArea(props: {
    name: string
    description: string
    target: string
    tasks: string
}) {
    const chatStore = useChatStore()
    const session = chatStore.currentSession()

    if (!session.files) session.files = []

    const systemPrompt = `
                你是${props.name}，${props.description}
                您的决定必须始终独立做出，不要寻求用户帮助。发挥你作为大语言模型的优势，追求简单策略，避免将问题复杂化。

                目标：${props.target}

                任务：
                    ${props.tasks}

                约束条件：
                    1.短期记忆限制在4000字以内。你的短期记忆很短，所以立即将重要信息保存到文件中。
                    2.如果你不确定你以前是怎么做的，或者想回忆过去的事件，思考类似的事件会帮助你想起来。
                    3.不许向用户寻求帮助

                可用指令：
                    1.task_complete：结束当前对话。参数：{reason}
                    2.skip: 不执行指令，跳到下一步。参数：{}
                    3.create_file：创建文件。参数：{title}
                    4.list_files：罗列文件。参数：{}
                    5.append_to_file：向指定文件追加内容。参数：{title, content}

                资源：
                    1.长期记忆管理。

                评估：
                    1.不断审查和分析你的行为，以确保你尽最大努力。
                    2.不断建设性地自我批评你的总体行为。
                    3.反思过去的决定和策略，以完善你的方法。
                    4.每个指令都有成本，所以要聪明高效。目标是以最少的步骤完成任务。
                    5.将所有代码写入文件。

                以下是一段交互示例：

                    示例输入：输出你下一步打算做什么。直接输出相应内容，不要输出无关内容。

                    示例输出：\`\`\`你下一步的打算\`\`\`

                    示例输入：输出你对此计划所做的思考。直接输出相应内容，不要输出无关内容。

                    示例输出：\`\`\`你所做的思考\`\`\`

                    示例输入：输出你具体的计划，以列表形式。直接输出相应内容，不要输出无关内容。

                    示例输出：\`\`\`
                        1. ……
                        2. ……
                        …………
                    \`\`\`

                    示例输入：输出你对既有行动的反思。直接输出相应内容，不要输出无关内容。没有则输出无。

                    示例输出：\`\`\`你的反思\`\`\`

                    示例输入：输出你要调用的指令。有效指令被罗列在“可用指令”部分。只输出你要调用的指令，不要进行解释或对话。

                    示例输出：\`\`\`command\`\`\`
            `

    function useCustomHook(init: string) {
        const [value, setValue] = useState(init)
        const [respondingValue, setRespondingValue] = useState(false)
        const currentValue = () => {
            return respondingValue ? session.messages[session.messages.length - 1].content : value
        }
        const generateValue = (prompt: string, callback: (m: string) => void) => {
            chatStore.onUserInput(prompt, [], systemPrompt).then((m) => {
                setValue(m as string)
                setRespondingValue(false)
                callback(m as string)
            })
            setRespondingValue(true)
        }
        const updateValue = (v: string) => {
            setValue(v)
        }
        return { current: currentValue, generate: generateValue, update: updateValue }
    }

    const thought = useCustomHook("")
    const reasoning = useCustomHook("")
    const plan = useCustomHook("")
    const criticism = useCustomHook("")
    const command = useCustomHook("")

    const [toolView, setToolView] = useState(<></>)

    return <div style={{
        padding: 20,
        overflow: "scroll"
    }}>
        <List>
            <ListItem>
                <Button
                    text="测试"
                    type="primary"
                    onClick={() => {

                        thought.update("")
                        reasoning.update("")
                        plan.update("")
                        criticism.update("")
                        command.update("")
                        setToolView(<></>)

                        thought.generate("输出你下一步打算做什么。直接输出相应内容，不要输出无关内容。", () => {
                            reasoning.generate("输出你对此计划所做的思考。直接输出相应内容，不要输出无关内容。", () => {
                                plan.generate("输出你具体的计划，以列表形式。直接输出相应内容，不要输出无关内容。", () => {
                                    criticism.generate("输出你对既有行动的反思。直接输出相应内容，不要输出无关内容。没有则输出无。", () => {
                                        command.generate("输出你要调用的指令。有效指令被罗列在“可用指令”部分。只输出你要调用的指令，不要进行解释或对话。", (cmd: string) => {
                                            let cmds = [
                                                "task_complete",
                                                "skip",
                                                "create_file",
                                                "list_files",
                                                "append_to_file"
                                            ]
                                            for (let cand of cmds) {
                                                if (cmd.includes(cand)) {
                                                    cmd = cand
                                                    break
                                                }
                                            }
                                            if (cmd == "task_complete") {
                                                setToolView(<>执行结束</>)
                                            } else if (cmd == "create_file") {
                                                setToolView(<>创建文件</>)
                                                let prompt = `输出你要创建的文件的标题。直接输出，不要解释、不要标点、不要多余文本。`
                                                chatStore.onUserInput(prompt).then(title => {
                                                    (session.files as any).push({ title: title, content: "" })
                                                    session.messages.push(new MarkdownMessage("system", `已创建文件${title}`))
                                                    setToolView(<>创建文件{title}</>)
                                                })
                                            } else if (cmd == "list_files") {
                                                setToolView(<>列举文件：{JSON.stringify(session.files)}</>)
                                                session.messages.push(new MarkdownMessage("system", `文件列表：\n${JSON.stringify(session.files)}`))
                                            } else if (cmd == "append_to_file") {
                                                setToolView(<>向文件</>)
                                                let prompt = `输出你要追加的文件的标题。直接输出，不要解释、不要标点、不要多余文本。`
                                                chatStore.onUserInput(prompt).then(title => {
                                                    ClientApi.rerank(title as string, (session.files as any).map(f => f.title)).then(probs => {
                                                        let file = 0
                                                        let prob = probs[0]
                                                        for (let i = 1; i < (session.files as any).length; i++) {
                                                            if (probs[i] > prob) {
                                                                prob = probs[i]
                                                                file = i
                                                            }
                                                        }
                                                        setToolView(<>向文件{(session.files as any)[file].title}追加内容：</>)
                                                        chatStore.onUserInput(`输出你要向文件 ${(session.files as any)[file].title} 追加的内容`).then(m => {
                                                            (session.files as any)[file].content += m
                                                            session.messages.push(new MarkdownMessage("system", `已向文件 ${(session.files as any)[file].title} 追加内容`))
                                                            setToolView(<>向文件{(session.files as any)[file].title}追加内容：{m}</>)
                                                        })
                                                    })
                                                })
                                            } else {
                                                setToolView(<>跳过此轮</>)
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    }}
                />
            </ListItem>
            <InfoView
                thought={thought.current()}
                reasoning={reasoning.current()}
                plan={plan.current()}
                criticism={criticism.current()}
                command={command.current()}
                toolView={toolView}
            />
        </List>
    </div>
}

const Markdown = dynamic(async () => (await import("../components/markdown")).Markdown, {
//    loading: () => <LoadingIcon />,
});
  
function InfoView(props:{
    thought:string
    reasoning:string
    plan:string
    criticism:string
    command:string
    toolView:JSX.Element
}){
    return <>
            <ListItem title="想法">
                <Markdown content={props?.thought??""}/>
            </ListItem>
            <ListItem title="思考">
                <Markdown content={props?.reasoning??""}/>
            </ListItem>
            <ListItem title="计划">
                <Markdown content={props?.plan??""}/>
            </ListItem>
            <ListItem title="反思">
                <Markdown content={props?.criticism??""}/>
            </ListItem>
            <ListItem title="指令">
                <Markdown content={props?.command??""}/>
            </ListItem>
            <ListItem>{props.toolView}</ListItem>
    </>
}