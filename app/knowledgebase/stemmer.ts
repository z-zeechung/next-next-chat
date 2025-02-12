import {franc} from 'franc'
import initJieba, { cut_for_search } from 'jieba-wasm';
import { STOPWORDS_CHINESE, STOPWORDS_EN_PLUS } from './stop-words';
var snowballFactory = require('snowball-stemmers');

let JIEBA_INITED = false

const en_stemmer = snowballFactory.newStemmer('english');

export async function stem(text: string): Promise<string[]> {
    let input = text
    if(text.length < 20){
        text = text.repeat(Math.floor(20 / text.length) + 1)
    }
    const lang = franc(text)
    switch (lang) {
        case 'cmn':
            if(!JIEBA_INITED){
                await (initJieba as any)();
                JIEBA_INITED = true
            }
            input = input.replace(CHINESE_PUNCTUATION, ' ')
            return cut_for_search(input, true).filter((word:string)=>!STOP_WORDS.zh.includes(word)&&word.trim().length>1)
        default: // eng
            input = input.toLocaleLowerCase()
            input = input.replace(LATIN_PUNCTUATION, ' ')
            let words = input.split(' ').filter(Boolean)
            return words.map(word => en_stemmer.stem(word)).filter(word=>!STOP_WORDS.en.includes(word))
    }
}

const CHINESE_PUNCTUATION = /[，。！？；：“”‘’【】《》（）【】、\s]/g
const LATIN_PUNCTUATION = /[!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~\s]/g

const STOP_WORDS = {
    zh: STOPWORDS_CHINESE,
    en: STOPWORDS_EN_PLUS.map(word => en_stemmer.stem(word))
}