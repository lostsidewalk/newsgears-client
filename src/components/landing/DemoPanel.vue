<template>
  <v-container>
    <!-- row -->
    <v-row
      align="center"
      justify="center"
    >
      <!-- col -->
      <v-col
        cols="12"
        sm="10"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            :elevation="isHovering ? 7 : 6" 
            v-bind="props"
          >
            <v-img
              class="reader-image" 
              :src="'reader_global_news_' + ($vuetify.theme.dark ? 'dark' : 'light') + '.png'" 
              :alt="$t('queuePageScreenshot')"
            />
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DemoPanel",
}
</script>
