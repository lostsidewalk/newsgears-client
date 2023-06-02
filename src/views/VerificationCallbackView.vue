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
      <BannerPanel :is-authenticated="auth.isAuthenticated" />

      <v-divider />

      <v-container>
        {{ $t("thanksForVerifying") }}
      </v-container>

      <v-divider />

      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import { inject } from 'vue';
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";

export default {
  name: "VerificationCallbackView",
  components: {
    BannerPanel,
    GoBack,
    DisplayModeButton,
    FooterPanel,
  },
  setup() {
    const auth = inject('auth');

    return {
      auth
    }
  },
  mounted() {
    this.auth.getTokenSilently()
      .catch(() => { })
      .finally(() => {
        if (this.auth.isAuthenticated) {
          console.log("verification-callback-view: authenticated on mount");
        } else {
          console.log("verification-callback-view: not authenticated on mount");
        }
      });
  }
};
</script>
