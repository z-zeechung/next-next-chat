import { ClientApi } from "@/app/client/api";
import { Markdown } from "@/app/components/markdown";
import { showToast } from "@/app/components/ui-lib";
import { Button, ButtonGroup, Tabs, TinyButton } from "@/app/themes/theme";
import { ControllablePromise } from "@/app/utils/controllable-promise";
import { Card } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

var inited = false;

export function ContextCard(props: {
    useTab: [
        "rewrite" | "explain" | "translate" | "conclude" | undefined,
        (tab) => void
    ]
    left: number
    top: number
    text: string
    replaceText?: (text: string) => void
    setOnCardClose
}) {

    const ref = useRef(null)
    const [tab, setTab] = props.useTab

    const [explain, setExplain] = useState("")
    const [conclude, setConclude] = useState("")
    const [promise, setPromise] = useState(undefined as ControllablePromise<string> | undefined)

    function switchTab(tab) {
        promise?.abort()
        setExplain("")
        setConclude("")
        let p
        switch (tab) {
            case "explain":
            case "智能释义":
                p = ClientApi.chat(
                    [{ type: "text", role: "user", content: `释义如下文本：${props.text}` }],
                    (res) => { setExplain(res) }
                )
                setPromise(p)
                p.then((res) => {
                    setExplain(res)
                })
                break
            case "conclude":
            case "智能总结":
                p = ClientApi.chat(
                    [{ type: "text", role: "user", content: `总结如下文本：${props.text}` }],
                    (res) => { setConclude(res) }
                )
                setPromise(p)
                p.then((res) => {
                    setConclude(res)
                })
                break
        }
    }

    useEffect(() => {

        if(tab && !inited){
            inited = true
            switchTab(tab)
        }

        return () => {
            props.setOnCardClose(()=>{
                inited = false
                promise?.abort()
            })
        }
    })

    return <>
        {tab && <Card
            ref={ref}
            position={"fixed"}
            zIndex={101}
            left={Math.min(props.left, window.innerWidth - 450)}
            top={Math.min(props.top, window.innerHeight - 300)}
            width={450}
            height={300}
        >
            <Tabs
                labels={[
                    "智能改写",
                    "智能释义",
                    "智能翻译",
                    "智能总结"
                ]}
                tab={{
                    "rewrite": "智能改写",
                    "explain": "智能释义",
                    "translate": "智能翻译",
                    "conclude": "智能总结"
                }[tab]}
                onChange={(tab) => {
                    switchTab(tab)
                    setTab({
                        "智能改写": "rewrite",
                        "智能释义": "explain",
                        "智能翻译": "translate",
                        "智能总结": "conclude"
                    }[tab])
                }}
            >
                <div style={{ width: "100%", height: "100%" }}>

                </div>
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                    <div style={{ width: "100%", height: 230, paddingLeft: 16, paddingRight: 16, overflow: "scroll" }}>
                        <Markdown content={explain ?? ""} />
                    </div>
                    <div style={{ position: "absolute", right: 8, bottom: 0 }}>
                        <ButtonGroup>
                            <TinyButton text="复制" onClick={() => {
                                copyToClipboard(explain)
                            }} />
                        </ButtonGroup>
                    </div>
                </div>
                <div style={{ width: "100%", height: "100%" }}>

                </div>
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                    <div style={{ width: "100%", height: 230, paddingLeft: 16, paddingRight: 16, overflow: "scroll" }}>
                        <Markdown content={conclude ?? ""} />
                    </div>
                    <div style={{ position: "absolute", right: 8, bottom: 0 }}>
                        <ButtonGroup>
                            <TinyButton text="复制" onClick={() => {
                                copyToClipboard(conclude)
                            }} />
                        </ButtonGroup>
                    </div>
                </div>
            </Tabs>
        </Card>}
    </>
}

function copyToClipboard(text) {
    // 检查navigator.clipboard API是否可用
    if (navigator.clipboard) {
        // 尝试向剪贴板写入文本
        navigator.clipboard.writeText(text);
        showToast("已复制到剪贴板！")
    } else {
        // 对于不支持navigator.clipboard API的浏览器，使用老旧的document.execCommand方法
        // 注意：document.execCommand()已被废弃，并可能在未来的浏览器版本中移除
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast("已复制到剪贴板！")
    }
}



