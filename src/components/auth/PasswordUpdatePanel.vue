<template>
  <div>
    <!-- password reset panel -->
    <div v-show="!this.inTransit">
      <!-- new password -->
      <AuthTextField :placeholder="'New password'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="this.newPassword" 
        @update:modelValue="this.username = $event"
        :type="'password'" />
      <!-- new password (confirm) -->
      <AuthTextField :placeholder="'Confirm new password'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="this.newPasswordConfirmed" 
        @update:modelValue="this.username = $event"
        :type="'password'" />
      <!-- submit button -->
      <AuthButton
        label="Submit"
        :theme="theme"
        @clicked="submitPwUpdate()"
        :disabled="inTransit"
      />
    </div>
    <!-- server response -->
    <AuthServerResponse :serverMessage="serverMessage" :lastAction="lastAction" :theme="theme" />
  </div>
</template>

<script>
import AuthTextField from './AuthTextField.vue';
import AuthButton from './AuthButton.vue'
import AuthServerResponse from './AuthServerResponse.vue';

export default {
  components: {
    AuthTextField,
    AuthButton,
    AuthServerResponse
},
  props: [ "inTransit", "theme" ],
  emits: [ "updateInTransit" ],
  data() {
    return {
      // new password/new password confirmed 
      newPassword: null,
      newPasswordConfirmed: null,
      // server response/initiating action 
      lastAction: "PW_UPDATE",
      serverMessage: "Enter and confirm your new password.",
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

      this.$emit('updateInTransit', true);
      this.$auth
          .pwUpdateWithSupplied(this.newPassword, this.newPasswordConfirmed)
          .then(() => {
            this.clearData();
            this.lastAction = "PW_UPDATE";
            this.serverMessage = "Password updated.";
          })
          .catch((error) => {
            this.lastAction = "PW_UPDATE";
            this.serverMessage = error;
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
