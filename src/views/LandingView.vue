<template>
  <div id="landing" style="height: 100%;">
    <div class="background" />
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme" :inTransit="false">
      <template v-slot:buttons>
        <PreLoginNavbarButtons :theme="theme"/>
      </template>
    </NavbarFixedHeader>

    <BannerPanel :theme="theme" class="banner" />

    <DemoPanel :theme="theme" class="demo" /> 

    <FeaturesPanel :theme="theme" class="features" /> 

    <FooterPanel :theme="theme" class="footer" />

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
  background-image: linear-gradient(180deg, v-bind('theme.lightshadow'), v-bind('theme.basecolor'));
}

.demo {
  background-image: linear-gradient(180deg, v-bind('theme.basecolor'), v-bind('theme.darkshadow'));
}

.features {
  background-image: linear-gradient(180deg, v-bind('theme.darkshadow'), v-bind('theme.lightshadow'));
}
</style>
