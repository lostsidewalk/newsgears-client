<template>
  <v-app>
    <v-app-bar
      app
      location="top"
      :scrol-behavior="'elevate'"
    >
      <template #title>
        <span class="view-header-no-count">
          FeedGears RSS
        </span>
      </template>
      <template #prepend>
        <v-app-bar-nav-icon icon="fa-rss" />
      </template>
      <PreLoginNavbarButtons
        :base-url="baseUrl"
      />
    </v-app-bar>

    <v-main>
      <!-- container -->
      <BannerPanel />

      <!-- container -->
      <DemoPanel /> 

      <v-divider /> 

      <v-container>
        <!-- sheet -->
        <FeaturesPanel
          
          class="ma-4"
        /> 

        <v-divider class="mt-8 mb-8" /> 

        <!-- card -->
        <FAQPanel
          
          class="ma-4"
        />

        <v-divider class="mt-8 mb-8" /> 

        <!-- card -->
        <VideoPanel
          
          class="ma-4"
        />
      </v-container>

      <v-divider /> 
      
      <FooterPanel />
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
  props: {
    baseUrl: { type: String, required: true },
  },
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
