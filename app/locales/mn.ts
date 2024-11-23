import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";

const isApp = !!getClientConfig()?.isApp;

const mn = {
    NextChat: {
        SideBar: {
          ChatList: "ᠶᠠᠷᠢᠶᠠᠨ ᠤ᠋ ᠵᠢᠭᠰᠠᠭᠠᠯᠲᠠ",
          Manage: "ᠤᠳᠤᠷᠢᠳᠬᠤ",
          Exit: "ᠭᠠᠷᠬᠤ",
          NewChat: "ᠰᠢᠨ᠎ᠡ ᠶᠠᠷᠢᠶ᠎ᠠ",
          CountOfChats: (count: number) => `${count} ᠶᠠᠷᠢᠶ᠎ᠠ`,
          Select: "ᠰᠣᠩᠭᠣᠬᠤ"
        },
        ChatArea: {
          More: "ᠢᠯᠡᠭᠦᠦ ᠶᠡᠬᠡ",
          Return: "ᠪᠤᠴᠠᠬᠤ",
          ChatOptions: "ᠶᠠᠷᠢᠶᠠᠨ ᠤ᠋ ᠰᠣᠩᠭᠣᠯᠲᠠ",
          Send: "ᠢᠯᠡᠭᠡᠬᠦ",
          SendPrompt: "Enter ᠳᠦ ᠣᠷᠣᠭᠤᠯᠤᠭᠰᠠᠨ ᠢ᠋ᠶ᠋ᠠᠷ ᠢᠯᠡᠭᠡᠬᠦ᠂ Shift + Enter ᠳᠦ ᠣᠷᠣᠭᠤᠯᠤᠭᠰᠠᠨ ᠢ᠋ᠶ᠋ᠠᠷ ᠰᠢᠨ᠎ᠡ ᠮᠥᠷ ᠣᠷᠣᠭᠤᠯᠬᠤ",
          RolePlay: "ᠷᠣᠯᠢ ᠲᠣᠭᠯᠠᠬᠤ",
          SwitchModel: "ᠵᠠᠭᠪᠤᠷ ᠰᠣᠯᠢᠬᠤ",
          WebSearch: "ᠰᠦᠯᠵᠢᠶᠡᠨ ᠦ᠌ ᠬᠠᠶᠢᠯᠲᠠ",
          Scripting: "ᠰᠺᠷᠢᠫᠲ᠋ᠧᠵᠢᠭᠤᠯᠬᠤ",
          GenImage: "ᠵᠢᠷᠤᠭ ᠡᠭᠦᠰᠬᠡᠬᠦ",
          UploadFile: "ᠵᠢᠷᠤᠭ/ᠪᠠᠷᠢᠮᠲᠠ ᠪᠢᠴᠢᠭ ᠰᠠᠭᠤᠯᠭᠠᠬᠤ",
          ChatPlugins: "ᠶᠠᠷᠢᠶᠠᠨ ᠤ᠋ ᠨᠡᠮᠡᠯᠲᠡ",
          IntelligentOffice: "ᠤᠬᠠᠭᠠᠯᠢᠭ ᠣᠹᠹᠢᠰ",
          WordDoc: "Word ᠪᠠᠷᠢᠮᠲᠠ ᠪᠢᠴᠢᠭ",
          PDFDoc: "PDF ᠪᠠᠷᠢᠮᠲᠠ ᠪᠢᠴᠢᠭ",
          Audio: "ᠳᠠᠭᠤᠤ",
          DeleteChat: "ᠶᠠᠷᠢᠶ᠎ᠠ ᠤᠰᠠᠳᠬᠠᠬᠤ",
          ClearData: "ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠤᠰᠠᠳᠬᠠᠬᠤ",
          SelectRole: "ᠷᠣᠯᠢ ᠰᠣᠩᠭᠣᠬᠤ",
          SearchRole: "ᠷᠣᠯᠢ ᠬᠠᠶᠢᠬᠤ...",
          New: "ᠰᠢᠨ᠎ᠡ",
          Use: "ᠠᠰᠢᠭᠯᠠᠬᠤ",
          StopUse: "ᠠᠰᠢᠭᠯᠠᠬᠤ ᠪᠠᠨ ᠵᠣᠭᠰᠣᠬᠤ",
          SwitchedToModel: (model: string) => `${model=="regular"?"ᠡᠩ ᠦ᠋ᠨ":"ᠳᠡᠪᠰᠢᠯᠲᠡᠧᠲ"} ᠵᠠᠭᠪᠤᠷ ᠷᠤ ᠰᠣᠯᠢᠭᠰᠠᠨ`,
          ManagePlugins: "ᠨᠡᠮᠡᠯᠲᠡ ᠤᠳᠤᠷᠢᠳᠬᠤ",
          AlreadyDeletedChat: "ᠤᠰᠠᠳᠬᠠᠭᠰᠠᠨ ᠶᠠᠷᠢᠶ᠎ᠠ",
          ClearDataPrompt: "ᠡᠨᠡ ᠨᠢ ᠪᠦᠬᠦ ᠲᠣᠬᠢᠷᠠᠭᠤᠯᠭ᠎ᠠ᠂ ᠶᠠᠷᠢᠶᠠᠨ ᠤ᠋ ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠢ᠋ ᠤᠰᠠᠳᠬᠠᠵᠤ ᠪᠣᠯᠤᠨ᠎ᠠ᠃ ᠦᠷᠭᠦᠯᠵᠢᠯᠡᠭᠦᠯᠬᠦ ᠦ?",
          Activated: (name:string) => `${name} ᠢᠳᠡᠪᠬᠢᠵᠢᠭᠰᠠᠨ`,
          Deactivated: (name:string) => `${name} ᠵᠣᠭᠰᠣᠭᠠᠭᠰᠠᠨ`,
          Copy: "ᠬᠠᠭᠤᠯᠪᠤᠷᠢᠯᠠᠬᠤ",
          Delete: "ᠤᠰᠠᠳᠬᠠᠬᠤ",
          Retry: "ᠳᠠᠬᠢᠨ ᠣᠷᠣᠯᠳᠣᠯᠭ᠎ᠠ",
          Using: "ᠠᠰᠢᠭᠯᠠᠵᠤ ᠪᠠᠶᠢᠨ᠎ᠠ",
          Greeting: "ᠲᠠ ᠶᠠᠮᠠᠷ ᠨᠢᠭᠡᠨ ᠲᠤᠰᠠᠯᠠᠮᠵᠢ ᠬᠡᠷᠡᠭᠲᠡᠢ ᠪᠣᠢ 🪄",
          Revert: "ᠪᠤᠴᠠᠭᠠᠬᠤ",
          DefaultTopic: "ᠰᠢᠨ᠎ᠡ ᠶᠠᠷᠢᠶ᠎ᠠ"
        }
    },

    "DevPage": {
      "RolePlay": "ᠲᠥᠷᠥᠯ ᠤᠷᠤᠭᠤᠯ",
      "Live2D": "ᠳᠠᠬᠢᠳᠠᠯ᠎ᠠ ᠬᠦᠨᠡᠢ ᠶ᠋ᠢᠨ",
      "Script": "ᠰᠺᠷᠢᠫ ᠲᠦ᠍",
      "Alter": "ᠥᠭᠡᠷᠡᠴᠢᠯᠡᠬᠦ",
      "RoleName": "ᠲᠥᠷᠥᠯ ᠦ᠋ᠨ ᠨᠡᠷ᠎ᠡ᠄ ",
      "Prompt": "ᠣᠷᠢᠶᠠᠯᠭ᠎ᠠ ᠶ᠋ᠢᠨ ᠦᠭᠡ᠄ ",
      "InitDialog": "ᠡᠬᠢᠯᠡᠭᠡᠳ ᠶᠠᠷᠢᠶ᠎ᠠ᠄ ",
      "User": "ᠬᠡᠷᠡᠭᠯᠡᠭᠴᠢ",
      "System": "ᠰᠢᠰᠲ᠋ᠧᠮ",
      "Append": "ᠨᠡᠮᠡᠬᠦ",
      "AutoGen": "ᠠᠦ᠋ᠲ᠋ᠣᠮᠠᠲ ᠢ᠋ᠶ᠋ᠠᠷ ᠡᠭᠦᠰᠬᠡᠬᠦ",
      "Clear": "ᠠᠷᠢᠭᠤᠨ",
      "ActivateTool": "ᠢᠳᠡᠪᠬᠡᠵᠢᠭᠦᠯᠬᠦ ᠴᠢᠳᠠᠪᠤᠷᠢ᠄ ",
      "WebSearch": "ᠰᠦᠯᠵᠢᠶᠡᠨ ᠦ᠌ ᠬᠠᠶᠢᠯᠲᠠ",
      "ImageGen": "ᠵᠢᠷᠤᠭ ᠡᠭᠦᠰᠬᠡᠬᠦ",
      "Scripting": "ᠰᠺᠷᠢᠫᠲᠦ ᠶ᠋ᠢᠨ ᠭᠦᠢᠴᠡᠳᠬᠡᠯ",
      "Upload": "ᠳᠡᠪᠰᠢᠭᠦᠯᠬᠦ",
      "Save": "ᠬᠠᠳᠠᠭᠠᠯᠠᠬᠤ",
      "Export": "ᠡᠺᠰᠫᠣᠷᠲᠯᠠᠬᠤ",
      "ChangeModel": "ᠵᠠᠭᠪᠤᠷ ᠰᠣᠯᠢᠬᠤ",
      "Send": "ᠢᠯᠡᠭᠡᠬᠦ",
      Greeting: "ᠲᠠ ᠶᠠᠮᠠᠷ ᠨᠢᠭᠡᠨ ᠲᠤᠰᠠᠯᠠᠮᠵᠢ ᠬᠡᠷᠡᠭᠲᠡᠢ ᠪᠣᠢ 🪄",
      "Expand": "ᠨᠡᠭᠡᠭᠡᠬᠦ",
      "Collapse": "ᠪᠠᠭᠤᠬᠤ",
      "Stop": "ᠵᠣᠭᠰᠣᠬᠤ"
    }
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type LocaleType = typeof mn;
export type PartialLocaleType = DeepPartial<typeof mn>;

export default mn;
// Translated by @chunkiuuu, feel free the submit new pr if there are typo/incorrect translations :D
