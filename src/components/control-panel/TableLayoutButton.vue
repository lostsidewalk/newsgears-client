<template>
  <v-btn class="mode-switch-button accessible-button" 
    @click="cycleTableLayout" 
    accesskey="b" 
    :disabled="disabled" 
    :title="this.$t('cycleTableLayout')"
    :aria-label="this.$t('cycleTableLayoutAriaLabel')">
    <span class="fa fa-list" />
  </v-btn>
</template>

<script>
export default {
  name: "TableLayoutButton",
  props: ["disabled", "theme"],
  methods: {
    cycleTableLayout() {
      this.$theme.cycleTableLayout();
    }
  },
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