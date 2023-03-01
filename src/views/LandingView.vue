<template>
  <div id="landing" style="height: 100%;">
    <div class="background" />
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme" :inTransit="false">
      <template v-slot:buttons>
        <PreLoginNavbarButtons :theme="theme"/>
      </template>
    </NavbarFixedHeader>

    <BannerPanel :theme="theme" class="banner panel" />

    <DemoPanel :theme="theme" class="demo panel" /> 

    <FeaturesPanel :theme="theme" class="features panel" /> 

    <FooterPanel :theme="theme" class="footer panel" />

    <!-- <SystemStatusPanel :theme="theme" class="system-status panel" /> -->
</div>
</template>
  
<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import PreLoginNavbarButtons from '@/components/layout/PreLoginNavbarButtons.vue';
import BannerPanel from '@/components/landing/BannerPanel.vue';
import DemoPanel from '@/components/landing/DemoPanel.vue';
import FeaturesPanel from '@/components/landing/FeaturesPanel.vue';
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
    FooterPanel, 
    // SystemStatusPanel, 
  },
  props: ["baseUrl"],
  data() {
    return {
      theme: this.$theme.currentTheme,
    };
  },
};
</script>
  
<style scoped>
#landing {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: v-bind('theme.normalmessage');
}

.banner {
  width: fit-content;
}

.panel {
  border: 1px solid transparent;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(180deg, v-bind('theme.basecolor'), v-bind('theme.appbg'));
  z-index: -9999;
}
</style>
