<template>
  <v-toolbar-items class="flex-row-reverse">
    <!-- logout button, don't disable -->
    <LogoutButton
      v-if="$auth.$isAuthenticated"
      :theme="theme"
    />
    <!-- settings button -->
    <SettingsButton
      v-if="$auth.$isAuthenticated"
      :theme="theme"
      :expanded="showSettingsPanel"
      @showSettings="$emit('showSettings')"
    />
    <!-- help button, don't disable -->
    <HelpButton
      :expanded="showHelpPanel"
      :theme="theme"
      @showHelp="$emit('showHelp')"
    />
    <!-- display mode switch, don't disable -->
    <DisplayModeButton />
    <ToggleDistractionsButton
      :theme="theme"
      @toggleDistractions="$emit('toggleDistractions')"
    />
    <slot name="additional" />
  </v-toolbar-items>
</template>

<script>
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
import LogoutButton from "@/components/control-panel/LogoutButton.vue";
import SettingsButton from "@/components/control-panel/SettingsButton.vue";
import ToggleDistractionsButton from "@/components/control-panel/ToggleDistractionsButton.vue";
import HelpButton from "@/components/control-panel/HelpButton.vue";

export default {
  name: "ControlPanel",
  components: {
    LogoutButton,
    SettingsButton,
    DisplayModeButton,
    ToggleDistractionsButton,
    HelpButton,
  },
  props: {
    showSettingsPanel: { type: Boolean, default: false },
    showHelpPanel: { type: Boolean, default: false },
  },
  emits: [
    "updateServerMessage",
    "toggleDistractions",
    "showSettings",
    "showHelp",
    "cancelSettings",
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
