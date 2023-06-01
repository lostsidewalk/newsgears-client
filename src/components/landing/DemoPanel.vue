<template>
  <v-container>
    <v-carousel>
      <v-carousel-item>
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            :elevation="isHovering ? 12 : 0" 
            v-bind="props"
          >
            <v-img
              class="reader-image" 
              :src="'reader_global_news_' + ($vuetify.theme.dark ? 'dark' : 'light') + '.png'" 
              :alt="$t('queuePageScreenshot')"
            />
          </v-card>
        </v-hover>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
export default {
  name: "DemoPanel",
}
</script>
