<template>
  <div class="password-reset-container">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <!-- password reset panel -->
    <div class="password-reset-container-inner">
      <!-- username -->
      <AuthTextField :placeholder="'Username'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="this.username" 
        @update:modelValue="this.username = $event" 
        :disabled="disabled || inTransit" />
      <!-- email address -->
      <AuthTextField :placeholder="'Email address'" 
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
      <!-- privacy policy -->
      <div class="footer-view">
        <button class="footer-link" @click.prevent="this.$router.push('/privacy');">
          <span class="fa fa-file-text" /> Privacy Policy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '../layout/NavbarFixedHeader.vue';
import AuthButton from './AuthButton.vue'
import AuthTextField from './AuthTextField.vue';
import AuthServerResponse from './AuthServerResponse.vue';

const DEFAULT_SERVER_MESSAGE = "Enter your username and email address.  We'll send a password reset link to your verified email address.";

export default {
  components: {
    NavbarFixedHeader,
    AuthButton,
    AuthTextField,
    AuthServerResponse, 
},
  props: [ "disabled", "theme" ],
  data() {
    return {
      // username/email address 
      username: null,
      email: null,
      // server response/initiating action 
      serverMessage: DEFAULT_SERVER_MESSAGE,
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
          this.serverMessage = DEFAULT_SERVER_MESSAGE;
          return;
        }

        this.inTransit = true;
        this.$auth
            .pwResetWithSupplied(this.username, this.email)
            .then(() => {
              this.clearData();
              this.serverMessage = "Check your email to further instructions.";
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
  border-radius: 5px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.footer-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  justify-content: center;
  gap: .75rem;
  padding: 1.25rem;
}

.footer-link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
  background: unset;
  border: unset;
  max-width: fit-content;
  min-width: 48px;
  min-height: 48px;
}

.footer-link:hover, .footer-link:focus-visible {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}
</style>
