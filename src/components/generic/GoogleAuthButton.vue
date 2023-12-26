<template>
  <v-btn
    elevation="1"
    class="login-with-google-btn flex-grow-1"
    variant="outlined"
    prepend-icon="fa-google"
    @click="googleOauth2"
  >
    <span
      style="white-space: normal; letter-spacing: normal; text-transform: none"
    >
      {{ $t("signinWithGoogle") }}
    </span>
    <v-tooltip
      location="end"
      activator="parent"
      open-delay="2000"
      :aria-label="$t('signinWithGoogle')"
    >
      {{ $t("signinWithGoogle") }}
    </v-tooltip>
  </v-btn>
</template>

<script>
export default {
  name: "GoogleAuthButton",
  setup() {
    function googleOauth2() {
      // append '/api' to the base URL if the reverse proxy is enabled 
      let baseUrl = (process.env.VUE_APP_NEWSGEARS_REVERSE_PROXY === "true")
        ? process.env.process.env.VUE_APP_NEWSGEARS_API_URL + "/api"
        : process.env.process.env.VUE_APP_NEWSGEARS_API_URL;
      window.location =
        baseUrl +
        "/oauth2/authorize/google?redirect_uri=" +
        process.env.VUE_APP_NEWSGEARS_ORIGIN_URL +
        "/";
    }

    return {
      googleOauth2,
    };
  },
};
</script>

<style scoped>
.login-with-google-btn {
  min-height: 3rem;
  font-weight: bold;
}
</style>
