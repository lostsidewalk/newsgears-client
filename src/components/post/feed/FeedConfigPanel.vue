<template>
  <div class="modal-container" v-if="this.showModal">
    <div class="modal-body">
      <div class="modal-header">
        <h3 class="view-header-no-count">
          <i class="fa fa-feed fa-1x"/>
          {{ this.getModeVerbiage() }}
          <div class="loader" v-if="inTransit">
              <div class="loading_1"></div>
          </div>
        </h3>
      </div>
      <div class="modal-actions">
        <TabHeader :tabModel="tabModel" 
          :selectedTab="selectedTab" 
          :inTransit="inTransit" 
          :theme="theme" 
          @selectTab="this.selectedTab = $event" />
        <!-- tab panel -->
        <div class="tabbed-panel">
          <!-- tab 1: basic properties -->
          <div class="tab" v-show="this.selectedTab === 'BASIC_PROPERTIES'">
            <!-- feed ident -->
            <FeedConfigTextField 
              :label="'FEED IDENTIFIER'"
              :required="true"
              :placeholder="'Feed identifier'" 
              :inTransit="inTransit" 
              :theme="theme" 
              :modelValue="v$.feedIdent.$model" 
              :errorValue="v$.feedIdent.$errors"
              @update:modelValue="v$.feedIdent.$model = $event" />
            <!-- feed title -->
            <FeedConfigTextField 
              :label="'FEED TITLE'"
              :required="true"
              :placeholder="'Feed title'" 
              :inTransit="inTransit" 
              :theme="theme" 
              :modelValue="v$.feedTitle.$model" 
              :errorValue="v$.feedTitle.$errors"
              @update:modelValue="v$.feedTitle.$model = $event" />
            <!-- feed image -->
            <FeedConfigImageField 
              :label="'FEED IMAGE'"
              :required="false"
              :baseUrl="baseUrl"
              :inTransit="inTransit" 
              :theme="theme" 
              :modelValue="this.feedImgSrc"
              @authError="handleAuthError"
              @update:modelValue="this.feedImgSrc = $event" 
              @updateInTransit="this.$emit('updateInTransit', $event)" />
            <!-- feed description -->
            <FeedConfigTextField 
              :label="'FEED DESCRIPTION'"
              :required="false"
              :placeholder="'Feed description'" 
              :inTransit="inTransit" 
              :theme="theme" 
              :modelValue="v$.feedDescription.$model" 
              :errorValue="v$.feedDescription.$errors"
              @update:modelValue="v$.feedDescription.$model = $event" />
            <!-- feed generator -->
            <FeedConfigTextField 
              :label="'FEED GENERATOR'"
              :required="false"
              :placeholder="'Feed generator'" 
              :inTransit="inTransit" 
              :theme="theme" 
              :modelValue="v$.feedGenerator.$model" 
              :errorValue="v$.feedGenerator.$errors"
              @update:modelValue="v$.feedGenerator.$model = $event" />
            <!-- feed copyright -->
            <FeedConfigTextField 
              :label="'FEED COPYRIGHT'"
              :required="false"
              :placeholder="'Feed copyright'" 
              :inTransit="inTransit" 
              :theme="theme" 
              :modelValue="v$.feedCopyright.$model" 
              :errorValue="v$.feedCopyright.$errors"
              @update:modelValue="v$.feedCopyright.$model = $event" />
            <!-- feed language -->
            <FeedConfigTextField 
              :label="'FEED LANGUAGE'"
              :required="false"
              :placeholder="'Feed language'" 
              :inTransit="inTransit" 
              :theme="theme" 
              :modelValue="v$.feedLanguage.$model" 
              :errorValue="v$.feedLanguage.$errors"
              @update:modelValue="v$.feedLanguage.$model = $event" />
          </div>
          <!-- tab 2: News Discovery -->
          <div class="tab" v-show="this.selectedTab === 'NEWS_DISCOVERY'">
            <!-- NewsApiV2 query text -->
            <FeedConfigTextField 
              :label="'NEWSAPIV2 EXPRESSION'"
              :required="false"
              :placeholder="'NEWSAPIV2 Expression'" 
              :inTransit="inTransit" 
              :theme="theme" 
              :modelValue="v$.newsApiV2QueryText.$model" 
              :errorValue="v$.newsApiV2QueryText.$errors"
              @update:modelValue="v$.newsApiV2QueryText.$model = $event" />
            <!-- NewsApiV2 sources config -->
            <NewsApiV2SourcesConfig 
              :inTransit="inTransit" 
              :theme="theme" 
              :allNewsApiV2Languages="this.allNewsApiV2Languages" 
              :allNewsApiV2Countries="this.allNewsApiV2Countries" 
              :allNewsApiV2Categories="this.allNewsApiV2Categories" 
              :allNewsApiV2Sources="this.allNewsApiV2Sources" 
              :newsApiV2Language="this.newsApiV2Language"
              :newsApiV2Country="this.newsApiV2Country"
              :newsApiV2Category="this.newsApiV2Category"
              :newsApiV2Sources="this.newsApiV2Sources"
              @update:newsApiV2Language="this.newsApiV2Language = $event" 
              @update:newsApiV2Country="this.newsApiV2Country = $event" 
              @update:newsApiV2Category="this.newsApiV2Category = $event" 
              @update:newsApiV2Source="this.newsApiV2Sources[$event.source.key] = $event.enabled" />
          </div>
          
          <!-- tab 3: RSS/ATOM Feed Discovery -->
          <div class="tab" v-show="this.selectedTab === 'RSS_ATOM_DISCOVERY'">
            <!-- Upstream RSS/ATOM URLs -->
            <UpstreamRssAtomFeedsConfig v-if="!this.showFeedCatalog" 
              :inTransit="inTransit" 
              :theme="theme" 
              :baseUrl="baseUrl"
              :rssAtomFeedUrls="this.rssAtomFeedUrls" 
              @addRssAtomUrl="this.addRssAtomUrl" 
              @showRssAtomUrlBrowser="this.showRssAtomUrlBrowser"
              @deleteRssAtomUrl="this.deleteRssAtomUrl"
              @updateInTransit="this.$emit('updateInTransit', $event)" 
              @update:rssAtomFeedUrl="updateRssAtomFeedUrl" />
            <div class="feed-catalog-errors" v-if="this.showFeedCatalog && this.feedCatalogErrors.length > 0">
              <div class="error feed-catalog-error" v-for="error in this.feedCatalogErrors" :key="error">
                {{ error }}
              </div>
            </div>
            <UpstreamRssAtomFeedCatalog v-if="this.showFeedCatalog"
              :inTransit="inTransit" 
              :theme="theme"
              :feedCatalog="this.feedCatalog" 
              :rssAtomFeedUrls="this.rssAtomFeedUrls"
              @addCatalogFeed="this.addCatalogFeed" />
          </div>
        </div>
      </div>
      <!-- button panel -->
      <div class="feed-config-button-wrapper">
        <!-- save/update button -->
        <button class="feed-config-button" 
          @click="saveFeedConfig" 
          :disabled="inTransit || v$.$invalid"
          :title="v$.$invalid ? 'Fill out all required fields' : (this.feed.id ? 'Update this feed' : 'Save this feed')"> 
          {{ this.feed.id ? 'Update' : 'Save' }}
        </button>
        <!-- cancel button -->
        <button v-if="!this.showFeedCatalog" class="feed-config-button" 
          @click="cancelFeedConfig" 
          :disabled="inTransit">
          Cancel
        </button>
        <button v-if="this.showFeedCatalog" class="feed-config-button" 
          @click="cancelRssAtomUrlBrowser" 
          :disabled="inTransit">
          Return to feed config 
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TabHeader from './TabHeader.vue';
import FeedConfigTextField from './FeedConfigTextField.vue';
import FeedConfigImageField from './FeedConfigImageField.vue';
import NewsApiV2SourcesConfig from './NewsApiV2SourcesConfig.vue';
import { required, maxLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import UpstreamRssAtomFeedsConfig from './UpstreamRssAtomFeedsConfig.vue';
import UpstreamRssAtomFeedCatalog from './UpstreamRssAtomFeedCatalog.vue';


export default {
  name: "FeedConfigPanel",
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  components: {
    TabHeader,
    FeedConfigTextField,
    FeedConfigImageField,
    NewsApiV2SourcesConfig,
    UpstreamRssAtomFeedsConfig,
    UpstreamRssAtomFeedCatalog
},
  props: [
    "baseUrl", 
    "inTransit", 
    "theme", 
    "allNewsApiV2Sources", 
    "allNewsApiV2Countries", 
    "allNewsApiV2Categories", 
    "allNewsApiV2Languages",
    "rssAtomFeedCatalog"
  ],
  emits: [ "saveOrUpdate", "cancel", "updateInTransit", "authError" ],
  validations() {
    return {
      feedIdent: { 
        required,
        maxLength: maxLength(256),
      },
      feedTitle: { 
        required,
        maxLength: maxLength(512),
      },
      feedDescription: {
        maxLength: maxLength(1024),
      },
      feedGenerator: { 
        maxLength: maxLength(512),
      },
      feedCopyright: {
        maxLength: maxLength(1024),
      },
      feedLanguage: {
        maxLength: maxLength(16),
      },
      newsApiV2QueryText: {
        maxLength: maxLength(512),
      },
    }
  },
  data() {
    return {
      // 
      showModal: false,
      overflowClass: 'hidden',
      tabModel: [
        {
          "name": "BASIC_PROPERTIES",
          "description": "Feed Properties",
          "icon": "list",
        },
        {
          "name": "NEWS_DISCOVERY",
          "description": "News Discovery",
          "icon": "television",
        },
        {
          "name": "RSS_ATOM_DISCOVERY",
          "description": "RSS Feed Discovery",
          "icon": "feed",
        }
      ],
      // basic properties 
      feed: null,
      feedId: null,
      feedIdent: '',
      feedTitle: '',
      feedDescription: '',
      feedGenerator: '',
      feedCopyright: '',
      feedLanguage: '',
      feedImgSrc: '',
      // newsapiv2 query properties 
      newsApiV2QueryText: '',
      newsApiV2Language: '',
      newsApiV2Country: '',
      newsApiV2Category: '',
      newsApiV2Sources: {},
      // RSS/ATOM feed query properties 
      rssAtomFeedUrls: [],
      // currently selected tab 
      selectedTab: 'BASIC_PROPERTIES',
      // feed catalog 
      feedCatalog: null,
      showFeedCatalog: false,
      feedCatalogErrors: [],
    };
  },
  methods: {
    // 
    updateRssAtomFeedUrl(data) {
      let r = this.getRssAtomFeedUrlById(data.id);
      if (!r) {
        return;
      }
      if (data.error) {
        r.error = data.error;
      }
      r.title = data.title;
      r.description = data.description;
      r.author = data.author;
      r.categories = data.categories;
      r.copyright = data.copyright;
      r.docs = data.docs;
      r.encoding = data.encoding;
      r.feedType = data.feedType;
      r.generator = data.generator;
      r.icon = data.icon;
      r.image = data.image;
      r.language = data.language;
      r.link = data.link;
      r.managingEditor = data.managingEditor;
      r.publishedDate = data.publishedDate;
      r.styleSheet = data.styleSheet;
      r.supportedTypes = data.supportedTypes;
      r.webMaster = data.webMaster;
      r.sampleEntries = data.sampleEntries;
      r.discoveryUrl = data.feedUrl;
    },
    // modal control methods 
    show(feed) {
      this.feed = feed;
      this.feedId = feed.id;
      this.feedIdent = feed.ident;
      this.setupFeed();
      this.showModal = true;
      this.overflowClass = 'hidden';
    },
    hide() {
      this.showModal = false;
      this.overflowClass = 'scroll';
    },
    error(error) {
      console.log("MODAL SHOWING ERROR: " + error.toString());
    },
    // 
    handleAuthError(error) {
      this.$emit('authError', error);
      this.$emit('updateInTransit', false);
    },
    getModeVerbiage() {
      if (this.feedId) {
        return 'CONFIGURE ' + this.feedIdent;
      } else {
        return 'CREATE A NEW FEED';
      }
    },
    setupFeed() {
      // setup feed 
      this.feedId = this.feed.id;
      this.feedIdent = this.feed.ident;
      this.feedTitle = this.feed.title;
      this.feedDescription = this.feed.description;
      this.feedGenerator = this.feed.generator;
      this.feedCopyright = this.feed.copyright;
      this.feedLanguage = this.feed.language;
      this.feedImgSrc = this.feed.feedImgSrc; // TODO: annoyingly redundant use of 'feed' here; fix on the backend 
      this.newsApiV2QueryText = this.feed.newsApiV2QueryText;
      this.newsApiV2Language = this.feed.newsApiV2Language || '';
      this.newsApiV2Country = this.feed.newsApiV2Country || '';
      this.newsApiV2Category = this.feed.newsApiV2Category || '';

      let sourcesConfig = this.feed.newsApiV2Sources;
      if (sourcesConfig) {
        for (let i = 0; i < sourcesConfig.length; i++) {
          this.newsApiV2Sources[sourcesConfig[i]] = true;
        }
      }

      this.rssAtomFeedUrls = JSON.parse(JSON.stringify(this.feed.rssAtomFeedUrls));
    },
    saveFeedConfig() {
      let newsApiV2SourcesObj = [];
      let sourceKeys = Object.keys(this.newsApiV2Sources);
      for (let i = 0; i < sourceKeys.length; i++) {
        if (this.newsApiV2Sources[sourceKeys[i]] === true) {
          newsApiV2SourcesObj.push(sourceKeys[i]);
        }
      }

      let saveObj = {
        id: this.feedId,
        ident: this.feedIdent,
        title: this.feedTitle,
        description: this.feedDescription,
        generator: this.feedGenerator,
        copyright: this.feedCopyright,
        language: this.feedLanguage,
        imgSrc: this.feedImgSrc,
        newsApiV2QueryText: this.newsApiV2QueryText,
        newsApiV2Sources: newsApiV2SourcesObj,
        newsApiV2Language: this.newsApiV2Language.length > 0 ? this.newsApiV2Language : null,
        newsApiV2Country: this.newsApiV2Country.length > 0 ? this.newsApiV2Country : null,
        newsApiV2Category: this.newsApiV2Category.length > 0 ? this.newsApiV2Category : null,
        rssAtomFeedUrls: this.rssAtomFeedUrls.filter(r => r.feedUrl && r.feedUrl.length),
      };
      this.$emit('saveOrUpdate', saveObj);
    },
    cancelFeedConfig() {
      this.$emit('cancel'); 
    },
    addRssAtomUrl() {
      if (!this.rssAtomFeedUrls) {
        this.rssAtomFeedUrls = [];
      }
      this.rssAtomFeedUrls.unshift({
        id: Math.floor(Math.random() * 1000000000)
      });
    },
    showRssAtomUrlBrowser() {
      this.showFeedCatalog = true;
      if (!this.feedCatalog) {
        console.log("loading feed catalog...");
        this.$emit('updateInTransit', true);
        this.$auth.getTokenSilently().then((token) => {
          const requestOptions = {
              method: 'GET',
              headers: { 
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include',
            };
            fetch(this.baseUrl + "/catalog", requestOptions)
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else { // framework is rejecting the request 
                throw Error('We weren\'t able to fetch our feed catalog.  Please try again later.');
              }
            }).then((data) => {
              this.feedCatalog = data;
              for (let i = 0; i < this.feedCatalog.length; i++) {
                let c = this.feedCatalog[i];
                c.discoveryUrl = c.feedUrl;
              }
            }).catch((error) => {
              console.log(error);
              if (error.name === 'TypeError') {
                this.feedCatalogErrors.push('Something went wrong.  Please try again later.');
              } else {
                this.feedCatalogErrors.push(error.message);
              }
            }).finally(() => {
              this.$emit('updateInTransit', false);
            });
        }).catch((error) => {
          this.handleAuthError(error);
        })
        this.feedCatalog = [];
      }
    },
    addCatalogFeed(source) {
      source.id = Math.floor(Math.random() * 1000000000);
      this.rssAtomFeedUrls.unshift(source);
    },
    cancelRssAtomUrlBrowser() {
      this.showFeedCatalog = false;
    },
    deleteRssAtomUrl(id) {
      let deleteIdx = -1;
      for (let i = 0; i < this.rssAtomFeedUrls.length; i++) {
        if (this.rssAtomFeedUrls[i].id === id) {
          deleteIdx = i;
          break;
        }
      }
      if (deleteIdx > -1) {
        this.rssAtomFeedUrls.splice(deleteIdx, 1);
      }
    },
    getRssAtomFeedUrlById(id) {
      for (let i = 0; i < this.rssAtomFeedUrls.length; i++) {
        if (this.rssAtomFeedUrls[i].id === id) {
          return this.rssAtomFeedUrls[i];
        }
      }
    },
  }
}
</script>

