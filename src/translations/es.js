const es = {
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
  cardLayout: "Cambiar a diseño de tarjeta",
  listLayout: "Cambiar a diseño de lista",
  tableLayout: "Cambiar al diseño de la tabla",
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
  feedGearsRssLogo: "FeedGears RSS",
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
  localized_detail1: 'FeedGears está actualmente disponible en inglés, español y francés. Agregar soporte para otros idiomas está en nuestro plan a corto plazo.',
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
  listOfLinksToRSSSpecs: 'Lista de enlaces a las especificaciones de RSS',
  listOfLinksOfInterest: 'Lista de enlaces útiles y/o interesantes sobre RSS',
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
  // layout
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
}

export default es;
