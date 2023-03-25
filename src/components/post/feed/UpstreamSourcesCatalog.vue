<template>
  <div class="feed-config-field" v-auto-animate>
    <!-- feed catalog filter label -->
    <label>{{ this.$t('feedCatalog') }} &nbsp; {{ '(' + this.filteredFeedCatalog.length + ' ' + this.$t('nFeedsMatchOnPageM') + ' ' + (this.currentPage + 1) + '/' + (this.totalPages > 0 ? this.totalPages : 1 ) + ')' }}</label>
    <!-- feed catalog filter input w/pagination buttons -->
    <div class="feed-catalog-filter">
      <!-- feed catalog filter input -->
      <input type="text" v-model="feedCatalogFilter" :disabled="disabled" :placeholder="this.$t('filter')">
      <div class="feed-catalog-filter-buttons">
        <!-- first page button-->
        <button v-if="needsPagination()" :title="this.$t('first')" class="feed-catalog-filter-button accessible-button" @click="firstPage">
          <span class="fa fa-angle-double-left"/>
        </button>
        <!-- previous page button -->
        <button v-if="needsPagination()" :title="this.$t('previous')" class="feed-catalog-filter-button accessible-button" @click="previousPage">
          <span class="fa fa-angle-left"/>
        </button>
        <!-- next page button -->
        <button v-if="needsPagination()" :title="this.$t('next')" class="feed-catalog-filter-button accessible-button" @click="nextPage">
          <span class="fa fa-angle-right"/>
        </button>
        <!-- last page button-->
        <button v-if="needsPagination()" :title="this.$t('last')" class="feed-catalog-filter-button accessible-button" @click="lastPage">
          <span class="fa fa-angle-double-right"/>
        </button>
      </div>
    </div>
    <!-- feed catalog filter pills -->
    <div v-if="hasFeedCatalogFilters()" class="feed-catalog-filter-pills pill-container">
      <button v-for="authorFilter in this.feedCatalogFilterAuthors" 
        :key="authorFilter" 
        @click="removeFilter('author', authorFilter)" 
        class="br-pill accessible-button" 
        :title="this.$t('removeThisFilter')">
        {{ this.$t('authorColon') }} &nbsp; {{ this.trimToLength(authorFilter, 64) }}
      </button>
      <button v-for="categoryFilter in this.feedCatalogFilterCategories" 
        :key="categoryFilter" 
        @click="removeFilter('category', categoryFilter)" 
        class="br-pill accessible-button" 
        :title="this.$t('removeThisFilter')">
        {{ this.$t('categoryColon') }} &nbsp; {{ this.trimToLength(categoryFilter, 64) }}
      </button>
      <button v-for="languageFilter in this.feedCatalogFilterLanguages" 
        :key="languageFilter" 
        @click="removeFilter('language', languageFilter)" 
        class="br-pill accessible-button" 
        :title="this.$t('removeThisFilter')">
        {{ this.$t('languageColon') }} &nbsp; {{ this.trimToLength(languageFilter, 64) }}
      </button>
      <button v-for="docsFilter in this.feedCatalogFilterDocs" 
        :key="docsFilter" 
        @click="removeFilter('docs', docsFilter)" 
        class="br-pill accessible-button" 
        :title="this.$t('removeThisFilter')">
        {{ this.$t('docsColon') }} &nbsp; {{ this.trimToLength(docsFilter, 64) }}
      </button>
      <button v-for="encodingFilter in this.feedCatalogFilterEncodings" 
        :key="encodingFilter" 
        @click="removeFilter('encoding', encodingFilter)" 
        class="br-pill accessible-button" 
        :title="this.$t('removeThisFilter')">
        {{ this.$t('encodingColon') }} &nbsp; {{ this.trimToLength(encodingFilter, 64) }}
      </button>
      <button v-for="feedTypeFilter in this.feedCatalogFilterFeedTypes" 
        :key="feedTypeFilter" 
        @click="removeFilter('feedType', feedTypeFilter)" 
        class="br-pill accessible-button" 
        :title="this.$t('removeThisFilter')">
        {{ this.$t('feedTypeColon') }} &nbsp; {{ this.trimToLength(feedTypeFilter, 64) }}
      </button>
      <button v-for="generatorFilter in this.feedCatalogFilterGenerators" 
        :key="generatorFilter" 
        @click="removeFilter('generator', generatorFilter)" 
        class="br-pill accessible-button" 
        :title="this.$t('removeThisFilter')">
        {{ this.$t('generatorColon') }} &nbsp; {{ this.trimToLength(generatorFilter, 64) }}
      </button>
      <button v-for="managingEditorFilter in this.feedCatalogFilterManagingEditors" 
        :key="managingEditorFilter" 
        @click="removeFilter('managingEditor', managingEditorFilter)" 
        class="br-pill accessible-button" 
        :title="this.$t('removeThisFilter')">
        {{ this.$t('managingEditorColon') }} &nbsp; {{ this.trimToLength(managingEditorFilter, 64) }}
      </button>
      <button v-for="webMasterFilter in this.feedCatalogFilterWebMasters" 
        :key="webMasterFilter" 
        @click="removeFilter('webMaster', webMasterFilter)" 
        class="br-pill accessible-button" 
        :title="this.$t('removeThisFilter')">
        {{ this.$t('webmasterColon') }} &nbsp; {{ this.trimToLength(webMasterFilter, 64) }}
      </button>
    </div>
    <!-- feed catalog -->
    <div class="feed-catalog">
      <!-- feed catalog items -->
      <div class="rss-atom-url-wrapper" v-for="source in this.getCurrentPage(filteredFeedCatalog)" :key="source">
        <div class="rss-atom-url-row">
          <button v-if="this.disabledRssAtomFeedUrls.indexOf(source.feedUrl) < 0"
            class="add-catalog-feed-button accessible-button" 
            :disabled="disabled"
            @click="this.$emit('addCatalogFeed', source)">
            {{ this.$t('subscribeToThisFeed') }}
          </button>
          <button v-else
            class="add-catalog-feed-button accessible-button" 
            :disabled="true">
            {{ this.$t('youAreSubscribed') }}
          </button>
        </div>
        <RssAtomFeedInfo 
          v-if="source.discoveryUrl || source.error"
          :info="source" 
          :disabled="disabled" 
          :theme="theme" 
          :filterSupport="true"
          style="margin-top: .75rem;"
          @updateFilter="updateFeedCatalogFilter" />
      </div>
    </div>
  </div>
