import { resolve } from "path";
import { Message } from "../message/Message";
import { Tool } from "../typing";
import { ControllablePromise } from "../utils/controllable-promise";
import { Provider, resizeImage } from "./api";
import axios, { AxiosResponse } from "axios";

export const Qianfan: Provider = {
    name: "Qianfan (百度千帆)",
    fields: ["API_Key", "Secret_Key"],
    chat: {
        models: [
            {
                name: "ERNIE-4.0-8K",
                context: 20000,
            },
            {
                name: "ERNIE-4.0-Turbo-8K",
                context: 20000
            },
            {
                name: "ERNIE-3.5-8K",
                context: 20000
            },
            {
                name: "ERNIE-4.0-Turbo-128K",
                context: 516096
            },
            {
                name: "ERNIE-3.5-128K",
                context: 516096
            },
            {
                name: "ERNIE-Speed-Pro-128K",
                context: 516096
            },
            {
                name: "ERNIE-Speed-8K",
                context: 20000
            },
            {
                name: "ERNIE-Speed-128K",
                context: 500000
            },
            {
                name: "ERNIE-Lite-8K",
                context: 20000
            },
            {
                name: "ERNIE-Lite-Pro-128K",
                context: 500000
            },
            {
                name: "ERNIE-Tiny-8K",
                context: 20000
            }
        ],
        default: "ERNIE-4.0-Turbo-8K",
        defaultSmart: "ERNIE-4.0-8K",
        defaultLong: "ERNIE-Speed-128K",
        getApi(options: { API_Key, Secret_Key, model }) {
            return (
                messages: Message[],
                onUpdate?: (message: string) => void,
                tools?: Tool[]
            ) => {
                const model = name2id[options.model]
                return chat(messages, (onUpdate ?? (() => { })), { ...options, model })
            }
        }
    },
    caption: {
        models: [{ name: "Fuyu-8B" }],
        default: "Fuyu-8B",
        getApi(options: { API_Key, Secret_Key }) {
            return (
                img: string,
                prompt?: string,
                onUpdate?: (message: string) => void
            ) => {
                return caption(img, prompt ?? "", onUpdate ?? (() => { }), options.API_Key, options.Secret_Key)
            }
        },
    },
    paint: {
        models: [{ name: "Stable-Diffusion-XL" }],
        default: "Stable-Diffusion-XL",
        getApi(options: { API_Key, Secret_Key }) {
            return async (
                prompt: string,
                negativePrompt: string
            ) => {
                return new Promise(async resolve => {
                    const url = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/text2image/sd_xl?access_token=' + await getAccessToken(options.API_Key, options.Secret_Key);
                    const data = {
                        prompt: prompt,
                        negative_prompt: negativePrompt,
                        size: "1024x768",
                    };
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                        .then(response => response.json())
                        .then(result => {
                            resolve(`data:image/png;base64,${result.data[0].b64_image}`);
                        })
                })
            }
        },
    }
}


const name2id = {
    "ERNIE-4.0-8K": "completions_pro",
    "ERNIE-4.0-Turbo-8K": "ernie-4.0-turbo-8k",
    "ERNIE-3.5-8K": "completions",
    "ERNIE-4.0-Turbo-128K": "ernie-4.0-turbo-128k",
    "ERNIE-3.5-128K": "ernie-3.5-128k",
    "ERNIE-Speed-Pro-128K": "ernie-speed-pro-128k",
    "ERNIE-Speed-8K": "ernie_speed",
    "ERNIE-Speed-128K": "ernie-speed-128k",
    "ERNIE-Lite-8K": "ernie-lite-8k",
    "ERNIE-Lite-Pro-128K": "ernie-lite-pro-128k",
    "ERNIE-Tiny-8K": "ernie-tiny-8k"
}


async function getAccessToken(AK, SK) {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`;
    try {
        const response: AxiosResponse<any> = await axios.post(url, null, {
            headers: {
                //'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
        throw error;
    }
}

function chat(messages: Message[], onUpdate: (message: string) => void, options: { model: string, API_Key, Secret_Key }): ControllablePromise<string> {
    return new ControllablePromise(async (resolve, reject, abort) => {
        try {
            const accessToken = await getAccessToken(options?.API_Key, options?.Secret_Key);
            const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${options.model}?access_token=${accessToken}`;
            const payload = {
                messages: preprocess_msg(JSON.parse(JSON.stringify(messages))),
                stream: true
            };
            fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(response => {
                if (!response.ok) { throw new Error('网络异常'); }
                const reader = response.body?.getReader()
                const decoder = new TextDecoder()
                let chunk = ""
                async function read() {
                    reader?.read().then(({ done, value }) => {
                        const response = decoder.decode(value)
                        //console.log(`[CHUNK] ${response??"[ERROR]"}`)
                        let text = JSON.parse(response.match(/\{.*\}/)?.[0] ?? '{"result":""}').result
                        chunk += text
                        onUpdate?.(
                            chunk
                        )
                        if (done || abort(chunk)) {
                            resolve(chunk)
                        } else {
                            read()
                        }
                    })
                }
                read()
            })
        } catch (error) {
            console.log(`[ERROR] ${error} IN NNCHAT CLIENT`)
        }
    })
}


function preprocess_msg(msg: Message[]) {
    let ret: Message[] = []
    for (let m of msg) {
        if (m.role == "system") {
            m.role = "user"
            ret.push(m)
            ret.push({ type: "text", role: "assistant", content: "ok" })
        } else {
            ret.push(m)
        }
    }
    let ret2: Message[] = []
    ret2.push(ret[0])
    for (let m of ret.slice(1)) {
        if (ret2[ret2.length - 1].role == m.role) {
            ret2[ret2.length - 1].content += "\n\n" + m.content
        } else {
            ret2.push(m)
        }
    }
    if (ret2[0].role == "assistant") {
        ret2 = [{ type: "text", role: "user", content: "..." }, ...ret2]
    }
    if (ret2[ret2.length - 1].role == "assistant") {
        ret2.push({ type: "text", role: "user", content: "..." })
    }

    return ret2
}

function caption(img: string, prompt: string, onUpdate, AK, SK): ControllablePromise<string> {
    return new ControllablePromise(async (resolve, reject, abort) => {
        img = await resizeImage(img, 15, 768)
        let base64 = img.split(';base64,')[1]
        let url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/image2text/fuyu_8b?access_token=" + (await getAccessToken(AK, SK))
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                //"prompt": "描述图像的整体画面，并细致地描述图片中的每一处细节。对于包含丰富物品对象的图片，应亦针对各物品进行描写。对于含有文字，或者是含有具有特定意义符号/图案的图像，应当识别其内容。对于包含图表的图片，应阐述图表内容。对于景观类型的图片，应使用文学的笔触描写其景象。",
                "prompt": prompt,
                "image": base64
            })
        }).then(async (resp) => {
            const reader = resp.body?.getReader()
            const decoder = new TextDecoder()
            let chunk = ""
            async function read() {
                reader?.read().then(({ done, value }) => {
                    const response = decoder.decode(value)
                    //console.log(`[CHUNK] ${response??"[ERROR]"}`)
                    let text = JSON.parse(response.match(/\{.*\}/)?.[0] ?? '{"result":""}').result
                    chunk += text
                    onUpdate?.(
                        chunk
                    )
                    if (done || abort(chunk)) {
                        resolve(chunk)
                    } else {
                        read()
                    }
                })
            }
            read()
        })
    })
}