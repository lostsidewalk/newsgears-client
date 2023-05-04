<template>
  <div>
    <div class="control-panel-wrapper">
      <FeedGearsLogo :theme="theme" />
      <div class="control-panel-buttons">
        <!-- logout button, don't disable -->
        <LogoutButton v-if="this.$auth.$isAuthenticated" :disabled="false" :theme="theme" />
        <!-- settings button -->
        <SettingsButton v-if="this.$auth.$isAuthenticated" 
          :disabled="disabled" 
          :theme="theme" 
          :expanded="this.showSettingsPanel" 
          @showSettings="this.showSettingsPanel = !this.showSettingsPanel" />
        <!-- help button, don't disable -->
        <HelpButton
          :theme="theme" 
          :disabled="false"
          :expanded="this.showHelpPanel"
          @showHelp="this.showHelpPanel = !this.showHelpPanel" />
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
      <SettingsPanel v-if="this.showSettingsPanel && this.$auth.$isAuthenticated" 
        :theme="theme" 
        :disabled="disabled" 
        :baseUrl="baseUrl" 
        @updateServerMessage="setLastServerMessage" />
      <HelpPanel v-if="this.showHelpPanel && this.$auth.$isAuthenticated" 
        :theme="theme" />
    </div>
  </div>
</template>

<script>
import FeedGearsLogo from '@/components/layout/FeedGearsLogo.vue';
import DisplayModeButton from '@/components/layout/DisplayModeButton.vue';
import SettingsPanel from '@/components/settings/SettingsPanel.vue';
import HelpPanel from '@/components/help-panel/HelpPanel.vue';
import LogoutButton from '@/components/control-panel/LogoutButton.vue';
import SettingsButton from '@/components/control-panel/SettingsButton.vue';
import TableLayoutButton from '@/components/control-panel/TableLayoutButton.vue';
import GridLayoutButton from '@/components/control-panel/GridLayoutButton.vue';
import ToggleDistractionsButton from '@/components/control-panel/ToggleDistractionsButton.vue';
import HelpButton from '@/components/control-panel/HelpButton.vue';

export default {
    name: "ControlPanel",
    components: {
      FeedGearsLogo,
      SettingsPanel,
      HelpPanel, 
      LogoutButton,
      SettingsButton,
      DisplayModeButton,
      TableLayoutButton,
      GridLayoutButton,
      ToggleDistractionsButton,
      HelpButton, 
    },
    props: [ "baseUrl", "disabled", "theme" ],
    emits: [ "updateServerMessage", "toggleDistractions" ],
    methods: {
      setLastServerMessage(message) {
        if (message) {
          this.$emit("updateServerMessage", message);
        }
      },
      // 
      cancelSettings() {
        this.showSettingsPanel = false;
        this.showHelpPanel = false;
      },
    },
    data() {
      return {
        showSettingsPanel: false,
        showHelpPanel: false,
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
  justify-content: space-between;
  align-items: center;
}

.control-panel-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
