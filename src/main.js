import { createApp } from "vue";
import useAuthService from '@/services/useAuthService.js';
import App from "./App.vue";
import router from "./router";
import VuePlyr from "vue-plyr";
import VueAnnouncer from "@vue-a11y/announcer";
import { createI18n } from "vue-i18n";
import Vue3NativeNotification from "vue3-native-notification";
import { createPinia } from "pinia";
import VueDOMPurifyHTML from 'vue-dompurify-html';

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
      loadingProgress: "Progreso de carga", 
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
      // demo
      filterScreenshot: 'Captura de pantalla del filtro de cola',
      listLayoutsScreenshot: 'Captura de pantalla de diseño de lista',
      cardLayoutsScreenshot: 'Captura de pantalla del diseño de la tarjeta',
      tableLayoutsScreenshot: 'Captura de pantalla del diseño de la tabla',
      opmlUploadScreenshot: 'Captura de pantalla de carga OPML',
      comingSoon: '¡Próximamente!',
      // demo (api access) 
      apiAccess: 'Acceso a la API', 
      // demo (enhanced filtering) 
      enhancedFiltering: 'Filtrado y búsqueda mejorados utilizando LunrJS',
      enhancedFiltering_detail1: 'Aplica filtros y busca dentro de una cola de artículos para enfocar tus opciones de lectura según tus preferencias o temas específicos de interés.',
      enhancedFiltering_detail2: 'Localiza fácilmente artículos utilizando diversos puntos de datos, ahorrando tiempo y agilizando tu experiencia de lectura. Las capacidades de búsqueda de FeedGears están respaldadas por LunrJS.',
      // demo (about LS) 
      aboutLS_detail1: '', // TODO: finish this 
      // demo (feed dashboard)
      feedDashboard: 'Panel de Control de Feeds',
      feedDashboard_detail1: 'El panel de control de feeds muestra información resumida sobre cada cola de artículos. Cada tarjeta del panel es configurable; puedes agregar y quitar detalles y botones de acción según tus necesidades.',
      feedDashboard_detail2: 'Por defecto, FeedGears muestra el número de elementos no leídos, el número de elementos "marcados" y el artículo más recientemente publicado o actualizado en todas las suscripciones de una cola. La tarjeta del panel también brinda acceso rápido para gestionar las suscripciones y obtener detalles rápidos sobre cada feed en una cola:',
      dashboardCardScreenshot: 'Captura de pantalla de la tarjeta del panel de la cola',
      queueSettingsScreenshot: 'Captura de pantalla de la configuración de la cola',
      // demo (layout options)
      layoutOptions: 'Diseños y Temas',
      layoutOptions_detail1: 'Elige entre tres diseños de lectura: vistas en forma de tabla, lista o tarjetas. La vista en lista ofrece una presentación simplificada que te permite desplazarte por los artículos. La vista de tarjetas muestra imágenes destacadas y fragmentos para una experiencia de lectura más atractiva. La vista en forma de tabla proporciona un formato estructurado, útil para obtener una visión general rápida de los titulares.',
      layoutOptions_detail2: 'Hay disponibles temas claros y oscuros para reducir la tensión ocular en entornos con poca luz.',
      // demo (misc) 
      aboutFeedGears: 'Acerca de FeedGears',
      accessible: 'Accesible',
      accessible_detail1: 'La accesibilidad es una prioridad principal. Nos comprometemos a garantizar una experiencia inclusiva para todos los usuarios de FeedGears. Para lograr esto, utilizamos vue-announcer, una herramienta que hace que los mensajes importantes sean accesibles para lectores de pantalla y otras tecnologías de asistencia. Al aprovechar vue-announcer, aseguramos que todos puedan acceder a la información que necesitan de manera fluida.',
      accessible_detail2: 'Además, nos esforzamos por cumplir con las pautas de accesibilidad de contenido web (WCAG). WCAG proporciona un conjunto de pautas para hacer que el contenido digital sea más accesible para personas con discapacidades. Al adherirnos a estas pautas, aseguramos que FeedGears esté diseñado y desarrollado teniendo en cuenta la accesibilidad, brindando una experiencia óptima para todos los usuarios.',
      mobileOptimized: 'Optimizado para Dispositivos Móviles',
      mobileOptimized_detail1: 'FeedGears tiene una interfaz optimizada y receptiva para dispositivos móviles, diseñada pensando en la practicidad. Nuestra interfaz de usuario garantiza una experiencia fluida y consistente en diferentes dispositivos, incluidos teléfonos inteligentes y tabletas.',
      mobileOptimized_detail2: 'Los principios de diseño receptivo de Vuetify permiten que nuestra interfaz se adapte sin problemas a diferentes tamaños de pantalla. Ya sea que utilices un dispositivo móvil más pequeño o una tableta más grande, la funcionalidad y la presentación visual se mantienen consistentes. Esto significa que puedes disfrutar de las mismas características e interfaz fácil de usar, independientemente del dispositivo que elijas utilizar.',
      mobileOptimized_detail3: 'Hemos diseñado cuidadosamente nuestra interfaz para que sea intuitiva y eficiente en dispositivos móviles. Navegar por los artículos, explorar categorías y personalizar tus preferencias de lectura es fácil y conveniente. El diseño y los controles están optimizados para la interacción táctil, lo que garantiza una experiencia fluida en tu dispositivo móvil.',
      secure: 'Seguro',
      secure_detail1: 'Una de nuestras características clave de privacidad es el proxy de imágenes seguro. Con esta función, todas las imágenes dentro de los feeds RSS se enrutan a través de nuestro servidor seguro antes de mostrarse. Esto ayuda a evitar posibles riesgos de privacidad asociados con la carga directa de imágenes externas. Al proxyar las imágenes, podemos analizarlas y sanearlas, reduciendo la probabilidad de que contenido malicioso o no deseado llegue a tu dispositivo.',
      secure_detail2: 'Además, implementamos una Política de Seguridad de Contenido (CSP) sensata para protegernos contra ataques de scripting entre sitios (XSS) y otras posibles vulnerabilidades de seguridad. La CSP nos permite definir fuentes confiables para varios tipos de contenido. Al hacer cumplir estas políticas, mitigamos los riesgos asociados con la ejecución de código no autorizado y el acceso no autorizado a datos.',
      secure_detail3: 'Tu privacidad y seguridad son de suma importancia para nosotros. Al utilizar un proxy de imágenes seguro e implementar una Política de Seguridad de Contenido sensata, nuestro objetivo es brindarte una experiencia de navegación sin preocupaciones. Disfruta de la tranquilidad mientras exploras tus feeds RSS, sabiendo que hemos tomado medidas proactivas para proteger tu privacidad y garantizar la integridad de tus datos.',
      localized: 'Localizado',
      localized_detail1: 'FeedGears está disponible actualmente en inglés y español. Agregar soporte para otros idiomas está en nuestro plan a corto plazo.',
      freeAsInBeer: 'Gratis como en cerveza',
      freeAsInBeer_detail1: 'Lost Sidewalk Software adopta los principios del software libre y de código abierto (FOSS) para todos nuestros productos. Todo nuestro código fuente está disponible de forma gratuita en GitHub y está cubierto por la Licencia Pública General de GNU versión 3 (GPLv3). Esto significa que cualquiera puede acceder, estudiar, modificar y distribuir nuestro software.',
      freeAsInBeer_detail2: 'Damos la bienvenida a desarrolladores y entusiastas a unirse a nuestra comunidad y contribuir al proyecto. Ya sea a través de contribuciones de código, correcciones de errores, sugerencias de funciones o mejoras de documentación, valoramos y apreciamos todas las formas de participación. Juntos, podemos mejorar la plataforma FeedGears y satisfacer las necesidades cambiantes de nuestros usuarios.',
      freeAsInBeer_detail3: 'En el espíritu del FOSS, creemos en la libertad de usar, examinar, modificar y redistribuir software. Nuestro objetivo es fomentar la colaboración, el intercambio de conocimientos y la innovación. Te invitamos a unirte a nuestro viaje, donde buscamos construir una comunidad activa y solidaria de desarrolladores, colaboradores y usuarios. Tus contribuciones, independientemente de su tamaño, son muy valoradas e instrumentales para dar forma al futuro de FeedGears. Celebremos el poder del FOSS y trabajemos juntos para crear una experiencia mejor y más inclusiva para todos.',
      selfHostable: 'Autohospedado / Contenedores preconstruidos',
      selfHostable_detail1: 'Puedes ejecutar FeedGears en tu entorno preferido. Nuestros contenedores preconstruidos son compatibles con varios entornos de ejecución compatibles con OCI, como Docker y Podman. Esto te brinda la libertad de implementar y administrar FeedGears según tus requisitos específicos.',
      selfHostable_detail2: 'El autohospedaje te permite mantener tus datos dentro de tu propio entorno, ofreciéndote un control total sobre todo el proceso de agregación de RSS. Tú decides si ejecutarlo en tu máquina local, servidor privado o dentro de tu infraestructura en contenedores.',
      // demo (opml) 
      opmlSupport: 'Soporte de OPML',
      opmlSupport_detail1: 'FeedGears admite la importación/exportación de OPML, lo que facilita la migración de tus suscripciones RSS. Importa feeds desde archivos OPML producidos por otros lectores y consolida múltiples fuentes. Exporta tus feeds, estructuras de cola y metadatos como archivos OPML para hacer copias de seguridad o compartir con otros.',
      opmlSupport_detail2: 'OPML garantiza la compatibilidad y la interoperabilidad con otros lectores de RSS.',
      // demo (reading experience)
      readingExperience: 'Experiencia de lectura simplificada',
      readingExperience_detail1: 'La vista de artículo de FeedGears integra un potente reproductor de medios, lo que te permite ver cómodamente el contenido multimedia directamente dentro de la aplicación.',
      readingExperience_detail2: 'Comparte artículos sin esfuerzo a través de plataformas populares como Twitter, LinkedIn, Facebook, Telegram y Blogger.',
      readingExperience_detail3: 'Filtra los artículos por sus categorías de RSS para una navegación rápida.',
      textArticleScreenshot: 'Artículo de texto/HTML',
      podcastAudioScreenshot: 'Podcasts de audio',
      youtubeVideoScreenshot: 'Video de Youtube',
      imageArticleScreenshot: 'Artículo con Imágenes',
      // demo (simplified organization)
      simplifiedOrganization: 'Organización simplificada',
      simplifiedOrganization_detail1: 'Con el sistema de cola de artículos de FeedGears, puedes organizar fácilmente tus suscripciones de feeds RSS en grupos temáticos. Puedes crear colas para diferentes temas de interés, como juegos, tecnología o deportes, lo que te permite mantener el enfoque y acceder a artículos de múltiples fuentes en un solo lugar.',
      simplifiedOrganization_detail2: 'Al importar artículos de todos los feeds en una cola, FeedGears crea una colección unificada de artículos. Esto significa que no tienes que navegar por múltiples feeds individuales o cambiar manualmente entre diferentes fuentes. Puedes disfrutar de una experiencia de lectura fluida con todos los artículos relevantes accesibles de manera conveniente en una sola cola.',
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
      // buttons
      update: "Actualizar",
      save: "Guardar",
      // queue config panel
      queueProperties: "Propiedades de la cola",
      rssFeedDiscovery: "Descubrimiento de fuentes RSS",
      configuringQueue: "Configurando cola: {name}",
      // queue properties
      createANewQueue: "Crear una nueva cola",
      createANewQueueHere: "Cree una nueva cola aquí. Las colas se utilizan para agrupar y organizar artículos de suscripciones de fuentes relacionadas. Los artículos en la misma cola se leen, indexan y filtran juntos. Del mismo modo, los artículos en la misma cola que están 'destacados' se publican en una nueva fuente específica de la cola, que está disponible en varios formatos. Utilice este panel para crear una nueva cola, definir sus propiedades básicas y configurar los ajustes relacionados con la publicación de artículos destacados. Una vez que se crea una cola, puede agregar suscripciones para importar artículos.",
      updateQueueSettings: "Actualizar la configuración de la cola",
      updateQueueSettingsHere: "Actualice la configuración de la cola aquí. Las colas se utilizan para agrupar y organizar artículos de suscripciones de fuentes relacionadas. Los artículos en la misma cola se leen, indexan y filtran juntos. Del mismo modo, los artículos en la misma cola que están 'destacados' se publican en una nueva fuente específica de la cola, que está disponible en varios formatos. Utilice este panel para cambiar las propiedades básicas de la cola y configurar los ajustes relacionados con la publicación de artículos destacados.",
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
      manageYourSubscriptionsHere: "Gestiona tus suscripciones aquí. Vea el historial completo de nuestra interacción con esto al ver las métricas de fuentes RSS. También puede usar este panel para configurar la autenticación y darse de baja de una fuente. Tenga en cuenta que los artículos se eliminan según sea necesario, independientemente del estado de la suscripción. Es posible que aún vea artículos en su cola incluso después de darse de baja de un feed aquí.",
      addANewSubscription: "AGREGAR UNA NEUVA SUSCRIPCIÓN",
      addANewSubscriptionHere: "Agregue una nueva suscripción aquí. Ingrese una URL válida. Intentaremos resolver la ubicación del artefacto RSS/ATOM en la ubicación que especifique.",
      feedUrl: "URL de fuente RSS",
      credentialsUseMessage:
        "* Se proporcionarán las siguientes credenciales si esta fuente RSS solicita autenticación.",
      discovery: "Descubrimiento",
      auth: "Autorización",
      unsubscribe: "Darse de baja",
      subscriptionAdded: "Suscripción añadida",
      subscriptionUpdated: "Suscripción actualizada",
      subscriptionDeleted: "Suscripción eliminada",
      subscriptionMetrics: "Métricas de fuentes RSS",
      importedPersistedAndArchived: "Artículos {importCt} importados. Artículos {persistCt} guardados. Artículos {archiveCt} archivados debido a su antigüedad.",
      importedAndPersisted: "Artículos {importCt} importados. Artículos {persistCt} guardados.",
      importedAndArchived: "Artículos {importCt} importados. Artículos {archiveCt} archivados debido a su antigüedad.",
      importedNArticles: "{n} artículos importados (nada nuevo).",
      timestamp: "Marca de tiempo",
      message: "Mensaje",
      httpStatusLabel: "Estado HTTP",
      httpRedirect: "Estado de redirección HTTP",
      error: "Error",
      updateAuth: "Actualizar credenciales",
      lastImportedAt: "Última importación en: {timestamp}",
      // rss feed info
      authorColon: "Autor:",
      lastPublishedColon: "Última publicación:",
      managingEditorColon: "Editor gerente:",
      webmasterColon: "Administrador de página web:",
      httpStatusCode: "Código de estado HTTP",
      redirectHttpStatusCode: "Redirigir el código de estado HTTP",
      feedAlsoAvailableInHttps: "Este feed también está disponible en HTTPS.",
      recommendedFeeds: "Fuentes RSS similares",
      // post feed filter help
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
      configureSelectedQueue: "Configurar la cola seleccionada",
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
      tableLayout: "Cambiar al diseño de la tabla",
      refreshQueues: "Actualizar colas",
      refreshForLatest: "Actualizar esta cola para nuevos artículos",
      markQueueAsRead: "Marcar esta cola como leída",
      toggleSortOrder: "Alternar dirección de clasificación",
      toggleFilterPills: "Alternar píldoras de filtro",
      allSubscriptions: "todas las suscripciones",
      all: "todos",
      unread: "NO LEÍDO",
      readLater: "LEER MÁS TARDE",
      read: "LEÍDO",
      starred: "FAVORITA",
      clear: "CLARA",
      toggleUnread: 'Mostrar/ocultar artículos no leídos',
      toggleRead: 'Mostrar/ocultar artículos leídos',
      toggleReadLater: 'Mostrar/ocultar artículos para leer más tarde',
      toggleStarred: 'Mostrar/ocultar artículos destacados',
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
      uploadOpmlHere: 'Utilice esta pantalla para cargar un archivo OPML que contenga información sobre sus suscripciones a feeds desde otra plataforma.',
      createQueuesFromOPML: "Cargue OPML para crear colas",
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
      toggleDashboard: "Mostrar/ocultar tablero",
      thisIsYourQueueDashboard: "Este es su tablero de colas. El panel muestra estadísticas de resumen sobre cada cola, como la cantidad de elementos no leídos en un grupo de suscripciones. Haga clic en una tarjeta de cola para ver los artículos en esa cola. Use los botones de la tarjeta de cola para agregar, administrar, suscribirse y cancelar la suscripción a las fuentes. Presione ESC para ocultar este menú.",
      // queue select button
      showMoreInfo: "Mostrar suscripciones",
      hideMoreInfo: "Ocultar suscripciones",
      addSubscriptions: "Agregar suscripciones",
      manageSubscriptions: "Administrar suscripciones ({ct})",
      subscriptions: "SUSCRIPCIONES",
      publications: "PUBLICACIONES",
      recentArticles: "ARTÍCULOS RECIENTES",
      zeroSubscriptions: "0 suscripciones",
      importerRanAt: "Importadora corrió a las {importTimestamp}",
      nNewArticlesSaved: "{n} nuevos artículos guardados",
      nArticlesArchived: "{n} artículos archivados",
      httpStatus: "HTTP {httpStatusCode} ({httpStatusMessage})",
      redirectedTo:
        "Redirigido a {redirectFeedUrl} HTTP {redirectHttpStatusCode} ({redirectHttpStatusMessage})",
      metricsNotYetAvailable:
        "Las métricas aún no están disponibles para esta fuente RSS.",
      confirmDeleteQueue:
        "Confirme que desea eliminar esta cola. Esta acción es irreversible.",
      confirmMarkQueueAsRead:
        "Confirme que desea marcar todos los elementos de esta cola como leídos.",
      queueDashboard: "PANEL DE RSS",
      queueSettings: "AJUSTES DE COLA",
      opmlUpload: "CARGA OPML",
      refreshFailedDueTo: "Actualizar falló debido a",
      noMessage: "sin mensaje",
      queueUpdated: "Cola actualizada",
      queueCreated: "Cola creada",
      nQueuesCreated: " colas creadas",
      noArticlesInThisQueue: "Ningún artículo en esta cola cumple con sus criterios. Ajuste su filtro, agregue más suscripciones o espere a que se importen más artículos.",
      unreadCount: '{n} artículos no leídos',
      readCount: '{n} leer artículos',
      publishedCount: '{n} artículos publicados',
      totalCount: '{n} artículos',
      nTotalArticlesInQueue: '{n} Total de artículos en esta cola',
      queueCardView: 'Vista de tarjeta de cola',
      subscriptionListView: 'Vista de lista de suscripciones',
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
      enableAccountAlertsNotifications:
        "Habilite esta opción para recibir alertas de cuenta y notificaciones de mantenimiento.",
      enableProductNotifications:
        "Habilite esta opción para recibir correos electrónicos ocasionales sobre notificaciones de producción y nuevas funciones.",
      enableSelectedNotifications: "Habilitar notificaciones seleccionadas",
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
      loadingProgress: 'loadingProgress',
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
      whatIsFeedGears: "A modern, customizable, feed reader.",
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
      // demo 
      filterScreenshot: 'Queue filter screenshot',
      listLayoutsScreenshot: 'List layout screenshot',
      cardLayoutsScreenshot: 'Card layout screenshot',
      tableLayoutsScreenshot: 'Table layout screenshot',
      opmlUploadScreenshot: 'OPML upload screenshot',
      comingSoon: 'Coming soon!',
      // demo (api access) 
      apiAccess: 'API Access', 
      // demo (enhanced filtering) 
      enhancedFiltering: 'Enhanced Filtering and Searching Using LunrJS',
      enhancedFiltering_detail1: 'Apply filters and search within an article queue to focus your reading options based on your preferences or specific topics of interest.',
      enhancedFiltering_detail2: 'Easily locate articles using a variety of data points, saving time and streamlining your reading experience.  FeedGears search capabilities are backed by lunrjs.',
      // demo (about LS) 
      aboutLS_detail1: '', // TODO: finish this 
      // demo (feed dashboard)
      feedDashboard: 'Feed Dashboard', 
      feedDashboard_detail1: 'The feed dashboard shows summary information about each article queue.  Each dashboard card is configurable; you can add and remove details and action buttons according to your needs.',
      feedDashboard_detail2: 'By default, FeedGears shows the number of unread items, number of \'starred\' items, and the most recently published or updated article across all subscriptions in a queue.  The dashboard card also gives quick access to manage subscriptions, and get at-a-glance details about each feed in a queue: ',
      dashboardCardScreenshot: 'Queue dashboard card screenshot',
      queueSettingsScreenshot: 'Queue settings screenshot',
      // demo (layout options)
      layoutOptions: 'Layouts and Themes',
      layoutOptions_detail1: 'Choose from three reading layouts: tabular, list, or card views. The list view offers a streamlined presentation, allowing you to scroll through articles. The card view displays featured images and snippets for a more engaging reading experience. The tabular view provides a structured format, useful for a quick overview of headlines.',
      layoutOptions_detail2: 'Light and dark themes are available to reduce eye strain in low-light environments.',
      // demo (misc) 
      aboutFeedGears: 'About FeedGears', 
      accessible: 'Accessible', 
      accessible_detail1: 'Accessibility is a top priority. We are committed to ensuring an inclusive experience for all users of FeedGears. To achieve this, we utilize vue-announcer, a tool that makes important messages accessible to screen readers and other assistive technologies. By leveraging vue-announcer, we ensure that everyone can access the information they need seamlessly.',
      accessible_detail2: 'Moreover, we strive to meet the Web Content Accessibility Guidelines (WCAG) compliance standards. WCAG provides a set of guidelines to make digital content more accessible to people with disabilities. By adhering to these guidelines, we ensure that FeedGears is designed and developed with accessibility in mind, providing an optimal experience for all users.',
      mobileOptimized: 'Mobile Optimized',
      mobileOptimized_detail1: 'FeedGears has a mobile-optimized and responsive interface, designed with practicality in mind. Our UI ensures a smooth and consistent experience across different devices, including smartphones and tablets.',
      mobileOptimized_detail2: 'The responsive design principles of Vuetify allow our interface to adapt seamlessly to various screen sizes. Whether you\'re using a smaller mobile device or a larger tablet, the functionality and visual presentation remain consistent. This means you can enjoy the same features and user-friendly interface, regardless of the device you choose to use.',
      mobileOptimized_detail3: 'We\'ve carefully designed our interface to be intuitive and efficient on mobile devices. Navigating through articles, exploring categories, and customizing your reading preferences is easy and convenient. The layout and controls are optimized for touch interaction, ensuring a seamless experience on your mobile device.',
      secure: 'Secure',
      secure_detail1: 'One of our key privacy features is the secure image proxy. With this feature, all images within the RSS feeds are routed through our secure server before being displayed. This helps prevent any potential privacy risks associated with loading external images directly. By proxying the images, we can analyze and sanitize them, reducing the likelihood of malicious or unwanted content reaching your device.',
      secure_detail2: 'Additionally, we implement a sensible Content Security Policy (CSP) to safeguard against cross-site scripting (XSS) attacks and other potential security vulnerabilities. The CSP allows us to define trusted sources for various types of content. By enforcing these policies, we mitigate the risks associated with unauthorized code execution and unauthorized data access.',
      secure_detail3: 'Your privacy and security are of utmost importance to us. By utilizing a secure image proxy and implementing a sensible Content Security Policy, we aim to provide you with a worry-free browsing experience. Enjoy peace of mind as you explore your RSS feeds, knowing that we have taken proactive steps to protect your privacy and ensure the integrity of your data.',
      localized: 'Localized',
      localized_detail1: 'FeedGears is presently available in English and Spanish.  Adding support for additional languages is our on short-term roadmap.',
      freeAsInBeer: 'Free As In Beer',
      freeAsInBeer_detail1: 'Lost Sidewalk Software embraces the principles of free and open source software (FOSS) for all of our products. All our source code is freely available on GitHub and covered by the GNU General Public License version 3 (GPLv3). This means that anyone can access, study, modify, and distribute our software.',
      freeAsInBeer_detail2: 'We welcome developers and enthusiasts to join our community and contribute to the project. Whether it\'s through code contributions, bug fixes, feature suggestions, or documentation improvements, we value and appreciate all forms of involvement. Together, we can make the FeedGears platform even better and meet the evolving needs of our users.',
      freeAsInBeer_detail3: 'In the spirit of FOSS, we believe in the freedom to use, examine, modify, and redistribute software. Our goal is to foster collaboration, knowledge sharing, and innovation. We invite you to join our journey, where we aim to build an active and supportive community of developers, contributors, and users. Your contributions, regardless of their size, are highly valued and instrumental in shaping the future of FeedGears. Let\'s celebrate the power of FOSS and work together to create a better and more inclusive experience for all.',
      selfHostable: 'Self-Hostable / Pre-Built Containers',
      selfHostable_detail1: 'You can run FeedGears in your preferred environment. Our pre-built containers and compatible with various OCI-compliant runtimes such as Docker and Podman. This gives you the freedom to deploy and manage FeedGears according to your specific requirements.',
      selfHostable_detail2: 'Self-hosting allows you to keep your data within your own environment, offering you full control over the entire RSS aggration process. You decide to run it on your local machine, private server, or within your containerized infrastructure.',
      // demo (opml) 
      opmlSupport: 'OPML Support',
      opmlSupport_detail1: 'FeedGears supports OPML import/export, making it easy to migrate your RSS subscriptions. Import feeds from OPML files produced by other readers, and consolidate multiple sources. Export your feeds, queue structures, and metadata as OPML files for backups or sharing with others.', 
      opmlSupport_detail2: 'OPML ensures compatibility and interoperability with other RSS readers.',
      // demo (reading experience)
      readingExperience: 'Streamlined Reading Experience', 
      readingExperience_detail1: 'The FeedGears article view integrates a robust media player, allowing you to conveniently view media content directly within the application.',
      readingExperience_detail2: 'Share articles effortlessly through popular platforms like Twitter, LinkedIn, Facebook, Telegram, and Blogger.',
      readingExperience_detail3: 'Filter articles by their RSS categories for quick navigation.',
      textArticleScreenshot: 'Text/HTML Article',
      podcastAudioScreenshot: 'Podcast Audio',
      youtubeVideoScreenshot: 'Youtube Video',
      imageArticleScreenshot: 'Article with Images',
      // demo (simplified organization)
      simplifiedOrganization: 'Simplified Organization',
      simplifiedOrganization_detail1: 'With FeedGears article queue system, you can easily organize your RSS feed subscriptions into topical groups. You can create queues for different topics of interest, such as gaming, technology, or sports, allowing you to stay focused and access articles from multiple sources in one place.',
      simplifiedOrganization_detail2: 'By importing articles from all the feeds in a queue, FeedGears creates a unified collection of articles. This means you don\'t have to navigate through multiple individual feeds or switch between different sources manually. You can enjoy a seamless reading experience with all relevant articles conveniently accessible in a single queue.',
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
      // buttons
      update: "Update",
      save: "Save",
      // queue config panel
      queueProperties: "Queue Properties",
      rssFeedDiscovery: "RSS Feed Discovery",
      configuringQueue: "Configuring queue: {name}",
      // queue properties
      createANewQueue: "Create a new queue",
      createANewQueueHere: "Create a new queue here.  Queues are used to group and organize articles from related feed subscriptions.  Articles in the same queue are read, indexed, and filtered together.  Similarly, articles in the same queue that are 'starred' are published to a new queue-specific feed, which is available in multiple formats.  Use this panel to create a new queue, define its basic properties, and configure settings related to publishing starred articles.  Once a queue is created, you can add subscriptions to import articles.",
      updateQueueSettings: "UPDATE QUEUE SETTINGS",
      updateQueueSettingsHere: "Update queue settings here.  Queues are used to group and organize articles from related feed subscriptions.  Articles in the same queue are read, indexed, and filtered together.  Similarly, articles in the same queue that are 'starred' are published to a new queue-specific feed, which is available in multiple formats.  Use this panel to change basic queue properties, and configure settings related to publishing starred articles.",
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
      yourSubscriptions: "YOUR SUBSCRIPTIONS",
      manageYourSubscriptionsHere: "Manage your subscriptions here.  View the entire history of our interaction with this by viewing RSS Feed Metrics.  You can also use this panel to configure authentication, and unsubscribe from a feed.  Please note that articles are purged as needed, regardless of subscription status.  You may still see articles in your queue even after you unsubscribe from a feed here.",
      addANewSubscription: "ADD A NEW SUBSCRIPTION",
      addANewSubscriptionHere: "Add a new subscription here.  Enter a valid URL.  We will attempt to resolve the location of the RSS/ATOM artifact at the location you specify.",
      feedUrl: "Feed URL",
      credentialsUseMessage:
        "* The following credentials will be supplied if this feed requests authentication.",
      discovery: "Discovery",
      auth: "Auth",
      unsubscribe: "Unsubscribe",
      subscriptionAdded: "Subscription added",
      subscriptionUpdated: "Subscription updated",
      subscriptionDeleted: "Subscription deleted",
      subscriptionMetrics: "RSS feed metrics",
      importedPersistedAndArchived: "Imported {importCt} articles.  Saved {persistCt} articles.  Archived {archiveCt} articles due to age.",
      importedAndPersisted: "Imported {importCt} articles.  Saved {persistCt} articles.",
      importedAndArchived: "Imported {importCt} articles.  Archived {archiveCt} articles due to age.",
      importedNArticles: "Imported {n} articles (nothing new).",
      timestamp: "Timestamp",
      message: "Message",
      httpStatusLabel: "HTTP Status",
      httpRedirect: "HTTP Redirect Status",
      error: "Error",
      updateAuth: "Update Credentials",
      lastImportedAt: "Last imported at: {timestamp}",
      // rss feed info
      authorColon: "Author:",
      lastPublishedColon: "Last published:",
      managingEditorColon: "Managing editor:",
      webmasterColon: "Webmaster:",
      httpStatusCode: "HTTP status code",
      redirectHttpStatusCode: "Redirect HTTP status code",
      feedAlsoAvailableInHttps: "This feed is also available in HTTPS.",
      recommendedFeeds: "Similar feeds",
      // post feed filter help
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
      configureSelectedQueue: "Configure the selected queue",
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
      tableLayout: "Switch to table layout",
      refreshQueues: "Refresh queues",
      refreshForLatest: "Refresh this queue for new articles",
      markQueueAsRead: "Mark this queue as read",
      toggleSortOrder: "Toggle sort direction",
      toggleFilterPills: "Toggle filter pills",
      allSubscriptions: "all subscriptions",
      all: "all",
      unread: "UNREAD",
      readLater: "READ-LATER",
      read: "READ",
      starred: "STARRED",
      clear: "CLEAR",
      toggleUnread: 'toggleUnread',
      toggleRead: 'toggleRead',
      toggleReadLater: 'toggleReadLater',
      toggleStarred: 'toggleStarred',
      // iTunes
      iTunesTitle: "TITLE: {title}",
      iTunesSubTitle: "SUBTITLE: {subTitle}",
      iTunesAuthor: "AUTHOR: {author}",
      iTunesEpisode: "EPISODE: {episode}",
      iTunesEpisodeType: "EPISODE TYPE: {episodeType}",
      iTunesDuration: "DURATION: {duration}",
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
      uploadOpmlHere: 'Use this screen to upload an OPML file containing information about your feed subscriptions from another platform.',
      createQueuesFromOPML: "Upload OPML to create queues",
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
      toggleDashboard: 'Show/hide dashboard',
      thisIsYourQueueDashboard: "This is your queue dashboard.  The dashboard shows summary statistics about each queue, such as the number of unread items across a group of subscriptions.  Click on a queue card to view articles in that queue.  Use the queue card buttons add, manage, subscribe, and unsubscribe to feeds.  Press ESC to hide this menu.",
      // queue select button
      showMoreInfo: "Show details",
      hideMoreInfo: "Hide details",
      addSubscriptions: "Add subscriptions",
      manageSubscriptions: "Manage subscriptions ({ct})",
      subscriptions: "SUBSCRIPTIONS",
      publications: "PUBLICATIONS",
      recentArticles: "RECENT ARTICLES",
      zeroSubscriptions: "0 subscriptions",
      importerRanAt: "Importer ran at {importTimestamp}",
      nNewArticlesSaved: "{n} new articles saved",
      nArticlesArchived: "{n} articles archived",
      httpStatus: "HTTP {httpStatusCode} ({httpStatusMessage})",
      redirectedTo:
        "Redirected to {redirectFeedUrl} HTTP {redirectHttpStatusCode} ({redirectHttpStatusMessage})",
      metricsNotYetAvailable: "Metrics are not yet available for this feed.",
      confirmDeleteQueue:
        "Please confirm that you want to delete this queue. This action is irreversible.",
      confirmMarkQueueAsRead:
        "Please confirm that you want to mark all items in this queue as read.",
      queueDashboard: "FEED DASHBOARD",
      queueSettings: "QUEUE SETTINGS",
      opmlUpload: "OPML UPLOAD",
      refreshFailedDueTo: "Refresh failed due to",
      noMessage: "no message",
      queueUpdated:
        "Queue updated.  We're sorting out your subscriptions in the background.  This process may take several minutes.",
      queueCreated:
        "Queue created.  We're sorting out your new subscriptions in the background.  This process may take several minutes.",
      nQueuesCreated:
        " queues created.  We're sorting out your new subscriptions in the background.  This process may take several minutes.",
      noArticlesInThisQueue: "There's nothing here!  Adjust your filter, add more subscriptions, or wait for more articles to be imported.",
      unreadCount: '{n} unread articles',
      readCount: '{n} read articles',
      publishedCount: '{n} published articles',
      totalCount: '{n} articles',
      nTotalArticlesInQueue: '{n} Total articles in this queue',
      queueCardView: 'Queue card view',
      subscriptionListView: 'Subscription list view',
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
      contentsNofM: "CONTENTS ({n}/{m})",
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
      enableAccountAlertsNotifications:
        "Enable this option to receive account alerts and maintenance notifications.",
      enableProductNotifications:
        "Enable this option to receive occasional emails about production notifications and new features.",
      enableSelectedNotifications: "Enable Selected Notifications",
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
import colors from 'vuetify/lib/util/colors';
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const defaultTheme = 'dark';

let preferredTheme = localStorage.getItem('theme');

const vuetify = createVuetify({
  theme: {
    defaultTheme: preferredTheme ? preferredTheme : defaultTheme,
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.blue.darken3,
          secondary: colors.green.lighten1, 
          surface: colors.grey.lighten5,
          accent: colors.blue.lighten5,
        }
      },
      dark: {
        dark: true, 
        colors: {
          primary: colors.purple.lighten2,
          secondary: colors.green.darken1, 
          surface: colors.grey.darken4,
          accent: colors.purple.lighten4,
        }
      }
    }
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

// Auth Service 
const { auth, isAuthenticated } = useAuthService();

// Pinia 
const pinia = createPinia();

// Create and mount the app 
createApp(App, {})
  .provide("auth", auth)
  .provide("isAuthenticated", isAuthenticated)
  .use(pinia)
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
  .use(VueDOMPurifyHTML)
  .mount("#app");