</template>

<script>
import RssAtomFeedInfo from './RssAtomFeedInfo.vue';

// lcStrEq is true IFF str1 and str2 are LC-EQ 
const lcStrEq = function(str1, str2) {
  return str1 && str2 && str1.toLowerCase() === str2.toLowerCase();
};
// lcStrContains is true IFF str2 is contained within str1 
const lcStrContains = function(str1, str2) {
  return str1 && str2 && str1.toLowerCase().indexOf(str2.toLowerCase()) >= 0;
}
// lcSetContainsStr is true IFF str1 is contained in strSet 
const lcSetContainsStr = function(str1, strSet) {
  if (str1 && strSet) {
    for (let i = 0; i < strSet.length; i++) {
      if (lcStrEq(str1, strSet[i])) {
        return true;
      }
    }
  }
  return false;
}
// lcSetIncludesStr
const lcSetIncludesStr = function(str1, strSet) {
  if (str1 && strSet) {
    for (let i = 0; i < strSet.length; i++) {
      if (lcStrContains(str1, strSet[i])) {
        return true;
      }
    }
  }
}
// lcSetContainsSet is true IFF any item in set is in strSet 
const lcSetContainsSet = function(set, strSet) {
  if (set && strSet) {
    for (let i = 0; i < set.length; i++) {
      if (lcSetContainsStr(set[i], strSet)) {
        return true;
      }
    }
  }
  return false;
}

