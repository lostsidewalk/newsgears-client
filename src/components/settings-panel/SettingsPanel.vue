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
      <!-- TODO: extract component -->
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
      <!-- TODO: extract component -->
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
      <!-- TODO: extract component -->
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
          <v-checkbox
            id="enableProductNotifications" 
            v-model="enableProductNotifications" 
            name="enableProductNotifications"
            :label="$t('enableProductNotifications')" 
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
              enableDailyFeedReport: enableDailyFeedReport, 
              enableProductNotifications: enableProductNotifications
            })"
          />
        </v-card-actions>
      </v-card>
      <!-- TODO: extract component -->
      <!-- subscription -->
      <v-card
        v-if="subscriptionStatus"
        elevation="6"
        class="mb-4 pa-1"
      >
        <v-card-item
          title="CARD TITLE"
          :subtitle="$t('subscriptionStatus', { 
            status: subscriptionStatus, 
            started: subscriptionStarted 
          })"
        />
        <v-divider />
        <v-card-text>
          <p v-if="isCanceled">
            {{ $t('yourSubscriptionWasCanceled') }}
          </p>

          <div v-if="isActive">
            <v-label for="subscription-current-period">
              {{ $t('currentPeriod') }}
            </v-label>
            <v-text-field
              variant="solo-filled"
              name="subscription-current-period"
              type="text" 
              :placeholder="subscriptionCurrentPeriod"
            />
          </div>

          <div v-if="hasEnded">
            <v-label for="subscription-ended-at">
              {{ $t('endedAt') }}
            </v-label>
            <v-text-field
              variant="solo-filled"
              name="subscription-ended-at"
              type="text" 
              :placeholder="subscriptionEndedAt"
            />
          </div>

          <div v-if="isCanceled">
            <v-label for="subscription-ended-at">
              {{ $t('willEndAt') }}
            </v-label>
            <v-text-field
              variant="solo-filled"
              name="subscription-ended-at"
              type="text" 
              :placeholder="subscriptionCurrentPeriodEnd"
            />
          </div>

          <div v-if="hasLastInvoice">
            <v-label>{{ $t('mostRecentInvoice') }} ({{ lastInvoiceCreated }})</v-label>
            <v-label>{{ $t('statusColon') }} {{ lastInvoiceStatus }}</v-label> 
            <v-label>{{ $t('amountDueColon') }} {{ amountDue }}</v-label>
            <v-label>{{ $t('amountPaidColon') }} {{ amountPaid }}</v-label>
            <v-label>{{ $t('amountRemainingColon') }} {{ amountRemaining }}</v-label>
            <v-label>{{ $t('customerEmailAddressColon') }} {{ customerEmailAddress }}</v-label>
            <v-label>{{ $t('customerNameColon') }} {{ customerName }}</v-label>
            <v-label>
              {{ $t('invoiceUrlColon') }} <a
                :href="hostedInvoiceUrl"
                target="_blank"
              >{{ $t('clickHere') }}</a>
            </v-label>
            <v-label>{{ $t('productColon') }} {{ productDescription }}</v-label>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            v-if="subscription && !isCanceled"
            id="cancelSubscription"
            :size="buttonSize" 
            :text="$t('cancelSubscription')"
            @click="$emit('cancelSubscription')"
          />
          <v-btn
            v-if="subscription && isCanceled"
            id="resumeSubscription"
            :size="buttonSize" 
            :text="$t('resumeSubscription')"
            @click="$emit('resumeSubscription')"
          />
        </v-card-actions>
      </v-card>
      <!-- TODO: extract component -->
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
            :text="$t('checkout')"
            @click="$emit('submitOrder')"
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
    subscription: { type: Object, default: null },
  },
  emits: [ 
    "exportOpml", 
    "finalizeDeactivation", 
    "initPasswordReset", 
    "updateAccount", 
    "updateNotificationPreferences", 
    "toggleNotifications", 
    "cancelSubscription", 
    "resumeSubscription", 
    "submitOrder", 
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
      enableDailyFeedReport: null,
      enableProductNotifications: null,
      showDeactivateUser: false,
      showResetPassword: false,
    }
  },
  computed: {
    productDescription: function () {
      return this.subscription ? null : this.subscription.lastInvoice.productDescription;
    },
    hostedInvoiceUrl: function () {
      return this.subscription ? null : this.subscription.lastInvoice.hostedUrl;
    },
    customerEmailAddress: function () {
      return this.subscription ? null : this.subscription.lastInvoice.customerEmail;
    },
    customerName: function () {
      return this.subscription ? null : this.subscription.lastInvoice.customerName;
    },
    amountDue: function () {
      return this.subscription ? null : this.toLocalCurrency(this.subscription.lastInvoice.amountDue);
    },
    amountPaid: function () {
      return this.subscription ? null : this.toLocalCurrency(this.subscription.lastInvoice.amountPaid);
    },
    amountRemaining: function () {
      return this.subscription ? null : this.toLocalCurrency(this.subscription.lastInvoice.amountRemaining);
    },
    lastInvoiceCreated: function () {
      return this.subscription ? null : this.toLocalDate(this.subscription.lastInvoice.created);
    },
    lastInvoiceStatus: function () {
      return this.subscription ? null : this.subscription.lastInvoice.status;
    },
    subscriptionStarted: function () {
      return this.subscription ? null : this.toLocalDate(this.subscription.startDate);
    },
    subscriptionCurrentPeriod: function () {
      if (!this.subscription) {
        return null;
      } else {
        let startDate = this.toLocalDate(this.subscription.currentPeriodStart);
        let endDate = this.toLocalDate(this.subscription.currentPeriodEnd);
        return startDate + ' - ' + endDate;
      }
    },
    subscriptionCurrentPeriodEnd: function () {
      return this.toLocalDate(this.subscription.currentPeriodEnd);
    },
    subscriptionEndedAt: function () {
      return this.toLocalDate(this.subscription.endedAt);
    },
    subscriptionStatus: function () {
      return this.subscription.status;
    },
    isActive: function () {
      return this.subscription.status === "active";
    },
    isCanceled: function () {
      return this.subscription.cancelAtPeriodEnd === true;
    },
    hasEnded: function () {
      return this.subscription.endedAt;
    },
    hasLastInvoice: function () {
      return this.subscription.lastInvoice;
    },
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
        this.enableDailyFeedReport = this.isTrue(notifications.dailyFeedReport);
        this.enableProductNotifications = this.isTrue(notifications.productNotifications);
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
