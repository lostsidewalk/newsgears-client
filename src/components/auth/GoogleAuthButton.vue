<template>
  <button type="button" class="login-with-google-btn" @click="googleOauth2()" :disabled="disabled">
    Sign in with Google
  </button>
</template>

<script>
export default {
  name: "GoogleAuthButton",
  props: [ "theme", "disabled" ],
  methods: {
    googleOauth2() {
      window.location=process.env.VUE_APP_FEEDGEARS_API_URL + '/oauth2/authorize/google?redirect_uri=' + process.env.VUE_APP_FEEDGEARS_ORIGIN_URL + '/app';
    },
  }
}
</script>

<style scoped>
.login-with-google-btn {
  max-width: 256px;
  padding: .75rem 1rem .75rem 2.625rem;
  border-radius: 3px;
  border: 1px solid v-bind('theme.buttonborder');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  cursor: pointer;
  color: v-bind('theme.buttonfg');
  font-weight: bold;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",system-ui, sans-serif;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
  background-color: v-bind('theme.buttonbg');
  background-repeat: no-repeat;
  background-position: 12px 11px;  
}

.login-with-google-btn:hover, .login-with-google-btn:focus {
  background-color: v-bind('theme.buttonhighlight');
}
  
.login-with-google-btn:active {
  background-color: v-bind('theme.buttonbg');
}
  
.login-with-google-btn:disabled {
  filter: grayscale(100%);
  background-color: #ebebeb;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);
  cursor: auto;
}
</style>