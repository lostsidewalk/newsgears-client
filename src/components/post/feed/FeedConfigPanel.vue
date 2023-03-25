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
              :required="true"
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
          <!-- tab 3: RSS/ATOM Feed Discovery -->
          <div class="tab" v-show="this.selectedTab === 'RSS_ATOM_DISCOVERY'">
            <!-- Upstream RSS/ATOM URLs -->
            <UpstreamSourcesConfig 
              ref="upstreamSourcesConfig"
              :disabled="disabled || inTransit" 
              :theme="theme" 
              :baseUrl="baseUrl"
              :rssAtomFeedUrls="this.rssAtomFeedUrls" 
              @addRssAtomUrl="this.addRssAtomUrl" 
              @deleteRssAtomUrl="this.deleteRssAtomUrl"
              @update:rssAtomFeedUrl="updateRssAtomFeedUrl" 
              @authError="handleAuthError" />
          </div>
        </div>
      </div>
      <!-- button panel -->
      <div class="feed-config-button-wrapper">
        <!-- save/update button -->
        <button class="feed-config-button accessible-button" 
          @click="saveFeedConfig" 
          :disabled="disabled || inTransit || v$.$invalid"
          :title="v$.$invalid ? this.$t('fillOutAllRequiredFields') : (this.feed.id ? this.$t('updateThisQueue') : this.$t('saveThisQueue'))"> 
          {{ this.feed.id ? this.$t('update') : this.$t('save') }}
        </button>
        <!-- cancel button -->
        <button class="feed-config-button accessible-button" 
          @click="cancelFeedConfig" 
          :disabled="disabled || inTransit">
          {{ this.$t('cancel') }}
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
import { required, maxLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import UpstreamSourcesConfig from './UpstreamSourcesConfig.vue';


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
    UpstreamSourcesConfig,
},
  props: [
    "baseUrl", 
    "disabled", 
    "theme", 
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
    }
  },
  data() {
    return {
      // 
      showModal: false,
      tabModel: [
        {
          "name": "BASIC_PROPERTIES",
          "description": this.$t('queueProperties'),
          "icon": "list",
        },
        {
          "name": "RSS_ATOM_DISCOVERY",
          "description": this.$t('rssFeedDiscovery'),
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
      // RSS/ATOM feed query properties 
      rssAtomFeedUrls: [],
      // currently selected tab 
      selectedTab: 'BASIC_PROPERTIES',
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
      r.feedUrl = data.feedUrl; // updated the feed URL to the resolved URL 
      r.username = data.username;
      r.password = data.password;
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
        this.$refs.upstreamSourcesConfig.focus();
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
      this.rssAtomFeedUrls = JSON.parse(JSON.stringify(this.feed.rssAtomFeedUrls));
    },
    saveFeedConfig() {
      let saveObj = {
        id: this.feedId,
        ident: this.feedIdent,
        title: this.feedTitle,
        description: this.feedDescription,
        generator: this.feedGenerator,
        copyright: this.feedCopyright,
        language: this.feedLanguage,
        imgSrc: this.feedImgSrc,
        rssAtomFeedUrls: this.rssAtomFeedUrls,
      };
      this.$emit('saveOrUpdate', saveObj);
    },
    cancelFeedConfig() {
      this.$emit('cancel'); 
    },
    addRssAtomUrl(source) {
      if (!this.rssAtomFeedUrls) {
        this.rssAtomFeedUrls = [];
      }
      if (source === undefined) {
        source = {};
      }
      source.id = Math.floor(Math.random() * 1000000000);
      this.rssAtomFeedUrls.unshift(source);
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
  font-family: Arial, Helvetica, sans-serif;
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
  border-top: 0px;
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
  border-left: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 0px 0px 3px 3px;
  margin-bottom: 1rem;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  min-height: 50svh;
  overflow-y: auto;
}

.tab {
  display: grid;
  contain: content;
  max-height: 50svh;
  overflow: auto;
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
