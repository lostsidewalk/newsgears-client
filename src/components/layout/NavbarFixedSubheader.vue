<template>
    <div class="navbar fixed-sub-header">
      <slot name="message"></slot>
    </div>
</template>

<script>

export default {
  props: [ "theme", ],
  components: { },
  name: "NavbarFixedSubheader",
}

</script>

<style scoped>
.navbar.fixed-sub-header {
  position: fixed;
  left: 16px;
  top: 16px;
  z-index: 1000;
  border: 1px solid v-bind('theme.navbarshadow');
  background-color: v-bind('theme.navbarsubbg');
  box-shadow: 1px 1px 1px v-bind('theme.navbarsubshadow');
  padding: 10px;
  border-radius: 3px;
}
</style>
