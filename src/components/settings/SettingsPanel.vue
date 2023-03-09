<template>
  <div class="modal-container">
    <div class="modal-body">
      <div class="modal-header">
        <h3 class="view-header-no-count">
          <span class="fa fa-feed fa-1x" />
          ACCOUNT SETTINGS
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
          <div class="tab" v-if="isLoaded">
            <!-- oauth2 profile (remote) -->
            <div class="settings-field" style="flex-direction: row;" v-if="authProvider !== 'LOCAL'">
              <!-- profile image -->
              <img v-if="authProviderProfileImgUrl" :src="authProviderProfileImgUrl" referrerpolicy="no-referrer" class="oauth2-profile-img" alt="OAuth2 profile image" />
              <img v-else src="feedgears.png" referrerpolicy="no-referrer" class="oauth2-profile-img" alt="Default OAuth2 profile image" />
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
              <label for="username">USERNAME:</label>
              <input name="username" type="text" v-model="username" :disabled="true"/>
            </div>
            <!-- email address (local) -->
            <div class="settings-field" :class="{ error: v$.emailAddress.$errors.length }" v-if="authProvider === 'LOCAL'">
              <label for="email">EMAIL ADDRESS:</label>
              <input name="email" type="text" v-model="v$.emailAddress.$model" :disabled="inTransit"/>
              <div class="settings-errors" v-for="(error, index) of v$.emailAddress.$errors" :key="index">
                <div class="settings-error-message">{{ error.$message }}</div>
              </div>
            </div>

            <div class="account-management-buttons">
              <!-- apply changes button (local) -->
              <button v-if="authProvider === 'LOCAL' && !this.showResetPassword && !this.showDeactivateUser" id="updateAccount" class="header-button" @click="updateAccount()" :disabled="inTransit || v$.$invalid">
                Apply Changes
              </button>
              <!-- deactivate account button -->
              <button v-if="!this.showDeactivateUser && !this.showResetPassword" class="header-button" @click="this.showDeactivateUser = true" :disabled="inTransit">
                Deactivate Account
              </button>
              <!-- download your data button-->
              <button v-if="this.showDeactivateUser" class="header-button" @click="exportOpml()">
                Download Your Data
              </button>
              <!-- permanently delete your account button -->
              <button v-if="this.showDeactivateUser" class="header-button" @click="finalizeDeactivation()">
                Permanently Delete Your Account
              </button>
              <!-- cancel (deactivate account) button -->
              <button v-if="this.showDeactivateUser" id="cancelDeactivateAccount" class="header-button" @click="this.showDeactivateUser = false" :disabled="inTransit">
                Cancel
              </button>
              <button v-if="this.showResetPassword" class="header-button" @click="initPasswordReset()">
                Send Password Reset Email
              </button>
              <!-- reset password button (local) -->
              <button v-if="authProvider === 'LOCAL' && !this.showResetPassword && !this.showDeactivateUser" id="resetPassword" class="header-button" @click="resetPassword()" :disabled="inTransit">
                Reset Password
              </button>
              <!-- cancel (reset password) -->
              <button v-if="this.showResetPassword" id="cancelResetPassword" class="header-button" @click="this.showResetPassword = false" :disabled="inTransit">
                Cancel
              </button>
            </div>

            <p>
              Email notifications are currently {{ this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled) ? 'disabled' : 'enabled' }}.  Please note that we will neve sell or disclose your personal information to anyone.
            </p>

            <div class="settings-field settings-inline-field">
              <input type="checkbox" id="enableAccountAlerts" name="enableAccountAlerts" v-model="enableAccountAlerts" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)">
              <label class="notification-checkbox" for="enableAccountAlerts">
                Enable this option to receive <b>account alerts and maintenance notifications</b>.
              </label>
            </div>

            <div class="settings-field settings-inline-field">
              <input type="checkbox" id="enableProductNotifications" name="enableProductNotifications" v-model="enableProductNotifications" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)"/>
              <label class="notification-checkbox" for="enableProductNotifications">
                Enable this option to receive occasional emails about <b>production notifications and new features</b>.
              </label>
            </div>

            <div class="account-management-buttons">
              <!-- update notification preferences button -->
              <button id="updateNotificationPreferences" class="header-button" @click="updateNotificationPreferences()" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)">
                Update Notification Preferences
              </button>
              <!-- toggle (all) notifications button -->
              <button class="header-button" @click="toggleNotifications()" :disabled="inTransit">
                {{ (this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)) ? 'Enable Selected Notifications' : 'Disable All Notifications' }} 
              </button>
            </div>

            <div v-if="this.subscription">
              <p>Your subscription is currently {{ getSubscriptionStatus() }}.  It began at {{ getSubscriptionStarted() }}.</p>

              <p v-if="isCanceled()">Your subscription was canceled, and will not renew.</p>

              <div class="settings-field" v-if="isActive()">
                <label for="subscription-current-period">CURRENT PERIOD</label>
                <input name="subscription-current-period" type="text" :placeholder="getSubscriptionCurrentPeriod()" :disabled="inTransit" />
              </div>

              <div class="settings-field" v-if="hasEnded()">
                <label for="subscription-ended-at">ENDED AT</label>
                <input name="subscription-ended-at" type="text" :placeholder="getSubscriptionEndedAt()" :disabled="inTransit" />
              </div>

              <div class="settings-field" v-if="isCanceled()">
                <label for="subscription-ended-at">WILL END AT</label>
                <input name="subscription-ended-at" type="text" :placeholder="getSubscriptionCurrentPeriodEnd()" :disabled="inTransit" />
              </div>

              <div class="settings-field" v-if="hasLastInvoice()">
                <label>MOST RECENT INVOICE ({{ getLastInvoiceCreated() }})</label>
                <label>STATUS: {{ getLastInvoiceStatus() }}</label> 
                <label>AMOUNT DUE: {{ getAmountDue() }}</label>
                <label>AMOUNT PAID: {{ getAmountPaid() }}</label>
                <label>AMOUNT REMAINING: {{ getAmountRemaining() }}</label>
                <label>CUSTOMER EMAIL ADDRESS: {{ getCustomerEmailAddress() }}</label>
                <label>CUSTOMER NAME: {{ getCustomerName() }}</label>
                <label>URL: <a :href="getHostedInvoiceUrl()" target="_blank">Click here.</a></label>
                <label>PRODUCT: {{ getProductDescription() }}</label>
              </div>

              <div class="account-management-buttons">
                <button id="cancelSubscription" class="header-button" @click="cancelSubscription()" :disabled="inTransit" v-if="this.subscription && !isCanceled()">
                  Cancel Subscription
                </button>
                <button id="resumeSubscription" class="header-button" @click="resumeSubscription()" :disabled="inTransit" v-if="this.subscription && isCanceled()">
                  Resume Subscription
                </button>
              </div>
            </div>
            <div v-else>
              <p>Please consider subscribing to FeedGears.  We are supported 100% by the user community.</p>

              <div class="account-management-buttons">
                <button id="checkout" class="header-button" @click="submitOrder" :disabled="inTransit">
                  Checkout
                </button>
              </div>
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
        this.setLastServerMessage('Something went wrong.  Please try again later.');
      } else if (error.message) {
        this.setLastServerMessage(error.message); 
      } else {
        this.setLastServerMessage(error); // $auth plugin errors 
      }
    },
    setLastServerMessage(message) {
      if (message) {
        console.log("emitting updateServerMessage: " + message);
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
    // 
    refreshSettings() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include' 
            };
        fetch(this.baseUrl + "/settings", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
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
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.isLoaded = false;
      });
    },
    updateSettings(newSettings) {
      try {
        if (newSettings.emailAddress && newSettings.emailAddress.length > 512) {
          throw Error("");
        }
      } catch (error) {
        console.log(error);
        return;
      }
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newSettings),
            credentials: 'include' 
          };
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.text(); // TODO: correct this; should be a JSON object 
          } else {
            return response.json().then(j => {throw new Error(j.message)})
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
          this.setLastServerMessage("Settings updated.");
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    exportOpml() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            method: 'GET',
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include' 
          };
        fetch(this.baseUrl + "/feeds/opml", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'feedgears-opml-export.xml';
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          this.setLastServerMessage("OPML export downloaded.");
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    finalizeDeactivation() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include' 
          };
        fetch(this.baseUrl + "/deregister", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
          this.forceLogout = true;
          this.$auth.tearDownLoggedInSession();
          this.$router.push("/app");
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
          this.setLastServerMessage("Check your email to further instructions.");
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
        const requestOptions = {
              method: 'POST',
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include' 
            };
        fetch(this.baseUrl + "/order", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((data) => {
          let sessionId = data.sessionId;
          let sessionUrl = data.sessionUrl;
          console.log("settings: redirecting to checkout url=" + sessionUrl + " for sessionId=" + sessionId);
          window.location.href = sessionUrl;
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    cancelSubscription() {
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include',
            method: 'PUT',
            body: JSON.stringify({
              subscriptionStatus: 'CANCELED'
            })
          };
        fetch(this.baseUrl + "/subscriptions", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            this.$auth.unsubscribe();
            this.subscription.cancelAtPeriodEnd = true;
            this.setLastServerMessage("Your subscription was canceled.  To resume, click 'Resume Subscription' on this page.");
          } else {
            response.json().then(j => {throw new Error(j.message)})
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    resumeSubscription() {
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include',
            method: 'PUT',
            body: JSON.stringify({
              subscriptionStatus: 'ACTIVE'
            })
          };
        fetch(this.baseUrl + "/subscriptions", requestOptions).then((response) => {
          if (response.status === 200) {
            this.$auth.subscribe();
            this.subscription.cancelAtPeriodEnd = false;
            this.setLastServerMessage("Your subscription was resumed.");
          } else {
            response.json().then(j => {throw new Error(j.message)})
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
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
  border-radius: 5px;
}

.modal-header {
  text-align: left;
}

.modal-body {
  background: v-bind('theme.modalbodybg');
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
  border-radius: 3px;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
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
  border-top: 0px;
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
  border-left: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 0px 0px 3px 3px;
  margin-bottom: 1rem;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
}

.tab {
  display: grid;
  contain: content;
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
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
}

.settings-field label {
  padding-bottom: .125rem;
}

.settings-field input {
  padding: .31rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
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
  padding: .31rem;
  border-radius: 3px;
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
  border-radius: 5px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.account-management-buttons {
  display: flex;
  flex-direction: row;
  gap: .5rem;
}
</style>
