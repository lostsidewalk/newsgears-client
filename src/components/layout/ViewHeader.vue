<template>
  <div :class="sticky ? 'view-header sticky-header' : 'view-header'">
    <span :class="collapsible ? 'collapsible-header' : 'inline-header'" @click.stop="this.$emit('toggle')">
      <h3 class="view-header-count">
        <slot name="count" />
      </h3>
      <MinMaxButton :class="{ 'hidden': !collapsible }" class="min-max-button"  
        :show="show" 
        :theme="theme" />
    </span>
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <slot name="body" />
    <div class="view-header-toolbar">
      <slot name="toolbar" />
    </div>
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
/** has references */
.sticky-header {
  position: sticky;
  top: 0px;
  z-index: 200;
  overflow-y: auto;
}

/** has references */
.collapsible-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  padding: .56rem;
  cursor: pointer;
}

/** has references */
.collapsible-header:hover {
  background-color: v-bind('theme.buttonhighlight');
}

/** has references */
.inline-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  padding: .56rem;
}

/** has references */
.view-header {
  padding-bottom: .56rem;
  text-align: left;
  border-radius: 0;
}

/** has references */
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

/** has references */
.view-header-toolbar {
  border-top: 0px;
  border-radius: 0px 0px 4px 4px;
}

.hidden {
  visibility: hidden;
}
</style>
