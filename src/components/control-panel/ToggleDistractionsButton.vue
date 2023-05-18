<template>
  <v-btn @click.stop="this.$emit('toggleDistractions')" 
    size="small"
    accesskey="z" 
    :title="this.$t('toggleDistractions')"
    :aria-label="this.$t('toggleDistractionsAriaLabel')"
    icon="fa-arrows-alt" />
</template>

<script>
export default {
  name: "ToggleDistractionsButton",
  props: [ "theme" ],
  emits: [ "toggleDistractions" ],
}
</script>
