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
      <BannerPanel :show-auth="false" />

      <RegistrationRequestPanel />

      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import RegistrationRequestPanel from "@/components/registration-panel/RegistrationRequestPanel.vue";
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";

export default {
  name: "RegistrationRequestView",
  components: {
    BannerPanel,
    GoBack,
    RegistrationRequestPanel,
    FooterPanel,
  },
  props: {
    baseUrl: { type: String, required: true },
  },
};
</script>
