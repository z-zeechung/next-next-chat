import localforage from "localforage";
import { nanoid } from "nanoid";

type kblfs = {
    [id: string]: string[]
}

export async function addToKbLfs(id: string, file: File): Promise<string> {
    const kblfs: kblfs = JSON.parse(localStorage.getItem("nnchat-knowledge-base-lfs-index")?? "{}");
    if (!kblfs[id]) {
        kblfs[id] = [];
    }
    const storageId = `nnchat-knowledge-base-lfs-${nanoid()}`
    const url = await storeFile(file, storageId)
    kblfs[id].push(storageId)
    localStorage.setItem("nnchat-knowledge-base-lfs-index", JSON.stringify(kblfs))
    return url
}

export function clearKbLfs(id: string) {
    const kblfs: kblfs = JSON.parse(localStorage.getItem("nnchat-knowledge-base-lfs-index")?? "{}");
    if (kblfs[id]) {
        kblfs[id].forEach(async (pointer) => {
            await localforage.removeItem(pointer)
        })
        delete kblfs[id]
        localStorage.setItem("nnchat-knowledge-base-lfs-index", JSON.stringify(kblfs))
    }
}

async function storeFile(file: File, pointer: string): Promise<string> {
    return new Promise(resolve=>{
        let reader = new FileReader()
        reader.onload = async (e) => {
            await localforage.setItem(pointer, e.target?.result)
            resolve("https://lfs.nnchat.sw/getItem/"+pointer)
        }
        reader.readAsArrayBuffer(file)
    })
}