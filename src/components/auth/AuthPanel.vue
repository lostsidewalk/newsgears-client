<template>
  <div class="auth-container" v-show="!this.$auth.$isAuthenticated">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <div class="auth-container-inner" v-auto-animate>
      <!-- username -->
      <AuthTextField :placeholder="this.$t('username')" 
        :theme="theme" 
        :modelValue="this.username" 
        @update:modelValue="this.username = $event" 
        :disabled="disabled || inTransit" />
      <!-- password -->
      <AuthTextField :placeholder="this.$t('password')" 
        :theme="theme" 
        :modelValue="this.password" 
        @update:modelValue="this.password = $event" 
        :type="'password'" 
        :disabled="disabled || inTransit" />
      <!-- sign-in button -->
      <AuthButton
        :label="this.$t('submit')"
        :theme="theme"
        @clicked="login()"
        :disabled="disabled || inTransit" />
      <!-- Google OAuth2 sign-in button -->
      <GoogleAuthButton :theme="theme" :disabled="disabled || inTransit" />
      <!-- account recovery link -->
      <AuthPanelLink :to="'/pw_reset'" :message="this.$t('accountRecovery')" :theme="theme" />
      <!-- registration link -->
      <AuthPanelLink :to="'/register'" :message="this.$t('registerHere')" :theme="theme" />
      <!-- server response -->
      <AuthServerResponse :serverMessage="serverMessage" :theme="theme" />
      <!-- footer -->
      <AuthFooterView :theme="theme" />
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '../layout/NavbarFixedHeader.vue';
import AuthTextField from './AuthTextField.vue';
import AuthButton from './AuthButton.vue'
import GoogleAuthButton from './GoogleAuthButton.vue';
import AuthPanelLink from './AuthPanelLink.vue';
import AuthServerResponse from './AuthServerResponse.vue';
import AuthFooterView from './AuthFooterView.vue';

export default {
  name: "AuthPanel",
  components: {
    NavbarFixedHeader,
    AuthTextField,
    AuthButton,
    GoogleAuthButton,
    AuthPanelLink,
    AuthServerResponse,
    AuthFooterView,
  },
  props: [ "disabled", "theme" ],
  mounted() {
    if (this.$route.query.error) {
      this.serverMessage = this.$t('unableToCompleteYourRequest');
    }
  },
  data() {
    return {
      username: null,
      password: null,
      // server response/initiating action 
      serverMessage: null,
      // 
      inTransit: false,
    }
  },
  methods: {
      login() {
        if (!this.username && !this.password) {
          this.serverMessage = this.t$('usernameAndPasswordAreRequired');
          return;
        }
        if (this.username && !this.password) {
          this.serverMessage = this.$t('usernameIsRequired');
          return;
        }
        if (!this.username && this.password) {
          this.serverMessage = this.$t('passwordIsRequired');
          return;
        }

        this.inTransit = true;
        this.$auth
            .loginWithSupplied(this.username, this.password, false)
            .then(() => {
              this.clearData();
            }).catch((error) => {
              this.serverMessage = error;
              if (!this.serverMessage) {
                this.serverMessage = this.$t('somethingHorribleHappened');
              }
            }).finally(() => {
              this.inTransit = false;
            });
      },
      //
      //
      //
      clearData() {
        // reset all fields 
        this.username = null;
        this.password = null;
        this.clearServerResponse();
      },
      clearServerResponse() {
        this.serverMessage = null;
      }
  }
}
</script>

<style scoped>
.auth-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: larger; 
  min-width: 200px;
}

.auth-container-inner {
  margin: 2%;
  border: 1px solid v-bind('theme.sectionbordercolor');
  background: v-bind('theme.sectionhighlight');
  border-radius: 4px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}
</style>