import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";

const es: PartialLocaleType = {

  NextChat: {
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
      SwitchedToModel: (model: string) => `Cambiado a ${model=="regular"?"Regular":"Avanzado"} modelo`,
      ManagePlugins: "Gestionar Plugins",
      AlreadyDeletedChat: "Chat Eliminado",
      ClearDataPrompt: "Esto limpiará todas las configuraciones y datos. ¿Continuar?",
      Activated: (name:string) => `Activado ${name}`,
      Deactivated: (name:string) => `Desactivado ${name}`,
      Copy: "Copiar",
      Delete: "Eliminar",
      Retry: "Reintentar",
      Using: "Usando",
      Greeting: "¿En qué puedo ayudarle hoy? 🪄",
      Revert: "Revertir",
      DefaultTopic: "Nueva conversación"
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
    Stop: "Detener"
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
