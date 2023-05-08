<template>
  <div class="control-panel-wrapper" v-auto-animate>
    <div class="control-panel-buttons">
      <!-- logout button, don't disable -->
      <LogoutButton v-if="this.$auth.$isAuthenticated" :disabled="false" :theme="theme" />
      <!-- settings button -->
      <SettingsButton v-if="this.$auth.$isAuthenticated" 
        :disabled="disabled" 
        :theme="theme" 
        :expanded="this.showSettingsPanel" 
        @showSettings="this.$emit('showSettings')" />
      <!-- help button, don't disable -->
      <HelpButton
        :theme="theme" 
        :disabled="false"
        :expanded="this.showHelpPanel"
        @showHelp="this.$emit('showHelp')" />
      <!-- display mode switch, don't disable -->
      <DisplayModeButton 
        :baseUrl="baseUrl" 
        :disabled="false" 
        :theme="theme" 
        @updateServerMessage="setLastServerMessage" />
      <TableLayoutButton
        :disabled="false"
        :theme="theme" />
      <GridLayoutButton
        :baseUrl="baseUrl"
        :disabled="false"
        :theme="theme"
        @updateServerMessage="setLastServerMessage" />
      <ToggleDistractionsButton 
        :disabled="false" 
        :theme="theme" 
        @toggleDistractions="this.$emit('toggleDistractions')" />
    </div>
  </div>
</template>

<script>
import DisplayModeButton from '@/components/layout/DisplayModeButton.vue';
import LogoutButton from '@/components/control-panel/LogoutButton.vue';
import SettingsButton from '@/components/control-panel/SettingsButton.vue';
import TableLayoutButton from '@/components/control-panel/TableLayoutButton.vue';
import GridLayoutButton from '@/components/control-panel/GridLayoutButton.vue';
import ToggleDistractionsButton from '@/components/control-panel/ToggleDistractionsButton.vue';
import HelpButton from '@/components/control-panel/HelpButton.vue';

export default {
    name: "ControlPanel",
    components: {
      LogoutButton,
      SettingsButton,
      DisplayModeButton,
      TableLayoutButton,
      GridLayoutButton,
      ToggleDistractionsButton,
      HelpButton, 
    },
    props: [ "showSettingsPanel", "showHelpPanel", "baseUrl", "disabled", "theme" ],
    emits: [ "updateServerMessage", "toggleDistractions", "showSettings", "showHelp", "cancelSettings" ],
    methods: {
      setLastServerMessage(message) {
        if (message) {
          this.$emit("updateServerMessage", message);
        }
      },
    },
    data() {
      return {
      }
    }
}
</script>

<style scoped>
* {
  user-select: none;
}

.control-panel-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1rem;
  flex: auto;
}

.control-panel-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1rem;
  flex: auto;
}
</style>