<style scoped>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0,0,0,0.8);
}

.modal-header {
  text-align: left;
}

.modal-body {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  color: v-bind('theme.normalmessage');
  text-align: left;
  width: 75%;
  padding: 32px;
  border: 1px solid v-bind('theme.buttonborder');
  border-radius: 5px;
}

.modal-actions {
  padding-top: 10px;
  /* display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center; */
}

.feed-config-button-wrapper {
  display: inline-grid;
  grid-auto-flow: column;
  grid-column-gap: 10px;
}

.feed-config-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  text-align: center;
  font-size: unset;
}

.feed-config-button:disabled {
  cursor: auto;
}

.feed-config-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.feed-config-button:hover:disabled {
  background-color: unset;
}

.error > input, .error > textarea {
  border: 1px solid v-bind('theme.errorborder') !important;
  box-shadow: 1px 1px 1px v-bind('theme.errorshadow') !important;
  background-color: v-bind('theme.errorbg') !important;
}

.feed-config-errors {
  margin-top: 5px;
}

.tabbed-panel {
  padding: 10px;
  border-top: 0px;
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
  border-left: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 0px 0px 3px 3px;
  margin-bottom: 15px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  min-height: 50vh;
  max-height: 50vh;
  overflow-y: scroll;
}

.tab {
  display: grid;
  contain: content;
}

.feed-config-item-label > input:disabled {
  cursor: auto;
}

.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: large;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0px;
  overflow: hidden;
}

.loader {
    width: 100%;
    position: relative;
}

.loader .loading_1 {
    position: relative;
    height: 1px;
    animation: turn 4s linear 1.75s infinite;
}

.loader .loading_1:before {
    content: "";
    display: block;
    position: absolute;
    width: 0;
    height: 100%;
    background-color: v-bind('theme.navbarshadow');
    animation: load 2s linear infinite;
}

@keyframes load {
    0% {
        width: 0%;
    }

    87.5% {
        width: 100%;
    }
}

@keyframes turn {
    0% {
        transform: rotateY(0deg);
    }

    6.25%,
    50% {
        transform: rotateY(180deg);
    }

    56.25%,
    100% {
        transform: rotateY(360deg);
    }
}

@keyframes bounce {

    0%,
    100% {
        top: 10px;
    }

    12.5% {
        top: 30px;
    }
}

.feed-catalog-errors {
  background-color: v-bind('theme.sectionnegativehighlight');
  padding: 10px;
  border-radius: 3px;
  margin-bottom: 10px;
}


</style>
