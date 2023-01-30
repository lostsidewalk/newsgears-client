<template>
  <div id="landing">
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme">
      <template v-slot:buttons>
        <div id="newsgears-logo" class="fixed-header-item left-header">
          <!-- <img src="newsgears-logo.png" alt="NewsGears Logo"/> -->
        </div>
        <div class="fixed-header-item right-header">
          <router-link to="/app" class="link ph3 pv2 dib bg-transparent no-pill">
            LOGIN
          </router-link>
        </div>
        <div class="fixed-header-item right-header">
          <a class="link ph3 pv2 dib bg-transparent no-pill" href="#0">DOCUMENTATION</a>
        </div>
        <div class="fixed-header-item right-header">
          <a class="link ph3 pv2 dib bg-transparent no-pill" href="#0">RSS/ATOM FEED DISCOVERY</a>
        </div>
        <div class="fixed-header-item right-header">
          <a class="link ph3 pv2 dib bg-transparent no-pill" href="#0">NEWS DISCOVERY</a>
        </div>
        <div class="fixed-header-item right-header">
          <a class="link ph3 pv2 dib bg-transparent no-pill" href="#0">PRICING</a>
        </div> 
      </template>
    </NavbarFixedHeader>

    <div class="top-half">
      <div class="xx-large-text">
        Build and Publish Custom Data Feeds
      </div>

      <div class="larger-text">
        FeedGears allows you to gather, review, edit, and publish information from multiple sources into more meaningful feeds for your team, application, or website.
      </div>

      <div class="ph3 pill-container">
        <a class="link dib br-pill ph3 pv2 mb2 dib bg-near-black" href="#0">RSS/ATOM</a>
        <a class="link dib br-pill ph3 pv2 mb2 dib bg-near-black" href="#0">JSON</a>
        <a class="link dib br-pill ph3 pv2 mb2 dib bg-near-black" href="#0">CSV</a>
        <a class="link dib br-pill ph3 pv2 mb2 dib bg-near-black" href="#0">MD</a>
      </div>

      <div class="larger-text subdued-text">
        Find out how to easily build, use, and share curated data feeds using FeedGears
      </div>

      <div class="larger-text subdued-text">
        VueJs Nuxt/Content, React, WordPress 
      </div>
    </div>

    <div class="middle-half">
      <div class="larger-text">
        Configure FeedGears to fetch data from one or more upstream RSS/ATOM sources, or directly query over 30,000 
        news sources from around the world.
      </div>
      <img class="network-of-sources" src="http://localhost:8080/empty.png" />
      <div class="larger-text">
        Use FeedGears to review articles, add commentary, make changes, and re-deploy content as live RSS/ATOM feeds, or as 
        JSON/CSV/MD artifacts to integrate into your own application.
      </div>
      <div class="button-row">
        <span>
          <a class="link dib br-pill ph3 pv2 mb2 dib bg-near-black" href="#0">Get Started</a>
        </span>
        <span >
          <a class="link dib br-pill ph3 pv2 mb2 dib bg-near-black" href="#0">Documentation and Integration Guides</a>
        </span>
      </div>
    </div>

    <div class="lower-half">
      <div class="large-text left-side">
        <div class="step-wrapper"><span class="step-n">Step 1</span> Create your feed and define basic properties, such as title and description:</div>
        <img class="screenshot" src="http://localhost:8080/empty.png"/>
      </div>
      <div class="large-text left-side">
        <div class="step-wrapper"><span class="step-n">Step 2</span> Bring your own OPML, or use Feed Discovery to add upstream data sources and/or configure FeedGears to query news sources around the world:</div>
        <img class="screenshot" src="http://localhost:8080/empty.png"/>
      </div>
      <div class="large-text left-side">
        <div class="step-wrapper"><span class="step-n">Step 3</span> Define rules to filter and transform your content:</div>
        <img class="screenshot" src="http://localhost:8080/empty.png"/>
      </div>
      <div class="large-text left-side">
        <div class="step-wrapper"><span class="step-n">Step 4</span> Use FeedGears to peruse your assembled feed.  Edit content and re-publish your feed in a variety of formats:</div>
        <img class="screenshot" src="http://localhost:8080/empty.png"/>
      </div>
      <div class="large-text left-side">
        <div class="step-wrapper"><span class="step-n">Step 5</span> Embed your FeedGears feed within your own website/application: </div>
        <img class="screenshot" src="http://localhost:8080/empty.png"/>
      </div>
    </div>
    <div class="subscription-plan-view">
      <SubscriptionPlanPanel :theme="theme" />
    </div>
    <div class="larger-text subdued-text status">
      System status: UP
    </div>
    <router-view/>
  </div>
