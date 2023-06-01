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
      <BannerPanel :show-auth="false" />

      <RegistrationRequestPanel
        :is-loading="registrationIsLoading"
        :server-message="serverMessage"
        @submit-registration="submitRegistration"
      />

      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
import RegistrationRequestPanel from "@/components/registration-panel/RegistrationRequestPanel.vue";
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";

export default {
  name: "RegistrationRequestView",
  components: {
    BannerPanel,
    GoBack,
    DisplayModeButton,
    RegistrationRequestPanel,
    FooterPanel,
  },
  props: {
    baseUrl: { type: String, required: true },
  },
  data() {
    return {
      registrationIsLoading: false,
      serverMessage: null,
    }
  },
  methods: {
    submitRegistration(registrationRequest) {
      let username = registrationRequest.username;
      let email = registrationRequest.email;
      let password = registrationRequest.password;
      let userType = registrationRequest.userType;
      this.serverMessage = null;
      if (!username || !email || !password) {
        this.serverMessage = this.$t('registrationRequirements');
        return;
      }

      this.registrationIsLoading = true;
      this.$auth
        .registerWithSupplied(username, email, password, userType)
        .then((response) => {
          this.clearData();
          this.$auth.loginWithSupplied(response.username, response.password, false)
          .then(() => {
            this.clearData();
            this.$router.push("/app");
          })
          .catch((error) => {
            this.serverMessage = error;
          })
          .finally(() => {
            this.registrationIsLoading = false;
          });
        })
        .catch((error) => {
          this.serverMessage = error;
        })
        .finally(() => {
          this.registrationIsLoading = false;
        });
    }
  }
};
</script>
