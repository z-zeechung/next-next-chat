import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";

const fr: PartialLocaleType = {

  NextChat: {
    SystemPrompt: ()=>`
      Vous êtes $N^2$CHAT, un assistant intelligent développé par l'équipe $N^2$CHAT.
      L'heure actuelle est : ${new Date().toDateString()}
      Pour intégrer du LaTeX en ligne, utilisez par exemple $x^2$
      Pour intégrer un bloc de LaTeX, utilisez par exemple $$e=mc^2$$
    `,
    SideBar: {
      ChatList: "Liste de Discussions",
      Manage: "Gérer",
      Exit: "Quitter",
      NewChat: "Nouveau Chat",
      CountOfChats: (count: number) => `${count} conversation${count > 1 ? 's' : ''}`,
      Select: "Sélectionner"
    },
    ChatArea: {
      More: "Plus",
      Return: "Retour",
      ChatOptions: "Options de Chat",
      Send: "Envoyer",
      SendPrompt: "Entrez pour envoyer, Shift + Entrez pour passer à la ligne suivante",
      RolePlay: "Jeu de Rôle",
      SwitchModel: "Changer de Modèle",
      WebSearch: "Recherche sur Internet",
      Scripting: "Script",
      GenImage: "Génération d'Image",
      UploadFile: "Uploader une Image / Document",
      ChatPlugins: "Plugins de Chat",
      IntelligentOffice: "Bureau Intelligent",
      WordDoc: "Document Word",
      PDFDoc: "Document PDF",
      Audio: "Audio",
      DeleteChat: "Supprimer le Chat",
      ClearData: "Effacer les Données",
      SelectRole: "Sélectionner un Rôle",
      SearchRole: "Rechercher un Rôle...",
      New: "Nouveau",
      Use: "Utiliser",
      StopUse: "Arrêter d'Utiliser",
      SwitchedToModel: (model: string) => `Passé à le modèle ${model == "regular" ? "régulier" : "avancé"}`,
      ManagePlugins: "Gérer les Plugins",
      AlreadyDeletedChat: "Chat Déjà Supprimé",
      ClearDataPrompt: "Cette action effacera toutes les configurations et données. Voulez-vous continuer ?",
      Activated: (name: string) => `Activé ${name}`,
      Deactivated: (name: string) => `Désactivé ${name}`,
      Copy: "Copier",
      Delete: "Supprimer",
      Retry: "Réessayer",
      Using: "Utilisation",
      Greeting: "Comment puis-je vous aider aujourd'hui 🪄",
      Revert: "Annuler",
      DefaultTopic: "Nouveau Conversation",
      KnowledgeBase: "Base de Connaissances",
      QuickStart: "Démarrage rapide",
      YouCanSeeInMore: "Vous pouvez voir ces fonctions dans le menu 'Plus' en haut à gauche de la zone de saisie.",
      Upload: "Télécharger",
      UploadDesc: "Effectuer un question-réponse sur image/document basé sur des modèles de long texte et multimodaux.",
      RolePlayDesc: "Activez le jeu de rôle ou les figures animées du grand modèle. Vous pouvez personnaliser l'interaction des grands modèles à travers mots de passe, bases de connaissances prédéfinies, figures Live2D ou même scripts.",
      NewRole: "Nouveau rôle",
      PluginDesc: "Activez les plugins pour permettre aux grands modèles d'invoquer des fonctions externes, telles que les recherches sur le web, la génération d'images, etc.",
      EnablePlugin: "Activer les plugins",
      NewPlugin: "Nouveau plugin personnalisé",
      KBDesc: "Injectez vos documents dans la base de connaissances pour permettre au grand modèle de répondre plus précisément à vos questions. Vous pouvez choisir d'utiliser une base de connaissances traditionnelle, une base de connaissances vectorielle ou une base de connaissances graphique.",
      KBDetail: "Détails",
      SeeKB: "Voir les bases de connaissances",
      MakeTopicPrompt: `Résumer et revenir directement au bref sujet de cette conversation. Le sujet doit être contrôlé à moins de dix mots avec un emoji au début. Ne pas expliquer, ne pas Ponctuation, pas de mots de ton, pas de texte superflu, pas d'épaississement. S'il n'y a pas de sujet, revenez directement à "💬 Bavardage".`
    }
  },

  DevPage: {
    RolePlay: "Jeu de Rôle",
    Live2D: "Personnage Numérique",
    Script: "Script",
    Alter: "Modifier",
    RoleName: "Nom du Rôle : ",
    Prompt: "Invite : ",
    InitDialog: "Dialogue Initial : ",
    User: "Utilisateur",
    System: "Système",
    Append: "Ajouter",
    AutoGen: "Génération Automatique",
    Clear: "Effacer",
    ActivateTool: "Activer la Capacité : ",
    WebSearch: "Recherche en Ligne",
    ImageGen: "Génération d'Image",
    Scripting: "Exécution de Script",
    Upload: "Télécharger",
    Save: "Enregistrer",
    Export: "Exporter",
    ChangeModel: "Changer de Modèle",
    Send: "Envoyer",
    Greeting: "Comment puis-je vous aider aujourd'hui 🪄",
    Expand: "Développer",
    Collapse: "Réduire",
    Stop: "Arrêter",
    ReverseRolePrompt: "Vous êtes Chung, un passionné de technologie qui a récemment développé une application d'assistant intelligent. Aujourd'hui, vous avez juste rentré dans votre dortoir après les cours et vous avez commencé à déboguer votre application. Maintenant, vous parlez à l'assistant intelligent que vous avez développé.",
    AssistantSays: "Le chatbot a dit : ",
    SystemSays: "Voici le message de prompt système : ",
    UploadFile: "Uploader un fichier",
    Delete: "Supprimer",
},

KnowledgeBase: {
  New: "Nouveau",
  WhatsThis: "Qu'est-ce que c'est ?",
  Explaination: `Les grands modèles de langage sont limités par l'actualité et l'exhaustivité de leurs données de formation, ce qui peut entraîner des réponses inexactes ou dépassées à certaines questions. Cette situation peut être améliorée en ajoutant des documents personnalisés à une base de connaissances et en permettant à le grand modèle de langage de récupérer des informations depuis la base de connaissances lors de la réponse à des questions.

Pour créer une nouvelle base de connaissances, vous pouvez cliquer sur le bouton "Nouveau" dans le coin inférieur droit et sélectionner le type de base de connaissances que vous souhaitez créer. Les bases de connaissances traditionnelles extraient des mots-clés depuis les documents et réalisent la correspondance de mots-clés durant la récupération. Les bases de connaissances vectorielles cartographient du texte à des informations directionnelles dans des espaces à haute dimension (c.-à-d., vecteurs), et réalisent la correspondance en comparant les angles entre vecteurs. Les bases de connaissances graphiques extraient des entités et des relations entre entités depuis le texte source, les reliant en un réseau, et récupèrent des informations par la traversée des nœuds autour de la cible de recherche.

Vous verrez les bases de connaissances que vous avez déjà créées sur l'interface. Dans l'interface "Modifier", vous pouvez ajouter de nouveaux documents ou parcourir les documents qui ont déjà été ajoutés.`,
  ISee: "Je vois",
  KeywordKB: "Base de connaissances traditionnelle",
  VectorKB: "Base de connaissances vectorielle",
  GraphKB: "Base de connaissances graphique",
  NewKB: (type) => `Nouveau ${type}`,
  Name: "Nom",
  Cancel: "Annuler",
  Confirm: "Confirmer",
  SubTitle: (type, count) => `${type}, ${count} Document${count != 1 ? 's' : ''}`,
  Edit: "Modifier",
  Delete: "Supprimer",
  EditKB: (name) => `Modifier la base de connaissances ${name}`,
  AddDoc: "Ajouter Document(s)",
  Done: "Terminé",
  DeleteKB: "Supprimer la base de connaissances",
  ConfirmDeleteKB: (name) => `Êtes-vous sûr de vouloir supprimer la base de connaissances ${name} ?`,
  KBNameNotEmpty: "Le nom de la base de connaissances ne peut être vide",
  KBAlreadyExists: "La base de connaissances existe déjà",
  SuccessfullyCreatedKB: (type, name) => `Base de connaissances ${type} ${name} créée avec succès`,
  SuccessfullyAddDocument: "Document ajouté avec succès",
  SuccessfullyDeletedDocument: (name) => `Document ${name} supprimé avec succès`,
},

  /** LEGACY */

  WIP: "Prochainement...",
  Error: {
    Unauthorized:
      "Accès non autorisé, veuillez saisir le code d'accès dans la [page](/#/auth) des paramètres.",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} messages en total`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} messages échangés avec ChatGPT`,
    Actions: {
      ChatList: "Aller à la liste de discussion",
      CompressedHistory: "Mémoire d'historique compressée Prompt",
      Export: "Exporter tous les messages en tant que Markdown",
      Copy: "Copier",
      Stop: "Arrêter",
      Retry: "Réessayer",
      Delete: "Supprimer",
      Pin: "Épingler",
      PinToastContent: "Épingler 2 messages à des messages contextuels",
      PinToastAction: "Voir",
      Edit: "Modifier",
    },
    Commands: {
      new: "Commencer une nouvelle conversation",
      newm: "Démarrer une nouvelle conversation avec un assistant",
      next: "Conversation suivante",
      prev: "Conversation précédente",
      clear: "Effacer le contexte",
      del: "Supprimer la Conversation",
    },
    InputActions: {
      Stop: "Stop",
      ToBottom: "Au dernier",
      Theme: {
        auto: "Auto",
        light: "Thème clair",
        dark: "Thème sombre",
      },
      Prompt: "Instructions",
      Masks: "Assistants",
      Clear: "Effacer le contexte",
      Settings: "Réglages",
    },
    Rename: "Renommer la conversation",
    Typing: "En train d'écrire…",
    Input: (submitKey: string) => {
      var inputHints = `Appuyez sur ${submitKey} pour envoyer`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter pour insérer un saut de ligne";
      }
      return inputHints + ", / pour rechercher des prompts";
    },
    Send: "Envoyer",
    Config: {
      Reset: "Restaurer les paramètres par défaut",
      SaveAs: "Enregistrer en tant que masque",
    },
  },
  Export: {
    Title: "Tous les messages",
    Copy: "Tout sélectionner",
    Download: "Télécharger",
    MessageFromYou: "Message de votre part",
    MessageFromChatGPT: "Message de ChatGPT",
  },
  Memory: {
    Title: "Prompt mémoire",
    EmptyContent: "Rien encore.",
    Send: "Envoyer la mémoire",
    Copy: "Copier la mémoire",
    Reset: "Réinitialiser la session",
    ResetConfirm:
      "La réinitialisation supprimera l'historique de la conversation actuelle ainsi que la mémoire de l'historique. Êtes-vous sûr de vouloir procéder à la réinitialisation?",
  },
  Home: {
    NewChat: "Nouvelle discussion",
    DeleteChat: "Confirmer la suppression de la conversation sélectionnée ?",
    DeleteToast: "Conversation supprimée",
    Revert: "Revenir en arrière",
  },
  Settings: {
    Title: "Paramètres",
    SubTitle: "Toutes les configurations",
    Danger: {
      Reset: {
        Title: "Restaurer les paramètres",
        SubTitle: "Restaurer les paramètres par défaut",
        Action: "Reinitialiser",
        Confirm: "Confirmer la réinitialisation des paramètres?",
      },
      Clear: {
        Title: "Supprimer toutes les données",
        SubTitle:
          "Effacer toutes les données, y compris les conversations et les paramètres",
        Action: "Supprimer",
        Confirm: "Confirmer la suppression de toutes les données?",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION : si vous souhaitez ajouter une nouvelle traduction, ne traduisez pas cette valeur, laissez-la sous forme de `Language`
      All: "Toutes les langues",
    },

    Avatar: "Avatar",
    FontSize: {
      Title: "Taille des polices",
      SubTitle: "Ajuste la taille de police du contenu de la conversation",
    },
    InjectSystemPrompts: {
      Title: "Injecter des invites système",
      SubTitle:
        "Ajoute de force une invite système simulée de ChatGPT au début de la liste des messages pour chaque demande",
    },
    InputTemplate: {
      Title: "Template",
      SubTitle: "Le message le plus récent sera ajouté à ce template.",
    },
    Update: {
      Version: (x: string) => `Version : ${x}`,
      IsLatest: "Dernière version",
      CheckUpdate: "Vérifier la mise à jour",
      IsChecking: "Vérification de la mise à jour...",
      FoundUpdate: (x: string) => `Nouvelle version disponible : ${x}`,
      GoToUpdate: "Mise à jour",
    },
    SendKey: "Clé d'envoi",
    Theme: "Thème",
    TightBorder: "Bordure serrée",
    SendPreviewBubble: {
      Title: "Aperçu de l'envoi dans une bulle",
      SubTitle: "Aperçu du Markdown dans une bulle",
    },
    Mask: {
      Splash: {
        Title: "Écran de masque",
        SubTitle:
          "Afficher un écran de masque avant de démarrer une nouvelle discussion",
      },
      Builtin: {
        Title: "Masquer Les Assistants Intégrés",
        SubTitle: "Masquer les assistants intégrés par défaut",
      },
    },
    Prompt: {
      Disable: {
        Title: "Désactiver la saisie semi-automatique",
        SubTitle: "Appuyez sur / pour activer la saisie semi-automatique",
      },
      List: "Liste de prompts",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} intégré, ${custom} personnalisé`,
      Edit: "Modifier",
      Modal: {
        Title: "Liste de prompts",
        Add: "Ajouter un élément",
        Search: "Rechercher des prompts",
      },
      EditModal: {
        Title: "Modifier le prompt",
      },
    },
    HistoryCount: {
      Title: "Nombre de messages joints",
      SubTitle: "Nombre de messages envoyés attachés par demande",
    },
    CompressThreshold: {
      Title: "Seuil de compression de l'historique",
      SubTitle:
        "Comprimera si la longueur des messages non compressés dépasse cette valeur",
    },

    Usage: {
      Title: "Solde du compte",
      SubTitle(used: any, total: any) {
        return `Épuisé ce mois-ci $${used}, abonnement $${total}`;
      },
      IsChecking: "Vérification...",
      Check: "Vérifier",
      NoAccess: "Entrez la clé API pour vérifier le solde",
    },

    Model: "Modèle",
    Temperature: {
      Title: "Température",
      SubTitle: "Une valeur plus élevée rendra les réponses plus aléatoires",
    },
    TopP: {
      Title: "Top P",
      SubTitle:
        "Ne modifiez pas à moins que vous ne sachiez ce que vous faites",
    },
    MaxTokens: {
      Title: "Limite de Tokens",
      SubTitle: "Longueur maximale des tokens d'entrée et des tokens générés",
    },
    PresencePenalty: {
      Title: "Pénalité de présence",
      SubTitle:
        "Une valeur plus élevée augmentera la probabilité d'introduire de nouveaux sujets",
    },
    FrequencyPenalty: {
      Title: "Pénalité de fréquence",
      SubTitle:
        "Une valeur plus élevée diminuant la probabilité de répéter la même ligne",
    },
  },
  Store: {
    DefaultTopic: "Nouvelle conversation",
    BotHello: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    Error: "Quelque chose s'est mal passé, veuillez réessayer plus tard.",
    Prompt: {
      History: (content: string) =>
        "Ceci est un résumé de l'historique des discussions entre l'IA et l'utilisateur : " +
        content,
      Topic:
        "Veuillez générer un titre de quatre à cinq mots résumant notre conversation sans introduction, ponctuation, guillemets, points, symboles ou texte supplémentaire. Supprimez les guillemets inclus.",
      Summarize:
        "Résumez brièvement nos discussions en 200 mots ou moins pour les utiliser comme prompt de contexte futur.",
    },
  },
  Copy: {
    Success: "Copié dans le presse-papiers",
    Failed:
      "La copie a échoué, veuillez accorder l'autorisation d'accès au presse-papiers",
  },
  Context: {
    Toast: (x: any) => `Avec ${x} contextes de prompts`,
    Edit: "Contextes et mémoires de prompts",
    Add: "Ajouter un prompt",
  },
  Plugin: {
    Name: "Extension",
  },
  FineTuned: {
    Sysmessage: "Eres un asistente que",
  },
  Mask: {
    Name: "Masque",
    Page: {
      Title: "Modèle de prompt",
      SubTitle: (count: number) => `${count} modèles de prompts`,
      Search: "Rechercher des modèles",
      Create: "Créer",
    },
    Item: {
      Info: (count: number) => `${count} prompts`,
      Chat: "Discussion",
      View: "Vue",
      Edit: "Modifier",
      Delete: "Supprimer",
      DeleteConfirm: "Confirmer la suppression?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Modifier le modèle de prompt ${readonly ? "(en lecture seule)" : ""}`,
      Download: "Télécharger",
      Clone: "Dupliquer",
    },
    Config: {
      Avatar: "Avatar de lassistant",
      Name: "Nom de lassistant",
      Sync: {
        Title: "Utiliser la configuration globale",
        SubTitle: "Utiliser la configuration globale dans cette conversation",
        Confirm: "Voulez-vous definir votre configuration personnalisée ?",
      },
      HideContext: {
        Title: "Masquer les invites contextuelles",
        SubTitle: "Ne pas afficher les instructions contextuelles dans le chat",
      },
      Share: {
        Title: "Partager ce masque",
        SubTitle: "Générer un lien vers ce masque",
        Action: "Copier le lien",
      },
    },
  },
  NewChat: {
    Return: "Retour",
    Skip: "Passer",
    Title: "Choisir un assitant",
    SubTitle: "Discutez avec l'âme derrière le masque",
    More: "En savoir plus",
    NotShow: "Ne pas afficher à nouveau",
    ConfirmNoShow:
      "Confirmez-vous vouloir désactiver cela? Vous pouvez le réactiver plus tard dans les paramètres.",
  },

  UI: {
    Confirm: "Confirmer",
    Cancel: "Annuler",
    Close: "Fermer",
    Create: "Créer",
    Edit: "Éditer",
  },
  Exporter: {
    Model: "Modèle",
    Messages: "Messages",
    Topic: "Sujet",
    Time: "Temps",
  },
};

export default fr;
