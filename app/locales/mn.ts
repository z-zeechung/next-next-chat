import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";

const isApp = !!getClientConfig()?.isApp;

const mn = {
    NextChat: {
        SystemPrompt: ()=>`
          ᠲᠠ ᠪᠣᠯ $N^2$CHAT᠂ $N^2$CHAT ᠪᠠᠭ ᠤ᠋ᠨ ᠪᠦᠲᠦᠭᠡᠭᠰᠡᠨ ᠤᠬᠠᠭᠠᠯᠢᠭ ᠲᠤᠰᠠᠯᠠᠬᠤ᠃
          ᠣᠳᠣ ᠶ᠋ᠢᠨ ᠴᠠᠭ᠄ ${new Date().toLocaleString()}
          ᠳᠣᠲᠣᠷᠠᠬᠣᠰᠢ ᠲᠠᠢ LaTeX ᠣᠷᠣᠭᠤᠯᠬᠤ ᠶ᠋ᠢᠨ ᠲᠤᠯᠠᠳᠠ e.g. $x^2$ ᠠᠰᠢᠭᠯᠠᠨ᠎ᠠ ᠤᠤ
          LaTeX ᠪᠯᠣᠺ ᠢ᠋ ᠣᠷᠣᠭᠤᠯᠬᠤ ᠶ᠋ᠢᠨ ᠲᠤᠯᠠᠳᠠ e.g. $$e=mc^2$$ ᠠᠰᠢᠭᠯᠠᠨ᠎ᠠ ᠤᠤ
        `
        ,
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
          DefaultTopic: "ᠰᠢᠨ᠎ᠡ ᠶᠠᠷᠢᠶ᠎ᠠ",
          KnowledgeBase: "ᠮᠡᠳᠡᠯᠭᠡ ᠶ᠋ᠢᠨ ᠪᠠᠭᠠᠵᠢ",
          QuickStart: "ᠬᠤᠷᠳᠤᠨ ᠡᠬᠢᠯᠡᠭᠦᠯᠬᠦ",
          YouCanSeeInMore: "ᠲᠠ ᠡᠨᠡ ᠹᠦᠨᠺᠼ ᠦ᠋ᠳ ᠢ᠋ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠰᠠᠮᠪᠠᠷ᠎ᠠ ᠶ᠋ᠢᠨ ᠵᠡᠭᠦᠨ ᠳᠡᠭᠡᠳᠦ ᠲᠠᠯ᠎ᠠ ᠶ᠋ᠢᠨ 《ᠢᠯᠡᠭᠦᠦ ᠶᠡᠬᠡ》 ᠮᠧᠨᠶᠤ ᠳᠣᠲᠣᠷ᠎ᠠ ᠪᠠᠨ ᠬᠠᠷᠠᠬᠤ ᠪᠣᠯᠤᠮᠵᠢ ᠲᠠᠢ᠃",
          Upload: "ᠢᠯᠡᠭᠡᠬᠦ",
          UploadDesc: "ᠤᠷᠲᠤ ᠲᠧᠺᠰᠲ ᠪᠣᠯᠤᠨ ᠣᠯᠠᠨ ᠬᠡᠯᠪᠡᠷᠢ ᠶ᠋ᠢᠨ ᠵᠠᠭᠪᠤᠷ ᠤ᠋ᠳ ᠤ᠋ᠨ ᠳᠠᠭᠠᠤ ᠵᠢᠷᠤᠭ/ᠪᠠᠷᠢᠮᠲᠠ ᠪᠢᠴᠢᠭ ᠦ᠋ᠨ ᠠᠰᠠᠭᠤᠯᠲᠠ ᠬᠠᠷᠢᠭᠤᠯᠬᠤ᠃",
          RolePlayDesc: "ᠲᠣᠮᠣ ᠵᠠᠭᠪᠤᠷ᠎ᠤ᠋ᠨ ᠳᠦᠷᠢ᠎ᠶ᠋ᠢ ᠲᠣᠭᠯᠠᠬᠤ ᠪᠤᠶᠤ ᠺᠠᠷᠲ᠋ᠣᠨ ᠵᠢᠷᠤᠭ᠎ᠤ᠋ᠨ ᠳᠦᠷᠢ᠎ᠶ᠋ᠢ ᠡᠬᠢᠯᠡᠭᠦᠯᠬᠦ ᠃ ᠲᠠ ᠰᠠᠨᠠᠭᠤᠯᠤᠮᠵᠢ᠎ᠶ᠋ᠢᠨ ᠦᠭᠡ ᠂ ᠮᠡᠳᠡᠯᠭᠡ᠎ᠶ᠋ᠢᠨ ᠬᠥᠮᠥᠷᠭᠡ᠎ᠶ᠋ᠢ ᠤᠷᠢᠳᠴᠢᠯᠠᠨ ᠲᠥᠰᠦᠪᠯᠡᠵᠦ ᠪᠣᠯᠤᠨ᠎ᠠ ᠂ Live2D ᠳᠦᠷᠢ ᠲᠥᠷᠬᠦ ᠴᠢᠨᠠᠭᠰᠢᠯᠠᠭᠠᠳ ᠬᠥᠯ᠎ᠦ᠋ᠨ ᠳᠡᠪᠲᠡᠷ ᠨᠢ ᠲᠣᠮᠣ ᠵᠠᠭᠪᠤᠷ᠎ᠤ᠋ᠨ ᠬᠠᠷᠢᠯᠴᠠᠯ᠎ᠢ᠋ ᠲᠣᠳᠣᠷᠬᠠᠢᠯᠠᠭᠰᠠᠨ ᠶᠤᠮ ᠃",
          NewRole: "ᠰᠢᠨ᠎ᠡ ᠷᠣᠯ",
          PluginDesc: "ᠵᠠᠯᠭᠠᠰᠤ᠎ᠶ᠋ᠢ ᠡᠬᠢᠯᠡᠵᠦ ᠬᠡᠷᠡᠭᠯᠡᠪᠡᠯ ᠲᠣᠮᠣ ᠮᠣᠳᠧᠵᠢ᠎ᠶ᠋ᠢ ᠨᠧᠲ ᠰᠤᠷᠠᠭᠯᠠᠯ ᠂ ᠵᠢᠷᠤᠭ ᠡᠭᠦᠰᠬᠦ ᠵᠡᠷᠭᠡ ᠭᠠᠳᠠᠭᠠᠳᠤ ᠴᠢᠳᠠᠮᠵᠢ᠎ᠶ᠋ᠢ ᠰᠢᠯᠵᠢᠭᠦᠯᠦᠨ ᠬᠡᠷᠡᠭᠯᠡᠵᠦ ᠴᠢᠳᠠᠬᠤ ᠪᠣᠯᠭᠠᠨ᠎ᠠ ᠃",
          EnablePlugin: "ᠫᠯᠠᠭᠢᠨ ᠨᠤᠭᠤᠳ ᠢ᠋ ᠢᠳᠡᠪᠬᠢᠵᠢᠭᠦᠯᠬᠦ",
          NewPlugin: "ᠰᠢᠨ᠎ᠡ ᠲᠣᠬᠢᠷᠠᠭᠤᠯᠤᠭᠰᠠᠨ ᠫᠯᠠᠭᠢᠨ",
          KBDesc: "ᠲᠠᠨ ᠤ᠋ ᠪᠠᠷᠢᠮᠲᠠ ᠪᠢᠴᠢᠭ ᠮᠡᠳᠡᠯᠭᠡ ᠶ᠋ᠢᠨ ᠰᠠᠩ ᠳ᠋ᠤ᠌ ᠣᠷᠣᠭᠤᠯᠵᠤ᠂ ᠲᠣᠮᠣ ᠵᠠᠭᠪᠤᠷ ᠤ᠋ᠨ ᠲᠠᠨ ᠤ᠋ ᠠᠰᠠᠭᠤᠯᠲᠠ ᠳ᠋ᠤ᠌ ᠢᠯᠡᠭᠦᠦ ᠨᠠᠷᠢᠪᠴᠢᠯᠠᠨ ᠬᠠᠷᠢᠭᠤᠯᠬᠤ ᠪᠣᠯᠤᠮᠵᠢ ᠲᠠᠢ ᠪᠣᠯᠭᠠᠨ᠎ᠠ᠃ ᠲᠠ ᠤᠯᠠᠮᠵᠢᠯᠠᠯᠲᠤ ᠮᠡᠳᠡᠯᠭᠡ ᠶ᠋ᠢᠨ ᠰᠠᠩ᠂ ᠸᠧᠺᠲ᠋ᠣᠷ ᠮᠡᠳᠡᠯᠭᠡ ᠶ᠋ᠢᠨ ᠰᠠᠩ᠂ ᠡᠰᠡᠪᠡᠯ ᠭᠷᠠᠹᠢᠺ ᠮᠡᠳᠡᠯᠭᠡ ᠶ᠋ᠢᠨ ᠰᠠᠩ ᠠᠰᠢᠭᠯᠠᠵᠤ ᠪᠣᠯᠤᠨ᠎ᠠ᠃",
          KBDetail: "ᠨᠠᠷᠢᠪᠴᠢᠯᠠᠨ ᠲᠠᠢᠯᠪᠤᠷᠢᠯᠠᠬᠤ",
          SeeKB: "ᠮᠡᠳᠡᠯᠭᠡ ᠶ᠋ᠢᠨ ᠰᠠᠩ ᠬᠠᠷᠠᠬᠤ",
        }
    },

    "DevPage": {
      "RolePlay": "ᠲᠥᠷᠥᠯ ᠤᠷᠤᠭᠤᠯ",
      "Live2D": "Live2D",
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
      "Stop": "ᠵᠣᠭᠰᠣᠬᠤ",
      ReverseRolePrompt: "ᠲᠠ ᠴᠤᠩ ᠢ᠋ ᠪᠣᠯᠵᠤ ᠪᠠᠢᠨ᠎ᠠ᠃ ᠲᠠ ᠰᠠᠶᠢᠬᠠᠨ ᠤᠬᠠᠭᠠᠯᠢᠭ ᠲᠤᠰᠠᠯᠠᠬᠤ ᠫᠷᠣᠭᠷᠠᠮ ᠬᠥᠭᠵᠢᠭᠦᠯᠵᠦ ᠪᠠᠢᠭᠰᠠᠨ ᠲᠧᠭᠨᠣᠯᠣᠭᠢ ᠶ᠋ᠢᠨ ᠰᠣᠨᠢᠷᠬᠠᠭᠴᠢ᠃ ᠥᠨᠥᠳᠥᠷ ᠬᠢᠴᠢᠶᠡᠯ ᠳᠠᠭᠤᠰᠬᠤ ᠪᠠᠨ ᠳᠣᠲᠣᠭᠤᠷ ᠪᠠᠢᠷᠢᠨ ᠳ᠋ᠤ᠌ ᠣᠷᠣᠭᠠᠳ ᠫᠷᠣᠭᠷᠠᠮ ᠳᠠᠪ ᠬᠢᠵᠦ ᠡᠬᠢᠯᠡᠯ᠎ᠡ᠃ ᠣᠳᠣ ᠲᠠ ᠥᠪᠡᠷ ᠦ᠋ᠨ ᠪᠣᠯᠪᠠᠰᠤᠷᠠᠭᠤᠯᠤᠭᠰᠠᠨ ᠤᠬᠠᠭᠠᠯᠢᠭ ᠲᠤᠰᠯᠠᠬᠤ ᠲᠠᠢ ᠶᠠᠷᠢᠶ᠎ᠠ ᠳ᠋ᠤ᠌ ᠪᠠᠢᠨ᠎ᠠ᠃",
      AssistantSays: "ᠴᠠᠲ᠋ᠪᠣ ᠳ᠋ᠤ᠌ ᠢᠩᠭᠢᠵᠦ ᠬᠡᠯᠡᠪᠡ᠄ ",
      SystemSays: "ᠳᠠᠷᠠᠭᠠᠬᠢ ᠨᠢ ᠰᠢᠰᠲ᠋ᠧᠮ ᠦ᠋ᠨ ᠤᠷᠢᠶᠠᠯᠠᠭ᠎ᠠ ᠶ᠋ᠢᠨ ᠮᠧᠰᠰᠧᠵ ᠪᠠᠢᠨ᠎ᠠ᠄ ",
      UploadFile: "ᠹᠠᠢᠯ ᠲᠠᠯᠪᠢᠬᠤ",
      Delete: "ᠤᠰᠠᠳᠬᠠᠬᠤ",
    },

    "KnowledgeBase": {
      "New": "ᠰᠢᠨ᠎ᠡ ",
      "WhatsThis": "ᠡᠨᠡ ᠶᠠᠭᠤ ᠪᠣᠢ?",
      "Explaination": `ᠶᠡᠬᠡ ᠬᠡᠯᠡᠨ᠎ᠦ᠌ ᠵᠠᠭᠪᠤᠷ ᠨᠢ ᠲᠡᠭᠦᠨ᠎ᠦ᠌ ᠪᠣᠯᠪᠠᠰᠤᠷᠠᠯ᠎ᠤ᠋ᠨ ᠲᠣᠭ᠎ᠠ ᠪᠠᠷᠢᠮᠲᠠ᠎ᠶ᠋ᠢᠨ ᠪᠦᠲᠦᠮᠵᠢᠲᠦ ᠴᠢᠨᠠᠷ ᠪᠣᠯᠤᠨ ᠪᠦᠬᠦ ᠲᠠᠯ᠎ᠠ᠎ᠶ᠋ᠢᠨ ᠴᠢᠨᠠᠷ᠎ᠲᠤ᠌ ᠬᠢᠵᠠᠭᠠᠷᠯᠠᠭᠳᠠᠨ ᠂ ᠣᠨᠴᠠᠭᠠᠢ ᠠᠰᠠᠭᠤᠳᠠᠯ᠎ᠤ᠋ᠨ ᠲᠤᠬᠠᠢ ᠬᠠᠷᠢᠭᠤᠯᠲᠠ ᠨᠢ ᠣᠨᠣᠪᠴᠢᠲᠠᠢ ᠪᠢᠰᠢ ᠮᠠᠭᠠᠳ ᠂ ᠴᠠᠭ ᠲᠤᠬᠠᠢ᠎ᠳ᠋ᠤᠨᠢ ᠬᠦᠷᠦᠯᠴᠡᠬᠦ ᠦᠭᠡᠢ ᠃ ᠮᠡᠳᠡᠯᠭᠡ᠎ᠶ᠋ᠢᠨ ᠬᠥᠮᠥᠷᠭᠡ᠎ᠳ᠋ᠦ᠍ ᠥᠪᠡᠰᠦᠪᠡᠨ ᠲᠣᠳᠣᠷᠬᠠᠢᠯᠠᠭᠰᠠᠨ ᠳ᠋ᠤᠺᠦ᠋ᠮᠧᠨ᠋ᠲ᠎ᠢ᠋ ᠨᠡᠮᠡᠬᠦ᠎ᠶ᠋ᠢᠨ ᠬᠠᠮᠲᠤ ᠶᠡᠬᠡ ᠬᠡᠯᠡᠨ᠎ᠦ᠌ ᠵᠠᠭᠪᠤᠷ᠎ᠢ᠋ ᠬᠠᠷᠢᠭᠤᠯᠬᠤ᠎ᠳ᠋ᠠᠭᠠᠨ ᠮᠡᠳᠡᠯᠭᠡ᠎ᠶ᠋ᠢᠨ ᠬᠥᠮᠥᠷᠭᠡ᠎ᠶ᠋ᠢ ᠡᠷᠢᠵᠦ ᠂ ᠳᠡᠭᠡᠷ᠎ᠡ ᠥᠭᠦᠯᠡᠭᠰᠡᠨ ᠪᠠᠢᠳᠠᠯ᠎ᠢ᠋ ᠰᠠᠢᠵᠢᠷᠠᠭᠤᠯᠵᠤ ᠪᠣᠯᠳᠠᠭ ᠃
      
ᠮᠡᠳᠡᠯᠭᠡ᠎ᠶ᠋ᠢᠨ ᠬᠥᠮᠥᠷᠭᠡ᠎ᠶ᠋ᠢ ᠰᠢᠨ᠎ᠡ᠎ᠪᠡᠷ ᠪᠠᠢᠭᠤᠯᠬᠤ᠎ᠳ᠋ᠤ᠌ ᠂ ᠲᠠ ᠪᠠᠷᠠᠭᠤᠨ ᠳᠣᠣᠷᠠᠲᠤ ᠥᠨᠴᠥᠭ᠎ᠦ᠋ᠨ 《 ᠰᠢᠨ᠎ᠡ᠎ᠪᠡᠷ ᠪᠠᠢᠭᠤᠯᠬᠤ 》 ᠲᠣᠪᠴᠢ᠎ᠶ᠋ᠢ ᠲᠣᠪᠴᠢᠳᠠᠬᠤ ᠪᠥᠭᠡᠳ ᠡᠭᠦᠳᠦᠨ ᠪᠠᠢᠭᠤᠯᠬᠤ ᠮᠡᠳᠡᠯᠭᠡ᠎ᠶ᠋ᠢᠨ ᠬᠥᠮᠥᠷᠭᠡ᠎ᠶ᠋ᠢᠨ ᠲᠥᠷᠥᠯ ᠬᠡᠯᠪᠡᠷᠢ᠎ᠶ᠋ᠢ ᠰᠣᠩᠭᠣᠵᠤ ᠪᠣᠯᠤᠨ᠎ᠠ ᠃ ᠤᠯᠠᠮᠵᠢᠯᠠᠯᠲᠤ ᠮᠡᠳᠡᠯᠭᠡ᠎ᠶ᠋ᠢᠨ ᠬᠥᠮᠥᠷᠭᠡ ᠨᠢ ᠳ᠋ᠤᠺᠦ᠋ᠮᠧᠨ᠋ᠲ᠎ᠡᠴᠡ ᠵᠠᠩᠭᠢᠯᠠᠭ᠎ᠠ᠎ᠶ᠋ᠢᠨ ᠦᠭᠡ᠎ᠶ᠋ᠢ ᠠᠪᠴᠤ ᠂ ᠡᠷᠢᠬᠦ ᠦᠶᠡᠰ ᠵᠠᠩᠭᠢᠯᠠᠭ᠎ᠠ᠎ᠶ᠋ᠢᠨ ᠦᠭᠡᠰ᠎ᠢ᠋ ᠡᠪᠦᠴᠡᠯᠳᠦᠭᠦᠯᠦᠨ᠎ᠡ ︔ ᠸᠧᠺᠲ᠋ᠣᠷ᠎ᠤ᠋ᠨ ᠮᠡᠳᠡᠯᠭᠡ᠎ᠶ᠋ᠢᠨ ᠬᠥᠮᠥᠷᠭᠡ ᠨᠢ ᠲᠧᠺᠰᠲ᠎ᠢ᠋ ᠳᠡᠭᠡᠳᠦ ᠬᠡᠮᠵᠢᠯᠲᠦ ᠣᠷᠣᠨ ᠵᠠᠢ᠎ᠳ᠋ᠠᠬᠢ ᠴᠢᠭᠯᠡᠯ᠎ᠦ᠋ᠨ ᠵᠠᠩᠭᠢ ︵ ᠳᠠᠷᠤᠢ ᠸᠧᠺᠲ᠋ᠣᠷ᠎ᠤ᠋ᠨ ᠲᠣᠭ᠎ᠠ ︶ ᠪᠣᠯᠭᠠᠨ ᠲᠤᠰᠬᠠᠵᠤ ᠂ ᠸᠧᠺᠲ᠋ᠣᠷ᠎ᠤ᠋ᠨ ᠬᠣᠭᠣᠷᠣᠨᠳᠣᠬᠢ ᠬᠠᠪᠴᠢᠭᠰᠠᠨ ᠥᠨᠴᠥᠭ᠎ᠲᠡᠢ ᠡᠪᠦᠴᠡᠯᠳᠦᠳᠡᠭ ︔ ᠵᠢᠷᠤᠭ᠎ᠤ᠋ᠨ ᠮᠡᠳᠡᠯᠭᠡ᠎ᠶ᠋ᠢᠨ ᠬᠥᠮᠥᠷᠭᠡ ᠨᠢ ᠡᠬᠢ ᠳᠡᠪᠲᠡᠷ᠎ᠡᠴᠡ ᠪᠣᠳᠠᠲᠤ ᠴᠣᠭᠴᠠ ᠵᠢᠴᠢ ᠪᠡᠶᠡᠲᠦ ᠴᠣᠭᠴᠠ᠎ᠶ᠋ᠢᠨ ᠬᠣᠭᠣᠷᠣᠨᠳᠣᠬᠢ ᠬᠣᠯᠪᠣᠭ᠎ᠠ᠎ᠶ᠋ᠢ ᠭᠠᠷᠭᠠᠨ ᠠᠪᠴᠤ ᠂ ᠬᠣᠯᠪᠣᠯᠳᠤᠭᠠᠳ ᠨᠧᠲ ᠪᠣᠯᠭᠠᠵᠤ ᠂ ᠡᠷᠢᠬᠦ ᠬᠠᠷᠠᠯᠲᠠ᠎ᠶ᠋ᠢ ᠦᠨᠳᠦᠰᠦᠯᠡᠨ ᠡᠷᠭᠢᠨ ᠲᠣᠭᠣᠷᠢᠨ᠎ᠤ᠋ ᠵᠠᠩᠭᠢᠶ᠎ᠠ ᠴᠡᠭ᠎ᠢ᠋ ᠪᠦᠷᠬᠦᠭᠰᠡᠨ ᠮᠡᠳᠡᠭᠡ ᠵᠠᠩᠭᠢ ᠃

ᠴᠢ ᠵᠠᠭᠠᠭ ᠳᠡᠭᠡᠷ᠎ᠡ ᠨᠢᠭᠡᠨᠲᠡ ᠪᠠᠢᠭᠤᠯᠤᠭᠰᠠᠨ ᠮᠡᠳᠡᠯᠭᠡ᠎ᠶ᠋ᠢᠨ ᠬᠥᠮᠥᠷᠭᠡ᠎ᠪᠡᠨ ᠣᠯᠵᠤ ᠦᠵᠡᠨ᠎ᠡ ᠃ 《 ᠨᠠᠢᠷᠠᠭᠤᠯᠬᠤ 》 ᠵᠤᠯᠭᠠᠭᠤᠷ᠎ᠲᠤ᠌ ᠲᠠ ᠰᠢᠨ᠎ᠡ ᠳ᠋ᠤᠺᠦ᠋ᠮᠧᠨ᠋ᠲ᠎ᠢ᠋ ᠨᠡᠮᠡᠬᠦ ᠪᠤᠶᠤ ᠨᠢᠭᠡᠨᠲᠡ ᠨᠡᠮᠡᠭᠰᠡᠨ ᠳ᠋ᠤᠺᠦ᠋ᠮᠧᠨ᠋ᠲ᠎ᠢ᠋ ᠬᠠᠢᠵᠤ ᠪᠣᠯᠤᠨ᠎ᠠ ᠃`,
      "ISee": "ᠣᠢᠯᠠᠭᠠᠭᠰᠠᠨ",
      "KeywordKB": "ᠤᠯᠠᠮᠵᠢᠯᠠᠯᠲᠤ ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠦ᠋ᠨ ᠰᠠᠨ",
      "VectorKB": "ᠸᠧᠺᠲ᠋ᠣᠷ ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠦ᠋ᠨ ᠰᠠᠨ",
      "GraphKB": "ᠭᠷᠠᠹᠢᠺ ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠦ᠋ᠨ ᠰᠠᠨ",
      "NewKB": (type) => `ᠰᠢᠨ᠎ᠡ ${type}`,
      "Name": "ᠨᠡᠷ᠎ᠡ",
      "Cancel": "ᠪᠣᠯᠢᠬᠤ",
      "Confirm": "ᠪᠠᠲᠤᠯᠠᠬᠤ",
      "SubTitle": (type, count) => `${type}, ${count} ᠪᠠᠷᠢᠮᠲᠠ ᠪᠢᠴᠢᠭ`,
      "Edit": "ᠵᠠᠰᠠᠪᠤᠷᠢᠯᠠᠬᠤ",
      "Delete": "ᠤᠰᠠᠳᠬᠠᠬᠤ",
      "EditKB": (name) => `ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠦ᠋ᠨ ᠰᠠᠨ ${name} ᠵᠠᠰᠠᠪᠤᠷᠢᠯᠠᠬᠤ`,
      "AddDoc": "ᠪᠠᠷᠢᠮᠲᠠ ᠪᠢᠴᠢᠭ ᠨᠡᠮᠡᠬᠦ",
      "Done": "ᠳᠠᠭᠤᠰᠬᠠᠬᠤ",
      "DeleteKB": "ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠦ᠋ᠨ ᠰᠠᠨ ᠤᠰᠠᠳᠬᠠᠬᠤ",
      "ConfirmDeleteKB": (name) => `ᠲᠠ ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠦ᠋ᠨ ᠰᠠᠨ ${name} ᠤᠰᠠᠳᠬᠠᠬᠤ ᠶ᠋ᠢ ᠬᠢᠬᠦ ᠬᠦᠰᠡᠭᠰᠡᠨ ᠦ?`,
      "KBNameNotEmpty": "ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠦ᠋ᠨ ᠰᠠᠨ ᠤ᠋ ᠨᠡᠷ᠎ᠡ ᠬᠣᠭᠣᠰᠣᠨ ᠪᠠᠢᠵᠤ ᠪᠣᠯᠬᠤ ᠦᠭᠡᠢ",
      "KBAlreadyExists": "ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠦ᠋ᠨ ᠰᠠᠩ ᠠᠯᠢ ᠬᠡᠳᠦᠢᠨ ᠪᠠᠢᠨ᠎ᠠ",
      "SuccessfullyCreatedKB": (type, name) => `${type} ${name} ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠪᠣᠢ ᠪᠣᠯᠤᠭᠰᠠᠨ`,
      "SuccessfullyAddDocument": "ᠪᠠᠷᠢᠮᠲᠠ ᠪᠢᠴᠢᠭ ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠨᠡᠮᠡᠭᠳᠡᠭᠰᠡᠨ",
      "SuccessfullyDeletedDocument": (name) => `${name} ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠤᠰᠠᠳᠬᠠᠭᠳᠠᠭᠰᠠᠨ`
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
