<template>
  <div class="invoice-panel" v-show="this.$auth.$isAuthenticated">
    <!-- view subscription -->
    <div class="subscription-view">
      <ViewHeader :disabled="disabled" :inTransit="false" :theme="theme">
        <template v-slot:count>
          YOUR SUBSCRIPTION
        </template>
      </ViewHeader>
      <div class="view-header">
        <p>Your subscription is currently {{ getSubscriptionStatus() }}.  It began at {{ getSubscriptionStarted() }}.</p>
        <p v-if="isCanceled()">Your subscription was canceled, and will not renew.</p>
        <div class="subscription-field" v-if="isActive()">
          <label for="subscription-current-period">CURRENT PERIOD</label>
          <input name="subscription-current-period" type="text" :placeholder="getSubscriptionCurrentPeriod()" :disabled="disabled" />
        </div>
        <div class="subscription-field" v-if="hasEnded()">
          <label for="subscription-ended-at">ENDED AT</label>
          <input name="subscription-ended-at" type="text" :placeholder="getSubscriptionEndedAt()" :disabled="disabled" />
        </div>
        <div class="subscription-field" v-if="isCanceled()">
          <label for="subscription-ended-at">WILL END AT</label>
          <input name="subscription-ended-at" type="text" :placeholder="getSubscriptionCurrentPeriodEnd()" :disabled="disabled" />
        </div>
        <div class="subscription-field" v-if="hasLastInvoice()">
          <label>MOST RECENT INVOICE ({{ getLastInvoiceCreated() }})</label>
          <div class="subscription-detail-field"><label>STATUS:</label> {{ getLastInvoiceStatus() }}</div>
          <div class="subscription-detail-field"><label>AMOUNT DUE:</label> {{ getAmountDue() }}</div>
          <div class="subscription-detail-field"><label>AMOUNT PAID:</label> {{ getAmountPaid() }}</div>
          <div class="subscription-detail-field"><label>AMOUNT REMAINING:</label> {{ getAmountRemaining() }}</div>
          <div class="subscription-detail-field"><label>CUSTOMER EMAIL ADDRESS:</label> {{ getCustomerEmailAddress() }}</div>
          <div class="subscription-detail-field"><label>CUSTOMER NAME:</label> {{ getCustomerName() }}</div>
          <div class="subscription-detail-field"><label>URL:</label>
            <a :href="getHostedInvoiceUrl()" :style="disabled ? 'pointer-events: none' : ''">Click here.</a>
          </div>
          <div class="subscription-detail-field"><label>PRODUCT:</label> {{ getProductDescription() }}</div>
        </div>
      </div>
      <div class="view-header-toolbar">
        <div>
          <button id="cancelSubscription" class="header-button" @click="cancelSubscription()" :disabled="disabled" v-if="!isCanceled()">
            Cancel Subscription
          </button>
          <button id="resumeSubscription" class="header-button" @click="resumeSubscription()" :disabled="disabled" v-else>
            Resume Subscription
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewHeader from '../layout/ViewHeader.vue';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default {
  name: "InvoicePanel",
  props: [ "disabled", "subscription" ],
  emits: [ "cancelSubscription", "resumeSubscription" ],
  components: {
    ViewHeader,
  },
  data() {
    return {
      theme: this.$theme.currentTheme,
    }
  },
  methods: {
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
      return this.subscription == null ? null : this.toLocalDate(this.subscription.currentPeriodEnd);
    },
    getSubscriptionEndedAt() {
      return this.subscription == null ? null : this.toLocalDate(this.subscription.endedAt);
    },
    getSubscriptionStatus() {
      return this.subscription == null ? '' : this.subscription.status;
    },
    isActive() {
      return this.subscription == null ? false : this.subscription.status === "active";
    },
    isCanceled() {
      return this.subscription == null ? false : this.subscription.cancelAtPeriodEnd === true;
    },
    hasEnded() {
      return this.subscription == null ? false : (this.subscription.endedAt !== null);
    },
    hasLastInvoice() {
      return this.subscription == null ? false : (this.subscription.lastInvoice !== null);
    },
    cancelSubscription() {
      this.$emit('cancelSubscription', this.subscription);
    },
    resumeSubscription() {
      this.$emit('resumeSubscription', this.subscription);
    },
  }
}
</script>

<style scoped>
#manage-subscription {
  margin-top: .625rem;
}

.invoice-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  color: v-bind('theme.normalmessage');
  margin-bottom: .75rem;
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
  margin-right: .75rem;
  text-align: center;
  user-select: none;
}

.header-button:hover {
  background-color: v-bind('theme.buttonhighlight');
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
  text-align: left;
  border-radius: 4px 4px 0px 0px;
}
 
.view-header-toolbar {
  margin-left: .75rem;
  margin-right: .75rem;
  border-radius: 0px 0px 4px 4px;
  padding-top: .75rem;
  padding-bottom: .75rem;
  border-top: 0px;
}

.subscription-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  margin-bottom: .75rem;
}

.subscription-field {
  text-align: left;
  margin-bottom: 1rem;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  padding: .75rem;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
}

.subscription-detail-field {
  padding-top: .31rem;
  padding-left: .31rem;
  color: v-bind('theme.subduedmessage');
}

.subscription-detail-field > a {
  color: v-bind('theme.subduedmessage');
}

.subscription-detail-field > a:hover {
  color: v-bind('theme.highlightedmessage');
}

.subscription-field label {
  font-size: smaller;
  padding-bottom: .125rem;
}

.subscription-field input {
  padding: .31rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: .125rem;
}

.subscription-field input:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.subscription-field input:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
}
</style>
