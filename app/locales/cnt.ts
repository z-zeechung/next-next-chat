import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";

const isApp = !!getClientConfig()?.isApp;

const cnt = {

  NextChat: {
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
      DefaultTopic: "新的聊天"
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
  },
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type LocaleType = typeof cnt;
export type PartialLocaleType = DeepPartial<typeof cnt>;

export default cnt;
// Translated by @chunkiuuu, feel free the submit new pr if there are typo/incorrect translations :D
