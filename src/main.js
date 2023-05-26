import { createApp } from "vue";
import App from "./App.vue";
import NewsGearsWebPlugin from "@/newsgears-web/newsgears-web-plugin";
import router from "./router";
import VuePlyr from "vue-plyr";
import VueAnnouncer from "@vue-a11y/announcer";
import { createI18n } from "vue-i18n";
import Vue3NativeNotification from "vue3-native-notification";

import "@vue-a11y/announcer/dist/style.css";
import "vue-plyr/dist/vue-plyr.css";
import "font-awesome/scss/font-awesome.scss";
import "flag-icons/css/flag-icons.min.css";
import "./registerServiceWorker";

let lang = window.navigator.languages ? window.navigator.languages[0] : null;
lang =
  lang ||
  window.navigator.language ||
  window.navigator.browserLanguage ||
  window.navigator.userLanguage;

let shortLang = lang;
if (shortLang.indexOf("-") !== -1) shortLang = shortLang.split("-")[0];

if (shortLang.indexOf("_") !== -1) shortLang = shortLang.split("_")[0];

const i18n = createI18n({
  locale: shortLang,
  fallbackLocale: "en",
  allowComposition: true,
  messages: {
    es: {
      // generic 
      true: "verdadero",
      false: "falso",
      somethingHorribleHappened:
        "¡Algo horrible ocurrió y no estamos seguros de qué! Por favor, inténtalo de nuevo en unos momentos.",
      requestTimedOut:
        "Tiempo de espera de la solicitud agotado. Por favor, inténtalo de nuevo en unos momentos.",
      privacyPolicy: "Política de privacidad",
      cancel: "Cancelar",
      filter: "Filtrar",
      first: "Primero",
      previous: "Anterior",
      next: "Siguiente",
      last: "Último",
      username: "Nombre de usuario",
      password: "Contraseña",
      submit: "Enviar",
      subscribe: "Suscribirse",
      subscribed: "¡Suscrito!",
      inDevelopment:
        "Lo sentimos, esta sección de FeedGears aún no está lista. ¡Vuelve en unos días!",
      // auth
      loginToFeedGears: "Iniciar sesión en FeedGears",
      accountRecovery: "Recuperación de cuenta",
      passwordReset: "Restablecimiento de contraseña",
      accountRegistration: "Registro de cuenta",
      alreadyHaveAnAccount: "¿Ya tienes una cuenta? Inicia sesión aquí.",
      accountRecoveryHere: "¿Necesitas ayuda para iniciar sesión?",
      registerHere: "FeedGears es gratis. Crea una cuenta aquí.",
      unableToCompleteYourRequest:
        "No pudimos completar tu solicitud. Por favor, intenta iniciar sesión usando otro método.",
      usernameAndPasswordAreRequired:
        "Se requieren nombre de usuario y contraseña.",
      passwordIsRequired: "Se requiere contraseña.",
      usernameIsRequired: "Se requiere nombre de usuario.",
      signinWithGoogle: "Iniciar sesión con Google",
      pwResetRequestMessage:
        "Ingresa tu nombre de usuario y dirección de correo electrónico. Enviaremos un enlace para restablecer tu contraseña a tu dirección de correo electrónico verificada.",
      checkEmailForFurther:
        "Revisa tu correo electrónico para ver instrucciones adicionales.",
      newPassword: "Nueva contraseña",
      confirmNewPassword: "Confirmar nueva contraseña",
      enterAndConfirmNewPw: "Ingresa y confirma tu nueva contraseña.",
      pwUpdated: "Contraseña actualizada.",
      registrationRequirements:
        "Se requieren nombre de usuario, dirección de correo electrónico y contraseña para registrarse.",
      // landing
      createAnAccount: "Crear una cuenta",
      whatIsFeedGears: "Un lector de feeds seguro, privado y accesible.",
      whyIsFeedGearsFree: "Gratis para siempre porque amamos RSS.",
      devBlog: "Blog de desarrollo",
      docs: "Documentación",
      api: "API",
      email: "Correo electrónico",
      twitter: "Twitter",
      github: "Github",
      twitch: "Twitch",
      discord: "Discord",
      copyright: "DERECHOS DE AUTOR",
      contactUsWithQuestionsViaEmail:
        "Contacta a Lost Sidewalk Software con preguntas por correo electrónico.",
      // faq
      whatIsRSS: "¿Qué es RSS/ATOM?",
      rssIs:
        "RSS (Really Simple Syndication) es un formato de fuente web que se utiliza para publicar contenido actualizado con frecuencia, como entradas de blog, titulares de noticias, audio y video. Netscape lo introdujo por primera vez en 1999 como un formato basado en XML para distribuir contenido de sitios de noticias y blogs.",
      rssAllows:
        "RSS permite a los usuarios suscribirse a fuentes de contenido utilizando un lector o agregador de fuentes web, que puede recuperar y mostrar automáticamente contenido nuevo de múltiples fuentes en una sola ubicación. Esto hace que sea más fácil para los usuarios mantenerse actualizados sobre sus sitios web y creadores de contenido favoritos sin tener que verificar manualmente cada sitio en busca de actualizaciones.",
      feedGearsIs:
        "FeedGears es tanto un agregador de RSS como un lector de RSS.",
      overTheYears:
        "A lo largo de los años, RSS ha evolucionado y se han lanzado varias versiones del protocolo, que incluyen:",
      eachVersionAdded:
        "Cada versión agregó nuevas características y funcionalidades, como soporte para contenido multimedia y gabinetes.",
      atomOTOH:
        "Atom, por otro lado, es un formato de fuente web similar que se introdujo en 2003 como una alternativa a RSS. Al igual que RSS, Atom es un formato basado en XML que permite a los editores sindicar contenido como publicaciones de blogs, artículos de noticias y podcasts.",
      keyDifferences:
        "Una de las diferencias clave entre RSS y Atom es que Atom es un formato estandarizado, mientras que RSS tiene múltiples versiones y variaciones. Además, Atom está diseñado para ser más extensible y flexible que RSS, lo que permite una personalización más sencilla y soporte para metadatos adicionales.",
      overallRoles:
        "En general, RSS y Atom han jugado un papel importante en la evolución de la sindicación de contenido web y han ayudado a que sea más fácil para los usuarios acceder y consumir el contenido que les interesa.",
      // video panel
      rssMadeEasy: "RSS Hecho Fácil",
      // confirmation dialog
      pleaseConfirm: 'Por favor confirmar',
      confirm: "Confirmar",
      // go back
      goBack: "Regresa",
      // control panel 
      login: "Acceso",
      logout: "Cerrar sesión",
      settings: "Ajustes",
      help: "Ayuda",
      switchMode: "Cambiar el modo de visualización",
      createNewQueue: "Crear cola",
      uploadOPML: "Subir OPML",
      pleaseEnableNotifications: "Habilite las notificaciones para recibir mensajes de FeedGears.",
      // queue select button
      showMoreInfo: "Mostrar suscripciones",
      hideMoreInfo: "Ocultar suscripciones",
      addSubscriptions: "Agregar suscripciones",
      manageSubscriptions: "Administrar suscripciones",
      subscriptions: "SUSCRIPCIONES",
      publications: "PUBLICACIONES",
      zeroSubscriptions: "0 suscripciones",
      importerRanAt: "Importadora corrió a las {importTimestamp}",
      nNewArticlesSaved: "{n} nuevos artículos guardados",
      nArticlesArchived: "{n} artículos archivados",
      httpStatus: "HTTP {httpStatusCode} ({httpStatusMessage})",
      redirectedTo:
        "REDIRIGIDO A {redirectFeedUrl} HTTP {redirectHttpStatusCode} ({redirectHttpStatusMessage})",
      metricsNotYetAvailable:
        "Las métricas aún no están disponibles para esta fuente RSS.",
      // buttons
      update: "Actualizar",
      save: "Guardar",
      // queue config panel
      queueProperties: "Propiedades de la cola",
      rssFeedDiscovery: "Descubrimiento de fuentes RSS",
      // queue properties
      createANewQueue: "Crear una nueva cola",
      updateQueueSettings: "Actualizar la configuración de la cola",
      queueIdentifier: "Identificador de cola",
      queueIdentifierHint: "Un nombre corto y único para esta cola. Este valor se generará si no se proporciona. Este valor aparecerá en mensajes de registro y en otros lugares para referirse a esta cola.",
      queueTitle: "Título de la cola",
      queueTitleHint: "Un nombre descriptivo opcional para esta cola. Este valor se muestra en la interfaz de usuario de FeedGears para referirse a esta cola.",
      queueDescription: "Descripción de la cola",
      queueDescriptionHint: "Una descripción detallada opcional para esta cola, mostrada en el panel de control de la cola.",
      queueFeedGenerator: "Generador del feed",
      queueFeedGeneratorHint: "En los artefactos publicados de esta cola, este valor aparece como el valor 'generador de feed'.",
      queueFeedCopyright: "Derechos de autor",
      queueFeedCopyrightHint: "En los artefactos publicados de esta cola, este valor aparece como el valor 'derechos de autor del feed'.",
      queueFeedLanguage: "Idioma",
      queueFeedLanguageHint: "En los artefactos publicados de esta cola, este valor aparece como el valor 'idioma del feed'.",
      // subscription config
      yourSubscriptions: "SUS SUSCRIPCIONES",
      addANewSubscription: "AGREGAR UNA NEUVA SUSCRIPCIÓN",
      feedUrl: "URL de fuente RSS",
      credentialsUseMessage:
        "* Se proporcionarán las siguientes credenciales si esta fuente RSS solicita autenticación.",
      discovery: "Descubrimiento",
      auth: "Autorización",
      unsubscribe: "Darse de baja",
      subscriptionAdded: "Suscripción añadida",
      subscriptionUpdated: "Suscripción actualizada",
      subscriptionDeleted: "Suscripción eliminada",
      queryMetrics: "Métricas de fuentes RSS",
      importedNArticlesAt: "{n} artículos importados a las {at}.",
      importedNArticles: "{n} artículos importados.",
      timestamp: "Marca de tiempo",
      message: "Mensaje",
      httpStatusLabel: "Estado HTTP",
      httpRedirect: "Estado de redirección HTTP",
      error: "Error",
      updateAuth: "Actualizar credenciales",
      // rss feed info
      authorColon: "Autor:",
      lastPublishedColon: "Última publicación:",
      managingEditorColon: "Editor gerente:",
      webmasterColon: "Administrador de página web:",
      httpStatusCode: "Código de estado HTTP",
      redirectHttpStatusCode: "Redirigir el código de estado HTTP",
      feedAlsoAvailableInHttps: "Este feed también está disponible en HTTPS.",
      recommendedFeeds: "Fuentes RSS similares",
      refreshThisFeed: "Actualizar este feed",
      // feed filter
      refreshQueues: "Actualizar colas",
      markQueueAsRead: "Marcar esta cola como leída",
      toggleSortOrder: "Alternar dirección de clasificación",
      toggleFeedFilterPills: "Alternar píldoras de filtro",
      // feed filter pills
      allSubscriptions: "todas las suscripciones",
      all: "todos",
      unread: "NO LEÍDO",
      readLater: "LEER MÁS TARDE",
      read: "LEÍDO",
      starred: "FAVORITA",
      clear: "CLARA",
      // filter help
      filtering: "Filtración",
      filteringProvides:
        "El filtrado proporciona una forma poderosa de encontrar artículos específicos basados ​​en varios campos, como fuente, categorías, descripción, título, autor, fecha de publicación, fecha de actualización, contenido y URL.",
      syntax: "Sintaxis",
      feedGearsFilterSupports:
        "La función de filtro de FeedGears admite una sintaxis que permite a los usuarios crear consultas de búsqueda complejas. La sintaxis básica es la siguiente:",
      fieldColonValue: "campo:valor",
      syntaxAllows:
        "Esta sintaxis le permite especificar un nombre de campo seguido de dos puntos y el valor correspondiente que desea buscar. Puede utilizar varios pares de campo:valor para crear consultas de búsqueda más específicas.",
      supportedFields: "Campos admitidos",
      feedFieldDesc: "El nombre o identificador del feed.",
      categoryFieldDesc:
        "Las categorías o etiquetas asociadas al artículo.",
      descriptionFieldDesc:
        "Un resumen o descripción del artículo.",
      titleFieldDesc: "El título del artículo.",
      authorFieldDesc: "El autor principal del artículo.",
      authorsFieldDesc:
        "Una lista de autores asociados con el artículo.",
      contributorsFieldDesc:
        "Una lista de colaboradores del artículo.",
      publishedFieldDesc: "La fecha de publicación del artículo.",
      updatedFieldDesc: "La fecha actualizada del artículo.",
      contentsFieldDesc: "El contenido principal del artículo.",
      urlFieldDesc: "La URL del artículo.",
      statusFieldDesc: "El estado de lectura del artículo (leído, no leído, leído más tarde).", 
      starredFieldDesc: "El estado destacado del artículo (verdadero, falso).",
      exampleQueries: "Consultas de ejemplo",
      hereAreSomeExamples:
        "Estos son algunos ejemplos de consultas de búsqueda que puede realizar con la función de filtro de FeedGears:",
      explanation: "Explicación",
      searchForArticlesWithWord:
        'Busque artículos con la palabra "technology" en el título.',
      searchForArticlesPublishedBy:
        "Busque artículos publicados por un autor específico.",
      searchForArticlesPublishedBetween:
        "Busque artículos publicados entre dos fechas específicas.",
      searchForArticlesWithWords:
        'Busque artículos con la palabra "JavaScript" en el contenido y "tutorial" en el título.',
      searchForArticlesInASpecificFeedAndCategory:
        "Busque artículos en un feed y una categoría específicos.",
      advancedQueries: "Consultas avanzadas",
      inAdditionTo:
        "Además de las consultas básicas de campo:valor, FeedGears admite opciones de búsqueda más avanzadas, como búsquedas con comodines, búsquedas aproximadas y búsquedas de rango. Puede consultar la documentación de FeedGears para obtener más detalles sobre estas opciones de búsqueda avanzada.",
      // help panel
      dismiss: "Despedir",
      globalShortcutKeys: "TECLAS DE ACCESO DIRECTO GLOBALES",
      key: "Tecla",
      action: "Acción",
      configureSelectedQueue:
        "Administrar suscripciones en la cola seleccionada",
      markSelectedQueueAsRead: "Marcar la cola seleccionada como leída",
      deleteSelectedQueue: "Eliminar la cola seleccionada",
      addSubscriptionToSelectedQueue:
        "Agregar una suscripción a la cola seleccionada",
      showUnread: "Mostrar no leídos",
      showStarred: "Mostrar destacado",
      showReadLater: "Mostrar leer más tarde",
      showRead: "Mostrar leído",
      search: "Buscar",
      // layout
      cardLayout: "Cambiar a diseño de tarjeta",
      listLayout: "Cambiar a diseño de lista",
      // iTunes
      explicit: "EXPLÍCITO",
      closedCaptioned: "Subtitulado",
      episode: "Episodio {episode}",
      episodeType: "Episodio {episodeType}",
      // post media
      media: "MEDIOS DE COMUNICACIÓN",
      // community
      nViews: "PUNTOS DE VISTA",
      tags: "ETIQUETAS",
      // post media content
      audioChannelsColon: "CANALES DE AUDIO:",
      bitRateColon: "TASA DE BITS:",
      durationColon: "DURACIÓN:",
      expressionColon: "EXPRESIÓN:",
      fileSizeColon: "TAMAÑO DEL ARCHIVO:",
      frameRateColon: "CUADROS POR SEGUNDO:",
      heightColon: "ALTURA:",
      widthColon: "ANCHO:",
      languageColon: "IDIOMA:",
      samplingRateColon: "TASA DE MUESTREO:",
      // opml
      selectAnOpmlFile: "Seleccione un archivo OPML",
      addAnOpmlFile: "Agregar un archivo OPML",
      addOneOrMoreFilesToUplod: "Agregue uno o más archivos para cargar",
      finalizeUpload: "Finalizar carga",
      continueToStep2: "Continúe con el paso 2",
      clickHereWHenYourFilesAreStaged:
        "Haga clic aquí cuando sus archivos estén preparados",
      opmlFiles: "Archivos OPML",
      previewThisFile:
        "Obtenga una vista previa de este archivo en una nueva ventana.",
      delete: "Borrar",
      selectAtLeastOneFile: "Seleccione al menos un archivo para continuar.",
      opmlFilesContainErrors:
        "Sus archivos contienen los siguientes problemas. Resuelva estos problemas y vuelva a intentar la carga.",
      weWillCreateTheFollowingSubscriptions:
        "Crearemos las siguientes colas a partir de su(s) archivo(s) OPML:",
      // post feed
      confirmDeleteQueue:
        "Confirme que desea eliminar esta cola. Esta acción es irreversible.",
      confirmMarkQueueAsRead:
        "Confirme que desea marcar todos los elementos de esta cola como leídos.",
      queueDashboard: "PANEL DE RSS",
      queueSettings: "AJUSTES DE COLA",
      opmlUpload: "CARGA OPML",
      refreshFailedDueToColon: "Actualizar falló debido a:",
      noMessage: "sin mensaje",
      queueUpdated: "Cola actualizada",
      queueCreated: "Cola creada",
      nQueuesCreated: " colas creadas",
      clickToLoadMore: "Haga clic aquí para cargar más",
      // post item
      showPostDetails: "Mostrar detalles de la publicación",
      showPostCategories: "Mostrar categorías de publicaciones",
      addCategoryToFilter: "Añadir esta categoría ({postCategory}) al filtro",
      showPostSharing: "Mostrar publicación compartida",
      shareWith_twitter: "Compartir con Twitter",
      shareWith_facebook: "Compartir con Facebook",
      shareWith_telegram: "Compartir con Telegram",
      shareWith_linkedIn: "Compartir con LinkedIn",
      shareWith_blogger: "Compartir con Blogger",
      goToNextPost: "Ir a la siguiente publicación",
      goToPreviousPost: "Ir a la publicación anterior",
      goToFirstPost: "Ir a la primera publicación",
      goToLastPost: "Ir a la última publicación",
      markPostAsUnread: "Marcar como no leído",
      markPostAsRead: "Marcar como leído",
      markPostAsReadLater: "Marcar como leído más tarde",
      unmarkPostAsReadLater: "Desmarcar como leído más tarde",
      starThisPost: "Destacar esta publicación",
      unstarThisPost: "Un-star this post",
      openOriginalArticle: "Abrir artículo original",
      description: "DESCRIPCIÓN",
      links: "ENLACES",
      postComments: "COMENTARIOS",
      author: "AUTOR",
      authors: "AUTORES",
      updatedColon: "ACTUALIZADO:",
      publishedColon: "PUBLICADO:",
      contributors: "CONTRIBUYENTES",
      // settings
      accountSettings: "CONFIGURACIONES DE LA CUENTA",
      usernameColon: "NOMBRE DE USUARIO:",
      emailAddress: "Dirección de Correo Electrónico",
      emailAddressColon: "DIRECCIÓN DE CORREO ELECTRÓNICO:",
      applyChanges: "Aplicar cambios",
      deactivateYourAccount: "Desactiva tu cuenta",
      downloadYourData: "Descarga tus datos",
      permanentlyDeleteYourAccount: "Eliminar permanentemente su cuenta",
      sendPasswordResetEmail:
        "Enviar correo electrónico de restablecimiento de contraseña",
      resetPassword: "Restablecer la contraseña",
      emailNotifications: "Notificaciones por correo electrónico",
      updateNotificationPreferences: "Actualizar preferencias de notificación",
      emailNotificationsAreDisabled:
        "Las notificaciones por correo electrónico están actualmente deshabilitadas.",
      emailNotificationsAreEnabled:
        "Las notificaciones por correo electrónico están habilitadas actualmente.",
      enableAccountAlertsNotifications:
        "Habilite esta opción para recibir alertas de cuenta y notificaciones de mantenimiento.",
      enableProductNotifications:
        "Habilite esta opción para recibir correos electrónicos ocasionales sobre notificaciones de producción y nuevas funciones.",
      enableSelectedNotifications: "Habilitar notificaciones seleccionadas",
      disableSelectedNotifications: "Deshabilitar todas las notificaciones",
      yourSubscriptionWasCanceled:
        "Su suscripción fue cancelada y no se renovará.",
      currentPeriod: "PERÍODO ACTUAL",
      endedAt: "TERMINÓ EN",
      willEndAt: "TERMINARÁ EN",
      statusColon: "ESTADO:",
      amountDueColon: "IMPORTE DEBIDO:",
      amountPaidColon: "CANTIDAD PAGADA:",
      amountRemainingColon: "CANTIDAD RESTANTE:",
      customerEmailAddressColon: "DIRECCIÓN DE CORREO ELECTRÓNICO DEL CLIENTE:",
      customerNameColon: "NOMBRE DEL CLIENTE:",
      invoiceUrlColon: "URL DE LA FACTURA:",
      productColon: "PRODUCTO:",
      mostRecentInvoice: "FACTURA MAS RECIENTE",
      clickHere: "haga clic aquí",
      cancelSubscription: "Cancelar suscripción",
      resumeSubscription: "Reanudar suscripción",
      supportFeedGears: "Soporte FeedGears RSS",
      pleaseConsiderSubscribing:
        "Considere suscribirse a FeedGears. Estamos respaldados al 100% por la comunidad de usuarios.",
      checkout: "Verificar",
      settingsUpdated: "Ajustes actualizan",
      updateLightTheme:
        "Haga clic aquí para guardar sus cambios en el tema de la luz",
      updateDarkTheme:
        "Haga clic aquí para guardar sus cambios en el tema oscuro",
      themeSettingsUpdated: "Configuración del tema actualizada",
      opmlExportDownloaded: "Exportación OPML descargada",
      yourSubscriptionWasCanceledClickToResume:
        "Su suscripción fue cancelada. Para reanudar, haga clic en 'Reanudar suscripción' en esta página.",
      yourSubscriptionWasResumed: "Tu suscripción fue reanudada",
      subscriptionStatus:
        "Su suscripción está actualmente {status}.  Comenzó el {started}.",
      // docs
      feedGearsDocumentation: "DOCUMENTACIÓN DE ENGRANAJES",
      // api
      feedGearsApi: "FEEDGEARS API",
      // order confirmation
      thankYouForYourOrder: "GRACIAS POR SU ORDEN",
      yourOrderIsConfirmed: "Su pedido está confirmado.",
      clickHereToReturnToTheApp: "Haga clic aquí para volver a la aplicación.",
      // verification callback
      thanksForVerifying:
        "¡Gracias por verificar! El estado de su cuenta ha sido actualizado.",
      // privacy policy
      feedGearsPrivacyPolicy: "POLÍTICA DE PRIVACIDAD DE ALIMENTADORES",
      whatInformationDoWeCollect: "¿Qué información recopilamos?",
      whatWeCollectSummary:
        "Recopilamos información personal que usted nos proporciona.",
      whatWeCollectDetails:
        "Recopilamos información personal que usted proporciona voluntariamente para usar cuando se registra en FeedGears, expresa interés en obtener información sobre nosotros o FeedGears, cuando participa en actividades en FeedGears o cuando se comunica con nosotros.",
      whatWeCollectImportantDetails: "No procesamos información sensible.",
      whatWeCollectFurtherDetails:
        "Toda la información personal que nos proporcione debe ser verdadera, completa y precisa, y debe notificarnos cualquier cambio en dicha información personal.",
      someCollectionIsAutomatic:
        "Parte de la información se recopila automáticamente",
      automaticCollectionDetails:
        "Parte de la información, como su dirección de Protocolo de Internet (IP) y/o las características del navegador y del dispositivo, se recopila automáticamente cuando visita FeedGears. Esta información (sistema operativo, preferencias de idioma, URL de referencia, nombre del dispositivo, país, ubicación, información sobre cómo y cuándo usa FeedGears y otra información técnica) no revela su identidad específica (como su nombre o información de contacto), pero puede incluir Información del dispositivo y uso. Esta información se necesita principalmente para mantener la seguridad y el funcionamiento de FeedGears, y para nuestros fines de informes y análisis internos.",
      howDoWeProcess: "¿Cómo procesamos su información?",
      howDoWeProcessSummary:
        "Procesamos su información para proporcionar, mejorar y administrar FeedGears, comunicarnos con usted, para seguridad y prevención de fraude, y para cumplir con la ley. También podemos procesar su información para otros fines con su consentimiento.",
      socialLogins: "Inicios de sesión sociales",
      socialLoginsSummary:
        "FeedGears le ofrece la posibilidad de registrarse e iniciar sesión utilizando los detalles de su cuenta de redes sociales de terceros (como los inicios de sesión de Google o Github). Cuando elija hacer esto, recibiremos cierta información de su perfil de su proveedor de redes sociales. La información de perfil que recibimos puede variar según el proveedor de redes sociales en cuestión, pero a menudo incluirá su nombre, dirección de correo electrónico y foto de perfil, así como otra información que elija hacer pública en dicha plataforma de redes sociales.",
      socialLoginsDetails:
        "Usaremos la información que recibimos solo para los fines que se describen en este aviso de privacidad o que se le aclaran de otro modo en FeedGears. Tenga en cuenta que no controlamos y no somos responsables de otros usos de su información personal por parte de su proveedor de redes sociales externo. Le recomendamos que revise su aviso de privacidad para comprender cómo recopilan, usan y comparten su información personal, y cómo puede configurar sus preferencias de privacidad en sus sitios y aplicaciones.",
      internationalInformationTransfers:
        "Transferencias internacionales de información",
      internationalInformationTransfersSummary:
        "Podemos transferir, almacenar y procesar su información en países distintos al suyo.",
      internationalInformationTransfersDetails:
        "Nuestros servidores están ubicados en los Estados Unidos. Si accede a FeedGears desde fuera de los Estados Unidos, tenga en cuenta que su información puede ser transferida, almacenada y procesada por nosotros en nuestras instalaciones y por aquellas de terceros con quienes podemos compartir su información personal, en los Estados Unidos. Estados y otros países.",
      internationalInformationTransfersDetailsFurther:
        "Si reside en el Espacio Económico Europeo (EAA) o el Reino Unido (RU), es posible que estos países no tengan necesariamente leyes de protección de datos u otras leyes similares tan completas como las de su país. Tomaremos todas las medidas necesarias para proteger su información personal de acuerdo con este aviso de privacidad y la ley aplicable.",
      whatAreYourPrivacyRights: "¿Cuáles son sus derechos de privacidad?",
      yourPrivacyRightsSummary:
        "Puede revisar, cambiar o cancelar su cuenta en cualquier momento.",
      yourPrivacyRightsDetails:
        "No distribuiremos su información personal a terceros sin su consentimiento.",
      yourConsent: "Tu consentimiento",
      yourConsentSummary:
        "Al usar nuestro sitio o nuestras aplicaciones, usted acepta nuestra política de privacidad.",
      doWeMakeUpdates: "¿Hacemos actualizaciones a este aviso?",
      doWeMakeUpdatesSummary:
        "Sí, actualizaremos este aviso según sea necesario para cumplir con las leyes pertinentes.",
      howCanYouContactUs:
        "¿Cómo puede ponerse en contacto con nosotros acerca de este aviso?",
      // aria labels
      switchModeAriaLabel: "Cambiar a tema claro u oscuro",
      goToSettingsAriaLabel: "Ir a la configuración de la cuenta",
      shareWith_twitter_ariaLabel: "Compartir con Twitter",
      shareWith_facebook_ariaLabel: "Compartir con Facebook",
      shareWith_telegram_ariaLabel: "Compartir con Telegram",
      shareWith_linkedIn_ariaLabel: "Compartir con LinkedIn",
      shareWith_blogger_ariaLabel: "Compartir con Blogger",
      // image alts
      queuePageScreenshot:
        "Captura de pantalla de la página de cola de FeedGears",
      queueLogoImage: "Imagen del logotipo de la cola",
      feedLogoImage: "Imagen del logotipo de fuente RSS",
      rssLogo: "logotipo RSS",
      postThumbnailImage: "Publicar imagen en miniatura",
      postEnclosureImage: "Publicar imagen del recinto",
      postITunesImage: "Publicar imagen de iTunes",
      postMediaContentImage: "Publicar imagen de contenido multimedia",
      postMediaThumbnail: "Publicar miniatura de medios",
      oAuth2ProfileImage: "Imagen de perfil de OAuth2",
      defaultOAuth2ProfileImage: "Imagen de perfil predeterminada de OAuth2",
    },
    en: {
      // generic
      trueStr: "true",
      falseStr: "false",
      somethingHorribleHappened:
        "Something horrible happened, and we're not sure what!  Please try again in a few moments.",
      requestTimedOut: "Request timed out, please try again in a few moments.",
      privacyPolicy: "Privacy Policy",
      cancel: "Cancel",
      filter: "Filter",
      first: "First",
      previous: "Previous",
      next: "Next",
      last: "Last",
      username: "Username",
      password: "Password",
      submit: "Submit",
      subscribe: "Subscribe",
      subscribed: "Subscribed!",
      inDevelopment:
        "Sorry, this section of FeedGears isn't quite ready yet.  Check back in a few days!",
      // auth
      loginToFeedGears: "Login to FeedGears",
      accountRecovery: "Account Recovery",
      passwordReset: "Password Reset",
      accountRegistration: "Account Registration",
      alreadyHaveAnAccount: "Already have an accont? Login here.",
      accountRecoveryHere: "Need help signing in?",
      registerHere: "FeedGears is free.  Create an account here.",
      unableToCompleteYourRequest:
        "We weren't able to complete your request.  Please try to login using another method.",
      usernameAndPasswordAreRequired: "Username and password are required.",
      passwordIsRequired: "Password is required.",
      usernameIsRequired: "Username is required.",
      signinWithGoogle: "Sign in with Google",
      pwResetRequestMessage:
        "Enter your username and email address.  We'll send a password reset link to your verified email address.",
      checkEmailForFurther: "Check your email to further instructions.",
      newPassword: "New password",
      confirmNewPassword: "Confirm new password",
      enterAndConfirmNewPw: "Enter and confirm your new password.",
      pwUpdated: "Password updated.",
      registrationRequirements:
        "Username, email address, and password are required in order to register.",
      // landing
      createAnAccount: "Create an account",
      whatIsFeedGears: "A secure, private, accessible feed reader.",
      whyIsFeedGearsFree: "Free forever because we love RSS.",
      devBlog: "Dev Blog",
      docs: "Docs",
      api: "API",
      email: "Email",
      twitter: "Twitter",
      github: "Github",
      twitch: "Twitch",
      discord: "Discord",
      copyright: "COPYRIGHT",
      contactUsWithQuestionsViaEmail:
        "Contact Lost Sidewalk Software with questions via email.",
      // faq
      whatIsRSS: "What is RSS/ATOM?",
      rssIs:
        "RSS (Really Simple Syndication) is a web feed format used for publishing frequently updated content such as blog entries, news headlines, audio, and video. It was first introduced by Netscape in 1999 as an XML-based format for syndicating content from news sites and blogs.",
      rssAllows:
        "RSS allows users to subscribe to content feeds using a web feed reader or aggregator, which can automatically retrieve and display new content from multiple sources in a single location. This makes it easier for users to stay up-to-date on their favorite websites and content creators without having to manually check each site for updates.",
      feedGearsIs: "FeedGears is both an RSS aggregator and an RSS reader.",
      overTheYears:
        "Over the years, RSS has evolved and several versions of the protocol have been released, including: ",
      eachVersionAdded:
        "Each version added new features and functionality, such as support for multimedia content and enclosures.",
      atomOTOH:
        "Atom, on the other hand, is a similar web feed format that was introduced in 2003 as an alternative to RSS. Like RSS, Atom is an XML-based format that allows publishers to syndicate content such as blog posts, news articles, and podcasts.",
      keyDifferences:
        "One of the key differences between RSS and Atom is that Atom is a standardized format, while RSS has multiple versions and variations. Additionally, Atom is designed to be more extensible and flexible than RSS, allowing for easier customization and support for additional metadata.",
      overallRoles:
        "Overall, RSS and Atom have played an important role in the evolution of web content syndication and have helped to make it easier for users to access and consume the content they care about.",
      // video panel
      rssMadeEasy: "RSS Made Easy",
      // confirmation dialog
      pleaseConfirm: "Please confirm",
      confirm: "Confirm",
      // go back
      goBack: "Go back",
      // control panel 
      login: "Login",
      logout: "Logout",
      settings: "Settings",
      help: "Help",
      switchMode: "Switch display mode",
      createNewQueue: "New queue",
      uploadOPML: "Upload OPML",
      pleaseEnableNotifications: "Please enable notifications to receive messages from FeedGears.",
      // queue select button
      showMoreInfo: "Show details",
      hideMoreInfo: "Hide details",
      addSubscriptions: "Add subscriptions",
      manageSubscriptions: "Manage subscriptions",
      subscriptions: "SUBSCRIPTIONS",
      publications: "PUBLICATIONS",
      zeroSubscriptions: "0 subscriptions",
      importerRanAt: "Importer ran at {importTimestamp}",
      nNewArticlesSaved: "{n} new articles saved",
      nArticlesArchived: "{n} articles archived",
      httpStatus: "HTTP {httpStatusCode} ({httpStatusMessage})",
      redirectedTo:
        "REDIRECT TO {redirectFeedUrl} HTTP {redirectHttpStatusCode} ({redirectHttpStatusMessage})",
      metricsNotYetAvailable: "Metrics are not yet available for this feed.",
      // buttons
      update: "Update",
      save: "Save",
      // queue config panel
      queueProperties: "Queue Properties",
      rssFeedDiscovery: "RSS Feed Discovery",
      // queue properties
      createANewQueue: "Create a new queue",
      updateQueueSettings: "UPDATE QUEUE SETTINGS",
      queueIdentifier: "Queue identifier",
      queueIdentifierHint: "A short, unique name for this queue. This value will be generated if not provided. This value will appear in log messages and elsewhere to refer to this queue.",
      queueTitle: "Queue title",
      queueTitleHint: "An optional descriptive name for this queue.  This value is shown throughout the FeedGears UI to refer to this queue.",
      queueDescription: "Queue description",
      queueDescriptionHint: "An optional detailed description for this queue, shown on the queue dashboard.",
      queueFeedGenerator: "Generator",
      queueFeedGeneratorHint: "In the published artifacts for this queue, this value appears as the 'feed generator' value",
      queueFeedCopyright: "Copyright",
      queueFeedCopyrightHint: "In the published artifacts for this queue, this value appears as the 'feed copyright' value",
      queueFeedLanguage: "Language",
      queueFeedLanguageHint: "In the published artifacts for this queue, this value appears as the 'feed language' value.",
      // subscription config
      addANewSubscription: "ADD A NEW SUBSCRIPTION",
      yourSubscriptions: "YOUR SUBSCRIPTIONS",
      feedUrl: "Feed URL",
      credentialsUseMessage:
        "* The following credentials will be supplied if this feed requests authentication.",
      discovery: "Discovery",
      auth: "Auth",
      unsubscribe: "Unsubscribe",
      subscriptionAdded: "Subscription added",
      subscriptionUpdated: "Subscription updated",
      subscriptionDeleted: "Subscription deleted",
      queryMetrics: "RSS feed metrics",
      importedNArticlesAt: "Imported {n} articles at {at}.",
      importedNArticles: "Imported {n} articles.",
      timestamp: "Timestamp",
      message: "Message",
      httpStatusLabel: "HTTP Status",
      httpRedirect: "HTTP Redirect Status",
      error: "Error",
      updateAuth: "Update Credentials",
      // rss feed info
      authorColon: "Author:",
      lastPublishedColon: "Last published:",
      managingEditorColon: "Managing editor:",
      webmasterColon: "Webmaster:",
      httpStatusCode: "HTTP status code",
      redirectHttpStatusCode: "Redirect HTTP status code",
      feedAlsoAvailableInHttps: "This feed is also available in HTTPS.",
      recommendedFeeds: "Similar feeds",
      refreshThisFeed: "Refresh this feed",
      // post feed filter
      refreshQueues: "Refresh queues",
      markQueueAsRead: "Mark this queue as read",
      toggleSortOrder: "Toggle sort direction",
      toggleFeedFilterPills: "Toggle filter pills",
      // post feed filter pills
      allSubscriptions: "all subscriptions",
      all: "all",
      unread: "UNREAD",
      readLater: "READ-LATER",
      read: "READ",
      starred: "STARRED",
      clear: "CLEAR",
      // filter help
      filtering: "Filtering",
      filteringProvides:
        "Filtering provides a powerful way to find specific articles based on various fields such as feed, categories, description, title, author, published date, updated date, contents, and URL.",
      syntax: "Syntax",
      feedGearsFilterSupports:
        "The FeedGears filter function supports a syntax that allows users to build complex search queries. The basic syntax is as follows:",
      fieldColonValue: "field:value",
      syntaxAllows:
        "This syntax allows you to specify a field name followed by a colon and the corresponding value you want to search for. You can use multiple field:value pairs to create more specific search queries.",
      supportedFields: "Supported Fields",
      feedFieldDesc: "The name or identifier of the feed.",
      categoryFieldDesc:
        "The categories or tags associated with the article.",
      descriptionFieldDesc:
        "A summary or description of the article.",
      titleFieldDesc: "The title of the article.",
      authorFieldDesc: "The primary author of the article.",
      authorsFieldDesc:
        "A list of authors associated with the article.",
      contributorsFieldDesc:
        "A list of contributors to the article.",
      publishedFieldDesc: "The published date of the article.",
      updatedFieldDesc: "The updated date of the article.",
      contentsFieldDesc: "The main content of the article.",
      urlFieldDesc: "The URL of the article.",
      statusFieldDesc: "The read-status of the article (read, unread, read-later).", 
      starredFieldDesc: "The starred-status of the article (true, false).",
      exampleQueries: "Example Queries",
      hereAreSomeExamples:
        "Here are some examples of search queries you can perform using the FeedGears filter function:",
      explanation: "Explanation",
      searchForArticlesWithWord:
        'Search for articles with the word "technology" in the title.',
      searchForArticlesPublishedBy:
        "Search for articles published by a specific author.",
      searchForArticlesPublishedBetween:
        "Search for articles published between two specific dates.",
      searchForArticlesWithWords:
        'Search for articles with the word "JavaScript" in the contents and "tutorial" in the title.',
      searchForArticlesInASpecificFeedAndCategory:
        "Search for articles in a specific feed and category.",
      advancedQueries: "Advanced Queries",
      inAdditionTo:
        "In addition to the basic field:value queries, FeedGears supports more advanced search options such as wildcard searches, fuzzy searches, and range searches. You can refer to the FeedGears documentation for more details on these advanced search options.",
      // help panel
      feedGearsHelp: "FeedGears Help",
      dismiss: "Dismiss",
      globalShortcutKeys: "GLOBAL SHORTCUT KEYS",
      key: "Key",
      action: "Action",
      configureSelectedQueue: "Manage subscriptions in the selected queue",
      markSelectedQueueAsRead: "Mark the selected queue as read",
      deleteSelectedQueue: "Delete the selected queue",
      addSubscriptionToSelectedQueue: "Add a subscription to selected queue",
      showUnread: "Show unread",
      showStarred: "Show starred",
      showReadLater: "Show read-later",
      showRead: "Show read",
      search: "Search",
      // layout
      cardLayout: "Switch to card layout",
      listLayout: "Switch to list layout",
      // iTunes
      explicit: "EXPLICIT",
      closedCaptioned: "Closed Captioned",
      episode: "Episode {episode}",
      episodeType: "{episodeType} episode",
      // post media
      media: "MEDIA",
      // community
      nViews: "VIEWS",
      tags: "TAGS",
      // post media content
      audioChannelsColon: "AUDIO CHANNELS:",
      bitRateColon: "BIT RATE:",
      durationColon: "DURATION:",
      expressionColon: "EXPRESSION:",
      fileSizeColon: "FILE SIZE:",
      frameRateColon: "FRAME RATE:",
      heightColon: "HEIGHT:",
      widthColon: "WIDTH:",
      languageColon: "LANGUAGE:",
      samplingRateColon: "SAMPLING RATE:",
      // opml
      selectAnOpmlFile: "Select an OPML file",
      addAnOpmlFile: "Add an OPML file",
      addOneOrMoreFilesToUpload: "Add one or more files to upload",
      finalizeUpload: "Finalize upload",
      continueToStep2: "Continue to step 2",
      clickHereWHenYourFilesAreStaged: "Click here when your files are staged",
      opmlFiles: "OPML Files",
      previewThisFile: "Preview this file in a new window.",
      delete: "Delete",
      selectAtLeastOneFile: "Select at least one file to continue.",
      opmlFilesContainErrors:
        "Your files contain the following problems.  Please resolve these issues and re-attempt your upload.",
      weWillCreateTheFollowingSubscriptions:
        "We will create the following queues from your OPML file(s):",
      // post feed
      confirmDeleteQueue:
        "Please confirm that you want to delete this queue. This action is irreversible.",
      confirmMarkQueueAsRead:
        "Please confirm that you want to mark all items in this queue as read.",
      queueDashboard: "FEED DASHBOARD",
      queueSettings: "QUEUE SETTINGS",
      opmlUpload: "OPML UPLOAD",
      refreshFailedDueToColon: "Refresh failed due to:",
      noMessage: "no message",
      queueUpdated:
        "Queue updated.  We're sorting out your subscriptions in the background.  This process may take several minutes.",
      queueCreated:
        "Queue created.  We're sorting out your new subscriptions in the background.  This process may take several minutes.",
      nQueuesCreated:
        " queues created.  We're sorting out your new subscriptions in the background.  This process may take several minutes.",
      clickToLoadMore: "Click here to load more",
      // post item
      showPostDetails: "Show post details",
      showPostCategories: "Show post categories",
      addCategoryToFilter: "Add this category ({postCategory}) to the filter",
      showPostSharing: "Show post sharing options",
      shareWith_twitter: "Share with Twitter",
      shareWith_facebook: "Share with Facebook",
      shareWith_telegram: "Share with Telegram",
      shareWith_linkedIn: "Share with LinkedIn",
      shareWith_blogger: "Share with Blogger",
      goToNextPost: "Go to next post",
      goToPreviousPost: "Go to previous post",
      goToFirstPost: "Go to first post",
      goToLastPost: "Go to last post",
      markPostAsUnread: "Mark as unread",
      markPostAsRead: "Mark as read",
      markPostAsReadLater: "Mark as read-later",
      unmarkPostAsReadLater: "Unmark as read-later",
      starThisPost: "Star this post",
      unstarThisPost: "Un-star this post",
      openOriginalArticle: "Open original article",
      description: "DESCRIPTION",
      links: "LINKS",
      postComments: "COMMENTS",
      author: "AUTHOR",
      authors: "AUTHORS",
      updatedColon: "UPDATED:",
      publishedColon: "PUBLISHED:",
      contributors: "CONTRIBUTORS",
      // settings
      accountSettings: "ACCOUNT SETTINGS",
      usernameColon: "USERNAME:",
      emailAddress: "Email Address",
      emailAddressColon: "EMAIL ADDRESS:",
      applyChanges: "Apply Changes",
      deactivateYourAccount: "Deactivate Your Account",
      downloadYourData: "Download Your Data",
      permanentlyDeleteYourAccount: "Permanently Delete Your Account",
      sendPasswordResetEmail: "Send Password Reset Email",
      resetPassword: "Reset Password",
      emailNotifications: "Email Notifications",
      updateNotificationPreferences: "Update Notification Preferences",
      emailNotificationsAreDisabled:
        "Email notifications are currently disabled.",
      emailNotificationsAreEnabled:
        "Email notifications are currently enabled.",
      enableAccountAlertsNotifications:
        "Enable this option to receive account alerts and maintenance notifications.",
      enableProductNotifications:
        "Enable this option to receive occasional emails about production notifications and new features.",
      enableSelectedNotifications: "Enable Selected Notifications",
      disableSelectedNotifications: "Disable All Notifications",
      yourSubscriptionWasCanceled:
        "Your subscription was canceled, and will not renew.",
      currentPeriod: "CURRENT PERIOD",
      endedAt: "ENDED AT",
      willEndAt: "WILL END AT",
      statusColon: "STATUS:",
      amountDueColon: "AMOUNT DUE:",
      amountPaidColon: "AMOUNT PAID:",
      amountRemainingColon: "AMOUNT REMAINING:",
      customerEmailAddressColon: "CUSTOMER EMAIL ADDRESS:",
      customerNameColon: "CUSTOMER NAME:",
      invoiceUrlColon: "INVOICE URL:",
      productColon: "PRODUCT:",
      mostRecentInvoice: "MOST RECENT INVOICE",
      clickHere: "Click here",
      cancelSubscription: "Cancel subscription",
      resumeSubscription: "Resume subscription",
      supportFeedGears: "Support FeedGears RSS",
      pleaseConsiderSubscribing:
        "Please consider subscribing to FeedGears.  We are supported 100% by the user community.",
      checkout: "Checkout",
      settingsUpdated: "Settings updated",
      updateLightTheme: "Click here to save your changes to the light theme",
      updateDarkTheme: "Click here to save your changes to the dark theme",
      themeSettingsUpdated: "Theme settings updated",
      opmlExportDownloaded: "OPML export downloaded",
      yourSubscriptionWasCanceledClickToResume:
        "Your subscription was canceled.  To resume, click 'Resume Subscription' on this page.",
      yourSubscriptionWasResumed: "Your subscription was resumed",
      subscriptionStatus:
        "Your subscription is currently {status}.  It began at {started}.",
      // docs
      feedGearsDocumentation: "FEEDGEARS DOCUMENTATION",
      // api
      feedGearsApi: "FEEDGEARS API",
      // order confirmation
      thankYouForYourOrder: "THANK YOU FOR YOUR ORDER",
      yourOrderIsConfirmed: "Your order is confirmed.",
      clickHereToReturnToTheApp: "Click here to return to the app.",
      // verification callback
      thanksForVerifying:
        "Thanks for verifying!  Your account status has been updated.",
      // privacy policy
      feedGearsPrivacyPolicy: "FEEDGEARS PRIVACY POLICY",
      whatInformationDoWeCollect: "What information do we collect?",
      whatWeCollectSummary:
        "We collect personal information that you provide to us.",
      whatWeCollectDetails:
        "We collect personal information that you voluntarily provide to use when you register on FeedGears, express an interest in obtaining information about us or FeedGears, when you participate in activities on FeedGears, or otherwise when you contact us.",
      whatWeCollectImportantDetails: "We do not process sensitive information.",
      whatWeCollectFurtherDetails:
        "All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.",
      someCollectionIsAutomatic: "Some information is automatically collected",
      automaticCollectionDetails:
        "Some information--such as your Internet Protocol (IP) address and/or browser and device characteristics--is collected automatically when you visit FeedGears.  This information (operating system, language preferences, referring URLs, device name, country, location, information about how and when you use FeedGears, and other technical information) does not reveal your specific identity (like your name or contact information) but may include device and usage information.  This information is primarily needed to maintain the security and operation of FeedGears, and for our internal analytics and reporting purposes.",
      howDoWeProcess: "How do we process your information?",
      howDoWeProcessSummary:
        "We process your information to provide, improve, and administer FeedGears, communicate with you, for security and fraud prevention, and to comply with law.  We may also process your information for other purposes with your consent.",
      socialLogins: "Social logins",
      socialLoginsSummary:
        "FeedGears offers you the ability to register and login using your third-party social media account details (like Google or Github logins).  Where you choose to do this, we will receive certain profile information about you from your social media provider.  The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, and profile picture, as well as other information you choose to make public on such a social media platform.",
      socialLoginsDetails:
        "We will use the information we receive only for the purposes that are described in this privacy notice or that are othrerwise made clear to you on FeedGears.  Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider.  We recommend that you review their privacy notice to understand how they collect, use, and share your personal infromation, and how you can set your privacy preferences on their sites and apps.",
      internationalInformationTransfers: "International information transfers",
      internationalInformationTransfersSummary:
        "We may transfer, store, and process your information in countries other than your own.",
      internationalInformationTransfersDetails:
        "Our servers are located in the United States.  If you are acessing FeedGears from outside the United States, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those of third-parties with whom we may share your personal information, in the United States and other countries.",
      internationalInformationTransfersDetailsFurther:
        "If you are a resident in the European Economic Area (EAA) or United Kingdom (UK), then these countries may not necessarily have data protection laws or other simliar laws as comprehensive as those in your country.  We will take all necessary measures to protected your personal information in accordance with this privacy notice and applicable law. ",
      whatAreYourPrivacyRights: "What are your privacy rights?",
      yourPrivacyRightsSummary:
        "You may review, change, or terminate your account at any time.",
      yourPrivacyRightsDetails:
        "We will not distribute your personal information to outside parties without your consent.",
      yourConsent: "Your consent",
      yourConsentSummary:
        "By using our site or apps, you consent to our privacy policy.",
      doWeMakeUpdates: "Do we make updates to this notice?",
      doWeMakeUpdatesSummary:
        "Yes, we will update this notice as necessary to stay compliant with relevant laws.",
      howCanYouContactUs: "How can you contact us about this notice?",
      // aria labels
      switchModeAriaLabel: "Switch to light or dark theme",
      goToSettingsAriaLabel: "Go to account settings",
      shareWith_twitter_ariaLabel: "Share with Twitter",
      shareWith_facebook_ariaLabel: "Share with Facebook",
      shareWith_telegram_ariaLabel: "Share with Telegram",
      shareWith_linkedIn_ariaLabel: "Share with LinkedIn",
      shareWith_blogger_ariaLabel: "Share with Blogger",
      // image alts
      queuePageScreenshot: "FeedGears queue page screenshot",
      queueLogoImage: "Queue logo image",
      feedLogoImage: "Feed logo image",
      rssLogo: "RSS logo",
      postThumbnailImage: "Post thumbnail image",
      postEnclosureImage: "Post enclosure image",
      postITunesImage: "Post iTunes image",
      postMediaContentImage: "Post media content image",
      postMediaThumbnail: "Post media thumbnail",
      oAuth2ProfileImage: "OAuth2 profile image",
      defaultOAuth2ProfileImage: "Default OAuth2 profile image",
    },
  },
});

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa4";
import { md2 } from "vuetify/blueprints";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const defaultTheme = 'dark';

