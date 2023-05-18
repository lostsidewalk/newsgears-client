<template>
  <v-container>
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
                      <h4 class="text-center mt-4 mb-4">{{ this.$t('accountRecovery') }}</h4>
                      <!-- banner (small) -->
                      <h6 class="text-center mt-4-mb-4">{{ this.$t('pwResetRequestMessage') }}</h6>
                      <!-- row -->
                      <v-row align="center" justify="center">
                        <!-- col -->
                        <v-col cols="12" sm="8">
                          <!-- username -->
                          <AuthTextField class="mt-4 mb-4"
                            :label="this.$t('username')" 
                            :placeholder="this.$t('username')" 
                            :theme="theme" 
                            :modelValue="this.username" 
                            @update:modelValue="this.username = $event" />
                          <!-- email address -->
                          <AuthTextField class="mt-4 mb-4"
                            :label="this.$t('emailAddress')" 
                            :placeholder="this.$t('emailAddress')" 
                            :theme="theme" 
                            :modelValue="this.email" 
                            @update:modelValue="this.email = $event" />
                          <div class="d-flex flex-row flex-wrap">
                            <!-- submit button -->
                            <AuthButton class="ma-4"
                              :label="this.$t('submit')"
                              :theme="theme"
                              @clicked="submitPwReset()"
                              :inTransit="pwResetInTransit" />
                          </div>
                          <AuthPanelLink :to="'/app'" :message="this.$t('alreadyHaveAnAccount')" :theme="theme" />
                          <AuthPanelLink :to="'/register'" :message="this.$t('registerHere')" :theme="theme" />
                          <AuthServerResponse :serverMessage="serverMessage" :theme="theme" />
                          <v-btn variant="text" class="mt-4 mb-4 pa-2" block 
                            @click="this.showPrivacyPolicy = !this.showPrivacyPolicy" 
                            :text="this.$t('privacyPolicy')" />
                          <v-dialog v-model="this.showPrivacyPolicy" width="75%" height="75%" scrollable>
                            <PrivacyPolicyPanel @dismiss="this.showPrivacyPolicy = false" />
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
  props: [ "theme" ],
  data() {
    return {
      step: null,
      // username/email address 
      username: null,
      email: null,
      showPrivacyPolicy: false,
      // server response
      serverMessage: null,
      // 
      pwResetInTransit: false,
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

      this.pwResetInTransit = true;
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
            this.pwResetInTransit = false;
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
      this.serverMessage = null;
    }
  }
}
</script>
