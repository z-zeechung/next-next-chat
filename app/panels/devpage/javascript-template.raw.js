/**
* 
* @param {{
*      getInput: ()=>string
*      setInput: (text:string)=>void
*      getMessages: ()=>{role: "system" | "user" | "assistant", content:string}[]
*      updateMessages: (messages: {role: "system" | "user" | "assistant", content:string}[])=>void
*      getPrompt: ()=>string
*      getInitDialog: ()=>{role: "system" | "user" | "assistant", content:string}[]
*      getPlugins: ()=>[]
*      getModel: ()=> "regular" | "smart"
*      setPromise: (promise: Promise)=>void
*      createControllablePromise: (cb:(
*          resolve: (value: T | PromiseLike<T>) => void, 
*          reject: (reason?: any) => void,
*          abort: (value: T)=>boolean
*      )=>void)=>Promise
*      chat: (
*          messages: {role: "system" | "user" | "assistant", content:string}[],
*          onUpdate?: (message: string)=>void
*          options?:{
*              model?: "regular" | "smart" | "long"
*              tools?
*          }
*      ) => Promise<string>
*      embed: (texts: string[]) => Promise<number[][]>
*      tts: (text: string) => Promise<string>
*      storeLargeData: (data: Uint8Array) => Promise<string>
*      runPyodide: (code: string) => Promise<string>
*      getLive2DMotions: ()=>{id: string, description: string}[]
*      triggerLive2DMotion: (id: string)=>void
*      isSingleInteraction: ()=>boolean
* }} apis 
*/
async function onSendMessage(apis) {
    /// WRITE YOUR CODE HERE ///

    if (apis.getLive2DMotions().length > 0) {
        onSendMessageLive2D(apis)
        return
    }

    // historical messages
    const messages = apis.isSingleInteraction() ? [] : // ignore historical messages if set to single-round interaction
        apis.getMessages()
    // display user input
    apis.updateMessages([
        ...messages,
        { role: "user", content: apis.getInput() }
    ])

    // defining onUpdate callback
    function onUpdate(message) {
        apis.updateMessages([
            ...messages,
            { role: "user", content: apis.getInput() },
            { role: "assistant", content: message }
        ])
    }

    // call llm
    const promise = apis.chat(
        [
            { role: "system", content: apis.getPrompt() }, // system prompt
            ...apis.getInitDialog(),                     // initial dialog
            ...messages,
            { role: "user", content: apis.getInput() }
        ],
        onUpdate,  // onUpdate() callback
        {
            model: apis.getModel(),     // model option, regular or smart
            tools: apis.getPlugins()    // tool call
        }
    )
    apis.setPromise(promise)   // pass the chat promise so that user can interrupt it
    apis.setInput("")   // clear the input box
    const result = await promise    // wait for the result to be returned
    // display the result
    apis.updateMessages([
        ...messages,
        { role: "user", content: apis.getInput() },
        { role: "assistant", content: result }
    ])
    apis.setPromise(undefined)  // remove chat promise

    ////////////////////////////
}

// ignore this if you don't need live2d
const SEN_DIV = /\n|。|\./
const PHR_DIV = /，|！|？|；|,|!|\?|;/
async function onSendMessageLive2D(apis) {
    new Promise(async (resolve, reject) => {

        let chunk = ""
        // historical messages
        const messages = apis.isSingleInteraction() ? [] : // ignore historical messages if set to single-round interaction
            apis.getMessages()
        // display user input
        apis.updateMessages([
            ...messages,
            { role: "user", content: apis.getInput() }
        ])

        let dividers = []
        let sentences = []
        let buffer = []
        /** @param {string} message */
        onUpdate = (message) => {
            dividers = message.split("").filter(c => (c.match(SEN_DIV)))
            sentences = message.split(SEN_DIV).slice(0, -1)
        }
        async function ttsCb(resolve, reject, abort, i) {
            if (sentences.length > i) {
                let sentence = sentences[i]
                if (sentence===0) { buffer.push(0); resolve(""); return; }
                // handle sentence
                sentence += dividers[i] ?? ""
                const phrDivs = sentence.split("").filter(c => (c.match(PHR_DIV)))
                const phrases = sentence.split(PHR_DIV)
                for (let i = 0; i < phrases.length; i++) {
                    buffer.push([
                        await apis.tts(phrases[i]),
                        i==0?sentence:undefined,
                        phrases[i]+(phrDivs[i]??"")
                    ])
                }
                ttsCb(resolve, reject, abort, i + 1)
            } else {
                setTimeout(() => {
                    ttsCb(resolve, reject, abort, i)
                }, 500)
            }
        }
        const live2dTtsPromise = apis.createControllablePromise(
            (resolve, reject, abort) => {
                ttsCb(resolve, reject, abort, 0)
            }
        )
        async function playCb(resolve, reject, abort, i){
            if(buffer.length>i){
                if(buffer[i]==0){
                    // display the result
                    apis.updateMessages([
                        ...messages,
                        { role: "user", content: apis.getInput() },
                        { role: "assistant", content: result }
                    ])
                    resolve(""); 
                    return;
                }
                const [url, motionText, text] = buffer[i]
                chunk += text
                apis.updateMessages([
                    ...messages,
                    { role: "user", content: apis.getInput() },
                    { role: "assistant", content: chunk }
                ])
                await new Promise(async resolve=>{
                    const a = document.createElement("audio")
                    a.src = url
                    a.addEventListener('ended', () => {
                        resolve();
                    });
                    a.play()
                })
                playCb(resolve, reject, abort, i+1)
            }else{
                setTimeout(() => {
                    playCb(resolve, reject, abort, i)
                }, 500)
            }
        }
        const playCbPromise = apis.createControllablePromise(
            (resolve, reject, abort) => {
                playCb(resolve, reject, abort, 0)
            }
        )

        // call llm
        const promise = apis.chat(
            [
                { role: "system", content: apis.getPrompt() }, // system prompt
                ...apis.getInitDialog(),                     // initial dialog
                ...messages,
                { role: "user", content: apis.getInput() }
            ],
            onUpdate,  // onUpdate() callback
            {
                model: apis.getModel(),     // model option, regular or smart
                tools: apis.getPlugins()    // tool call
            }
        )
        apis.setInput("")   // clear the input box

        const result = await promise    // wait for the result to be returned
        dividers = result.split("").filter(c => (c.match(SEN_DIV)))
        sentences = result.split(SEN_DIV).concat([0])
    })
}

return onSendMessage