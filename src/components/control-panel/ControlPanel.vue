<template>
  <v-toolbar-items class="flex-row-reverse flex-wrap">
    <!-- logout button, don't disable -->
    <LogoutButton v-if="$auth.$isAuthenticated" />
    <!-- settings button -->
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
  },
  emits: [
    "updateServerMessage",
    "showSettings",
    "showHelp",
  ],
  data() {
    return {};
  },
  methods: {
    setLastServerMessage(message) {
      if (message) {
        this.$emit("updateServerMessage", message);
      }
    },
  },
};
</script>
