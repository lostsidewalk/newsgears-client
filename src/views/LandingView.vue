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
      <v-toolbar-items>
        <!-- display mode switch -->
        <DisplayModeButton />
        <!-- login button -->
        <LoginButton />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <!-- container -->
      <BannerPanel :is-authenticated="$auth.$isAuthenticated" />

      <!-- container -->
      <DemoPanel class="mb-4" /> 

      <v-divider /> 

      <v-container class="mt-4">
        <FAQPanel />
      </v-container>

      <v-divider /> 
      
      <FooterPanel class="mt-4" />
    </v-main>
  </v-app>
</template>
  
<script>
import LoginButton from '@/components/landing/LoginButton.vue';
import DemoPanel from '@/components/landing/DemoPanel.vue';
import FAQPanel from '@/components/landing/FAQPanel.vue';

import BannerPanel from '@/components/banner-panel/BannerPanel.vue';
import DisplayModeButton from '@/components/layout/DisplayModeButton.vue';
import FooterPanel from '@/components/footer-panel/FooterPanel.vue';

export default {
  name: "LandingView",
  components: {
    LoginButton,
    DemoPanel, 
    FAQPanel,
    BannerPanel, 
    DisplayModeButton,
    FooterPanel, 
  },
  props: {
    baseUrl: { type: String, required: true },
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
  }
};
</script>
  
<style scoped>
.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>
