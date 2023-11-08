<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="account-settings">
        <v-icon icon="fa-user" />
        {{ $t('accountSettings') }}
      </h3>
    </v-card-title>
    <v-divider />
    <v-card-text>
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
            src="newsgears.png" 
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
            :text="$t('downloadYourData')"
            @click="$emit('exportOpml')"
          />
          <!-- permanently delete your account button -->
          <v-btn
            v-if="showDeactivateUser"
            :size="buttonSize" 
            :text="$t('permanentlyDeleteYourAccount')"
            @click="$emit('finalizeDeactivation')"
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
            :text="$t('sendPasswordResetEmail')"
            @click="$emit('initPasswordReset')"
          />
          <!-- reset password button (local) -->
          <v-btn
            v-if="authProvider === 'LOCAL' && !showResetPassword && !showDeactivateUser"
            id="resetPassword" 
            :size="buttonSize" 
            :text="$t('resetPassword')"
            @click="showResetPassword = true"
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
            :text="$t('applyChanges')"
            @click="$emit('updateAccount', {
              emailAddress: emailAddress,
            })"
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
        />
        <v-divider />
        <v-card-actions>
          <v-checkbox
            id="enableAccountAlerts" 
            v-model="enableAccountAlerts" 
            name="enableAccountAlerts"
            :label="$t('enableAccountAlertsNotifications')" 
          />
        </v-card-actions>
        <v-divider />
        <v-card-actions>
          <!-- update notification preferences button -->
          <v-btn
            id="updateNotificationPreferences"
            :size="buttonSize" 
            :text="$t('updateNotificationPreferences')"
            @click="$emit('updateNotificationPreferences', {
              enableAccountAlerts: enableAccountAlerts,
            })"
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
import { useTimestamp } from '@/composable/useTimestamp.js';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

export default {
  name: "SettingsPanel",
  mixins: [buttonSizeMixin],
  props: {
    baseUrl: { type: String, required: true },
    account: { type: Object, required: true },
  },
  emits: [ 
    "exportOpml", 
    "finalizeDeactivation", 
    "initPasswordReset", 
    "updateAccount", 
    "updateNotificationPreferences", 
    "toggleNotifications", 
    "dismiss" 
  ],
  setup() {
    const { 
      toLocalDate, 
      toLocalCurrency 
    } = useTimestamp();

    return {
      toLocalDate,
      toLocalCurrency,
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
      showDeactivateUser: false,
      showResetPassword: false,
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
      let notifications = frameworkConfig.notifications;
      if (notifications) {
        this.enableAccountAlerts = this.isTrue(notifications.accountAlerts);
      }
    }
  },
  methods: {
    isTrue(b) {
      if (!b) {
        return false;
      } else if (b.toLowerCase() === 'true') {
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>
.account-settings {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>
