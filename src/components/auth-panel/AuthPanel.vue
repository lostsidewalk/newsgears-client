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
            <!-- row -->
            <v-row>
              <!-- col -->
              <v-col cols="12">
                <!-- card-text -->
                <v-card-text class="mt-12 mb-12">
                  <!-- banner (large) -->
                  <div class="text-h5 text-center mt-4 mb-4 logotext">
                    {{ $t("loginToNewsgears") }}
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
                          :is-loading="isLoading"
                          @clicked="$emit('login', { username: username, password: password })"
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
                      <AuthServerResponse :server-message="serverMessage" />
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
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthTextField from "@/components/auth/AuthTextField.vue";
import AuthButton from "@/components/auth/AuthButton.vue";
import GoogleAuthButton from "@/components/layout/GoogleAuthButton.vue";
import AuthPanelLink from "@/components/auth/AuthPanelLink.vue";
import AuthServerResponse from "@/components/auth/AuthServerResponse.vue";
import PrivacyPolicyPanel from "@/components/privacy-policy-panel/PrivacyPolicyPanel.vue";

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
  props: {
    serverMessage: { type: String, default: null },
    isLoading: { type: Boolean, default: false },
  },
  emits: ["login"],
  data() {
    return {
      step: null,
      username: "",
      password: "",
      showPrivacyPolicy: false,
    };
  },
};
</script>

<style scoped>
.logotext {
  font-family: "Russo One" !important;
}
</style>
