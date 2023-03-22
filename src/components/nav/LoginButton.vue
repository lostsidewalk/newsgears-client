<template>
  <button id="login" class="login-button" @click="this.$router.push('/app')" :disabled="disabled">
    Login
  </button>
</template>

<script>
export default {
  name: "LoginButton",
  props: [ "disabled", "theme" ],
}
</script>

<style scoped>
.login-button {
  border: 1px solid transparent;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  border-radius: 4px;
  margin: .56rem;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.login-button:disabled {
  cursor: auto;
}

.login-button:hover, .login-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.login-button:hover:disabled {
  background-color: unset;
}
</style>