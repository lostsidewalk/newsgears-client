<template>
  <div class="registration-request-container">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <!-- registration panel -->
    <div class="registration-request-container-inner" v-auto-animate>
      <!-- email address -->
      <AuthTextField :placeholder="this.$t('emailAddress')" 
        :disabled="disabled || inTransit" 
        :theme="theme" 
        :modelValue="v$.email.$model" 
        :errorValue="v$.email.$errors"
        @update:modelValue="v$.email.$model = $event" />
      <!-- username -->
      <AuthTextField :placeholder="this.$t('username')" 
        :disabled="disabled || inTransit" 
        :theme="theme" 
        :modelValue="v$.username.$model" 
        :errorValue="v$.username.$errors"
        @update:modelValue="v$.username.$model = $event" />
      <!-- password -->
      <AuthTextField :placeholder="this.$t('password')" 
        :disabled="disabled || inTransit" 
        :theme="theme" 
        :modelValue="v$.password.$model" 
        :errorValue="v$.password.$errors"
        @update:modelValue="v$.password.$model = $event" 
        :type="'password'" />
      <!-- submit button -->
      <AuthButton
        :label="this.$t('submit')"
        :theme="theme"
        @clicked="submitRegistration()"
        :button="'s'"
        :disabled="disabled || inTransit || v$.$invalid"
      />
      <!-- server response -->
      <AuthServerResponse :serverMessage="serverMessage" :theme="theme" />
      <!-- footer -->
      <AuthFooterView :theme="theme" />
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthTextField from '@/components/auth/AuthTextField.vue';
import AuthServerResponse from '@/components/auth/AuthServerResponse.vue';
import AuthFooterView from '@/components/auth/AuthFooterView.vue';

export default {
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  components: {
    NavbarFixedHeader,
    AuthButton,
    AuthTextField,
    AuthServerResponse,
    AuthFooterView
},
  props: [ "disabled", "theme" ],
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
      serverMessage: null,
      // 
      inTransit: false,
    }
  },
  methods: {
    submitRegistration() {
      this.clearServerResponse();

      if (!this.username || !this.email || !this.password) {
        this.serverMessage = this.$t('registrationRequirements');
        return;
      }

      this.inTransit = true;
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
            this.serverMessage = error;
          })
          .finally(() => {
            this.inTransit = false;
          });
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
.registration-request-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: larger; 
}

.registration-request-container-inner {
  margin: 2%;
  border: 1px solid v-bind('theme.sectionbordercolor');
  background: v-bind('theme.sectionhighlight');
  border-radius: 4px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}
</style>