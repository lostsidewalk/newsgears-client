<template>
  <div>
    <!-- dashboard button -->
    <DashboardButton :inTransit="inTransit" :theme="theme" />
    <!-- logout button -->
    <LogoutButton :inTransit="inTransit" :theme="theme" />
    <!-- manage subscription button -->
    <ManageSubscriptionButton v-if="this.$auth.$user.hasSubscription" :inTransit="inTransit" :disableSubscription="disableSubscription" :theme="theme" />
    <!-- upgrade button -->
    <UpgradeSubscriptionButton v-else :inTransit="inTransit" :disableSubscription="disableSubscription" :theme="theme" />
    <!-- settings button -->
    <SettingsButton :inTransit="inTransit" :disableSettings="disableSettings" :theme="theme" />
    <!-- display mode switch -->
    <DisplayModeButton :inTransit="inTransit" :theme="theme" />
  </div>
</template>>

<script>
import DashboardButton from '@/components/nav/DashboardButton.vue';
import LogoutButton from '@/components/nav/LogoutButton.vue';
import ManageSubscriptionButton from '@/components/nav/ManageSubscriptionButton.vue';
import UpgradeSubscriptionButton from '@/components/nav/UpgradeSubscriptionButton.vue';
import SettingsButton from '@/components/nav/SettingsButton.vue';
import DisplayModeButton from '@/components/nav/DisplayModeButton.vue';

export default {
    name: "NavbarButtons",
    components: {
      DashboardButton,
      LogoutButton,
      ManageSubscriptionButton,
      UpgradeSubscriptionButton,
      SettingsButton, 
      DisplayModeButton, 
    },
    props: ["inTransit", "disableSettings", "disableSubscription", "theme"],
}
</script>

<style scoped>
* {
  user-select: none;
}
</style>
