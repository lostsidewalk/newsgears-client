<template>
  <div class="modal-container">
    <div class="modal-body">
      <div class="modal-header">
        <h3 class="view-header-no-count">
          <span class="fa fa-feed fa-1x" />
          {{ this.$t('accountSettings') }}
          <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
        </h3>
      </div>
      <div class="modal-actions">
        <TabHeader :tabModel="tabModel" 
          :selectedTab="selectedTab" 
          :disabled="inTransit" 
          :theme="theme" 
          @selectTab="this.selectedTab = $event" />
        <!-- tab panel -->
        <div class="tabbed-panel">
          <!-- tab 1: settings -->
          <div class="tab" v-if="isLoaded && this.selectedTab === 'SETTINGS'">
            <!-- oauth2 profile (remote) -->
            <div class="settings-field" style="flex-direction: row;" v-if="authProvider !== 'LOCAL'">
              <!-- profile image -->
              <img v-if="authProviderProfileImgUrl" 
                :src="authProviderProfileImgUrl" 
                referrerpolicy="no-referrer" 
                class="oauth2-profile-img" 
                :alt="this.$t('oAuth2ProfileImage')" />
              <img v-else src="feedgears.png" 
                referrerpolicy="no-referrer" 
                class="oauth2-profile-img" 
                :alt="this.$t('defaultOAuth2ProfileImage')" />
              <div style="display: inline-flex; flex-direction: column; padding-left: .5rem;">
                <!-- auth provider username (auth provider user Id) -->
                <span style="padding: .125rem;">{{ authProviderUsername }}</span>
                <!-- email address -->
                <span style="padding: .125rem;">{{ emailAddress }}</span>
                <!-- auth provider -->
                <!-- <span style="padding: .125rem;">AUTH PROVIDER: {{ authProvider }}</span> -->
              </div>
            </div>

            <!-- username (local) -->
            <div class="settings-field" v-if="authProvider === 'LOCAL'">
              <label for="username">{{ this.$t('usernameColon') }}</label>
              <input name="username" type="text" v-model="username" :disabled="true"/>
            </div>
            <!-- email address (local) -->
            <div class="settings-field" :class="{ error: v$.emailAddress.$errors.length }" v-if="authProvider === 'LOCAL'">
              <label for="email">{{ this.$t('emailAddressColon') }}</label>
              <input name="email" type="text" v-model="v$.emailAddress.$model" :disabled="inTransit"/>
              <div class="settings-errors" v-for="(error, index) of v$.emailAddress.$errors" :key="index">
                <div class="settings-error-message">{{ error.$message }}</div>
              </div>
            </div>

            <div class="account-management-buttons">
              <!-- apply changes button (local) -->
              <button v-if="authProvider === 'LOCAL' && !this.showResetPassword && !this.showDeactivateUser" 
                id="updateAccount" 
                class="header-button accessible-button" 
                @click="updateAccount()" 
                :disabled="inTransit || v$.$invalid">
                {{ this.$t('applyChanges') }}
              </button>
              <!-- deactivate account button -->
              <button v-if="!this.showDeactivateUser && !this.showResetPassword" 
                class="header-button accessible-button" 
                @click="this.showDeactivateUser = true" 
                :disabled="inTransit">
                {{ this.$t('deactivateYourAccount') }}
              </button>
              <!-- download your data button-->
              <button v-if="this.showDeactivateUser" 
                class="header-button accessible-button" 
                @click="exportOpml()"
                :disabled="inTransit">
                {{ this.$t('downloadYourData') }}
              </button>
              <!-- permanently delete your account button -->
              <button v-if="this.showDeactivateUser" 
                class="header-button accessible-button" 
                @click="finalizeDeactivation()"
                :disabled="inTransit">
                {{ this.$t('permanentlyDeleteYourAccount') }}
              </button>
              <!-- cancel (deactivate account) button -->
              <button v-if="this.showDeactivateUser" id="cancelDeactivateAccount" 
                class="header-button accessible-button" 
                @click="this.showDeactivateUser = false" 
                :disabled="inTransit">
                {{ this.$t('cancel') }}
              </button>
              <button v-if="this.showResetPassword" 
                class="header-button accessible-button" 
                @click="initPasswordReset()"
                :disabled="inTransit">
                {{ this.$t('sendPasswordResetEmail') }}
              </button>
              <!-- reset password button (local) -->
              <button v-if="authProvider === 'LOCAL' && !this.showResetPassword && !this.showDeactivateUser" 
                id="resetPassword" 
                class="header-button accessible-button" 
                @click="resetPassword()" 
                :disabled="inTransit">
                {{ this.$t('resetPassword') }}
              </button>
              <!-- cancel (reset password) -->
              <button v-if="this.showResetPassword" 
                id="cancelResetPassword" 
                class="header-button accessible-button" 
                @click="this.showResetPassword = false" 
                :disabled="inTransit">
                {{ this.$t('cancel') }}
              </button>
            </div>

            <p>
              {{ this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled) ? this.$t('emailNotificationsAreDisabled') : this.$t('emailNotificationsAreEnabled') }} {{ this.$t('weWillNotSellOrDiscloseYourInformation') }} 
            </p>

            <div class="settings-field settings-inline-field">
              <input type="checkbox" id="enableAccountAlerts" name="enableAccountAlerts" v-model="enableAccountAlerts" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)">
              <label class="notification-checkbox" for="enableAccountAlerts">
                {{ this.$t('enableAccountAlertsNotifications') }}
              </label>
            </div>

            <div class="settings-field settings-inline-field">
              <input type="checkbox" id="enableProductNotifications" name="enableProductNotifications" v-model="enableProductNotifications" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)"/>
              <label class="notification-checkbox" for="enableProductNotifications">
                {{ this.$t('enableProductNotifications') }}
              </label>
            </div>

            <div class="account-management-buttons">
              <!-- update notification preferences button -->
              <button id="updateNotificationPreferences" 
                class="header-button accessible-button" @click="updateNotificationPreferences()" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)">
                {{ this.$t('updateNotificationPreferences') }}
              </button>
              <!-- toggle (all) notifications button -->
              <button class="header-button accessible-button" @click="toggleNotifications()" :disabled="inTransit">
                {{ (this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)) ? this.$t('enableSelectedNotifications') : this.$t('disableSelectedNotifications') }} 
              </button>
            </div>

            <div v-if="this.subscription">
              <p>{{ this.$t('subscriptionStatus', { 
                status: getSubscrpitionStatus(), 
                started: getSubscriptionStarted() 
                }) }}</p>

              <p v-if="isCanceled()">{{ this.$t('yourSubscriptionWasCanceled') }}</p>

              <div class="settings-field" v-if="isActive()">
                <label for="subscription-current-period">{{ this.$t('currentPeriod') }}</label>
                <input name="subscription-current-period" type="text" :placeholder="getSubscriptionCurrentPeriod()" :disabled="inTransit" />
              </div>

              <div class="settings-field" v-if="hasEnded()">
                <label for="subscription-ended-at">{{ this.$t('endedAt') }}</label>
                <input name="subscription-ended-at" type="text" :placeholder="getSubscriptionEndedAt()" :disabled="inTransit" />
              </div>

              <div class="settings-field" v-if="isCanceled()">
                <label for="subscription-ended-at">{{ this.$t('willEndAt') }}</label>
                <input name="subscription-ended-at" type="text" :placeholder="getSubscriptionCurrentPeriodEnd()" :disabled="inTransit" />
              </div>

              <div class="settings-field" v-if="hasLastInvoice()">
                <label>{{ this.$t('mostRecentInvoice') }} ({{ getLastInvoiceCreated() }})</label>
                <label>{{ this.$t('statusColon') }} {{ getLastInvoiceStatus() }}</label> 
                <label>{{ this.$t('amountDueColon') }} {{ getAmountDue() }}</label>
                <label>{{ this.$t('amountPaidColon') }} {{ getAmountPaid() }}</label>
                <label>{{ this.$t('amountRemainingColon') }} {{ getAmountRemaining() }}</label>
                <label>{{ this.$t('customerEmailAddressColon') }} {{ getCustomerEmailAddress() }}</label>
                <label>{{ this.$t('customerNameColon') }} {{ getCustomerName() }}</label>
                <label>{{ this.$t('invoiceUrlColon') }} <a :href="getHostedInvoiceUrl()" target="_blank">{{ this.$t('clckHere') }}</a></label>
                <label>{{ this.$t('productColon') }} {{ getProductDescription() }}</label>
              </div>

              <div class="account-management-buttons">
                <button id="cancelSubscription" class="header-button accessible-button" @click="cancelSubscription()" :disabled="inTransit" v-if="this.subscription && !isCanceled()">
                  {{ this.$t('cancelSubscription') }}
                </button>
                <button id="resumeSubscription" class="header-button accessible-button" @click="resumeSubscription()" :disabled="inTransit" v-if="this.subscription && isCanceled()">
                  {{ this.$t('resumeSubscription') }}
                </button>
              </div>
            </div>
            <div v-else>
              <p>{{ this.$t('pleaseConsiderSubscribing') }}</p>

              <div class="account-management-buttons">
                <button id="checkout" class="header-button accessible-button" @click="submitOrder" :disabled="inTransit">
                  {{ this.$t('checkout') }}
                </button>
              </div>
            </div>
          </div>
          <div class="tab" v-if="isLoaded && this.selectedTab === 'THEME'">
            <div class="color-field-buttons">
              <button class="header-button accessible-button" @click="updateDisplaySettings">
                <span v-if="this.$theme.currentTheme.ident === 'light'">
                  {{ this.$t('updateLightTheme') }}
                </span>
                <span v-if="this.$theme.currentTheme.ident === 'dark'">
                  {{ this.$t('updateDarkTheme') }}
                </span>
                 &nbsp; <span class="fa fa-save" />
              </button>
            </div>
            <div class="color-field-container">
              <ColorField v-for="themeAttribute in this.$theme.keySet" :key="themeAttribute.name"
              :attr="themeAttribute"
              :value="this.$theme.currentTheme[themeAttribute.name]"
              :theme="theme" 
              @update:modelValue="$event => updateThemeAttribute(themeAttribute.name, $event)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { maxLength, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import TabHeader from '@/components/layout/TabHeader.vue';
