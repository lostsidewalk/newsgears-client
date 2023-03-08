<template>
  <div>
    <div>
      <!-- logout button -->
      <LogoutButton v-if="this.$auth.$isAuthenticated" :disabled="disabled" :theme="theme" />
      <!-- settings button -->
      <SettingsButton v-if="this.$auth.$isAuthenticated" @showSettings="this.showSettingsPanel = !this.showSettingsPanel" :disabled="disabled" :theme="theme" />
      <!-- display mode switch -->
      <DisplayModeButton :disabled="disabled" :theme="theme" />
    </div>
    <SettingsPanel v-if="this.showSettingsPanel && this.$auth.$isAuthenticated" 
      :theme="theme" 
      :disabled="disabled" 
      :baseUrl="baseUrl" 
      @updateServerMessage="setLastServerMessage" />
  </div>
</template>

<script>
import SettingsPanel from '@/components/settings/SettingsPanel.vue';
import LogoutButton from '@/components/nav/LogoutButton.vue';
import SettingsButton from '@/components/nav/SettingsButton.vue';
import DisplayModeButton from '@/components/nav/DisplayModeButton.vue';

export default {
    name: "ControlPanel",
    components: {
      SettingsPanel,
      LogoutButton,
      SettingsButton, 
      DisplayModeButton, 
    },
    props: [ "baseUrl", "disabled", "theme" ],
    emits: [ "updateServerMessage" ],
    methods: {
      setLastServerMessage(message) {
        this.$emit("updateServerMessage", message);
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
</style>
