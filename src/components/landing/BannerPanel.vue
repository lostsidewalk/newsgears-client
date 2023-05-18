<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="center">
        <h1 class="logotext">FeedGears RSS</h1>
      </v-col>
      <v-col cols="12" align="center">
        <i class="fa fa-rss fa-5x"></i>
      </v-col>
      <v-col cols="12" align="center">
        <h2 class="logosubtext fancy">
          {{ this.$t('whatIsFeedGears') }}
        </h2>
      </v-col>
      <v-col cols="12" align="center">
        <h2 class="logosubduedtext fancy">
          {{ this.$t('whyIsFeedGearsFree') }} 
        </h2>
      </v-col>
    </v-row>

    <v-divider class="mt-8" />

    <v-row justify="center" v-if="!this.$auth.$isAuthenticated" class="mt-8">
      <v-col cols="12" sm="10">
        <SignUpButton :theme="theme" />
      </v-col>
    </v-row>
    <v-row justify="center" v-if="!this.$auth.$isAuthenticated">
      <v-col cols="12" sm="10">
        <GoogleAuthButton :theme="theme" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SignUpButton from '@/components/prelogin/SignUpButton.vue';
import GoogleAuthButton from '@/components/prelogin/GoogleAuthButton.vue';

export default {
  name: "BannerPanel",
  props: ["theme"],
  components: { 
    SignUpButton, 
    GoogleAuthButton,
  }
}
</script>

<style scoped>
.logotext {
  font-family: 'Russo One';
}

.logosubtext {
  font-size: 3.0rem;
}

.logosubduedtext {
  font-size: 2.0rem;
}

.fancy {
  font-family: 'Merriweather';
  font-weight: bold;
}
</style>
