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
      <!-- container -->
      <BannerPanel :is-authenticated="auth.isAuthenticated" />

      <v-divider /> 

      <v-container>
        {{ $t('inDevelopment') }}
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
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";

export default {
  name: "ApiView",
  components: {
    BannerPanel,
    GoBack,
    FooterPanel,
  },

  props: {
    baseUrl: { type: String, required: true },
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
          console.log("api-view: authenticated on mount");
        } else {
          console.log("api-view: not authenticated on mount");
        }
      });
  },
};
</script>
