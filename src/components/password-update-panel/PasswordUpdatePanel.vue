<template>
  <div class="password-update-container">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <!-- password reset panel -->
    <div class="password-update-container-inner" v-auto-animate>
      <!-- new password -->
      <AuthTextField :placeholder="this.$t('newPassword')" 
        :theme="theme" 
        :modelValue="this.newPassword" 
        @update:modelValue="this.username = $event"
        :type="'password'" 
        :disabled="disabled || inTransit" />
      <!-- new password (confirm) -->
      <AuthTextField :placeholder="this.$t('confirmNewPassword')" 
        :theme="theme" 
        :modelValue="this.newPasswordConfirmed" 
        @update:modelValue="this.username = $event"
        :type="'password'" 
        :disabled="disabled || inTransit" />
      <!-- submit button -->
      <AuthButton
        :label="this.$t('submit')"
        :theme="theme"
        @clicked="submitPwUpdate()"
        :disabled="disabled || inTransit" />
      <!-- server response -->
      <AuthServerResponse :serverMessage="serverMessage" :theme="theme" />
      <!-- footer -->
      <AuthFooterView :theme="theme" />
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import AuthTextField from '@/components/auth/AuthTextField.vue';
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthServerResponse from '@/components/auth/AuthServerResponse.vue';
import AuthFooterView from '@/components/auth/AuthFooterView.vue';

export default {
  components: {
    NavbarFixedHeader,
    AuthTextField,
    AuthButton,
    AuthServerResponse,
    AuthFooterView,
},
  props: [ "disabled", "theme" ],
  data() {
    return {
      // new password/new password confirmed 
      newPassword: null,
      newPasswordConfirmed: null,
      // server response/initiating action 
      serverMessage: this.$t('enterAndConfirmNewPw'),
      // 
      inTransit : false,
    }
  },
  methods: {
    //
    // 
    //
    submitPwUpdate() {
      this.clearServerResponse();

      if (!this.newPassword || !this.newPasswordConfirmed) {
        return;
      }

      this.inTransit = true;
      this.$auth
          .pwUpdateWithSupplied(this.newPassword, this.newPasswordConfirmed)
          .then(() => {
            this.clearData();
            this.serverMessage = this.$t('pwUpdated');
          })
          .catch((error) => {
            this.lastAction = "PW_UPDATE";
            this.serverMessage = error;
          })
          .finally(() => {
            this.inTransit = false;
          });
    },
    //
    //
    //
    clearData() {
      // reset all fields 
      this.newPassword = null;
      this.newPasswordConfirmed = null;
      this.clearServerResponse();
    },
    clearServerResponse() {
      this.lastAction = null;
      this.serverMessage = null;
    }
  }
}
</script>

<style scoped>
.password-update-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: larger; 
}

.password-update-container-inner {
  margin: 2%;
  border: 1px solid v-bind('theme.sectionbordercolor');
  background: v-bind('theme.sectionhighlight');
  border-radius: 4px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}
</style>