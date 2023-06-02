<template>
  <v-sheet
    align="left"
    justify="center"
  >
    <!-- manage existing RSS/ATOM feed subscriptions -->
    <v-card
      v-if="subscriptions && subscriptions.length > 0"
      class="ma-4"
      elevation="6"
    >
      <v-card-title class="pa-4">
        {{ $t('yourSubscriptions') }}
      </v-card-title>
      <v-divider />
      <v-alert
        v-if="shouldShowAlert('manageYourSubscriptionsHere')"
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
              :loading="deleteIsLoading"
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
            :loading="updateAuthIsLoading"
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
</template>

<script>
import SubscriptionInfo from '@/components/subscription-info/SubscriptionInfo.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "ManageSubscriptions", 
  components: {
    SubscriptionInfo,
  },
  mixins: [buttonSizeMixin],
  props: {
    subscriptions: { type: Array, required: true },
    queueId: { type: Number, required: true },
    baseUrl: { type: String, required: true },
    auth: { type: Object, required: true },
  },
  emits: [
    "deleteSubscription",
    "updateSubscriptionAuth",
    "updateServerMessage",
  ],
  data() {
    return {
      // 
      subscriptionToUpdate: null,
      showAuthConfig: false,
      // 
      deleteIsLoading: false,
      updateAuthIsLoading: false,
      discoveryIsLoading: false,
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
    // invoked by the 'unsubsribe' button on existing subscriptions 
    // 
    deleteSubscription(id) {
      this.deleteIsLoading = true;
      console.log("subscription-config: deleteing subscription..");
      this.auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'DELETE',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/queues/" + this.queueId + '/subscriptions/' + id, requestOptions)
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
        }).then(() => {
          this.$emit('deleteSubscription', id);
          this.setLastServerMessage(this.$t('subscriptionDeleted'));
        }).catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.deleteIsLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.deleteIsLoading = false;
      });
    },
    // 
    // invoked by the 'auth' button on existing subscriptions 
    // 
    configAuth(subscription) {
      this.subscriptionToUpdate = subscription;
      this.showAuthConfig = true;
    },
    updateSubscriptionAuth(subscription) {
      this.updateAuthIsLoading = true;
      console.log("subscription-config: pushing updated subscription to remote..");
      this.auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(subscription),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/queues/" + this.queueId + '/subscriptions/' + subscription.id, requestOptions)
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
            this.$emit('updateSubscriptionAuth', qd);
            this.setLastServerMessage(this.$t('subscriptionUpdated'));
          }
        }).catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.updateAuthIsLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.updateAuthIsLoading = false;
      });
    },
  }
}
</script>
