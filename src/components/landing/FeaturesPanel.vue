<template>
  <v-container class="d-flex flex-row flex-wrap justify-center" align="center">
    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">IT'S FREE <span class="fa fa-beer" role="presentation" /></v-card-title>
      </v-card-item>
      <v-card-text align="left">
        You can always have a free account, and there will never be ads while using FeedGears.  
        We love RSS/ATOM, and we want people to use our software. You can even host it yourself! 
      </v-card-text>
    </v-card>

    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">SUBSCRIBE TO KEEP THE LIGHTS ON <span class="fa fa-lightbulb-o" role="presentation" /></v-card-title >
      </v-card-item>
      <v-card-text align="left">
        We encourage you to subscribe and contribute $4 per month to support hosting and ongoing development 
        of FeedGears.  We believe in RSS, and we believe that you do as well.  We value having a secure, user-respecting 
        platform for exploring the world's information in this unique, interesting, and fun way.  
      </v-card-text>
    </v-card>

    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">MOBILE OPTIMIZATION <span class="fa fa-mobile" role="presentation" /></v-card-title>
      </v-card-item>
      <v-card-text align="left">
        FeedGears has a mobile-optimized interface that it makes it reasy to read and manage feeds on smartphones and tablets.
      </v-card-text>
    </v-card>

    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">GPT-BASE RECOMMENDATION ENGINE <span class="fa fa-android" role="presentation" /></v-card-title>
      </v-card-item>
      <v-card-text align="left">
        FeedGears will used GPT to suggest RSS feeds that are similar to those in your library.  Use our discovery tool to find new and interesting feeds.
      </v-card-text>
    </v-card>

    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">SOCIAL MEDIA INTEGRATION <span class="fa fa-share-square" role="presentation" /></v-card-title>
      </v-card-item>
      <v-card-text align="left">
        FeedGears makes it easy to share and discover content by integrating with social media platforms such as Facebook and LinkedIn. 
        Share articles and follow accounts directly from within the reader.
      </v-card-text>
    </v-card>

    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">SMART SORTING AND FILTERING <span class="fa fa-filter" role="presentation" /></v-card-title>
      </v-card-item>
      <v-card-text align="left">
        FeedGears has advanced sorting and filtering capabilities that help you to quickly find and prioritize the most relevant articles.  
      </v-card-text>
    </v-card>

    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">TOOLS INTEGRATION <span class="fa fa-wrench" role="presentation" /></v-card-title>
      </v-card-item>
      <v-card-text align="left">
        To help you streamline your workflow, FeedGears integrates with productivity tools such as:
        <li>Evernote</li>
        <li>OneNote</li>
        <li>Pocket</li>
        <li>Instapaper</li>
        <li>Many more!</li>
      </v-card-text>
    </v-card>

    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">CUSTOMIZATION <span class="fa fa-sliders" role="presentation" /></v-card-title>
      </v-card-item>
      <v-card-text align="left">
        FeedGears offers built-in light and dark themes.  You may also create your own theme by customizing any color.  We will soon offer a wider range of customization options, 
        including the ability to adjust font sizes and styles, keyboard shortcuts, and multiple layouts.
      </v-card-text>
    </v-card>

    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">ADVANCED SEARCH <span class="fa fa-search" role="presentation" /></v-card-title>
      </v-card-item>
      <v-card-text align="left">
        FeedGears has advanced search funnctionality that allows you to search through feeds by keyword, date range, 
        author, and other criteria.
      </v-card-text>
    </v-card>

    <v-card width="100%" class="ma-2" elevation="6" variant="tonal">
      <v-card-item>
        <v-card-title class="feature-title">READ-IT-LATER <span class="fa fa-archive" role="presentation" /></v-card-title>
      </v-card-item>
      <v-card-text align="left">
        Mark articles as 'read it later' to save articles to read a later time, either within FeedGears, or via a third-party service 
        such as Pocket or Instapaper.
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "FeaturesPanel",
  props: [ "theme" ],
}
</script>

<style scoped>
.feature-title {
  font-family: "Russo One", system-ui, sans-serif;
  color: v-bind('theme.logocolor');
}
</style>
