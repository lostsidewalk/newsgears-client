<template>
  <v-btn
    size="small" 
    accesskey="z"
    :title="$t('toggleDistractions')" 
    :aria-label="$t('toggleDistractionsAriaLabel')"
    icon="fa-arrows-alt"
    @click.stop="$emit('toggleDistractions')"
  />
</template>

<script>
export default {
  name: "ToggleDistractionsButton",
  emits: [ "toggleDistractions" ],
}
</script>
