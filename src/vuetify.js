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
          primary: colors.blue.lighten2,
          secondary: colors.green.darken1, 
          surface: colors.grey.darken4,
          accent: colors.blue.darken4,
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
      style: 'font-family: "Russo One", system-ui, sans-serif;white-space: normal;',
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
      bgColor: "surface",
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
      bgColor: "surface",
      color: "primary",
    },
    VListItem: {
      baseColor: "accent",
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

export default vuetify; 