<template>
  <v-btn 
    elevation="1"
    variant="tonal"
    class="auth-button"
    @click="onClick()"
    :text="label"
    :loading="inTransit" />
</template>
  
<script>
export default {
  name: "AuthButton",
  props: [ "label", "subLabel", "inTransit", "theme" ],
  methods: {
    onClick() {
      this.$emit("clicked");
    },
  },
};
</script>

<style scoped>
.auth-button {
  min-height: 3rem;
  font-weight: bold;
  flex-grow: 1;
}
</style>

