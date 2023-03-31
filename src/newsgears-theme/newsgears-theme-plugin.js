import { reactive } from 'vue';

const DEFAULT_LIGHT_THEME = { 
  bodybg: '#aaaaaa',
  appbg: '#dddddd',
  logocolor: '#696969', 
  logobrightcolor: '#00008b', 
  logoaccentcolor: '#d3d3d3', 
  logoshadowcolor: '#800000',
  logosubtextcolor: '#e0e0e0',
  logosubshadow: '#696969', 
  modalbodybg: '#cccccc',
  navbarshadow: '#6495ed', // cornflowerblue 
  navbarsubshadow: '#161616',
  subduedmessage: '#696969', 
  normalmessage: '#202020',
  highlightedmessage: '#6495ed', // cornflowerblue 
  buttonbg: '#dddddd',
  buttonfg: '#202020',
  buttonborder: '#202020',
  buttonhighlight: '#ffffff', 
  lightshadow: '#101010',
  darkshadow: '#202020',
  accentshadow: '#ffffff',
  sectionsubdued: '#484848',
  sectionhighlight: '#eeeeee',
  sectionbrighthighlight: '#dddddd', 
  sectionbrighterhighlight: '#dddddd', 
  sectionbordercolor: '#101010',
  sectionnegativehighlight: '#ff8080',
  fieldborder: '#202020',
  fieldborderhighlight: '#202020',
  fieldbackground: '#dddddd',
  fieldbackgroundhighlight: '#bedbf7', 
  fieldcolorhighlight: '#000000', 
  requiredind: '#ff0000', 
  starcolor: '#deb887', // burlywood 
};

const DEFAULT_DARK_THEME = { 
  bodybg: '#080808',
  appbg: '#171717',
  logocolor: '#d3d3d3', 
  logobrightcolor: '#87cefa', // lightskyblue
  logoaccentcolor: '#202020',
  logoshadowcolor: '#800000',
  logosubtextcolor: '#f0f8ff', // aliceblue
  logosubshadow: '#6a5acd', // slateblue
  modalbodybg: '#141414',
  navbarshadow: '#6495ed', // cornflowerblue  
  navbarsubshadow: '#646464', 
  subduedmessage: '#888888',
  normalmessage: '#aaaaaa',
  highlightedmessage: '#90ee90',
  buttonbg: '#171717',
  buttonfg: '#87cefa', // lightskyblue 
  buttonborder: '#87cefa', // lightskyblue 
  buttonhighlight: '#080808',
  lightshadow: '#202020',
  darkshadow: '#000000',
  accentshadow: '#ff0000',
  sectionsubdued: '#484848',
  sectionhighlight: '#212121',
  sectionbrighthighlight: '#171717',
  sectionbrighterhighlight: '#171717',
  sectionbordercolor: '#303030',
  sectionnegativehighlight: '#118080',
  fieldborder: '#87cefa', // lightskyblue 
  fieldborderhighlight: '#87cefa', // lightskyblue 
  fieldbackground: '#171717',
  fieldbackgroundhighlight: '#324588', 
  fieldcolorhighlight: '#ffffff',
  requiredind: '#ff0000', 
  starcolor: '#deb887', // burlywood 
};

