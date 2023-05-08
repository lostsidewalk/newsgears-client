<template>
  <div style="display: flex;flex-wrap: wrap;justify-content: flex-end;gap: 1rem;flex: auto;">
    <!-- display mode switch -->
    <DisplayModeButton :baseUrl="baseUrl" :disabled="false" :theme="theme" />
    <!-- sign-up button -->
    <SignUpButton :disabled="false" :theme="theme"/>
    <!-- login button -->
    <LoginButton :disabled="false" :theme="theme" />
  </div>
</template>

<script>
import LoginButton from '@/components/prelogin/LoginButton.vue';
import SignUpButton from '@/components/prelogin/SignUpButton.vue';
import DisplayModeButton from '@/components/layout/DisplayModeButton.vue';

export default {
    name: "PreLoginNavbarButtons",
    components: {
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
