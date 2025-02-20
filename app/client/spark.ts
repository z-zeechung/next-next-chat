import { Message } from "../message/Message";
import { Tool } from "../typing";
import { ControllablePromise } from "../utils/controllable-promise";
import { Provider } from "./api";
import { getOpenAiApi } from "./openai";

export const Spark: Provider = {
    name: "Spark (讯飞星火)",
    fields: ["api_key"],
    site: "",
    chat: {
        models: [
            { name: "Spark Lite", context: 8 * 1024 },
            { name: "Spark Pro", context: 8 * 1024 },
            { name: "Spark Pro-128K", context: 128 * 1024 },
            { name: "Spark Max", context: 8 * 1024 },
            { name: "Spark Max-32K", context: 32 * 1024 },
            { name: "Spark4.0 Ultra", context: 8 * 1024 },
        ].reverse(),
        default: "Spark Max-32K",
        defaultSmart: "Spark4.0 Ultra",
        defaultReason: "Spark Pro-128K",
        defaultLong: "Spark Pro-128K",
        getApi(options: { api_key, model }) {
            return (
                messages: Message[],
                onUpdate?: (message: string) => void,
                tools?: Tool[]
            ) => {
                return new ControllablePromise(async (resolve, rejects, abort) => {
                    const url = "https://spark-api-open.xf-yun.com/v1/chat/completions"
                    const data = {
                        "model": name2id[options.model],
                        "messages": messages,
                        "stream": true
                    }
                    const header = {
                        "Authorization": `Bearer ${options.api_key}`
                    }
                    const response = await fetch(url, {
                        method: "POST",
                        headers: header,
                        body: JSON.stringify(data)
                    })
                    const reader = response.body!.getReader();
                    const decoder = new TextDecoder('utf-8');

                    let result = ""

                    function read() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                resolve(result);
                                return;
                            }
                            const chunk = decoder.decode(value, { stream: true });
                            for(let ln of chunk.split("\n")){
                                result += (JSON.parse(ln.match(/\{.*\}/)?.[0] ?? '{}')?.choices?.[0]?.delta?.content) ?? "";
                                onUpdate?.(result)
                            }
                            read();
                        });
                    }

                    read();
                })
            }
        },
    }
}

const name2id = {
    "Spark Lite": "lite",
    "Spark Pro": "generalv3",
    "Spark Pro-128K": "pro-128k",
    "Spark Max": "generalv3.5",
    "Spark Max-32K": "max-32k",
    "Spark4.0 Ultra": "4.0Ultra",
}