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
        <GoBack />
        <DisplayModeButton />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <!-- container -->
      <BannerPanel :is-authenticated="isAuthenticated" />

      <v-divider /> 

      <v-container>
        {{ t('inDevelopment') }}
      </v-container>

      <v-divider /> 
      
      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import { inject, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";

export default {
  name: "ApiView",
  components: {
    GoBack,
    DisplayModeButton,
    BannerPanel,
    FooterPanel,
  },
  props: {
    baseUrl: { type: String, required: true },
  },
  setup() {
    const auth = inject('auth');
    const isAuthenticated = inject('isAuthenticated');
    const { t } = useI18n();

    onMounted(() => {
      auth.getTokenSilently()
      .finally(() => {
        if (isAuthenticated.value) {
          console.log("api-view: authenticated on mount");
        } else {
          console.log("api-view: not authenticated on mount");
        }
      });
    })

    return {
      auth,
      isAuthenticated, 
      t
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
