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
            :class="my10r"
            v-bind="props"
            variant="flat"
          >
            <!-- row -->
            <v-row>
              <!-- col -->
              <v-col cols="12">
                <!-- card-text -->
                <v-card-text :class="my12r">
                  <!-- banner (large) -->
                  <div
                    class="text-h5 text-centerlogotext"
                    :class="my4r"
                  >
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
                      <v-text-field
                        v-model="username"
                        :class="my4r"
                        :label="$t('username')"
                        :placeholder="$t('username')"
                        outlined
                        dense
                        variant="solo-filled"
                        autocomplete="false"
                        :aria-label="$t('username')"
                      />
                      <!-- password -->
                      <v-text-field
                        v-model="password"
                        :class="my4r"
                        :label="$t('password')"
                        :placeholder="$t('password')"
                        outlined
                        dense
                        variant="solo-filled"
                        autocomplete="false"
                        :aria-label="$t('password')"
                      />
                      <div class="d-flex flex-row flex-wrap">
                        <!-- submit button -->
                        <PanelButton
                          :class="ma4r"
                          :label="$t('login')"
                          :tooltip="$t('login')"
                          :is-loading="isLoading"
                          @clicked="$emit('login', { username, password })"
                        />
                        <!-- google button -->
                        <GoogleAuthButton
                          :class="ma4r"
                          :tooltip="$t('login')"
                        />
                      </div>
                      <PanelLink
                        :to="'/pw_reset'"
                        :message="$t('accountRecoveryHere')"
                      />
                      <PanelLink
                        :to="'/register'"
                        :message="$t('registerHere')"
                      />
                      <ServerResponse :server-message="serverMessage" />
                      <v-btn
                        variant="text"
                        class="pa-2"
                        :class="my4r"
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
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';

import PanelButton from "@/components/generic/PanelButton.vue";
import PanelLink from "@/components/generic/PanelLink.vue";
import ServerResponse from "@/components/generic/ServerResponse.vue";
import GoogleAuthButton from "@/components/generic/GoogleAuthButton.vue";
import PrivacyPolicyPanel from "@/components/privacy-policy-panel/PrivacyPolicyPanel.vue";
import spacingMixin from "@/mixins/spacingMixin";

export default {
  name: "AuthPanel",
  components: {
    PanelButton,
    PanelLink,
    ServerResponse,
    GoogleAuthButton,
    PrivacyPolicyPanel,
  },
  mixins: [spacingMixin],
  props: {
    serverMessage: { type: String, default: null },
    isLoading: { type: Boolean, default: false },
  },
  emits: ["login"],
  setup() {
    const username = ref(null);
    const password = ref(null);
    const step = ref(null);
    const showPrivacyPolicy = ref(false);

    return {
      username,
      password,
      step,
      showPrivacyPolicy,
    }
  },
};
</script>

<style scoped>
.logotext {
  font-family: "Russo One" !important;
}
</style>
