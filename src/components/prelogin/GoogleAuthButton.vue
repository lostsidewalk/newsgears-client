<template>
  <v-btn @click="googleOauth2()" 
    elevation="1"
    class="login-with-google-btn flex-grow-1" 
    variant="outlined"
    prepend-icon="fa-google">
    <span style="white-space: normal;letter-spacing: normal;text-transform: none;">
      {{ this.$t('signinWithGoogle') }}
    </span>
  </v-btn>
</template>

<script>
export default {
  name: "GoogleAuthButton",
  props: [ "theme" ],
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