<template>
  <div class="modal-container" v-if="this.showModal">
    <div class="modal-body">
      <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
      <div class="modal-actions">
        <!-- button panel -->
        <div class="feed-config-button-wrapper">
          <!-- 'dismiss' button -->
          <button class="feed-config-button accessible-button"
            @click="dismissFeedConfig"
            :disabled="disabled || inTransit">
            {{ this.$t('dismiss') }}
          </button>
          <!-- save/update button -->
          <button v-show="this.selectedTab === 'QUEUE_PROPERTIES'"
            class="feed-config-button accessible-button"
            @click="saveFeedConfig"
            :disabled="disabled || inTransit || v$.$invalid"
            :title="v$.$invalid ? this.$t('fillOutAllRequiredFields') : this.feed.id ? this.$t('updateThisQueue') : this.$t('saveThisQueue')">
            {{ this.feed.id ? this.$t("update") : this.$t("save") }}
          </button>
          <!-- save/update and close button -->
          <button v-show="this.selectedTab === 'QUEUE_PROPERTIES'"
            class="feed-config-button accessible-button"
            @click="saveFeedConfigAndDismiss"
            :disabled="disabled || inTransit || v$.$invalid"
            :title="v$.$invalid ? this.$t('fillOutAllRequiredFields') : this.feed.id ? this.$t('updateThisQueueAndClose') : this.$t('saveThisQueueAndClose')">
            {{ this.feed.id ? this.$t("updateAndClose") : this.$t("saveAndClose") }}
          </button>
        </div>
        <TabHeader :tabModel="tabModel" 
          :selectedTab="selectedTab" 
          :disabled="disabled || inTransit" 
          :theme="theme" 
          @selectTab="this.selectedTab = $event" />
        <!-- tab panel -->
        <div class="tabbed-panel">
          <!-- tab 1: subscription config, collection browser, catalog search -->
          <div class="tab" v-if="this.feed.id" v-show="this.selectedTab === 'SUBSCRIPTION_CONFIG'">
            <!-- subscriptions config -->
            <SubscriptionsConfig
              ref="subscriptionsConfig"
              :baseUrl="baseUrl"
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :rssAtomFeedUrls="this.rssAtomFeedUrls" 
              :feedId="this.feed.id"
              @addRssAtomUrl="addRssAtomUrl" 
              @deleteRssAtomUrl="deleteRssAtomUrl" 
              @updateRssAtomUrlAuth="updateRssAtomUrlAuth"
              @authError="handleAuthError" 
              @updateServerMessage="setLastServerMessage" 
              @dismiss="dismissFeedConfig" /> 
          </div>
          <div class="tab" v-if="this.feed.id" v-show="this.selectedTab === 'BROWSE_COLLECTIONS'">
            <!-- collections browser -->
            <FeedCollectionsBrowser
              :baseUrl="baseUrl" 
              :disabled="disabled || inTransit"
              :theme="theme"
              :rssAtomFeedUrls="this.rssAtomFeedUrls"
              :feedId="this.feed.id"
              @addRssAtomUrl="addRssAtomUrl" 
              @addRssAtomUrls="addRssAtomUrls" 
              @authError="handleAuthError" 
              @updateServerMessage="setLastServerMessage" 
              @dismiss="dismissFeedConfig" />
          </div>
          <div class="tab" v-if="this.feed.id" v-show="this.selectedTab === 'SEARCH_CATALOG'">
            <!-- catalog search -->
            <FeedCatalogSearch
              :disabled="disabled || inTransit"
              :theme="theme"
              :rssAtomFeedUrls="this.rssAtomFeedUrls"
              @addCatalogFeed="addCatalogFeed"
              @deleteRssAtomUrl="deleteRssAtomUrl" />
          </div>
          <!-- tab 2: queue properties -->
          <div class="tab" v-show="this.selectedTab === 'QUEUE_PROPERTIES'">
            <!-- TODO: (refactor) extract component -->
            <!-- feed ident -->
            <FeedConfigTextField 
              ref="feedIdent"
              :label="this.$t('queueIdentifier')"
              :required="true"
              :placeholder="this.$t('queueIdentifier')" 
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedIdent.$model" 
              :errorValue="v$.feedIdent.$errors"
              :helpText="this.$t('queueIdentifierHelpText')"
              @update:modelValue="v$.feedIdent.$model = $event" />
            <!-- feed title -->
            <FeedConfigTextField 
              :label="this.$t('queueTitle')"
              :required="false"
              :placeholder="this.$t('queueTitle')" 
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedTitle.$model" 
              :errorValue="v$.feedTitle.$errors"
              :helpText="this.$t('queueTitleHelpText')"
              @update:modelValue="v$.feedTitle.$model = $event" />
            <!-- feed image -->
            <FeedConfigImageField 
              :label="this.$t('queueImage')"
              :required="false"
              :baseUrl="baseUrl"
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="this.feedImgSrc"
              @authError="handleAuthError"
              @update:modelValue="this.feedImgSrc = $event" />
            <!-- feed description -->
            <FeedConfigTextField 
              :label="this.$t('queueDescription')"
              :required="false"
              :placeholder="this.$t('queueDescription')"
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedDescription.$model" 
              :errorValue="v$.feedDescription.$errors" 
              :helpText="this.$t('queueDescriptionHelpText')"
              @update:modelValue="v$.feedDescription.$model = $event" />
            <!-- feed generator -->
            <FeedConfigTextField 
              :label="this.$t('queueFeedGenerator')"
              :required="false"
              :placeholder="this.$t('queueFeedGenerator')"
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedGenerator.$model" 
              :errorValue="v$.feedGenerator.$errors"
              :helpText="this.$t('queueFeedGeneratorHelpText')"
              @update:modelValue="v$.feedGenerator.$model = $event" />
            <!-- feed copyright -->
            <FeedConfigTextField 
              :label="this.$t('queueFeedCopyright')"
              :required="false"
              :placeholder="this.$t('queueFeedCopyright')"
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedCopyright.$model" 
              :errorValue="v$.feedCopyright.$errors" 
              :helpText="this.$t('queueFeedCopyrightHelpText')"
              @update:modelValue="v$.feedCopyright.$model = $event" />
            <!-- feed language -->
            <FeedConfigTextField 
              :label="this.$t('queueFeedLanguage')"
              :required="false"
              :placeholder="this.$t('queueFeedLanguage')"
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :modelValue="v$.feedLanguage.$model" 
              :errorValue="v$.feedLanguage.$errors" 
              :helpText="this.$t('queueFeedLanguageHelpText')"
              @update:modelValue="v$.feedLanguage.$model = $event" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import TabHeader from '@/components/layout/TabHeader.vue';
