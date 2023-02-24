import { reactive } from 'vue';

const LIGHT_THEME = { 
  bodybg: '#d1d1d1',
  appbg: '#f0f0f0',
  logocolor: 'unset',
  logobrightcolor: 'unset',
  logoaccentcolor: 'unset',
  logoshadowcolor: 'unset',
  logosubtextcolor: 'paleturquoise',
  modalbodybg: 'rgba(0,0,0,0.8)',
  navbarshadow: 'cornflowerblue',
  navbarsubshadow: 'rgb(0 0 0 / 75%)', 
  subduedmessage: 'rgb(128,128,128)',
  normalmessage: 'unset',
  highlightedmessage: 'rgba(144,238,144,0.7)',
  buttonbg: 'transparent',
  buttonfg: 'rgb(136,136,136)',
  buttonborder: 'rgb(128,128,128)',
  buttonhighlight: '#ffffff', 
  dangerbuttonhighlight: 'lightpink',
  dangerbuttonsubdued: 'darkred',
  lightshadow: 'rgb(32,32,32)',
  darkshadow: 'rgb(0 0 0 / 50%)',
  accentshadow: 'transparent',
  sectionbg: 'transparent',
  sectionsubdued: 'rgb(72,72,72)',
  sectionhighlight: '#dedede',
  sectionbrighthighlight: 'transparent', 
  sectionbrighterhighlight: 'transparent',
  sectionbrightesthighlight: 'transparent',
  sectionbordercolor: 'rgb(48,48,48)',
  sectionpositivehighlight: 'rgba(128,255,128,0.1)',
  sectionpositiveaccent: 'rgba(128,255,128,0.3)',
  sectionnegativehighlight: 'rgba(255,128,128,0.1)',
  fieldborder: 'rgb(128,128,128)',
  fieldborderhighlight: 'cornflowerblue',
  fieldbackground: 'transparent',
  fieldbackgroundhighlight: 'rgba(100,149,237,0.1)', 
  fieldcolorhighlight: 'black',
  errorbg: 'lightpink',
  errorborder: 'darkred',
  errorshadow: 'rgb(255 0 0 / 50%)',
  requiredind: 'red',
  activetabcolor: 'rgba(100,149,237,0.3)',
  tocbgcolor: 'transparent',
  starcolor: 'burlywood',
};

const DARK_THEME = { 
  bodybg: '#171717',
  appbg: '#212121',
  logocolor: 'lightgrey',
  logobrightcolor: 'lightskyblue',
  logoaccentcolor: 'rgb(32 32 32)',
  logoshadowcolor: 'rgb(255 0 0 / 50%)',
  logosubtextcolor: 'paleturquoise',
  modalbodybg: '#141414',
  navbarshadow: 'cornflowerblue',
  navbarsubshadow: 'rgb(0 0 0 / 75%)', 
  subduedmessage: 'rgb(116,116,116)',
  normalmessage: 'rgb(136,136,136)',
  highlightedmessage: 'rgba(144,238,144,0.7)',
  buttonbg: 'transparent',
  buttonfg: 'rgb(136,136,136)',
  buttonborder: 'rgb(128,128,128)',
  buttonhighlight: 'rgba(100,149,237,0.1)', 
  dangerbuttonhighlight: 'rgba(100,149,237,0.1)',
  dangerbuttonsubdued: 'darkred',
  lightshadow: 'rgb(32,32,32)',
  darkshadow: 'rgb(0 0 0 / 50%)',
  accentshadow: 'rgb(255 0 0 / 50%)',
  sectionbg: 'transparent',
  sectionsubdued: 'rgb(72,72,72)',
  sectionhighlight: '#272727',
  sectionbrighthighlight: 'transparent', 
  sectionbrighterhighlight: 'transparent',
  sectionbrightesthighlight: 'transparent',
  sectionbordercolor: 'rgb(48,48,48)',
  sectionpositivehighlight: 'rgba(128,255,128,0.1)',
  sectionpositiveaccent: 'rgba(128,255,128,0.3)',
  sectionnegativehighlight: 'rgba(255,128,128,0.1)',
  fieldborder: 'rgb(128,128,128)',
  fieldborderhighlight: 'cornflowerblue',
  fieldbackground: 'transparent',
  fieldbackgroundhighlight: 'rgba(100,149,237,0.1)', 
  fieldcolorhighlight: 'white',
  errorbg: 'lightpink',
  errorborder: 'darkred',
  errorshadow: 'rgb(255 0 0 / 50%)',
  requiredind: 'red',
  activetabcolor: 'rgba(100,149,237,0.3)',
  tocbgcolor: 'transparent',
  starcolor: 'burlywood',
};

