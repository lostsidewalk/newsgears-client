<template>
  <div style="display: flex;flex-wrap: wrap;justify-content: space-between;">
    <!-- 
    <div id="newsgears-logo" class="fixed-header-item left-header">
      <img src="newsgears-logo.png" alt="NewsGears Logo"/>
    </div>
    <div class="fixed-header-item right-header">
      <router-link to="/app" class="link ph3 pv2 dib bg-transparent no-pill">
        LOGIN
      </router-link>
    </div>
    <div class="fixed-header-item right-header">
      <a class="link ph3 pv2 dib bg-transparent no-pill" href="#0">DOCUMENTATION</a>
    </div>
    <div class="fixed-header-item right-header">
      <a class="link ph3 pv2 dib bg-transparent no-pill" href="#0">RSS/ATOM FEED DISCOVERY</a>
    </div>
    <div class="fixed-header-item right-header">
      <a class="link ph3 pv2 dib bg-transparent no-pill" href="#0">NEWS DISCOVERY</a>
    </div>
    <div class="fixed-header-item right-header">
      <a class="link ph3 pv2 dib bg-transparent no-pill" href="#0">PRICING</a>
    </div>
    -->

    <!-- dashboard button -->
    <FeedGearsLogo :theme="theme" />
    <div style="display: flex;flex-direction: row-reverse;">
      <!-- login button -->
      <LoginButton :disabled="false" :theme="theme" />
      <!-- sign-up button -->
      <SignUpButton :disabled="false" :theme="theme" style="float: right;"/>
      <!-- display mode switch -->
      <DisplayModeButton :disabled="false" :theme="theme" />
      </div>
  </div>
</template>>

<script>
import FeedGearsLogo from '@/components/nav/FeedGearsLogo.vue';
import LoginButton from '@/components/nav/LoginButton.vue';
import SignUpButton from '@/components/nav/SignUpButton.vue';
import DisplayModeButton from '@/components/nav/DisplayModeButton.vue';

export default {
    name: "NavbarButtons",
    components: {
      FeedGearsLogo,
      LoginButton, 
      SignUpButton, 
      DisplayModeButton, 
    },
    props: [ "theme" ],
}
</script>

<style scoped>
* {
  user-select: none;
}
</style>
