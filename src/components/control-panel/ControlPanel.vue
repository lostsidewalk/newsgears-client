<template>
  <v-toolbar>
    <v-toolbar-items
      class="overflow-auto flex-row-reverse"
      style="justify-content: space-around;align-content: space-around;"
    >
      <!-- logout button, don't disable -->
      <LogoutButton v-if="$auth.$isAuthenticated" />
      <!-- settings button -->
      <v-btn
        v-if="$auth.$isAuthenticated"
        v-show="showNotificationWarning"
        :title="$t('pleaseEnableNotifications')"
        icon="fa-bell"
        :size="buttonSize"
        @showSettings="$emit('showSettings')"
      />
      <SettingsButton
        v-if="$auth.$isAuthenticated"
        :expanded="showSettingsPanel"
        @showSettings="$emit('showSettings')"
      />
      
      <!-- help button, don't disable -->
      <HelpButton
        :expanded="showHelpPanel"
        @showHelp="$emit('showHelp')"
      />
      <!-- display mode switch, don't disable -->
      <DisplayModeButton />
      <div class="d-none d-md-flex">
        <slot name="additional" />
      </div>
      <div
        v-if="$vuetify.display.xs || $vuetify.display.sm"
        class="d-flex"
      >
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              color="primary"
              v-bind="props"
            >
              ...
            </v-btn>
          </template>
          <v-list>
            <slot name="additional" />
          </v-list>
        </v-menu>
      </div>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
import LogoutButton from "@/components/control-panel/LogoutButton.vue";
import SettingsButton from "@/components/control-panel/SettingsButton.vue";
import HelpButton from "@/components/control-panel/HelpButton.vue";
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "ControlPanel",
  components: {
    LogoutButton,
    SettingsButton,
    DisplayModeButton,
    HelpButton,
  },
  mixins: [buttonSizeMixin],
  props: {
    showSettingsPanel: { type: Boolean, default: false },
    showHelpPanel: { type: Boolean, default: false },
    showNotificationWarning: { type: Boolean, defualt: false },
  },
  emits: [
    "showSettings",
    "showHelp",
  ],
  data() {
    return {};
  },
};
</script>
