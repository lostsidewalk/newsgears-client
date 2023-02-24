<template>
  <div class="settings-container" v-if="this.account">
    <!-- account settings -->
    <div class="settings-view">
      <!-- account config header -->
      <div class="view-header">
        <span style="display: inline-flex;flex-direction: row;">
          <h3 class="view-header-count">
            <i class="fa fa-user fa-1x"/>
            {{ this.getModeVerbiage() }}
          </h3>
        </span>
      </div>
      <!-- account config form -->
      <div class="view-header update-settings-body">
        <!-- oauth2 profile (remote) -->
        <div class="settings-field" v-if="authProvider !== 'LOCAL' && !this.showDeactivateUser">
          <div style="display: flex;">
            <!-- profile image -->
            <img :src="authProviderProfileImgUrl" referrerpolicy="no-referrer" class="oauth2-profile-img"/>
            <div style="display: inline-flex; flex-direction: column; padding-left: .5rem;">
              <!-- auth provider username (auth provider user Id) -->
              <span style="padding: .125rem;">{{ authProviderUsername }}</span>
              <!-- email address -->
              <span style="padding: .125rem;">{{ emailAddress }}</span>
              <!-- auth provider -->
              <!-- <span style="padding: .125rem;">AUTH PROVIDER: {{ authProvider }}</span> -->
            </div>
          </div>
        </div>
        <!-- username (local) -->
        <div class="settings-field" v-if="authProvider === 'LOCAL' && !this.showDeactivateUser && !this.showResetPassword">
          <label for="username">USERNAME:</label>
          <input name="username" type="text" v-model="username" :disabled="true"/>
        </div>
        <!-- email address (local) -->
        <div class="settings-field" :class="{ error: v$.emailAddress.$errors.length }" v-if="authProvider === 'LOCAL' && !this.showDeactivateUser && !this.showResetPassword">
          <label for="email">EMAIL ADDRESS:</label>
          <input name="email" type="text" v-model="v$.emailAddress.$model" :disabled="inTransit"/>
          <div class="settings-errors" v-for="(error, index) of v$.emailAddress.$errors" :key="index">
            <div class="settings-error-message">{{ error.$message }}</div>
          </div>
        </div>
        <div class="settings-field" v-if="this.showDeactivateUser">
          <label for="email">DOWNLOAD YOUR DATA:</label>
          <button class="download-button" @click="exportOpml()">Click here</button>
        </div>
        <div class="settings-field" v-if="this.showDeactivateUser">
          <label for="email">PERMANENTLY DELETE YOUR ACCOUNT:</label>
          <button class="deactivate-button" @click="finalizeDeactivation()">Click here</button>
        </div>
        <div class="settings-field" v-if="this.showResetPassword">
          <label for="email">SEND PASSWORD RESET EMAIL</label>
          <button class="pw-reset-button" @click="initPasswordReset()">Send</button>
        </div>
      </div>
      <!-- account config toolbar -->
      <div class="view-header-toolbar">
        <!-- apply changes button (local) -->
        <div v-if="authProvider === 'LOCAL' && !this.showDeactivateUser && !this.showResetPassword">
          <button id="updateAccount" class="header-button" @click="updateAccount()" :disabled="inTransit || v$.$invalid">
            Apply Changes
          </button>
        </div>
        <!-- reset password button (local) -->
        <div v-if="authProvider === 'LOCAL' && !this.showDeactivateUser && !this.showResetPassword">
          <button id="resetPassword" class="header-button" @click="resetPassword()" :disabled="inTransit">
            Reset Password
          </button>
        </div>
        <!-- deactivate account button -->
        <div v-if="!this.showDeactivateUser && !this.showResetPassword">
          <button id="deactivateAccount" class="header-button" @click="this.showDeactivateUser = true" :disabled="inTransit">
            Deactivate Account
          </button>
        </div>
        <!-- cancel (deactivate account) -->
        <div v-if="this.showDeactivateUser">
          <button id="cancelDeactivateAccount" class="header-button" @click="this.showDeactivateUser = false" :disabled="inTransit">
            Cancel
          </button>
        </div>
        <!-- cancel (reset password) -->
        <div v-if="this.showResetPassword">
          <button id="cancelResetPassword" class="header-button" @click="this.showResetPassword = false" :disabled="inTransit">
            Cancel
          </button>
        </div>
      </div>
    </div>
    <!-- notifications -->
    <div class="settings-view notifications-view">
      <!-- notifications config header -->
      <div class="view-header">
        <span style="display: inline-flex;flex-direction: row;">
          <h3 class="view-header-count">
            <i class="fa fa-envelope fa-1x"/>
            NOTIFICATION SETTINGS
          </h3>
        </span>
        <!-- notifications config body text -->
        <p>
          Email notifications are currently {{ this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled) ? 'disabled' : 'enabled' }}.  Please note that we will neve sell or disclose your personal information to anyone.
        </p>
      </div>
      <!-- notification config form -->
      <div class="view-header update-settings-body">
        <div class="settings-field">
          <span class="notification-option">
            <label class="notification-checkbox" for="enableAccountAlerts">
              <input type="checkbox" id="enableAccountAlerts" name="enableAccountAlerts" v-model="enableAccountAlerts" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)"/>ACCOUNT ALERTS AND MAINTENANCE NOTIFICATIONS
            </label>
          </span>
          <!-- <span class="notification-option">
            <label class="notification-checkbox" for="enableDailyFeedReport">
              <input type="checkbox" id="enableDailyFeedReport" name="enableDailyFeedReport" v-model="enableDailyFeedReport" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)"/>DAILY FEED REPORT
            </label>
          </span> -->
          <span class="notification-option">
            <label class="notification-checkbox" for="enableProductNotifications">
              <input type="checkbox" id="enableProductNotifications" name="enableProductNotifications" v-model="enableProductNotifications" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)"/>PRODUCT NOTIFICATIONS, NEW FEATURES, ETC.
            </label>
          </span>
        </div>
      </div>
      <!-- notification config toolbar -->
      <div class="view-header-toolbar">
        <!-- update notification preferences button -->
        <div>
          <button id="updateNotificationPreferences" class="header-button" @click="updateNotificationPreferences()" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)">
            Update Notification Preferences
          </button>
        </div>
        <!-- toggle (all) notifications button -->
        <div>
          <button id="toggleNotifications" class="header-button" @click="toggleNotifications()" :disabled="inTransit">
            {{ (this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)) ? 'Enable Selected Notifications' : 'Disable All Notifications' }} 
          </button>
        </div>
      </div>
    </div>
    <!-- checkout view -->
    <div class="settings-view checkout-view">
      <!-- checkout header-->
      <div class="view-header">
        <span style="display: inline-flex;flex-direction: row;">
          <h3 class="view-header-count">
            <i class="fa fa-gears fa-1x"/>
            JOIN THE FEEDGEARS COMMUNITY
          </h3>
        </span>
      </div> 
      <!-- plans -->
      <div class="plans-view">
        <div class="free-view">
          <div class="view-header">
            <span style="display: inline-flex;flex-direction: row;">
              <h3 class="view-header-count">FREE TIER</h3>
            </span>
            <p class="price-description">
              Free, forever.
            </p>
            <p class="plan-description">
              Basic features:
            </p>
            <ul class="plan-features">
              <li>Single queue with a maximum of 15 upstream subscriptions</li>
              <li>Hourly data import</li>
              <li>Configure FeedGears to query the world's news sources via NewsApi.org integration</li>
              <li>Publish a feed of your starred items in RSS/ATOM/JSON format</li>
              <li>We will never show you ads, or disclose your data to anyone</li>
              <li>We are committed to security, privacy, and accessibility</li>
              <li>Randomize kitten</li>
            </ul>
          </div>
        </div>
        <div class="premium-view">
          <div class="view-header">
            <span style="display: inline-flex;flex-direction: row;">
              <h3 class="view-header-count">PREMIUM TIER</h3>
            </span>
            <p class="price-description">
              Pioneer pricing: $4.00 per month billed monthly
            </p>
            <p class="plan-description">
              Everything in the free tier, as well as: 
            </p>
            <ul class="plan-features">
              <li>No upper limit on number queues or upstream subscriptions</li>
              <li>No obligation, cancel any time</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- checkout button -->
      <div class="view-header-toolbar">
        <!-- deactivate account button -->
        <div v-if="this.showCheckout">
          <button id="checkout" class="header-button" @click="this.$emit('submitOrder')" :disabled="inTransit">
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { maxLength, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

export default {
  name: "SettingsPanel",
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  props: ["inTransit", "account", "frameworkConfig", "theme"],
  emits: ["settingsUpdated", "exportOpml", "deactivateAccount", "initPasswordReset", "submitOrder"],
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
    console.log("settings_panel: mounted, account=" + JSON.stringify(this.account) + ", frameworkConfig=" + JSON.stringify(this.frameworkConfig));
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
  },
  data() {
    return {
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
      showCheckout: true,
    }
  },
  methods: {
    getModeVerbiage() {
      if (this.showDeactivateUser) {
        return 'DEACTIVATE YOUR ACCOUNT';
      } else if (this.showResetPassword) {
        return 'RESET PASSWORD';
      }
      return 'ACCOUNT SETTINGS';
    },
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
      console.log("update notification preferences, newSettings=" + JSON.stringify(settingsObj));
      this.$emit("settingsUpdated", settingsObj);
    },
    toggleNotifications() {
      this.$emit("settingsUpdated", {
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
      this.$emit("settingsUpdated", {
        emailAddress: this.emailAddress
      });
    },
    exportOpml() {
      this.$emit("exportOpml");
    },
    finalizeDeactivation() {
      this.$emit("deactivateAccount");
    },
    initPasswordReset() {
      this.$emit("initPasswordReset");
      this.showResetPassword = false;
    }
  }
}
</script>

<style scoped>
.download-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  border-radius: 3px;
  text-align: center;
  user-select: none;
  max-width: fit-content;
}

