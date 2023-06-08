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
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
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
  setup() {
    const auth = inject('auth');
    const { router } = useRouter();
    const { t } = useI18n();

    const registrationIsLoading = ref(false);
    const serverMessage = ref(null);

    function submitRegistration(registrationRequest) {
      let username = registrationRequest.username;
      let email = registrationRequest.email;
      let password = registrationRequest.password;
      let userType = registrationRequest.userType;
      serverMessage.value = null;
      if (!username || !email || !password) {
        serverMessage.value = ('registrationRequirements');
        return;
      }

      registrationIsLoading.value = true;
      auth.registerWithSupplied(username, email, password, userType)
        .then((response) => {
          auth.loginWithSupplied(response.username, response.password, false)
          .then(() => {
            router.value.push("/app");
          })
          .catch((error) => {
            serverMessage.value = error;
          })
          .finally(() => {
            registrationIsLoading.value = false;
          });
        })
        .catch((error) => {
          serverMessage.value = error;
        })
        .finally(() => {
          registrationIsLoading.value = false;
        });
    }

    return {
      auth,
      router, 
      t,
      // 
      registrationIsLoading,
      serverMessage, 
      // 
      submitRegistration, 
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
