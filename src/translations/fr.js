const fr = {
  // console log 
  consoleLog: "CONSOLE LOG",
  consoleLogDetails: "Further details are available in your browser console.",
  // generic
  trueStr: "vrai",
  falseStr: "faux",
  somethingHorribleHappened:
    "Quelque chose d'horrible s'est produit et nous ne savons pas exactement quoi ! Veuillez réessayer dans quelques instants.",
  requestTimedOut:
    "La requête a expiré, veuillez réessayer dans quelques instants.",
  privacyPolicy: "Politique de confidentialité",
  cancel: "Annuler",
  filter: "Filtrer",
  first: "Premier",
  previous: "Précédent",
  next: "Suivant",
  last: "Dernier",
  username: "Nom d'utilisateur",
  emailAddress: "Email Address",
  password: "Mot de passe",
  submit: "Soumettre",
  subscribe: "S'abonner",
  subscribed: "Abonné !",
  inDevelopment:
    "Désolé, cette section de Newsgears n'est pas encore tout à fait prête. Revenez dans quelques jours !",
  loadingProgress: "chargement en cours",
  cardLayout: "Passer à la disposition en cartes",
  listLayout: "Passer à la disposition en liste",
  tableLayout: "Passer à la disposition en tableau",
  postTitle: "Title",
  feedTitle: "Feed",
  postTimestamp: "Timestamp",
  actions: "Actions",
  httpStatus: "HTTP {httpStatusCode} ({httpStatusMessage})",
  redirectedTo:
    "Redirigé vers {redirectFeedUrl} HTTP {redirectHttpStatusCode} ({redirectHttpStatusMessage})",
  unreadCount: '{n} articles non lus',
  readCount: '{n} articles lus',
  totalCount: '{n} articles',
  unread: "UNREAD",
  read: "READ",
  readLater: "LATER",
  htmlNotShownHere: '(HTML not shown here)',
  noPostTitle: '(This post is untitled)',
  noPublishTimestamp: '(No timestamp)',
  noPostDescription: '(No post description)',
  hasPostContents: 'CONTENTS ({ct})',
  hasPostMedia: 'MEDIA',
  hasPostITunes: 'ITUNES',
  hasEnclosures: 'ENCLOSURES ({ct})',
  // auth
  loginToNewsgears: "Connexion à Newsgears",
  accountRecovery: "Récupération de compte",
  passwordReset: "Réinitialisation du mot de passe",
  accountRegistration: "Inscription au compte",
  alreadyHaveAnAccount: "Vous avez déjà un compte ? Connectez-vous ici.",
  accountRecoveryHere: "Besoin d'aide pour vous connecter ?",
  registerHere: "Newsgears est gratuit. Créez un compte ici.",
  unableToCompleteYourRequest:
    "Nous n'avons pas pu finaliser votre demande. Veuillez essayer de vous connecter avec une autre méthode.",
  usernameAndPasswordAreRequired: "Le nom d'utilisateur et le mot de passe sont requis.",
  passwordIsRequired: "Le mot de passe est requis.",
  usernameIsRequired: "Le nom d'utilisateur est requis.",
  signinWithGoogle: "Se connecter avec Google",
  pwResetRequestMessage:
    "Saisissez votre nom d'utilisateur et votre adresse e-mail. Nous vous enverrons un lien de réinitialisation de mot de passe à votre adresse e-mail vérifiée.",
  checkEmailForFurther: "Vérifiez votre e-mail pour obtenir de plus amples instructions.",
  newPassword: "Nouveau mot de passe",
  confirmNewPassword: "Confirmez le nouveau mot de passe",
  enterAndConfirmNewPw: "Entrez et confirmez votre nouveau mot de passe.",
  pwUpdated: "Mot de passe mis à jour.",
  registrationRequirements:
    "Le nom d'utilisateur, l'adresse e-mail et le mot de passe sont requis pour s'inscrire.",
  // landing
  newsgearsRssLogo: "Newsgears RSS",
  createAnAccount: "Créer un compte",
  whatIsNewsgears: "Un lecteur de flux moderne et personnalisable.",
  whyIsNewsgearsFree: "Gratuit pour toujours car nous aimons les flux RSS.",
  devBlog: "Blog de développement",
  docs: "Docs",
  email: "E-mail",
  twitter: "Twitter",
  github: "Github",
  twitch: "Twitch",
  discord: "Discord",
  copyright: "COPYRIGHT",
  contactUsWithQuestionsViaEmail:
    "Contactez Lost Sidewalk Software par e-mail pour toute question.",
  // demo
  filterScreenshot: "Capture d'écran du filtre de file d'attente",
  listLayoutsScreenshot: "Capture d'écran de la disposition en liste",
  cardLayoutsScreenshot: "Capture d'écran de la disposition en cartes",
  tableLayoutsScreenshot: "Capture d'écran de la disposition en tableau",
  opmlUploadScreenshot: "Capture d'écran de l'importation d'OPML",
  comingSoon: "Bientôt disponible !",
  // demo (enhanced filtering) 
  enhancedFiltering: "Filtrage amélioré et recherche avec LunrJS",
  enhancedFiltering_detail1: "Appliquez des filtres et effectuez des recherches dans une file d'attente d'articles pour vous concentrer sur vos options de lecture en fonction de vos préférences ou de sujets spécifiques qui vous intéressent.",
  enhancedFiltering_detail2: "Localisez facilement des articles en utilisant divers points de données, gagnant ainsi du temps et simplifiant votre expérience de lecture. Les capacités de recherche de Newsgears sont soutenues par LunrJS.",
  // demo (feed dashboard)
  feedDashboard: "Tableau de bord des flux",
  feedDashboard_detail1: "Le tableau de bord des flux affiche des informations résumées sur chaque file d'attente d'articles. Chaque carte du tableau de bord est configurable ; vous pouvez ajouter et supprimer des détails et des boutons d'action selon vos besoins.",
  feedDashboard_detail2: "Newsgears affiche le nombre d'éléments non lus et l'article le plus récemment publié ou mis à jour pour tous les abonnements dans une file d'attente. La carte du tableau de bord donne également un accès rapide pour gérer les abonnements et obtenir en un coup d'œil des détails sur chaque flux dans une file d'attente :",
  dashboardCardScreenshot: "Capture d'écran de la carte du tableau de bord de la file d'attente",
  queueSettingsScreenshot: "Capture d'écran des paramètres de la file d'attente",
  // demo (layout options)
  layoutOptions: "Dispositions et thèmes",
  layoutOptions_detail1: "Choisissez parmi trois dispositions de lecture : vue tabulaire, vue en liste ou vue en cartes. La vue en liste offre une présentation simplifiée, vous permettant de faire défiler les articles. La vue en cartes affiche des images en vedette et des extraits pour une expérience de lecture plus engageante. La vue tabulaire offre un format structuré, utile pour un aperçu rapide des titres.",
  layoutOptions_detail2: "Des thèmes clairs et sombres sont disponibles pour réduire la fatigue oculaire dans les environnements peu éclairés.",
  // demo (misc) 
  aboutNewsgears: "À propos de Newsgears",
  accessible: "Accessible",
  accessible_detail1: "L'accessibilité est une priorité absolue. Nous nous engageons à garantir une expérience inclusive pour tous les utilisateurs de Newsgears. Pour ce faire, nous utilisons vue-announcer, un outil qui rend les messages importants accessibles aux lecteurs d'écran et aux autres technologies d'assistance. En tirant parti de vue-announcer, nous nous assurons que tout le monde peut accéder aux informations dont il a besoin de manière transparente.",
  accessible_detail2: "De plus, nous nous efforçons de respecter les normes de conformité aux directives pour l'accessibilité des contenus web (WCAG). Les WCAG fournissent.",
  mobileOptimized: 'Optimisé pour mobile',
  mobileOptimized_detail1: 'Newsgears dispose d\'une interface optimisée pour les mobiles et responsive, conçue dans un souci de praticité. Notre interface utilisateur garantit une expérience fluide et cohérente sur différents appareils, y compris les smartphones et les tablettes.',
  mobileOptimized_detail2: 'Les principes de conception adaptative de Vuetify permettent à notre interface de s\'adapter parfaitement à différentes tailles d\'écran. Que vous utilisiez un petit appareil mobile ou une grande tablette, la fonctionnalité et la présentation visuelle restent cohérentes. Cela signifie que vous pouvez profiter des mêmes fonctionnalités et de l\'interface conviviale, quel que soit l\'appareil que vous choisissez d\'utiliser.',
  mobileOptimized_detail3: 'Nous avons soigneusement conçu notre interface pour qu\'elle soit intuitive et efficace sur les appareils mobiles. Naviguer à travers les articles, explorer les catégories et personnaliser vos préférences de lecture est facile et pratique. La mise en page et les contrôles sont optimisés pour l\'interaction tactile, garantissant une expérience fluide sur votre appareil mobile.',
  secure: 'Sécurisé',
  secure_detail1: 'Une de nos fonctionnalités clés en matière de confidentialité est le proxy d\'image sécurisé. Grâce à cette fonctionnalité, toutes les images des flux RSS passent par notre serveur sécurisé avant d\'être affichées. Cela contribue à prévenir tout risque potentiel pour la confidentialité lié au chargement direct des images externes. En passant par un proxy pour les images, nous pouvons les analyser et les désinfecter, réduisant ainsi la probabilité de contenu malveillant ou indésirable atteignant votre appareil.',
  secure_detail2: 'De plus, nous mettons en œuvre une politique de sécurité des contenus (Content Security Policy - CSP) sensée pour se prémunir contre les attaques de type cross-site scripting (XSS) et autres vulnérabilités de sécurité potentielles. Le CSP nous permet de définir des sources de confiance pour différents types de contenus. En appliquant ces politiques, nous atténuons les risques liés à l\'exécution de code non autorisé et à l\'accès non autorisé aux données.',
  secure_detail3: 'Votre vie privée et votre sécurité sont d\'une importance capitale pour nous. En utilisant un proxy d\'image sécurisé et en appliquant une politique de sécurité des contenus sensée, nous visons à vous offrir une expérience de navigation sans souci. Profitez de la tranquillité d\'esprit lorsque vous explorez vos flux RSS, en sachant que nous avons pris des mesures proactives pour protéger votre vie privée et garantir l\'intégrité de vos données.',
  localized: 'Localisé',
  localized_detail1: 'Newsgears est actuellement disponible en anglais, espagnol et français. L\'ajout de la prise en charge de langues supplémentaires est notre feuille de route à court terme.',
  freeAsInBeer: 'Gratuit comme dans une bière',
  freeAsInBeer_detail1: 'Lost Sidewalk Software adopte les principes du logiciel libre et open source (FOSS) pour tous nos produits. Tout notre code source est librement disponible sur GitHub et est couvert par la licence publique générale GNU version 3 (GPLv3). Cela signifie que n\'importe qui peut accéder, étudier, modifier et distribuer notre logiciel.',
  freeAsInBeer_detail2: 'Nous invitons les développeurs et les passionnés à rejoindre notre communauté et à contribuer au projet. Que ce soit par des contributions de code, des corrections de bugs, des suggestions de fonctionnalités ou des améliorations de documentation, nous apprécions toutes les formes d\'implication. Ensemble, nous pouvons améliorer la plateforme Newsgears et répondre aux besoins évolutifs de nos utilisateurs.',
  freeAsInBeer_detail3: 'Dans l\'esprit du logiciel libre et open source, nous croyons en la liberté d\'utiliser, d\'examiner, de modifier et de redistribuer les logiciels. Notre objectif est de favoriser la collaboration, le partage des connaissances et l\'innovation. Nous vous invitons à vous joindre à notre aventure, où nous visons à construire une communauté active et solidaire de développeurs, contributeurs et utilisateurs. Vos contributions, quelle que soit leur taille, sont hautement valorisées et essentielles pour façonner l\'avenir de Newsgears. Célébrons le pouvoir du logiciel libre et travaillons ensemble pour créer une expérience meilleure et plus inclusive pour tous.',
  selfHostable: 'Auto-hébergeable / Conteneurs pré-construits',
  selfHostable_detail1: 'Vous pouvez exécuter Newsgears dans votre environnement préféré. Nos conteneurs pré-construits sont compatibles avec différentes plateformes OCI telles que Docker et Podman. Cela vous permet de déployer et de gérer Newsgears selon vos besoins spécifiques.',
  selfHostable_detail2: "L'auto-hébergement vous permet de conserver vos données dans votre propre environnement, vous offrant un contrôle total sur l'ensemble du processus d'agrégation des flux RSS. Vous pouvez choisir de l'exécuter sur votre machine locale, votre serveur privé ou au sein de votre infrastructure conteneurisée.",
  // demo (opml)
  opmlSupport: 'Prise en charge d\'OPML',
  opmlSupport_detail1: 'Newsgears prend en charge l\'importation/exportation d\'OPML, ce qui facilite la migration de vos abonnements RSS. Importez des flux à partir de fichiers OPML produits par d\'autres lecteurs et consolidez plusieurs sources. Exportez vos flux, structures de files d\'attente et métadonnées sous forme de fichiers OPML pour les sauvegardes ou le partage avec d\'autres personnes.',
  opmlSupport_detail2: 'OPML garantit la compatibilité et l\'interopérabilité avec d\'autres lecteurs RSS.',
  // demo (reading experience)
  readingExperience: 'Expérience de lecture simplifiée',
  readingExperience_detail1: 'La vue des articles de Newsgears intègre un lecteur multimédia robuste, vous permettant de visualiser facilement le contenu multimédia directement dans l\'application.',
  readingExperience_detail2: 'Partagez des articles facilement sur des plateformes populaires telles que Twitter, LinkedIn, Facebook, Telegram et Blogger.',
  readingExperience_detail3: 'Filtrez les articles par catégories RSS pour une navigation rapide.',
  textArticleScreenshot: 'Article en texte/HTML',
  podcastAudioScreenshot: 'Podcast audio',
  youtubeVideoScreenshot: 'Vidéo YouTube',
  imageArticleScreenshot: 'Article avec images',
  // demo (simplified organization)
  simplifiedOrganization: 'Organisation simplifiée',
  simplifiedOrganization_detail1: 'Avec le système de file d\'attente d\'articles de Newsgears, vous pouvez facilement organiser vos abonnements aux flux RSS en groupes thématiques. Vous pouvez créer des files d\'attente pour différents sujets d\'intérêt, tels que les jeux, la technologie ou les sports, ce qui vous permet de rester concentré et d\'accéder aux articles de plusieurs sources en un seul endroit.',
  simplifiedOrganization_detail2: 'En important des articles de tous les flux d\'une file d\'attente, Newsgears crée une collection unifiée d\'articles. Cela signifie que vous n\'avez pas à naviguer à travers plusieurs flux individuels ou à basculer manuellement entre différentes sources. Vous pouvez profiter d\'une expérience de lecture fluide avec tous les articles pertinents facilement accessibles dans une seule file d\'attente.',
  // faq 
  whatIsRSS: "Qu'est-ce que RSS/ATOM ?",
  rssIs:
    "RSS (Really Simple Syndication) est un format de flux web utilisé pour publier du contenu fréquemment mis à jour, tels que des billets de blog, des titres d'actualités, de l'audio et de la vidéo. Il a été introduit pour la première fois par Netscape en 1999 en tant que format basé sur XML permettant de diffuser du contenu à partir de sites d'actualités et de blogs.",
  rssAllows:
    "RSS permet aux utilisateurs de s'abonner à des flux de contenu à l'aide d'un lecteur de flux web ou d'un agrégateur, qui peut récupérer automatiquement et afficher les nouveaux contenus à partir de plusieurs sources dans un seul emplacement. Cela facilite la mise à jour des utilisateurs sur leurs sites web préférés et les créateurs de contenu sans avoir à vérifier manuellement chaque site pour les mises à jour.",
  newsgearsIs: "Newsgears est à la fois un agrégateur RSS et un lecteur RSS.",
  overTheYears:
    "Au fil des ans, RSS a évolué et plusieurs versions du protocole ont été publiées, notamment :",
  eachVersionAdded:
    "Chaque version a ajouté de nouvelles fonctionnalités, telles que la prise en charge de contenu multimédia et de pièces jointes.",
  atomOTOH:
    "Atom, en revanche, est un format de flux web similaire qui a été introduit en 2003 comme une alternative à RSS. Comme RSS, Atom est un format basé sur XML qui permet aux éditeurs de diffuser du contenu tel que des billets de blog, des articles d'actualités et des podcasts.",
  keyDifferences:
    "Une des principales différences entre RSS et Atom est qu'Atom est un format standardisé, tandis que RSS a plusieurs versions et variations. De plus, Atom est conçu pour être plus extensible et flexible que RSS, ce qui permet une personnalisation plus facile et la prise en charge de métadonnées supplémentaires.",
  overallRoles:
    "Dans l'ensemble, RSS et Atom ont joué un rôle important dans l'évolution de la syndication de contenu web et ont contribué à faciliter l'accès et la consommation du contenu qui intéresse les utilisateurs.",
  listOfLinksToRSSSpecs: 'Liste de liens vers les spécifications RSS',
  listOfLinksOfInterest: 'Liste de liens utiles et/ou intéressants sur RSS',
  // video panel 
  rssMadeEasy: "RSS facilité",
  // confirmation dialog 
  pleaseConfirm: "Veuillez confirmer",
  confirm: "Confirmer",
  // go back 
  goBack: "Retour",
  // control panel 
  login: "Connexion",
  logout: "Déconnexion",
  settings: "Paramètres",
  help: "Aide",
  switchMode: "Changer le mode d'affichage",
  createNewQueue: "Nouvelle file d'attente",
  uploadOPML: "Importer un fichier OPML",
  pleaseEnableNotifications: "Veuillez activer les notifications pour recevoir des messages de Newsgears.",
  showFilterHelp: "Show filter help",
  // buttons 
  update: "Mettre à jour",
  save: "Enregistrer",
  dismiss: "Ignorer",
  // queue config panel 
  configuringQueue: "Configuration de la file d'attente : {name}",
  addSubscriptions: "Add subscriptions",
  manageSubscriptions: "Manage subscriptions ({ct})",
  alreadySubscribd: "(Already subscribed)",
  queueProperties: "Propriétés de la file d'attente",
  // queue properties 
  createANewQueue: "Créer une nouvelle file d'attente",
  createANewQueueHere: "Créez une nouvelle file d'attente ici. Les files d'attente sont utilisées pour regrouper et organiser les articles issus d'abonnements aux flux associés. Les articles de la même file d'attente sont lus, indexés et filtrés ensemble. Utilisez ce panneau pour créer une nouvelle file d'attente, définir ses propriétés de base. Une fois une file d'attente créée, vous pouvez ajouter des abonnements pour importer des articles.",
  updateQueueSettings: "METTRE À JOUR LES PARAMÈTRES DE LA FILE D'ATTENTE",
  updateQueueSettingsHere: "Mettez à jour les paramètres de la file d'attente ici. Les files d'attente sont utilisées pour regrouper et organiser les articles issus d'abonnements aux flux associés. Les articles de la même file d'attente sont lus, indexés et filtrés ensemble. Utilisez ce panneau pour modifier les propriétés de base de la file d'attente.",
  queueIdentifier: "Identifiant de la file d'attente",
  queueIdentifierHint: "Un nom court et unique pour cette file d'attente. Cette valeur sera générée si elle n'est pas fournie. Cette valeur apparaîtra dans les messages journaux et ailleurs pour faire référence à cette file d'attente.",
  queueTitle: "Titre de la file d'attente",
  queueTitleHint: "Un nom descriptif facultatif pour cette file d'attente. Cette valeur est affichée dans l'interface utilisateur de Newsgears pour faire référence à cette file d'attente.",
  queueDescription: "Description de la file d'attente",
  queueDescriptionHint: "Une description détaillée facultative de cette file d'attente, affichée sur le tableau de bord de la file d'attente.",
  // subscription config
  yourSubscriptions: "VOS ABONNEMENTS",
  manageYourSubscriptionsHere: "Gérez vos abonnements ici. Consultez l'historique complet de notre interaction avec cela en consultant les statistiques du flux RSS. Vous pouvez également utiliser ce panneau pour configurer l'authentification et vous désabonner d'un flux.",
  addANewSubscription: "AJOUTER UN NOUVEL ABONNEMENT",
  addANewSubscriptionHere: "Ajoutez un nouvel abonnement ici. Entrez une URL valide. Nous tenterons de résoudre l'emplacement de l'artefact RSS/ATOM à l'adresse que vous spécifiez.",
  feedUrl: "URL DU FLUX",
  credentialsUseMessage:
    "Les identifiants suivants seront fournis si ce flux demande une authentification.",
  discovery: "Découverte",
  auth: "Auth",
  unsubscribe: "Se désabonner",
  subscriptionAdded: "Abonnement ajouté",
  subscriptionUpdated: "Abonnement mis à jour",
  subscriptionDeleted: "Abonnement supprimé",
  subscriptionMetrics: "Statistiques du flux RSS",
  importedPersistedAndArchived: "{importCt} articles importés. {persistCt} articles enregistrés. {archiveCt} articles archivés en raison de leur ancienneté.",
  importedAndPersisted: "{importCt} articles importés. {persistCt} articles enregistrés.",
  importedAndArchived: "{importCt} articles importés. {archiveCt} articles archivés en raison de leur ancienneté.",
  importedNArticles: "Imported {n} articles (nothing new).",
  timestamp: "Horodatage",
  postStatus: "Status",
  message: "Message",
  httpStatusLabel: "Statut HTTP",
  httpRedirect: "Statut de redirection HTTP",
  error: "Erreur",
  updateAuth: "Update credentials for subscription: {subscriptionName}",
  lastImportedAt: "Dernière importation le : {timestamp}",
  // subscription info
  authorColon: "Auteur :",
  lastPublishedColon: "Dernière publication :",
  managingEditorColon: "Rédacteur en chef :",
  webmasterColon: "Webmaster :",
  httpStatusCode: "Code de statut HTTP",
  redirectHttpStatusCode: "Code de statut de redirection HTTP",
  feedAlsoAvailableInHttps: "Ce flux est également disponible en HTTPS.",
  // queue filter help
  filtering: "Filtrage",
  filteringProvides: 
    "Le filtrage offre un moyen puissant de trouver des articles spécifiques en fonction de différents champs tels que le flux, les catégories, la description, le titre, l'auteur, la date de publication, la date de mise à jour, le contenu et l'URL.",
  syntax: "Syntaxe",
  newsgearsFilterSupports: 
    "La fonction de filtrage de Newsgears prend en charge une syntaxe permettant aux utilisateurs de créer des requêtes de recherche complexes. La syntaxe de base est la suivante :",
  fieldColonValue: "champ:valeur",
  syntaxAllows: 
    "Cette syntaxe vous permet de spécifier un nom de champ suivi de deux points et de la valeur correspondante que vous souhaitez rechercher. Vous pouvez utiliser plusieurs paires champ:valeur pour créer des requêtes de recherche plus spécifiques.",
  supportedFields: "Champs pris en charge",
  feedFieldDesc: "Le nom ou l'identifiant du flux.",
  categoryFieldDesc: 
    "Les catégories ou balises associées à l'article.",
  descriptionFieldDesc: 
    "Un résumé ou une description de l'article.",
  titleFieldDesc: "Le titre de l'article.",
  authorFieldDesc: "L'auteur principal de l'article.",
  authorsFieldDesc: 
    "Une liste d'auteurs associés à l'article.",
  contributorsFieldDesc: 
    "Une liste de contributeurs à l'article.",
  publishedFieldDesc: "La date de publication de l'article.",
  updatedFieldDesc: "La date de mise à jour de l'article.",
  contentsFieldDesc: "Le contenu principal de l'article.",
  urlFieldDesc: "L'URL de l'article.",
  statusFieldDesc: "Le statut de lecture de l'article (lu, non lu, à lire ultérieurement).",
  exampleQueries: "Exemples de requêtes",
  hereAreSomeExamples: 
    "Voici quelques exemples de requêtes de recherche que vous pouvez effectuer en utilisant la fonction de filtrage de Newsgears :",
  explanation: "Explication",
  searchForArticlesWithWord: 
    'Rechercher des articles contenant le mot "technologie" dans le titre.',
  searchForArticlesPublishedBy: 
    "Rechercher des articles publiés par un auteur spécifique.",
  searchForArticlesPublishedBetween: 
    "Rechercher des articles publiés entre deux dates spécifiques.",
  searchForArticlesWithWords: 
    'Rechercher des articles contenant le mot "JavaScript" dans le contenu et "tutorial" dans le titre.',
  searchForArticlesInASpecificFeedAndCategory: 
    "Rechercher des articles dans un flux et une catégorie spécifiques.",
  advancedQueries: "Requêtes avancées",
  inAdditionTo: 
    "En plus des requêtes champ:valeur de base, Newsgears prend en charge des options de recherche avancées telles que les recherches avec des caractères génériques, les recherches approximatives et les recherches par plage.",
  // help panel
  newsgearsHelp: "Aide de Newsgears",
  globalShortcutKeys: "RACCOURCIS CLAVIER GLOBAUX",
  key: "Clé",
  action: "Action",
  configureSelectedQueue: "Configurer la file sélectionnée",
  markSelectedQueueAsRead: "Marquer la file sélectionnée comme lue",
  markRead: "Mark as read",
  markUnread: "Mark as unread",
  markReadLater: "Mark as read-later",
  deleteSelectedQueue: "Supprimer la file sélectionnée",
  addSubscriptionToSelectedQueue: "Ajouter un abonnement à la file sélectionnée",
  showUnread: "Afficher les non lus",
  hideUnread: "Hide unread",
  showReadLater: "Afficher les à lire plus tard",
  hideReadLater: "Hide read-later",
  showRead: "Afficher les lus",
  hideRead: "Hide read",
  search: "Rechercher",
  // post iTunes
  iTunesTitle: "TITRE : {title}",
  iTunesSubTitle: "SOUS-TITRE : {subTitle}",
  iTunesAuthor: "AUTEUR : {author}",
  iTunesEpisode: "ÉPISODE : {episode}",
  iTunesEpisodeType: "TYPE D'ÉPISODE : {episodeType}",
  iTunesDuration: "DURÉE : {duration}",
  explicit: "EXPLICITE",
  closedCaptioned: "Sous-titré",
  episode: "Épisode {episode}",
  episodeType: "Épisode {episodeType}",
  // post media
  media: "MÉDIA",
  // community
  nViews: "VUES",
  tags: "BALISES",
  // post media content
  medium: "Medium: {type} ({index}/{total})",
  audioChannelsColon: "CANAUX AUDIO :",
  bitRateColon: "BIT RATE :",
  durationColon: "DURÉE :",
  expressionColon: "EXPRESSION :",
  fileSizeColon: "TAILLE DU FICHIER :",
  frameRateColon: "FRÉQUENCE D'IMAGES :",
  heightColon: "HAUTEUR :",
  widthColon: "LARGEUR :",
  languageColon: "LANGUE :",
  samplingRateColon: "FRÉQUENCE D'ÉCHANTILLONNAGE :",
  // opml
  opmlUpload: "TÉLÉCHARGEMENT OPML",
  uploadOpmlHere: "Utilisez cet écran pour télécharger un fichier OPML contenant des informations sur vos abonnements à des flux provenant d'une autre plateforme.",
  createQueuesFromOPML: "Télécharger l'OPML pour créer des files",
  selectAnOpmlFile: "Sélectionner un fichier OPML",
  addAnOpmlFile: "Ajouter un fichier OPML",
  addOneOrMoreFilesToUpload: "Ajouter un ou plusieurs fichiers à télécharger",
  finalizeUpload: "Finaliser le téléchargement",
  continueToStep2: "Continuer à l'étape 2",
  clickHereWHenYourFilesAreStaged: "Cliquez ici lorsque vos fichiers sont prêts",
  opmlFiles: "Fichiers OPML",
  previewThisFile: "Aperçu de ce fichier dans une nouvelle fenêtre.",
  delete: "Supprimer",
  selectAtLeastOneFile: "Sélectionnez au moins un fichier pour continuer.",
  opmlFilesContainErrors:
    "Vos fichiers contiennent les problèmes suivants. Veuillez résoudre ces problèmes et réessayer votre téléchargement.",
  newSubscriptions: "New subscriptions",
  weWillCreateTheFollowingSubscriptions:
    "Nous créerons les files suivantes à partir de vos fichiers OPML :",
  // app bar
  toggleDashboard: "Afficher/masquer le tableau de bord",
  // queue card sheet 
  queueDashboard: "QUEUE DASHBOARD",
  thisIsYourQueueDashboard: "Ceci est votre tableau de bord des files. Le tableau de bord affiche des statistiques récapitulatives sur chaque file, telles que le nombre d'articles non lus dans un groupe d'abonnements. Cliquez sur une carte de file pour afficher les articles de cette file. Utilisez les boutons de carte de file pour ajouter, gérer, s'abonner et se désabonner des flux. Appuyez sur Échap pour masquer ce menu.",
  // queue layout
  refreshQueues: "Actualiser les files",
  // queue operations 
  refreshForLatest: "Actualiser cette file pour les nouveaux articles",
  markQueueAsRead: "Marquer cette file comme lue",
  toggleSortOrder: "Basculer l'ordre de tri",
  // queue select button
  showMoreInfo: "Afficher les détails",
  hideMoreInfo: "Masquer les détails",
  selectQueue: 'Select queue',
  // queue details
  subscriptions: "ABONNEMENTS",
  recentArticles: "ARTICLES RÉCENTS",
  subscriptionName: "Feed Name",
  importerRanAt: "L'importateur s'est exécuté à {importTimestamp}",
  nNewArticlesSaved: "{n} nouveaux articles enregistrés",
  nArticlesArchived: "{n} articles archivés",
  metricsNotYetAvailable: "Les métriques ne sont pas encore disponibles pour ce flux.",
  // home
  confirmDeleteQueue:
    "Veuillez confirmer que vous souhaitez supprimer cette file. Cette action est irréversible.",
  confirmMarkQueueAsRead:
    "Veuillez confirmer que vous souhaitez marquer tous les éléments de cette file comme lus.",
  // useQueues
  refreshFailedDueTo: "Actualisation échouée en raison de",
  noMessage: "pas de message",
  queueUpdated:
    "File mise à jour. Nous classons vos abonnements en arrière-plan. Ce processus peut prendre plusieurs minutes.",
  queueCreated:
    "File créée. Nous classons vos nouveaux abonnements en arrière-plan. Ce processus peut prendre plusieurs minutes.",
  nQueuesCreated:
    "{n} files créées. Nous classons vos nouveaux abonnements en arrière-plan. Ce processus peut prendre plusieurs minutes.",
  // queue setup 
  queueInitialSetup: "QUEUE INITIAL SETUP",
  queueInitialSetup_details: "Use this screen to add upstream news sources to your queue.",
  clickHereToAddANewSubscription: "CLICK HERE IF YOU HAVE ONE OR MORE FEED URLs",
  clickHereToAddANewSubscription_detail: "Click here to subscribe to a feed if you have the URL. Feed URLs are typically of the form 'https://' or 'rss://', though you can enter any URL and we will attempt to locate the feed.",
  clickHereToUploadOPML: "CLICK HERE IF YOU HAVE ONE OR MORE OPML FILES",
  clickHereToUploadOPML_detail: "OPML files are used by many feed aggregators as a way of represent collections of feed subscriptions. Many aggregators will allow you to export your subscriptions in the form of an OPML file, so that you can take your subscriptions with you when you migrate to another service.",
  clickHereToUploadOPML_detail1: "If you have an OPML file, click here to begin migrating your subscriptions to Newsgears using our OPML editor.",
  // queue select button
  nTotalArticlesInQueue: '{n} articles au total dans cette file',
  // post card
  showPostCategories: "Afficher les catégories de l'article",
  addCategoryToFilter: "Ajouter cette catégorie ({postCategory}) au filtre",
  showPostSharing: "Afficher les options de partage de l'article",
  shareWith_twitter: "Partager sur Twitter",
  shareWith_facebook: "Partager sur Facebook",
  shareWith_telegram: "Partager sur Telegram",
  shareWith_linkedIn: "Partager sur LinkedIn",
  shareWith_blogger: "Partager sur Blogger",
  // home
  goToNextPost: "Aller à l'article suivant",
  goToPreviousPost: "Aller à l'article précédent",
  // post card
  markPostAsUnread: "Marquer comme non lu",
  markPostAsRead: "Marquer comme lu",
  markPostAsReadLater: "Marquer comme à lire plus tard",
  unmarkPostAsReadLater: "Ne plus marquer comme à lire plus tard",
  openOriginalArticle: "Ouvrir l'article d'origine",
  description: "DESCRIPTION",
  contentsNofM: "CONTENU ({n}/{m})",
  links: "LIENS",
  postComments: "COMMENTAIRES",
  author: "AUTEUR",
  authors: "AUTEURS",
  updatedColon: "MIS À JOUR :",
  publishedColon: "PUBLIÉ :",
  contributors: "CONTRIBUTEURS",
  // post enclosures
  enclosureOfType: "ENCLOSURE ({type})",
  // settings
  accountSettings: "PARAMÈTRES DU COMPTE",
  emailAddressColon: "ADRESSE E-MAIL :",
  applyChanges: "Appliquer les modifications",
  deactivateYourAccount: "Désactiver votre compte",
  downloadYourData: "Télécharger vos données",
  permanentlyDeleteYourAccount: "Supprimer définitivement votre compte",
  sendPasswordResetEmail: "Envoyer un e-mail de réinitialisation du mot de passe",
  resetPassword: "Réinitialiser le mot de passe",
  emailNotifications: "Notifications par e-mail",
  updateNotificationPreferences: "Mettre à jour les préférences de notification",
  enableAccountAlertsNotifications:
    "Activez cette option pour recevoir des alertes de compte et des notifications de maintenance.",
  settingsUpdated: "Paramètres mis à jour",
  opmlExportDownloaded: "Export OPML téléchargé",
  // verification callback 
  thanksForVerifying:
    "Merci d'avoir vérifié ! Le statut de votre compte a été mis à jour.",
  // privacy policy 
  newsgearsPrivacyPolicy: "Politique de confidentialité de Newsgears",
  whatInformationDoWeCollect: "Quelles informations collectons-nous ?",
  whatWeCollectSummary:
    "Nous collectons des informations personnelles que vous nous fournissez.",
  whatWeCollectDetails:
    "Nous collectons des informations personnelles que vous nous fournissez volontairement lorsque vous vous inscrivez sur Newsgears, exprimez un intérêt pour obtenir des informations sur nous ou Newsgears, lorsque vous participez à des activités sur Newsgears, ou lorsque vous nous contactez.",
  whatWeCollectImportantDetails: "Nous ne traitons pas d'informations sensibles.",
  whatWeCollectFurtherDetails:
    "Toutes les informations personnelles que vous nous fournissez doivent être vraies, complètes et exactes, et vous devez nous informer de tout changement de ces informations personnelles.",
  someCollectionIsAutomatic: "Certaines informations sont collectées automatiquement",
  automaticCollectionDetails:
    "Certaines informations, telles que votre adresse IP et/ou les caractéristiques du navigateur et du dispositif, sont collectées automatiquement lorsque vous visitez Newsgears. Ces informations (système d'exploitation, préférences linguistiques, URL de référence, nom du dispositif, pays, emplacement, informations sur la manière et le moment où vous utilisez Newsgears, et autres informations techniques) ne révèlent pas votre identité spécifique (comme votre nom ou vos coordonnées), mais peuvent inclure des informations sur le dispositif et son utilisation. Ces informations sont principalement nécessaires pour assurer la sécurité et le fonctionnement de Newsgears, ainsi que pour nos analyses internes et nos rapports.",
  howDoWeProcess: "Comment traitons-nous vos informations ?",
  howDoWeProcessSummary:
    "Nous traitons vos informations pour fournir, améliorer et administrer Newsgears, communiquer avec vous, assurer la sécurité et prévenir la fraude, et respecter la loi. Nous pouvons également traiter vos informations à d'autres fins avec votre consentement.",
  socialLogins: "Connexions sociales",
  socialLoginsSummary:
    "Newsgears vous offre la possibilité de vous inscrire et de vous connecter en utilisant les détails de votre compte social tiers (comme les connexions Google ou Github). Lorsque vous choisissez de le faire, nous recevrons certaines informations de profil vous concernant de votre fournisseur de médias sociaux. Les informations de profil que nous recevons peuvent varier en fonction du fournisseur de médias sociaux concerné, mais incluront souvent votre nom, votre adresse e-mail et votre photo de profil, ainsi que d'autres informations que vous choisissez de rendre publiques sur une telle plateforme de médias sociaux.",
  socialLoginDetails: 
    "Nous utiliserons les informations que nous recevons uniquement dans les buts décrits dans cet avis de confidentialité ou qui vous sont autrement expliqués sur Newsgears. Veuillez noter que nous n'avons aucun contrôle sur les autres utilisations de vos informations personnelles par votre fournisseur de médias sociaux tiers, et nous ne sommes pas responsables de ces utilisations. Nous vous recommandons de consulter leur avis de confidentialité afin de comprendre comment ils collectent, utilisent et partagent vos informations personnelles, ainsi que la manière dont vous pouvez définir vos préférences de confidentialité sur leurs sites et applications.",
  internationalInformationTransfers: "Transferts internationaux d'informations",
  internationalInformationTransfersSummary:
    "Nous pouvons transférer, stocker et traiter vos informations dans des pays autres que le vôtre.",
  internationalInformationTransfersDetails:
    "Nos serveurs sont situés aux États-Unis. Si vous accédez à Newsgears depuis l'extérieur des États-Unis, veuillez noter que vos informations peuvent être transférées, stockées et traitées par nous dans nos installations et par celles de tiers avec lesquels nous pouvons partager vos informations personnelles, aux États-Unis et dans d'autres pays.",
  internationalInformationTransfersFurther: 
    "Si vous résidez dans l'Espace économique européen (EEE) ou au Royaume-Uni (RU), ces pays peuvent ne pas avoir de lois sur la protection des données ou d'autres lois similaires aussi exhaustives que celles de votre pays. Nous prendrons toutes les mesures nécessaires pour protéger vos informations personnelles conformément à cet avis de confidentialité et à la législation applicable.",
  whatAreYourPrivacyRights: "Quels sont vos droits en matière de confidentialité ?",
  yourPrivacyRightsSummary:
    "Vous pouvez examiner, modifier ou résilier votre compte à tout moment.",
  yourPrivacyRightsDetails: 
    "Nous ne distribuerons pas vos informations personnelles à des tiers sans votre consentement.",
  yourConsent: "Votre consentement",
  yourConsentSummary:
    "En utilisant notre site ou nos applications, vous consentez à notre politique de confidentialité.",
  doWeMakeUpdates: "Mise à jour de cette notice",
  doWeMakeUpdatesSummary:
    "Oui, nous mettrons à jour cette notice si nécessaire pour rester conforme aux lois applicables.",
  howCanYouContactUs: "Comment pouvez-vous nous contacter concernant cette notice ?",
  // aria labels 
  switchModeAriaLabel: "Passer au thème clair ou sombre",
  shareWith_twitter_ariaLabel: "Partager sur Twitter",
  shareWith_facebook_ariaLabel: "Partager sur Facebook",
  shareWith_telegram_ariaLabel: "Partager sur Telegram",
  shareWith_linkedIn_ariaLabel: "Partager sur LinkedIn",
  shareWith_blogger_ariaLabel: "Partager sur Blogger",
  // image alts 
  queuePageScreenshot: "Capture d'écran de la page de file d'attente de Newsgears",
  queueLogoImage: "Image du logo de la file d'attente",
  feedLogoImage: "Image du logo de l'alimentation",
  rssLogo: "Logo RSS",
  postThumbnailImage: "Image miniature de l'article",
  postEnclosureImage: "Image de l'enclosure de l'article",
  postITunesImage: "Image iTunes de l'article",
  postMediaContentImage: "Image du contenu multimédia de l'article",
  postMediaThumbnail: "Vignette multimédia de l'article",
  oAuth2ProfileImage: "Image du profil OAuth2",
  defaultOAuth2ProfileImage: "Image par défaut du profil OAuth2"
}

export default fr;