.download-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.download-button:disabled {
  cursor: auto;
}

.download-button:disabled:hover {
  background-color: unset;
}

.pw-reset-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  border-radius: 3px;
  text-align: center;
  user-select: none;
  max-width: fit-content;
}

.pw-reset-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.pw-reset-button:disabled {
  cursor: auto;
}

.pw-reset-button:disabled:hover {
  background-color: unset;
}

.deactivate-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  border-radius: 3px;
  text-align: center;
  user-select: none;
  max-width: fit-content;
}

.deactivate-button:hover {
  background-color: v-bind('theme.dangerbuttonhighlight');
}

.deactivate-button:disabled {
  cursor: auto;
}

.deactivate-button:disabled:hover {
  background-color: unset;
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
  margin-left: .75rem;
  margin-right: 0rem;
  text-align: center;
  user-select: none;
}

.header-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.header-button-danger:hover {
  background-color: v-bind('theme.dangerbuttonhighlight');
}

.header-button:disabled {
  cursor: auto;
}

.header-button:disabled:hover {
  background-color: unset;
}

.view-header {
  margin-left: .75rem;
  margin-right: .75rem;
  padding: .75rem;
  padding-top: 1.25rem;
  text-align: left;
  border-radius: 4px 4px 0px 0px;
}

.view-header-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0rem;
}

