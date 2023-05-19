<template>
  <v-app>
    <v-app-bar
      app
      location="top"
      :scrol-behavior="'elevate'"
    >
      <template #title>
        <span class="view-header-no-count"> FeedGears RSS </span>
      </template>
      <template #prepend>
        <v-app-bar-nav-icon icon="fa-rss" />
      </template>
      <v-toolbar-items>
        <GoBack />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            align="center"
          >
            <h2 class="logotext">
              FeedGears RSS
            </h2>
          </v-col>
          <v-col
            cols="12"
            align="center"
          >
            <i class="fa fa-rss fa-3x" />
          </v-col>
          <v-col
            cols="12"
            align="center"
          >
            <h3 class="logosubtext fancy">
              {{ $t("whatIsFeedGears") }}
            </h3>
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="mt-8" />

      <RegistrationRequestPanel />

      <v-divider />

      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import GoBack from "@/components/layout/GoBack.vue";
import RegistrationRequestPanel from "@/components/registration-panel/RegistrationRequestPanel.vue";
import FooterPanel from "@/components/landing/FooterPanel.vue";

export default {
  name: "RegistrationRequestView",
  components: {
    GoBack,
    RegistrationRequestPanel,
    FooterPanel,
  },
  props: {
    baseUrl: { type: String, required: true },
  },
  data() {
    return {
      theme: this.$theme.currentTheme,
    };
  },
};
</script>

<style scoped>
.logotext {
  font-family: "Russo One";
}

.logosubtext {
  font-size: 1.5rem;
}

.fancy {
  font-family: "Merriweather";
  font-weight: bold;
}
</style>
