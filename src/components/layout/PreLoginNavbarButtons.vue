<template>
  <div style="display: flex;flex-wrap: wrap;justify-content: space-between;">
    <!-- dashboard button -->
    <FeedGearsLogo :theme="theme" />
    <div style="display: flex;flex-direction: row-reverse;">
      <!-- login button -->
      <LoginButton :disabled="false" :theme="theme" />
      <!-- sign-up button -->
      <SignUpButton :disabled="false" :theme="theme" style="float: right;"/>
      <!-- display mode switch -->
      <DisplayModeButton :baseUrl="baseUrl" :disabled="false" :theme="theme" />
      </div>
  </div>
</template>>

<script>
import FeedGearsLogo from '@/components/nav/FeedGearsLogo.vue';
import LoginButton from '@/components/nav/LoginButton.vue';
import SignUpButton from '@/components/nav/SignUpButton.vue';
import DisplayModeButton from '@/components/nav/DisplayModeButton.vue';

export default {
    name: "PreLoginNavbarButtons",
    components: {
      FeedGearsLogo,
      LoginButton, 
      SignUpButton, 
      DisplayModeButton, 
    },
    props: [ "baseUrl", "theme" ],
}
</script>

<style scoped>
* {
  user-select: none;
}
</style>
