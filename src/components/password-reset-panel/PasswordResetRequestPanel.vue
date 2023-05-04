<template>
  <div class="password-reset-container">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <!-- password reset panel -->
    <div class="password-reset-container-inner" v-auto-animate>
      <!-- username -->
      <AuthTextField :placeholder="this.$t('username')" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="this.username" 
        @update:modelValue="this.username = $event" 
        :disabled="disabled || inTransit" />
      <!-- email address -->
      <AuthTextField :placeholder="this.$t('emailAddress')" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="this.email" 
        @update:modelValue="this.email = $event" 
        :disabled="disabled || inTransit" />
      <!-- submit button -->
      <AuthButton
        label="Submit"
        :theme="theme"
        @clicked="submitPwReset()"
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
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthTextField from '@/components/auth/AuthTextField.vue';
import AuthServerResponse from '@/components/auth/AuthServerResponse.vue';
import AuthFooterView from '@/components/auth/AuthFooterView.vue';

export default {
  components: {
    NavbarFixedHeader,
    AuthButton,
    AuthTextField,
    AuthServerResponse, 
    AuthFooterView,
},
  props: [ "disabled", "theme" ],
  data() {
    return {
      // username/email address 
      username: null,
      email: null,
      // server response/initiating action 
      serverMessage: this.$t('pwResetRequestMessage'),
      // 
      inTransit: false,
    }
  },
  methods: {
      //
      // 
      //
      submitPwReset() {
        this.clearServerResponse();
        if (!this.username || !this.email) {
          this.serverMessage = this.$t('pwResetRequestMessage');
          return;
        }

        this.inTransit = true;
        this.$auth
            .pwResetWithSupplied(this.username, this.email)
            .then(() => {
              this.clearData();
              this.serverMessage = this.$t('checkEmailForFurther');
            })
            .catch((error) => {
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
        this.username = null;
        this.email = null;
        this.clearServerResponse();
      },
      clearServerResponse() {
        this.serverMessage = null;
      }
  }
}
</script>

<style scoped>
.password-reset-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: larger; 
}

.password-reset-container-inner {
  margin: 2%;
  border: 1px solid v-bind('theme.sectionbordercolor');
  background: v-bind('theme.sectionhighlight');
  border-radius: 4px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}
</style>
