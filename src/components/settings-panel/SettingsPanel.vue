<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="view-header-no-count">
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
          :subtitle="notificationsDisabled ? $t('emailNotificationsAreDisabled') : $t('emailNotificationsAreEnabled')"
        />
        <v-divider />
        <v-card-actions>
          <v-checkbox
            id="enableAccountAlerts" 
            v-model="enableAccountAlerts" 
            name="enableAccountAlerts"
            :label="$t('enableAccountAlertsNotifications')" 
            :disabled="notificationsDisabled"
          />
          <v-checkbox
            id="enableProductNotifications" 
            v-model="enableProductNotifications" 
            name="enableProductNotifications"
            :label="$t('enableProductNotifications')" 
            :disabled="notificationsDisabled"
          />
        </v-card-actions>
        <v-divider />
        <v-card-actions>
          <!-- update notification preferences button -->
          <v-btn
            id="updateNotificationPreferences"
            :size="buttonSize" 
            :disabled="notificationsDisabled" 
            :text="$t('updateNotificationPreferences')"
            @click="$emit('updateNotificationPreferences', {
              notificationsDisabled: false,
              enableAccountAlerts: enableAccountAlerts,
              enableDailyFeedReport: enableDailyFeedReport, 
              enableProductNotifications: enableProductNotifications
            })"
          />
          <!-- toggle (all) notifications button -->
          <v-btn 
            :size="buttonSize"
            :text="notificationsDisabled ? $t('enableSelectedNotifications') : $t('disableSelectedNotifications')"
            @click="$emit('toggleNotifications', {
              notificationsDisabled: !notificationsDisabled, 
              enableAccountAlerts: enableAccountAlerts,
              enableDailyFeedReport: enableDailyFeedReport, 
              enableProductNotifications: enableProductNotifications
            })"
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
            status: getSubscriptionStatus(), 
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
            :text="$t('cancelSubscription')"
            @click="$emit('cancelSubscription')"
          />
          <v-btn
            v-if="subscription && isCanceled()"
            id="resumeSubscription"
            :size="buttonSize" 
            :text="$t('resumeSubscription')"
            @click="$emit('resumeSubscription')"
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
    isLoading: { type: Boolean, default: false }, // TODO: use this 
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
    "dismiss" ],
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
      notificationsDisabled: false,
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
      this.notificationsDisabled = frameworkConfig.notifications.disabled;
    } else {
      this.notificationsDisabled = false;
    }
  },
  methods: {
    // 
    isTrue(obj) {
      return obj instanceof String ? obj === 'true' : obj === true;
    },
    // 
    toLocalDate(epochTime) {
      return new Date(epochTime * 1000).toLocaleDateString();
    },
    toLocalCurrency(amount) {
      return currencyFormatter.format(amount / 100);
    },
    getProductDescription() {
      return this.subscription ? null : this.subscription.lastInvoice.productDescription;
    },
    getHostedInvoiceUrl() {
      return this.subscription ? null : this.subscription.lastInvoice.hostedUrl;
    },
    getCustomerEmailAddress() {
      return this.subscription ? null : this.subscription.lastInvoice.customerEmail;
    },
    getCustomerName() {
      return this.subscription ? null : this.subscription.lastInvoice.customerName;
    },
    getAmountDue() {
      return this.subscription ? null : this.toLocalCurrency(this.subscription.lastInvoice.amountDue);
    },
    getAmountPaid() {
      return this.subscription ? null : this.toLocalCurrency(this.subscription.lastInvoice.amountPaid);
    },
    getAmountRemaining() {
      return this.subscription ? null : this.toLocalCurrency(this.subscription.lastInvoice.amountRemaining);
    },
    getLastInvoiceCreated() {
      return this.subscription ? null : this.toLocalDate(this.subscription.lastInvoice.created);
    },
    getLastInvoiceStatus() {
      return this.subscription ? null : this.subscription.lastInvoice.status;
    },
    getSubscriptionStarted() {
      return this.subscription ? null : this.toLocalDate(this.subscription.startDate);
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
      return this.subscription.endedAt;
    },
    hasLastInvoice() {
      return this.subscription.lastInvoice;
    },
    cancelSettings() {
      this.$emit('dismiss');
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
