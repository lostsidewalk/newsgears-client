<template>
  <div class="feed-config-field">
    <!-- filter label -->
    <label>NEWS SOURCES {{ '(SHOWING ' + filteredNewsApiV2Sources.length + ' SOURCES)'}}</label>
    <!-- filter input -->
    <input class="newsapiv2-sources-filter" type="text" v-model="newsApiV2SourcesFilter" :disabled="disabled" placeholder="Filter"/>
    <div class="newsapiv2-sources-filter-pills">
      <!-- source language -->
      SOURCE LANGUAGE
      <div class="pill-container">
        <button class="br-pill" :class="{ selectedLanguage: this.newsApiV2Language.toLowerCase() === language.toLowerCase() }" 
          @click="toggleNewsApiV2LanguageFilter(language)"
          v-for="language of filteredNewsApiV2Languages" :key="language">
          {{ language }}
        </button>
      </div>
      <!-- source country -->
      SOURCE COUNTRY
      <div class="pill-container">
        <button class="br-pill" :class="{ selectedCountry: this.newsApiV2Country.toLowerCase() === country.toLowerCase() }" 
          @click="toggleNewsApiV2CountryFilter(country)"
          v-for="country of filteredNewsApiV2Countries" :key="country">
            {{ country }} 
            <span :class="'newsapiv2-country-icon fi fi-' + country.toLowerCase()"></span>
        </button>
      </div>
      <!-- source category -->
      SOURCE CATEGORY
      <div class="pill-container">
        <button class="br-pill" :class="{ selectedCategory: this.newsApiV2Category.toLowerCase() === category.toLowerCase() }"
          @click="toggleNewsApiV2CategoryFilter(category)"
          v-for="category of filteredNewsApiV2Categories" :key="category">
          {{ category }}
        </button>
      </div>
    </div>
    <div class="newsapiv2-sources">
      <div class="newsapiv2-source" v-for="source of this.filteredNewsApiV2Sources" :key="source">
        <label class="newsapiv2-source-label">
          <input type="checkbox" :checked="newsApiV2Sources[source.key]" @click="toggleNewsApiV2SourceFilter(source)" :disabled="disabled"/>
          {{ source.name }}
        </label>
        <div style="padding-top: .31rem;">{{ source.description }}</div>
        <!-- <div>URL: {{ source.url }}</div> -->
        <div style="padding-top: .31rem;" class="pill-container">
          <button class="br-pill" @click="toggleNewsApiV2CategoryFilter(source.category)">
            {{ source.category.toUpperCase() }}
          </button>
          <button class="br-pill" @click="toggleNewsApiV2CountryFilter(source.country)">
            {{ source.country.toUpperCase() }}
            <span :class="'newsapiv2-country-icon fi fi-' + source.country.toLowerCase()"></span>
          </button>
          <button class="br-pill" @click="toggleNewsApiV2LanguageFilter(source.language)">
            {{ source.language.toUpperCase() }}
          </button>
          <button class="br-pill" v-if="source.url" aria-label="Visit this news source URL in new tab" @click="window.open(source.url, '_blank')">
            <span class="fa fa-link fa-1x"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// lcStrEq is true IFF str1 and str2 are LC-EQ 
const lcStrEq = function(str1, str2) {
  return str1 && str2 && str1.toLowerCase() === str2.toLowerCase();
};
// lcStrContains is true IFF str2 is contained within str1 
const lcStrContains = function(str1, str2) {
  return str1 && str2 && str1.toLowerCase().indexOf(str2.toLowerCase()) >= 0;
}

