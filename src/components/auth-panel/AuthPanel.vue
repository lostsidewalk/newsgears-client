<template>
  <v-container v-show="!this.$auth.$isAuthenticated">
    <!-- row -->
    <v-row align="center" justify="center">
      <!-- col -->
      <v-col cols="12" sm="10">
        <!-- card -->
        <v-card elevation="6" class="mt-10">
          <!-- window -->
          <v-window v-model="step">
            <!-- window item -->
            <v-window-item :value="1">
              <!-- row -->
              <v-row>
                <!-- col -->
                <v-col cols="12">
                  <!-- card-text -->
                  <v-card-text class="mt-12 mb-12">
                    <!-- banner (large) -->
                    <h4 class="text-center mt-4 mb-4">{{ this.$t('loginToYourAccount') }}</h4>
                    <!-- row -->
                    <v-row align="center" justify="center">
                      <!-- col -->
                      <v-col cols="12" sm="8" v-auto-animate>
                        <!-- username -->
                        <AuthTextField 
                          class="mt-4 mb-4"
                          :label="this.$t('username')" 
                          :placeholder="this.$t('username')" 
                          :theme="theme" 
                          :modelValue="this.username" 
                          :disabled="disabled || inTransit" 
                          @update:modelValue="this.username = $event" 
                          />
                        <!-- password -->
                        <AuthTextField 
                          class="mt-4 mb-4"
                          :label="this.$t('password')" 
                          :placeholder="this.$t('password')" 
                          :theme="theme" 
                          :modelValue="this.password" 
                          @update:modelValue="this.password = $event" 
                          :type="'password'" 
                          :disabled="disabled || inTransit" />
                        <v-row class="mb-4">
                          <v-col cols="6">
                            <!-- submit button -->
                            <AuthButton
                              :label="this.$t('submit')"
                              :theme="theme"
                              @clicked="login()"
                              :disabled="disabled || inTransit" />
                          </v-col>
                          <v-col cols="6">
                            <!-- google button -->
                            <GoogleAuthButton 
                              :theme="theme" :disabled="disabled || inTransit" />
                          </v-col>
                        </v-row>
                        <AuthPanelLink :to="'/pw_reset'" :message="this.$t('accountRecoveryHere')" :theme="theme" />
                        <AuthPanelLink :to="'/register'" :message="this.$t('registerHere')" :theme="theme" />
                        <AuthServerResponse :serverMessage="serverMessage" :theme="theme" />
                        <div class="footer-view mt-4 mb-4">
                          <AuthPanelLink :to="'/privacy'" :message="this.$t('privacyPolicy')" :theme="theme" />
                        </div>
                      </v-col>
                    </v-row>  
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthTextField from '@/components/auth/AuthTextField.vue';
import AuthButton from '@/components/auth/AuthButton.vue'
import GoogleAuthButton from '@/components/prelogin/GoogleAuthButton.vue';
import AuthPanelLink from '@/components/auth/AuthPanelLink.vue';
import AuthServerResponse from '@/components/auth/AuthServerResponse.vue';

export default {
  name: "AuthPanel",
  components: {
    AuthTextField,
    AuthButton,
    GoogleAuthButton,
    AuthPanelLink,
    AuthServerResponse,
  },
  props: [ "disabled", "theme" ],
  mounted() {
    if (this.$route.query.error) {
      this.serverMessage = this.$t('unableToCompleteYourRequest');
    }
  },
  data() {
    return {
      step: null,
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
.footer-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  justify-content: center;
  gap: .75rem;
  padding: 1.25rem;
}
</style>