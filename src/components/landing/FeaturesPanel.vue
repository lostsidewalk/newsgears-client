<template>
  <v-sheet>
    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">IT'S FREE <v-icon icon="fa-beer" /></v-card-title>
      <v-divider />
      <v-card-text align="left">
        You can always have a free account, and there will never be ads while using FeedGears.  
        We love RSS/ATOM, and we want people to use our software. You can even host it yourself! 
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">SUBSCRIBE TO KEEP THE LIGHTS ON <v-icon icon="fa-lightbulb-o" /></v-card-title >
      <v-divider />
      <v-card-text align="left">
        We encourage you to subscribe and contribute $4 per month to support hosting and ongoing development 
        of FeedGears.  We believe in RSS, and we believe that you do as well.  We value having a secure, user-respecting 
        platform for exploring the world's information in this unique, interesting, and fun way.  
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">MOBILE OPTIMIZATION <v-icon icon="fa-mobile" /></v-card-title>
      <v-divider />
      <v-card-text align="left">
        FeedGears has a mobile-optimized interface that it makes it reasy to read and manage feeds on smartphones and tablets.
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">GPT-BASE RECOMMENDATION ENGINE <v-icon icon="fa-android" /></v-card-title>
      <v-divider />
      <v-card-text align="left">
        FeedGears will used GPT to suggest RSS feeds that are similar to those in your library.  Use our discovery tool to find new and interesting feeds.
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">SOCIAL MEDIA INTEGRATION <v-icon icon="fa-share-square" /></v-card-title>
      <v-divider />
      <v-card-text align="left">
        FeedGears makes it easy to share and discover content by integrating with social media platforms such as Facebook and LinkedIn. 
        Share articles and follow accounts directly from within the reader.
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">SMART SORTING AND FILTERING <v-icon icon="fa-filter" /></v-card-title>
      <v-divider />
      <v-card-text align="left">
        FeedGears has advanced sorting and filtering capabilities that help you to quickly find and prioritize the most relevant articles.  
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">TOOLS INTEGRATION <v-icon icon="fa-wrench" /></v-card-title>
      <v-divider />
      <v-card-text align="left">
        To help you streamline your workflow, FeedGears integrates with a variety of productivity tools such as:
        <v-chip-group class="mt-2">
          <v-chip label append-icon="fa-external-link" size="large" elevation="2" variant="outlined">Evernote</v-chip>
          <v-chip label append-icon="fa-external-link" size="large" elevation="2" variant="outlined">OneNote</v-chip>
          <v-chip label append-icon="fa-external-link" size="large" elevation="2" variant="outlined">Pocket</v-chip>
          <v-chip label append-icon="fa-external-link" size="large" elevation="2" variant="outlined">Instapaper</v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">CUSTOMIZATION <v-icon icon="fa-sliders" /></v-card-title>
      <v-divider />
      <v-card-text align="left">
        FeedGears offers built-in light and dark themes.  You may also create your own theme by customizing any color.  We will soon offer a wider range of customization options, 
        including the ability to adjust font sizes and styles, keyboard shortcuts, and multiple layouts.
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">ADVANCED SEARCH <v-icon icon="fa-search" /></v-card-title>
      <v-divider />
      <v-card-text align="left">
        FeedGears has advanced search funnctionality that allows you to search through feeds by keyword, date range, 
        author, and other criteria.
      </v-card-text>
    </v-card>

    <v-card class="mb-4" elevation="6">
      <v-card-title class="pa-4">READ-IT-LATER <v-icon icon="fa-archive" /></v-card-title>
      <v-divider />
      <v-card-text align="left">
        Mark articles as 'read it later' to save articles to read a later time, either within FeedGears, or via a third-party service 
        such as Pocket or Instapaper.
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: "FeaturesPanel",
  props: [ "theme" ],
}
</script>
