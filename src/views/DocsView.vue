<template>
  <div id="home">
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme" :inTransit="false">
      <template v-slot:buttons>
        <NavbarButtons :disableSettings="false" :disableSubscriptions="false" :disabled="false" :theme="theme"/>
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
    <!-- docs view -->
    <div class="docs-view">
      <!-- docs header-->
      <ViewHeader :disabled="false" :inTransit="false" :theme="theme">
        <template v-slot:count>
          FEEDGEARS DOCUMENTATION
        </template>
        <template v-slot:body>
          <p>
            Sorry, this section of FeedGears isn't quite ready yet.  Check back in a few days!  
          </p>
        </template>
      </ViewHeader>
    </div> 
    <!-- "go back" link -->
    <GoBack :disabled="false" :theme="theme" />
  </div>
</template>
  
<script>
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import NavbarButtons from "@/components/layout/NavbarButtons.vue";
import NavbarFixedSubheader from "@/components/layout/NavbarFixedSubheader.vue";
import ViewHeader from "@/components/layout/ViewHeader.vue";
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import GoBack from "@/components/layout/GoBack.vue";

export default {
  name: "DocsView",
  components: {
    NavbarFixedHeader,
    NavbarButtons,
    NavbarFixedSubheader,
    ViewHeader,
    LastServerMessage,
    GoBack,
},
  props: ["baseUrl"],
  data() {
    return {
      theme: this.$theme.currentTheme,
      serverMessages: [],
    };
  },
};
</script>

<style scoped>
#home {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

/** start */
.docs-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  color: v-bind('theme.subduedmessage');
  margin-bottom: .75rem;
}
</style>
