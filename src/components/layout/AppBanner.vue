<template>
  <div>
    <!-- <div class="app-banner">
      <i class="fa fa-gear"></i>
      FeedGears
    </div>
    <div class="app-sub-banner"></div> -->
  </div>
</template>

<script>
export default {
  name: "AppBanner",
  props: [ "theme" ],
  data() {
    return {
    };
  },
}
</script>

<style scoped>
.app-banner {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
  color: v-bind('theme.logocolor');
  text-shadow: 2px 2px 2px v-bind('theme.logoshadowcolor');
  margin-top: 3.125rem;
  user-select: none;
}

.app-banner > i {
  position: relative;
  color: v-bind('theme.logoaccentcolor');
  text-shadow: 0px 0px 1px v-bind('theme.logoshadowcolor');
  transform: scale(5.0);
  z-index: -2;
}

.app-sub-banner {
  color: v-bind('theme.logosubtextcolor');
  margin-bottom: 3.125rem;
  user-select: none;
}
</style>