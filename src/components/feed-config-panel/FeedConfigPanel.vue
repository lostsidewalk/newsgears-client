<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="view-header-no-count">
        <v-icon icon="fa-rss" />
        {{ (feed && feed.id) ? $t('queueSettings') : $t('createANewQueue') }}
      </h3>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- tab panel -->
      <v-tabs
        v-if="feed && feed.id"
        v-model="selectedTab"
      >
        <!-- tab 1: subscription config -->
        <v-tab
          key="SUBSCRIPTIONS"
          value="SUBSCRIPTIONS"
        >
          {{ $t('subscriptions') }}
        </v-tab>
        <!-- tab 2: queue properties -->
        <v-tab
          key="QUEUE_PROPERTIES"
          value="QUEUE_PROPERTIES"
        >
          {{ $t('queueProperties') }}
        </v-tab>
      </v-tabs>
      <!-- config window -->
      <v-window v-model="selectedTab">
        <!-- subscriptions -->
        <v-window-item
          key="SUBSCRIPTIONS"
          value="SUBSCRIPTIONS"
        >
          <!-- subscription config -->
          <SubscriptionsConfig
            v-if="feed"
            ref="subscriptionsConfig"
            :base-url="baseUrl"
            :subscriptions="subscriptions" 
            :feed-id="feed.id"
            @addSubscription="addSubscription" 
            @deleteSubscription="deleteSubscription" 
            @updateSubscriptionAuth="updateSubscriptionAuth"
            @authError="handleAuthError" 
            @updateServerMessage="setLastServerMessage"
          /> 
        </v-window-item>
        <!-- queue properties -->
        <v-window-item
          key="QUEUE_PROPERTIES"
          value="QUEUE_PROPERTIES"
        >
          <v-sheet>
            <v-card variant="flat">
              <v-card-title class="pa-4">
                {{ (feed && feed.id) ? $t('updateQueueSettings') : $t('createANewQueue') }}
              </v-card-title>
              <v-card-subtitle v-if="(feed && feed.id && feed.description)">
                {{ feed.description }}
              </v-card-subtitle>
              <v-divider class="mb-1 mt-1" />
              <v-alert
                v-if="shouldShowAlert('updateQueueSettingsHere')"
                closable
                variant="outlined"
                border="top"
                icon="fa-question-circle"
                :text="(feed && feed.id) ? $t('updateQueueSettingsHere') : $t('createANewQueueHere')"
                class="ma-4"
                @click.close="dismissAlert('updateQueueSettingsHere')"
              />
              <v-card-text>
                <!-- feed ident -->
                <FeedConfigTextField
                  class="mb-4"
                  :label="$t('queueIdentifier')"
                  :hint="$t('queueIdentifierHint')"
                  :required="true"
                  :placeholder="$t('queueIdentifier')" 
                  :model-value="feedIdent" 
                  @update:modelValue="feedIdent = $event"
                />
                <!-- feed title -->
                <FeedConfigTextField 
                  class="mb-4"
                  :label="$t('queueTitle')"
                  :hint="$t('queueTitleHint')"
                  :required="false"
                  :placeholder="$t('queueTitle')" 
                  :model-value="feedTitle" 
                  @update:modelValue="feedTitle = $event"
                />
                <!-- feed description -->
                <FeedConfigTextField 
                  class="mb-4"
                  :label="$t('queueDescription')"
                  :hint="$t('queueDescriptionHint')"
                  :required="false"
                  :placeholder="$t('queueDescription')"
                  :model-value="feedDescription" 
                  @update:modelValue="feedDescription = $event"
                />
                <!-- feed generator -->
                <FeedConfigTextField 
                  class="mb-4"
                  :label="$t('queueFeedGenerator')"
                  :hint="$t('queueFeedGeneratorHint')"
                  :required="false"
                  :placeholder="$t('queueFeedGenerator')"
                  :model-value="feedGenerator" 
                  @update:modelValue="feedGenerator = $event"
                />
                <!-- feed copyright -->
                <FeedConfigTextField 
                  class="mb-4"
                  :label="$t('queueFeedCopyright')"
                  :hint="$t('queueFeedCopyrightHint')"
                  :required="false"
                  :placeholder="$t('queueFeedCopyright')"
                  :model-value="feedCopyright" 
                  @update:modelValue="feedCopyright = $event"
                />
                <!-- feed language -->
                <FeedConfigTextField 
                  class="mb-4"
                  :label="$t('queueFeedLanguage')"
                  :hint="$t('queueFeedLanguageHint')"
                  :required="false"
                  :placeholder="$t('queueFeedLanguage')"
                  :model-value="feedLanguage" 
                  @update:modelValue="feedLanguage = $event"
                />
              </v-card-text>
              <v-divider v-if="(!feed || !feed.id)" />
              <v-card-actions v-if="(!feed || !feed.id)">
                <v-btn
                  :size="buttonSize" 
                  :text="$t('save')"
                  @click="saveFeedConfig"
                />
              </v-card-actions>
            </v-card>
          </v-sheet>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn
        :size="buttonSize" 
        :text="$t('dismiss')"
        @click="$emit('dismiss')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import FeedConfigTextField from '@/components/feed-config-panel/FeedConfigTextField.vue';
