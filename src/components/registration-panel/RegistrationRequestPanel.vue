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
                    <h4 class="text-center mt-4 mb-4">{{ this.$t('accountRegistration') }}</h4>
                    <!-- row -->
                    <v-row align="center" justify="center">
                      <!-- col -->
                      <v-col cols="12" sm="8" v-auto-animate>
                        <!-- email address -->
                        <AuthTextField 
                          class="mt-4 mb-4"
                          :label="this.$t('emailAddress')" 
                          :placeholder="this.$t('emailAddress')" 
                          :theme="theme" 
                          :modelValue="this.email" 
                          :disabled="disabled || inTransit" 
                          @update:modelValue="this.email = $event" 
                          />
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
                          :disabled="disabled || inTransit" 
                          @update:modelValue="this.password = $event" 
                          />
                        <v-row class="mb-4">
                          <v-col cols="12">
                            <!-- submit button -->
                            <AuthButton
                              :label="this.$t('submit')"
                              :theme="theme"
                              @clicked="submitRegistration()"
                              :disabled="disabled || inTransit" />
                          </v-col>
                        </v-row>
                        <AuthPanelLink :to="'/app'" :message="this.$t('alreadyHaveAnAccount')" :theme="theme" />
                        <AuthPanelLink :to="'/pw_reset'" :message="this.$t('accountRecoveryHere')" :theme="theme" />
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
      username: null,
      email: null,
      password: null,
      userType: null,
      // server response 
      serverMessage: null,
      // 
      inTransit: false,
    }
  },
  methods: {
    //
    // 
    //
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
.footer-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  justify-content: center;
  gap: .75rem;
  padding: 1.25rem;
}
</style>