export default {
  install: (app) => {
    console.log("newsgears-theme: install");

    function installTheme(theme) {
      document.body.style.background=theme.bodybg;

      app.config.globalProperties.$theme.currentTheme.bodybg = theme.bodybg;
      app.config.globalProperties.$theme.currentTheme.appbg = theme.appbg;
      app.config.globalProperties.$theme.currentTheme.logocolor = theme.logocolor;
      app.config.globalProperties.$theme.currentTheme.logobrightcolor = theme.logobrightcolor;
      app.config.globalProperties.$theme.currentTheme.logoaccentcolor = theme.logoaccentcolor;
      app.config.globalProperties.$theme.currentTheme.logoshadowcolor = theme.logoshadowcolor;
      app.config.globalProperties.$theme.currentTheme.logosubtextcolor = theme.logosubtextcolor;
      app.config.globalProperties.$theme.currentTheme.modalbodybg = theme.modalbodybg;
      app.config.globalProperties.$theme.currentTheme.navbarshadow = theme.navbarshadow;
      app.config.globalProperties.$theme.currentTheme.navbarsubshadow = theme.navbarsubshadow;
      app.config.globalProperties.$theme.currentTheme.subduedmessage = theme.subduedmessage;
      app.config.globalProperties.$theme.currentTheme.normalmessage = theme.normalmessage;
      app.config.globalProperties.$theme.currentTheme.highlightedmessage = theme.highlightedmessage;
      app.config.globalProperties.$theme.currentTheme.buttonbg = theme.buttonbg;
      app.config.globalProperties.$theme.currentTheme.buttonfg = theme.buttonfg;
      app.config.globalProperties.$theme.currentTheme.buttonborder = theme.buttonborder;
      app.config.globalProperties.$theme.currentTheme.buttonhighlight = theme.buttonhighlight;
      app.config.globalProperties.$theme.currentTheme.dangerbuttonhighlight = theme.dangerbuttonhighlight;
      app.config.globalProperties.$theme.currentTheme.dangerbuttonsubdued = theme.dangerbuttonsubdued;
      app.config.globalProperties.$theme.currentTheme.lightshadow = theme.lightshadow;
      app.config.globalProperties.$theme.currentTheme.darkshadow = theme.darkshadow;
      app.config.globalProperties.$theme.currentTheme.accentshadow = theme.accentshadow;
      app.config.globalProperties.$theme.currentTheme.sectionbg = theme.sectionbg;
      app.config.globalProperties.$theme.currentTheme.sectionsubdued = theme.sectionsubdued;
      app.config.globalProperties.$theme.currentTheme.sectionhighlight = theme.sectionhighlight;
      app.config.globalProperties.$theme.currentTheme.sectionbrighthighlight = theme.sectionbrighthighlight;
      app.config.globalProperties.$theme.currentTheme.sectionbrighterhighlight = theme.sectionbrighterhighlight;
      app.config.globalProperties.$theme.currentTheme.sectionbrightesthighlight = theme.sectionbrightesthighlight;
      app.config.globalProperties.$theme.currentTheme.sectionbordercolor = theme.sectionbordercolor;
      app.config.globalProperties.$theme.currentTheme.sectionpositivehighlight = theme.sectionpositivehighlight
      app.config.globalProperties.$theme.currentTheme.sectionpositiveaccent = theme.sectionpositiveaccent;
      app.config.globalProperties.$theme.currentTheme.sectionnegativehighlight = theme.sectionnegativehighlight
      app.config.globalProperties.$theme.currentTheme.fieldborder = theme.fieldborder;
      app.config.globalProperties.$theme.currentTheme.fieldborderhighlight = theme.fieldborderhighlight;
      app.config.globalProperties.$theme.currentTheme.fieldbackground = theme.fieldbackground;
      app.config.globalProperties.$theme.currentTheme.fieldbackgroundhighlight = theme.fieldbackgroundhighlight;
      app.config.globalProperties.$theme.currentTheme.fieldcolorhighlight = theme.fieldcolorhighlight;
      app.config.globalProperties.$theme.currentTheme.errorbg = theme.errorbg;
      app.config.globalProperties.$theme.currentTheme.errorborder = theme.errorborder;
      app.config.globalProperties.$theme.currentTheme.errorshadow = theme.errorshadow;
      app.config.globalProperties.$theme.currentTheme.requiredind = theme.requiredind;
      app.config.globalProperties.$theme.currentTheme.activetabcolor = theme.activetabcolor;
      app.config.globalProperties.$theme.currentTheme.activetabhoverbg = theme.activetabhoverbg;
      app.config.globalProperties.$theme.currentTheme.activetabhoverfg = theme.activetabhoverfg;
      app.config.globalProperties.$theme.currentTheme.inactivetabhoverbg = theme.inactivetabhoverbg;
      app.config.globalProperties.$theme.currentTheme.inactivetabhoverfg = theme.inactivetabhoverfg;
      app.config.globalProperties.$theme.currentTheme.tocbgcolor = theme.tocbgcolor;
      app.config.globalProperties.$theme.currentTheme.starcolor = theme.starcolor;
    }

    function setupDarkMode() {
      console.log("newsgears-theme: setting up dark mode...");
      app.config.globalProperties.$theme.currentTheme.ident = 'dark';
      installTheme(DARK_THEME);
    }

    function setupLightMode() {
      console.log("newsgears-theme: setting up light mode...");
      app.config.globalProperties.$theme.currentTheme.ident = 'light';
      installTheme(LIGHT_THEME);
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

    const themeObj = reactive({
      'switchMode': switchMode,
      currentTheme: reactive({}),
    });

    app.config.globalProperties.$theme = themeObj;
    setupDarkMode();
  }
};