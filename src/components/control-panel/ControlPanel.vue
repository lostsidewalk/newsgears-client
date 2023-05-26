<template>
  <v-toolbar-items
    class="flex-row-reverse flex-wrap"
    style="justify-content: space-around;align-content: space-around;"
  >
    <!-- logout button, don't disable -->
    <LogoutButton v-if="$auth.$isAuthenticated" />
    <!-- settings button -->
    <v-badge
      v-if="$auth.$isAuthenticated && showNotificationWarning"
      dot
      location="top right"
      color="red"
    >
      <SettingsButton
        :expanded="showSettingsPanel"
        :title="$t('pleaseEnableNotifications')"
        @showSettings="$emit('showSettings')"
      />
    </v-badge>
    <SettingsButton
      v-else-if="$auth.$isAuthenticated"
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
    <slot name="additional" />
  </v-toolbar-items>
</template>

<script>
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
import LogoutButton from "@/components/control-panel/LogoutButton.vue";
import SettingsButton from "@/components/control-panel/SettingsButton.vue";
import HelpButton from "@/components/control-panel/HelpButton.vue";

export default {
  name: "ControlPanel",
  components: {
    LogoutButton,
    SettingsButton,
    DisplayModeButton,
    HelpButton,
  },
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
