<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="view-header-no-count">
        <v-icon icon="fa-rss"/>
        {{ this.$t('queueSettings') }}
      </h3>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- tab panel -->
      <v-tabs v-model="this.selectedTab">
        <!-- tab 1: subscription config -->
        <v-tab key="SUBSCRIPTIONS" value="SUBSCRIPTIONS">
          SUBSCRIPTIONS
        </v-tab>
        <!-- tab 4: queue properties -->
        <v-tab key="QUEUE_PROPERTIES" value="QUEUE_PROPERTIES">
          QUEUE PROPERTIES 
        </v-tab>
      </v-tabs>
      <v-window v-model="this.selectedTab">
        <v-window-item key="SUBSCRIPTIONS" value="SUBSCRIPTIONS">
          <!-- subscription config -->
          <SubscriptionsConfig
            v-if="this.feed"
            ref="subscriptionsConfig"
            :baseUrl="baseUrl"
            :theme="theme" 
            :rssAtomFeedUrls="this.rssAtomFeedUrls" 
            :feedId="this.feed.id"
            @addRssAtomUrl="addRssAtomUrl" 
            @deleteRssAtomUrl="deleteRssAtomUrl" 
            @updateRssAtomUrlAuth="updateRssAtomUrlAuth"
            @authError="handleAuthError" 
            @updateServerMessage="setLastServerMessage" /> 
        </v-window-item>
        <v-window-item key="QUEUE_PROPERTIES" value="QUEUE_PROPERTIES">
          <!-- feed ident -->
          <FeedConfigTextField 
            :label="this.$t('queueIdentifier')"
            :required="true"
            :placeholder="this.$t('queueIdentifier')" 
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
            :theme="theme" 
            :modelValue="this.feedImgSrc"
            @authError="handleAuthError"
            @update:modelValue="this.feedImgSrc = $event" />
          <!-- feed description -->
          <FeedConfigTextField 
            :label="this.$t('queueDescription')"
            :required="false"
            :placeholder="this.$t('queueDescription')"
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
            :theme="theme" 
            :modelValue="v$.feedLanguage.$model" 
            :errorValue="v$.feedLanguage.$errors" 
            :helpText="this.$t('queueFeedLanguageHelpText')"
            @update:modelValue="v$.feedLanguage.$model = $event" />
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-divider />
    <!-- button panel -->
    <v-card-actions>
      <!-- 'dismiss' button -->
      <v-btn @click="dismissFeedConfig"
        :text="this.$t('dismiss')" />
    </v-card-actions>
  </v-card>
</template>

<script>
import FeedConfigTextField from '@/components/feed-config-panel/FeedConfigTextField.vue';
import FeedConfigImageField from '@/components/feed-config-panel/FeedConfigImageField.vue';
import { required, maxLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import SubscriptionsConfig from '@/components/feed-config-panel/SubscriptionsConfig.vue';


export default {
  name: "FeedConfigPanel",
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  components: {
    FeedConfigTextField,
    FeedConfigImageField,
    SubscriptionsConfig,
  },
  props: [
    "baseUrl", 
    "theme", 
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
          name: "QUEUE_PROPERTIES",
          description: this.$t('queueProperties'),
          icon: "list",
        });
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
      tabs: null,
      // 
      showModal: false,
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
    // setup is called to initialize the panel for either a create or update operation 
    setup(feed) {
      this.feed = feed;
      this.setupFeed();
      this.clearModel();
      this.showModal = true;
    },
    // this is called on callback when a feed is successfully created; 
    // it enables the user to start adding subscriptions to newly created queue 
    setupSubscriptionConfig(feedId) {
      if (this.feed) {
        this.feed.id = feedId;
      }
      this.$nextTick(() => {
        this.$refs.subscriptionsConfig.focus();
      });
    },
    setupQuickAdd(feed) {
      this.feed = feed;
      this.setupFeed();
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
    // TODO: not yet implemented 
    clearModel() {
    }
  }
}
</script>

<style scoped>
.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>