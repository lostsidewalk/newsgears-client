<template>
  <v-app>
    <!-- pre-auth app bar -->
    <v-app-bar
      app
      location="top"
      :scroll-behavior="'elevate'"
    >
      <template #title>
        <span class="newsgears-rss"> Newsgears RSS </span>
      </template>
      <template #prepend>
        <v-app-bar-nav-icon
          icon="fa-rss"
          :aria-label="$t('newsgearsRssLogo')"
        />
      </template>
      <v-toolbar-items>
        <GoBack />
        <DisplayModeButton />
      </v-toolbar-items>
    </v-app-bar>

    <!-- pre-auth main -->
    <v-main>
      <BannerPanel :show-auth="false" />

      <AuthPanel
        v-show="!isAuthenticated"
        :server-message="roAuthServerMessage"
        :is-loading="roLoginIsLoading"
        @login="login"
      />
    </v-main>
  </v-app>
</template>

<script>
import { inject } from "vue";

import GoBack from "@/components/generic/GoBack.vue";
import DisplayModeButton from "@/components/generic/DisplayModeButton.vue";
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import AuthPanel from "@/components/auth-panel/AuthPanel.vue";

import { useAuth } from "@/composable/useAuth.js";

export default {
  name: "LoginView",
  components: {
    GoBack,
    DisplayModeButton,
    BannerPanel,
    AuthPanel,
  },
  setup() {
    const isAuthenticated = inject("isAuthenticated");

    const { roAuthServerMessage, roLoginIsLoading, login } = useAuth();

    return {
      isAuthenticated,
      roAuthServerMessage,
      roLoginIsLoading,
      login,
    };
  },
};
</script>

<style scoped>
.newsgears-rss {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>
