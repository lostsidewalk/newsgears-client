<template>
  <v-app>
    <v-app-bar
      app
      location="top"
      :scroll-behavior="'elevate'"
    >
      <template #title>
        <span class="feedgears-rss">
          FeedGears RSS
        </span>
      </template>
      <template #prepend>
        <v-app-bar-nav-icon
          icon="fa-rss"
          :aria-label="$t('feedGearsRssLogo')"
        />
      </template>
      <v-toolbar-items>
        <!-- display mode switch -->
        <DisplayModeButton />
        <!-- login button -->
        <LoginButton />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <BannerPanel :is-authenticated="isAuthenticated" />

      <DemoPanel class="mb-4" /> 

      <v-divider /> 

      <FAQPanel class="mt-4" />

      <v-divider /> 
      
      <FooterPanel class="mt-4" />
    </v-main>
  </v-app>
</template>
  
<script>
import { inject, onMounted } from 'vue';
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
  setup() {
    const auth = inject('auth');
    const isAuthenticated = inject('isAuthenticated');

    onMounted(() => {
      auth.getTokenSilently()
        .catch(() => {})
        .finally(() => {
          if (isAuthenticated.value) {
            console.log("landing: authenticated on mount");
          } else {
            console.log("landing: not authenticated on mount");
          }
      });
    });

    return {
      auth,
      isAuthenticated, 
    }
  },
};
</script>
  
<style scoped>
.feedgears-rss {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>