export default {
  name: "UpstreamSourcesCatalog",
  props: [ "feedCatalog", "rssAtomFeedUrls", "disabled", "theme" ],
  emits: [ "addCatalogFeed" ],
  components: {
    RssAtomFeedInfo,
  },
  computed: {
    totalPages: function() {
      let t = Math.ceil(this.filteredFeedCatalog.length / this.itemsPerPage);
      return t;
    },
    filteredFeedCatalog: function() {
      let filtered = [];
      if (this.feedCatalog) {
        for (let i = 0; i < this.feedCatalog.length; i++) {
          // item to filter 
          let s = this.feedCatalog[i];
          // evaluate each set membership check  
          let authorInSet = this.feedCatalogFilterAuthors.length === 0 || lcSetContainsStr(s.author, this.feedCatalogFilterAuthors);
          let categoryInSet = this.feedCatalogFilterCategories.length === 0 || lcSetContainsSet(s.categories, this.feedCatalogFilterCategories);
          let languageInSet = this.feedCatalogFilterLanguages.length === 0 || lcSetContainsStr(s.language, this.feedCatalogFilterLanguages);
          let docsInSet = this.feedCatalogFilterDocs.length === 0 || lcSetContainsStr(s.docs, this.feedCatalogFilterDocs);
          let encodingInSet = this.feedCatalogFilterEncodings.length === 0 || lcSetContainsStr(s.encoding, this.feedCatalogFilterEncodings);
          let feedTypeInSet = this.feedCatalogFilterFeedTypes.length === 0 || lcSetContainsStr(s.feedType, this.feedCatalogFilterFeedTypes);
          let generatorInSet = this.feedCatalogFilterGenerators.length === 0 || lcSetContainsStr(s.generator, this.feedCatalogFilterGenerators);
          let managingEditorInSet = this.feedCatalogFilterManagingEditors.length === 0 || lcSetContainsStr(s.managingEditor, this.feedCatalogFilterManagingEditors);
          let webMasterInSet = this.feedCatalogFilterWebMasters.length === 0 || lcSetContainsStr(s.webMaster, this.feedCatalogFilterWebMasters);
          // if this item meets any of the set criteria 
          if (authorInSet && categoryInSet && languageInSet && docsInSet && encodingInSet && feedTypeInSet && generatorInSet && managingEditorInSet && webMasterInSet) {
            // apply further limits if there is a non-empty text filter.. 
            if (this.feedCatalogFilter) {
              // check each filterable attribute 
              let title = s.title && lcStrContains(s.title.value, this.feedCatalogFilter);
              let description = lcStrContains(s.author, this.feedCatalogFilter);
              let categories = lcSetIncludesStr(this.feedCatalogFilter, s.categories);
              let generator = lcStrContains(s.generator, this.feedCatalogFilter);
              let managingEditor = lcStrContains(s.managingEditor, this.feedCatalogFilter);
              let webMaster = lcStrContains(s.webMaster, this.feedCatalogFilter);
              let copyright = lcStrContains(s.copyright, this.feedCatalogFilter);
              let language = lcStrContains(s.language, this.feedCatalogFilter);
              let docs = lcStrContains(s.docs, this.feedCatalogFilter);
              let encoding = lcStrContains(s.encoding, this.feedCatalogFilter);
              let feedType = lcStrContains(s.feedType, this.feedCatalogFilter);
              let discoveryUrl = lcStrContains(s.discoveryUrl, this.feedCatalogFilter);
              if (title || description || categories || generator || managingEditor || webMaster || copyright || language || docs || encoding || feedType || discoveryUrl) {
                filtered.push(s);
              } 
              // else {
              //   if (s.sampleEntries) {
              //     for (let i = 0; i < s.sampleEntries.length; i++) {
              //       let se = s.sampleEntries[i];
              //       if (lcStrContains(se.link, this.feedCatalogFilter) || lcStrContains(se.title, this.feedCatalogFilter)) {
              //         filtered.push(s);
              //         break;
              //       }
              //     }
              //   }
              // }
            } else {
              filtered.push(s);
            }
          }
        }
      }
      return filtered;
    },
    disabledRssAtomFeedUrls: function () {
      let disabled = [];
      if (this.rssAtomFeedUrls) {
        for (let i = 0; i < this.rssAtomFeedUrls.length; i++) {
          disabled.push(this.rssAtomFeedUrls[i].feedUrl);
        }
      }
      return disabled;
    }
  },
  data() {
    return {
      itemsPerPage: 50,
      currentPage: 0,
      itemCount: 0,
      feedCatalogFilter: '',
      feedCatalogFilterAuthors: [],
      feedCatalogFilterCategories: [],
      feedCatalogFilterLanguages: [],
      feedCatalogFilterDocs: [],
      feedCatalogFilterEncodings: [],
      feedCatalogFilterFeedTypes: [],
      feedCatalogFilterGenerators: [],
      feedCatalogFilterManagingEditors: [],
      feedCatalogFilterWebMasters: [],
    }
  },
  methods: {
    // 
    // pagination 
    // 
    needsPagination() {
      return this.itemCount > this.itemsPerPage;
    },
    getCurrentPage(items) {
      if (items.length !== this.itemCount) {
        this.itemCount = items.length; 
        this.currentPage = 0;
      }
      let startIdx = this.currentPage * 10;
      let endIdx = startIdx + 10;
      return items.slice(startIdx, endIdx);
    },
    firstPage() {
      this.currentPage = 0;
    },
    nextPage() {
      let n = this.currentPage + 1;
      if (n === this.totalPages) {
        n -= 1;
      }
      this.currentPage = n;
    },
    previousPage() {
      let p = this.currentPage - 1;
      if (p < 0) {
        p = 0;
      }
      this.currentPage = p;
    },
    lastPage() {
      this.currentPage = this.totalPages - 1;
    },
    //
    // filtering 
    //  
    hasFeedCatalogFilters() {
      return this.feedCatalogFilterAuthors.length > 0 || 
        this.feedCatalogFilterCategories.length > 0 ||
        this.feedCatalogFilterLanguages.length > 0 ||
        this.feedCatalogFilterDocs.length > 0 ||
        this.feedCatalogFilterEncodings.length > 0 ||
        this.feedCatalogFilterFeedTypes.length > 0 ||
        this.feedCatalogFilterGenerators.length > 0 ||
        this.feedCatalogFilterManagingEditors.length > 0 ||
        this.feedCatalogFilterWebMasters.length > 0;
    },
    updateFeedCatalogFilter(f) {
      if (f.name === "author") { 
        if (this.feedCatalogFilterAuthors.indexOf(f.value) < 0) {
          this.feedCatalogFilterAuthors.push(f.value);
        } else {
          this.removeFilterFromSet(this.feedCatalogFilterAuthors, f.value);
        }
      } else if (f.name === "category") { 
        if (this.feedCatalogFilterCategories.indexOf(f.value) < 0) {
          this.feedCatalogFilterCategories.push(f.value);
        } else  {
          this.removeFilterFromSet(this.feedCatalogFilterCategories, f.value);
        }
      } else if (f.name === "language") { 
        if (this.feedCatalogFilterLanguages.indexOf(f.value) < 0) {
          this.feedCatalogFilterLanguages.push(f.value);
        } else  {
          this.removeFilterFromSet(this.feedCatalogFilterLanguages, f.value);
        }
      } else if (f.name === "docs") { 
        if (this.feedCatalogFilterDocs.indexOf(f.value) < 0) {
          this.feedCatalogFilterDocs.push(f.value);
        } else  {
          this.removeFilterFromSet(this.feedCatalogFilterDocs, f.value);
        }
      } else if (f.name === "encoding") { 
        if (this.feedCatalogFilterEncodings.indexOf(f.value) < 0) {
          this.feedCatalogFilterEncodings.push(f.value);
        } else  {
          this.removeFilterFromSet(this.feedCatalogFilterEncodings, f.value);
        }
      } else if (f.name === "feedType") { 
        if (this.feedCatalogFilterFeedTypes.indexOf(f.value) < 0) {
          this.feedCatalogFilterFeedTypes.push(f.value);
        } else  {
          this.removeFilterFromSet(this.feedCatalogFilterFeedTypes, f.value);
        }
      } else if (f.name === "generator") { 
        if (this.feedCatalogFilterGenerators.indexOf(f.value) < 0) {
          this.feedCatalogFilterGenerators.push(f.value);
        } else  {
          this.removeFilterFromSet(this.feedCatalogFilterGenerators, f.value);
        }
      } else if (f.name === "managingEditor") { 
        if (this.feedCatalogFilterManagingEditors.indexOf(f.value) < 0) {
          this.feedCatalogFilterManagingEditors.push(f.value);
        } else  {
          this.removeFilterFromSet(this.feedCatalogFilterManagingEditors, f.value);
        }
      } else if (f.name === "webMaster") { 
        if (this.feedCatalogFilterWebMasters.indexOf(f.value) < 0) {
          this.feedCatalogFilterWebMasters.push(f.value);
        } else  {
          this.removeFilterFromSet(this.feedCatalogFilterWebMasters, f.value);
        }
      }
    },
    removeFilter(name, f) {
      if (name === "author" && this.feedCatalogFilterAuthors.indexOf(f) >= 0) {
        this.removeFilterFromSet(this.feedCatalogFilterAuthors, f);
      } else if (name === "category" && this.feedCatalogFilterCategories.indexOf(f) >= 0) {
        this.removeFilterFromSet(this.feedCatalogFilterCategories, f);
      } else if (name === "language" && this.feedCatalogFilterLanguages.indexOf(f) >= 0) {
        this.removeFilterFromSet(this.feedCatalogFilterLanguages, f);
      } else if (name === "docs" && this.feedCatalogFilterDocs.indexOf(f) >= 0) {
        this.removeFilterFromSet(this.feedCatalogFilterDocs, f);
      } else if (name === "encoding" && this.feedCatalogFilterEncodings.indexOf(f) >= 0) {
        this.removeFilterFromSet(this.feedCatalogFilterEncodings, f);
      } else if (name === "feedType" && this.feedCatalogFilterFeedTypes.indexOf(f) >= 0) {
        this.removeFilterFromSet(this.feedCatalogFilterFeedTypes, f);
      } else if (name === "generator" && this.feedCatalogFilterGenerators.indexOf(f) >= 0) {
        this.removeFilterFromSet(this.feedCatalogFilterGenerators, f);
      } else if (name === "managingEditor" &&  this.feedCatalogFilterManagingEditors.indexOf(f) >= 0) {
        this.removeFilterFromSet(this.feedCatalogFilterManagingEditors, f);
      } else if (name === "webMaster" && this.feedCatalogFilterWebMasters.indexOf(f) >= 0) {
        this.removeFilterFromSet(this.feedCatalogFilterWebMasters, f);
      }
    },
    removeFilterFromSet(filterSet, filterValue) {
      let idxToSplice = -1;
      for (let i = 0; i < filterSet.length; i++) {
        if (filterSet[i] === filterValue) {
          idxToSplice = i;
          break;
        }
      }
      if (idxToSplice >= 0) {
        filterSet = filterSet.splice(idxToSplice, 1);
      }
    },
    // 
    // utility methods 
    // 
    trimToLength(str, len) {
      if (!str) {
        return str;
      }
      if (str.length < len) {
        return str;
      }
      return str.substring(0, len) + " ...";
    }
  },
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
  border-radius: 4px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
  font-family: Arial, Helvetica, sans-serif;
}

