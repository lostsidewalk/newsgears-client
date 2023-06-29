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

import es from "./translations/es";
import en from "./translations/en";

const i18n = createI18n({
  locale: shortLang,
  fallbackLocale: "en",
  allowComposition: true,
  messages: {
    es: es,
    en: en,
  },
});

export default i18n;