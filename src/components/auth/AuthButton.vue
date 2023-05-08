<template>
  <v-btn depressed outlined block 
    class="auth-button"
    :disabled="disabled"
    @click="onClick()">
    {{ label }}
  </v-btn>
</template>
  
<script>
export default {
  name: "AuthButton",
  props: [ "label", "subLabel", "disabled", "theme" ],
  methods: {
    onClick() {
      this.$emit("clicked");
    },
  },
};
</script>

<style scoped>
.auth-button {
  max-width: 256px;
  min-height: 3rem;
  padding: .75rem 1rem .75rem 2.625rem;
  font-weight: bold;
}
</style>