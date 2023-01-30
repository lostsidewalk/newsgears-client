<template>
    <div class="hide-button">
      <button @click="this.$emit('toggle')" :title="(this.show ? 'Collapse' : 'Restore') + ' this panel'">
        <i class="fa" :class="this.show ? 'fa-window-minimize' : 'fa-window-restore'"></i>
      </button>
    </div>
</template>

<script>
export default {
  name: "MinMaxButton",
  props: ["theme", "show"],
  emits: ["toggle"],
}
</script>

<style scoped>
.hide-button {
  display: flex;
  flex-direction: row-reverse;
  padding-right: 2px;
}

.hide-button > button:hover {
}

.hide-button > button {
  font-weight: bold;
  font-size: large;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  background-color: unset;
  border: unset;
  cursor: pointer;
}
</style>