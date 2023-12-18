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
                    class="text-h5 text-center logotext"
                    :class="my4r"
                  >
                    {{ $t("passwordReset") }}
                  </div>
                  <!-- banner (small) -->
                  <div
                    class="text-center"
                    :class="mb4r"
                  >
                    {{ $t("enterAndConfirmNewPw") }}
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
                      <!-- new password -->
                      <v-text-field
                        v-model="newPassword"
                        :class="my4r"
                        type="password"
                        :label="$t('newPassword')"
                        :placeholder="$t('newPassword')"
                        outlined
                        dense
                        variant="solo-filled"
                        autocomplete="false"
                        :aria-label="$t('newPassword')"
                      />
                      <!-- new password confirmed -->
                      <v-text-field
                        v-model="newPasswordConfirmed"
                        :class="my4r"
                        type="password"
                        :label="$t('confirmNewPassword')"
                        :placeholder="$t('confirmNewPassword')"
                        outlined
                        dense
                        variant="solo-filled"
                        autocomplete="false"
                        :aria-label="$t('confirmNewPassword')"
                      />
                      <div class="d-flex flex-row flex-wrap">
                        <!-- submit button -->
                        <PanelButton
                          :class="ma4r"
                          :label="$t('submit')"
                          :is-loading="isLoading"
                          @clicked="submitPwUpdate"
                        />
                      </div>
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
import ServerResponse from "@/components/generic/ServerResponse.vue";
import PrivacyPolicyPanel from "@/components/privacy-policy-panel/PrivacyPolicyPanel.vue";
import buttonSizeMixin from "@/mixins/buttonSizeMixin";
import spacingMixin from "@/mixins/spacingMixin";

export default {
  name: "PasswordUpdatePanel",
  components: {
    PanelButton,
    ServerResponse,
    PrivacyPolicyPanel,
  },
  mixins: [buttonSizeMixin, spacingMixin],
  props: {
    serverMessage: { type: String, default: null },
    isLoading: { type: Boolean, default: false },
  },
  emits: ["submitPwUpdate"],
  setup({ emit }) {
    const newPassword = ref(null);
    const newPasswordConfirmed = ref(null);
    const showPrivacyPolicy = ref(false);

    function submitPwUpdate() {
      emit('submitPwUpdate', {
        newPassword: this.newPassword,
        newPasswordConfirmed: this.newPasswordConfirmed,
      });
    }

    return {
      newPassword,
      newPasswordConfirmed,
      showPrivacyPolicy,
      submitPwUpdate,
    };
  },
};
</script>

<style scoped>
.logotext {
  font-family: "Russo One" !important;
}
</style>
