<template>
  <v-app>
    <v-app-bar
      app
      location="top"
      :scroll-behavior="'elevate'"
    >
      <template #title>
        <span class="newsgears-rss">
          Newsgears RSS
        </span>
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

    <v-main>
      <BannerPanel :show-auth="false" />

      <PasswordResetRequestPanel
        :is-loading="pwResetIsLoading"
        :server-message="serverMessage"
        @submitPwReset="submitPwReset"
      />
      
      <FooterPanel app />
    </v-main>
  </v-app>
</template>

<script>
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import GoBack from "@/components/generic/GoBack.vue";
import DisplayModeButton from "@/components/generic/DisplayModeButton.vue";
import PasswordResetRequestPanel from "@/components/password-reset-panel/PasswordResetRequestPanel.vue";
import FooterPanel from '@/components/footer-panel/FooterPanel.vue';

export default {
  name: "PasswordResetRequestView",
  components: {
    BannerPanel,
    GoBack,
    DisplayModeButton,
    PasswordResetRequestPanel,
    FooterPanel,
  },
  props: {
    baseUrl: { type: String, required: true },
  },
  setup() {
    const auth = inject('auth');
    const { t } = useI18n();

    const pwResetIsLoading = ref(false);
    const serverMessage = ref(null);

    function submitPwReset(pwResetRequest) {
      let username = pwResetRequest.username;
      let email = pwResetRequest.email;
      serverMessage.value = null;
      if (!username || !email) {
        serverMessage.value = t('pwResetRequestMessage');
        return;
      }

      pwResetIsLoading.value = true;
      auth.pwResetWithSupplied(username, email)
          .then(() => {
            serverMessage.value = t('checkEmailForFurther');
          })
          .catch((error) => {
            serverMessage.value = error;
          })
          .finally(() => {
            pwResetIsLoading.value = false;
          });
    }

    return {
      auth,
      t,
      // 
      pwResetIsLoading, 
      serverMessage, 
      // 
      submitPwReset,
    }
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
