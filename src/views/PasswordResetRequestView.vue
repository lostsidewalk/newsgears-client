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
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <PasswordResetRequestPanel />
      
      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import GoBack from "@/components/layout/GoBack.vue";
import PasswordResetRequestPanel from "@/components/password-reset-panel/PasswordResetRequestPanel.vue";
import FooterPanel from '@/components/footer-panel/FooterPanel.vue';

export default {
  name: "PasswordResetRequestView",
  components: {
    GoBack,
    PasswordResetRequestPanel,
    FooterPanel,
  },
  props: {
    baseUrl: { type: String, required: true },
  },
};
</script>
