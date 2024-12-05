import { PartialLocaleType } from "./index";
import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";
var lunar = require('lunar');

const isApp = !!getClientConfig()?.isApp;

const cnt: PartialLocaleType = {

  NextChat: {
    SystemPrompt: ()=>`
      你是$N^2$CHAT，一個由$N^2$CHAT團隊創建的智能助手。
      當前時間為：${new Date().toLocaleString()}，${lunar(new Date()).toString().replace("农历", "農曆").replace("丑", "醜").replace("腊", "臘")}
      要嵌入內聯式LaTeX，請使用e.g. $x^2$
      要嵌入LaTeX塊，請使用e.g. $$e=mc^2$$
    `,
    SideBar: {
      ChatList: "聊天列表",
      Manage: "管理",
      Exit: "退出",
      NewChat: "新的聊天",
      CountOfChats: (count: number) => `${count} 條對話`,
      Select: "選擇"
    },
    ChatArea: {
      More: "更多",
      Return: "返回",
      ChatOptions: "聊天選項",
      Send: "發送",
      SendPrompt: "Enter 發送，Shift + Enter 換行",
      RolePlay: "角色扮演",
      SwitchModel: "切換模型",
      WebSearch: "聯網搜索",
      Scripting: "脚本執行",
      GenImage: "圖像生成",
      UploadFile: "上傳圖片/文檔",
      ChatPlugins: "對話插件",
      IntelligentOffice: "智能辦公",
      WordDoc: "Word 文檔",
      PDFDoc: "PDF 文檔",
      Audio: "音頻",
      DeleteChat: "刪除對話",
      ClearData: "清除數據",
      SelectRole: "選擇角色",
      SearchRole: "搜索角色……",
      New: "新建",
      Use: "使用",
      StopUse: "停用",
      SwitchedToModel: (model: string) => `已切換至${model=="regular"?"普通":"高級"}模型`,
      ManagePlugins: "管理插件",
      AlreadyDeletedChat: "已刪除對話",
      ClearDataPrompt: "這將會清除所有設置及聊天記錄。要繼續嗎？",
      Activated: (name:string) => `已啓用${name}`,
      Deactivated: (name:string) => `已關閉${name}`,
      Copy: "複製",
      Delete: "刪除",
      Retry: "重試",
      Using: "正在使用",
      Greeting: "有什麽我可以幫助您的嗎🪄",
      Revert: "撤銷",
      DefaultTopic: "新的聊天",
      KnowledgeBase: "知識庫",
      QuickStart: "快速開始",
      YouCanSeeInMore: "你可以在輸入框左上角的「更多」菜單中查看這些功能。",
      Upload: "上傳",
      UploadDesc: "基於長文本模型和多模態模型進行圖片/文檔問答。",
      RolePlayDesc: "啟用大模型角色扮演或動畫形象。你可以通過提示詞，預置知識庫，Live2D形象乃至腳本來自定義大模型的交互。",
      NewRole: "新建角色",
      PluginDesc: "啟用插件以使得大模型能夠調用外部功能，如網絡查詢、圖像生成等。",
      EnablePlugin: "啟用插件",
      NewPlugin: "自定義插件",
      KBDesc: "向知識庫中註入你的文檔，使得大模型能夠更加準確地回答你的問題。你可以選擇使用傳統知識庫，向量知識庫或圖知識庫。",
      KBDetail: "詳細說明",
      SeeKB: "查看知識庫",
    }
  },

  DevPage: {
    RolePlay: "角色扮演",
    Live2D: "數字人",
    Script: "脚本",
    Alter: "更改",
    RoleName: "角色名稱：",
    Prompt: "提示詞：",
    InitDialog: "初始對話：",
    User: "用戶",
    System: "系統",
    Append: "新增",
    AutoGen: "自動生成",
    Clear: "清空",
    ActivateTool: "啓用能力：",
    WebSearch: "聯網搜索",
    ImageGen: "圖像生成",
    Scripting: "脚本執行",
    Upload: "上傳",
    Save: "保存",
    Export: "導出",
    ChangeModel: "切換模型",
    Send: "發送",
    Greeting: "有什麽我可以幫助您的嗎🪄",
    Expand: "展開",
    Collapse: "收起",
    Stop: "停止",
    ReverseRolePrompt: "你是小充，是一名科技愛好者，最近正在開發一款智能助手應用。這天，你剛下課回到宿舍，調試你開發的應用。現在你正在與你開發的智能助手交談。",
    AssistantSays: "智能助手說：",
    SystemSays: "以下為系統提示信息：",
    UploadFile: "上傳文檔",
    Delete: "刪除"
  },

  KnowledgeBase: {
    New: "新建",
    WhatsThis: "這是什麽？",
    Explaination: `大語言模型受限於其訓練數據的時效性與全面性，對於特定的問題，其回答可能會不夠準確或不夠及時。通過向知識庫中添加自定義文檔，並讓大語言模型回答時檢索知識庫，能夠改善上述情況。

要新建知識庫，你可以點擊右下角的「新建」按鈕，並選擇要創建的知識庫類型。傳統知識庫從文檔中提取關鍵詞，檢索時進行關鍵詞匹配；向量知識庫將文本映射為高維空間中的方向信息（即向量），通過比對向量與向量間的夾角來進行匹配；圖知識庫從源文本中提取實體以及實體間的聯系，連結成網絡，根據檢索目標遍歷周圍結點的信息。

你會在界面上看見你已經創建了的知識庫。在「編輯」界面中，你可以添加新的文檔，或瀏覽已經添加的文檔。`,
    ISee: "明白了",
    KeywordKB: "傳統知識庫",
    VectorKB: "向量知識庫",
    GraphKB: "圖知識庫",
    NewKB: (type)=>`新建${type}`,
    Name: "名稱",
    Cancel: "取消",
    Confirm: "確認",
    SubTitle: (type, count)=>`${type}，${count} 篇文檔`,
    Edit: "編輯",
    Delete: "刪除",
    EditKB: (name)=>`編輯知識庫${name}`,
    AddDoc: "添加文檔",
    Done: "完成",
    DeleteKB: "刪除知識庫",
    ConfirmDeleteKB: (name)=>`確定要知識庫 ${name} 嗎？`,
    KBNameNotEmpty: "知識庫名稱不能為空",
    KBAlreadyExists: "知識庫已存在",
    SuccessfullyCreatedKB: (type, name)=>`成功創建${type} ${name}`,
    SuccessfullyAddDocument: "成功添加文檔",
    SuccessfullyDeletedDocument: (name)=>`成功刪除文檔 ${name}`,
  },
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type LocaleType = typeof cnt;

export default cnt;
// Translated by @chunkiuuu, feel free the submit new pr if there are typo/incorrect translations :D
