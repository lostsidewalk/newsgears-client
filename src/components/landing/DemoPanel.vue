<template>
  <v-container align="center">
    <v-card elevation="6" max-width="1024">
      <v-img class="reader-image" :src="'reader_global_news_' + this.$theme.currentTheme.ident + '.png'" :alt="this.$t('queuePageScreenshot')"/>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "DemoPanel",
  props: [ "theme" ],
}
</script>
