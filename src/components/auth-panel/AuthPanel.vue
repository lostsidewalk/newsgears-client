<template>
  <v-container v-show="!$auth.$isAuthenticated">
    <!-- row -->
    <v-row
      align="center"
      justify="center"
    >
      <!-- col -->
      <v-col
        cols="12"
        sm="10"
      >
        <v-hover v-slot="{ isHovering, props }">
          <!-- card -->
          <v-card
            :elevation="isHovering ? 7 : 6"
            class="mt-10"
            v-bind="props"
            variant="outlined"
          >
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
                      <h4 class="text-center mt-4 mb-4">
                        {{ $t('loginToYourAccount') }}
                      </h4>
                      <!-- row -->
                      <v-row
                        align="center"
                        justify="center"
                      >
                        <!-- col -->
                        <v-col
                          cols="12"
                          sm="8"
                        >
                          <!-- username -->
                          <AuthTextField 
                            class="mt-4 mb-4"
                            :label="$t('username')" 
                            :placeholder="$t('username')" 
                            :model-value="username" 
                            @update:modelValue="username = $event" 
                          />
                          <!-- password -->
                          <AuthTextField
                            type="password"
                            class="mt-4 mb-4"
                            :label="$t('password')" 
                            :placeholder="$t('password')" 
                            :model-value="password" 
                            @update:modelValue="password = $event"
                          />
                          <div class="d-flex flex-row flex-wrap">
                            <!-- submit button -->
                            <AuthButton 
                              class="ma-4"
                              :label="$t('login')"
                              :tooltip="$t('login')"
                              :in-transit="loginInTransit"
                              @clicked="login"
                            />
                            <!-- google button -->
                            <GoogleAuthButton 
                              class="ma-4"
                              :tooltip="$t('login')"
                            />
                          </div>
                          <AuthPanelLink
                            :to="'/pw_reset'"
                            :message="$t('accountRecoveryHere')"
                          />
                          <AuthPanelLink
                            :to="'/register'"
                            :message="$t('registerHere')"
                          />
                          <AuthServerResponse
                            :server-message="serverMessage"
                          />
                          <v-btn
                            variant="text"
                            class="mt-4 mb-4 pa-2"
                            block 
                            :text="$t('privacyPolicy')" 
                            @click="showPrivacyPolicy = !showPrivacyPolicy"
                          />
                          <v-dialog
                            v-model="showPrivacyPolicy"
                            fullscreen
                            scrollable
                          >
                            <PrivacyPolicyPanel
                              @dismiss="showPrivacyPolicy = false"
                            />
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
  data() {
    return {
      step: null,
      username: '',
      password: '',
      showPrivacyPolicy: false,
      // server response
      serverMessage: null,
      // 
      loginInTransit: false,
    }
  },
  mounted() {
    if (this.$route.query.error) {
      this.serverMessage = this.$t('unableToCompleteYourRequest');
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
