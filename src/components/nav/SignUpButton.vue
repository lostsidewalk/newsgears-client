<template>
  <button id="signup" class="signup-button" @click="this.$router.push('/register')" :disabled="disabled">
    Create an account
  </button>
</template>

<script>
export default {
  name: "SignUpButton",
  props: [ "disabled", "theme" ],
}
</script>

<style scoped>
.signup-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  border-radius: 3px;
  margin: .56rem;
  text-align: center;
}

.signup-button:disabled {
  cursor: auto;
}

.signup-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.signup-button:hover:disabled {
  background-color: unset;
}
</style>