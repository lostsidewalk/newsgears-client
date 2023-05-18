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
      <v-toolbar-items>
        <GoBack :theme="theme" />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <!-- container -->
      <BannerPanel :theme="theme" />
      
      <v-divider /> 

      <PasswordUpdatePanel ref="passwordUpdate" :theme="theme" />

      <v-divider />

      <FooterPanel :theme="theme" app />
    </v-main>
  </v-app>
</template>

<script>
import GoBack from "@/components/layout/GoBack.vue";
import BannerPanel from "@/components/landing/BannerPanel.vue";
import PasswordUpdatePanel from "@/components/password-update-panel/PasswordUpdatePanel.vue";
import FooterPanel from '@/components/landing/FooterPanel.vue';

export default {
  name: "PasswordResetCallbackView",
  components: {
    GoBack,
    BannerPanel, 
    PasswordUpdatePanel,
    FooterPanel,
  },
  data() {
    return {
      theme: this.$theme.currentTheme,
    };
  },
};
</script>