let preferredTheme = localStorage.getItem('theme');

const vuetify = createVuetify({
  blueprint: md2,
  theme: {
    defaultTheme: preferredTheme ? preferredTheme : defaultTheme,
  },
  icons: {
    defaultSet: "fa",
    aliases,
    sets: {
      fa,
    },
  },
  components,
  directives,
  defaults: {
    VCardTitle: {
      style: 'font-family: "Russo One", system-ui, sans-serif;',
    },
    VCardSubtitle: {
      style: "white-space: normal;",
    },
    VCardActions: {
      style: "overflow: auto;flex-wrap: wrap;justify-content: space-evenly;",
    },
    //
    VCard: {
      color: "surface",
    },
    VNavigationDrawer: {
      color: "surface",
    },
    VBtn: {
      color: "primary",
    },
    VAlert: {
      borderColor: "accent",
      color: "primary",
    },
    VTextField: {
      bgColor: "accent",
      color: "primary",
    },
    VDivider: {
      color: "primary",
    },
    VTabs: {
      bgColor: "surface",
      color: "primary",
      sliderColor: "accent",
    },
    VTab: {
      color: "primary",
      sliderColor: "accent",
    },
    VChip: {
      color: "primary",
    },
    VFooter: {
      color: "surface",
    },
    VList: {
      activeColor: "secondary",
      bgColor: "surface",
      color: "primary",
    },
    VListItem: {
      activeColor: "accent",
      color: "primary",
    },
    VListSubheader: {
      color: "primary",
    },
    VToolbar: {
      color: "surface",
    },
    VToolbarItems: {
      color: "primary",
    },
    VCheckBox: {
      color: "primary",
    },
    VAppBar: {
      color: "surface",
    },
    VAppBarNavIcon: {
      color: "primary",
    },
    VProgressLinear: {
      bgColor: "surface",
      color: "primary",
    },
  },
});

createApp(App, {})
  .use(NewsGearsWebPlugin, {})
  .use(router)
  .use(VuePlyr, {
    plyr: {},
  })
  .use(VueAnnouncer)
  .use(i18n)
  .use(vuetify)
  .use(Vue3NativeNotification, {
    requestOnNotify: true,
  })
  .mount("#app");