{/* <Card
            position={"fixed"}
            left={Math.min(cardMenuPosition[0], window.innerWidth - 450)}
            top={Math.min(cardMenuPosition[1], window.innerHeight - 300)}
            zIndex={101}
            ref={menuCardRef}
            width={450}
            height={300}
        >
            <Tabs isFitted variant='enclosed' index={cardMenuIndex} onChange={(index) => {
                setCardMenuIndex(index)
                if (index == 1) {
                    if (explaination == "") {
                        explainationPromise.abort()
                        setExplainationPromise(ClientApi.chat([
                            {
                                type: "text", role: "user", content: `
                                释义如下文本：
                                ${text}
                            `}
                        ], (msg) => {
                            setExplaination(msg)
                        }, { model: model }))
                    }
                }
                if (index == 3) {
                    if (conclusion == "") {
                        conclusionPromise.abort()
                        setConclusionPromise(ClientApi.chat([
                            {
                                type: "text", role: "user", content: `
                                总结如下文本：
                                ${text}
                            `}
                        ], (msg) => {
                            setConclusion(msg)
                        }, { model: model }))
                    }
                }
            }}>
                <TabList mb='1em'>
                    <Tab>改写</Tab>
                    <Tab>释义</Tab>
                    <Tab>翻译</Tab>
                    <Tab>总结</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel display={"flex"} flexDirection={"column"} gap={4}>
                        <div style={{
                            width: 425,
                            height: 215,
                            overflow: "scroll",
                            paddingBottom: 36
                        }}>
                            {!selectChangeStyle && <ButtonGroup width={"100%"} size='sm' isAttached variant='outline'>
                                <Button width={"100%"} onClick={() => {
                                    rewritePromise.abort()
                                    setRewritePromise(ClientApi.chat([{
                                        type: "text", role: "user", content: `
                                        将如下文本改写为更为简短的形式，不要改变语义，不要改变风格。直接输出改写后的文本，不要解释，不要输出额外内容。
                                        以下是要缩写的文本：
                                        ${text}
                                    `}], (msg) => {
                                        setRewrite(msg)
                                    }, { model: model }))
                                }}>缩写</Button>
                                <Button width={"100%"} onClick={() => {
                                    rewritePromise.abort()
                                    setRewritePromise(ClientApi.chat([{
                                        type: "text", role: "user", content: `
                                        扩写如下文本，不要改变语义，不要改变风格。直接输出改写后的文本，不要解释，不要输出额外内容。
                                        以下是要扩写的文本：
                                        ${text}
                                    `}], (msg) => {
                                        setRewrite(msg)
                                    }, { model: model }))
                                }}>扩写</Button>
                                <Button width={"100%"} onClick={() => {
                                    rewritePromise.abort()
                                    setRewritePromise(ClientApi.chat([{
                                        type: "text", role: "user", content: `
                                        修改如下文本当中的语病，不要改变语义，不要改变风格。直接输出改写后的文本，不要解释，不要输出额外内容。若没有发现语病，则直接输出原来的文本。
                                        以下是要修改语病的文本：
                                        ${text}
                                    `}], (msg) => {
                                        setRewrite(msg)
                                    }, { model: model }))
                                }}>改语病</Button>
                                <Button width={"100%"} onClick={() => {
                                    rewritePromise.abort()
                                    setRewritePromise(ClientApi.chat([{
                                        type: "text", role: "user", content: `
                                        润色如下文本，使其表述更为清晰准确或更加富有文采，不要改变语义，不要改变语言风格。语言应自然通顺，避免矫揉造作。直接输出改写后的文本，不要解释，不要输出额外内容。
                                        以下是要润色的文本：
                                        ${text}
                                    `}], (msg) => {
                                        setRewrite(msg)
                                    }, { model: model }))
                                }}>润色</Button>
                                <Button width={"100%"} onClick={() => {
                                    rewritePromise.abort()
                                    setRewritePromise(ClientApi.chat([{
                                        type: "text", role: "user", content: `
                                        改写如下文本，要求如下：
                                            （一）避免使用如下词汇：
                                                1、递进关系和逻辑词汇
                                                    1. 然而
                                                    2. 此外
                                                    3. 总之
                                                    4. 因此
                                                    5. 综上所述
                                                    6. 例如
                                                    7. 基于此
                                                    8. 显而易见
                                                    9. 值得注意的是
                                                    10. 不可否认
                                                    11. 从某种程度上
                                                    12. 换句话说
                                                    13. 由于……原因
                                                    14. 尽管如此
                                                    15. 由此可见
                                                    16. 因此可见
                                                    17. 不可避免地
                                                    18. 事实上
                                                    19. 一方面……另一方面
                                                    20. 显著
                                                    21. 通过……可以看出
                                                    22. 在此基础上
                                                    23. 尤其是
                                                    24. 根据……
                                                    25. 基于以上分析
                                                    26. 毫无疑问
                                                    27. 值得一提的是
                                                    28. 相较于
                                                    29. 可见
                                                    30. 因此可以推断
                                                    31. 进一步而言
                                                    32. 如上所述
                                                    33. 结合实际情况
                                                    34. 综合考虑
                                                    35. 在此过程中
                                                    36. 进一步分析
                                                    37. 在一定程度上
                                                    38. 相反
                                                    39. 尤其值得关注
                                                    40. 从而
                                                    41. 上述
                                                    42. 这表明
                                                2、结构词汇
                                                    1. 首先
                                                    2. 其次
                                                    3. 最后
                                                    4. 第一
                                                    5. 第二
                                                    6. 第三
                                                    7. 另外
                                                    8. 再者
                                                    9. 接下来
                                                    10. 然后
                                                    11. 最终
                                                    12. 进一步
                                                    13. 由此
                                                    14. 因为
                                                    15. 所以
                                                    16. 由此可见
                                                    17. 总的来说
                                                    18. 总结一下
                                                    19. 简而言之
                                                    20. 结果是
                                                    21. 如前所述
                                                    22. 在此基础上
                                                    23. 总之
                                                    24. 说到最后
                                                    25. 当然
                                            （二）不要语句重复，不要使用过多的冗余表达，在细节的准确性和深度上下更多功夫
                                            （三）深入分析时要有逻辑性和深度，语义要连贯，逻辑关系要清晰
                                            （四）要有一定的情感色彩，避免模板化的内容以及事实错误
                                            （五）尝试使用第一人称和情感语言，在文章中加入第一人称的见解,使内容更具个人色彩。
                                            （六）采用不规则结构和语言创新，使用不寻常的文章结构，采用新颖的比喻或隐喻。
                                            （七）注重语言的自然流畅性，检查所给文本中的每个句子，对于读起来不自然或机械的表达，用更口语化的表述重写它们。
                                            （八）引入具体例子和案例研究，在解释复杂概念时，加入真实世界的例子或案例研究，使抽象内容具体化，更容易被理解。
                                            （九）避免使用首先、其次，然后等作为过渡词，使用其他更加丝滑和自然的过渡词或者句子，文字风格采用大师级的句式和节奏，具有一定的文学性和学术性。
                                        不要改变语义，不要改变风格（譬如，不要把学术文本文学化，不要把文学文本学术化，而是保持原有的风格）。语言应自然通顺，避免矫揉造作。直接输出改写后的文本，不要解释，不要输出额外内容。
                                        以下是要改写的文本：
                                        ${text}
                                    `}], (msg) => {
                                        setRewrite(msg)
                                    }, { model: model }))
                                }}>降AI</Button>
                                <Button width={"100%"} onClick={() => {
                                    rewritePromise.abort()
                                    setRewrite("")
                                    setSelectChangeStyle(!selectChangeStyle)
                                }}>转换风格</Button>
                            </ButtonGroup>}
                            {selectChangeStyle && <InputGroup>
                                <Input placeholder="在此输入你的要求……" size={"sm"} h='2rem' value={changeStyle} onChange={(e) => { setChangeStyle(e.currentTarget.value) }} />
                                <InputRightAddon h='2rem' padding={0}>
                                    <Button borderRadius={0} h='2rem' size={"sm"} leftIcon={<SendIcon />} onClick={() => {
                                        rewritePromise.abort()
                                        setRewritePromise(ClientApi.chat([{
                                            type: "text", role: "user", content: `
                                                根据如下要求，改写文本：
                                                    ${changeStyle}
                                                不要改变语义，不要改变风格。直接输出改写后的文本，不要解释，不要输出额外内容。若没有发现语病，则直接输出原来的文本。
                                                以下是要改写的文本：
                                                ${text}
                                            `}], (msg) => {
                                            setRewrite(msg)
                                        }, { model: model }))
                                    }}>提交</Button>
                                    <Button leftIcon={<ReturnIcon />} borderLeftRadius={0} h='2rem' size={"sm"} colorScheme="blue" onClick={() => {
                                        rewritePromise.abort()
                                        setRewrite("")
                                        setSelectChangeStyle(!selectChangeStyle)
                                    }}>返回</Button>
                                </InputRightAddon>
                            </InputGroup>}
                            <Card>
                                <CardBody>
                                    <Markdown content={rewrite} />
                                </CardBody>
                            </Card>
                        </div>
                        <ButtonGroup position={"absolute"} right={4} bottom={4}>
                            <Button size={"sm"} leftIcon={<ReplaceIcon />} colorScheme="blue" onClick={() => {
                                instance?.command.executeBackspace()
                                instance?.command.executeInsertElementList([{
                                    value: rewrite
                                }])
                                close_menu_card()
                            }}>
                                替换内容
                            </Button>
                            <Button size={"sm"} leftIcon={<CopyIcon />} colorScheme="blue" onClick={() => {
                                copyToClipboard(rewrite)
                            }}>
                                复制
                            </Button>
                        </ButtonGroup>
                    </TabPanel>
                    <TabPanel>
                        <div style={{
                            width: 425,
                            height: 215,
                            overflow: "scroll",
                            paddingBottom: 36
                        }}>
                            <Markdown content={explaination} />
                        </div>
                        <Button leftIcon={<CopyIcon />} size={"sm"} position={"absolute"} right={4} bottom={4} colorScheme="blue" onClick={() => {
                            copyToClipboard(htmlToText(renderToString(<Markdown content={explaination} />)))
                        }}>
                            复制
                        </Button>
                    </TabPanel>
                    <TabPanel display={"flex"} flexDirection={"column"} gap={4}>
                        <div style={{
                            width: 410,
                            height: 215,
                            overflow: "scroll",
                            paddingBottom: 36
                        }}>
                            <InputGroup>
                                <Input size={"sm"} h='2rem' value={transTarLang ?? ""} placeholder="自动检测"
                                    onChange={(e) => {
                                        setTransTarLang(e.currentTarget.value)
                                    }}
                                />
                                <InputRightAddon padding={0} h='2rem'>
                                    <Button
                                        size={"sm"} h='2rem'
                                        leftIcon={<SendIcon />}
                                        colorScheme="blue"
                                        width={"100%"}
                                        height={"100%"}
                                        borderLeftRadius={0}
                                        onClick={() => {
                                            var prompt = `翻译如下文本。如果源文本是中文，则将其翻译成英文。否则，将其翻译为中文。\n
                                                        直接输出翻译后的文本，不要解释，不要输出任何额外内容。\n`
                                            if (transTarLang) {
                                                prompt = `你是一个智能语言模型，在${transTarLang}的语料上进行了训练，因此你能熟练的使用${transTarLang}。\n
                                                        考虑到你已经在大量${transTarLang}的语料上进行了训练，因此对于这种语言，你理应能输出正确的翻译结果。\n
                                                        直接输出翻译后的文本，不要解释，不要输出任何额外内容。\n
                                                        现在，请将如下文本翻译为${transTarLang}。\n`
                                            }
                                            translationPromise.abort()
                                            setTranslationPromise(ClientApi.chat([
                                                {
                                                    type: "text", role: "user", content: `
                                                    ${prompt}
                                                    ${text}
                                                `}
                                            ], (msg) => {
                                                setTranslation(msg)
                                            }, { model: model }))
                                        }}
                                    >翻译</Button>
                                </InputRightAddon>
                            </InputGroup>
                            <Card>
                                <CardBody>
                                    <Markdown content={translation} />
                                </CardBody>
                            </Card>
                        </div>
                        <ButtonGroup position={"absolute"} right={4} bottom={4}>
                            <Button size={"sm"} leftIcon={<ReplaceIcon />} colorScheme="blue" onClick={() => {
                                instance?.command.executeBackspace()
                                instance?.command.executeInsertElementList([{
                                    value: translation
                                }])
                                close_menu_card()
                            }}>
                                替换内容
                            </Button>
                            <Button size={"sm"} leftIcon={<CopyIcon />} colorScheme="blue" onClick={() => {
                                copyToClipboard(translation)
                            }}>
                                复制
                            </Button>
                        </ButtonGroup>
                    </TabPanel>
                    <TabPanel>
                        <div style={{
                            width: 425,
                            height: 215,
                            overflow: "scroll",
                            paddingBottom: 36
                        }}>
                            <Markdown content={conclusion} />
                        </div>
                        <Button leftIcon={<CopyIcon />} size={"sm"} position={"absolute"} right={4} bottom={4} colorScheme="blue" onClick={() => {
                            copyToClipboard(htmlToText(renderToString(<Markdown content={conclusion} />)))
                        }}>
                            复制
                        </Button>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Card> */}