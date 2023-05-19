<template>
  <v-btn 
    elevation="1"
    variant="tonal"
    class="auth-button"
    :loading="inTransit"
    @click="onClick()"
  >
    {{ label }}
    <v-tooltip
      v-if="tooltip"
      location="start"
      activator="parent"
      open-delay="2000"
    >
      {{ tooltip }}
    </v-tooltip>
  </v-btn>
</template>
  
<script>
export default {
  name: "AuthButton",
  props: {
    label: { type: String, required: true },
    subLabel: { type: String, default: null },
    tooltip: { type: String, default: null },
    inTransit: { type: Boolean, default: false },
  },
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
