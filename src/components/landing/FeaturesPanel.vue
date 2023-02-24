<template>
  <div>
    <div class="features-view">
      <div class="feature">
        <div class="feature-title">RSS/ATOM</div>
        <div class="feature-body">
          FeedGears was built on the open-source project ROME, and supports all versions of RSS/ATOM, with high-level support for modules such as: 
          <ul>
            <li>iTunes Podcasting</li>
            <li>iPhoto Photocasting</li>
            <li>MediaRSS (Youtube)</li>
            <li>GeoRSS</li>
            <li>Creative Commons</li>
          </ul>
          We strive to give you access to all content in the RSS/ATOM envelope, organized in a sensible, accessible, and presentable way.
      </div>
      </div>
      <div class="feature">
        <div class="feature-title">IT'S FREE</div>
        <div class="feature-body">
          You can always have a free account that will never go away.  There will never be third-party ads while using FeedGears.  
          <ul>
            <li>Free accounts are limited to a single queue with a maximum of 25 upstream RSS/ATOM subscriptions.</li>
            <li>Feeds are updated hourly</li>
          </ul>
          We love RSS/ATOM, and we want people to use our software. You can even host it yourself! 
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">UPGRADE FOR ADDITIONAL CAPACITY</div>
        <div class="feature-body">
          Upgrade your feed reading experience by subscribing for $4 per month: 
          <ul>
            <li>Unlimited queues</li>
            <li>Unlimited number of upstream subscriptions</li>
            <li>More frequent update interval (as needed)</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">PRIVACY</div>
        <div class="feature-body">
          FeedGears is a tool built for users.  
          <ul>
            <li>The application employs cookies for authentication purposes only.  We will never engage in any sort of tracking activity.</li>
            <li>User data can be downloaded and fully purged upon request (an automated process built in the 'settings' page).</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">SECURITY</div>
        <div class="feature-body">
          FeedGears is built for your security. 
          <ul>
            <li>FeedGears eploys a sensible content security policy, as well as a secure image proxy, to limit your exposure when rendering feed content in HTML.</li>
            <li>On the server side, FeedGears will upgrade all feed connections to SSL where possible, and handle your credentials appropriately.</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">ACCESSIBILITY</div>
        <div class="feature-body">
          We believe in building highly accessible software.  
          <ul>
            <li>Focus order and keyboard navigation makes sense throughout the application, and resources are tagged appropriately to work with readers.</li>
            <li>Hot-key support allows you to perform any function with the keyboard.</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">QUEUE-BASED INTERFACE</div>
        <div class="feature-body">
          Upstream feeds are organized into queues.
          <ul>
            <li>The FeedGears queue dashboard provides summary information for all of your feeds.</li>
            <li>Select a queue to see the articles in those feeds, sorted and filtered according to the queue configuration.</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">FILTERING AND ALERTS</div>
        <div class="feature-body">
          You can define multiple filters for each queue.  FeedGears will (quietly) alert you in the queue dashboard when new articles match a filter you have defined.  
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">NewsApi.org INTEGRATION</div>
        <div class="feature-body">
          FeedGears offers upstream access to NewsApi.org, a service that provides curated news articles from sources around the world.  The NewsApi query expression language is simple, allowing you to build highly focused queries.  If enabled, NewsApi articles are imported into your queue along with content from upstream RSS/ATOM sources.
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">THEMEABLE</div>
        <div class="feature-body">
          FeedGears has built-in support for light/dark themes.
        </div>
      </div>
      <!-- <div class="feature">
        <div class="feature-title">THIRD-PARTY INTEGRATION</div>
        <div class="feature-body">
          FeedGears supports the following third-party integrations: 
        </div>
      </div> -->
      <div class="feature">
        <div class="feature-title">RSS/ATOM/JSON PUBLISHING</div>
        <div class="feature-body">
          Posts that are 'starred' in FeedGears can be published on a public-facing, queue-specific feed.
          <ul>
            <li>This feed is published in RSS, ATOM, and JSON format.</li>
            <li>These links may be shared with others so that they may follow you 'starred' items in any given queue. </li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">FREE AND OPEN-SOURCE</div>
        <div class="feature-body">
          FeedGears was built using free and open source tools.  
          <ul>
            <li>The back-end is built entirely in Java, mainly using Spring Boot.  </li>
            <li>The front-end is a VueJs 3 application.  </li>
            <li>All source code is available in our <i class="fa fa-github" /> GitHub repository, and is updated daily. </li>
            <li>All source code is protected by the GPLV3 licensed.</li>
          </ul>
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">SELF HOSTING</div>
        <div class="feature-body">
          For those who would prefer to self-host FeedGears, *here* are the instructions.
        </div>
      </div>
      <div class="feature">
        <div class="feature-title">DEV BLOG</div>
        <div class="feature-body">
          Follow along with the development of FeedGears via our dev blog, or the Lost Sidewalk coding live stream.
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
  margin-top: 2%;
  margin-bottom: 2%;
}

.feature {
  border: 1px solid transparent;
  border-radius: 5px;
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
