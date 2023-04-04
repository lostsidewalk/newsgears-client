<template>
  <div v-auto-animate>
    <div class="control-panel-wrapper">
      <FeedGearsLogo :theme="theme" />
      <div class="control-panel-buttons">
        <!-- logout button, don't disable -->
        <LogoutButton v-if="this.$auth.$isAuthenticated" :disabled="false" :theme="theme" />
        <!-- settings button -->
        <SettingsButton v-if="this.$auth.$isAuthenticated" @showSettings="this.showSettingsPanel = !this.showSettingsPanel" :disabled="disabled" :theme="theme" />
        <!-- display mode switch, don't disable -->
        <DisplayModeButton :baseUrl="baseUrl" :disabled="false" :theme="theme" />
      </div>
    </div>
    <SettingsPanel v-if="this.showSettingsPanel && this.$auth.$isAuthenticated" 
      :theme="theme" 
      :disabled="disabled" 
      :baseUrl="baseUrl" 
      @updateServerMessage="setLastServerMessage" />
  </div>
</template>

<script>
import FeedGearsLogo from '@/components/nav/FeedGearsLogo.vue';
import SettingsPanel from '@/components/settings/SettingsPanel.vue';
import LogoutButton from '@/components/nav/LogoutButton.vue';
import SettingsButton from '@/components/nav/SettingsButton.vue';
import DisplayModeButton from '@/components/nav/DisplayModeButton.vue';

export default {
    name: "ControlPanel",
    components: {
      FeedGearsLogo,
      SettingsPanel,
      LogoutButton,
      SettingsButton, 
      DisplayModeButton, 
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
      },
    },
    data() {
      return {
        showSettingsPanel: false,
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
