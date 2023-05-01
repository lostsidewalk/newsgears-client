<template>
  <div>
    <div class="features-view">
      <!-- TODO: (refactor) extract component -->
      <div class="feature">
        <div class="feature-title">IT'S FREE <span class="fa fa-beer" role="presentation" /></div>
        <div class="feature-body">
          You can always have a free account, and there will never be ads while using FeedGears.  
          We love RSS/ATOM, and we want people to use our software. You can even host it yourself! 
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">SUBSCRIBE TO KEEP THE LIGHTS ON <span class="fa fa-lightbulb-o" role="presentation" /></div>
        <div class="feature-body">
          We encourage you to subscribe and contribute $4 per month to support hosting and ongoing development 
          of FeedGears.  We believe in RSS, and we believe that you do as well.  We value having a secure, user-respecting 
          platform for exploring the world's information in this unique, interesting, and fun way.  
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">MOBILE OPTIMIZATION <span class="fa fa-mobile" role="presentation" /></div>
        <div class="feature-body">
          FeedGears has a mobile-optimized interface that it makes it reasy to read and manage feeds on smartphones and tablets.
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">GPT-BASE RECOMMENDATION ENGINE <span class="fa fa-android" role="presentation" /></div>
        <div class="feature-body">
          FeedGears will used GPT to suggest RSS feeds that are similar to those in your library.  Use our discovery tool to find new and interesting feeds.
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">SOCIAL MEDIA INTEGRATION <span class="fa fa-share-square" role="presentation" /></div>
        <div class="feature-body">
          FeedGears makes it easy to share and discover content by integrating with social media platforms such as Facebook and LinkedIn. 
          Share articles and follow accounts directly from within the reader.
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">SMART SORTING AND FILTERING <span class="fa fa-filter" role="presentation" /></div>
        <div class="feature-body">
          FeedGears has advanced sorting and filtering capabilities that help you to quickly find and prioritize the most relevant articles.  
        </div>
      </div>
      <div class="feature">
        <div class="coming-soon">COMING SOON</div>
        <div class="feature-title">TOOLS INTEGRATION <span class="fa fa-wrench" role="presentation" /></div>
        <div class="feature-body">
          To help you streamline your workflow, FeedGears integrates with productivity tools such as:
          <ul>
            <li>Evernote</li>
            <li>OneNote</li>
            <li>Pocket</li>
            <li>Instapaper</li>
            <li>Many more!</li>
          </ul> 
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">CUSTOMIZATION <span class="fa fa-sliders" role="presentation" /></div>
        <div class="feature-body">
          FeedGears offers built-in light and dark themes.  You may also create your own theme by customizing any color.  We will soon offer a wider range of customization options, 
          including the ability to adjust font sizes and styles, keyboard shortcuts, and multiple layouts.
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">ADVANCED SEARCH <span class="fa fa-search" role="presentation" /></div>
        <div class="feature-body">
          FeedGears has advanced search funnctionality that allows you to search through feeds by keyword, date range, 
          author, and other criteria.
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">READ-IT-LATER <span class="fa fa-archive" role="presentation" /></div>
        <div class="feature-body">
          Mark articles as 'read it later' to save articles to read a later time, either within FeedGears, or via a third-party service 
          such as Pocket or Instapaper.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeaturesPanel",
  props: [ "theme" ],
}
</script>

<style scoped>
.features-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: grid;
  resize: none;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  margin-left: 4%;
  margin-right: 4%;
  padding-top: 2%;
  padding-bottom: 2%;
}

@media (max-width: 640px) {
  .features-view {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    margin-left: 2%;
    margin-right: 2%;
  }
}

@media (max-width: 320px) {
  .features-view {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    margin-left: 0;
    margin-right: 0;
  }
}

.feature {
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: v-bind('theme.appbg');
  padding: .75rem;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feature-title {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0rem;
  padding-bottom: .75rem;
  text-align: left;
}

.feature-body {
  text-align: left;
}

.coming-soon {
  font-family: "Russo One", system-ui, sans-serif;
  font-size: unset;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: .44rem;
  border: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 4px;
  padding: .44rem .75rem;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
