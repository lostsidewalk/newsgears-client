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
      <PasswordUpdatePanel ref="passwordUpdate" />

      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import GoBack from "@/components/layout/GoBack.vue";
import PasswordUpdatePanel from "@/components/password-update-panel/PasswordUpdatePanel.vue";
import FooterPanel from '@/components/footer-panel/FooterPanel.vue';

export default {
  name: "PasswordResetCallbackView",
  components: {
    GoBack,
    PasswordUpdatePanel,
    FooterPanel,
  },
};
</script>
