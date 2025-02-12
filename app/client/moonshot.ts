import { ControllablePromise } from "../utils/controllable-promise";
import { Provider, resizeImage } from "./api";
import { getOpenAiApi } from "./openai";

export const Moonshot: Provider = {
    name: "Moonshot (月之暗面)",
    fields: ["api_key"],
    site:"https://platform.moonshot.cn/console/api-keys",
    chat: {
        models: [
            { name: "moonshot-v1-8k", context: 8 * 1024 },
            { name: "moonshot-v1-32k", context: 32 * 1024 },
            { name: "moonshot-v1-128k", context: 128 * 1024 },
        ],
        default: "moonshot-v1-8k",
        defaultSmart: "moonshot-v1-8k",
        defaultLong: "moonshot-v1-128k",
        getApi(options: { api_key, model }) {
            return getOpenAiApi(
                "https://api.moonshot.cn/v1",
                options.api_key,
                options.model
            )
        },
    },
    caption: {
        models: [
            { name: "moonshot-v1-8k-vision-preview" }
        ],
        default: "moonshot-v1-8k-vision-preview",
        getApi(options: { api_key, model }) {
            return (
                img: string,
                prompt?: string,
                onUpdate?: (message: string) => void
            ) => {
                const api = getOpenAiApi(
                    "https://api.moonshot.cn/v1",
                    options.api_key,
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
        },
    }
}