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

      <PasswordResetRequestPanel />
      
      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
import PasswordResetRequestPanel from "@/components/password-reset-panel/PasswordResetRequestPanel.vue";
import FooterPanel from '@/components/footer-panel/FooterPanel.vue';

export default {
  name: "PasswordResetRequestView",
  components: {
    BannerPanel,
    GoBack,
    DisplayModeButton,
    PasswordResetRequestPanel,
    FooterPanel,
  },
  props: {
    baseUrl: { type: String, required: true },
  },
};
</script>
