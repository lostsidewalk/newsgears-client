<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="view-header-no-count">
        <v-icon icon="fa-rss" />
        {{ (queue && queue.id) ? $t('queueSettings') : $t('createANewQueue') }}
      </h3>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- tab panel -->
      <v-tabs
        v-if="queue && queue.id"
        v-model="selectedTab"
      >
        <!-- tab 1: add subscription -->
        <v-tab
          key="ADD_SUBSCRIPTIONS"
          value="ADD_SUBSCRIPTIONS"
        >
          {{ $t('addSubscriptions') }}
        </v-tab>
        <!-- tab 2: manage subscriptions -->
        <v-tab
          key="MANAGE_SUBSCRIPTIONS"
          value="MANAGE_SUBSCRIPTIONS"
        >
          {{ $t('manageSubscriptions', { ct: subscriptions.length }) }}
        </v-tab>
        <!-- tab 3: queue properties -->
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
          key="ADD_SUBSCRIPTIONS"
          value="ADD_SUBSCRIPTIONS"
        >
          <!-- add subscriptions -->
          <AddSubscriptions
            v-if="queue"
            :auth="auth"
            :base-url="baseUrl"
            :subscriptions="subscriptions" 
            :queue-id="queue.id"
            @addSubscription="addSubscription" 
            @authError="handleAuthError" 
            @updateServerMessage="setLastServerMessage"
          /> 
        </v-window-item>
        <!-- manage subscriptions -->
        <v-window-item
          key="MANAGE_SUBSCRIPTIONS"
          value="MANAGE_SUBSCRIPTIONS"
        >
          <ManageSubscriptions
            v-if="queue"
            :auth="auth"
            :base-url="baseUrl"
            :subscriptions="subscriptions" 
            :queue-id="queue.id"
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
                {{ (queue && queue.id) ? $t('updateQueueSettings') : $t('createANewQueue') }}
              </v-card-title>
              <v-card-subtitle v-if="(queue && queue.id && queue.title)">
                {{ queue.title }}
              </v-card-subtitle>
              <v-divider class="mb-1 mt-1" />
              <v-alert
                v-if="shouldShowAlert('updateQueueSettingsHere')"
                closable
                variant="outlined"
                border="top"
                icon="fa-question-circle"
                :text="(queue && queue.id) ? $t('updateQueueSettingsHere') : $t('createANewQueueHere')"
                class="ma-4"
                @click.close="dismissAlert('updateQueueSettingsHere')"
              />
              <v-card-text>
                <!-- queue ident -->
                <QueueConfigTextField
                  class="mb-4"
                  :label="$t('queueIdentifier')"
                  :hint="$t('queueIdentifierHint')"
                  :required="true"
                  :placeholder="$t('queueIdentifier')" 
                  :model-value="queueIdent" 
                  @update:modelValue="queueIdent = $event"
                />
                <!-- queue title -->
                <QueueConfigTextField 
                  class="mb-4"
                  :label="$t('queueTitle')"
                  :hint="$t('queueTitleHint')"
                  :required="false"
                  :placeholder="$t('queueTitle')" 
                  :model-value="queueTitle" 
                  @update:modelValue="queueTitle = $event"
                />
                <!-- queue description -->
                <QueueConfigTextField 
                  class="mb-4"
                  :label="$t('queueDescription')"
                  :hint="$t('queueDescriptionHint')"
                  :required="false"
                  :placeholder="$t('queueDescription')"
                  :model-value="queueDescription" 
                  @update:modelValue="queueDescription = $event"
                />
                <!-- queue (starred) feed generator -->
                <QueueConfigTextField 
                  class="mb-4"
                  :label="$t('queueFeedGenerator')"
                  :hint="$t('queueFeedGeneratorHint')"
                  :required="false"
                  :placeholder="$t('queueFeedGenerator')"
                  :model-value="queueFeedGenerator" 
                  @update:modelValue="queueFeedGenerator = $event"
                />
                <!-- queue (starred) feed copyright -->
                <QueueConfigTextField 
                  class="mb-4"
                  :label="$t('queueFeedCopyright')"
                  :hint="$t('queueFeedCopyrightHint')"
                  :required="false"
                  :placeholder="$t('queueFeedCopyright')"
                  :model-value="queueFeedCopyright" 
                  @update:modelValue="queueFeedCopyright = $event"
                />
                <!-- queue (starred) feed language -->
                <QueueConfigTextField 
                  class="mb-4"
                  :label="$t('queueFeedLanguage')"
                  :hint="$t('queueFeedLanguageHint')"
                  :required="false"
                  :placeholder="$t('queueFeedLanguage')"
                  :model-value="queueFeedLanguage" 
                  @update:modelValue="queueFeedLanguage = $event"
                />
              </v-card-text>
              <v-divider v-if="(!queue || !queue.id)" />
              <v-card-actions v-if="(!queue || !queue.id)">
                <v-btn
                  :size="buttonSize" 
                  :text="$t('save')"
                  @click="saveQueueConfig"
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
import QueueConfigTextField from '@/components/queue-config-panel/QueueConfigTextField.vue';
import AddSubscriptions from '@/components/queue-config-panel/AddSubscriptions.vue';
import ManageSubscriptions from '@/components/queue-config-panel/ManageSubscriptions.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueConfigPanel", 
  components: {
    QueueConfigTextField,
    AddSubscriptions,
    ManageSubscriptions,
  },
  mixins: [buttonSizeMixin],
  props: {
    baseUrl: { type: String, required: true },
    auth: { type: Object, required: true },
  },
  emits: [ "save", "update", "dismiss", "authError", "updateServerMessage", "refreshQueueDefinitions" ],
  data() {
    return {
      // 
      tabs: null,
      // 
      showModal: false,
      // queue properties 
      queue: null,
      queueId: null,
      queueIdent: '',
      queueTitle: '',
      queueDescription: '',
      queueGenerator: '',
      queueCopyright: '',
      queueLanguage: '',
      subscriptions: [],
      selectedTab: null,
    };
  },
  computed: {
    tabModel: function() {
      let arr = [];
      if (this.queue.id) {
        arr.push({
          name: "ADD_SUBSCRIPTIONS",
          description: this.$t('rssFeedDiscovery'),
          icon: "feed",
        });
        arr.push({
          name: "MANAGE_SUBSCRIPTIONS",
          description: this.$t('manageSubscriptions', { ct: this.subscriptions.length }),
          icon: "feed",
        })
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
    setup(queue) {
      this.queue = queue;
      // setup queue 
      this.queueId = this.queue.id;
      this.queueIdent = this.queue.ident;
      this.queueTitle = this.queue.title;
      this.queueDescription = this.queue.description;
      this.queueFeedGenerator = this.queue.generator;
      this.queueFeedCopyright = this.queue.copyright;
      this.queueFeedLanguage = this.queue.language;
      this.subscriptions = this.queue.subscriptions;
      this.selectedTab = (queue && queue.id) ? 'SUBSCRIPTIONS' : 'QUEUE_PROPERTIES';
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
    // invoked when the user saves the queue to complete step 1 
    // (after step 1 is complete, we transition to an update operation on an existing queue)
    // 
    saveQueueConfig() {
      let saveObj = {
        ident: this.queuedIdent,
        title: this.queueTitle,
        description: this.queueDescription,
        generator: this.queueFeedGenerator,
        copyright: this.queueFeedCopyright,
        language: this.queueFeedLanguage,
      };
      this.$emit('save', saveObj);
    },
    updateQueueConfig() {
      let updateObj = {
        id: this.queue.id,
        ident: this.queueIdent,
        title: this.queueTitle,
        description: this.queueDescription,
        generator: this.queueFeedGenerator,
        copyright: this.queueFeedCopyright,
        language: this.queueFeedLanguage,
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
      let qd = source.subscriptionDefinition;
      let r = {
        id: qd.id,
        url: qd.url,
        queueId: qd.queueId,
        title: qd.title
      }
      // auth 
      let queryConfig = qd.queryConfig ? JSON.parse(qd.queryConfig) : qd.queryConfig;
      if (queryConfig) {
        r.username = queryConfig.username;
        r.password = queryConfig.password;
      }
      // image 
      let sourceImgUrl = source.imgUrl;
      if (sourceImgUrl) {
        r.image = {
          title: null,
          url: sourceImgUrl,
        }
      }

      this.subscriptions.unshift(r);
      
      this.$emit('refreshQueueDefinitions', this.queue.id);
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
        this.$emit('refreshQueueDefinitions', this.queue.id);
      }
    },
    updateSubscriptionAuth(source) {
      let updateIdx = -1;
      let qd = source.subscriptionDefinition;
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
        this.$emit('refreshQueueDefinitions', this.queue.id);
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