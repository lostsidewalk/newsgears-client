<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        align="center"
      >
        <h1 class="logotext">
          FeedGears RSS
        </h1>
      </v-col>
      <v-col
        cols="12"
        align="center"
      >
        <i class="fa fa-rss fa-5x" />
      </v-col>
      <v-col
        cols="12"
        align="center"
      >
        <h2 class="logosubtext fancy">
          {{ $t('whatIsFeedGears') }}
        </h2>
      </v-col>
      <v-col
        cols="12"
        align="center"
      >
        <h2 class="logosubduedtext fancy">
          {{ $t('whyIsFeedGearsFree') }} 
        </h2>
      </v-col>
    </v-row>

    <v-divider
      v-if="!isAuthenticated && showAuth"
      class="mt-8"
    />

    <v-row
      v-if="!isAuthenticated && showAuth"
      justify="center"
      class="mt-8"
    >
      <v-col
        cols="12"
        sm="10"
      >
        <SignUpButton />
      </v-col>
    </v-row>
    <v-row
      v-if="!isAuthenticated && showAuth"
      justify="center"
    >
      <v-col
        cols="12"
        sm="10"
      >
        <GoogleAuthButton />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SignUpButton from '@/components/layout/SignUpButton.vue';
import GoogleAuthButton from '@/components/layout/GoogleAuthButton.vue';

export default {
  name: "BannerPanel",
  components: { 
    SignUpButton, 
    GoogleAuthButton,
  },
  props: {
    isAuthenticated: { type: Boolean, default: false },
    showAuth: { type: Boolean, default: true },
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
  font-family: 'Merriweather' !important;
  font-weight: bold;
}
</style>
