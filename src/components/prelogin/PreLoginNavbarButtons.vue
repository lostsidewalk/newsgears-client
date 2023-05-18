<template>
  <v-toolbar-items>
    <!-- display mode switch -->
    <DisplayModeButton />
    <!-- login button -->
    <LoginButton :theme="theme" />
  </v-toolbar-items>
</template>

<script>
import LoginButton from '@/components/prelogin/LoginButton.vue';
import DisplayModeButton from '@/components/layout/DisplayModeButton.vue';

export default {
    name: "PreLoginNavbarButtons",
    components: {
      LoginButton, 
      DisplayModeButton, 
    },
    props: [ "baseUrl", "theme" ],
}
</script>
