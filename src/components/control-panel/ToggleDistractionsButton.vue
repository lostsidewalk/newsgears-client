<template>
  <v-btn class="mode-switch-button accessible-button" 
    @click.stop="this.$emit('toggleDistractions')" 
    accesskey="z" 
    :disabled="disabled" 
    :title="this.$t('toggleDistractions')"
    :aria-label="this.$t('toggleDistractionsAriaLabel')">
    <span class="fa fa-arrows-alt" />
  </v-btn>
</template>

<script>
export default {
  name: "ToggleDistractionsButton",
  props: [ "disabled", "theme" ],
  emits: [ "toggleDistractions" ],
}
</script>

<style scoped>
.mode-switch-button {
  max-width: 256px;
  min-height: 3rem;
  padding: .75rem 1rem;
  font-weight: bold;
}
</style>
