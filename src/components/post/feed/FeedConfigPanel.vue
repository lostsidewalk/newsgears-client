<template>
  <div class="modal-container" v-if="this.showModal">
    <div class="modal-body">
      <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
      <div class="modal-actions">
        <TabHeader :tabModel="tabModel" 
          :selectedTab="selectedTab" 
          :disabled="disabled || inTransit" 
          :theme="theme" 
          @selectTab="this.selectedTab = $event" />
        <!-- tab panel -->
        <div class="tabbed-panel">
          <!-- tab 1: basic properties -->
          <div class="tab" v-show="this.selectedTab === 'BASIC_PROPERTIES'">
            <!-- feed ident -->
            <FeedConfigTextField 
              ref="feedIdent"
              :label="'QUEUE IDENTIFIER'"
              :required="true"
              :placeholder="'Queue identifier'" 
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedIdent.$model" 
              :errorValue="v$.feedIdent.$errors"
              :helpText="'The queue identifier is a short textual description of this queue.  It is case insensitive, and must container only numbers, letters, dashes, or underscores.  This identifier can used to locate the starred feed for this queue.  Click for more information.'"
              @update:modelValue="v$.feedIdent.$model = $event" />
            <!-- feed title -->
            <FeedConfigTextField 
              :label="'QUEUE TITLE'"
              :required="true"
              :placeholder="'Queue title'" 
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedTitle.$model" 
              :errorValue="v$.feedTitle.$errors"
              :helpText="'The queue title is a textual description of this queue that appears on the queue dashboard.'"
              @update:modelValue="v$.feedTitle.$model = $event" />
            <!-- feed image -->
            <FeedConfigImageField 
              :label="'QUEUE IMAGE'"
              :required="false"
              :baseUrl="baseUrl"
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="this.feedImgSrc"
              @authError="handleAuthError"
              @update:modelValue="this.feedImgSrc = $event" />
            <!-- feed description -->
            <FeedConfigTextField 
              :label="'QUEUE DESCRIPTION'"
              :required="false"
              :placeholder="'Queues description'" 
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedDescription.$model" 
              :errorValue="v$.feedDescription.$errors" 
              :helpText="'This value is a more verbose textual description of this queue.  It appears in the published RSS/ATOM feed for this queue.'"
              @update:modelValue="v$.feedDescription.$model = $event" />
            <!-- feed generator -->
            <FeedConfigTextField 
              :label="'QUEUE FEED GENERATOR'"
              :required="false"
              :placeholder="'Feed generator'" 
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedGenerator.$model" 
              :errorValue="v$.feedGenerator.$errors"
              :helpText="'This value appears as the \'feed generator\' in the published RSS/ATOM feed for this queue.'"
              @update:modelValue="v$.feedGenerator.$model = $event" />
            <!-- feed copyright -->
            <FeedConfigTextField 
              :label="'QUEUE FEED COPYRIGHT'"
              :required="false"
              :placeholder="'Feed copyright'" 
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedCopyright.$model" 
              :errorValue="v$.feedCopyright.$errors" 
              :helpText="'This value appears as the \'feed copyright\' in the published RSS/ATOM feed for this queue.'"
              @update:modelValue="v$.feedCopyright.$model = $event" />
            <!-- feed language -->
            <FeedConfigTextField 
              :label="'STARRED FEED LANGUAGE'"
              :required="false"
              :placeholder="'Feed language'" 
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedLanguage.$model" 
              :errorValue="v$.feedLanguage.$errors" 
              :helpText="'This value appears as the value for the \'language\' field in the published RSS/ATOM feed for this queue.'"
              @update:modelValue="v$.feedLanguage.$model = $event" />
          </div>
          <!-- tab 2: News Discovery -->
          <div class="tab" v-show="this.selectedTab === 'NEWS_DISCOVERY'">
            <!-- NewsApiV2 query text -->
            <FeedConfigTextField 
              :label="'NEWSAPIV2 EXPRESSION'"
              :required="false"
              :placeholder="'NEWSAPIV2 Expression'" 
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.newsApiV2QueryText.$model" 
              :errorValue="v$.newsApiV2QueryText.$errors" 
              :helpText="'This value is a NewsApiV2 search expression.  Click to learn more about how to formulate and use these search expressions.'"
              @update:modelValue="v$.newsApiV2QueryText.$model = $event" />
            <!-- NewsApiV2 sources config -->
            <NewsApiV2SourcesConfig 
              :disabled="disabled || inTransit" 
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
              ref="upstreamRssAtomFeedsConfig"
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :baseUrl="baseUrl"
              :rssAtomFeedUrls="this.rssAtomFeedUrls" 
              @addRssAtomUrl="this.addRssAtomUrl" 
              @showRssAtomUrlBrowser="this.showRssAtomUrlBrowser"
              @deleteRssAtomUrl="this.deleteRssAtomUrl"
              @update:rssAtomFeedUrl="updateRssAtomFeedUrl" 
              @authError="handleAuthError" />
            <div class="feed-catalog-errors" v-if="this.showFeedCatalog && this.feedCatalogErrors.length > 0">
              <div class="error feed-catalog-error" v-for="error in this.feedCatalogErrors" :key="error">
                {{ error }}
              </div>
            </div>
            <UpstreamRssAtomFeedCatalog v-if="this.showFeedCatalog"
              :disabled="disabled || inTransit"
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
          :disabled="disabled || inTransit || v$.$invalid"
          :title="v$.$invalid ? 'Fill out all required fields' : (this.feed.id ? 'Update this feed' : 'Save this feed')"> 
          {{ this.feed.id ? 'Update' : 'Save' }}
        </button>
        <!-- cancel button -->
        <button v-if="!this.showFeedCatalog" class="feed-config-button" 
          @click="cancelFeedConfig" 
          :disabled="disabled || inTransit">
          Cancel
        </button>
        <button v-if="this.showFeedCatalog" class="feed-config-button" 
          @click="cancelRssAtomUrlBrowser" 
          :disabled="disabled || inTransit">
          Return to feed config 
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import TabHeader from '../../layout/TabHeader.vue';
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
    NavbarFixedHeader,
    TabHeader,
    FeedConfigTextField,
    FeedConfigImageField,
    NewsApiV2SourcesConfig,
    UpstreamRssAtomFeedsConfig,
    UpstreamRssAtomFeedCatalog
},
  props: [
    "baseUrl", 
    "disabled", 
    "theme", 
    "allNewsApiV2Sources", 
    "allNewsApiV2Countries", 
    "allNewsApiV2Categories", 
    "allNewsApiV2Languages",
    "rssAtomFeedCatalog"
  ],
  emits: [ "saveOrUpdate", "cancel", "authError" ],
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
      tabModel: [
        {
          "name": "BASIC_PROPERTIES",
          "description": "Feed Properties",
          "icon": "list",
        },
        {
          "name": "NEWS_DISCOVERY",
          "description": "News Discovery",
          "icon": "newspaper-o",
        },
        {
          "name": "RSS_ATOM_DISCOVERY",
          "description": "RSS Feed Discovery",
          "icon": "feed",
        }
      ],
      // 
      inTransit: false, 

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
      r.httpStatusCode = data.httpStatusCode;
      r.httpStatusMessage = data.httpStatusMessage;
      r.redirectFeedUrl = data.redirectFeedUrl;
      r.redirectHttpStatusCode = data.redirectHttpStatusCode;
      r.redirectHttpStatusMessage = data.redirectHttpStatusMessage;
    },
    // modal control methods 
    setup(feed) {
      this.feed = feed;
      this.feedId = feed.id;
      this.feedIdent = feed.ident;
      this.setupFeed();
      this.showModal = true;
      this.$nextTick(() => {
        this.$refs.feedIdent.focus();
      });
    },
    setupQuickAdd(feed) {
      this.feed = feed;
      this.feedId = feed.id;
      this.feedIdent = feed.ident;
      this.setupFeed();
      this.selectedTab = 'RSS_ATOM_DISCOVERY';
      this.addRssAtomUrl();
      this.showModal = true;
      this.$nextTick(() => {
        this.$refs.upstreamRssAtomFeedsConfig.focus();
      })
    },
    tearDown() {
      this.clearModel();
      this.showModal = false;
    },
    error(error) {
      console.error(error); // TODO: fix this 
    },
    // 
    handleAuthError(error) {
      this.$emit('authError', error);
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
        console.log("feed-config-panel: loading feed catalog...");
        this.inTransit = true;
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
              console.error(error);
              if (error.name === 'TypeError') {
                this.feedCatalogErrors.push('Something went wrong.  Please try again later.');
              } else {
                this.feedCatalogErrors.push(error.message);
              }
            }).finally(() => {
              this.inTransit = false;
            });
        }).catch((error) => {
          this.handleAuthError(error);
          this.inTransit = false;
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
    // 
    clearModel() {
      this.selectedTab = 'BASIC_PROPERTIES';  
    }
  }
}
</script>

<style scoped>
.modal-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: fill-available;
  overflow-y: auto;
}

.modal-header {
  text-align: left;
}

.modal-body {
  color: v-bind('theme.normalmessage');
  text-align: left;
  width: 100%;
  height: fit-content;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.modal-actions {
  padding-top: .75rem;
}

.feed-config-button-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  gap: .5rem;
}

.feed-config-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.feed-config-button:disabled {
  cursor: auto;
}

.feed-config-button:hover, .feed-config-button:focus-visible {
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

.tabbed-panel {
  padding: .75rem;
  border-top: 0px;
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
  border-left: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 0px 0px 3px 3px;
  margin-bottom: 1rem;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  min-height: 50vh;
  overflow-y: auto;
}

.tab {
  display: grid;
  contain: content;
}

.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0rem;
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
        top: .75rem;
    }

    12.5% {
        top: 30px;
    }
}

.feed-catalog-errors {
  background-color: v-bind('theme.sectionnegativehighlight');
  padding: .75rem;
  border-radius: 3px;
  margin-bottom: .75rem;
}
</style>
