import { ControllablePromise } from "../utils/controllable-promise";
import { blobToDataURL, Provider, resizeImage } from "./api";
import { toolCallWrapper } from "./api-wrappers";
import { getDeepseekR1Api } from "./deepseek";
import { getOpenAiApi } from "./openai";

export const Tongyi: Provider = {
    name: "Tongyi (通义千问)",
    fields: ["apiKey"],
    site:"https://bailian.console.aliyun.com/?apiKey=1#/api-key",
    chat: {
        models: [
            {
                name: "qwen-max",
                context: 32768,
                search: true
            },
            {
                name: "qwen-plus",
                context: 131072,
                search: true
            },
            {
                name: "qwen-turbo",
                context: 1000000,
                search: true
            },
            {
                name: "qwen-long",
                context: 10000000
            },
            {
                name: "deepseek-v3",
                context: 57344
            },
            {
                name: "deepseek-r1",
                context: 57344,
                reason: true
            },
            {
                name: "deepseek-r1-distill-qwen-32b",
                context: 32768,
                reason: true
            }
        ],
        default: "qwen-turbo",
        defaultSmart: "qwen-max",
        defaultLong: "qwen-long",
        defaultReason: "deepseek-r1",
        getApi(options: { apiKey: string, model: string }) {
            if(["deepseek-r1", "deepseek-r1-distill-qwen-32b"].includes(options.model)){
                return getDeepseekR1Api(
                    "https://dashscope.aliyuncs.com/compatible-mode/v1",
                    options.apiKey,
                    options.model,
                )
            }
            const api = getOpenAiApi(
                "https://dashscope.aliyuncs.com/compatible-mode/v1",
                options.apiKey,
                options.model,
                ["qwen-max", "qwen-plus", "qwen-turbo"].includes(options.model)
            )
            if(options.model=="deepseek-v3"){
                return toolCallWrapper(api)
            }else{
                return api
            }
        },
    },
    caption: {
        models: [
            { name: "qwen-vl-max" },
            { name: "qwen-vl-plus" }
        ],
        default: "qwen-vl-plus",
        getApi: (options: { apiKey: string, model: string }) => {
            return (
                img: string,
                prompt?: string,
                onUpdate?: (message: string) => void
            ) => {
                const api = getOpenAiApi(
                    "https://dashscope.aliyuncs.com/compatible-mode/v1",
                    options.apiKey,
                    options.model
                )
                return new ControllablePromise(async (resolve, reject, abort) => {
                    resolve(await api(
                        [
                            {
                                "role": "user", "content": [
                                    { "type": "image_url", "image_url": { "url": await resizeImage(img, 56, 768) } },
                                    { "type": "text", "text": prompt }
                                ]
                            }
                        ] as any,
                        onUpdate
                    ))
                })
            }
        }
    },
    paint: {
        models: [
            { name: "wanx2.1-t2i-turbo" },
            { name: "wanx2.1-t2i-plus" }
        ],
        default: "wanx2.1-t2i-turbo",
        getApi: (options: { apiKey: string, model: string }) => {
            return (
                prompt: string,
                negativePrompt: string
            ) => {
                return new Promise(async resolve => {
                    const url = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
                    const _options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${options.apiKey}`,
                            'X-DashScope-Async': 'enable'
                        },
                        body: JSON.stringify({
                            model: options.model,
                            input: {
                                prompt: prompt,
                                negative_prompt: negativePrompt
                            },
                            parameters: {
                                size: '1024*768',
                                n: 1
                            }
                        })
                    };
                    const response = await fetch(url, _options);
                    const data = await response.json();
                    const taskId = data.output.task_id;

                    async function check() {
                        const url = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`;
                        const _options = {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${options.apiKey}`
                            }

                        };
                        const response = await fetch(url, _options);
                        const data = await response.json();
                        if (data.output.task_status === 'SUCCEEDED') {
                            const imageUrl = data.output.results[0].url;
                            const blob = await (await fetch(imageUrl)).blob()
                            const url = blobToDataURL(blob, "image/png")
                            resolve(url)
                        } else {
                            setTimeout(check, 3000)
                        }
                    }
                    check()
                })
            }
        }
    }
}