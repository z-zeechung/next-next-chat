import zh_Hans from "./zh-Hans";
import zh_Hant from "./zh-Hant";
import en from "./en";
import pt from "./pt";
import id from "./id";
import fr from "./fr";
import es from "./es";
import it from "./it";
import tr from "./tr";
import jp from "./jp";
import de from "./de";
import vi from "./vi";
import ru from "./ru";
import no from "./no";
import cs from "./cs";
import ko from "./ko";
import ar from "./ar";
import bn from "./bn";
import sk from "./sk";
import mn_Mong from "./mn-Mong"
import { merge } from "../utils/merge";

import type { LocaleType } from "./zh-Hans";
export type { LocaleType, PartialLocaleType } from "./zh-Hans";

export const ALL_LANGS = {
  zh_Hans: zh_Hans,
  zh_Hant: zh_Hant,
  en,
  // pt,
  // jp,
  // ko,
  // id,
  fr,
  es,
  // it,
  // tr,
  // de,
  // vi,
  ru,
  // cs,
  // no,
  ar,
  // bn,
  // sk,
  mn_Mong: mn_Mong,
};

export type Lang = keyof typeof ALL_LANGS;

export const AllLangs = Object.keys(ALL_LANGS) as Lang[];

export const ALL_LANG_OPTIONS: Record<Lang, string> = {
  ar: "العربية",    //ʿArabīyā
  // bn: "বাংলা",       // Bangla
  // cs: "Čeština",    // Čeština
  // de: "Deutsch",    // Deutsch
  en: "English",    // English
  es: "Español",    // Español
  fr: "Français",   // Français
  // ko: "한국어",      // Hanguge
  // id: "Indonesia",  // Indonesia
  // it: "Italiano",   // Italiano
  mn_Mong: "ᠮᠤᠩᠭᠤᠯ",        // Mongol
  // jp: "日本語",     // Nihongo
  // no: "Nynorsk",    // Nynorsk
  // pt: "Português",  // Português
  ru: "Русский",    // Russkiy
  // sk: "Slovensky",  // Slovensky
  // vi: "Tiếng Việt", // Tiếng Việt
  // tr: "Türkçe",     // Türkçe
  zh_Hans: "简体中文",   // Zhōngwénjiǎntǐ
  zh_Hant: "繁體中文",  // Zhōngwénfántǐ
};

export const LOCAL_ALL_LANG_OPTIONS: Record<Lang, string> = {
  ar: "阿拉伯文",
  // bn: "孟加拉文",
  // cs: "捷克文",
  // de: "德文",
  en: "英文",
  es: "西班牙文",
  fr: "法文",
  // ko: "韩文",
  // id: "印尼文",
  // it: "意大利文",
  mn_Mong: "蒙古文",
  // jp: "日文",
  // no: "挪威文",
  // pt: "葡萄牙文",
  ru: "俄文",
  // sk: "斯洛伐克文",
  // vi: "越南文",
  // tr: "土耳其文",
  zh_Hans: "简体中文",
  zh_Hant: "繁体中文",
}

const LANG_KEY = "lang";
const DEFAULT_LANG = "zh_Hans";

const fallbackLang = en;
const targetLang = ALL_LANGS[getLang()] as LocaleType;

// if target lang missing some fields, it will use fallback lang string
merge(fallbackLang, targetLang);

export default fallbackLang as LocaleType;

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function getLanguage() {
  // return DEFAULT_LANG;
  try {
    return navigator.language.toLowerCase();
  } catch {
    return DEFAULT_LANG;
  }
}

export function getLang(): Lang {
  // return DEFAULT_LANG;
  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  const lang = getLanguage();

  for (const option of AllLangs) {
    if (lang.includes(option)) {
      return option;
    }
  }

  return DEFAULT_LANG;
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  location.reload();
}

export function getISOLang() {
  return getLang().replace("_", "-");
  // const isoLangString: Record<string, string> = {
  //   cn: "zh",
  //   cnt: "zh",
  // };

  // const lang = getLang();
  // return isoLangString[lang] ?? lang;
}

export function isRtlLang(){
  return ["ar"].includes(getLang());
}

export function isVerticalLang(){
  return ["mn_Mong"].includes(getLang());
}

// export function getIndent(){
//   if(["zh_Hans", "zh_Hant"].includes(getLang())){
//     return "2em";
//   }
//   return "1em";
// }
