<template>
  <div>
    <!-- password reset panel -->
    <div v-show="!this.inTransit">
      <!-- username -->
      <AuthTextField :placeholder="'Username'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="this.username" 
        @update:modelValue="this.username = $event"/>
      <!-- email address -->
      <AuthTextField :placeholder="'Email address'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="this.email" 
        @update:modelValue="this.email = $event"/>
      <!-- submit button -->
      <AuthButton
        label="Submit"
        :theme="theme"
        @clicked="submitPwReset()"
        :disabled="inTransit"
      />
    </div>
    <!-- server response -->
    <AuthServerResponse :serverMessage="serverMessage" :lastAction="lastAction" :theme="theme" />
  </div>
</template>

<script>
import AuthButton from './AuthButton.vue'
import AuthTextField from './AuthTextField.vue';
import AuthServerResponse from './AuthServerResponse.vue';

const DEFAULT_LAST_ACTION = "PW_RESET";

const DEFAULT_SERVER_MESSAGE = "Enter your username and email address.  We'll send a password reset link to your verified email address.";

export default {
  components: {
    AuthButton,
    AuthTextField,
    AuthServerResponse, 
},
  props: [ "inTransit", "theme" ],
  emits: [ "updateInTransit" ],
  data() {
    return {
      // username/email address 
      username: null,
      email: null,
      // server response/initiating action 
      lastAction: DEFAULT_LAST_ACTION,
      serverMessage: DEFAULT_SERVER_MESSAGE,
    }
  },
  methods: {
      //
      // 
      //
      submitPwReset() {
        this.clearServerResponse();

        if (!this.username || !this.email) {
          this.lastAction = DEFAULT_LAST_ACTION;
          this.serverMessage = DEFAULT_SERVER_MESSAGE;
          return;
        }

        this.$emit('updateInTransit', true);
        this.$auth
            .pwResetWithSupplied(this.username, this.email)
            .then(() => {
              this.clearData();
              this.lastAction = DEFAULT_LAST_ACTION;
              this.serverMessage = "Check your email to further instructions.";
            })
            .catch((error) => {
              this.lastAction = DEFAULT_LAST_ACTION;
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
        this.username = null;
        this.email = null;
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
</style>
