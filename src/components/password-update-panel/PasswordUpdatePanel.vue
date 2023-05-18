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
                      <h4 class="text-center mt-4 mb-4">{{ this.$t('passwordReset') }}</h4>
                      <!-- banner (small) -->
                      <h6 class="text-center mt-4-mb-4">{{ this.$t('enterAndConfirmNewPw') }}</h6>
                      <!-- row -->
                      <v-row align="center" justify="center">
                        <!-- col -->
                        <v-col cols="12" sm="8">
                          <!-- new password -->
                          <AuthTextField class="mt-4 mb-4"
                            type="password"
                            :label="this.$t('newPassword')" 
                            :placeholder="this.$t('newPassword')" 
                            :theme="theme" 
                            :modelValue="this.newPassword" 
                            @update:modelValue="this.newPassword = $event" 
                            />
                          <!-- new password (confirm) -->
                          <AuthTextField class="mt-4 mb-4"
                            type="password"
                            :label="this.$t('confirmNewPassword')" 
                            :placeholder="this.$t('confirmNewPassword')" 
                            :theme="theme" 
                            :modelValue="this.newPasswordConfirmed" 
                            @update:modelValue="this.newPasswordConfirmed = $event" 
                            />
                          <div class="d-flex flex-row flex-wrap">
                            <!-- submit button -->
                            <AuthButton
                              :label="this.$t('submit')"
                              :theme="theme"
                              @clicked="submitPwUpdate()"
                              :inTransit="pwUpdateInTransit" />
                          </div>
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
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthTextField from '@/components/auth/AuthTextField.vue';
import AuthServerResponse from '@/components/auth/AuthServerResponse.vue';
import PrivacyPolicyPanel from '@/components/privacy-policy-panel/PrivacyPolicyPanel.vue';


export default {
  components: {
    AuthTextField,
    AuthButton,
    AuthServerResponse, 
    PrivacyPolicyPanel, 
},
  props: [ "theme" ],
  data() {
    return {
      step: null,
      // new password/new password confirmed 
      newPassword: null,
      newPasswordConfirmed: null,
      showPrivacyPolicy: false,
      // server response/initiating action 
      serverMessage: null,
      // 
      pwUpdateInTransit: false,
    }
  },
  methods: {
    //
    // 
    //
    submitPwUpdate() {
      this.clearServerResponse();

      if (!this.newPassword || !this.newPasswordConfirmed) {
        return;
      }

      this.pwUpdateInTransit = true;
      this.$auth
          .pwUpdateWithSupplied(this.newPassword, this.newPasswordConfirmed)
          .then(() => {
            this.clearData();
            this.serverMessage = this.$t('pwUpdated');
          })
          .catch((error) => {
            this.serverMessage = error;
          })
          .finally(() => {
            this.pwUpdateInTransit = false;
          });
    },
    //
    //
    //
    clearData() {
      // reset all fields 
      this.newPassword = null;
      this.newPasswordConfirmed = null;
      this.clearServerResponse();
    },
    clearServerResponse() {
      this.serverMessage = null;
    }
  }
}
</script>
