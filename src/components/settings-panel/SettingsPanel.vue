<template>
  <v-card :disabled="isLoading">
    <v-card-title class="text-center pa-4">
      <h3 class="view-header-no-count">
        <v-icon icon="fa-user" />
        {{ $t('accountSettings') }}
      </h3>
    </v-card-title>
    <v-divider />
    <v-card-text v-if="isLoaded">
      <!-- profile -->
      <v-card
        elevation="6"
        class="mb-4 pa-1"
      >
        <v-card-item
          :title="authProvider !== 'LOCAL' ? authProviderUsername : username"
          :subtitle="emailAddress"
        />
        <v-divider />
        <v-card-text class="d-flex flex-row">
          <!-- profile image -->
          <v-img
            v-if="authProviderProfileImgUrl" 
            :src="authProviderProfileImgUrl" 
            referrerpolicy="no-referrer" 
            class="profile-img" 
            :alt="$t('oAuth2ProfileImage')" 
            height="96" 
            max-height="96" 
            max-width="96"
          />
          <v-img
            v-else
            src="feedgears.png" 
            referrerpolicy="no-referrer" 
            class="profile-img" 
            :alt="$t('defaultOAuth2ProfileImage')" 
            height="96" 
            max-height="96" 
            max-width="96"
          />
        </v-card-text>
        <v-card-actions>
          <!-- deactivate account button -->
          <v-btn
            v-if="!showDeactivateUser && !showResetPassword"
            :size="buttonSize"
            :text="$t('deactivateYourAccount')" 
            @click="showDeactivateUser = true"
          />
          <!-- download your data button-->
          <v-btn
            v-if="showDeactivateUser"
            :size="buttonSize"
            :loading="exportOpmlIsLoading"
            :text="$t('downloadYourData')"
            @click="exportOpml()"
          />
          <!-- permanently delete your account button -->
          <v-btn
            v-if="showDeactivateUser"
            :size="buttonSize" 
            :loading="finalizeDeactivationIsLoading"
            :text="$t('permanentlyDeleteYourAccount')"
            @click="finalizeDeactivation()"
          />
          <!-- cancel (deactivate account) button -->
          <v-btn
            v-if="showDeactivateUser"
            id="cancelDeactivateAccount"
            :size="buttonSize" 
            :text="$t('cancel')" 
            @click="showDeactivateUser = false"
          />
          <v-btn
            v-if="showResetPassword"
            :size="buttonSize" 
            :loading="initPasswordResetIsLoading"
            :text="$t('sendPasswordResetEmail')"
            @click="initPasswordReset()"
          />
          <!-- reset password button (local) -->
          <v-btn
            v-if="authProvider === 'LOCAL' && !showResetPassword && !showDeactivateUser"
            id="resetPassword" 
            :size="buttonSize" 
            :loading="resetPasswordIsLoading" 
            :text="$t('resetPassword')"
            @click="resetPassword()"
          />
          <!-- cancel (reset password) -->
          <v-btn
            v-if="showResetPassword"
            id="cancelResetPassword" 
            :size="buttonSize" 
            :text="$t('cancel')" 
            @click="showResetPassword = false"
          />
        </v-card-actions>
      </v-card>
      <!-- email address (local) -->
      <v-card
        v-if="authProvider === 'LOCAL'"
        elevation="6"
        class="mb-4 pa-1"
      >
        <v-card-title class="pa-4">
          {{ $t('emailAddress') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-text-field
            v-model="emailAddress"
            variant="solo-filled" 
            name="email"
            :label="$t('emailAddressColon')" 
            type="text"
            :hint="$t('emailAddressHint')"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <!-- apply changes button (local) -->
          <v-btn
            v-if="authProvider === 'LOCAL' && !showResetPassword && !showDeactivateUser"
            id="updateAccount" 
            :size="buttonSize" 
            :loading="updateAccountIsLoading"
            :text="$t('applyChanges')"
            @click="updateAccount()"
          />
        </v-card-actions>
      </v-card>
      <!-- email notifications -->
      <v-card
        elevation="6"
        class="mb-4 pa-1"
      >
        <v-card-item 
          :title="$t('emailNotifications')" 
          :subtitle="frameworkConfig && isTrue(frameworkConfig.notifications.disabled) ? 
            $t('emailNotificationsAreDisabled') : 
            $t('emailNotificationsAreEnabled')"
        />
        <v-divider />
        <v-card-actions>
          <v-checkbox
            id="enableAccountAlerts" 
            v-model="enableAccountAlerts" 
            name="enableAccountAlerts"
            :label="$t('enableAccountAlertsNotifications')" 
            :disabled="frameworkConfig && isTrue(frameworkConfig.notifications.disabled)"
          />
          <v-checkbox
            id="enableProductNotifications" 
            v-model="enableProductNotifications" 
            name="enableProductNotifications"
            :label="$t('enableProductNotifications')" 
            :disabled="frameworkConfig && isTrue(frameworkConfig.notifications.disabled)"
          />
        </v-card-actions>
        <v-divider />
        <v-card-actions>
          <!-- update notification preferences button -->
          <v-btn
            id="updateNotificationPreferences"
            :size="buttonSize" 
            :disabled="frameworkConfig && isTrue(frameworkConfig.notifications.disabled)" 
            :loading="updateNotificationPreferencesIsLoading"
            :text="$t('updateNotificationPreferences')"
            @click="updateNotificationPreferences()"
          />
          <!-- toggle (all) notifications button -->
          <v-btn 
            :size="buttonSize"
            :loading="toggleNotificationsIsLoading" 
            :text="(frameworkConfig && isTrue(frameworkConfig.notifications.disabled)) ? $t('enableSelectedNotifications') : $t('disableSelectedNotifications')"
            @click="toggleNotifications()"
          />
        </v-card-actions>
      </v-card>
      <!-- subscription -->
      <v-card
        v-if="subscription"
        elevation="6"
        class="mb-4 pa-1"
      >
        <v-card-item
          title="CARD TITLE"
          :subtitle="$t('subscriptionStatus', { 
            status: getSubscrpitionStatus(), 
            started: getSubscriptionStarted() 
          })"
        />
        <v-divider />
        <v-card-text>
          <p v-if="isCanceled()">
            {{ $t('yourSubscriptionWasCanceled') }}
          </p>

          <div v-if="isActive()">
            <v-label for="subscription-current-period">
              {{ $t('currentPeriod') }}
            </v-label>
            <v-text-field
              variant="solo-filled"
              name="subscription-current-period"
              type="text" 
              :placeholder="getSubscriptionCurrentPeriod()"
            />
          </div>

          <div v-if="hasEnded()">
            <v-label for="subscription-ended-at">
              {{ $t('endedAt') }}
            </v-label>
            <v-text-field
              variant="solo-filled"
              name="subscription-ended-at"
              type="text" 
              :placeholder="getSubscriptionEndedAt()"
            />
          </div>

          <div v-if="isCanceled()">
            <v-label for="subscription-ended-at">
              {{ $t('willEndAt') }}
            </v-label>
            <v-text-field
              variant="solo-filled"
              name="subscription-ended-at"
              type="text" 
              :placeholder="getSubscriptionCurrentPeriodEnd()"
            />
          </div>

          <div v-if="hasLastInvoice()">
            <v-label>{{ $t('mostRecentInvoice') }} ({{ getLastInvoiceCreated() }})</v-label>
            <v-label>{{ $t('statusColon') }} {{ getLastInvoiceStatus() }}</v-label> 
            <v-label>{{ $t('amountDueColon') }} {{ getAmountDue() }}</v-label>
            <v-label>{{ $t('amountPaidColon') }} {{ getAmountPaid() }}</v-label>
            <v-label>{{ $t('amountRemainingColon') }} {{ getAmountRemaining() }}</v-label>
            <v-label>{{ $t('customerEmailAddressColon') }} {{ getCustomerEmailAddress() }}</v-label>
            <v-label>{{ $t('customerNameColon') }} {{ getCustomerName() }}</v-label>
            <v-label>
              {{ $t('invoiceUrlColon') }} <a
                :href="getHostedInvoiceUrl()"
                target="_blank"
              >{{ $t('clckHere') }}</a>
            </v-label>
            <v-label>{{ $t('productColon') }} {{ getProductDescription() }}</v-label>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            v-if="subscription && !isCanceled()"
            id="cancelSubscription"
            :size="buttonSize" 
            :loading="cancelSubscriptionIsLoading" 
            :text="$t('cancelSubscription')"
            @click="cancelSubscription()"
          />
          <v-btn
            v-if="subscription && isCanceled()"
            id="resumeSubscription"
            :size="buttonSize" 
            :loading="resumeSubscriptionIsLoading" 
            :text="$t('resumeSubscription')"
            @click="resumeSubscription()"
          />
        </v-card-actions>
      </v-card>
      <!-- checkout -->
      <v-card
        v-if="!subscription"
        elevation="6"
        class="mb-4 pa-1"
      >
        <v-card-item
          :title="$t('supportFeedGears')"
          :subtitle="$t('pleaseConsiderSubscribing')"
        />
        <v-divider />
        <v-card-actions>
          <v-btn
            id="checkout"
            :size="buttonSize" 
            :loading="submitOrderIsLoading" 
            :text="$t('checkout')"
            @click="submitOrder"
          />
        </v-card-actions>
      </v-card>
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
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default {
  name: "SettingsPanel",
  mixins: [buttonSizeMixin],
  props: {
    baseUrl: { type: String, required: true },
  },
  emits: [ "updateServerMessage", "dismiss" ],
  data() {
    return {
      account: null,
      frameworkConfig: null,
      subscription: null,
      forceLogout: false,
      // 
      isLoaded: false,
      isLoading: true, // top-level 
      exportOpmlIsLoading: false,
      finalizeDeactivationIsLoading: false,
      initPasswordResetIsLoading: false,
      resetPasswordIsLoading: false,
      updateAccountIsLoading: false,
      updateNotificationPreferencesIsLoading: false,
      toggleNotificationsIsLoading: false,
      cancelSubscriptionIsLoading: false,
      resumeSubscriptionIsLoading: false,
      submitOrderIsLoading: false,
      // 
      showModal: false,
      tabModel: [
        {
          "name": "SETTINGS",
          "description": "User Preferences",
          "icon": "list",
        },
        {
          "name": "THEME",
          "description": "Theme",
          "icon": "paint-brush",
        }
      ],
      username: null,
      emailAddress: null,
      authProvider: null,
      authProviderProfileImgUrl: null,
      authProviderUsername: null,
      enableAccountAlerts: null,
      enableDailyFeedReport: null,
      enableProductNotifications: null,
      showDeactivateUser: false,
      showResetPassword: false,
      // currently selected tab
      selectedTab: 'SETTINGS',
    }
  },
  mounted() {
    this.refreshSettings();
  },
  methods: {
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
        this.setLastServerMessage(error); // $auth plugin errors 
      }
    },
    setLastServerMessage(message) {
      if (message) {
        this.$emit('updateServerMessage', message);
      }
    },
    // 
    isTrue(obj) {
      return obj instanceof String ? obj === 'true' : obj === true;
    },
    resetPassword() {
      this.showResetPassword = true;
    },
    deactivateAccount() {
      this.showDeactivateUser = true;
    },
    updateNotificationPreferences() {
      let newSettings = {
        frameworkConfig: {
          notifications: {
            accountAlerts: this.enableAccountAlerts,
            dailyFeedReport: this.enableDailyFeedReport,
            productNotifications: this.enableProductNotifications,
          }
        }
      };
      this.updateNotificationPreferencesIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newSettings),
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return;
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).then(() => {
          // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
          if (newSettings.username) {
            this.account.username = newSettings.username;
          }
          if (newSettings.emailAddress) {
            this.account.emailAddress = newSettings.emailAddress;
          }
          if (newSettings.frameworkConfig) {
            this.frameworkConfig = newSettings.frameworkConfig;
          }
          this.setLastServerMessage(this.$t('settingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.updateNotificationPreferencesIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.updateNotificationPreferencesIsLoading = false;
      });
    },
    toggleNotifications() {
      let newSettings = {
        frameworkConfig: {
          notifications: {
            disabled: !this.isTrue(this.frameworkConfig.notifications.disabled),
            accountAlerts: this.enableAccountAlerts,
            dailyFeedReport: this.enableDailyFeedReport,
            productNotifications: this.enableProductNotifications,
          }
        }
      };
      this.toggleNotificationsIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newSettings),
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return;
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).then(() => {
          // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
          if (newSettings.username) {
            this.account.username = newSettings.username;
          }
          if (newSettings.emailAddress) {
            this.account.emailAddress = newSettings.emailAddress;
          }
          if (newSettings.frameworkConfig) {
            this.frameworkConfig = newSettings.frameworkConfig;
          }
          this.setLastServerMessage(this.$t('settingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.toggleNotificationsIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.toggleNotificationsIsLoading = false;
      });
    },
    updateAccount() {
      let newSettings = {
        emailAddress: this.emailAddress
      };
      this.updateAccountIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newSettings),
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return;
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).then(() => {
          // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
          if (newSettings.username) {
            this.account.username = newSettings.username;
          }
          if (newSettings.emailAddress) {
            this.account.emailAddress = newSettings.emailAddress;
          }
          if (newSettings.frameworkConfig) {
            this.frameworkConfig = newSettings.frameworkConfig;
          }
          this.setLastServerMessage(this.$t('settingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.updateAccountIsLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.updateAccountIsLoading = false;
      });
    },
    // 
    toLocalDate(epochTime) {
      return new Date(epochTime * 1000).toLocaleDateString();
    },
    toLocalCurrency(amount) {
      return currencyFormatter.format(amount / 100);
    },
    getProductDescription() {
      return this.subscription === null ? null : this.subscription.lastInvoice.productDescription;
    },
    getHostedInvoiceUrl() {
      return this.subscription === null ? null : this.subscription.lastInvoice.hostedUrl;
    },
    getCustomerEmailAddress() {
      return this.subscription === null ? null : this.subscription.lastInvoice.customerEmail;
    },
    getCustomerName() {
      return this.subscription === null ? null : this.subscription.lastInvoice.customerName;
    },
    getAmountDue() {
      return this.subscription === null ? null : this.toLocalCurrency(this.subscription.lastInvoice.amountDue);
    },
    getAmountPaid() {
      return this.subscription === null ? null : this.toLocalCurrency(this.subscription.lastInvoice.amountPaid);
    },
    getAmountRemaining() {
      return this.subscription === null ? null : this.toLocalCurrency(this.subscription.lastInvoice.amountRemaining);
    },
    getLastInvoiceCreated() {
      return this.subscription === null ? null : this.toLocalDate(this.subscription.lastInvoice.created);
    },
    getLastInvoiceStatus() {
      return this.subscription === null ? null : this.subscription.lastInvoice.status;
    },
    getSubscriptionStarted() {
      return this.subscription == null ? null : this.toLocalDate(this.subscription.startDate);
    },
    getSubscriptionCurrentPeriod() {
      if (!this.subscription) {
        return null;
      } else {
        let startDate = this.toLocalDate(this.subscription.currentPeriodStart);
        let endDate = this.toLocalDate(this.subscription.currentPeriodEnd);
        return startDate + ' - ' + endDate;
      }
    },
    getSubscriptionCurrentPeriodEnd() {
      return this.toLocalDate(this.subscription.currentPeriodEnd);
    },
    getSubscriptionEndedAt() {
      return this.toLocalDate(this.subscription.endedAt);
    },
    getSubscriptionStatus() {
      return this.subscription.status;
    },
    isActive() {
      return this.subscription.status === "active";
    },
    isCanceled() {
      return this.subscription.cancelAtPeriodEnd === true;
    },
    hasEnded() {
      return this.subscription.endedAt !== null;
    },
    hasLastInvoice() {
      return this.subscription.lastInvoice !== null;
    },
    //
    // fetch framework config from /settings  
    refreshSettings() {
      this.isLoading = true; // top-level
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings", requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).then((data) => {
          this.account = {
            username: data.username,
            emailAddress: data.emailAddress,
            authProvider: data.authProvider,
            authProviderProfileImgUrl: data.authProviderProfileImgUrl,
            authProviderUsername: data.authProviderUsername
          }
          this.frameworkConfig = data.frameworkConfig;
          this.subscription = data.subscription;
          this.username = this.account.username;
          this.emailAddress = this.account.emailAddress;
          this.authProvider = 'LOCAL'; // this.account.authProvider;
          this.authProviderProfileImgUrl = this.account.authProviderProfileImgUrl;
          this.authProviderUsername = this.account.authProviderUsername;

          let frameworkConfig = this.account.frameworkConfig;
          if (frameworkConfig) {
            this.enableAccountAlerts = frameworkConfig.accountAlerts;
            this.enableDailyFeedReport = frameworkConfig.dailyFeedReport;
            this.enableProductNotifications = frameworkConfig.productNotifications;
          }
          this.isLoaded = true;
        }).catch((error) => {
          this.handleServerError(error);
          this.isLoaded = false;
        }).finally(() => {
          this.isLoading = false; // top-level 
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.isLoaded = false;
      });
    },
    exportOpml() {
      this.exportOpmlIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'GET',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/feeds/opml", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'feedgears-opml-export.xml';
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          this.setLastServerMessage(this.$t('opmlExportDownloaded'));
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.exportOpmlIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.exportOpmlIsLoading = false;
      });
    },
    finalizeDeactivation() {
      this.finalizeDeactivationIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'DELETE',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/deregister", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.finalizeDeactivationIsLoading = false;
          this.forceLogout = true;
          this.$auth.tearDownLoggedInSession();
          this.$router.push("/app");
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.finalizeDeactivationIsLoading = false;
      });
    },
    initPasswordReset() {
      this.showResetPassword = false;
      this.initPasswordResetIsLoading = true;
      this.$auth
        .pwResetWithSupplied(this.account.username, this.account.emailAddress)
        .then(() => {
          this.setLastServerMessage(this.$t('checkEmailForFurther'));
        })
        .catch((error) => {
          this.setLastServerMessage(error);
        })
        .finally(() => {
          this.initPasswordResetIsLoading = false;
        });
    },
    submitOrder() {
      this.submitOrderIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/order", requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).then((data) => {
          window.location.href = data.sessionUrl;
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.submitOrderIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.submitOrderIsLoading = false;
      });
    },
    cancelSubscription() {
      this.cancelSubscriptionIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          method: 'PUT',
          body: JSON.stringify({
            subscriptionStatus: 'CANCELED'
          }),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/subscriptions", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            this.$auth.unsubscribe();
            this.subscription.cancelAtPeriodEnd = true;
            this.setLastServerMessage(this.$t('yourSubscriptionWasCanceledClickToResume'));
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.cancelSubscriptionIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.cancelSubscriptionIsLoading = false;
      });
    },
    resumeSubscription() {
      this.resumeSubscriptionIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          method: 'PUT',
          body: JSON.stringify({
            subscriptionStatus: 'ACTIVE'
          }),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/subscriptions", requestOptions).then((response) => {
          if (response.status === 200) {
            this.$auth.subscribe();
            this.subscription.cancelAtPeriodEnd = false;
            this.setLastServerMessage(this.$t('yourSubscriptionWasResumed'));
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.resumeSubscriptionIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.resumeSubscriptionIsLoading = false;
      });
    },
    cancelSettings() {
      this.$emit('cancel');
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
