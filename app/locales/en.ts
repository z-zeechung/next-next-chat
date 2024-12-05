import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";
import { LocaleType } from "./index";

// if you are adding a new translation, please use PartialLocaleType instead of LocaleType

const isApp = !!getClientConfig()?.isApp;
const en: LocaleType = {

  NextChat: {
    SystemPrompt: ()=>`
      You are $N^2$CHAT, an intelligent assistant developed by $N^2$CHAT team.
      Current time is: ${new Date().toDateString()}
      To embed inline LaTeX, use e.g. $x^2$
      To embed LaTeX block, use e.g. $$e=mc^2$$
    `,
    SideBar: {
      ChatList: "Chat List",
      Manage: "Manage",
      Exit: "Return",
      NewChat: "New Chat",
      CountOfChats: (count: number) => `${count} conversation${count>1?'s':''}`,
      Select: "Select"
    },
    ChatArea: {
      More: "More",
      Return: "Return",
      ChatOptions: "Chat Options",
      Send: "Submit",
      SendPrompt: "Enter for submission. Shift + Enter for new line.",
      RolePlay: "Role Play",
      SwitchModel: "Switch Model",
      WebSearch: "Internet Search",
      Scripting: "Scripting",
      GenImage: "Image Generation",
      UploadFile: "Upload Image / Document",
      ChatPlugins: "Chat Plugins",
      IntelligentOffice: "Intelligent Office",
      WordDoc: "Word Document",
      PDFDoc: "PDF Document",
      Audio: "Audio",
      DeleteChat: "Delete Chat",
      ClearData: "Clear Data",
      SelectRole: "Select Role",
      SearchRole: "Search for roles...",
      New: "New",
      Use: "Activate",
      StopUse: "Deactivate",
      SwitchedToModel: (model: string) => `Switched to ${model=="regular"?"Regular":"Advanced"} model`,
      ManagePlugins: "Manage Plugins",
      AlreadyDeletedChat: "Deleted Chat",
      ClearDataPrompt: "This would clear all configurations and data. Continue?",
      Activated: (name:string) => `Activated ${name}`,
      Deactivated: (name:string) => `Deactivated ${name}`,
      Copy: "Copy",
      Delete: "Delete",
      Retry: "Retry",
      Using: "Using",
      Greeting: "How can I assist you today 🪄",
      Revert: "Revert",
      DefaultTopic: "New Conversation",
      KnowledgeBase: "Knowledge Base",
      QuickStart: "Quick Start",
      YouCanSeeInMore: "You can view these functions in the 'More' menu in the upper left corner of the input box.",
      Upload: "Upload",
      UploadDesc: "Perform image/document question answering based on long text models and multimodal models.",
      RolePlayDesc: "Enable large model role-playing or animated figures. You can customize the interaction of large models through prompt words, preset knowledge bases, Live2D figures, or even scripts.",
      NewRole: "New Role",
      PluginDesc: "Enable plugins to allow large models to invoke external functions, such as web queries, image generation, etc.",
      EnablePlugin: "Enable Plugins",
      NewPlugin: "New Custom Plugin",
      KBDesc: "Inject your documents into the knowledge base to enable the large model to answer your questions more accurately. You can choose to use a traditional knowledge base, a vector knowledge base, or a graph knowledge base.",
      KBDetail: "Expound",
      SeeKB: "Check Out Knowledge Bases",
      MakeTopicPrompt: "Summarize and directly return to the brief topic of this conversation. The theme should be limited to five words, starting with an emoji. Do not explain, do not punctuation, do not use modal particles, do not use redundant text, and do not bold. If there is no theme, please return directly \"💬 Chat\"."
    }
  },

  DevPage: {
    RolePlay: "Role Play",
    Live2D: "Digital Human",
    Script: "Scripting",
    Alter: "Change",
    RoleName: "Name: ",
    Prompt: "Prompt: ",
    InitDialog: "Initial Dialogue: ",
    User: "User",
    System: "System",
    Append: "Add",
    AutoGen: "Auto Generate",
    Clear: "Clear",
    ActivateTool: "Enable Ability: ",
    WebSearch: "Internet Search",
    ImageGen: "Image Generation",
    Scripting: "Scripting",
    Upload: "Upload",
    Save: "Save",
    Export: "Export",
    ChangeModel: "Change Model",
    Send: "Submit",
    Greeting: "How can I assist you today 🪄",
    Expand: "Expand",
    Collapse: "Collapse",
    Stop: "Stop",
    ReverseRolePrompt: "You are Chung, a tech enthusiast who has recently been developing a smart assistant app. Today, you just got back to your dormitory after class and started debugging your app. Now you are talking to the smart assistant you developed.",
    AssistantSays: "The chatbot said: ",
    SystemSays: "Following is system prompt message: ",
    UploadFile: "Upload File",
    Delete: "Delete"
  },

  KnowledgeBase: {
    New: "New",
    WhatsThis: "What's This?",
    Explaination: `Large language models are limited by the timeliness and comprehensiveness of their training data, which may result in inaccurate or outdated answers to specific questions. This situation can be improved by adding custom documents to a knowledge base and enabling the large language model to retrieve information from the knowledge base when answering questions.

To create a new knowledge base, you can click the "New" button in the lower right corner and select the type of knowledge base you wish to create. Traditional knowledge bases extract keywords from documents and perform keyword matching during retrieval. Vector knowledge bases map text to directional information in high-dimensional spaces (i.e., vectors), and perform matching by comparing the angles between vectors. Graph knowledge bases extract entities and relationships between entities from source text, connecting them into a network, and retrieve information by traversing the nodes surrounding the search target.

You will see the knowledge bases you have already created on the interface. In the "Modify" interface, you can add new documents or browse the documents that have already been added.`,
    ISee: "I See",
    KeywordKB: "Traditional Knowledge Base",
    VectorKB: "Vector Knowledge Base",
    GraphKB: "Graph Knowledge Base",
    NewKB: (type)=>`New ${type}`,
    Name: "Name",
    Cancel: "Cancel",
    Confirm: "Confirm",
    SubTitle: (type, count)=>`${type}, ${count} Document${count!=1?'s':''}`,
    Edit: "Modify",
    Delete: "Delete",
    EditKB: (name)=>`Modify Knowledge Base ${name}`,
    AddDoc: "Add Document(s)",
    Done: "Done",
    DeleteKB: "Delete Knowledge Base",
    ConfirmDeleteKB: (name)=>`Are you sure you want to delete knowledge base ${name} ?`,
    KBNameNotEmpty: "Knowledge base name cannot be empty",
    KBAlreadyExists: "Knowledge base already exists",
    SuccessfullyCreatedKB: (type, name)=>`Successfully created ${type} ${name}`,
    SuccessfullyAddDocument: "Successfully added document",
    SuccessfullyDeletedDocument: (name)=>`Successfully deleted ${name}`,
  },

  /** LEGACY */

  WIP: "Coming Soon...",
  Error: {
    Unauthorized: isApp
      ? "Invalid API Key, please check it in [Settings](/#/settings) page."
      : "Unauthorized access, please enter access code in [auth](/#/auth) page, or enter your OpenAI API Key.",
  },
  Auth: {
    Title: "Need Access Code",
    Tips: "Please enter access code below",
    SubTips: "Or enter your OpenAI or Google API Key",
    Input: "access code",
    Confirm: "Confirm",
    Later: "Later",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} messages`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} messages`,
    EditMessage: {
      Title: "Edit All Messages",
      Topic: {
        Title: "Topic",
        SubTitle: "Change the current topic",
      },
    },
    Actions: {
      ChatList: "Go To Chat List",
      CompressedHistory: "Compressed History Memory Prompt",
      Export: "Export All Messages as Markdown",
      Copy: "Copy",
      Stop: "Stop",
      Retry: "Retry",
      Pin: "Pin",
      PinToastContent: "Pinned 1 messages to contextual prompts",
      PinToastAction: "View",
      Delete: "Delete",
      Edit: "Edit",
    },
    Commands: {
      new: "Start a new chat",
      newm: "Start a new chat with mask",
      next: "Next Chat",
      prev: "Previous Chat",
      clear: "Clear Context",
      del: "Delete Chat",
    },
    InputActions: {
      Stop: "Stop",
      ToBottom: "To Latest",
      Theme: {
        auto: "Auto",
        light: "Light Theme",
        dark: "Dark Theme",
      },
      Prompt: "Prompts",
      Masks: "Masks",
      Clear: "Clear Context",
      Settings: "Settings",
      UploadImage: "Upload Images",
    },
    Rename: "Rename Chat",
    Typing: "Typing…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} to send`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter to wrap";
      }
      return inputHints + ", / to search prompts, : to use commands";
    },
    Send: "Send",
    Config: {
      Reset: "Reset to Default",
      SaveAs: "Save as Mask",
    },
    IsContext: "Contextual Prompt",
  },
  Export: {
    Title: "Export Messages",
    Copy: "Copy All",
    Download: "Download",
    MessageFromYou: "Message From You",
    MessageFromChatGPT: "Message From ChatGPT",
    Share: "Share to ShareGPT",
    Format: {
      Title: "Export Format",
      SubTitle: "Markdown or PNG Image",
    },
    IncludeContext: {
      Title: "Including Context",
      SubTitle: "Export context prompts in mask or not",
    },
    Steps: {
      Select: "Select",
      Preview: "Preview",
    },
    Image: {
      Toast: "Capturing Image...",
      Modal: "Long press or right click to save image",
    },
  },
  Select: {
    Search: "Search",
    All: "Select All",
    Latest: "Select Latest",
    Clear: "Clear",
  },
  Memory: {
    Title: "Memory Prompt",
    EmptyContent: "Nothing yet.",
    Send: "Send Memory",
    Copy: "Copy Memory",
    Reset: "Reset Session",
    ResetConfirm:
      "Resetting will clear the current conversation history and historical memory. Are you sure you want to reset?",
  },
  Home: {
    NewChat: "New Chat",
    DeleteChat: "Confirm to delete the selected conversation?",
    DeleteToast: "Chat Deleted",
    Revert: "Revert",
  },
  Settings: {
    Title: "Settings",
    SubTitle: "All Settings",
    Danger: {
      Reset: {
        Title: "Reset All Settings",
        SubTitle: "Reset all setting items to default",
        Action: "Reset",
        Confirm: "Confirm to reset all settings to default?",
      },
      Clear: {
        Title: "Clear All Data",
        SubTitle: "Clear all messages and settings",
        Action: "Clear",
        Confirm: "Confirm to clear all messages and settings?",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "All Languages",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Font Size",
      SubTitle: "Adjust font size of chat content",
    },
    InjectSystemPrompts: {
      Title: "Inject System Prompts",
      SubTitle: "Inject a global system prompt for every request",
    },
    InputTemplate: {
      Title: "Input Template",
      SubTitle: "Newest message will be filled to this template",
    },

    Update: {
      Version: (x: string) => `Version: ${x}`,
      IsLatest: "Latest version",
      CheckUpdate: "Check Update",
      IsChecking: "Checking update...",
      FoundUpdate: (x: string) => `Found new version: ${x}`,
      GoToUpdate: "Update",
    },
    SendKey: "Send Key",
    Theme: "Theme",
    TightBorder: "Tight Border",
    SendPreviewBubble: {
      Title: "Send Preview Bubble",
      SubTitle: "Preview markdown in bubble",
    },
    AutoGenerateTitle: {
      Title: "Auto Generate Title",
      SubTitle: "Generate a suitable title based on the conversation content",
    },
    Sync: {
      CloudState: "Last Update",
      NotSyncYet: "Not sync yet",
      Success: "Sync Success",
      Fail: "Sync Fail",

      Config: {
        Modal: {
          Title: "Config Sync",
          Check: "Check Connection",
        },
        SyncType: {
          Title: "Sync Type",
          SubTitle: "Choose your favorite sync service",
        },
        Proxy: {
          Title: "Enable CORS Proxy",
          SubTitle: "Enable a proxy to avoid cross-origin restrictions",
        },
        ProxyUrl: {
          Title: "Proxy Endpoint",
          SubTitle:
            "Only applicable to the built-in CORS proxy for this project",
        },

        WebDav: {
          Endpoint: "WebDAV Endpoint",
          UserName: "User Name",
          Password: "Password",
        },

        UpStash: {
          Endpoint: "UpStash Redis REST Url",
          UserName: "Backup Name",
          Password: "UpStash Redis REST Token",
        },
      },

      LocalState: "Local Data",
      Overview: (overview: any) => {
        return `${overview.chat} chats，${overview.message} messages，${overview.prompt} prompts，${overview.mask} masks`;
      },
      ImportFailed: "Failed to import from file",
    },
    Mask: {
      Splash: {
        Title: "Mask Splash Screen",
        SubTitle: "Show a mask splash screen before starting new chat",
      },
      Builtin: {
        Title: "Hide Builtin Masks",
        SubTitle: "Hide builtin masks in mask list",
      },
    },
    Prompt: {
      Disable: {
        Title: "Disable auto-completion",
        SubTitle: "Input / to trigger auto-completion",
      },
      List: "Prompt List",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} built-in, ${custom} user-defined`,
      Edit: "Edit",
      Modal: {
        Title: "Prompt List",
        Add: "Add One",
        Search: "Search Prompts",
      },
      EditModal: {
        Title: "Edit Prompt",
      },
    },
    HistoryCount: {
      Title: "Attached Messages Count",
      SubTitle: "Number of sent messages attached per request",
    },
    CompressThreshold: {
      Title: "History Compression Threshold",
      SubTitle:
        "Will compress if uncompressed messages length exceeds the value",
    },

    Usage: {
      Title: "Account Balance",
      SubTitle(used: any, total: any) {
        return `Used this month $${used}, subscription $${total}`;
      },
      IsChecking: "Checking...",
      Check: "Check",
      NoAccess: "Enter API Key to check balance",
    },
    Access: {
      AccessCode: {
        Title: "Access Code",
        SubTitle: "Access control Enabled",
        Placeholder: "Enter Code",
      },
      CustomEndpoint: {
        Title: "Custom Endpoint",
        SubTitle: "Use custom Azure or OpenAI service",
      },
      Provider: {
        Title: "Model Provider",
        SubTitle: "Select Azure or OpenAI",
      },
      OpenAI: {
        ApiKey: {
          Title: "OpenAI API Key",
          SubTitle: "User custom OpenAI Api Key",
          Placeholder: "sk-xxx",
        },

        Endpoint: {
          Title: "OpenAI Endpoint",
          SubTitle: "Must start with http(s):// or use /api/openai as default",
        },
      },
      Azure: {
        ApiKey: {
          Title: "Azure Api Key",
          SubTitle: "Check your api key from Azure console",
          Placeholder: "Azure Api Key",
        },

        Endpoint: {
          Title: "Azure Endpoint",
          SubTitle: "Example: ",
        },

        ApiVerion: {
          Title: "Azure Api Version",
          SubTitle: "Check your api version from azure console",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "Anthropic API Key",
          SubTitle:
            "Use a custom Anthropic Key to bypass password access restrictions",
          Placeholder: "Anthropic API Key",
        },

        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example:",
        },

        ApiVerion: {
          Title: "API Version (claude api version)",
          SubTitle: "Select and input a specific API version",
        },
      },
      CustomModel: {
        Title: "Custom Models",
        SubTitle: "Custom model options, seperated by comma",
      },
      Google: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Obtain your API Key from Google AI",
          Placeholder: "Enter your Google AI Studio API Key",
        },

        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example:",
        },

        ApiVersion: {
          Title: "API Version (specific to gemini-pro)",
          SubTitle: "Select a specific API version",
        },
      },
    },

    Model: "Model",
    Temperature: {
      Title: "Temperature",
      SubTitle: "A larger value makes the more random output",
    },
    TopP: {
      Title: "Top P",
      SubTitle: "Do not alter this value together with temperature",
    },
    MaxTokens: {
      Title: "Max Tokens",
      SubTitle: "Maximum length of input tokens and generated tokens",
    },
    PresencePenalty: {
      Title: "Presence Penalty",
      SubTitle:
        "A larger value increases the likelihood to talk about new topics",
    },
    FrequencyPenalty: {
      Title: "Frequency Penalty",
      SubTitle:
        "A larger value decreasing the likelihood to repeat the same line",
    },
  },
  Store: {
    DefaultTopic: "New Conversation",
    BotHello: "Hello! How can I assist you today?",
    Error: "Something went wrong, please try again later.",
    Prompt: {
      History: (content: string) =>
        "This is a summary of the chat history as a recap: " + content,
      Topic:
        "Please generate a four to five word title summarizing our conversation without any lead-in, punctuation, quotation marks, periods, symbols, bold text, or additional text. Remove enclosing quotation marks.",
      Summarize:
        "Summarize the discussion briefly in 200 words or less to use as a prompt for future context.",
    },
  },
  Copy: {
    Success: "Copied to clipboard",
    Failed: "Copy failed, please grant permission to access clipboard",
  },
  Download: {
    Success: "Content downloaded to your directory.",
    Failed: "Download failed.",
  },
  Context: {
    Toast: (x: any) => `With ${x} contextual prompts`,
    Edit: "Current Chat Settings",
    Add: "Add a Prompt",
    Clear: "Context Cleared",
    Revert: "Revert",
  },
  Plugin: {
    Name: "Plugin",
  },
  FineTuned: {
    Sysmessage: "You are an assistant that",
  },
  Mask: {
    Name: "Mask",
    Page: {
      Title: "Prompt Template",
      SubTitle: (count: number) => `${count} prompt templates`,
      Search: "Search Templates",
      Create: "Create",
    },
    Item: {
      Info: (count: number) => `${count} prompts`,
      Chat: "Chat",
      View: "View",
      Edit: "Edit",
      Delete: "Delete",
      DeleteConfirm: "Confirm to delete?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Edit Prompt Template ${readonly ? "(readonly)" : ""}`,
      Download: "Download",
      Clone: "Clone",
    },
    Config: {
      Avatar: "Bot Avatar",
      Name: "Bot Name",
      Sync: {
        Title: "Use Global Config",
        SubTitle: "Use global config in this chat",
        Confirm: "Confirm to override custom config with global config?",
      },
      HideContext: {
        Title: "Hide Context Prompts",
        SubTitle: "Do not show in-context prompts in chat",
      },
      Share: {
        Title: "Share This Mask",
        SubTitle: "Generate a link to this mask",
        Action: "Copy Link",
      },
    },
  },
  NewChat: {
    Return: "Return",
    Skip: "Just Start",
    Title: "Pick a Mask",
    SubTitle: "Chat with the Soul behind the Mask",
    More: "Find More",
    NotShow: "Never Show Again",
    ConfirmNoShow: "Confirm to disable？You can enable it in settings later.",
  },

  UI: {
    Confirm: "Confirm",
    Cancel: "Cancel",
    Close: "Close",
    Create: "Create",
    Edit: "Edit",
    Export: "Export",
    Import: "Import",
    Sync: "Sync",
    Config: "Config",
  },
  Exporter: {
    Description: {
      Title: "Only messages after clearing the context will be displayed",
    },
    Model: "Model",
    Messages: "Messages",
    Topic: "Topic",
    Time: "Time",
  },

  URLCommand: {
    Code: "Detected access code from url, confirm to apply? ",
    Settings: "Detected settings from url, confirm to apply?",
  },
};

export default en;
