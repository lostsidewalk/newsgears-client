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
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .75rem;
  border-radius: 4px;
}
</style>