import FeedConfigTextField from '@/components/feed-config-panel/FeedConfigTextField.vue';
import FeedConfigImageField from '@/components/feed-config-panel/FeedConfigImageField.vue';
import { required, maxLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import SubscriptionsConfig from '@/components/feed-config-panel/SubscriptionsConfig.vue';
import FeedCollectionsBrowser from '@/components/feed-config-panel/FeedCollectionsBrowser.vue';
import FeedCatalogSearch from '@/components/feed-config-panel/FeedCatalogSearch.vue';


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
    SubscriptionsConfig,
    FeedCollectionsBrowser,
    FeedCatalogSearch,
  },
  props: [
    "baseUrl", 
    "disabled", 
    "theme", 
    "rssAtomFeedCatalog",
  ],
  computed: {
    tabModel: function() {
      let arr = [];
      if (this.feed.id) {
        arr.push({
          name: "SUBSCRIPTION_CONFIG",
          description: this.$t('rssFeedDiscovery'),
          icon: "feed",
        });
        arr.push({
          name: "BROWSE_COLLECTIONS",
          description: this.$t('browseFeedCollections'),
          icon: "list",
        });
        arr.push({
          name: "QUEUE_PROPERTIES",
          description: this.$t('queueProperties'),
          icon: "list",
        });
        // {
        //   name: "CATALOG_SEARCH",
        //   description: this.$t('searchFeedCatalog'),
        //   icon: "search",
        // },
      }
      return arr;
    }
  },
  emits: [ "saveOrUpdate", "dismiss", "authError", "updateServerMessage", "refreshFeedDefinition" ],
  validations() {
    return {
      feedIdent: { 
        required,
        maxLength: maxLength(256),
      },
      feedTitle: { 
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
    }
  },
  data() {
    return {
      // 
      showModal: false,
      // 
      inTransit: false, 
      // queue properties 
      feed: null,
      feedId: null,
      feedIdent: '',
      feedTitle: '',
      feedDescription: '',
      feedGenerator: '',
      feedCopyright: '',
      feedLanguage: '',
      feedImgSrc: '',
      // RSS/ATOM feed query properties 
      rssAtomFeedUrls: [],
      // currently selected tab 
      selectedTab: null,
    };
  },
  methods: {
    // modal control methods 

    // setup is called to initialize the panel for either a create or update operation 
    setup(feed) {
      this.feed = feed;
      this.setupFeed();
      this.clearModel();
      this.showModal = true;
      this.$nextTick(() => {
        this.$refs.feedIdent.focus();
      });
    },
    // this is called on callback when a feed is successfully created; 
    // it enables the user to start adding subscriptions to newly created queue 
    setupSubscriptionConfig(feedId) {
      if (this.feed) {
        this.feed.id = feedId;
      }
      this.selectedTab = 'SUBSCRIPTION_CONFIG';
      this.$nextTick(() => {
        this.$refs.subscriptionsConfig.focus();
      });
    },
    setupQuickAdd(feed) {
      this.feed = feed;
      this.setupFeed();
      this.selectedTab = 'SUBSCRIPTION_CONFIG';
      this.showModal = true;
      this.$nextTick(() => {
        this.$refs.subscriptionsConfig.focus();
      });
    },
    tearDown() {
      this.clearModel();
      this.showModal = false;
    },
    // 
    handleAuthError(error) {
      this.$emit('authError', error);
    },
    setLastServerMessage(message) {
      if (message) {
        this.$emit('updateServerMessage', message);
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
      this.feedImgSrc = this.feed.feedImgSrc; 
      this.rssAtomFeedUrls = this.feed.rssAtomFeedUrls;
    },
    saveFeedConfig() {
      let saveObj = {
        ident: this.feedIdent,
        title: this.feedTitle,
        description: this.feedDescription,
        generator: this.feedGenerator,
        copyright: this.feedCopyright,
        language: this.feedLanguage,
        imgSrc: this.feedImgSrc,
        rssAtomFeedUrls: this.rssAtomFeedUrls,
      };
      if (this.feedId) {
        saveObj.id = this.feedId;
      }
      this.$emit('saveOrUpdate', saveObj);
    },
    saveFeedConfigAndDismiss() {
      this.saveFeedConfig();
      this.$emit('dismiss');
    },
    dismissFeedConfig() {
      this.$emit('dismiss'); 
    },
    // TODO: not yet implemented 
    addCatalogFeed(source) {
      console.log("add catalog feed, source=" + JSON.stringify(source));
    },
    addRssAtomUrl(source) {
      if (!this.rssAtomFeedUrls) {
        this.rssAtomFeedUrls = [];
      }
      if (source === undefined) {
        source = {};
      } else {
        source = JSON.parse(JSON.stringify(source));
      }
      let qd = source.queryDefinition;
      let r = {
        id: qd.id,
        feedUrl: qd.queryText,
        feedId: qd.feedId,
      }
      // title
      let queryTitle = qd.queryTitle;
      if (queryTitle) {
        r.title = {
          value: qd.queryTitle
        }
      }
      // auth 
      let queryConfig = qd.queryConfig ? JSON.parse(qd.queryConfig) : qd.queryConfig;
      if (queryConfig) {
        r.username = queryConfig.username;
        r.password = queryConfig.password;
      }
      // image 
      let queryDefinitionImageUrl = source.queryDefinitionImageUrl;
      if (queryDefinitionImageUrl) {
        r.image = {
          title: null,
          url: queryDefinitionImageUrl,
        }
      }

      this.rssAtomFeedUrls.unshift(r);
      
      this.$emit('refreshFeedDefinition', this.feed.id);
    },
    // TODO: not yet implemented 
    addRssAtomUrls(source) {
      console.log("adding collection from source: " + JSON.stringify(source));
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
        this.$emit('refreshFeedDefinition', this.feed.id);
      }
    },
    updateRssAtomUrlAuth(source) {
      let updateIdx = -1;
      let qd = source.queryDefinition;
      for (let i = 0; i < this.rssAtomFeedUrls.length; i++) {
        if (this.rssAtomFeedUrls[i].id === qd.id) {
          updateIdx = i;
          break;
        }
      }
      if (updateIdx > -1) {
        let queryConfigStr = qd.queryConfig;
        if (queryConfigStr) {
          let queryConfig = JSON.parse(queryConfigStr);
          this.rssAtomFeedUrls[updateIdx].username = queryConfig.username;
          this.rssAtomFeedUrls[updateIdx].password = queryConfig.password;
        } else {
          this.rssAtomFeedUrls[updateIdx].username = null;
          this.rssAtomFeedUrls[updateIdx].password = null;
        }
        this.$emit('refreshFeedDefinition', this.feed.id);
      }
    },
    // 
    clearModel() {
      if (this.feedId) {
        this.selectedTab = 'SUBSCRIPTION_CONFIG';
      } else {
        this.selectedTab = 'QUEUE_PROPERTIES';
      }
    }
  }
}
</script>

<style scoped>
.modal-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: fill-available;
  overflow-y: auto;
  font-family: Arial, Helvetica, sans-serif;
}

.modal-body {
  color: v-bind('theme.normalmessage');
  text-align: left;
  width: 100%;
  height: fit-content;
}

.modal-actions {
  padding: .56rem;
}

.feed-config-button-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  gap: .5rem;
  margin-bottom: 1rem;
}

.feed-config-button {
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

.feed-config-button:disabled {
  cursor: auto;
}

.feed-config-button:hover, .feed-config-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.feed-config-button:hover:disabled {
  background-color: unset;
}

.tabbed-panel {
  padding: .75rem;
  border: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 3px;
  margin-bottom: 1rem;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  background-color: v-bind('theme.sectionhighlight');
}

.tab {
  display: grid;
  contain: content;
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
</style>
