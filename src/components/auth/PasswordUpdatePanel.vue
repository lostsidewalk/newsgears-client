<template>
  <div class="password-update-container">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <!-- password reset panel -->
    <div class="password-update-container-inner">
      <!-- new password -->
      <AuthTextField :placeholder="'New password'" 
        :theme="theme" 
        :modelValue="this.newPassword" 
        @update:modelValue="this.username = $event"
        :type="'password'" 
        :disabled="disabled || inTransit" />
      <!-- new password (confirm) -->
      <AuthTextField :placeholder="'Confirm new password'" 
        :theme="theme" 
        :modelValue="this.newPasswordConfirmed" 
        @update:modelValue="this.username = $event"
        :type="'password'" 
        :disabled="disabled || inTransit" />
      <!-- submit button -->
      <AuthButton
        label="Submit"
        :theme="theme"
        @clicked="submitPwUpdate()"
        :disabled="disabled || inTransit" />
      <!-- server response -->
      <AuthServerResponse :serverMessage="serverMessage" :theme="theme" />
      <!-- privacy policy -->
      <div class="footer-view">
        <span>
          <a class="footer-link" href="#" target="_blank" @click.prevent="this.$router.push('/privacy');">
            <i class="fa fa-file-text" /> Privacy Policy
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '../layout/NavbarFixedHeader.vue';
import AuthTextField from './AuthTextField.vue';
import AuthButton from './AuthButton.vue'
import AuthServerResponse from './AuthServerResponse.vue';

export default {
  components: {
    NavbarFixedHeader,
    AuthTextField,
    AuthButton,
    AuthServerResponse
},
  props: [ "disabled", "theme" ],
  data() {
    return {
      // new password/new password confirmed 
      newPassword: null,
      newPasswordConfirmed: null,
      // server response/initiating action 
      serverMessage: "Enter and confirm your new password.",
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
            this.serverMessage = "Password updated.";
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
  border-radius: 5px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.footer-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
  resize: none;
  gap: .75rem;
  padding: 1.25rem;
}

.footer-link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
}

.footer-link:hover, .footer-link:focus {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}
</style>
