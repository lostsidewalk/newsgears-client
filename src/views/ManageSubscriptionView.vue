<template>
  <div id="home">
    <VueAnnouncer />
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit">
      <template v-slot:buttons>
          <NavbarButtons :disableSettings="false" :disableSubscriptions="true" :disabled="inTransit" :theme="theme" />
      </template>
    </NavbarFixedHeader>
    <!-- fixed subheader -->
    <transition appear enter-active-class="animated fadeIn">
      <NavbarFixedSubheader v-if="this.serverMessages.length > 0" :theme="theme">
        <template v-slot:message>
          <LastServerMessage :serverMessages="this.serverMessages" @clearLastServerMessage="this.clearLastServerMessage" :theme="theme"/>
        </template>
      </NavbarFixedSubheader>
    </transition>
    <!-- invoice panel -->
    <div v-if="this.$auth.$isAuthenticated">
      <InvoicePanel ref="invoicePanel"
        :subscription="this.subscription"
        v-if="this.subscription && !this.failedToLoad"
        :disabled="inTransit"
        :theme="theme"
        @cancelSubscription="cancelSubscription"
        @resumeSubscription="resumeSubscription"
      />
      <!-- "go back" link -->
      <GoBack :disabled="inTransit" :theme="theme" />
    </div>
    <YouHaveBeenLoggedOut v-else :theme="theme" />
  </div>
</template>
  
<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import NavbarButtons from '@/components/layout/NavbarButtons.vue';
import NavbarFixedSubheader from '@/components/layout/NavbarFixedSubheader.vue';
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import InvoicePanel from '@/components/invoice/InvoicePanel.vue';
import YouHaveBeenLoggedOut from '@/components/auth/YouHaveBeenLoggedOut.vue';
import GoBack from '@/components/layout/GoBack.vue';

export default {
  name: "ManageSubscriptionView",
  components: {
    NavbarFixedHeader,
    NavbarButtons,
    NavbarFixedSubheader,
    LastServerMessage,
    InvoicePanel,
    YouHaveBeenLoggedOut,
    GoBack,
},
  props: ["baseUrl"],
  created() {
    console.log("manage_subscription: created... baseUrl=" + this.baseUrl);
    this.refreshSubscription();
  },
  methods: {
    // 
    // server error 
    // 
    handleServerError(error) {
      console.log(error);
      if (error.name === 'TypeError') {
        this.setLastServerMessage('Something went wrong.  Please try again later.');
      } else if (error.message) {
        this.setLastServerMessage(error.message); 
      } else {
        this.setLastServerMessage(error); // $auth plugin errors 
      }
      this.inTransit = false;
    },
    setLastServerMessage(message) {
      this.clearLastServerMessage();
      let serverMessageId = Math.random();
      this.serverMessages.push({
        timestamp: new Date(),
        id: serverMessageId,
        text: message
      });
      this.$announcer.polite(message);
      setTimeout(() => {
        let idxToSplice = -1;
        for(let i = 0; i < this.serverMessages.length; i++) {
          if (this.serverMessages[i].id == serverMessageId) {
            idxToSplice = i;
            break;
          }
        }
        if (idxToSplice >= 0) {
          this.serverMessages.splice(idxToSplice, 1);
        }
      }, 4000);
    },
    clearLastServerMessage() {
      this.serverMessages.pop();
    },
    // 
    refreshSubscription() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include' 
          };
        fetch(this.baseUrl + "/subscriptions", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((data) => {
          this.subscription = data.length > 0 ? data[0] : null;
        }).catch((error) => {
          this.handleServerError(error);
          this.failedToLoad = true;
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.failedToLoad = true;
      });
    },
    cancelSubscription(subscription) {
      console.log("cancel subscription, subscription=" + JSON.stringify(subscription));
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
          this.failedToLoad = true;
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    resumeSubscription(subscription) {
      console.log("resume subscription, subscription=" + JSON.stringify(subscription));
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
          this.failedToLoad = true;
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
  },
  data() {
    return {
      subscription: null,
      theme: this.$theme.currentTheme,
      serverMessages: [],
      failedToLoad: false,
      // 
      inTransit: true,
    };
  },
};
</script>

<style scoped>
#home {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}
</style>
