<template>
  <div class="settings-container" v-if="this.account">
    <!-- account config header -->
    <ViewHeader class="settings-view" :disabled="inTransit" :inTransit="false" :theme="theme">
      <template v-slot:count>
        <span class="fa fa-user fa-1x"/>
        {{ this.getModeVerbiage() }}
      </template>
      <template v-slot:body>
        <!-- oauth2 profile (remote) -->
        <div class="settings-field" v-if="authProvider !== 'LOCAL' && !this.showDeactivateUser">
          <div style="display: flex;">
            <!-- profile image -->
            <img :src="authProviderProfileImgUrl" referrerpolicy="no-referrer" class="oauth2-profile-img" alt="OAuth2 profile image" />
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
      </template>
      <template v-slot:toolbar>
        <button v-if="this.showDeactivateUser" class="download-button" @click="exportOpml()">
          DOWNLOAD YOUR DATA
        </button>
        <button v-if="this.showDeactivateUser" class="deactivate-button" @click="finalizeDeactivation()">
          PERMANENTLY DELETE YOUR ACCOUNT
        </button>
        <button v-if="this.showResetPassword" class="pw-reset-button" @click="initPasswordReset()">
          SEND PASSWORD RESET EMAIL
        </button>
        <!-- apply changes button (local) -->
        <button v-if="authProvider === 'LOCAL' && !this.showDeactivateUser && !this.showResetPassword" id="updateAccount" class="header-button" @click="updateAccount()" :disabled="inTransit || v$.$invalid">
          Apply Changes
        </button>
        <!-- reset password button (local) -->
        <button v-if="authProvider === 'LOCAL' && !this.showDeactivateUser && !this.showResetPassword" id="resetPassword" class="header-button" @click="resetPassword()" :disabled="inTransit">
          Reset Password
        </button>
        <!-- deactivate account button -->
        <button v-if="!this.showDeactivateUser && !this.showResetPassword" id="deactivateAccount" class="header-button" @click="this.showDeactivateUser = true" :disabled="inTransit">
          Deactivate Account
        </button>
        <!-- cancel (deactivate account) -->
        <button v-if="this.showDeactivateUser" id="cancelDeactivateAccount" class="header-button" @click="this.showDeactivateUser = false" :disabled="inTransit">
          Cancel
        </button>
        <!-- cancel (reset password) -->
        <button v-if="this.showResetPassword" id="cancelResetPassword" class="header-button" @click="this.showResetPassword = false" :disabled="inTransit">
          Cancel
        </button>
      </template>
    </ViewHeader>
    <!-- notifications config header -->
    <ViewHeader class="settings-view notifications-view" :disabled="inTransit" :inTransit="false" :theme="theme">
      <template v-slot:count>
        <span class="fa fa-envelope fa-1x"/>
        NOTIFICATION SETTINGS
      </template>
      <template v-slot:body>
        <!-- notifications config body text -->
        <p>
          Email notifications are currently {{ this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled) ? 'disabled' : 'enabled' }}.  Please note that we will neve sell or disclose your personal information to anyone.
        </p>
        <div class="update-settings-body">
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
      </template>
      <template v-slot:toolbar>
        <!-- update notification preferences button -->
        <button id="updateNotificationPreferences" class="header-button" @click="updateNotificationPreferences()" :disabled="inTransit || this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)">
          Update Notification Preferences
        </button>
        <!-- toggle (all) notifications button -->
        <button id="toggleNotifications" class="header-button" @click="toggleNotifications()" :disabled="inTransit">
          {{ (this.frameworkConfig && this.isTrue(this.frameworkConfig.notifications.disabled)) ? 'Enable Selected Notifications' : 'Disable All Notifications' }} 
        </button>
      </template>
    </ViewHeader>
    <!-- checkout header-->
    <ViewHeader class="settings-view checkout-view" :disabled="inTransit" :inTransit="false" :theme="theme">
      <template v-slot:count>
        <span class="fa fa-gears fa-1x"/>
        JOIN THE FEEDGEARS COMMUNITY
      </template>
      <template v-slot:body>
        <!-- plans -->
        <div class="plans-view">
          <div class="free-view">
            <ViewHeader :disabled="inTransit" :inTransit="false" :theme="theme">
              <template v-slot:count>
                FREE TIER
              </template>
              <template v-slot:body>
                <p class="price-description">
                  Free, forever.
                </p>
                <p class="plan-description">
                  Basic features:
                </p>
                <ul class="plan-features">
                  <li>Hourly data import</li>
                  <li>We will never show you ads, or disclose your data to anyone</li>
                  <li>We are committed to security, privacy, and accessibility</li>
                  <li>Randomize kitten</li>
                </ul>
              </template>
            </ViewHeader>
          </div>
          <div class="premium-view">
            <ViewHeader :disabled="inTransit" :inTransit="false" :theme="theme">
              <template v-slot:count>
                PREMIUM TIER
              </template>
              <template v-slot:body>
                <p class="price-description">
                  Pioneer pricing: $4.00 per month billed monthly
                </p>
                <p class="plan-description">
                  Everything in the free tier, as well as: 
                </p>
                <ul class="plan-features">
                  <li>Our unending gratitude for helping to keep this project in development</li>
                  <li>Cancel any time</li>
                </ul>
              </template>
            </ViewHeader>
          </div>
        </div>
      </template>
      <template v-slot:toolbar>
        <!-- deactivate account button -->
        <button v-if="this.showCheckout" id="checkout" class="header-button" @click="this.$emit('submitOrder')" :disabled="inTransit">
          Checkout
        </button>
      </template>
    </ViewHeader>
  </div>
</template>

<script>
import { maxLength, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import ViewHeader from '../layout/ViewHeader.vue';

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
  components: {
    ViewHeader,
  },
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
  min-width: 3rem;
  min-height: 3rem;
}

.download-button:hover, .download-button:focus {
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
  min-width: 3rem;
  min-height: 3rem;
}

.pw-reset-button:hover, .pw-reset-button:focus {
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
  min-width: 3rem;
  min-height: 3rem;
}

.deactivate-button:hover, .deactivate-button:focus {
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
  min-width: 3rem;
  min-height: 3rem;
}

.header-button:hover, .header-button:focus {
  background-color: v-bind('theme.buttonhighlight');
}

.header-button:disabled {
  cursor: auto;
}

.header-button:disabled:hover {
  background-color: unset;
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
  color: v-bind('theme.normalmessage');
}

.settings-field {
  text-align: left;
  display: flex;
  flex-direction: column;
  padding: .75rem;
  border-radius: 5px;
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
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: .125rem;
}

.settings-field input:hover, .settings-field input:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
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
  user-select: none;
}

.notification-checkbox > input {
  position: relative;
  vertical-align: middle;
  box-shadow: unset;
}

.notification-checkbox > input:hover, .notification-checkbox > input:focus {
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