.feed-config-field label {
  font-size: smaller;
}

.feed-config-field > input {
  padding: .44rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 4px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: .125rem;
}

.feed-config-field input:hover, .feed-config-field input:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-config-field input:disabled {
  cursor: auto;
}

.rss-atom-url-wrapper {
  background-color: v-bind('theme.sectionbrighterhighlight');;
  padding: .75rem;
  margin-bottom: .75rem;
  border-radius: 4px;
  border: 1px solid v-bind('theme.sectionbordercolor');
  contain: content;
  overflow: auto;
}

.rss-atom-url-row {
  display: inline-flex;
  flex-direction: row;
  margin-top: .125rem;
  width: 100%;
}

.feed-catalog-filter-pills {
  margin-bottom: .75rem;
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-wrap: wrap;
  gap: .44rem;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 4px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .44rem .75rem;
  user-select: none;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.br-pill:hover, .br-pill:focus-visible {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.add-catalog-feed-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 4px;
  text-align: center;
}

.add-catalog-feed-button:disabled {
  cursor: auto;
}

.add-catalog-feed-button:hover, .add-catalog-feed-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.add-catalog-feed-button:hover:disabled {
  background-color: unset;
}

.feed-catalog-filter {
  text-align: left;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-start;
  margin-top: .125rem;
  margin-bottom: .75rem;
  resize: none;
}

.feed-catalog-filter > input {
  padding: .44rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 4px 0px 0px 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  width: 100%;
}

.feed-catalog-filter input:hover, .feed-catalog-filter > input:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-catalog-filter > input:disabled {
  cursor: auto;
}

.feed-catalog-filter-buttons {
  padding-top: .75rem;
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.feed-catalog-filter-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  text-align: center;
}

.feed-catalog-filter-button:hover, .feed-catalog-filter-button:focus-visible {
  background: v-bind('theme.buttonhighlight');
}

.feed-catalog-filter-button:disabled {
  cursor: auto;
}

.feed-catalog-filter-button:hover:disabled {
  background-color: unset;
}

.feed-catalog-filter-button:last-child {
  border-radius: 0px 3px 3px 0px;
}
</style>
