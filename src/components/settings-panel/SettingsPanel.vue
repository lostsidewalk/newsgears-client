<template>
  <v-card>
    <v-card-title
      class="text-center"
      :class="pa4r"
    >
      <h3 class="account-settings">
        <v-icon icon="fa-user" />
        {{ $t("accountSettings") }}
      </h3>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- profile -->
      <v-card
        elevation="6"
        class="pa-1"
        :class="mb4r"
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
            v-if="
              authProvider === 'LOCAL' &&
                !showResetPassword &&
                !showDeactivateUser
            "
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
        class="pa-1"
        :class="mb4r"
      >
        <v-card-title :class="pa4r">
          {{ $t("emailAddress") }}
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
            v-if="
              authProvider === 'LOCAL' &&
                !showResetPassword &&
                !showDeactivateUser
            "
            id="updateAccount"
            :size="buttonSize"
            :text="$t('applyChanges')"
            @click="
              $emit('updateAccount', {
                emailAddress: emailAddress,
              })
            "
          />
        </v-card-actions>
      </v-card>
      <!-- email notifications -->
      <v-card
        elevation="6"
        class="pa-1"
        :class="mb4r"
      >
        <v-card-item :title="$t('emailNotifications')" />
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
            @click="
              $emit('updateNotificationPreferences', {
                enableAccountAlerts: enableAccountAlerts,
              })
            "
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
import { ref } from 'vue';

import { useTimestamp } from '@/composable/useTimestamp.js';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';
import spacingMixin from '@/mixins/spacingMixin';
import { onMounted } from 'vue';

export default {
  name: "SettingsPanel",
  mixins: [buttonSizeMixin, spacingMixin],
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
    "dismiss"
  ],
  setup(props) {
    const {
      toLocalDate,
      toLocalCurrency
    } = useTimestamp();

    const username = ref(null);
    const emailAddress = ref(null);
    const authProvider = ref(null);
    const authProviderProfileImgUrl = ref(null);
    const authProviderUsername = ref(null);
    const enableAccountAlerts = ref(null);
    const showDeactivateUser = ref(false);
    const showResetPassword = ref(false);

    function isTrue(b) {
      if (!b) {
        return false;
      } else if (b.toLowerCase() === 'true') {
        return true;
      }
      return false;
    }

    onMounted(() => {
      username.value = props.account.username;
      emailAddress.value = props.account.emailAddress;
      authProvider.value = props.account.authProvider;
      authProviderProfileImgUrl.value = props.account.authProviderProfileImgUrl;
      authProviderUsername.value = props.account.authProviderUsername;

      let frameworkConfig = props.account.frameworkConfig;
      if (frameworkConfig) {
        let notifications = frameworkConfig.notifications;
        if (notifications) {
          enableAccountAlerts.value = isTrue(notifications.accountAlerts);
        }
      }
    });

    return {
      toLocalDate,
      toLocalCurrency,
      //
      username,
      emailAddress,
      authProvider,
      authProviderProfileImgUrl,
      authProviderUsername,
      enableAccountAlerts,
      showDeactivateUser,
      showResetPassword,
    }
  },
}
</script>

<style scoped>
.account-settings {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>
