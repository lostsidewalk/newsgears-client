<template>
  <div>
    <!-- registration panel -->
    <div v-show="!this.inTransit">
      <!-- email address -->
      <AuthTextField :placeholder="'Email address'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="v$.email.$model" 
        :errorValue="v$.email.$errors"
        @update:modelValue="v$.email.$model = $event" />
      <!-- username -->
      <AuthTextField :placeholder="'Username'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="v$.username.$model" 
        :errorValue="v$.username.$errors"
        @update:modelValue="v$.username.$model = $event" />
      <!-- password -->
      <AuthTextField :placeholder="'Password'" 
        :inTransit="inTransit" 
        :theme="theme" 
        :modelValue="v$.password.$model" 
        :errorValue="v$.password.$errors"
        @update:modelValue="v$.password.$model = $event" 
        :type="'password'" />
      <!-- agree to terms -->
      <AuthAgreeToTerms :inTransit="inTransit" :theme="theme" @updateAgreement="updateAgreement" />
      <!-- submit button -->
      <AuthButton
        label="Submit"
        :theme="theme"
        @clicked="submitRegistration()"
        :disabled="inTransit || v$.$invalid"
      />
    </div>
    <!-- server response -->
    <AuthServerResponse :serverMessage="serverMessage" :lastAction="lastAction" :theme="theme" />
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import AuthButton from './AuthButton.vue'
import AuthTextField from './AuthTextField.vue';
import AuthAgreeToTerms from './AuthAgreeToTerms.vue';
import AuthServerResponse from './AuthServerResponse.vue';

export default {
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  components: {
    AuthButton,
    AuthTextField,
    AuthAgreeToTerms,
    AuthServerResponse,
},
  props: [ "inTransit", "theme" ],
  emits: [ "updateInTransit" ],
  validations() {
    return {
      username: { 
        required,
        maxLength: maxLength(100),
      },
      email: {
        required, 
        maxLength: maxLength(512),
        email: email,
      },
      password: { 
        required, 
        minLength: minLength(6),
        maxLength: maxLength(256),
      },
    }
  },
  data() {
    return {
      username: null,
      email: null,
      password: null,
      userType: null,
      agreeWithTerms: null,
      lastAction: null,
      serverMessage: null,
    }
  },
  methods: {
    updateAgreement(agreement) {
      this.agreeWithTerms = agreement.agreeWithTerms;
    },
    submitRegistration() {
      this.clearServerResponse();

      if (!this.username || !this.email || !this.password) {
        this.lastAction = "REGISTER";
        this.serverMessage = "Username, email address, and password are required in order to register.";
        return;
      }

      if (!this.agreeWithTerms) {
        this.lastAction = "REGISTER";
        this.serverMessage = "In order to register, you must first agree to the NewsGears Terms and Conditions.";
        return;
      }

      this.$emit('updateInTransit', true);
      this.$auth
        .registerWithSupplied(this.username, this.email, this.password, this.userType)
        .then((response) => {
          this.clearData();
          this.$auth.loginWithSupplied(response.username, response.password, false)
          .then(() => {
            this.clearData();
            this.$router.push("/app");
          })
          .catch((error) => {
            this.lastAction = "LOGIN";
            this.serverMessage = error;
          })
          .finally(() => {
            this.$emit('updateInTransit', false);
          });
        })
        .catch((error) => {
          this.lastAction = "ERROR";
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
