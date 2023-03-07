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
  display: flex;
  position: fixed;
  left: 16px;
  top: 16px;
  z-index: 99999;
  border: 1px solid v-bind('theme.sectionbordercolor');
  background-color: v-bind('theme.appbg');
  box-shadow: 7px 7px 7px v-bind('theme.navbarsubshadow');
  padding: .75rem;
  border-radius: 3px;
}
</style>
