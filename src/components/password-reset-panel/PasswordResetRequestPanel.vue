<template>
  <v-container>
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
            class="mt-10 mb-10"
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
                        {{ $t('accountRecovery') }}
                      </h4>
                      <!-- banner (small) -->
                      <h6 class="text-center mt-4-mb-4">
                        {{ $t('pwResetRequestMessage') }}
                      </h6>
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
                          <!-- email address -->
                          <AuthTextField
                            class="mt-4 mb-4"
                            :label="$t('emailAddress')" 
                            :placeholder="$t('emailAddress')" 
                            :model-value="email" 
                            @update:modelValue="email = $event"
                          />
                          <div class="d-flex flex-row flex-wrap">
                            <!-- submit button -->
                            <AuthButton
                              class="ma-4"
                              :label="$t('submit')"
                              :in-transit="pwResetIsLoading"
                              @clicked="submitPwReset()"
                            />
                          </div>
                          <AuthPanelLink
                            :to="'/app'"
                            :message="$t('alreadyHaveAnAccount')"
                          />
                          <AuthPanelLink
                            :to="'/register'"
                            :message="$t('registerHere')"
                          />
                          <AuthServerResponse
                            :server-message="serverMessage"
                          />
                          <v-btn
                            density="comfortable"
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
                            <PrivacyPolicyPanel @dismiss="showPrivacyPolicy = false" />
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
import AuthPanelLink from '@/components/auth/AuthPanelLink.vue';
import AuthServerResponse from '@/components/auth/AuthServerResponse.vue';
import PrivacyPolicyPanel from '@/components/privacy-policy-panel/PrivacyPolicyPanel.vue';


export default {
  components: {
    AuthTextField,
    AuthButton,
    AuthPanelLink,
    AuthServerResponse,
    PrivacyPolicyPanel,
  },
  data() {
    return {
      step: null,
      // username/email address 
      username: '',
      email: '',
      showPrivacyPolicy: false,
      // server response
      serverMessage: null,
      // 
      pwResetIsLoading: false,
    }
  },
  methods: {
    //
    // 
    //
    submitPwReset() {
      this.clearServerResponse();
      if (!this.username || !this.email) {
        this.serverMessage = this.$t('pwResetRequestMessage');
        return;
      }

      this.pwResetIsLoading = true;
      this.$auth
          .pwResetWithSupplied(this.username, this.email)
          .then(() => {
            this.clearData();
            this.serverMessage = this.$t('checkEmailForFurther');
          })
          .catch((error) => {
            this.serverMessage = error;
          })
          .finally(() => {
            this.pwResetIsLoading = false;
          });
    },
    //
    //
    //
    clearData() {
      // reset all fields 
      this.username = '';
      this.email = '';
      this.clearServerResponse();
    },
    clearServerResponse() {
      this.serverMessage = null;
    }
  }
}
</script>
