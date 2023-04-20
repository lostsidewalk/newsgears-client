<template>
  <div v-auto-animate>
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
        <GridLayoutButton
          :baseUrl="baseUrl"
          :disabled="false"
          :theme="theme"
          @updateServerMessage="setLastServerMessage" />
      </div>
    </div>
    <SettingsPanel v-if="this.showSettingsPanel && this.$auth.$isAuthenticated" 
      :theme="theme" 
      :disabled="disabled" 
      :baseUrl="baseUrl" 
      @updateServerMessage="setLastServerMessage" />
    <HelpPanel v-if="this.showHelpPanel && this.$auth.$isAuthenticated" 
      :theme="theme" />
  </div>
</template>

<script>
import FeedGearsLogo from '@/components/nav/FeedGearsLogo.vue';
import SettingsPanel from '@/components/settings/SettingsPanel.vue';
import HelpPanel from '@/components/post/help/HelpPanel.vue';
import LogoutButton from '@/components/nav/LogoutButton.vue';
import SettingsButton from '@/components/nav/SettingsButton.vue';
import DisplayModeButton from '@/components/nav/DisplayModeButton.vue';
import GridLayoutButton from '@/components/nav/GridLayoutButton.vue';
import HelpButton from '@/components/nav/HelpButton.vue';

export default {
    name: "ControlPanel",
    components: {
      FeedGearsLogo,
      SettingsPanel,
      HelpPanel, 
      LogoutButton,
      SettingsButton,
      DisplayModeButton,
      GridLayoutButton,
      HelpButton, 
    },
    props: [ "baseUrl", "disabled", "theme" ],
    emits: [ "updateServerMessage" ],
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
