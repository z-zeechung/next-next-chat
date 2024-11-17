import { readDoc, readHTML, readPDF, readTxt } from "@/app/utils/readfile";
import { jina } from "./jina";

export function summarize(text:string){
    
}

export async function chunkFile(file:File){

    let text = ""
    if(file.name.endsWith(".doc") || file.name.endsWith(".docx")){
        text =await readDoc(file)
    }else if(file.name.endsWith(".pdf")){
        text =await readPDF(file)
    }else if(file.name.endsWith(".htm") || file.name.endsWith(".html") || file.name.endsWith(".mhtml")){
        text =await readHTML(file)
    }else{
        text = await readTxt(file)
    }

    text = text.replaceAll("\n", "\\n").replace(/\s+/g, ' ')
    const LEN = 300
    const STEP = 256
    let ret:string[] = []
    let i = 0
    while(true){
        if(i+LEN>=text.length){
            ret.push(text.substring(i))
            break
        }
        ret.push(text.substring(i, i+LEN))
        i+=STEP
    }
    return ret
}

export async function resizeImage(file, size):Promise<File> {

    return new Promise((resolve=>{
        const quality = 0.8

        const maxSize = size
    
        if (!file.type.startsWith('image/')) {
            console.error('File is not an image');
            return;
        }
    
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
    
                // 计算新的高度
                let width = img.width;
                let height = img.height;
    
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
    
                canvas.width = width;
                canvas.height = height;
    
                // 绘制图像
                ctx!.drawImage(img, 0, 0, width, height);
    
                // 将canvas转为文件
                canvas.toBlob(function(blob:any) {
                    // 创建一个新的File对象
                    let newFile = new File([blob], file.name, { type: file.type });
                    resolve(newFile);
                }, file.type, quality);
            };
    
            // 读取文件内容
            img.src = (e as any).target.result;
        };
    
        // 读取图片文件
        reader.readAsDataURL(file);
    }))
}