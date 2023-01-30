<template>
  <div id="home">
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme">
      <template v-slot:buttons>
        <NavbarButtons :disableSubscription="true" :inTransit="inTransit" :theme="theme" />
     </template>
    </NavbarFixedHeader>
    <!-- fixed subheader -->
    <transition appear enter-active-class="animated fadeIn">
      <NavbarFixedSubheader v-if="this.serverMessages.length > 0" :theme="theme" :inTransit="inTransit">
        <template v-slot:message>
          <LastServerMessage :serverMessages="this.serverMessages" @clearLastServerMessage="this.clearLastServerMessage" :theme="theme"/>
        </template>
      </NavbarFixedSubheader>
    </transition>
    <!-- checkout view -->
    <div v-if="this.$auth.$isAuthenticated">
      <SubscriptionPlanPanel :theme="theme" />
      <button @click="submitOrder">SUBMIT ORDER</button>
      <!-- "go back" link -->
      <GoBack :theme="theme" />
    </div>
    <YouHaveBeenLoggedOut v-else :theme="theme" />
  </div>
</template>
  
<script>
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import NavbarButtons from "@/components/layout/NavbarButtons.vue";
import NavbarFixedSubheader from "@/components/layout/NavbarFixedSubheader.vue";
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import SubscriptionPlanPanel from "@/components/subscription/SubscriptionPlanPanel.vue";
import YouHaveBeenLoggedOut from "@/components/auth/YouHaveBeenLoggedOut.vue";
import GoBack from "@/components/layout/GoBack.vue";

export default {
  name: "CheckoutView",
  components: { 
    NavbarFixedHeader, 
    NavbarButtons,
    NavbarFixedSubheader,
    LastServerMessage,
    SubscriptionPlanPanel,
    YouHaveBeenLoggedOut,
    GoBack,
  },
  props: ["baseUrl", "publishableKey", "manageSubscription"],
  mounted() {
    this.$auth.getTokenSilently()
      .catch(() => {})
      .finally(() => {
        this.inTransit = false;
    });
  },
  methods: {
    setLastServerMessage(message) {
      this.clearLastServerMessage();
      let serverMessageId = Math.random();
      this.serverMessages.push({
        timestamp: new Date(), 
        id: serverMessageId,
        text: message
      });
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
      }, 6000);
    },
    clearLastServerMessage() {
      this.serverMessages.pop();
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
          console.log("Redirecting to checkout url=" + sessionUrl + " for sessionId=" + sessionId);
          window.location.href = sessionUrl;
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        })
      }).finally(() => {
        this.inTransit = false;
      });
    },
  },
  data() {
    return {
      successURL: 'http://localhost:3000/order-confirmed', 
      cancelURL: 'http://localhost:3000/stripe', 
      theme: this.$theme.currentTheme,
      inTransit: true,
      serverMessages: [],
    };
  },
};
</script>

<style scoped>
#home {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  margin-left: 3%;
  margin-right: 3%;
}
</style>