import ColorField from './ColorField.vue';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default {
  name: "SettingsPanel",
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  props: [ "baseUrl", "theme" ],
  emits: ["updateServerMessage"],
  components: {
    NavbarFixedHeader,
    TabHeader,
    ColorField,
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
  mounted() {
    this.refreshSettings();
  },
  data() {
    return {
      account: null,
      frameworkConfig: null,
      subscription: null,
      forceLogout: false,
      // 
      isLoaded: false,
      inTransit: true,
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
      let settingsObj = {
        frameworkConfig: {
          notifications: {
            accountAlerts: this.enableAccountAlerts,
            dailyFeedReport: this.enableDailyFeedReport,
            productNotifications: this.enableProductNotifications,
          }
        }
      };
      this.updateSettings(settingsObj);
    },
    toggleNotifications() {
      this.updateSettings({
        frameworkConfig: {
          notifications: {
            disabled: !this.isTrue(this.frameworkConfig.notifications.disabled),
            accountAlerts: this.enableAccountAlerts,
            dailyFeedReport: this.enableDailyFeedReport,
            productNotifications: this.enableProductNotifications,
          }
        }
      });
    },
    updateAccount() {
      this.updateSettings({
        emailAddress: this.emailAddress
      });
    },
    updateTheme() {
      this.updateSettings({
        theme: this.$theme.currentTheme,
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
      this.inTransit = true;
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
          this.authProvider = this.account.authProvider;
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
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.isLoaded = false;
      });
    },
    // put framework config to /settings 
    updateSettings(newSettings) {
      this.inTransit = true;
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
          // TODO: set the account obj properties from the JSON response object (above) 
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
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    // put theme config to /settings/display (see DisplayMode->refreshDisplaySettings for accessor) 
    updateDisplaySettings() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        let t = {};
        if (this.$theme.currentTheme.ident === 'light') {
          t.lightTheme = this.$theme.currentTheme;
        } else if (this.$theme.currentTheme.ident === 'dark') {
          t.darkTheme = this.$theme.currentTheme;
        }
        const controller = new AbortController();
        const requestOptions = {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            themeConfig: t
          }),
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings/display", requestOptions)
        .then((response) => {
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
          this.setLastServerMessage(this.$t('themeSettingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    exportOpml() {
      this.inTransit = true;
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
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    finalizeDeactivation() {
      this.inTransit = true;
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
          this.inTransit = false;
          this.forceLogout = true;
          this.$auth.tearDownLoggedInSession();
          this.$router.push("/app");
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    initPasswordReset() {
      this.showResetPassword = false;
      this.inTransit = true;
      this.$auth
        .pwResetWithSupplied(this.account.username, this.account.emailAddress)
        .then(() => {
          this.setLastServerMessage(this.$t('checkEmailForFurther'));
        })
        .catch((error) => {
          this.setLastServerMessage(error);
        })
        .finally(() => {
          this.inTransit = false;
        });
    },
    submitOrder() {
      this.inTransit = true;
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
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    cancelSubscription() {
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
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    resumeSubscription() {
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
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    updateThemeAttribute(attrName, attrValue) {
      this.$theme.currentTheme[attrName] = attrValue;
      if (this.$theme.currentTheme.ident === 'light') {
        this.$theme.userLightTheme[attrName] = attrValue;
      } else if (this.$theme.currentTheme.ident === 'dark') {
        this.$theme.userDarkTheme[attrName] = attrValue;
      }
    },
    cancelSettings() {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.modal-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid transparent;
  border-radius: 4px;
  font-family: Arial, Helvetica, sans-serif;
}

.modal-header {
  text-align: left;
}

.modal-body {
  color: v-bind('theme.normalmessage');
  text-align: left;
  width: 100%;
  height: fit-content;
  padding: 2rem;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.modal-actions {
  padding-top: .75rem;
}

.header-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 4px;
  text-align: center;
}

.header-button:disabled {
  cursor: auto;
}

.header-button:hover, .header-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.header-button:disabled:hover {
  background-color: unset;
}

.tabbed-panel {
  padding: .75rem;
  border: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 3px;
  margin-bottom: 1rem;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  background-color: v-bind('theme.sectionhighlight');
}

.tab {
  display: grid;
  contain: content;
  overflow: auto;
}

.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0rem;
}

@keyframes load {
    0% {
        width: 0%;
    }

    87.5% {
        width: 100%;
    }
}

@keyframes turn {
    0% {
        transform: rotateY(0deg);
    }

    6.25%,
    50% {
        transform: rotateY(180deg);
    }

    56.25%,
    100% {
        transform: rotateY(360deg);
    }
}

@keyframes bounce {

    0%,
    100% {
        top: .75rem;
    }

    12.5% {
        top: 30px;
    }
}

.settings-field {
  border: 1px solid v-bind('theme.sectionbordercolor');
  text-align: left;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  padding: .75rem;
  border-radius: 4px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
}

.settings-field label {
  padding-bottom: .125rem;
}

.settings-field input {
  padding: .44rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 4px;
  margin-top: .125rem;
}

.settings-field input[type="text"] {
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.settings-field input:hover, .settings-field input:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
}

.settings-field input[type="text"]:hover, .settings-field input[type="text"]:focus-visible  {
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.settings-inline-field {
  flex-direction: row !important;
}

.notification-checkbox {
  padding: .44rem;
  border-radius: 4px;
  user-select: none;
}

.notification-checkbox > input {
  position: relative;
  vertical-align: middle;
  box-shadow: unset;
}

.notification-checkbox > input:hover, .notification-checkbox > input:focus-visible {
  box-shadow: unset;
}

.notification-checkbox > input:disabled {
  cursor: auto;
}

.oauth2-profile-img {
  height: 96px;
  width: 96px;
  border-radius: 4px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.account-management-buttons {
  display: flex;
  flex-direction: row;
  gap: .5rem;
}

.color-field-container {
  overflow: auto;
  max-height: 46svh;
}

.color-field-buttons {
  display: flex;
  flex-direction: row;
  gap: .5rem;
  margin-bottom: 1svh;
}
</style>
