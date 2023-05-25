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
        <GoBack />
        <DisplayModeButton />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <BannerPanel :show-auth="false" />

      <PasswordUpdatePanel ref="passwordUpdate" />

      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import PasswordUpdatePanel from "@/components/password-update-panel/PasswordUpdatePanel.vue";
import FooterPanel from '@/components/footer-panel/FooterPanel.vue';
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";

export default {
  name: "PasswordResetCallbackView",
  components: {
    BannerPanel,
    GoBack,
    DisplayModeButton,
    PasswordUpdatePanel,
    FooterPanel,
  },
};
</script>
