<template>
  <button class="signup-button" 
    @click="this.$router.push('/register')" 
    :disabled="disabled">
    {{ this.$t('createAnAccount') }}
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
  padding: .75rem 1rem;
  border-radius: 4px;
  border: 1px solid v-bind('theme.buttonborder');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  cursor: pointer;
  font-weight: bold;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  margin: .56rem;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.signup-button:disabled {
  cursor: auto;
}

.signup-button:hover, .signup-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.signup-button:hover:disabled {
  background-color: unset;
}
</style>