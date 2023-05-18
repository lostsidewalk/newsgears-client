<template>
  <v-app>
    <v-app-bar app location="top" :scrol-behavior="'elevate'">
      <template v-slot:title>
        <span class="view-header-no-count">
          FeedGears RSS
        </span>
      </template>
      <template v-slot:prepend>
        <v-app-bar-nav-icon icon="fa-rss" />
      </template>
      <v-toolbar-items>
        <GoBack :theme="theme" />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <!-- container -->
      <BannerPanel :theme="theme" />

      <v-divider /> 
      
      <RegistrationRequestPanel :theme="theme" />

      <v-divider />

      <FooterPanel :theme="theme" app />
    </v-main>
  </v-app>
</template>

<script>
import GoBack from '@/components/layout/GoBack.vue';
import BannerPanel from '@/components/landing/BannerPanel.vue';
import RegistrationRequestPanel from '@/components/registration-panel/RegistrationRequestPanel.vue';
import FooterPanel from '@/components/landing/FooterPanel.vue';

export default {
  name: "RegistrationRequestView",
  components: {
    GoBack,
    BannerPanel,
    RegistrationRequestPanel,
    FooterPanel,
  },
  props: [ "baseUrl" ],
  data() {
    return {
      theme: this.$theme.currentTheme,
    };
  },
};
</script>