export default {
  install: (app) => {
    console.log("newsgears-theme: install");

    function installTheme(theme) {
      document.body.style.background=theme.bodybg;

      app.config.globalProperties.$theme.currentTheme.bodybg = theme.bodybg;
      app.config.globalProperties.$theme.currentTheme.logoaccentcolor = theme.logoaccentcolor;
      app.config.globalProperties.$theme.currentTheme.logosubtextcolor = theme.logosubtextcolor;
      app.config.globalProperties.$theme.currentTheme.logosubshadow = theme.logosubshadow;
      // user configurable 
      app.config.globalProperties.$theme.currentTheme.appbg = theme.appbg;
      app.config.globalProperties.$theme.currentTheme.logocolor = theme.logocolor;
      app.config.globalProperties.$theme.currentTheme.subduedmessage = theme.subduedmessage;
      app.config.globalProperties.$theme.currentTheme.normalmessage = theme.normalmessage;
      app.config.globalProperties.$theme.currentTheme.highlightedmessage = theme.highlightedmessage;
      app.config.globalProperties.$theme.currentTheme.buttonbg = theme.buttonbg;
      app.config.globalProperties.$theme.currentTheme.buttonfg = theme.buttonfg;
      app.config.globalProperties.$theme.currentTheme.buttonborder = theme.buttonborder;
      app.config.globalProperties.$theme.currentTheme.buttonhighlight = theme.buttonhighlight;
      app.config.globalProperties.$theme.currentTheme.lightshadow = theme.lightshadow;
      app.config.globalProperties.$theme.currentTheme.darkshadow = theme.darkshadow;
      app.config.globalProperties.$theme.currentTheme.accentshadow = theme.accentshadow;
      app.config.globalProperties.$theme.currentTheme.logoshadowcolor = theme.logoshadowcolor;
      app.config.globalProperties.$theme.currentTheme.navbarshadow = theme.navbarshadow;
      app.config.globalProperties.$theme.currentTheme.sectionbrighterhighlight = theme.sectionbrighterhighlight;
      app.config.globalProperties.$theme.currentTheme.sectionbordercolor = theme.sectionbordercolor;
      app.config.globalProperties.$theme.currentTheme.sectionsubdued = theme.sectionsubdued;
      app.config.globalProperties.$theme.currentTheme.starcolor = theme.starcolor;
      app.config.globalProperties.$theme.currentTheme.sectionhighlight = theme.sectionhighlight;
      app.config.globalProperties.$theme.currentTheme.navbarsubshadow = theme.navbarsubshadow;
      app.config.globalProperties.$theme.currentTheme.modalbodybg = theme.modalbodybg;
      app.config.globalProperties.$theme.currentTheme.sectionbrighthighlight = theme.sectionbrighthighlight;
      app.config.globalProperties.$theme.currentTheme.logobrightcolor = theme.logobrightcolor;
      app.config.globalProperties.$theme.currentTheme.sectionnegativehighlight = theme.sectionnegativehighlight
      app.config.globalProperties.$theme.currentTheme.fieldborder = theme.fieldborder;
      app.config.globalProperties.$theme.currentTheme.fieldborderhighlight = theme.fieldborderhighlight;
      app.config.globalProperties.$theme.currentTheme.fieldbackground = theme.fieldbackground;
      app.config.globalProperties.$theme.currentTheme.fieldbackgroundhighlight = theme.fieldbackgroundhighlight;
      app.config.globalProperties.$theme.currentTheme.fieldcolorhighlight = theme.fieldcolorhighlight;
      app.config.globalProperties.$theme.currentTheme.requiredind = theme.requiredind;
    }

    function setupDarkMode() {
      let systemTheme = DEFAULT_DARK_THEME;
      let userTheme = app.config.globalProperties.$theme.userDarkTheme;
      let userAttrs = Object.keys(userTheme);
      for (let i = 0; i < userAttrs.length; i++) {
        let attrName = userAttrs[i];
        systemTheme[attrName] = userTheme[attrName];
      }
      app.config.globalProperties.$theme.currentTheme.ident = 'dark';
      installTheme(systemTheme);
    }

    function setupLightMode() {
      let systemTheme = DEFAULT_LIGHT_THEME;
      let userTheme = app.config.globalProperties.$theme.userLightTheme;
      let userAttrs = Object.keys(userTheme);
      for (let i = 0; i < userAttrs.length; i++) {
        let attrName = userAttrs[i];
        systemTheme[attrName] = userTheme[attrName];
      }
      app.config.globalProperties.$theme.currentTheme.ident = 'light';
      installTheme(systemTheme);
    }

    function switchMode() {
      let currentMode = app.config.globalProperties.$theme.currentTheme.ident;
      if (currentMode === 'dark') {
        console.log("newsgears-theme: light mode");
        setupLightMode();
        // 
      } else {
        console.log("newsgears-theme: dark mode");
        setupDarkMode();
      }
    }

    function setupModes(mode, themeConfig) {
      if (themeConfig) {
        if (themeConfig.lightTheme) {
          console.log("newsgears-theme: installing custom light theme");
          themeConfig.lightTheme.bodybg = DEFAULT_LIGHT_THEME.bodyBg;
          themeConfig.lightTheme.logoaccentcolor = DEFAULT_LIGHT_THEME.logoaccentcolor;
          themeConfig.lightTheme.logosubtextcolor = DEFAULT_DARK_THEME.logosubtextcolor;
          themeConfig.lightTheme.logosubshadow = DEFAULT_DARK_THEME.logosubshadow;
          app.config.globalProperties.$theme.userLightTheme = themeConfig.lightTheme;
        }
        if (themeConfig.darkTheme) {
          console.log("newsgears-theme: installing custom dark theme");
          themeConfig.darkTheme.bodybg = DEFAULT_DARK_THEME.bodybg;
          themeConfig.darkTheme.logoaccentcolor = DEFAULT_DARK_THEME.logoaccentcolor;
          themeConfig.darkTheme.logosubtextcolor = DEFAULT_DARK_THEME.logosubtextcolor;
          themeConfig.darkTheme.logosubshadow = DEFAULT_DARK_THEME.logosubshadow;
          app.config.globalProperties.$theme.userDarkTheme = themeConfig.darkTheme;
        }
      }
      if (mode === 'dark') {
        setupDarkMode();
      } else if (mode === 'light') {
        setupLightMode();
      }
    }

    const themeObj = reactive({
      'switchMode': switchMode,
      'setupModes': setupModes,
      'setupDefaultMode': setupDarkMode,
      currentTheme: reactive({}),
      userLightTheme: reactive({}),
      userDarkTheme: reactive({}),
      keySet: [
        { name: 'appbg', shortDescription: 'Background', longDescription: 'Application background color, visible behind the various panels.' },
        { name: 'logocolor', shortDescription: 'Accent', longDescription: 'Accent color used on headers, labels, and buttons throughout the application.' },
        { name: 'subduedmessage', shortDescription: 'Subdued message', longDescription: 'Color used for subdued messages/lesser labels.' },
        { name: 'normalmessage', shortDescription: 'Normal message', longDescription: 'The normal foreground font color.' },
        { name: 'highlightedmessage', shortDescription: 'Highlighted message', longDescription: 'Color used for highlighted messages.' },
        { name: 'buttonbg', shortDescription: 'Button background', longDescription: 'Button background color.' },
        { name: 'buttonfg', shortDescription: 'Button foreground', longDescription: 'Button foreground color.' },
        { name: 'buttonborder', shortDescription: 'Button border', longDescription: 'Button border color.' },
        { name: 'buttonhighlight', shortDescription: 'Highlighted button', longDescription: 'Highlighted button color, applied when the mouse is hovering over a button, or when the button has keyboard focus.' }, 
        { name: 'lightshadow', shortDescription: 'Light shadow', longDescription: 'A lighter shadow color applied to various panels.' },
        { name: 'darkshadow', shortDescription: 'Dark shadow', longDescription: 'A darker shadow color applied to various panels.' },
        { name: 'accentshadow', shortDescription: 'Headers and label shadow', longDescription: 'Shadow color applied to headers and labels.' },
        { name: 'logoshadowcolor', shortDescription: 'Logo shadow', longDescription: 'Shadow color of the logo, visible behind the queue dashboard.' },
        { name: 'navbarshadow', shortDescription: 'Loading animation', longDescription: 'Loading animation color.' },
        { name: 'sectionbrighterhighlight', shortDescription: 'Article section background color', longDescription: 'Article body background color.' },
        { name: 'sectionbordercolor', shortDescription: 'Article section inner border color', longDescription: 'Border color around sections of the article.' },
        { name: 'sectionsubdued', shortDescription: 'Article text (read)', longDescription: 'Body color for articles marked as read.' },
        { name: 'starcolor', shortDescription: 'Article \'starred\' indicator', longDescription: 'Color of the star used to indicate that an article is marked as a favorite.' },
        { name: 'sectionhighlight', shortDescription: 'Queue dashboard background ', longDescription: 'Queue dashboard background color.' },
        { name: 'navbarsubshadow', shortDescription: 'Queue dashboard border', longDescription: 'Queue dashboard border color.' }, 
        { name: 'modalbodybg', shortDescription: 'Modal dialog background', longDescription: 'Background color of modal dialogs, such as settings, feed configuration, and OPML upload.' },
        { name: 'sectionbrighthighlight', shortDescription: 'Tab label background', longDescription: 'Background color of tab labels.' },
        { name: 'logobrightcolor', shortDescription: 'Selected tab label color', longDescription: 'Label color of the selected tab.' },
        { name: 'sectionnegativehighlight', shortDescription: 'Error message background', longDescription: 'Background color for error messages.' },
        { name: 'fieldborder', shortDescription: 'Input field border', longDescription: 'Border color of all input fields.' },
        { name: 'fieldborderhighlight', shortDescription: 'Input field border (focused)', longDescription: 'Border color of input field that have the keyboard focus.' },
        { name: 'fieldbackground', shortDescription: 'Input field background', longDescription: 'Background color of all input fields.' },
        { name: 'fieldbackgroundhighlight', shortDescription: 'Input field background (focused)', longDescription: 'Background color of input fields that have the keyboard focus.' },
        { name: 'fieldcolorhighlight', shortDescription: 'Input field color (focused)', longDescription: 'Color of input fields that have the keyboard focus.' },
        { name: 'requiredind', shortDescription: 'Input field required indicator', longDescription: 'Color of the asterisk next to a field that indicates its value is required.' },
      ]
    });

    if (!app.config.globalProperties.$theme) {
      app.config.globalProperties.$theme = themeObj;
      setupDarkMode();
    }
  }
};