</template>
  
<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import SubscriptionPlanPanel from '@/components/subscription/SubscriptionPlanPanel.vue';

export default {
  name: "LandingView",
  components: {
    NavbarFixedHeader,
    SubscriptionPlanPanel, 
  },
  props: ["baseUrl"],
  watch: {
    '$auth.$isAuthenticated' (isAuthenticated) {
      if (isAuthenticated) {
        console.log("authenticated in the landing page");
      }
    }
  },
  mounted() {
    this.$auth.getTokenSilently()
      .catch(() => {})
      .finally(() => {
        if (this.$auth.$isAuthenticated) {
          console.log("landing_page: authenticated on mount");
        } else {
          console.log("landing_page: not authenticated on mount");
        }
        this.isLoading = false;
      });
  },
  data() {
    return {
      theme: this.$theme.currentTheme,
      isLoading: true
    };
  },
};
</script>
  
<style scoped>
#landing {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: v-bind('theme.subduedmessage');
  margin-top: 100px;
  font-family: "Russo One", system-ui, sans-serif;
  padding-bottom: 100px;
  height: 100%;
}

.fixed-header-item {
  height: 48px;
  width: 128px;
  border: 1px solid v-bind('theme.sectionbordercolor');
}

.left-header {
  float: left;
}

.right-header {
  float: right;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: 5px;
  user-select: none;
}

.br-pill:hover {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.no-pill:hover {
  text-decoration: underline;
}

.dib {
    display: inline-block;
}

.link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.bg-transparent {
  background-color: unset;
}

.bg-near-black {
  background-color: rgba(255,64,64,0.1);
}

.bg-dark-gray {
    background-color: #333;
}

.pv2 {
    margin-top: .5rem;
    margin-bottom: .5rem;
}

.ph3 {
  margin-left: 1rem;
  margin-right: 1rem;
}

.mb2 {
    margin-bottom: .5rem;
}

/**  */

.float-left {
  margin-right: 25%;
}

.float-right {
  margin-left: 25%;
}

.xx-large-text {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-top: 0px;
  font-size: xx-large;
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
}

.larger-text {
  padding-top: 25px;
  padding-bottom: 25px;
  font-size: medium;
  color: lightgrey;
  text-align: center;
}

.subdued-text {
  color: v-bind('theme.subduedmessage')
}

.large-text {
  padding-top: 25px;
  padding-bottom: 10px;
  font-size: large;
  color: darkgrey;
  text-align: justify;
}

.navbar.fixed-header {
  border: unset;
  background-color: rgb(24,24,24);
  box-shadow: unset;
  box-shadow: 1px 1px 1px black;
}

.fixed-header-item {
  border: unset;
}

.top-half {
  padding-left: 15%;
  padding-right: 15%;
}

.middle-half {
  background-color: rgb(24,24,24);
  padding-left: 3%;
  padding-right: 4%;
  color: v-bind('theme.subduedmessage');
  padding-left: 15%;
  padding-right: 15%;
  box-shadow: 0px 1px 0px black;
}

.lower-half {
  padding-left: 15%;
  padding-right: 15%;
}

.bottom-half {
  margin-bottom: 25px;
  background-color: rgb(24,24,24);
  padding-left: 3%;
  padding-right: 4%;
  color: v-bind('theme.subduedmessage');
  padding-left: 15%;
  padding-right: 15%;
  box-shadow: 0px 1px 0px black;
}

.left-side {
  text-align: left;
}

.right-side {
  text-align: right;
}

.step-wrapper {
  font-size: medium;
  padding-bottom: 15px;
}

.step-n {
  color: v-bind('theme.subduedmessage');
  padding-right: 5px;
}

.screenshot {
  min-width: 100%;
  min-height: 420px;
  border-radius: 5px;
  border: 1px solid v-bind('theme.logobrightcolor');
}

.screenshot:hover {
  box-shadow: 4px 4px 4px black;
}

.network-of-sources {
  min-width: 100%;
  min-height: 420px;
  border-radius: 5px;
  border: 1px solid v-bind('theme.logobrightcolor');
  border-radius: 3px;
}

.network-of-sources:hover {
  box-shadow: 4px 4px 4px black;
}

.button-row {
  padding-bottom: 25px;
}

.subscription-plan-view {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  margin-top: 3%;
  margin-left: 3%;
  margin-right: 3%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  color: v-bind('theme.subduedmessage');
}

</style>
