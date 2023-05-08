<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10">
        <h1 class="logotext">FeedGears RSS</h1>
        <i class="logo fa fa-rss fa-5x"></i>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="10">
        <h2 class="logosubtext fancy">
          {{ this.$t('whatIsFeedGears') }}
        </h2>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="10">
        <h2 class="logosubduedtext fancy">
          {{ this.$t('whyIsFeedGearsFree') }} 
        </h2>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="10">
        <GoogleAuthButton :theme="theme" :disabled="false" />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="10">
        <SignUpButton :disabled="false" :theme="theme" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GoogleAuthButton from '@/components/prelogin/GoogleAuthButton.vue';
import SignUpButton from '@/components/prelogin/SignUpButton.vue';

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
.logotext {
  font-family: 'Russo One';
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 2px 0px 2px v-bind('theme.logocolor');
}

.logo {
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 3px 3px 3px v-bind('theme.logosubshadow');
}

.logosubtext {
  font-size: 3.0rem;
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 3px 3px 3px v-bind('theme.logosubshadow');
}

.logosubduedtext {
  font-size: 2.0rem;
  color: v-bind('theme.logosubtextcolor');
}

.fancy {
  font-family: 'Merriweather';
  font-weight: bold;
  text-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}
</style>
