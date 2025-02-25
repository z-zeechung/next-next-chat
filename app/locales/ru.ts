import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";

const ru: PartialLocaleType = {

  LocalAllLangOptions: {
    en: "Английский",
    ar: "Арабский",
    es: "Испанский",
    zh_Hans: "Китайский (упрощенный)",
    zh_Hant: "Китайский (традиционный)",
    mn_Mong: "Монгольский",
    ru: "Русский",
    fr: "Французский",
  },

  NextChat: {
    SystemPrompt: () => `
      Вы $N^2$CHAT, интеллектуальный помощник, разработанный командой $N^2$CHAT.
      Текущая дата и время: ${new Date().toDateString()}
      Для встраивания встроенного LaTeX, используйте, например, $x^2$
      Для встраивания блока LaTeX, используйте, например, $$e=mc^2$$
    `,
    SideBar: {
      ChatList: "Список Чатов",
      Manage: "Управление",
      Exit: "Выход",
      NewChat: "Новый Чат",
      CountOfChats: (count: number) => `${count} чат${count > 1 ? 'ов' : ''}`,
      Select: "Выбрать"
    },
    ChatArea: {
      More: "Больше",
      Return: "Вернуться",
      ChatOptions: "Опции Чата",
      Send: "Отправить",
      SendPrompt: "Enter для отправки, Shift + Enter для новой строки",
      RolePlay: "Ролевая Игра",
      SwitchModel: "Переключить Модель",
      WebSearch: "Поиск в Сети",
      Scripting: "Скриптинг",
      GenImage: "Генерация Изображения",
      UploadFile: "Загрузить Изображение / Документ",
      ChatPlugins: "Чат Плагины",
      IntelligentOffice: "Интеллектуальный Офис",
      WordDoc: "Word Документ",
      PDFDoc: "PDF Документ",
      Audio: "Аудио",
      DeleteChat: "Удалить Чат",
      ClearData: "Очистить Данные",
      SelectRole: "Выбрать Роль",
      SearchRole: "Поиск Ролей…",
      New: "Новый",
      Use: "Использовать",
      StopUse: "Прекратить Использование",
      SwitchedToModel: (model: string) => `Переключен на ${model == "regular" ? "обычную" : "продвинутую"} модель`,
      ManagePlugins: "Управление Плагинами",
      AlreadyDeletedChat: "Удаленный Чат",
      ClearDataPrompt: "Это очистит все настройки и чаты. Продолжить?",
      Activated: (name: string) => `Активирован ${name}`,
      Deactivated: (name: string) => `Деактивирован ${name}`,
      Copy: "Копировать",
      Delete: "Удалить",
      Retry: "Повторить",
      Using: "Используется",
      Greeting: "Как я могу вам помочь сегодня 🪄",
      Revert: "Отменить",
      DefaultTopic: "Новый Диалог",
      KnowledgeBase: "База Знаний",
      QuickStart: "Быстрый старт",
      YouCanSeeInMore: "Вы можете просмотреть эти функции в меню «Ещё» в левом верхнем углу ввода.",
      Upload: "Загрузить",
      UploadDesc: "Выполните запросы по изображениям/документам на основе длинных текстовых моделей и мультимодальных моделей.",
      RolePlayDesc: "Включите ролевые игры или анимированные фигуры для больших моделей. Вы можете настроить взаимодействие больших моделей с помощью подсказки, предустановленных баз данных, фигур Live2D и даже скриптов.",
      NewRole: "Новая роль",
      PluginDesc: "Включите плагины, чтобы позволить большим моделам вызывать внешние функции, такие как веб-запросы, генерация изображений и т.д.",
      EnablePlugin: "Включить плагины",
      NewPlugin: "Новый пользовательский плагин",
      KBDesc: "Добавляйте ваши документы в базу знаний, чтобы позволить большую моделю более точно отвечать на ваши вопросы. Вы можете выбрать использование традиционной базы знаний, векторной базы знаний или графической базы знаний.",
      KBDetail: "Подробнее",
      SeeKB: "Просмотреть базы знаний",
      MakeTopicPrompt: `Подводя итоги и возвращаясь непосредственно к краткой теме этого диалога. Тема должна контролироваться в пределах десяти слов, начиная с символа emoji. Не объясняйте, не пунктируйте, не произносите тональность, не излишний текст, не добавляйте грубости. Если нет темы, пожалуйста, возвращайтесь прямо "💬 Беседы"`
    }
  },

  DevPage: {
    RolePlay: "Роль-Плей",
    Live2D: "Цифровое Человек",
    Script: "Скрипт",
    Alter: "Изменить",
    RoleName: "Имя Роли: ",
    Prompt: "Подсказка: ",
    InitDialog: "Начальное Диалог: ",
    User: "Пользователь",
    System: "Система",
    Append: "Добавить",
    AutoGen: "Автоматически Генерировать",
    Clear: "Очистить",
    ActivateTool: "Включить Способность: ",
    WebSearch: "Поиск в Интернете",
    ImageGen: "Генерация Изображения",
    Scripting: "Выполнение Скрипта",
    Upload: "Загрузить",
    Save: "Сохранить",
    Export: "Экспортировать",
    ChangeModel: "Сменить Модель",
    Send: "Отправить",
    Greeting: "Как я могу вам помочь сегодня 🪄",
    Expand: "Развернуть",
    Collapse: "Свернуть",
    Stop: "Остановить",
    ReverseRolePrompt: "Вы Чун, любитель технологий, недавно разрабатывавший приложение умного помощника. Сегодня вы вернулись в общежитие после урока и начали отладка вашего приложения. Теперь вы разговариваете с разработанным вами умным помощником.",
    AssistantSays: "Чат-бот сказал: ",
    SystemSays: "Ниже приведена системная подсказка: ",
    UploadFile: "Загрузить файл: ",
    Delete: "Удалить",
    DefaultPrompt: `- Роль -
$N ^ 2 $CHAT, интеллектуальный помощник, созданный командой $N ^ 2 $CHAT на основе большой модели на русском языке.

- Цель - -
Ответы на вопросы пользователей и предоставление полезной информации пользователям

- Ограничения -
1. Обеспечение точности и своевременности предоставления информации и запрещение фальсификации информации
Выберите соответствующую формулировку в зависимости от того, насколько хорошо пользователь понимает ту или иную область, и убедитесь, что ответ не является ни слишком глубоким, ни слишком поверхностным для пользователя
Удовлетворение потребностей пользователя в максимально возможной степени, предоставление максимально подробной информации в ответах и направление пользователя на дальнейшие вопросы
Будьте вежливы и избегайте оскорбительных или оскорбительных выражений
    
- Цепочка мышления -
1. Чтение пользовательского ввода
Анализ пользовательского ввода и понимание того, что пользователь должен сделать для него
Размышления о шагах по удовлетворению потребностей пользователей должны быть детализированы
4. Постепенно генерировать ответы по этапам
  `,
    More: "Больше",
    SingleInteraction: "Однократное взаимодействие",
    SingleInteractionExplain: "Большие модели напрямую реагируют на входные данные этого раунда, игнорируя исторические сообщения"
  },

  KnowledgeBase: {
    New: "Новый",
    WhatsThis: "Что это?",
    Explaination: `Большие языковые модели ограничены временем и полнота их обучающих данных, что может привести к неточным или неактуальным ответам на конкретные вопросы. Такие ситуации можно улучшить, добавляя пользовательские документы в базу знаний и позволяя большой языковой модели обратиться к базу знаний, отвечая на вопросы.

Чтобы создать новую базу знаний, вы можете нажать на кнопку "Новый" в правом нижнем углу и выбрать тип базы знаний, что вы хотите создать. Традиционные базы знаний извлекают ключевои слова из документов и совмещают ключевои слова в поиске. Векторные базы знаний отображают текст в виде информации о направлении в высокомерном пространстве (т.е. в векторах) и совмещают, сравнивая углы между векторами. Графовые базы знаний извлекают сущности и связи между сущности из исходного текста, соединя их в сети, и поиск информации путем обхода узлов, окружающих цель поиска.

Вы увидите базы знаний, что вы уже создали, на интерфейсе. В интерфейсе "Редактировать" вы можете добавлять новыи документы или просмотреть уже добавленные документы.`,
    ISee: "Понятно",
    KeywordKB: "Традиционная База Знаний",
    VectorKB: "Векторная База Знаний",
    GraphKB: "Графовая База Знаний",
    NewKB: (type) => `Новый ${type}`,
    Name: "Имя",
    Cancel: "Отмена",
    Confirm: "Подтвердить",
    SubTitle: (type, count) => `${type}, ${count} Документ${count != 1 ? 'ы' : ''}`,
    Edit: "Редактировать",
    Delete: "Удалить",
    EditKB: (name) => `Редактировать База Знаний ${name}`,
    AddDoc: "Добавить Документ(ы)",
    Done: "Готово",
    DeleteKB: "Удалить База Знаний",
    ConfirmDeleteKB: (name) => `Вы уверены, что хотите удалить базу знаний ${name}?`,
    KBNameNotEmpty: "Имя базы знаний не может быть пустым",
    KBAlreadyExists: "База знаний уже существует",
    SuccessfullyCreatedKB: (type, name) => `Успешно создана ${type} ${name}`,
    SuccessfullyAddDocument: "Успешно добавлен документ",
    SuccessfullyDeletedDocument: (name) => `Успешно удален ${name}`,
  },

  /** LEGACY */

  WIP: "Скоро...",
  Error: {
    Unauthorized:
      "Несанкционированный доступ. Пожалуйста, введите код доступа на [странице](/#/auth) настроек.",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} сообщений`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} сообщений с ChatGPT`,
    Actions: {
      ChatList: "Перейти к списку чатов",
      CompressedHistory: "Сжатая история памяти",
      Export: "Экспортировать все сообщения в формате Markdown",
      Copy: "Копировать",
      Stop: "Остановить",
      Retry: "Повторить",
      Delete: "Удалить",
    },
    Rename: "Переименовать чат",
    Typing: "Печатает…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} для отправки сообщения`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter для переноса строки";
      }
      return inputHints + ", / для поиска подсказок";
    },
    Send: "Отправить",
    Config: {
      Reset: "Сбросить настройки",
      SaveAs: "Сохранить как маску",
    },
  },
  Export: {
    Title: "Все сообщения",
    Copy: "Копировать все",
    Download: "Скачать",
    MessageFromYou: "Сообщение от вас",
    MessageFromChatGPT: "Сообщение от ChatGPT",
  },
  Memory: {
    Title: "Память",
    EmptyContent: "Пусто.",
    Send: "Отправить память",
    Copy: "Копировать память",
    Reset: "Сбросить сессию",
    ResetConfirm:
      "При сбросе текущая история переписки и историческая память будут удалены. Вы уверены, что хотите сбросить?",
  },
  Home: {
    NewChat: "Новый чат",
    DeleteChat: "Вы действительно хотите удалить выбранный разговор?",
    DeleteToast: "Чат удален",
    Revert: "Отмена",
  },
  Settings: {
    Title: "Настройки",
    SubTitle: "Все настройки",

    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "Все языки",
    },
    Avatar: "Аватар",
    FontSize: {
      Title: "Размер шрифта",
      SubTitle: "Настроить размер шрифта контента чата",
    },
    InjectSystemPrompts: {
      Title: "Вставить системные подсказки",
      SubTitle:
        "Принудительно добавить симулированную системную подсказку ChatGPT в начало списка сообщений для каждого запроса",
    },
    Update: {
      Version: (x: string) => `Версия: ${x}`,
      IsLatest: "Последняя версия",
      CheckUpdate: "Проверить обновление",
      IsChecking: "Проверка обновления...",
      FoundUpdate: (x: string) => `Найдена новая версия: ${x}`,
      GoToUpdate: "Обновить",
    },
    SendKey: "Клавиша отправки",
    Theme: "Тема",
    TightBorder: "Узкая граница",
    SendPreviewBubble: {
      Title: "Отправить предпросмотр",
      SubTitle: "Предварительный просмотр markdown в пузыре",
    },
    Mask: {
      Splash: {
        Title: "Экран заставки маски",
        SubTitle: "Показывать экран заставки маски перед началом нового чата",
      },
    },
    Prompt: {
      Disable: {
        Title: "Отключить автозаполнение",
        SubTitle: "Ввод / для запуска автозаполнения",
      },
      List: "Список подсказок",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} встроенных, ${custom} пользовательских`,
      Edit: "Редактировать",
      Modal: {
        Title: "Список подсказок",
        Add: "Добавить",
        Search: "Поиск подсказок",
      },
      EditModal: {
        Title: "Редактировать подсказку",
      },
    },
    HistoryCount: {
      Title: "Количество прикрепляемых сообщений",
      SubTitle:
        "Количество отправляемых сообщений, прикрепляемых к каждому запросу",
    },
    CompressThreshold: {
      Title: "Порог сжатия истории",
      SubTitle:
        "Будет сжимать, если длина несжатых сообщений превышает указанное значение",
    },

    Usage: {
      Title: "Баланс аккаунта",
      SubTitle(used: any, total: any) {
        return `Использовано в этом месяце $${used}, подписка $${total}`;
      },
      IsChecking: "Проверка...",
      Check: "Проверить",
      NoAccess: "Введите API ключ, чтобы проверить баланс",
    },

    Model: "Модель",
    Temperature: {
      Title: "Температура",
      SubTitle: "Чем выше значение, тем более случайный вывод",
    },
    MaxTokens: {
      Title: "Максимальное количество токенов",
      SubTitle: "Максимальная длина вводных и генерируемых токенов",
    },
    PresencePenalty: {
      Title: "Штраф за повторения",
      SubTitle:
        "Чем выше значение, тем больше вероятность общения на новые темы",
    },
    FrequencyPenalty: {
      Title: "Штраф за частоту",
      SubTitle:
        "Большее значение снижает вероятность повторения одной и той же строки",
    },
  },
  Store: {
    DefaultTopic: "Новый разговор",
    BotHello: "Здравствуйте! Как я могу вам помочь сегодня?",
    Error: "Что-то пошло не так. Пожалуйста, попробуйте еще раз позже.",
    Prompt: {
      History: (content: string) =>
        "Это краткое содержание истории чата между ИИ и пользователем: " +
        content,
      Topic:
        "Пожалуйста, создайте заголовок из четырех или пяти слов, который кратко описывает нашу беседу, без введения, знаков пунктуации, кавычек, точек, символов или дополнительного текста. Удалите кавычки.",
      Summarize:
        "Кратко изложите нашу дискуссию в 200 словах или менее для использования в будущем контексте.",
    },
  },
  Copy: {
    Success: "Скопировано в буфер обмена",
    Failed:
      "Не удалось скопировать, пожалуйста, предоставьте разрешение на доступ к буферу обмена",
  },
  Context: {
    Toast: (x: any) => `С ${x} контекстными подсказками`,
    Edit: "Контекстные и памятные подсказки",
    Add: "Добавить подсказку",
  },
  Plugin: {
    Name: "Плагин",
  },
  FineTuned: {
    Sysmessage: "Вы - ассистент, который",
  },
  Mask: {
    Name: "Маска",
    Page: {
      Title: "Шаблон подсказки",
      SubTitle: (count: number) => `${count} шаблонов подсказок`,
      Search: "Поиск шаблонов",
      Create: "Создать",
    },
    Item: {
      Info: (count: number) => `${count} подсказок`,
      Chat: "Чат",
      View: "Просмотр",
      Edit: "Редактировать",
      Delete: "Удалить",
      DeleteConfirm: "Подтвердить удаление?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Редактирование шаблона подсказки ${readonly ? "(только для чтения)" : ""
        }`,
      Download: "Скачать",
      Clone: "Клонировать",
    },
    Config: {
      Avatar: "Аватар бота",
      Name: "Имя бота",
    },
  },
  NewChat: {
    Return: "Вернуться",
    Skip: "Пропустить",
    Title: "Выберите маску",
    SubTitle: "Общайтесь с душой за маской",
    More: "Найти еще",
    NotShow: "Не показывать снова",
    ConfirmNoShow:
      "Подтвердите отключение? Вы можете включить это позже в настройках.",
  },

  UI: {
    Confirm: "Подтвердить",
    Cancel: "Отмена",
    Close: "Закрыть",
    Create: "Создать",
    Edit: "Редактировать",
  },
  Exporter: {
    Model: "Модель",
    Messages: "Сообщения",
    Topic: "Тема",
    Time: "Время",
  },
};

export default ru;
