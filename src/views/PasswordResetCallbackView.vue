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

      <PasswordUpdatePanel
        ref="passwordUpdate"
        :is-loading="pwUpdateIsLoading"
        :server-message="serverMessage"
        @submitPwUpdate="submitPwUpdate"
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
import PasswordUpdatePanel from "@/components/password-update-panel/PasswordUpdatePanel.vue";
import FooterPanel from '@/components/footer-panel/FooterPanel.vue';

export default {
  name: "PasswordResetCallbackView",
  components: {
    BannerPanel,
    GoBack,
    DisplayModeButton,
    PasswordUpdatePanel,
    FooterPanel,
  },
  setup() {
    const auth = inject('auth');
    const { t } = useI18n();

    const pwUpdateIsLoading = ref(false);
    const serverMessage = ref(null);

    function submitPwUpdate(pwUpdateRequest) {
      let newPassword = pwUpdateRequest.newPassword;
      let newPasswordConfirmed = pwUpdateRequest.newPasswordConfirmed;
      this.serverMessage = null;
      if (!newPassword || !newPasswordConfirmed) {
        return;
      }

      pwUpdateIsLoading.value = true;
      auth.pwUpdateWithSupplied(newPassword.value, newPasswordConfirmed.value)
          .then(() => {
            serverMessage.value = t('pwUpdated');
          })
          .catch((error) => {
            serverMessage.value = error;
          })
          .finally(() => {
            pwUpdateIsLoading.value = false;
          });
    }

    return {
      auth, 
      // 
      pwUpdateIsLoading,
      serverMessage, 
      // 
      submitPwUpdate, 
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
