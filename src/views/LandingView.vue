<template>
  <v-main>
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme" :inTransit="false" class="landing-navbar">
      <template v-slot:logo>
        <h2 class="pa-2 logotext">FeedGears RSS</h2>
      </template>
      <template v-slot:buttons>
        <PreLoginNavbarButtons :baseUrl="baseUrl" :theme="theme"/>
      </template>
    </NavbarFixedHeader>

    <BannerPanel :theme="theme" class="panel" />

    <DemoPanel :theme="theme" class="panel" /> 

    <FeaturesPanel :theme="theme" class="panel" /> 

    <FAQPanel :theme="theme" class="panel" />

    <FooterPanel :theme="theme" class="panel" />
  </v-main>
</template>
  
<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import PreLoginNavbarButtons from '@/components/prelogin/PreLoginNavbarButtons.vue';
import BannerPanel from '@/components/landing/BannerPanel.vue';
import DemoPanel from '@/components/landing/DemoPanel.vue';
import FeaturesPanel from '@/components/landing/FeaturesPanel.vue';
import FAQPanel from '@/components/landing/FAQPanel.vue';
import FooterPanel from '@/components/landing/FooterPanel.vue';
// import SystemStatusPanel from '@/components/landing/SystemStatusPanel.vue';

export default {
  name: "LandingView",
  components: {
    NavbarFixedHeader,
    PreLoginNavbarButtons,
    BannerPanel, 
    DemoPanel, 
    FeaturesPanel, 
    FAQPanel,
    FooterPanel, 
    // SystemStatusPanel, 
  },
  props: ["baseUrl"],
  data() {
    return {
      theme: this.$theme.currentTheme,
    };
  },
  mounted() {
    this.$auth.getTokenSilently()
      .catch(() => {})
      .finally(() => {
        if (this.$auth.$isAuthenticated) {
          console.log("landing: authenticated on mount");
        } else {
          console.log("landing: not authenticated on mount");
        }
        this.inTransit = false;
    });
  },
};
</script>
  
<style scoped>
.landing-navbar {
  position: sticky;
  top: 0;
  background-color: v-bind('theme.appbg');
  border-bottom: 1px solid v-bind('theme.navbarsubshadow');
  box-shadow: 0px 3px 3px v-bind('theme.darksubshadow');
}

.panel {
  overflow: auto;
}

.panel-divider {
  margin: 2svw;
  height: 2px;
  background-color: v-bind('theme.navbarsubshadow');
}

.logotext {
  font-family: 'Russo One';
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 2px 0px 2px v-bind('theme.logocolor');
  float: left;
}
</style>

<style>
.accessible-button {
  min-height: 3rem;
  min-width: 3rem;
}

@media (max-width: 640px) {
  .accessible-button {
    min-height: 1.5rem;
    min-width: 1.5rem;
  }
}

@media (max-width: 480px) {
  .accessible-button {
    min-height: unset;
    min-width: unset;
  }
}
</style>
