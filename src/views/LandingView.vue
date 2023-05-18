<template>
  <v-app>
    <v-app-bar app location="top" :scrol-behavior="'elevate'">
      <template v-slot:title>
        <span class="view-header-no-count">
          FeedGears RSS
        </span>
      </template>
      <template v-slot:prepend>
        <v-app-bar-nav-icon icon="fa-rss" />
      </template>
      <PreLoginNavbarButtons :baseUrl="baseUrl" :theme="theme"/>
    </v-app-bar>

    <v-main>
      <!-- container -->
      <BannerPanel :theme="theme" />

      <!-- container -->
      <DemoPanel :theme="theme" /> 

      <v-divider /> 

      <v-container>
        <!-- sheet -->
        <FeaturesPanel :theme="theme" class="ma-4" /> 

        <v-divider class="mt-8 mb-8" /> 

        <!-- card -->
        <FAQPanel :theme="theme" class="ma-4" />

        <v-divider class="mt-8 mb-8" /> 

        <!-- card -->
        <VideoPanel :theme="theme" class="ma-4" />
      </v-container>

      <v-divider /> 
      
      <FooterPanel :theme="theme" />
    </v-main>

  </v-app>
</template>
  
<script>
import PreLoginNavbarButtons from '@/components/prelogin/PreLoginNavbarButtons.vue';
import BannerPanel from '@/components/landing/BannerPanel.vue';
import DemoPanel from '@/components/landing/DemoPanel.vue';
import FeaturesPanel from '@/components/landing/FeaturesPanel.vue';
import FAQPanel from '@/components/landing/FAQPanel.vue';
import VideoPanel from '@/components/landing/VideoPanel.vue';
import FooterPanel from '@/components/landing/FooterPanel.vue';

export default {
  name: "LandingView",
  components: {
    PreLoginNavbarButtons,
    BannerPanel, 
    DemoPanel, 
    FeaturesPanel, 
    FAQPanel,
    VideoPanel,
    FooterPanel, 
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
    });
  },
};
</script>
  
<style scoped>
.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>
