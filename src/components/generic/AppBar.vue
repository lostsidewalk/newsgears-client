<template>
  <v-app-bar
    app
    :location="'top'"
    :scroll-behavior="'elevate'"
  >
    <template #title>
      <span class="newsgears-rss d-none d-sm-flex"> Newsgears RSS </span>
    </template>
    <template #prepend>
      <v-app-bar-nav-icon
        icon="fa-rss"
        :aria-label="$t('toggleDashboard')"
        :title="$t('toggleDashboard')"
        @click.stop="$emit('showQueueDashboard')"
      />
    </template>
    <template #append>
      <ControlPanel
        :base-url="baseUrl"
        :show-settings-panel="showSettingsPanel"
        :show-help-panel="showHelpPanel"
        :show-notification-warning="roShowNotificationWarning"
        :is-authenticated="isAuthenticated"
        @showSettings="$emit('openSettings')"
        @showHelp="$emit('showHelpPanel')"
        @logout="
          ($event) => {
            logout();
            disconnectBroker();
          }
        "
      />
    </template>
  </v-app-bar>
</template>

<script>
import ControlPanel from "@/components/control-panel/ControlPanel.vue";
import { useAuth } from "@/composable/useAuth";
import { useQueues } from "@/composable/useQueues";
import { useSettings } from "@/composable/useSettings";
import { useNotifications } from "@/composable/useNotifications";
import { inject } from "vue";

export default {
  name: "AppBar",
  components: {
    ControlPanel,
  },
  props: {
    baseUrl: { type: String, required: true },
    showHelpPanel: { type: Boolean, required: true },
  },
  emits: ["showQueueDashboard", "openSettings", "showHelpPanel"],
  setup(props) {
    const { logout } = useAuth();
    const { disconnectBroker } = useQueues(props);
    const { showSettingsPanel } = useSettings(props);
    const { roShowNotificationWarning } = useNotifications();
    const isAuthenticated = inject("isAuthenticated");

    return {
      logout,
      disconnectBroker,
      showSettingsPanel,
      roShowNotificationWarning,
      isAuthenticated,
    };
  },
};
</script>

<style scoped>
.newsgears-rss {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>
