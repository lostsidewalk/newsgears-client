<template>
  <v-container v-show="!this.$auth.$isAuthenticated">
    <!-- row -->
    <v-row align="center" justify="center">
      <!-- col -->
      <v-col cols="12" sm="10">
        <v-hover v-slot="{ isHovering, props }">
          <!-- card -->
          <v-card :elevation="isHovering ? 7 : 6" class="mt-10" v-bind="props" variant="outlined">
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
                        <v-col cols="12" sm="8">
                          <!-- username -->
                          <AuthTextField 
                            class="mt-4 mb-4"
                            :label="this.$t('username')" 
                            :placeholder="this.$t('username')" 
                            :theme="theme" 
                            :modelValue="this.username" 
                            @update:modelValue="this.username = $event" 
                            />
                          <!-- password -->
                          <AuthTextField type="password"
                            class="mt-4 mb-4"
                            :label="this.$t('password')" 
                            :placeholder="this.$t('password')" 
                            :theme="theme" 
                            :modelValue="this.password" 
                            @update:modelValue="this.password = $event" />
                          <div class="d-flex flex-row flex-wrap">
                            <!-- submit button -->
                            <AuthButton 
                              class="ma-4"
                              :label="this.$t('submit')"
                              :theme="theme"
                              @clicked="login"
                              :inTransit="loginInTransit" />
                            <!-- google button -->
                            <GoogleAuthButton 
                              class="ma-4"
                              :theme="theme" />
                          </div>
                          <AuthPanelLink :to="'/pw_reset'" :message="this.$t('accountRecoveryHere')" :theme="theme" />
                          <AuthPanelLink :to="'/register'" :message="this.$t('registerHere')" :theme="theme" />
                          <AuthServerResponse :serverMessage="serverMessage" :theme="theme" />
                          <v-btn variant="text" class="mt-4 mb-4 pa-2" block 
                            @click="this.showPrivacyPolicy = !this.showPrivacyPolicy" 
                            :text="this.$t('privacyPolicy')" />
                          <v-dialog v-model="this.showPrivacyPolicy" fullscreen scrollable>
                            <PrivacyPolicyPanel :theme="theme" @dismiss="this.showPrivacyPolicy = false" />
                          </v-dialog>
                        </v-col>
                      </v-row>  
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card>
        </v-hover>
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
import PrivacyPolicyPanel from '@/components/privacy-policy-panel/PrivacyPolicyPanel.vue';


export default {
  name: "AuthPanel",
  components: {
    AuthTextField,
    AuthButton,
    GoogleAuthButton,
    AuthPanelLink,
    AuthServerResponse,
    PrivacyPolicyPanel,
  },
  props: [ "theme" ],
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
      showPrivacyPolicy: false,
      // server response
      serverMessage: null,
      // 
      loginInTransit: false,
    }
  },
  methods: {
    login() {
      if (!this.username && !this.password) {
        this.serverMessage = this.$t('usernameAndPasswordAreRequired');
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

      this.loginInTransit = true;
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
            this.loginInTransit = false;
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
