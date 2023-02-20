<template>
  <div class="auth-container" v-show="!this.$auth.$isAuthenticated">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <div class="auth-container-inner">
      <!-- username -->
      <AuthTextField :placeholder="'Username'" 
        :theme="theme" 
        :modelValue="this.username" 
        @update:modelValue="this.username = $event" 
        :disabled="disabled || inTransit" />
      <!-- password -->
      <AuthTextField :placeholder="'Password'" 
        :theme="theme" 
        :modelValue="this.password" 
        @update:modelValue="this.password = $event" 
        :type="'password'" 
        :disabled="disabled || inTransit" />
      <!-- sign-in button -->
      <AuthButton
        label="Submit"
        :theme="theme"
        @clicked="login()"
        :disabled="disabled || inTransit" />
      <!-- Google OAuth2 sign-in button -->
      <GoogleAuthButton :theme="theme" :disabled="disabled || inTransit" />
      <!-- account recovery link -->
      <AuthPanelLink :to="'/pw_reset'" :message="'Account recovery.'" :theme="theme" />
      <!-- registration link -->
      <AuthPanelLink :to="'/register'" :message="'FeedGears is free.  Create an account here.'" :theme="theme" />
      <!-- server response -->
      <AuthServerResponse :serverMessage="serverMessage" :theme="theme" />
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

export default {
  name: "AuthPanel",
  components: {
    NavbarFixedHeader,
    AuthTextField,
    AuthButton,
    GoogleAuthButton,
    AuthPanelLink,
    AuthServerResponse,
  },
  props: [ "disabled", "theme" ],
  mounted() {
    if (this.$route.query.error) {
      this.serverMessage = "We're unable to complete your request.  Please try to login using another method.";
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
        this.clearServerResponse();

        if (!this.username && !this.password) {
          this.serverMessage = "Username and password are required.";
          return;
        }
        if (this.username && !this.password) {
          this.serverMessage = "Password is required.";
          return;
        }
        if (!this.username && this.password) {
          this.serverMessage = "Username is required.";
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
                this.serverMessage = "Something horrible happened, not sure what.  Please try again in a few moments.";
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
}

.auth-container-inner {
  margin: 25%;
  border: 1px solid v-bind('theme.sectionbordercolor');
  background: v-bind('theme.sectionhighlight');
  border-radius: 5px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}
</style>