export default {
  name: "NewsApiV2SourcesConfig",
  props: [ 
    "allNewsApiV2Sources", 
    "allNewsApiV2Languages", 
    "allNewsApiV2Countries", 
    "allNewsApiV2Categories", 
    "newsApiV2Language",
    "newsApiV2Country",
    "newsApiV2Category",
    "newsApiV2Sources", 
    "disabled", 
    "theme" 
  ],
  emits: [
    "update:newsApiV2Language",
    "update:newsApiV2Country",
    "update:newsApiV2Category",
    "update:newsApiV2Source"
  ],
  mounted() {
    // setup newsApiV2SourceCountBy{Language, Category, Country} maps 
    if (this.allNewsApiV2Sources) {
      let la = {}, co = {}, ca = {};
      for (let source in this.allNewsApiV2Sources) {
        let s = this.allNewsApiV2Sources[source];
        // lang 
        if (!la[s.language]) { la[s.language] = 0; }
        la[s.language] = la[s.language] + 1;
        // country 
        if (!co[s.country]) { co[s.country] = 0; }
        co[s.country] = co[s.country] + 1;
        // category 
        if (!ca[s.category]) { ca[s.category] = 0; }
        ca[s.category] = ca[s.category] + 1;
      }
      this.newsApiV2SourceCountByLanguage = la;
      this.newsApiV2SourceCountByCountry = co;
      this.newsApiV2SourceCountByCategory = ca;
    }
  },
  computed: {
    filteredNewsApiV2Languages: function() {
      let filtered = [];
      if (this.allNewsApiV2Languages && this.allNewsApiV2Sources) {
        for (let language in this.allNewsApiV2Languages) {
          if (this.newsApiV2SourceCountByLanguage[this.allNewsApiV2Languages[language].toLowerCase()] > 0) {
            filtered.push(this.allNewsApiV2Languages[language]);
          }
        }
      }
      return filtered;
    },
    filteredNewsApiV2Categories: function() {
      let filtered = [];
      if (this.allNewsApiV2Categories && this.allNewsApiV2Sources) {
        for (let category in this.allNewsApiV2Categories) {
          if (this.newsApiV2SourceCountByCategory[this.allNewsApiV2Categories[category].toLowerCase()] > 0) {
            filtered.push(this.allNewsApiV2Categories[category]);
          }
        }
      }
      return filtered;
    },
    filteredNewsApiV2Countries: function() {
      let filtered = [];
      if (this.allNewsApiV2Countries && this.allNewsApiV2Sources) {
        for (let country in this.allNewsApiV2Countries) {
          if (this.newsApiV2SourceCountByCountry[this.allNewsApiV2Countries[country].toLowerCase()] > 0) {
            filtered.push(this.allNewsApiV2Countries[country]);
          }
        }
      }
      return filtered;
    },
    filteredNewsApiV2Sources: function() {
      let filtered = [];
      if (this.allNewsApiV2Sources) {
        for (let source in this.allNewsApiV2Sources) {
          let s = this.allNewsApiV2Sources[source];
          let categoryMatches = !this.newsApiV2Category || lcStrEq(s.category, this.newsApiV2Category);
          let countryMatches = !this.newsApiV2Country || lcStrEq(s.country, this.newsApiV2Country);
          let languageMatches = !this.newsApiV2Language || lcStrEq(s.language, this.newsApiV2Language);
          let filterTextMatches = !this.newsApiV2SourcesFilter 
            || lcStrContains(s.name, this.newsApiV2SourcesFilter) 
            || lcStrContains(s.description, this.newsApiV2SourcesFilter);
          if (categoryMatches && countryMatches && languageMatches && filterTextMatches) {
            s.key = source;
            filtered.push(s);
          }
        }
      }
      return filtered;
    },
  },
  methods: {
    toggleNewsApiV2LanguageFilter(language) {
      let l = (this.newsApiV2Language === language ? '' : language);
      this.$emit('update:newsApiV2Language', l);
    },
    toggleNewsApiV2CountryFilter(country) {
      let c = (this.newsApiV2Country === country ? '' : country);
      this.$emit('update:newsApiV2Country', c);
    },
    toggleNewsApiV2CategoryFilter(category) {
      let c = (this.newsApiV2Category === category ? '' : category);
      this.$emit('update:newsApiV2Category', c);
    },
    toggleNewsApiV2SourceFilter(source) {
      let s = this.newsApiV2Sources[source.key];
      this.$emit('update:newsApiV2Source', { "source": source, "enabled": !s });
    }
  },
  data() {
    return {
      newsApiV2SourceCountByLanguage: {},
      newsApiV2SourceCountByCountry: {},
      newsApiV2SourceCountByCategory: {},
      newsApiV2SourcesFilter: '',
    }
  }
}
</script>

<style scoped>
.feed-config-field {
  border: 1px solid v-bind('theme.sectionbordercolor');
  text-align: left;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  padding: .75rem;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
}

.feed-config-field > input, .feed-config-field > textarea, .newsapiv2-sources-toolbar > input {
  padding: .31rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: .125rem;
  resize: none;
}

.feed-config-field input:hover, .feed-config-field textarea:hover, .newsapiv2-sources-toolbar input:hover, 
.feed-config-field input:focus-visible, .feed-config-field textarea:focus-visible, .newsapiv2-sources-toolbar input:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-config-field input:disabled, .feed-config-field textarea:disabled, .newsapiv2-sources-toolbar input:disabled {
  cursor: auto;
}

.newsapiv2-language-label, .newsapiv2-country-label, .newsapiv2-category-label {
  padding: .31rem;
  border-radius: 3px;
  user-select: none;
  align-self: baseline;
  width: 100%;
}

.selectedLanguage, .selectedCountry, .selectedCategory {
  color: v-bind('theme.buttonfg');
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
  border: 1px solid transparent;
}

.link:hover, .link:focus-visible {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-wrap: wrap;
  gap: .31rem;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .44rem 1.25rem;
  user-select: none;
  min-width: 3rem;
  min-height: 3rem;
}

.br-pill:hover, .br-pill:focus-visible {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.br-pill > a {
  color: v-bind('theme.subduedmessage');
}

.br-pill > a:hover, .br-pill > a:focus-visible {
  color: v-bind('theme.highlightedmessage');
}

.newsapiv2-sources-toolbar {
  display: inline-flex;
  margin-bottom: .75rem;
}

.newsapiv2-sources-toolbar > input {
  width: 100%;
}

.newsapiv2-sources {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
  resize: none;
  gap: .75rem;
}

.newsapiv2-sources-filter {
  margin-top: .75rem;
  margin-bottom: .75rem;
}

.newsapiv2-sources-filter-pills > div {
  margin-bottom: .75rem;
}

.newsapiv2-source {
  background-color: v-bind('theme.sectionbrighterhighlight');;
  padding: .75rem;
  margin-bottom: .75rem;
  border-radius: 3px;
  border: 1px solid v-bind('theme.sectionbordercolor');
}

.newsapiv2-source-label {
  border-radius: 3px;
  user-select: none;
  align-self: baseline;
  width: 100%;
  font-size: unset !important;
  font-weight: bold;
}

.newsapiv2-source-label > input {
  position: relative;
  vertical-align: middle;
}

.newsapiv2-source-label > input:hover, .newsapiv2-source-label > input:focus-visible {
  box-shadow: unset;
}

.newsapiv2-source-label > input:disabled {
  cursor: auto;
}
</style>
