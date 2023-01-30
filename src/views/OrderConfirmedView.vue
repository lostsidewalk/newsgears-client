<template>
  <div id="home">
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme">
      <template v-slot:buttons>
        <NavbarButtons :inTransit="inTransit" :theme="theme"/>
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
    <!-- order confirmed view -->
    <div class="order-confirmed-view">
      <!-- order confirmed header-->
      <div class="view-header">
        <span style="display: inline-flex;flex-direction: row;">
          <h3 class="view-header-count">THANK YOU FOR YOUR ORDER</h3>
        </span>
        <p>
          Your order is confirmed.  Click <router-link style="text-decoration: none; color: inherit;" to="/app">here</router-link> to return to the app.
        </p>
      </div> 
    </div> 
    <!-- "go back" link -->
    <GoBack :theme="theme" />
  </div>
</template>
  
<script>
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import NavbarButtons from "@/components/layout/NavbarButtons.vue";
import NavbarFixedSubheader from "@/components/layout/NavbarFixedSubheader.vue";
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import GoBack from "@/components/layout/GoBack.vue";

export default {
  name: "OrderConfirmedView",
  components: {
    NavbarFixedHeader,
    NavbarButtons,
    NavbarFixedSubheader,
    LastServerMessage,
    GoBack,
},
  props: ["baseUrl"],
  data() {
    return {
      theme: this.$theme.currentTheme,
      inTransit: false,
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

/** start */
.order-confirmed-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  color: v-bind('theme.subduedmessage');
  margin-bottom: 10px;
}

.view-header {
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
  padding-top: 20px;
  text-align: left;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
}

.view-header-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: large;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0px;
  overflow: hidden;
}
</style>
