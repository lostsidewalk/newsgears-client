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
            variant="flat"
          >
            <!-- window -->
            <v-window>
              <!-- window item -->
              <v-window-item>
                <!-- row -->
                <v-row>
                  <!-- col -->
                  <v-col cols="12">
                    <!-- card-text -->
                    <v-card-text class="mt-12 mb-12">
                      <!-- banner (large) -->
                      <div class="text-h5 text-center mt-4 mb-4 logotext">
                        {{ $t("accountRecovery") }}
                      </div>
                      <!-- banner (small) -->
                      <div class="text-center mb-4">
                        {{ $t('pwResetRequestMessage') }}
                      </div>
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
                              :is-loading="isLoading"
                              @clicked="$emit('submitPwReset', { email: email, username: username })"
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
                            :size="buttonSize"
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
import buttonSizeMixin from '@/mixins/buttonSizeMixin';


export default {
  components: {
    AuthTextField,
    AuthButton,
    AuthPanelLink,
    AuthServerResponse,
    PrivacyPolicyPanel,
  },
  mixins: [buttonSizeMixin],
  props: {
    serverMessage: { type: String, default: null },
    isLoading: { type: Boolean, default: false },
  },
  emits: ["submitPwReset"],
  data() {
    return {
      username: '',
      email: '',
      showPrivacyPolicy: false,
    }
  },
}
</script>

<style scoped>
.logotext {
  font-family: 'Russo One' !important;
}
</style>
