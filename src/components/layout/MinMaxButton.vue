<template>
  <div class="hide-button">
    <button @click="this.$emit('toggle')" 
      :title="this.show ? this.$t('collapseThisPanel') : this.$t('restoreThisPanel')">
      <i class="fa" :class="this.show ? 'fa-compress' : 'fa-expand'"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "MinMaxButton",
  props: [ "theme", "show" ],
  emits: [ "toggle" ],
}
</script>

<style scoped>
.hide-button {
  display: flex;
  flex-direction: row-reverse;
  padding-right: .125rem;
}

.hide-button > button {
  font-weight: bold;
  font-size: larger;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  background-color: unset;
  border: unset;
  cursor: pointer;
}
</style>