import SubscriptionsConfig from '@/components/feed-config-panel/SubscriptionsConfig.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "FeedConfigPanel", 
  components: {
    FeedConfigTextField,
    SubscriptionsConfig,
  },
  mixins: [buttonSizeMixin],
  props: {
    baseUrl: { type: String, required: true },
  },
  emits: [ "save", "dismiss", "authError", "updateServerMessage", "refreshFeedDefinition" ],
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
      subscriptions: [],
      selectedTab: null,
    };
  },
  computed: {
    tabModel: function() {
      let arr = [];
      if (this.feed.id) {
        arr.push({
          name: "SUBSCRIPTIONS",
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
    },
  },
  methods: {
    shouldShowAlert(alertName) {
      return !localStorage.getItem(alertName); 
    },
    dismissAlert(alertName) {
      localStorage.setItem(alertName, new Date().toISOString())
    },
    // setup is called to initialize the panel for updates 
    setup(feed) {
      this.feed = feed;
      // setup feed 
      this.feedId = this.feed.id;
      this.feedIdent = this.feed.ident;
      this.feedTitle = this.feed.title;
      this.feedDescription = this.feed.description;
      this.feedGenerator = this.feed.generator;
      this.feedCopyright = this.feed.copyright;
      this.feedLanguage = this.feed.language;
      this.subscriptions = this.feed.subscriptions;
      this.selectedTab = (feed && feed.id) ? 'SUBSCRIPTIONS' : 'QUEUE_PROPERTIES';
      this.showModal = true;
    },
    tearDown() {
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
    // 
    // invoked when the user saves the feed to complete step 1 
    // (after step 1 is complete, we transition to an update operation on an existing feed)
    // 
    saveFeedConfig() {
      let saveObj = {
        ident: this.feedIdent,
        title: this.feedTitle,
        description: this.feedDescription,
        generator: this.feedGenerator,
        copyright: this.feedCopyright,
        language: this.feedLanguage,
      };
      this.$emit('save', saveObj);
    },
    updateFeedConfig() {
      let updateObj = {
        id: this.feed.id,
        ident: this.feedIdent,
        title: this.feedTitle,
        description: this.feedDescription,
        generator: this.feedGenerator,
        copyright: this.feedCopyright,
        language: this.feedLanguage,
      };
      this.$emit('update', updateObj);
    },
    addSubscription(source) {
      if (!this.subscriptions) {
        this.subscriptions = [];
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

      this.subscriptions.unshift(r);
      
      this.$emit('refreshFeedDefinition', this.feed.id);
    },
    deleteSubscription(id) {
      let deleteIdx = -1;
      for (let i = 0; i < this.subscriptions.length; i++) {
        if (this.subscriptions[i].id === id) {
          deleteIdx = i;
          break;
        }
      }
      if (deleteIdx > -1) {
        this.subscriptions.splice(deleteIdx, 1);
        this.$emit('refreshFeedDefinition', this.feed.id);
      }
    },
    updateSubscriptionAuth(source) {
      let updateIdx = -1;
      let qd = source.queryDefinition;
      for (let i = 0; i < this.subscriptions.length; i++) {
        if (this.subscriptions[i].id === qd.id) {
          updateIdx = i;
          break;
        }
      }
      if (updateIdx > -1) {
        let queryConfigStr = qd.queryConfig;
        if (queryConfigStr) {
          let queryConfig = JSON.parse(queryConfigStr);
          this.subscriptions[updateIdx].username = queryConfig.username;
          this.subscriptions[updateIdx].password = queryConfig.password;
        } else {
          this.subscriptions[updateIdx].username = null;
          this.subscriptions[updateIdx].password = null;
        }
        this.$emit('refreshFeedDefinition', this.feed.id);
      }
    },
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