<template>
  <div>
    <!-- dashboard button -->
    <DashboardButton :disabled="disabled || !this.$auth.$isAuthenticated" :theme="theme" />
    <!-- logout button -->
    <LogoutButton :disabled="disabled || !this.$auth.$isAuthenticated" :theme="theme" />
    <!-- manage subscription button -->
    <ManageSubscriptionButton v-if="!disableSubscriptions && this.$auth.$user.hasSubscription" :disabled="disabled || !this.$auth.$isAuthenticated" :theme="theme" />
    <!-- settings button -->
    <SettingsButton v-if="!disableSettings" :disabled="disabled || !this.$auth.$isAuthenticated" :theme="theme" />
    <!-- display mode switch -->
    <DisplayModeButton :disabled="disabled" :theme="theme" />
  </div>
</template>>

<script>
import DashboardButton from '@/components/nav/DashboardButton.vue';
import LogoutButton from '@/components/nav/LogoutButton.vue';
import ManageSubscriptionButton from '@/components/nav/ManageSubscriptionButton.vue';
import SettingsButton from '@/components/nav/SettingsButton.vue';
import DisplayModeButton from '@/components/nav/DisplayModeButton.vue';

export default {
    name: "NavbarButtons",
    components: {
      DashboardButton,
      LogoutButton,
      ManageSubscriptionButton,
      SettingsButton, 
      DisplayModeButton, 
    },
    props: [ "disabled", "theme", "disableSettings", "disableSubscriptions" ],
}
</script>

<style scoped>
* {
  user-select: none;
}
</style>
