<template>
  <v-card :disabled="inTransit">
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
            :text="$t('deactivateYourAccount')" 
            @click="showDeactivateUser = true"
          />
          <!-- download your data button-->
          <v-btn
            v-if="showDeactivateUser" 
            :loading="exportOpmlInTransit"
            :text="$t('downloadYourData')"
            @click="exportOpml()"
          />
          <!-- permanently delete your account button -->
          <v-btn
            v-if="showDeactivateUser" 
            :loading="finalizeDeactivationInTransit"
            :text="$t('permanentlyDeleteYourAccount')"
            @click="finalizeDeactivation()"
          />
          <!-- cancel (deactivate account) button -->
          <v-btn
            v-if="showDeactivateUser"
            id="cancelDeactivateAccount" 
            :text="$t('cancel')" 
            @click="showDeactivateUser = false"
          />
          <v-btn
            v-if="showResetPassword" 
            :loading="initPasswordResetInTransit"
            :text="$t('sendPasswordResetEmail')"
            @click="initPasswordReset()"
          />
          <!-- reset password button (local) -->
          <v-btn
            v-if="authProvider === 'LOCAL' && !showResetPassword && !showDeactivateUser" 
            id="resetPassword" 
            :loading="resetPasswordInTransit" 
            :text="$t('resetPassword')"
            @click="resetPassword()"
          />
          <!-- cancel (reset password) -->
          <v-btn
            v-if="showResetPassword" 
            id="cancelResetPassword" 
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
        :class="{ error: v$.emailAddress.$errors.length }"
      >
        <v-card-title class="pa-4">
          {{ $t('emailAddress') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-text-field
            v-model="v$.emailAddress.$model" 
            name="email"
            :label="$t('emailAddressColon')" 
            type="text"
          />
          <div
            v-for="(error, index) of v$.emailAddress.$errors"
            :key="index"
            class="settings-errors"
          >
            <div class="settings-error-message">
              {{ error.$message }}
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <!-- apply changes button (local) -->
          <v-btn
            v-if="authProvider === 'LOCAL' && !showResetPassword && !showDeactivateUser" 
            id="updateAccount" 
            :disabled="v$.$invalid" 
            :loading="updateAccountInTransit"
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
            :disabled="frameworkConfig && isTrue(frameworkConfig.notifications.disabled)" 
            :loading="updateNotificationPreferencesInTransit"
            :text="$t('updateNotificationPreferences')"
            @click="updateNotificationPreferences()"
          />
          <!-- toggle (all) notifications button -->
          <v-btn 
            :loading="toggleNotificationsInTransit" 
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
            :loading="cancelSubscriptionInTransit" 
            :text="$t('cancelSubscription')"
            @click="cancelSubscription()"
          />
          <v-btn
            v-if="subscription && isCanceled()"
            id="resumeSubscription" 
            :loading="resumeSubscriptionInTransit" 
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
            :loading="submitOrderInTransit" 
            :text="$t('checkout')"
            @click="submitOrder"
          />
        </v-card-actions>
      </v-card>
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
import { maxLength, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default {
  name: "SettingsPanel",
  props: {
    baseUrl: { type: String, required: true },
  },
  emits: [ "updateServerMessage", "dismiss" ],
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  validations() {
    return {
      username: { 
        maxLength: maxLength(512),
      },
      emailAddress: { 
        email, 
        maxLength: maxLength(512),
      },
    }
  },
  data() {
    return {
      account: null,
      frameworkConfig: null,
      subscription: null,
      forceLogout: false,
      // 
      isLoaded: false,
      inTransit: true, // top-level 
      exportOpmlInTransit: false,
      finalizeDeactivationInTransit: false,
      initPasswordResetInTransit: false,
      resetPasswordInTransit: false,
      updateAccountInTransit: false,
      updateNotificationPreferencesInTransit: false,
      toggleNotificationsInTransit: false,
      cancelSubscriptionInTransit: false,
      resumeSubscriptionInTransit: false,
      submitOrderInTransit: false,
      serverMessages: [],
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
      this.updateNotificationPreferencesInTransit = true;
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
          this.updateNotificationPreferencesInTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.updateNotificationPreferencesInTransit = false;
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
      this.toggleNotificationsInTransit = true;
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
          this.toggleNotificationsInTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.toggleNotificationsInTransit = false;
      });
    },
    updateAccount() {
      let newSettings = {
        emailAddress: this.emailAddress
      };
      this.updateAccountInTransit = true;
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
          this.updateAccountInTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.updateAccountInTransit = false;
      });
    },
    // 
    toLocalDate(epochTime) {
      return new Date(epochTime * 1000).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
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
      this.inTransit = true; // top-level
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
          this.inTransit = false; // top-level 
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.isLoaded = false;
      });
    },
    exportOpml() {
      this.exportOpmlInTransit = true;
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
          this.exportOpmlInTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.exportOpmlInTransit = false;
      });
    },
    finalizeDeactivation() {
      this.finalizeDeactivationInTransit = true;
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
          this.finalizeDeactivationInTransit = false;
          this.forceLogout = true;
          this.$auth.tearDownLoggedInSession();
          this.$router.push("/app");
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.finalizeDeactivationInTransit = false;
      });
    },
    initPasswordReset() {
      this.showResetPassword = false;
      this.initPasswordResetInTransit = true;
      this.$auth
        .pwResetWithSupplied(this.account.username, this.account.emailAddress)
        .then(() => {
          this.setLastServerMessage(this.$t('checkEmailForFurther'));
        })
        .catch((error) => {
          this.setLastServerMessage(error);
        })
        .finally(() => {
          this.initPasswordResetInTransit = false;
        });
    },
    submitOrder() {
      this.submitOrderInTransit = true;
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
          this.submitOrderInTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.submitOrderInTransit = false;
      });
    },
    cancelSubscription() {
      this.cancelSubscriptionInTransit = true;
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
          this.cancelSubscriptionInTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.cancelSubscriptionInTransit = false;
      });
    },
    resumeSubscription() {
      this.resumeSubscriptionInTransit = true;
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
          this.resumeSubscriptionInTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.resumeSubscriptionInTransit = false;
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
