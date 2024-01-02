<template>
  <v-card>
    <v-card-title
      class="text-center"
      :class="pa4r"
    >
      <h3 class="queue-settings">
        <v-icon icon="fa-rss" />
        {{ queueId ? queueTitle : $t('createANewQueue') }}
      </h3>
    </v-card-title>
    <v-card-subtitle
      v-if="queueId"
      class="text-center"
      :class="pa4r"
    >
      {{ queueDescription }}
    </v-card-subtitle>
    <v-divider />
    <v-card-text>
      <!-- tab panel -->
      <v-tabs
        v-if="queueId"
        v-model="selectedTab"
      >
        <!-- tab 1: add a subscription -->
        <v-tab
          key="ADD_SUBSCRIPTION"
          value="ADD_SUBSCRIPTION"
        >
          {{ $t('addSubscriptions') }}
        </v-tab>
        <!-- tab 2: manage subscriptions -->
        <v-tab
          key="MANAGE_SUBSCRIPTIONS"
          value="MANAGE_SUBSCRIPTIONS"
        >
          {{ $t('manageSubscriptions', { ct: (subscriptions ? subscriptions.length : 0) }) }}
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
        <!-- TODO: extract add subscription component -->
        <v-window-item
          key="ADD_SUBSCRIPTION"
          value="ADD_SUBSCRIPTION"
        >
          <v-sheet
            align="left"
            justify="center"
          >
            <!-- add subscription from URL -->
            <v-card
              :class="ma4r"
              elevation="0"
            >
              <v-divider />
              <v-card-text
                v-show="showSubscriptions"
                border="top"
                icon="fa-question-circle"
              >
                {{ $t('addANewSubscriptionHere') }}
              </v-card-text>
              <v-card-text v-show="showAddSubscription">
                <!-- text field -->
                <v-text-field
                  v-model="newSubscription.url"
                  style="min-width: 128px;"
                  variant="solo-filled"
                  type="text"
                  autofocus
                  :label="$t('feedUrl')"
                  :placeholder="$t('feedUrl')"
                />
                <v-btn-group class="my-2 d-flex flex-wrap">
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
                <!-- username text field -->
                <v-text-field
                  v-if="showNewSubscriptionAuthConfig"
                  v-model="newSubscription.username"
                  class="my-2"
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
                  class="my-2"
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
          </v-sheet>
        </v-window-item>
        <!-- TODO: extract manage subscriptions component -->
        <v-window-item
          key="MANAGE_SUBSCRIPTIONS"
          value="MANAGE_SUBSCRIPTIONS"
        >
          <v-sheet
            align="left"
            justify="center"
          >
            <!-- manage existing RSS/ATOM feed subscriptions -->
            <v-card
              v-if="subscriptions && subscriptions.length > 0"
              :class="ma4r"
              elevation="0"
            >
              <v-divider />
              <v-card-text
                v-show="showSubscriptions"
                border="top"
                icon="fa-question-circle"
              >
                {{ $t('manageYourSubscriptionsHere') }}
              </v-card-text>
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
            >
              <v-card>
                <v-card-title :class="pa4r">
                  {{ $t('updateAuth', { subscriptionName: subscriptionToUpdate.title }) }}
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <div 
                    :class="mb4r"
                  >
                    {{ $t("credentialsUseMessage") }}
                  </div>
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
        <!-- TODO: extract greater queue properties component -->
        <v-window-item
          key="QUEUE_PROPERTIES"
          value="QUEUE_PROPERTIES"
        >
          <v-sheet>
            <v-card variant="flat">
              <v-card-title :class="pa4r">
                {{ queueId ? $t('updateQueueSettings') : $t('createANewQueue') }}
              </v-card-title>
              <v-card-subtitle v-if="queueTitle">
                {{ queueTitle }}
              </v-card-subtitle>
              <v-divider class="my-1" />
              <v-card-text
                closable
                border="top"
                icon="fa-question-circle"
                :class="ma4r"
              >
                {{ queueId ? $t('updateQueueSettingsHere') : $t('createANewQueueHere') }}
              </v-card-text>
              <v-card-text>
                <!-- queue ident -->
                <v-text-field
                  v-model="queueIdent"
                  :class="mb4r"
                  :label="$t('queueIdentifier')"
                  :hint="$t('queueIdentifierHint')"
                  :required="true" 
                  :placeholder="$t('queueIdentifier')"
                  persistent-placeholder
                  variant="solo-filled"
                />
                <!-- queue title -->
                <v-text-field
                  v-model="queueTitle"
                  :class="mb4r"
                  :label="$t('queueTitle')"
                  :hint="$t('queueTitleHint')"
                  :required="false"
                  :placeholder="$t('queueTitle')" 
                  persistent-placeholder
                  variant="solo-filled"
                />
                <!-- queue description -->
                <v-text-field
                  v-model="queueDescription"
                  :class="mb4r"
                  :label="$t('queueDescription')"
                  :hint="$t('queueDescriptionHint')"
                  :required="false"
                  :placeholder="$t('queueDescription')"
                  persistent-placeholder
                  variant="solo-filled"
                />
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn
                  v-if="!queueId"
                  :size="buttonSize" 
                  :text="$t('save')"
                  @click="save"
                />
                <v-btn
                  v-if="queueId"
                  :size="buttonSize" 
                  :text="$t('update')"
                  @click="update"
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
import { inject, computed, ref, reactive, onMounted } from 'vue';

