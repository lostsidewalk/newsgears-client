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
    const { t } = useI18n();

    onMounted(() => {
      auth.getTokenSilently()
      .catch(() => { })
      .finally(() => {
        if (auth.isAuthenticated) {
          console.log("order-confirmed-view: authenticated on mount");
        } else {
          console.log("order-confirmed-view: not authenticated on mount");
        }
      });
    });

    return {
      auth,
      t
    }
  },
};
</script>
