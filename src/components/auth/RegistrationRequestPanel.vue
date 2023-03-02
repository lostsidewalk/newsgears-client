<template>
  <div class="registration-request-container">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <!-- registration panel -->
    <div class="registration-request-container-inner">
      <!-- email address -->
      <AuthTextField :placeholder="'Email address'" 
        :disabled="disabled || inTransit" 
        :theme="theme" 
        :modelValue="v$.email.$model" 
        :errorValue="v$.email.$errors"
        @update:modelValue="v$.email.$model = $event" />
      <!-- username -->
      <AuthTextField :placeholder="'Username'" 
        :disabled="disabled || inTransit" 
        :theme="theme" 
        :modelValue="v$.username.$model" 
        :errorValue="v$.username.$errors"
        @update:modelValue="v$.username.$model = $event" />
      <!-- password -->
      <AuthTextField :placeholder="'Password'" 
        :disabled="disabled || inTransit" 
        :theme="theme" 
        :modelValue="v$.password.$model" 
        :errorValue="v$.password.$errors"
        @update:modelValue="v$.password.$model = $event" 
        :type="'password'" />
      <!-- submit button -->
      <AuthButton
        label="Submit"
        :theme="theme"
        @clicked="submitRegistration()"
        :button="'s'"
        :disabled="disabled || inTransit || v$.$invalid"
      />
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
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import AuthButton from './AuthButton.vue'
import AuthTextField from './AuthTextField.vue';
import AuthServerResponse from './AuthServerResponse.vue';

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
        this.serverMessage = "Username, email address, and password are required in order to register.";
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
