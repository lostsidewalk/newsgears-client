import { createI18n } from "vue-i18n";

let lang = window.navigator.languages ? window.navigator.languages[0] : null;
lang =
  lang ||
  window.navigator.language ||
  window.navigator.browserLanguage ||
  window.navigator.userLanguage;

let shortLang = lang;
if (shortLang.indexOf("-") !== -1) shortLang = shortLang.split("-")[0];

if (shortLang.indexOf("_") !== -1) shortLang = shortLang.split("_")[0];

import en from "./translations/en";
import es from "./translations/es";
import fr from "./translations/fr";

const i18n = createI18n({
  locale: shortLang,
  fallbackLocale: "en",
  allowComposition: true,
  messages: {
    en: en,
    es: es,
    fr: fr,
  },
});

export default i18n;