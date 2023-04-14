<template>
  <div id="landing" style="height: 100%;">
    <div class="background" />
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme" :inTransit="false" class="landing-navbar">
      <template v-slot:buttons>
        <PreLoginNavbarButtons :baseUrl="baseUrl" :theme="theme"/>
      </template>
    </NavbarFixedHeader>

    <BannerPanel :theme="theme" class="banner" />

    <DemoPanel :theme="theme" class="demo" /> 

    <FeaturesPanel :theme="theme" class="features" /> 

    <FAQPanel :theme="theme" class="faq" />

    <FooterPanel :theme="theme" class="footer" />
</div>
</template>
  
<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import PreLoginNavbarButtons from '@/components/layout/PreLoginNavbarButtons.vue';
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
#landing {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: v-bind('theme.normalmessage');
}

.landing-navbar {
  position: sticky;
  top: 0;
  background-color: v-bind('theme.appbg');
  border-bottom: 1px solid v-bind('theme.navbarsubshadow');
  box-shadow: 0px 3px 3px v-bind('theme.darksubshadow');
}

.banner {
  background-image: linear-gradient(180deg, v-bind('theme.lightshadow'), v-bind('theme.darkshadow'));
}

.demo {
  background-image: linear-gradient(180deg, v-bind('theme.darkshadow'), v-bind('theme.appbg'));
}

.features {
  background-image: linear-gradient(180deg, v-bind('theme.appbg'), v-bind('theme.bodybg'));
}

.faq {
}

.footer {

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
