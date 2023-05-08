<template>
  <v-container>
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
                    <h4 class="text-center mt-4 mb-4">{{ this.$t('passwordReset') }}</h4>
                    <!-- banner (small) -->
                    <h6 class="text-center mt-4-mb-4">{{ this.$t('enterAndConfirmNewPw') }}</h6>
                    <!-- row -->
                    <v-row align="center" justify="center">
                      <!-- col -->
                      <v-col cols="12" sm="8" v-auto-animate>
                        <!-- new password -->
                        <AuthTextField 
                          class="mt-4 mb-4"
                          type="password"
                          :label="this.$t('newPassword')" 
                          :placeholder="this.$t('newPassword')" 
                          :theme="theme" 
                          :modelValue="this.newPassword" 
                          :disabled="disabled || inTransit" 
                          @update:modelValue="this.newPassword = $event" 
                          />
                          <!-- new password (confirm) -->
                        <AuthTextField 
                          class="mt-4 mb-4"
                          type="password"
                          :label="this.$t('confirmNewPassword')" 
                          :placeholder="this.$t('confirmNewPassword')" 
                          :theme="theme" 
                          :modelValue="this.newPasswordConfirmed" 
                          :disabled="disabled || inTransit" 
                          @update:modelValue="this.newPasswordConfirmed = $event" 
                          />
                        <v-row class="mb-4">
                          <v-col cols="12">
                            <!-- submit button -->
                            <AuthButton
                              :label="this.$t('submit')"
                              :theme="theme"
                              @clicked="submitPwUpdate()"
                              :disabled="disabled || inTransit" />
                          </v-col>
                        </v-row>
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
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthTextField from '@/components/auth/AuthTextField.vue';
import AuthPanelLink from '@/components/auth/AuthPanelLink.vue';
import AuthServerResponse from '@/components/auth/AuthServerResponse.vue';

export default {
  components: {
    AuthTextField,
    AuthButton,
    AuthPanelLink,
    AuthServerResponse, 
},
  props: [ "disabled", "theme" ],
  data() {
    return {
      step: null,
      // new password/new password confirmed 
      newPassword: null,
      newPasswordConfirmed: null,
      // server response/initiating action 
      serverMessage: null,
      // 
      inTransit: false,
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

      this.inTransit = true;
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
            this.inTransit = false;
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

<style scoped>
.footer-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  justify-content: center;
  gap: .75rem;
  padding: 1.25rem;
}
</style>