<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="view-header-no-count">
        <v-icon icon="fa-rss" />
        {{ $t('queueSettings') }}
      </h3>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- tab panel -->
      <v-tabs v-model="selectedTab">
        <!-- tab 1: subscription config -->
        <v-tab
          key="SUBSCRIPTIONS"
          value="SUBSCRIPTIONS"
        >
          SUBSCRIPTIONS
        </v-tab>
        <!-- tab 4: queue properties -->
        <v-tab
          key="QUEUE_PROPERTIES"
          value="QUEUE_PROPERTIES"
        >
          QUEUE PROPERTIES 
        </v-tab>
      </v-tabs>
      <v-window v-model="selectedTab">
        <v-window-item
          key="SUBSCRIPTIONS"
          value="SUBSCRIPTIONS"
        >
          <!-- subscription config -->
          <SubscriptionsConfig
            v-if="feed"
            ref="subscriptionsConfig"
            :base-url="baseUrl"
            :rss-atom-feed-urls="rssAtomFeedUrls" 
            :feed-id="feed.id"
            @addRssAtomUrl="addRssAtomUrl" 
            @deleteRssAtomUrl="deleteRssAtomUrl" 
            @updateRssAtomUrlAuth="updateRssAtomUrlAuth"
            @authError="handleAuthError" 
            @updateServerMessage="setLastServerMessage"
          /> 
        </v-window-item>
        <v-window-item
          key="QUEUE_PROPERTIES"
          value="QUEUE_PROPERTIES"
        >
          <!-- feed ident -->
          <FeedConfigTextField 
            :label="$t('queueIdentifier')"
            :required="true"
            :placeholder="$t('queueIdentifier')" 
            :model-value="v$.feedIdent.$model" 
            :error-value="v$.feedIdent.$errors"
            :help-text="$t('queueIdentifierHelpText')"
            @update:modelValue="v$.feedIdent.$model = $event"
          />
          <!-- feed title -->
          <FeedConfigTextField 
            :label="$t('queueTitle')"
            :required="false"
            :placeholder="$t('queueTitle')" 
            :model-value="v$.feedTitle.$model" 
            :error-value="v$.feedTitle.$errors"
            :help-text="$t('queueTitleHelpText')"
            @update:modelValue="v$.feedTitle.$model = $event"
          />
          <!-- feed image -->
          <FeedConfigImageField 
            :label="$t('queueImage')"
            :required="false"
            :base-url="baseUrl"
            :model-value="feedImgSrc"
            @authError="handleAuthError"
            @update:modelValue="feedImgSrc = $event"
          />
          <!-- feed description -->
          <FeedConfigTextField 
            :label="$t('queueDescription')"
            :required="false"
            :placeholder="$t('queueDescription')"
            :model-value="v$.feedDescription.$model" 
            :error-value="v$.feedDescription.$errors" 
            :help-text="$t('queueDescriptionHelpText')"
            @update:modelValue="v$.feedDescription.$model = $event"
          />
          <!-- feed generator -->
          <FeedConfigTextField 
            :label="$t('queueFeedGenerator')"
            :required="false"
            :placeholder="$t('queueFeedGenerator')"
            :model-value="v$.feedGenerator.$model" 
            :error-value="v$.feedGenerator.$errors"
            :help-text="$t('queueFeedGeneratorHelpText')"
            @update:modelValue="v$.feedGenerator.$model = $event"
          />
          <!-- feed copyright -->
          <FeedConfigTextField 
            :label="$t('queueFeedCopyright')"
            :required="false"
            :placeholder="$t('queueFeedCopyright')"
            :model-value="v$.feedCopyright.$model" 
            :error-value="v$.feedCopyright.$errors" 
            :help-text="$t('queueFeedCopyrightHelpText')"
            @update:modelValue="v$.feedCopyright.$model = $event"
          />
          <!-- feed language -->
          <FeedConfigTextField 
            :label="$t('queueFeedLanguage')"
            :required="false"
            :placeholder="$t('queueFeedLanguage')"
            :model-value="v$.feedLanguage.$model" 
            :error-value="v$.feedLanguage.$errors" 
            :help-text="$t('queueFeedLanguageHelpText')"
            @update:modelValue="v$.feedLanguage.$model = $event"
          />
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn
        :text="$t('dismiss')"
        @click="$emit('dismiss')"
      />
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
  components: {
    FeedConfigTextField,
    FeedConfigImageField,
    SubscriptionsConfig,
  },
  props: {
    baseUrl: { type: String, required: true },
  },
  emits: [ "saveOrUpdate", "dismiss", "authError", "updateServerMessage", "refreshFeedDefinition" ],
  setup() {
    return {
      v$: useVuelidate()
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