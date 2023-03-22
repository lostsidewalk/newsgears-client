<template>
  <div>
    <div class="features-view">
      <div class="feature">
        <div class="feature-title">IT'S FREE <span class="fa fa-beer" role="presentation" /></div>
        <div class="feature-body">
          You can always have a free account, and there will never be ads while using FeedGears.  
          We love RSS/ATOM, and we want people to use our software. You can even host it yourself! 
          We will try to keep resources unlimited, but we will sensibly rate limit the backend as needed.
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
        <div class="feature-title">PRIVACY AND SECURITY <span class="fa fa-lock" role="presentation" /></div>
        <div class="feature-body">
          FeedGears is a tool built for users.  
          <ul>
            <li>We will never engage in any sort of tracking activity.</li>
            <li>User data can be downloaded and fully purged upon request (an automated process built in the 'settings' page).</li>
            <li>We will never disclose anything about you to anyone, without your permission.</li>
            <li>FeedGears eploys a sensible content security policy, as well as a secure image proxy, to limit your exposure when rendering feed content in HTML.</li>
            <li>On the server side, FeedGears will upgrade all feed connections to SSL where possible, and handle your credentials in a secure manner when dealing with authenticated feeds.</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">ACCESSIBILITY <span class="fa fa-universal-access" role="presentation" /></div>
        <div class="feature-body">
          We believe in building highly accessible software.  FeedGears is WCAG 2.1 compliant at the 'AA' level. 
          <ul>
            <li>Tab order and keyboard navigation makes sense throughout the application.</li>
            <li>Hot-key support allows you to perform any function with the keyboard.</li>
            <li>We use vue-announce to properly integrate asynchronous server responses with accessibility software for a seemless experience.</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">QUEUE DASHBOARD <span class="fa fa-dashboard" role="presentation" /></div>
        <div class="feature-body">
          Upstream feeds are organized into queues.
          <ul>
            <li>The FeedGears queue dashboard provides summary information for all of your feeds.</li>
            <li>Select a queue to see the articles in those feeds, sorted and filtered according to your stored preferences, from anywhere.</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">FILTERING AND ALERTS <span class="fa fa-filter" role="presentation" /></div>
        <div class="feature-body">
          You can define multiple filters for each queue.  FeedGears will alert you in the queue dashboard when new articles match a filter you have defined.  
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">THEMEABLE <span class="fa fa-paint-brush" role="presentation" /></div>
        <div class="feature-body">
          FeedGears has built-in support for customizable light/dark themes.  Each theme is comprised of 31 colors; you may change them all.  
        </div>
      </div>
      <!-- <div class="feature">
        <div class="feature-title">THIRD-PARTY INTEGRATION</div>
        <div class="feature-body">
          FeedGears supports the following third-party integrations: 
        </div>
      </div> -->
      <div class="feature">
        <div class="feature-title">FEED PUBLISHING <span class="fa fa-bullhorn" role="presentation" /></div>
        <div class="feature-body">
          Posts that are 'starred' in FeedGears can be published on a public-facing, queue-specific feed.
          <ul>
            <li>One feed per queue, published in RSS, ATOM and JSON formats.</li>
            <li>These links may be shared with others so that they may follow your 'starred' items in any given queue. </li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">RSS/ATOM <span class="fa fa-rss" role="presentation" /></div>
        <div class="feature-body">
          FeedGears was built on the open-source project ROME, and supports all versions of RSS/ATOM, with high-level support for modules such as: 
          <ul>
            <li>iTunes Podcasting</li>
            <li>iPhoto Photocasting</li>
            <li>MediaRSS (Youtube)</li>
            <li>Creative Commons</li>
          </ul>
          We strive to give you access to all content in the RSS/ATOM envelope, organized in a sensible, accessible, and presentable way.  
          We will soon offer support for GeoRSS, an RSS module which conveys location data to maps-capable readers.
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">FREE AND OPEN-SOURCE <span class="fa fa-code-fork" role="presentation" /></div>
        <div class="feature-body">
          FeedGears was built using free and open source tools.  
          <ul>
            <li>The back-end is built entirely in Java, mainly using Spring Boot.  </li>
            <li>The front-end is a VueJs 3 application.  </li>
            <li>All source code is available in our <span class="fa fa-github" role="presentation" /> GitHub repository, and is updated daily. </li>
            <li>All source code is protected by the GPLV3 license.</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">SELF HOSTING <span class="fa fa-cloud" role="presentation" /></div>
        <div class="feature-body">
          For those who would prefer to self-host FeedGears, *here* are the instructions.
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">DEV BLOG <span class="fa fa-laptop" role="presentation" /></div>
        <div class="feature-body">
          Follow along with the development of FeedGears via our dev blog, or the Lost Sidewalk coding live stream.  We push front-end builds daily, back-end builds weekly, or as needed.
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
  /* grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); */
  resize: none;
  gap: 1rem;
  margin-left: 4%;
  margin-right: 4%;
  padding-top: 2%;
  padding-bottom: 2%;
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
</style>
