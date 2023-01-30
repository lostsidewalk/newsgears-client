<template>
  <div>
    <div v-show="!this.inTransit && !this.$auth.$isAuthenticated">
      <!-- username -->
      <AuthTextField :placeholder="'Username'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="this.username" 
        @update:modelValue="this.username = $event"/>
      <!-- password -->
      <AuthTextField :placeholder="'Password'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="this.password" 
        @update:modelValue="this.password = $event" 
        :type="'password'" />
      <!-- sign-in button -->
      <AuthButton
        label="Submit"
        :theme="theme"
        @clicked="login()"
        :disabled="inTransit" />
      <!-- Google OAuth2 sign-in button -->
      <GoogleAuthButton :theme="theme" />
      <!-- account recovery link -->
      <AuthPanelLink :to="'/pw_reset'" :message="'I need help signing in.'" :theme="theme" />
      <!-- registration link -->
      <AuthPanelLink :to="'/register'" :message="'No account?  Get one here.'" :theme="theme" />
    </div>
    <!-- server response -->
    <AuthServerResponse :serverMessage="serverMessage" :lastAction="lastAction" :theme="theme" />
  </div>
</template>

<script>
import AuthTextField from './AuthTextField.vue';
import AuthButton from './AuthButton.vue'
import GoogleAuthButton from './GoogleAuthButton.vue';
import AuthPanelLink from './AuthPanelLink.vue';
import AuthServerResponse from './AuthServerResponse.vue';

export default {
  name: "AuthPanel",
  components: {
    AuthTextField,
    AuthButton,
    GoogleAuthButton,
    AuthPanelLink,
    AuthServerResponse,
  },
  props: [ "inTransit", "theme" ],
  emits: [ "updateInTransit" ],
  mounted() {
    if (this.$route.query.error) {
      this.lastAction = null;
      this.serverMessage = "We're unable to complete your request.  Please try to login using another method.";
    }
  },
  data() {
    return {
      username: null,
      password: null,
      // server response/initiating action 
      lastAction: null,
      serverMessage: null,
    }
  },
  methods: {
      login() {
        this.clearServerResponse();

        if (!this.username && !this.password) {
          this.lastAction = "LOGIN";
          this.serverMessage = "Username and password are required.";
          return;
        }
        if (this.username && !this.password) {
          this.lastAction = "LOGIN";
          this.serverMessage = "Password is required.";
          return;
        }
        if (!this.username && this.password) {
          this.lastAction = "LOGIN";
          this.serverMessage = "Username is required.";
          return;
        }

        this.$emit('updateInTransit', true);
        this.$auth
            .loginWithSupplied(this.username, this.password, false)
            .then(() => {
              this.clearData();
            })
            .catch((error) => {
              this.lastAction = "LOGIN";
              this.serverMessage = error;
              if (!this.serverMessage) {
                this.serverMessage = "Something horrible happened, not sure what.  Please try again in a few moments.";
              }
            })
            .finally(() => {
              this.$emit('updateInTransit', false);
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
        this.lastAction = null;
        this.serverMessage = null;
      }
  }
}
</script>
