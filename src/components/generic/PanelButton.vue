<template>
  <v-btn
    elevation="1"
    variant="tonal"
    class="auth-button flex-grow-1"
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
  name: "PanelButton",
  props: {
    label: { type: String, required: true },
    subLabel: { type: String, default: null },
    tooltip: { type: String, default: null },
    isLoading: { type: Boolean, default: false },
  },
  emits: ["clicked"],
};
</script>

<style scoped>
.auth-button {
  min-height: 3rem;
  font-weight: bold;
}
</style>
