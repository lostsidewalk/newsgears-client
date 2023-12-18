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
            variant="outlined"
          >
            <!-- row -->
            <v-row>
              <!-- col -->
              <v-col cols="12">
                <!-- card-text -->
                <v-card-text :class="my12r">
                  <!-- banner (large) -->
                  <div
                    class="text-h5 text-center logotext"
                    :class="my4r"
                  >
                    {{ $t("accountRegistration") }}
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
                      <!-- email address -->
                      <v-text-field
                        v-model="email"
                        :class="my4r"
                        :label="$t('emailAddress')"
                        :placeholder="$t('emailAddress')"
                        outlined
                        dense
                        variant="solo-filled"
                        autocomplete="false"
                        :aria-label="$t('emailAddress')"
                      />
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
                        type="password"
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
                          :label="$t('submit')"
                          :is-loading="isLoading"
                          @clicked="submitRegistration"
                        />
                      </div>
                      <PanelLink
                        :to="'/login'"
                        :message="$t('alreadyHaveAnAccount')"
                      />
                      <PanelLink
                        :to="'/pw_reset'"
                        :message="$t('accountRecoveryHere')"
                      />
                      <ServerResponse :server-message="serverMessage" />
                      <v-btn
                        :size="buttonSize"
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
import { ref } from "vue";

import PanelButton from "@/components/generic/PanelButton.vue";
import PanelLink from "@/components/generic/PanelLink.vue";
import ServerResponse from "@/components/generic/ServerResponse.vue";
import PrivacyPolicyPanel from "@/components/privacy-policy-panel/PrivacyPolicyPanel.vue";
import buttonSizeMixin from "@/mixins/buttonSizeMixin";
import spacingMixin from "@/mixins/spacingMixin";

export default {
  name: "RegistrationRequest",
  components: {
    PanelButton,
    PanelLink,
    ServerResponse,
    PrivacyPolicyPanel,
  },
  mixins: [buttonSizeMixin, spacingMixin],
  props: {
    serverMessage: { type: String, default: null },
    isLoading: { type: Boolean, default: false },
  },
  emits: ["submitRegistration"],
  setup(props, { emit }) {
    const username = ref(null);
    const email = ref(null);
    const password = ref(null);
    const userType = ref(null);
    const showPrivacyPolicy = ref(false);

    function submitRegistration() {
      emit('submitRegistration', {
        username: username.value,
        email: email.value,
        password: password.value,
        userType: userType.value,
      });
    }

    return {
      username,
      email,
      password,
      userType,
      showPrivacyPolicy,
      // 
      submitRegistration,
    };
  },
};
</script>

<style scoped>
.logotext {
  font-family: "Russo One" !important;
}
</style>
