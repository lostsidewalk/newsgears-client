<template>
  <div>
    <div class="demo-view">
      <div class="background" />
      <div class="image-panel">
        <img class="reader-image" :src="'reader_global_news_' + this.$theme.currentTheme.ident + '.png'" :alt="this.$t('queuePageScreenshot')">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DemoPanel",
  props: [ "theme" ],
}
</script>

<style scoped>
.demo-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 4%;
  margin-right: 4%;
}

.image-panel {
  margin-top: 2%;
  margin-bottom: 2%;
  border: 1px solid transparent;
  width: 100%;
}

.image-panel > img {
  border-radius: 4px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  position: relative;
}

.reader-image {
  top: 0;
  left: 0;
  max-width: 75%;
}
</style>
