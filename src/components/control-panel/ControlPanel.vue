<template>
  <v-toolbar>
    <v-toolbar-items
      class="overflow-auto flex-row-reverse"
      style="justify-content: space-around;align-content: space-around;"
    >
      <!-- logout button -->
      <LogoutButton
        v-if="isAuthenticated"
        @logout="$emit('logout')"
      />
      <!-- notifications warning -->
      <v-btn
        v-if="isAuthenticated"
        v-show="showNotificationWarning"
        :title="$t('pleaseEnableNotifications')"
        icon="fa-bell"
        :size="buttonSize"
      />
      <!-- settings button -->
      <SettingsButton
        v-if="isAuthenticated"
        @showSettings="$emit('showSettings')"
      />
      <!-- help button -->
      <HelpButton
        @showHelp="$emit('showHelp')"
      />
      <!-- display mode switch -->
      <DisplayModeButton />
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import DisplayModeButton from "@/components/generic/DisplayModeButton.vue";
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
    isAuthenticated: { type: Boolean, default: false },
  },
  emits: [
    "logout", 
    "showSettings",
    "showHelp",
  ]
};
</script>
