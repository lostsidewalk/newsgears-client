<template>
  <div>
    <div class="banner-view">
      <div class="logocontainer">
        <h1 class="logotext">FeedGears RSS</h1>
        <i class="logo fa fa-rss fa-5x"></i>
      </div>
      <h2 class="logosubtext fancy">
        {{ this.$t('whatIsFeedGears') }}
      </h2>
      <h2 class="logosubduedtext fancy">
        {{ this.$t('whyIsFeedGearsFree') }} <span class="fa fa-rss" />
      </h2>
      <div class="flex" style="padding-top: 2svh;padding-bottom: 2svh;">
        <GoogleAuthButton :theme="theme" :disabled="false" />
        <!-- sign-up button -->
        <SignUpButton :disabled="false" :theme="theme" />
      </div>
      <!-- TODO: add feed discovery button -->
    </div>
  </div>
</template>

<script>
import GoogleAuthButton from '../auth/GoogleAuthButton.vue';
import SignUpButton from '../nav/SignUpButton.vue';

export default {
  name: "BannerPanel",
  props: ["theme"],
  components: { 
    GoogleAuthButton,
    SignUpButton 
  }
}
</script>

<style scoped>

.banner-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  align-items: center;
  width: 100%;
}

.logocontainer {
  padding-top: 2svh;
  padding-bottom: 2svh;
}

.logotext {
  font-family: 'Russo One';
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 1px 0px 1px v-bind('theme.logocolor');
}

.logo {
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 3px 3px 3px v-bind('theme.logosubshadow');
}

.logosubtext {
  font-size: 3.0rem;
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 3px 3px 3px v-bind('theme.logosubshadow');
  padding-top: 2svh;
  padding-bottom: 2svh;
}

.logosubduedtext {
  font-size: 2.0rem;
  color: v-bind('theme.logosubtextcolor');
  padding-top: 1svh;
  padding-bottom: 1svh;
}

.fancy {
  font-family: 'Merriweather';
  font-weight: bold;
  text-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}
</style>
