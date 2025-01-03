import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";
var lunar = require('lunar');

const isApp = !!getClientConfig()?.isApp;

const zh_Hans = {

  LocalAllLangOptions: {
    ar: "阿拉伯文",
    ru: "俄文",
    fr: "法文",
    mn_Mong: "蒙古文",
    es: "西班牙文",
    en: "英文",
    zh_Hans: "中文（简体）",
    zh_Hant: "中文（繁体）",
  },

  NextChat: {
    Name: "N²CHAT",
    SystemPrompt: ()=>`
      你是$N^2$CHAT，一个由$N^2$CHAT团队创建的智能助手。
      当前时间为：${new Date().toLocaleString()}，${lunar(new Date()).toString()}
      要嵌入内联式LaTeX，请使用e.g. $x^2$
      要嵌入LaTeX块，请使用e.g. $$e=mc^2$$
    `,
    SideBar: {
      ChatList: "聊天列表",
      Manage: "管理",
      Exit: "退出",
      NewChat: "新的聊天",
      CountOfChats: (count: number) => `${count} 条对话`,
      Select: "选择"
    },
    ChatArea: {
      More: "更多",
      Return: "返回",
      ChatOptions: "聊天选项",
      Send: "发送",
      SendPrompt: "Enter 发送，Shift + Enter 换行",
      RolePlay: "角色扮演",
      SwitchModel: "切换模型",
      WebSearch: "联网搜索",
      Scripting: "脚本执行",
      GenImage: "图像生成",
      UploadFile: "上传图片/文档",
      ChatPlugins: "对话插件",
      IntelligentOffice: "智能办公",
      WordDoc: "Word 文档",
      PDFDoc: "PDF 文档",
      Audio: "音频",
      DeleteChat: "删除对话",
      ClearData: "清除数据",
      SelectRole: "选择角色",
      SearchRole: "搜索角色……",
      New: "新建",
      Use: "使用",
      StopUse: "停用",
      SwitchedToModel: (model: string) => `已切换至${model=="regular"?"普通":"高级"}模型`,
      ManagePlugins: "管理插件",
      AlreadyDeletedChat: "已删除对话",
      ClearDataPrompt: "这将会清除所有设置及聊天记录。要继续吗？",
      Activated: (name:string) => `已启用${name}`,
      Deactivated: (name:string) => `已关闭${name}`,
      Copy: "复制",
      Delete: "删除",
      Retry: "重试",
      Using: "正在使用",
      Greeting: "有什么我可以帮助您的吗🪄",
      Revert: "撤销",
      DefaultTopic: "新的聊天",
      KnowledgeBase: "知识库",
      QuickStart: "快速开始",
      YouCanSeeInMore: "你可以在输入框左上角的“更多”菜单中查看这些功能。",
      Upload: "上传",
      UploadDesc: "基于长文本模型和多模态模型进行图片/文档问答。",
      RolePlayDesc: "启用大模型角色扮演或动画形象。你可以通过提示词，预置知识库，Live2D形象乃至脚本来自定义大模型的交互。",
      NewRole: "新建角色",
      PluginDesc: "启用插件以使得大模型能够调用外部功能，如网络查询、图像生成等。",
      EnablePlugin: "启用插件",
      NewPlugin: "自定义插件",
      KBDesc: "向知识库中注入你的文档，使得大模型能够更加准确地回答你的问题。你可以选择使用传统知识库，向量知识库或图知识库。",
      KBDetail: "详细说明",
      SeeKB: "查看知识库",
      MakeTopicPrompt: "总结并直接返回这段对话的简要主题。主题应控制在十个字以内，开头字符为一个emoji。不要解释、不要标点、不要语气词、不要多余文本，不要加粗。如果没有主题，请直接返回“💬闲聊”"
    },
  },

  DevPage: {
    RolePlay: "角色扮演",
    Live2D: "数字人",
    Script: "脚本",
    Alter: "更改",
    RoleName: "角色名称：",
    Prompt: "提示词：",
    InitDialog: "初始对话：",
    User: "用户",
    System: "系统",
    Append: "新增",
    AutoGen: "自动生成",
    Clear: "清空",
    ActivateTool: "启用能力：",
    WebSearch: "联网搜索",
    ImageGen: "图像生成",
    Scripting: "脚本执行",
    Upload: "上传",
    Save: "保存",
    Export: "导出",
    ChangeModel: "切换模型",
    Send: "发送",
    Greeting: "有什么我可以帮助您的吗🪄",
    Expand: "展开",
    Collapse: "收起",
    Stop: "停止",
    ReverseRolePrompt: "你是小充，是一名科技爱好者，最近正在开发一款智能助手应用。这天，你刚下课回到宿舍，调试你开发的应用。现在你正在与你开发的智能助手交谈。",
    AssistantSays: "智能助手说：",
    SystemSays: "以下为系统提示信息：",
    UploadFile: "上传文档：",
    Delete: "删除",
    DefaultPrompt: `- 角色 -
  $N^2$CHAT，一个由$N^2$CHAT团队创建的智能助手，基于中文大模型。

- 目标 -
  1. 回答用户问题，为用户提供有用的信息

- 约束 -
  1. 确保提供信息的准确性与时效性，禁止编造虚假信息
  2. 根据用户对某一领域了解程度的深浅，选择相应的措辞，确保回答对于用户既不过于深奥又不过于浅显
  3. 尽可能地满足用户的需求，回答中尽可能提供详细的信息，并引导用户提出进一步的问题
  4. 保持礼貌，避免使用侮辱性或冒犯性的语言

- 思维链 -
  1. 阅读用户输入
  2. 分析用户输入，理解用户需要你为他做什么
  3. 思考满足用户需求的步骤，这应当是一个细化的步骤
  4. 按照步骤逐步生成回答
    `,
    More: "更多",
    SingleInteraction: "单次交互",
    SingleInteractionExplain: "大模型直接响应本轮输入，忽略历史消息"
  },

  KnowledgeBase: {
    New: "新建",
    WhatsThis: "这是什么？",
    Explaination: `大语言模型受限于其训练数据的时效性与全面性，对于特定的问题，其回答可能会不够准确或不够及时。通过向知识库中添加自定义文档，并让大语言模型回答时检索知识库，能够改善上述情况。

要新建知识库，你可以点击右下角的“新建”按钮，并选择要创建的知识库类型。传统知识库从文档中提取关键词，检索时进行关键词匹配；向量知识库将文本映射为高维空间中的方向信息（即向量），通过比对向量与向量间的夹角来进行匹配；图知识库从源文本中提取实体以及实体间的联系，连结成网络，根据检索目标遍历周围结点的信息。

你会在界面上看见你已经创建了的知识库。在“编辑”界面中，你可以添加新的文档，或浏览已经添加的文档。`,
    ISee: "明白了",
    KeywordKB: "传统知识库",
    VectorKB: "向量知识库",
    GraphKB: "图知识库",
    NewKB: (type)=>`新建${type}`,
    Name: "名称",
    Cancel: "取消",
    Confirm: "确认",
    SubTitle: (type, count)=>`${type}，${count} 篇文档`,
    Edit: "编辑",
    Delete: "删除",
    EditKB: (name)=>`编辑知识库${name}`,
    AddDoc: "添加文档",
    Done: "完成",
    DeleteKB: "删除知识库",
    ConfirmDeleteKB: (name)=>`确定要知识库 ${name} 吗？`,
    KBNameNotEmpty: "知识库名称不能为空",
    KBAlreadyExists: "知识库已存在",
    SuccessfullyCreatedKB: (type, name)=>`成功创建${type} ${name}`,
    SuccessfullyAddDocument: "成功添加文档",
    SuccessfullyDeletedDocument: (name)=>`成功删除文档 ${name}`,
  },

  /** LEGACY */

  WIP: "该功能仍在开发中……",
  Error: {
    Unauthorized: isApp
      ? "检测到无效 API Key，请前往[设置](/#/settings)页检查 API Key 是否配置正确。"
      : "访问密码不正确或为空，请前往[登录](/#/auth)页输入正确的访问密码，或者在[设置](/#/settings)页填入你自己的 OpenAI API Key。",
  },
  Auth: {
    Title: "需要密码",
    Tips: "管理员开启了密码验证，请在下方填入访问码",
    SubTips: "或者输入你的 OpenAI 或 Google API 密钥",
    Input: "在此处填写访问码",
    Confirm: "确认",
    Later: "稍后再说",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} 条对话`,
  },
  Chat: {
    SubTitle: (count: number) => `共 ${count} 条对话`,
    EditMessage: {
      Title: "编辑消息记录",
      Topic: {
        Title: "聊天主题",
        SubTitle: "更改当前聊天主题",
      },
    },
    Actions: {
      ChatList: "查看消息列表",
      CompressedHistory: "查看压缩后的历史 Prompt",
      Export: "导出聊天记录",
      Copy: "复制",
      Stop: "停止",
      Retry: "重试",
      Pin: "固定",
      PinToastContent: "已将 1 条对话固定至预设提示词",
      PinToastAction: "查看",
      Delete: "删除",
      Edit: "编辑",
    },
    Commands: {
      new: "新建聊天",
      newm: "从面具新建聊天",
      next: "下一个聊天",
      prev: "上一个聊天",
      clear: "清除上下文",
      del: "删除聊天",
    },
    InputActions: {
      Stop: "停止响应",
      ToBottom: "滚到最新",
      Theme: {
        auto: "自动主题",
        light: "亮色模式",
        dark: "深色模式",
      },
      Prompt: "快捷指令",
      Masks: "所有面具",
      Clear: "清除聊天",
      Settings: "对话设置",
      UploadImage: "上传图片",
    },
    Rename: "重命名对话",
    Typing: "正在输入…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} 发送`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter 换行";
      }
      return inputHints + "，/ 触发补全，: 触发命令";
    },
    Send: "发送",
    Config: {
      Reset: "清除记忆",
      SaveAs: "存为面具",
    },
    IsContext: "预设提示词",
  },
  Export: {
    Title: "分享聊天记录",
    Copy: "全部复制",
    Download: "下载文件",
    Share: "分享到 ShareGPT",
    MessageFromYou: "用户",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "导出格式",
      SubTitle: "可以导出 Markdown 文本或者 PNG 图片",
    },
    IncludeContext: {
      Title: "包含面具上下文",
      SubTitle: "是否在消息中展示面具上下文",
    },
    Steps: {
      Select: "选取",
      Preview: "预览",
    },
    Image: {
      Toast: "正在生成截图",
      Modal: "长按或右键保存图片",
    },
  },
  Select: {
    Search: "搜索消息",
    All: "选取全部",
    Latest: "最近几条",
    Clear: "清除选中",
  },
  Memory: {
    Title: "历史摘要",
    EmptyContent: "对话内容过短，无需总结",
    Send: "自动压缩聊天记录并作为上下文发送",
    Copy: "复制摘要",
    Reset: "[unused]",
    ResetConfirm: "确认清空历史摘要？",
  },
  Home: {
    NewChat: "新的聊天",
    DeleteChat: "确认删除选中的对话？",
    DeleteToast: "已删除会话",
    Revert: "撤销",
  },
  Settings: {
    Title: "设置",
    SubTitle: "所有设置选项",

    Danger: {
      Reset: {
        Title: "重置所有设置",
        SubTitle: "重置所有设置项回默认值",
        Action: "立即重置",
        Confirm: "确认重置所有设置？",
      },
      Clear: {
        Title: "清除所有数据",
        SubTitle: "清除所有聊天、设置数据",
        Action: "立即清除",
        Confirm: "确认清除所有聊天、设置数据？",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "所有语言",
    },
    Avatar: "头像",
    FontSize: {
      Title: "字体大小",
      SubTitle: "聊天内容的字体大小",
    },
    InjectSystemPrompts: {
      Title: "注入系统级提示信息",
      SubTitle: "强制给每次请求的消息列表开头添加一个模拟 ChatGPT 的系统提示",
    },
    InputTemplate: {
      Title: "用户输入预处理",
      SubTitle: "用户最新的一条消息会填充到此模板",
    },

    Update: {
      Version: (x: string) => `当前版本：${x}`,
      IsLatest: "已是最新版本",
      CheckUpdate: "检查更新",
      IsChecking: "正在检查更新...",
      FoundUpdate: (x: string) => `发现新版本：${x}`,
      GoToUpdate: "前往更新",
    },
    SendKey: "发送键",
    Theme: "主题",
    TightBorder: "无边框模式",
    SendPreviewBubble: {
      Title: "预览气泡",
      SubTitle: "在预览气泡中预览 Markdown 内容",
    },
    AutoGenerateTitle: {
      Title: "自动生成标题",
      SubTitle: "根据对话内容生成合适的标题",
    },
    Sync: {
      CloudState: "云端数据",
      NotSyncYet: "还没有进行过同步",
      Success: "同步成功",
      Fail: "同步失败",

      Config: {
        Modal: {
          Title: "配置云同步",
          Check: "检查可用性",
        },
        SyncType: {
          Title: "同步类型",
          SubTitle: "选择喜爱的同步服务器",
        },
        Proxy: {
          Title: "启用代理",
          SubTitle: "在浏览器中同步时，必须启用代理以避免跨域限制",
        },
        ProxyUrl: {
          Title: "代理地址",
          SubTitle: "仅适用于本项目自带的跨域代理",
        },

        WebDav: {
          Endpoint: "WebDAV 地址",
          UserName: "用户名",
          Password: "密码",
        },

        UpStash: {
          Endpoint: "UpStash Redis REST Url",
          UserName: "备份名称",
          Password: "UpStash Redis REST Token",
        },
      },

      LocalState: "本地数据",
      Overview: (overview: any) => {
        return `${overview.chat} 次对话，${overview.message} 条消息，${overview.prompt} 条提示词，${overview.mask} 个面具`;
      },
      ImportFailed: "导入失败",
    },
    Mask: {
      Splash: {
        Title: "面具启动页",
        SubTitle: "新建聊天时，展示面具启动页",
      },
      Builtin: {
        Title: "隐藏内置面具",
        SubTitle: "在所有面具列表中隐藏内置面具",
      },
    },
    Prompt: {
      Disable: {
        Title: "禁用提示词自动补全",
        SubTitle: "在输入框开头输入 / 即可触发自动补全",
      },
      List: "自定义提示词列表",
      ListCount: (builtin: number, custom: number) =>
        `内置 ${builtin} 条，用户定义 ${custom} 条`,
      Edit: "编辑",
      Modal: {
        Title: "提示词列表",
        Add: "新建",
        Search: "搜索提示词",
      },
      EditModal: {
        Title: "编辑提示词",
      },
    },
    HistoryCount: {
      Title: "附带历史消息数",
      SubTitle: "每次请求携带的历史消息数",
    },
    CompressThreshold: {
      Title: "历史消息长度压缩阈值",
      SubTitle: "当未压缩的历史消息超过该值时，将进行压缩",
    },

    Usage: {
      Title: "余额查询",
      SubTitle(used: any, total: any) {
        return `本月已使用 $${used}，订阅总额 $${total}`;
      },
      IsChecking: "正在检查…",
      Check: "重新检查",
      NoAccess: "输入 API Key 或访问密码查看余额",
    },

    Access: {
      AccessCode: {
        Title: "访问密码",
        SubTitle: "管理员已开启加密访问",
        Placeholder: "请输入访问密码",
      },
      CustomEndpoint: {
        Title: "自定义接口",
        SubTitle: "是否使用自定义 Azure 或 OpenAI 服务",
      },
      Provider: {
        Title: "模型服务商",
        SubTitle: "切换不同的服务商",
      },
      OpenAI: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "使用自定义 OpenAI Key 绕过密码访问限制",
          Placeholder: "OpenAI API Key",
        },

        Endpoint: {
          Title: "接口地址",
          SubTitle: "除默认地址外，必须包含 http(s)://",
        },
      },
      Azure: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义 Azure Key 绕过密码访问限制",
          Placeholder: "Azure API Key",
        },

        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },

        ApiVerion: {
          Title: "接口版本 (azure api version)",
          SubTitle: "选择指定的部分版本",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义 Anthropic Key 绕过密码访问限制",
          Placeholder: "Anthropic API Key",
        },

        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },

        ApiVerion: {
          Title: "接口版本 (claude api version)",
          SubTitle: "选择一个特定的 API 版本输入",
        },
      },
      Google: {
        ApiKey: {
          Title: "API 密钥",
          SubTitle: "从 Google AI 获取您的 API 密钥",
          Placeholder: "输入您的 Google AI Studio API 密钥",
        },

        Endpoint: {
          Title: "终端地址",
          SubTitle: "示例：",
        },

        ApiVersion: {
          Title: "API 版本（仅适用于 gemini-pro）",
          SubTitle: "选择一个特定的 API 版本",
        },
      },
      CustomModel: {
        Title: "自定义模型名",
        SubTitle: "增加自定义模型可选项，使用英文逗号隔开",
      },
    },

    Model: "模型 (model)",
    Temperature: {
      Title: "随机性 (temperature)",
      SubTitle: "值越大，回复越随机",
    },
    TopP: {
      Title: "核采样 (top_p)",
      SubTitle: "与随机性类似，但不要和随机性一起更改",
    },
    MaxTokens: {
      Title: "单次回复限制 (max_tokens)",
      SubTitle: "单次交互所用的最大 Token 数",
    },
    PresencePenalty: {
      Title: "话题新鲜度 (presence_penalty)",
      SubTitle: "值越大，越有可能扩展到新话题",
    },
    FrequencyPenalty: {
      Title: "频率惩罚度 (frequency_penalty)",
      SubTitle: "值越大，越有可能降低重复字词",
    },
  },
  Store: {
    DefaultTopic: "新的聊天",
    BotHello: "有什么可以帮你的吗🪄",
    Error: "出错了，稍后重试吧",
    Prompt: {
      History: (content: string) => "这是历史聊天总结作为前情提要：" + content,
      Topic:
        "总结并直接返回这段对话的简要主题。主题应控制在十个字以内。不要解释、不要标点、不要语气词、不要多余文本，不要加粗。如果没有主题，请直接返回“闲聊”",
      Summarize:
        "简要总结一下对话内容，用作后续的上下文提示 prompt，控制在 200 字以内",
    },
  },
  Copy: {
    Success: "已写入剪切板",
    Failed: "复制失败，请赋予剪切板权限",
  },
  Download: {
    Success: "内容已下载到您的目录。",
    Failed: "下载失败。",
  },
  Context: {
    Toast: (x: any) => `包含 ${x} 条预设提示词`,
    Edit: "当前对话设置",
    Add: "新增一条对话",
    Clear: "上下文已清除",
    Revert: "恢复上下文",
  },
  Plugin: {
    Name: "插件",
  },
  FineTuned: {
    Sysmessage: "你是一个助手",
  },
  Mask: {
    Name: "面具",
    Page: {
      Title: "预设角色面具",
      SubTitle: (count: number) => `${count} 个预设角色定义`,
      Search: "搜索角色面具",
      Create: "新建",
    },
    Item: {
      Info: (count: number) => `包含 ${count} 条预设对话`,
      Chat: "对话",
      View: "查看",
      Edit: "编辑",
      Delete: "删除",
      DeleteConfirm: "确认删除？",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `编辑预设面具 ${readonly ? "（只读）" : ""}`,
      Download: "下载预设",
      Clone: "克隆预设",
    },
    Config: {
      Avatar: "角色头像",
      Name: "角色名称",
      Sync: {
        Title: "使用全局设置",
        SubTitle: "当前对话是否使用全局模型设置",
        Confirm: "当前对话的自定义设置将会被自动覆盖，确认启用全局设置？",
      },
      HideContext: {
        Title: "隐藏预设对话",
        SubTitle: "隐藏后预设对话不会出现在聊天界面",
      },
      Share: {
        Title: "分享此面具",
        SubTitle: "生成此面具的直达链接",
        Action: "复制链接",
      },
    },
  },
  NewChat: {
    Return: "返回",
    Skip: "直接开始",
    NotShow: "不再展示",
    ConfirmNoShow: "确认禁用？禁用后可以随时在设置中重新启用。",
    Title: "挑选一个面具",
    SubTitle: "现在开始，与面具背后的灵魂思维碰撞",
    More: "查看全部",
  },

  URLCommand: {
    Code: "检测到链接中已经包含访问码，是否自动填入？",
    Settings: "检测到链接中包含了预制设置，是否自动填入？",
  },

  UI: {
    Confirm: "确认",
    Cancel: "取消",
    Close: "关闭",
    Create: "新建",
    Edit: "编辑",
    Export: "导出",
    Import: "导入",
    Sync: "同步",
    Config: "配置",
  },
  Exporter: {
    Description: {
      Title: "只有清除上下文之后的消息会被展示",
    },
    Model: "模型",
    Messages: "消息",
    Topic: "主题",
    Time: "时间",
  },
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type LocaleType = typeof zh_Hans;
export type PartialLocaleType = DeepPartial<typeof zh_Hans>;

export default zh_Hans;
