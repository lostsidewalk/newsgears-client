<template>
  <v-app>
    <v-app-bar
      app
      location="top"
      :scrol-behavior="'elevate'"
    >
      <template #title>
        <span class="feedgears-rss">
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
      <BannerPanel :is-authenticated="isAuthenticated" />

      <v-divider />

      <v-container>
        {{ t('thankYouForYourOrder') }}
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
  name: "OrderConfirmedView",
  components: {
    GoBack,
    DisplayModeButton,
    BannerPanel,
    FooterPanel,
  },
  setup() {
    const auth = inject('auth');
    const isAuthenticated = inject('isAuthenticated');
    const { t } = useI18n();

    onMounted(() => {
      auth.getTokenSilently()
      .finally(() => {
        if (isAuthenticated.value) {
          console.log("order-confirmed-view: authenticated on mount");
        } else {
          console.log("order-confirmed-view: not authenticated on mount");
        }
      });
    });

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
