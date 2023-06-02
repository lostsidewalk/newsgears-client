<template>
  <v-sheet
    align="left"
    justify="center"
  >
    <!-- add subscription from URL -->
    <v-card
      class="ma-4"
      elevation="6"
    >
      <v-card-title class="pa-4">
        {{ $t('addANewSubscription') }}
      </v-card-title>
      <v-divider />
      <v-alert
        v-if="shouldShowAlert('addANewSubscriptionHere')"
        closable
        variant="outlined"
        border="top"
        icon="fa-question-circle"
        :text="$t('addANewSubscriptionHere')"
        class="ma-4"
        @click.close="dismissAlert('addANewSubscriptionHere')"
      />
      <v-card-text>
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
          </template>
        </v-text-field>
        <v-alert
          type="info"
          closable
          :variant="newSubscription.url ? 'tonal' : 'outlined'"
          class="mb-4"
        >
          {{ $t("credentialsUseMessage") }}
        </v-alert>
        <!-- username text field -->
        <v-text-field
          v-model="newSubscription.username"
          variant="solo-filled"
          type="text"
          :label="$t('username')"
          :placeholder="$t('username')"
          :disabled="!newSubscription.url"
        />
        <!-- password text field -->
        <v-text-field
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
              :size="buttonSize" 
              prepend-icon="fa-plus"
              :loading="addNewIsLoading"
              :title="$t('subscribe')"
              :text="$t('subscribe')"
              @click="addNewSubscription"
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
        <v-alert
          v-model="addSuccess"
          closable
          variant="tonal"
          type="success"
        >
          {{ $t('subscriptionAdded') }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
import SubscriptionInfo from '@/components/subscription-info/SubscriptionInfo.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "AddSubscriptions", 
  components: {
    SubscriptionInfo,
  },
  mixins: [buttonSizeMixin],
  props: {
    subscriptions: { type: Array, required: true },
    queueId: { type: Number, required: true },
    baseUrl: { type: String, required: true },
  },
  emits: [
    "addSubscription",
    "updateServerMessage",
  ],
  data() {
    return {
      mode: "ADD_FROM_URL",
      //
      newFeedDiscoveryError: null,
      newSubscription: {},
      addNewIsLoading: false,
      discoveryIsLoading: false,
      addSuccess: false,
    }
  },
  methods: {
    shouldShowAlert(alertName) {
      return !localStorage.getItem(alertName); 
    },
    dismissAlert(alertName) {
      localStorage.setItem(alertName, new Date().toISOString())
    },
    // 
    // server error 
    // 
    handleServerError(error) {
      console.error(error);
      if (error.name === 'TypeError') {
        this.setLastServerMessage(this.$t('somethingHorribleHappened'));
      } else if (error.name === 'AbortError') {
        this.setLastServerMessage(this.$t('requestTimedOut'));
      } else if (error.message) {
        this.setLastServerMessage(error.message); 
      } else {
        this.setLastServerMessage(error);
      }
    },
    setLastServerMessage(message) {
      if (message) {
        this.$emit('updateServerMessage', message);
      }
    },
    // 
    // invoked by the 'subscribe' button on 'add a new subscription'
    // 
    addNewSubscription() {
      this.addNewIsLoading = true;
      console.log("subscription-config: pushing new subscription to remote..");
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify([this.newSubscription]),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/queues/" + this.queueId + '/subscriptions/', requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} })}) : 
              response.text().then(t => {throw new Error(t, { cause: {} })});
          }
        }).then((data) => {
          let subscriptionDefinitions = data.subscriptionDefinitions;
          if (subscriptionDefinitions && subscriptionDefinitions.length > 0) {
            let qd = subscriptionDefinitions[0];
            this.$emit('addSubscription', qd);
            this.newSubscription = {};
            this.addSuccess = true;
            this.setLastServerMessage(this.$t('subscriptionAdded'));
          }
        }).catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.addNewIsLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.addNewIsLoading = false;
      });
    },
    // 
    // discovery 
    // 
    doDiscovery(r) {
      if (r.url) {
        r.error = null;
        this.discoveryIsLoading = true;
        this.$auth.getTokenSilently().then((token) => {
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
              includeRecommendations: false,
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
              r.feedRecommendationInfo = data.feedRecommendationInfo;
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
  }
}
</script>
