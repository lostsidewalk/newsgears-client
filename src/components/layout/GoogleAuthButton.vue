<template>
  <v-btn
    elevation="1" 
    class="login-with-google-btn flex-grow-1"
    variant="outlined" 
    prepend-icon="fa-google"
    @click="googleOauth2()"
  >
    <span style="white-space: normal;letter-spacing: normal;text-transform: none;">
      {{ $t('signinWithGoogle') }}
    </span>
    <v-tooltip
      location="end"
      activator="parent"
      open-delay="2000"
      :aria-label="$t('signinWithGoogle')"
    >
      {{ $t('signinWithGoogle') }}
    </v-tooltip>
  </v-btn>
</template>

<script>
export default {
  name: "GoogleAuthButton",
  methods: {
    googleOauth2() {
      window.location=process.env.VUE_APP_FEEDGEARS_API_URL + '/oauth2/authorize/google?redirect_uri=' + process.env.VUE_APP_FEEDGEARS_ORIGIN_URL + '/app';
    },
  }
}
</script>

<style scoped>
.login-with-google-btn {
  min-height: 3rem;
  font-weight: bold;
}
</style>