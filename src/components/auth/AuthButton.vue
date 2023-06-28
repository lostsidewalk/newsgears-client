<template>
  <v-btn
    elevation="1"
    variant="tonal"
    class="auth-button"
    :loading="isLoading"
    @click="$emit('clicked')"
  >
    {{ label }}
    <v-tooltip
      v-if="tooltip"
      location="start"
      activator="parent"
      open-delay="2000"
      :aria-label="tooltip"
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
    isLoading: { type: Boolean, default: false },
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
