<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="queue-settings">
        <v-icon icon="fa-rss" />
        {{ queueId ? $t('queueSettings') : $t('createANewQueue') }}
      </h3>
    </v-card-title>
    <v-card-subtitle class="text-center pa-4">
      {{ $t('configuringQueue' , { name: queueUnderConfig.ident }) }}
    </v-card-subtitle>
    <v-divider />
    <v-card-text>
      <!-- TODO: extract component -->
      <!-- tab panel -->
      <v-tabs
        v-if="queueId"
        v-model="selectedTab"
      >
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
        <!-- TODO: extract component -->
        <!-- manage subscriptions -->
        <v-window-item
          key="MANAGE_SUBSCRIPTIONS"
          value="MANAGE_SUBSCRIPTIONS"
        >
          <v-sheet
            align="left"
            justify="center"
          >
            <!-- add subscription from URL -->
            <v-card
              class="ma-4"
              elevation="0"
            >
              <v-card-title
                class="pa-4 clickable"
                @click.stop="showAddSubscription = !showAddSubscription"
              >
                <v-btn
                  :size="buttonSize"
                  :title="$t('addANewSubscription')"
                  :aria-label="$t('addANewSubscription')"
                  :icon="showAddSubscription ? 'fa-minus-square-o' : 'fa-plus-square-o'"
                  variant="text"
                />
                {{ $t('addANewSubscription') }}
              </v-card-title>
              <v-divider />
              <v-alert
                v-if="shouldShowAlert('addANewSubscriptionHere')"
                v-show="showAddSubscription"
                closable
                variant="outlined"
                border="top"
                icon="fa-question-circle"
                :text="$t('addANewSubscriptionHere')"
                class="ma-4"
                @click.close="dismissAlert('addANewSubscriptionHere')"
              />
              <v-card-text v-show="showAddSubscription">
                <!-- text field -->
                <v-text-field
                  v-model="newSubscription.url"
                  variant="solo-filled"
                  type="text"
                  autofocus
                  :label="$t('feedUrl')"
                  :placeholder="$t('feedUrl')"
                >
                  <template #append>
                    <v-btn-group>
                      <v-btn
                        variant="tonal"
                        :size="buttonSize" 
                        prepend-icon="fa-refresh"
                        :loading="discoveryIsLoading"
                        :disabled="!newSubscription.url"
                        :title="$t('discovery')"
                        :text="$t('discovery')"
                        @click="doDiscovery(newSubscription)"
                      />
                      <v-btn
                        variant="tonal"
                        :size="buttonSize" 
                        prepend-icon="fa-lock"
                        :title="$t('auth')"
                        :text="$t('auth')"
                        @click="showNewSubscriptionAuthConfig = !showNewSubscriptionAuthConfig"
                      />
                    </v-btn-group>
                  </template>
                </v-text-field>
                <v-alert
                  v-if="showNewSubscriptionAuthConfig"
                  type="info"
                  :closable="false"
                  :variant="newSubscription.url ? 'tonal' : 'outlined'"
                  class="mb-4"
                >
                  {{ $t("credentialsUseMessage") }}
                </v-alert>
                <!-- username text field -->
                <v-text-field
                  v-if="showNewSubscriptionAuthConfig"
                  v-model="newSubscription.username"
                  variant="solo-filled"
                  type="text"
                  :label="$t('username')"
                  :placeholder="$t('username')"
                  :disabled="!newSubscription.url"
                />
                <!-- password text field -->
                <v-text-field
                  v-if="showNewSubscriptionAuthConfig"
                  v-model="newSubscription.password"
                  variant="solo-filled"
                  type="password"
                  :label="$t('password')"
                  :placeholder="$t('password')"
                  :disabled="!newSubscription.url"
                />
                <SubscriptionInfo
                  v-if="newSubscription.discoveryUrl && !newSubscription.error"
                  elevation="6"
                  :info="newSubscription"
                >
                  <template #additional>
                    <v-btn
                      v-if="alreadySubscribed(newSubscription.discoveryUrl)"
                      :size="buttonSize" 
                      :disabled="true"
                      prepend-icon="fa-plus"
                      :title="$t('alreadySubscribed')"
                      :text="$t('alreadySubscribed')"
                    />
                    <v-btn
                      v-else
                      :size="buttonSize" 
                      prepend-icon="fa-plus"
                      :title="$t('subscribe')"
                      :text="$t('subscribe')"
                      @click="addSubscription"
                    />
                  </template>
                </SubscriptionInfo>
                <v-alert
                  v-if="newSubscription.error"
                  closable 
                  type="error"
                >
                  {{ newSubscription.error }}
                </v-alert>
              </v-card-text>
            </v-card>
            <!-- manage existing RSS/ATOM feed subscriptions -->
            <v-card
              v-if="subscriptions && subscriptions.length > 0"
              class="ma-4"
              elevation="0"
            >
              <v-card-title
                class="pa-4 clickable"
                @click="showSubscriptions = !showSubscriptions"
              >
                <v-btn
                  :size="buttonSize"
                  :title="$t('addANewSubscription')"
                  :aria-label="$t('addANewSubscription')"
                  :icon="showAddSubscription ? 'fa-minus-square-o' : 'fa-plus-square-o'"
                  variant="text"
                />
                {{ $t('yourSubscriptions') }}
              </v-card-title>
              <v-divider />
              <v-alert
                v-if="shouldShowAlert('manageYourSubscriptionsHere')"
                v-show="showSubscriptions"
                closable
                variant="outlined"
                border="top"
                icon="fa-question-circle"
                :text="$t('manageYourSubscriptionsHere')"
                class="ma-4"
                @click.close="dismissAlert('manageYourSubscriptionsHere')"
              />
              <v-card-text
                v-for="(subscription, idx) in subscriptions"
                v-show="showSubscriptions"
                :key="idx" 
              >
                <SubscriptionInfo
                  elevation="6"
                  :info="subscription"
                  :filter-support="false"
                >
                  <template #additional>
                    <v-btn
                      :size="buttonSize"  
                      prepend-icon="fa-expand"
                      :title="$t('auth')"
                      :text="$t('auth')"
                      @click="configAuth(subscription)"
                    />
                    <v-btn
                      :size="buttonSize" 
                      prepend-icon="fa-trash"
                      :title="$t('unsubscribe')"
                      :text="$t('unsubscribe')"
                      @click="deleteSubscription(subscription.id)"
                    />
                  </template>
                </SubscriptionInfo>
              </v-card-text>
            </v-card>
            <!-- auth config dialog (existing subscriptions) -->
            <v-dialog
              v-model="showAuthConfig"
              fullscreen
              scrollable
            >
              <v-card>
                <v-card-title class="pa-4">
                  {{ $t('updateAuth') }}
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-alert
                    type="info"
                    :closable="false"
                    variant="outlined"
                    class="mb-4"
                  >
                    {{ $t("credentialsUseMessage") }}
                  </v-alert>
                  <v-text-field
                    v-model="subscriptionToUpdate.username"
                    variant="solo-filled"
                    type="text"
                    :label="$t('username')"
                    :placeholder="$t('username')"
                  />
                  <v-text-field
                    v-model="subscriptionToUpdate.password"
                    variant="solo-filled"
                    type="password"
                    :label="$t('password')"
                    :placeholder="$t('password')"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    :size="buttonSize" 
                    prepend-icon="fa-save"
                    :text="$t('update')" 
                    @click="updateSubscriptionAuth(subscriptionToUpdate)"
                  />
                  <v-btn
                    :size="buttonSize" 
                    :text="$t('cancel')"
                    @click="showAuthConfig = false"
                  />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-sheet>
        </v-window-item>
        <!-- TODO: extract component -->
        <!-- queue properties -->
        <v-window-item
          key="QUEUE_PROPERTIES"
          value="QUEUE_PROPERTIES"
        >
          <v-sheet>
            <v-card variant="flat">
              <v-card-title class="pa-4">
                {{ queueId ? $t('updateQueueSettings') : $t('createANewQueue') }}
              </v-card-title>
              <v-card-subtitle v-if="queueTitle">
                {{ queueTitle }}
              </v-card-subtitle>
              <v-divider class="mb-1 mt-1" />
              <v-alert
                v-if="shouldShowAlert('updateQueueSettingsHere')"
                closable
                variant="outlined"
                border="top"
                icon="fa-question-circle"
                :text="queueId ? $t('updateQueueSettingsHere') : $t('createANewQueueHere')"
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
              </v-card-text>
              <v-divider v-if="!queueId" />
              <v-card-actions v-if="!queueId">
                <v-btn
                  :size="buttonSize" 
                  :text="$t('save')"
                  @click="save"
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
import { inject } from 'vue';
import { useNotifications } from '@/composable/useNotifications';
import QueueConfigTextField from './QueueConfigTextField.vue';
import SubscriptionInfo from './SubscriptionInfo.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueConfigPanel", 
  components: {
    QueueConfigTextField,
    SubscriptionInfo,
  },
  mixins: [buttonSizeMixin],
  props: {
    baseUrl: { type: String, required: true },
    queueUnderConfig: { type: Object, required: true },
  },
  emits: [ 
    "save", 
    "update", 
    "addSubscription", 
    "deleteSubscription", 
    "updateSubscriptionAuth", 
    "dismiss" 
  ],
  setup() {
    const auth = inject('auth');
    const { 
      shouldShowAlert,
      dismissAlert, 
      handleServerError, 
      setLastServerMessage 
    } = useNotifications();

    return {
      auth,
      shouldShowAlert,
      dismissAlert, 
      handleServerError,
      setLastServerMessage,
    }
  },
  data() {
    return {
      // add/manage subscriptions
      showAddSubscription: true,
      showSubscriptions: true,
      newSubscription: {},
      discoveryIsLoading: false,
      subscriptionToUpdate: null,
      showNewSubscriptionAuthConfig: false,
      showAuthConfig: false,
      // queue properties 
      queueId: this.queueUnderConfig.id,
      queueIdent: this.queueUnderConfig.ident,
      queueTitle: this.queueUnderConfig.title,
      queueDescription: this.queueUnderConfig.description,
      subscriptions: this.queueUnderConfig.subscriptions,
      selectedTab: null,
    };
  },
  computed: {
    tabModel: function () {
      let arr = [];
      if (this.queueId) {
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
  mounted() {
    this.selectedTab = this.queueId ? 'MANAGE_SUBSCRIPTIONS' : 'QUEUE_PROPERTIES';
  },
  methods: {
    alreadySubscribed(url) {
      if (url && this.subscriptions) {
        let u = new String(url).trim().toLowerCase();
        for (let i = 0; i < this.subscriptions.length; i++) {
          let existingUrl = this.subscriptions[i].url;
          if (!existingUrl) {
            continue;
          }
          if (new String(existingUrl).trim().toLowerCase() === u) {
            return true;
          }
        }
      } else {
        return false;
      }
    },
    // emit save 
    save() {
      let saveObj = {
        ident: this.queueIdent,
        title: this.queueTitle,
        description: this.queueDescription,
        generator: this.queueGenerator,
        copyright: this.queueCopyright,
        language: this.queueLanguage,
      };
      // invokes HomeQuues->createQueue
      this.$emit('save', saveObj);
    },
    // emit update 
    update() {
      let saveObj = {
        id: this.queueId, 
        ident: this.queuedIdent,
        title: this.queueTitle,
        description: this.queueDescription,
        generator: this.queueGenerator,
        copyright: this.queueCopyright,
        language: this.queueLanguage,
      };
      // invokes HomeQuues->updateQueue
      this.$emit('update', saveObj);
    },
    // emit addSubscription 
    addSubscription() {
      this.newSubscription.discoveryUrl = null;
      this.$emit('addSubscription', this.newSubscription);
    },
    // emit deleteSubscription 
    deleteSubscription(id) {
      this.$emit('deleteSubscription', id);
    },
    // emit updateSubscriptionAuth 
    updateSubscriptionAuth(source) {
      this.$emit('updateSubscriptionAuth', source);
    },
    // internal 
    doDiscovery(r) {
      if (r.url) {
        r.error = null;
        this.discoveryIsLoading = true;
        this.auth.getTokenSilently().then((token) => {
          const controller = new AbortController();
          const requestOptions = {
            method: 'POST', 
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            credentials: 'include', 
            body: JSON.stringify({
              url: r.url,
              username: r.username,
              password: r.password,
            }),
            signal: controller.signal
          };
          const timeoutId = setTimeout(() => controller.abort(), 45000);
          fetch(this.baseUrl + "/discovery", requestOptions).then((response) => {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            if (response.status === 200) {
              return isJson ? response.json() : {};
            } else {
              return isJson ? response.json().then(j => {throw new Error(null, {cause: j})}) : response.text().then(t => {throw new Error(t)});
            }
          }).then((data) => {
            if (data.error) {
              r.error = data.error;
            } else {
              r.url = data.feedUrl; 
              r.discoveryUrl = data.feedUrl;
              r.title = data.title ? data.title.value : data.feedUrl;
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
              r.httpStatusCode = data.httpStatusCode;
              r.httpStatusMessage = data.httpStatusMessage;
              r.redirectFeedUrl = data.redirectFeedUrl;
              r.redirectHttpStatusCode = data.redirectHttpStatusCode;
              r.redirectHttpStatusMessage = data.redirectHttpStatusMessage;
            }
          }).catch((error) => {
            if (error.name === 'TypeError') {
              r.error = this.$t('somethingHorribleHappened');
            } else if (error.name === 'AbortError') {
              r.error = this.$t('requestTimedOut');
            } else {
              let cause = error.cause;
              if (cause) {
                r.error = cause.details;
                r.httpStatusCode = cause.httpStatusCode;
                r.httpStatusMessage = cause.httpStatusMessage;
                r.redirectFeedUrl = cause.redirectFeedUrl;
                r.redirectHttpStatusCode = cause.redirectHttpStatusCode;
                r.redirectHttpStatusMessage = cause.redirectHttpStatusMessage;
              } else {
                r.error = error.message;
              }
            }
          })
          .finally(() => {
            this.discoveryIsLoading = false;
            clearTimeout(timeoutId);
          });
        }).catch((error) => {
          this.handleServerError(error);
          this.discoveryIsLoading = false;
        });
      }
    },
    // internal
    configAuth(subscription) {
      this.subscriptionToUpdate = { ...subscription };
      this.showAuthConfig = true;
    },
  }
}
</script>

<style scoped>
.queue-settings {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}

.clickable {
  user-select: none;
  cursor: pointer;
}
</style>