.view-header-toolbar {
  margin-left: .75rem;
  margin-right: .75rem;
  border-radius: 0px 0px 4px 4px;
  padding-top: .75rem;
  padding-bottom: .75rem;
  border-top: 0px;
  margin-bottom: .75rem;
}

.update-settings-body {
  margin-top: 0rem;
  padding-top: 0rem;
  padding-bottom: 0rem;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.settings-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: v-bind('theme.subduedmessage');
}

.settings-field {
  text-align: left;
  margin-bottom: 1rem;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  padding: .75rem;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
}

.settings-field label {
  font-size: smaller;
  padding-bottom: .125rem;
}

.settings-field input {
  padding: .31rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: .125rem;
}

.settings-field input:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.settings-field input:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
}

.notifications-view {
  border-top: 1px solid v-bind('theme.sectionbordercolor');
}

.notification-option {
  padding-top: .31rem;
  padding-bottom: .31rem;
}

.notification-checkbox {
  padding: .31rem .31rem .31rem 0rem;
  border-radius: 3px;
  font-size: smaller;
  user-select: none;
}

.notification-checkbox > input {
  position: relative;
  vertical-align: middle;
  box-shadow: unset;
}

.notification-checkbox > input:hover {
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

.checkout-view { 
  border-top: 1px solid v-bind('theme.sectionbordercolor');
}

.plans-view {
  display: flex;
}
</style>
