import axios, { AxiosResponse } from "axios";
import { CaptionApi, ChatOptions, LLMApi, LLMModel, LLMUsage } from "./api";
import { MarkdownMessage } from "../message/TextMessage";
import { Message } from "../message/Message";
import { ControllablePromise } from "../utils/controllable-promise"

export class ZeeChungApi implements LLMApi, CaptionApi {

    async getAccessToken() {
        const url = "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=********&client_secret=*********";
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

    // async chat(options: ChatOptions): Promise<void> {
    //     const controller = new AbortController();
    //     options.onController?.(controller);
    //     try {
    //         const accessToken = await this.getAccessToken();
    //         options.smart = (options.smart==undefined?false:options.smart)
    //         const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${options.smart?"completions_pro":"completions"}?access_token=${accessToken}`;
    //         const payload = {
    //             messages: preprocess_msg(JSON.parse(JSON.stringify(options.messages))),
    //             stream: true
    //         };
    //         fetch(url, {
    //             method:"POST",
    //             headers: {  
    //                 'Content-Type': 'application/json'  
    //             },
    //             body: JSON.stringify(payload)
    //         }).then(response=>{
    //             if(!response.ok){throw new Error('网络异常');}
    //             const reader = response.body?.getReader()
    //             const decoder = new TextDecoder()
    //             let chunk = ""
    //             async function read(){
    //                 reader?.read().then(({done, value})=>{
    //                     const response = decoder.decode(value)
    //                     //console.log(`[CHUNK] ${response??"[ERROR]"}`)
    //                     let text = JSON.parse(response.match(/\{.*\}/)?.[0]??'{"result":""}').result
    //                     chunk += text
    //                     options.onUpdate?.(
    //                         chunk,
    //                         text
    //                     )
    //                     if(!done&&!controller.signal.aborted){read()}else{options.onFinish(chunk)}
    //                 })
    //             }
    //             read()
    //         })
    //     } catch (error) {
    //         console.error("Error in main function:", error);
    //     }
    // }

    chat(messages: Message[], onUpdate?: (message: string) => void, options?: { model?: "regular" | "smart"; }): ControllablePromise<string> {
        return new ControllablePromise(async (resolve, reject, abort)=>{
            try {
                const accessToken = await this.getAccessToken();
                const smart = (options?.model??"regular")=="smart"
                const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${smart?"completions_pro":"completions"}?access_token=${accessToken}`;
                const payload = {
                    messages: preprocess_msg(JSON.parse(JSON.stringify(messages))),
                    stream: true
                };
                fetch(url, {
                    method:"POST",
                    headers: {  
                        'Content-Type': 'application/json'  
                    },
                    body: JSON.stringify(payload)
                }).then(response=>{
                    if(!response.ok){throw new Error('网络异常');}
                    const reader = response.body?.getReader()
                    const decoder = new TextDecoder()
                    let chunk = ""
                    async function read(){
                        reader?.read().then(({done, value})=>{
                            const response = decoder.decode(value)
                            //console.log(`[CHUNK] ${response??"[ERROR]"}`)
                            let text = JSON.parse(response.match(/\{.*\}/)?.[0]??'{"result":""}').result
                            chunk += text
                            onUpdate?.(
                                chunk
                            )
                            if(done || abort(chunk)){
                                resolve(chunk)
                            }else{
                                read()
                            }
                        })
                    }
                    read()
                })
            } catch (error){
                console.log(`[ERROR] ${error} IN NNCHAT CLIENT`)
            }
        })
    }

    // async usage(): Promise<LLMUsage> {
    //     return { used: 0, total: 0, };
    // }

    // async models(): Promise<LLMModel[]> {
    //     return [];
    // }
    
    async caption(img: File): Promise<string> {
        const getAccessToken = this.getAccessToken
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload = async function(e) {
                let base64 = (e.target?.result as string).split(';base64,')[1]
                let url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/image2text/fuyu_8b?access_token=" + (await getAccessToken())
                fetch(url, {
                    method:"POST",
                    headers: {  
                        'Content-Type': 'application/json'  
                    },
                    body:JSON.stringify({
                        //"prompt": "描述图像的整体画面，并细致地描述图片中的每一处细节。对于包含丰富物品对象的图片，应亦针对各物品进行描写。对于含有文字，或者是含有具有特定意义符号/图案的图像，应当识别其内容。对于包含图表的图片，应阐述图表内容。对于景观类型的图片，应使用文学的笔触描写其景象。",
                        "prompt": "describe the general content of the image, and describe each detail within the image meticulously. for those image rich in object elements, describe them as well. for those image containing text or symbol/pattern with specified meanings, reconize its content. for those image containing charts, describe their content. for those scenery image, describe its view with artistic words. for those image containing specified person(people) or character(s), try to reconize their identity. OUTPUT IN ENGLISH.",
                        "image": base64
                    })
                }).then(async (resp)=>{
                    let desc = JSON.parse(new TextDecoder().decode((await resp.body?.getReader().read())!.value)).result
                    let ret = `图片的内容如下：${desc}\n`/* + `图片中的文字信息如下（留空则为无）：`*/
                    resolve(ret)
                })
                };
            reader.onerror = function(error) {
                reject(error);
            };
            reader.readAsDataURL(img);
        })
    }
}



function preprocess_msg(msg:Message[]){
    // let ret: any[] = []
    // for(let m of msg){
    //     if(m.content instanceof Array){
    //         let text = ""
    //         for(let modal of m.content){
    //             text += (modal.text??"") + "\n"
    //         }
    //         m.content = text
    //     }
    //     if(m.role=="system"){
    //         ret = ret.concat([{"role":"user", "content":"🖥️系统信息💬\n"+m.content}, {"role":"assistant", "content":"🤖好的👌"}])
    //     }else{
    //         ret = ret.concat([m])
    //     }
    // }
    // if(ret[ret.length-1]["role"]=="assistant"){
    //     ret = ret.concat([{"role":"user", "content":"继续🚀"}])
    // }
    // return ret
    let ret: Message[] = []
    for(let m of msg){
        if(m.role=="system"){
            m.role="user"
            ret.push(m)
            ret.push(new MarkdownMessage("assistant", "好的"))
        }else{
            ret.push(m)
        }
    }
    let ret2: Message[] = []
    ret2.push(ret[0])
    for(let m of ret.slice(1)){
        if(ret2[ret2.length-1].role==m.role){
            ret2[ret2.length-1].content += "\n\n"+m.content
        }else{
            ret2.push(m)
        }
    }
    if(ret2[0].role=="assistant"){
        ret2 = [new MarkdownMessage("user", "...")].concat(ret2)
    }
    if(ret2[ret2.length-1].role=="assistant"){
        ret2.push(new MarkdownMessage("user", "..."))
    }

    return ret2
}