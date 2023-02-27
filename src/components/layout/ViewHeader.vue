<template>
  <div :class="sticky ? 'view-header sticky-header' : 'view-header'">
    <span :class="collapsible ? 'collapsible-header' : 'inline-header'">
      <h3 class="view-header-count">
        <slot name="count" />
      </h3>
      <MinMaxButton v-if="collapsible" class="min-max-button" @toggle="this.$emit('toggle')" :show="show" :theme="theme" :disabled="disabled || inTransit" />
    </span>
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <slot name="body" />
  </div>
</template>

<script>
import MinMaxButton from './MinMaxButton.vue';
import NavbarFixedHeader from './NavbarFixedHeader.vue';

export default {
  name: "ViewHeader",
  props: [ "sticky", "collapsible", "show", "disabled", "inTransit", "theme" ],
  emits: [ "toggle" ],
  components: {
    MinMaxButton,
    NavbarFixedHeader
  }
}
</script>

<style scoped>
@media (min-width: 1023px) {
  .sticky-header {
    position: sticky;
    top: 0px;
    z-index: 200;
    overflow-y: auto;
  }
}

.collapsible-header {
  display: inline-flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}

.inline-header {
  display: inline-flex;
  flex-direction: row;
}

.view-header {
  margin-left: .75rem;
  margin-right: .75rem;
  padding: .75rem;
  text-align: left;
  border-radius: 4px 4px 0px 0px;
}

.view-header-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0rem;
  white-space: nowrap;
  overflow: auto;
}
</style>