import { useI18n } from 'vue-i18n';
import { useNotifications } from '@/composable/useNotifications';
import { useQueues } from '@/composable/useQueues';

import SubscriptionInfo from './SubscriptionInfo.vue';
import spacingMixin from '@/mixins/spacingMixin';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueConfigPanel", 
  components: {
    SubscriptionInfo,
  },
  mixins: [
    spacingMixin,
    buttonSizeMixin
  ],
  props: {
    baseUrl: { type: String, required: true },
  },
  emits: [ 
    "dismiss", 
    "save", 
    "update", 
    "addSubscription", 
    "deleteSubscription", 
    "updateSubscriptionAuth", 
  ],
  setup(props, { emit }) {
    const auth = inject('auth');
    const { 
      shouldShowAlert,
      dismissAlert, 
      handleServerError, 
      setLastServerMessage 
    } = useNotifications();
    const { queueStore } = useQueues(props);

    const { t } = useI18n();

    const tabModel = computed(() => {
      let arr = [];
      if (queueId.value) {
        arr.push({
          name: "MANAGE_SUBSCRIPTIONS",
          description: t('manageSubscriptions', { ct: (subscriptions ? subscriptions.length : 0) }),
          icon: "feed",
        })
        arr.push({
          name: "QUEUE_PROPERTIES",
          description: t('queueProperties'),
          icon: "list",
        });
      }
      return arr;
    });

    const queueId = ref(queueStore.queueUnderConfig.id);
    const queueIdent = ref(queueStore.queueUnderConfig.ident);
    const queueTitle = ref(queueStore.queueUnderConfig.title);
    const queueDescription = ref(queueStore.queueUnderConfig.description);
    const queueGenerator = ref(queueStore.queueUnderConfig.generator);
    const queueCopyright = ref(queueStore.queueUnderConfig.copyright);
    const queueLanguage = ref(queueStore.queueUnderConfig.language);
    const subscriptions = reactive(queueStore.queueUnderConfig.subscriptions);
    // add/manage subscriptions
    const showAddSubscription = ref(true);
    const showSubscriptions = ref(true);
    const newSubscription = ref({});
    const discoveryIsLoading = ref(false);
    const subscriptionToUpdate = ref(null);
    const showNewSubscriptionAuthConfig = ref(false);
    const showAuthConfig = ref(false);
    // queue properties 
    const selectedTab = ref(null);

    onMounted(() => {
      selectedTab.value = queueId.value ? 'MANAGE_SUBSCRIPTIONS' : 'QUEUE_PROPERTIES';
    });

    function alreadySubscribed(url) {
      if (url && subscriptions) {
        let u = new String(url).trim().toLowerCase();
        for (let i = 0; i < subscriptions.length; i++) {
          let existingUrl = subscriptions[i].url;
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
    }

    // emit save 
    function save() {
      let saveObj = {
        ident: queueIdent.value,
        title: queueTitle.value,
        description: queueDescription.value,
        // 
        generator: queueGenerator.value,
        copyright: queueCopyright.value,
        language: queueLanguage.value,
        //
      };
      // invokes HomeQuues->createQueue
      emit('save', saveObj);
    }
    
    // emit update 
    function update() {
      let saveObj = {
        id: queueId.value, 
        ident: queueIdent.value,
        title: queueTitle.value,
        description: queueDescription.value,
        generator: queueGenerator.value,
        copyright: queueCopyright.value,
        language: queueLanguage.value,
      };
      // invokes HomeQuues->updateQueue
      emit('update', saveObj);
    }

    // emit addSubscription 
    function addSubscription() {
      newSubscription.value.discoveryUrl = null;
      emit('addSubscription', newSubscription.value);
    }

    // emit deleteSubscription 
    function deleteSubscription(id) {
      emit('deleteSubscription', id);
    }

    // emit updateSubscriptionAuth 
    function updateSubscriptionAuth(source) {
      emit('updateSubscriptionAuth', source);
    }

    // TODO: relocate to useDiscovery 
    function doDiscovery(r) {
      if (r.url) {
        r.error = null;
        discoveryIsLoading.value = true;
        auth.getTokenSilently().then((token) => {
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
          fetch(props.baseUrl + "/discovery", requestOptions).then((response) => {
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
              r.error = t('somethingHorribleHappened');
            } else if (error.name === 'AbortError') {
              r.error = t('requestTimedOut');
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
            discoveryIsLoading.value = false;
            clearTimeout(timeoutId);
          });
        }).catch((error) => {
          handleServerError(error);
          discoveryIsLoading.value = false;
        });
      }
    }

    // internal
    function configAuth(subscription) {
      subscriptionToUpdate.value = { ...subscription };
      showAuthConfig.value = true;
    }

    return {
      auth,
      shouldShowAlert,
      dismissAlert, 
      handleServerError,
      setLastServerMessage,
      // 
      tabModel,
      queueId,
      queueIdent,
      queueTitle,
      queueDescription,
      queueGenerator,
      queueCopyright,
      queueLanguage,
      subscriptions, 
      showAddSubscription,
      showSubscriptions,
      newSubscription,
      discoveryIsLoading,
      subscriptionToUpdate,
      showNewSubscriptionAuthConfig,
      showAuthConfig,
      selectedTab,
      // 
      configAuth, 
      doDiscovery,
      updateSubscriptionAuth,
      deleteSubscription,
      addSubscription,
      update,
      save,
      alreadySubscribed,
    }
  },
}
</script>

<style scoped>
.queue-settings {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>
