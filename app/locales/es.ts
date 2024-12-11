import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";

const es: PartialLocaleType = {

  LocalAllLangOptions: {
    "ar": "Árabe",
    "zh_Hans": "Chino (Simplificado)",
    "zh_Hant": "Chino (Tradicional)",
    "es": "Español",
    "fr": "Frances",
    "en": "Ingles",
    "mn_Mong": "Mongol",
    "ru": "Ruso",
  },

  NextChat: {
    SystemPrompt: () => `
      Usted es $N^2$CHAT, un asistente inteligente desarrollado por el equipo de $N^2$CHAT.
      La hora actual es: ${new Date().toDateString()}
      Para incrustar LaTeX en línea, use por ejemplo $x^2$
      Para incrustar un bloque de LaTeX, use por ejemplo $$e=mc^2$$
    `,
    SideBar: {
      ChatList: "Lista de Chats",
      Manage: "Gestionar",
      Exit: "Salir",
      NewChat: "Nuevo Chat",
      CountOfChats: (count: number) => `${count} conversaciones`,
      Select: "Seleccionar"
    },
    ChatArea: {
      More: "Más",
      Return: "Volver",
      ChatOptions: "Opciones de Chat",
      Send: "Enviar",
      SendPrompt: "Enter para enviar. Shift + Enter para nueva línea.",
      RolePlay: "Juego de Roles",
      SwitchModel: "Cambiar Modelo",
      WebSearch: "Búsqueda en la Red",
      Scripting: "Scripting",
      GenImage: "Generación de Imágenes",
      UploadFile: "Subir Imágenes / Documentos",
      ChatPlugins: "Plugins de Chat",
      IntelligentOffice: "Oficina Inteligente",
      WordDoc: "Documento Word",
      PDFDoc: "Documento PDF",
      Audio: "Audio",
      DeleteChat: "Eliminar Chat",
      ClearData: "Limpiar Datos",
      SelectRole: "Seleccionar Rol",
      SearchRole: "Buscar Roles...",
      New: "Nuevo",
      Use: "Usar",
      StopUse: "Dejar de Usar",
      SwitchedToModel: (model: string) => `Cambiado a ${model == "regular" ? "Regular" : "Avanzado"} modelo`,
      ManagePlugins: "Gestionar Plugins",
      AlreadyDeletedChat: "Chat Eliminado",
      ClearDataPrompt: "Esto limpiará todas las configuraciones y datos. ¿Continuar?",
      Activated: (name: string) => `Activado ${name}`,
      Deactivated: (name: string) => `Desactivado ${name}`,
      Copy: "Copiar",
      Delete: "Eliminar",
      Retry: "Reintentar",
      Using: "Usando",
      Greeting: "¿En qué puedo ayudarle hoy? 🪄",
      Revert: "Revertir",
      DefaultTopic: "Nueva conversación",
      KnowledgeBase: "Base de Conocimiento",
      QuickStart: "Inicio rápido",
      YouCanSeeInMore: "Puede ver estas funciones en el menú 'Más' en la esquina superior izquierda del cuadro de entrada.",
      Upload: "Subir",
      UploadDesc: "Realice preguntas y respuestas de imágenes/documentos basadas en modelos de texto largo y modelos multimodales.",
      RolePlayDesc: "Habilite el juego de roles o las figuras animadas de grandes modelos. Puede personalizar la interacción de grandes modelos mediante palabras de sugerencia, bases de conocimiento preestablecidas, figuras Live2D o incluso scripts.",
      NewRole: "Nuevo rol",
      PluginDesc: "Habilite plugins para permitir que grandes modelos invocan funciones externas, como consultas web, generación de imágenes, etc.",
      EnablePlugin: "Habilite plugins",
      NewPlugin: "Nuevo plugin personalizado",
      KBDesc: "Inyecte sus documentos en la base de conocimiento para permitir que el gran modelo responda a sus preguntas con mayor precisión. Puede elegir usar una base de conocimiento tradicional, una base de conocimiento vectorial o una base de conocimiento gráfico.",
      KBDetail: "Detalle",
      SeeKB: "Ver bases de conocimiento",
      MakeTopicPrompt: `Resumir y volver directamente al breve tema de este diálogo. El tema debe controlarse dentro de diez palabras, con un carácter inicial de emoji. No explique, no puntuación, no palabras de tono, no texto superfluo, no engrosamiento. Si no hay tema, regrese directamente. "💬 Charla"`
    }
  },

  DevPage: {
    RolePlay: "Juego de Roles",
    Live2D: "Humano Digital",
    Script: "Guion",
    Alter: "Modificar",
    RoleName: "Nombre de Rol: ",
    Prompt: "Sugerencia: ",
    InitDialog: "Diálogo Inicial: ",
    User: "Usuario",
    System: "Sistema",
    Append: "Agregar",
    AutoGen: "Generar Automáticamente",
    Clear: "Limpiar",
    ActivateTool: "Activar Habilidad: ",
    WebSearch: "Búsqueda en Internet",
    ImageGen: "Generación de Imágenes",
    Scripting: "Ejecución de Guiones",
    Upload: "Subir",
    Save: "Guardar",
    Export: "Exportar",
    ChangeModel: "Cambiar Modelo",
    Send: "Enviar",
    Greeting: "¿En qué puedo ayudarle hoy? 🪄",
    Expand: "Expandir",
    Collapse: "Colapsar",
    Stop: "Detener",
    ReverseRolePrompt: "Tú eres Chung, un entusiasta de la tecnología que recientemente ha estado desarrollando una aplicación de asistente inteligente. Hoy, justo has vuelto a tu dormitorio después de clase y has empezado a depurar tu aplicación. Ahora estás hablando con el asistente inteligente que has desarrollado.",
    AssistantSays: "El chatbot dijo: ",
    SystemSays: "Lo siguiente es un mensaje de aviso del sistema: ",
    UploadFile: "Subir archivo: ",
    Delete: "Eliminar",
    DefaultPrompt: `- el personaje -
$N ^ 2 $CHAT, un asistente inteligente creado por el equipo de $N ^ 2 $CHAT, basado en un gran modelo en español.
- objetivo -
1. responder a las preguntas de los usuarios y proporcionar información útil a los usuarios
- restricciones -
1. garantizar la precisión y puntualidad de la información proporcionada y prohibir la fabricación de información falsa
2. de acuerdo con la profundidad de la comprensión del usuario de un campo determinado, elija la redacción correspondiente para asegurarse de que la respuesta no sea demasiado profunda ni demasiado simple para el usuario.
3. satisfacer las necesidades de los usuarios en la medida de lo posible, proporcionar la información más detallada posible en las respuestas y guiar a los usuarios a hacer más preguntas
4. mantenga la cortesía y evite el uso de un lenguaje insultante o ofensivo
    
- cadena de pensamiento -
1. leer la entrada del usuario
2. analizar la entrada del usuario y comprender lo que el usuario necesita que hagas por él
3. pensar en los pasos para satisfacer las necesidades de los usuarios debe ser un paso refinado
4. siga los pasos para generar gradualmente las respuestas
  `,
    More: "Más",
    SingleInteraction: "Interacción única",
    SingleInteractionExplain: "El gran modelo responde directamente a esta ronda de entrada, ignorando los mensajes históricos"
  },

  KnowledgeBase: {
    New: "Nuevo",
    WhatsThis: "¿Qué es esto?",
    Explaination: `Los grandes modelos de lenguaje están limitados por la actualidad y la exhaustividad de sus datos de entrenamiento, lo que puede dar lugar a respuestas inexactas o no actualizadas a preguntas específicas. Esta situación puede mejorarse añadiendo documentos personalizados a una base de conocimientos y permitiendo que el gran modelo de lenguaje recupere información de la base de conocimientos cuando conteste preguntas.

Para crear una nueva base de conocimientos, puede hacer clic en el botón "Nuevo" en la esquina inferior derecha y seleccionar el tipo de base de conocimientos que quiere crear. Las bases de conocimientos tradicionales extraen palabras clave de documentos y llevan a cabo emparejamientos de palabras clave durante la recuperación. Las bases de conocimientos vectoriales asignan textos a información direccional en espacios de alta dimensionalidad (es decir, vectores), y llevan a cabo emparejamientos comparando los ángulos entre vectores. Las bases de conocimientos gráficos extraen entidades y relaciones entre entidades de textos fuente, conectándolos en una red, y recuperan información recorriendo los nodos que rodean el objetivo de búsqueda.

Verá las bases de conocimientos que ya ha creado en la interfaz. En la interfaz de "Modificar", puede añadir nuevos documentos o navegar por los documentos que ya se han añadido.`,
    ISee: "Entiendo",
    KeywordKB: "Base de Conocimientos Tradicional",
    VectorKB: "Base de Conocimientos Vectorial",
    GraphKB: "Base de Conocimientos Gráfico",
    NewKB: (type) => `Nueva ${type}`,
    Name: "Nombre",
    Cancel: "Cancelar",
    Confirm: "Confirmar",
    SubTitle: (type, count) => `${type}, ${count} Documento${count != 1 ? 's' : ''}`,
    Edit: "Editar",
    Delete: "Eliminar",
    EditKB: (name) => `Editar Base de Conocimientos ${name}`,
    AddDoc: "Añadir Documento(s)",
    Done: "Terminado",
    DeleteKB: "Eliminar Base de Conocimientos",
    ConfirmDeleteKB: (name) => `¿Está seguro de querer eliminar la base de conocimientos ${name}?`,
    KBNameNotEmpty: "El nombre de la base de conocimientos no puede estar vacío",
    KBAlreadyExists: "La base de conocimientos ya existe",
    SuccessfullyCreatedKB: (type, name) => `Creada satisfactoriamente ${type} ${name}`,
    SuccessfullyAddDocument: "Documento añadido satisfactoriamente",
    SuccessfullyDeletedDocument: (name) => `Documento ${name} eliminado satisfactoriamente`,
  },

  /** LEGACY */

  WIP: "En construcción...",
  Error: {
    Unauthorized:
      "Acceso no autorizado, por favor ingrese el código de acceso en la [página](/#/auth) de configuración.",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} mensajes`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} mensajes con ChatGPT`,
    Actions: {
      ChatList: "Ir a la lista de chats",
      CompressedHistory: "Historial de memoria comprimido",
      Export: "Exportar todos los mensajes como Markdown",
      Copy: "Copiar",
      Stop: "Detener",
      Retry: "Reintentar",
      Delete: "Delete",
    },
    Rename: "Renombrar chat",
    Typing: "Escribiendo...",
    Input: (submitKey: string) => {
      var inputHints = `Escribe algo y presiona ${submitKey} para enviar`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", presiona Shift + Enter para nueva línea";
      }
      return inputHints;
    },
    Send: "Enviar",
    Config: {
      Reset: "Reset to Default",
      SaveAs: "Save as Mask",
    },
  },
  Export: {
    Title: "Todos los mensajes",
    Copy: "Copiar todo",
    Download: "Descargar",
    MessageFromYou: "Mensaje de ti",
    MessageFromChatGPT: "Mensaje de ChatGPT",
  },
  Memory: {
    Title: "Historial de memoria",
    EmptyContent: "Aún no hay nada.",
    Copy: "Copiar todo",
    Send: "Send Memory",
    Reset: "Reset Session",
    ResetConfirm:
      "Resetting will clear the current conversation history and historical memory. Are you sure you want to reset?",
  },
  Home: {
    NewChat: "Nuevo chat",
    DeleteChat: "¿Confirmar eliminación de la conversación seleccionada?",
    DeleteToast: "Chat Deleted",
    Revert: "Revert",
  },
  Settings: {
    Title: "Configuración",
    SubTitle: "Todas las configuraciones",

    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "Todos los idiomas",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Tamaño de fuente",
      SubTitle: "Ajustar el tamaño de fuente del contenido del chat",
    },
    InjectSystemPrompts: {
      Title: "Inyectar Prompts del Sistema",
      SubTitle:
        "Agregar forzosamente un prompt de sistema simulado de ChatGPT al comienzo de la lista de mensajes en cada solicitud",
    },
    Update: {
      Version: (x: string) => `Versión: ${x}`,
      IsLatest: "Última versión",
      CheckUpdate: "Buscar actualizaciones",
      IsChecking: "Buscando actualizaciones...",
      FoundUpdate: (x: string) => `Se encontró una nueva versión: ${x}`,
      GoToUpdate: "Actualizar",
    },
    SendKey: "Tecla de envío",
    Theme: "Tema",
    TightBorder: "Borde ajustado",
    SendPreviewBubble: {
      Title: "Enviar burbuja de vista previa",
      SubTitle: "Preview markdown in bubble",
    },
    Mask: {
      Splash: {
        Title: "Mask Splash Screen",
        SubTitle: "Show a mask splash screen before starting new chat",
      },
    },
    Prompt: {
      Disable: {
        Title: "Desactivar autocompletado",
        SubTitle: "Escribe / para activar el autocompletado",
      },
      List: "Lista de autocompletado",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} incorporado, ${custom} definido por el usuario`,
      Edit: "Editar",
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
      Title: "Cantidad de mensajes adjuntos",
      SubTitle: "Número de mensajes enviados adjuntos por solicitud",
    },
    CompressThreshold: {
      Title: "Umbral de compresión de historial",
      SubTitle:
        "Se comprimirán los mensajes si la longitud de los mensajes no comprimidos supera el valor",
    },

    Usage: {
      Title: "Saldo de la cuenta",
      SubTitle(used: any, total: any) {
        return `Usado $${used}, subscription $${total}`;
      },
      IsChecking: "Comprobando...",
      Check: "Comprobar de nuevo",
      NoAccess: "Introduzca la clave API para comprobar el saldo",
    },

    Model: "Modelo",
    Temperature: {
      Title: "Temperatura",
      SubTitle: "Un valor mayor genera una salida más aleatoria",
    },
    MaxTokens: {
      Title: "Máximo de tokens",
      SubTitle: "Longitud máxima de tokens de entrada y tokens generados",
    },
    PresencePenalty: {
      Title: "Penalización de presencia",
      SubTitle:
        "Un valor mayor aumenta la probabilidad de hablar sobre nuevos temas",
    },
    FrequencyPenalty: {
      Title: "Penalización de frecuencia",
      SubTitle:
        "Un valor mayor que disminuye la probabilidad de repetir la misma línea",
    },
  },
  Store: {
    DefaultTopic: "Nueva conversación",
    BotHello: "¡Hola! ¿Cómo puedo ayudarte hoy?",
    Error: "Algo salió mal, por favor intenta nuevamente más tarde.",
    Prompt: {
      History: (content: string) =>
        "Este es un resumen del historial del chat entre la IA y el usuario como recapitulación: " +
        content,
      Topic:
        "Por favor, genera un título de cuatro a cinco palabras que resuma nuestra conversación sin ningún inicio, puntuación, comillas, puntos, símbolos o texto adicional. Elimina las comillas que lo envuelven.",
      Summarize:
        "Resuma nuestra discusión brevemente en 200 caracteres o menos para usarlo como un recordatorio para futuros contextos.",
    },
  },
  Copy: {
    Success: "Copiado al portapapeles",
    Failed:
      "La copia falló, por favor concede permiso para acceder al portapapeles",
  },
  Context: {
    Toast: (x: any) => `With ${x} contextual prompts`,
    Edit: "Contextual and Memory Prompts",
    Add: "Add One",
  },
  Plugin: {
    Name: "Plugin",
  },
  FineTuned: {
    Sysmessage: "Eres un asistente que",
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
    },
  },
  NewChat: {
    Return: "Return",
    Skip: "Skip",
    Title: "Pick a Mask",
    SubTitle: "Chat with the Soul behind the Mask",
    More: "Find More",
    NotShow: "Not Show Again",
    ConfirmNoShow: "Confirm to disable？You can enable it in settings later.",
  },

  UI: {
    Confirm: "Confirm",
    Cancel: "Cancel",
    Close: "Close",
    Create: "Create",
    Edit: "Edit",
  },
  Exporter: {
    Model: "Modelo",
    Messages: "Mensajes",
    Topic: "Tema",
    Time: "Time",
  },
};

export default es;
