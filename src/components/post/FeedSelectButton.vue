<template>
  <button  
    class="feed-select" 
    :value="feed.value" 
    :key="feed.label" 
    :disabled="disabled">
    <div class="feed-select-underlay">
      <!-- feed name -->
      <label class="feed-select-label">
        {{ feed.label }}
      </label>
      <!-- card -->
      <div class="feed-image-wrapper">
        <img v-if="feed.imgSrc" class="feed-image" :src="'data:image/png;base64,' + feed.imgSrc">
        <div class="feed-info-wrapper">
          <!-- inbound / published count -->
          <label class="feed-info-label-small">TOTAL | STARRED</label>
          <label class="feed-info-label">{{ this.inboundCount + ' | ' + this.publishedCount}}</label>
          <!-- <label class="feed-info-label">{{ feed.title }}</label>
          <label class="feed-info-label">{{ feed.description }}</label> -->
        </div>
      </div>
      <!-- show more/less information (also selects the feed) -->
      <label class="feed-info-label-small link" @click="toggleMoreInformation()">
        Show {{ this.showMoreInformation ? 'less' : 'more' }}
      </label>
      <!-- more information -->
      <div v-if="this.showMoreInformation" class="feed-info-details">
        <!-- subscriptions -->
        <label class="feed-info-label-small">SUBSCRIPTIONS</label>
        <label class="feed-info-label" v-if="feed.newsApiV2QueryText">
          <img src="newsapiv2_logo.png" /> {{ feed.newsApiV2QueryText }}
        </label>
        <label class="feed-info-label" v-for="rssAtomFeedUrl of feed.rssAtomFeedUrls" :key="rssAtomFeedUrl" :title="rssAtomFeedUrl.feedUrl ? rssAtomFeedUrl.feedUrl : false">
          <img src="rss_logo.svg" /> <a class="link" :href="rssAtomFeedUrl.feedUrl" :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
            {{ rssAtomFeedUrl.feedTitle ? rssAtomFeedUrl.feedTitle : rssAtomFeedUrl.feedUrl }}</a>
        </label>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: "FeedSelectButton",
  props: ["feed", "inboundCount", "publishedCount", "disabled", "theme"],
  methods: {
    toggleMoreInformation() {
      this.showMoreInformation = !this.showMoreInformation;
    }
  },
  data() {
    return {
      showMoreInformation: false,
    }
  }
}
</script>

<style scoped>
/** has references */
.feed-select {
  display: block !important;
  text-align: left !important;
  color: v-bind('theme.normalmessage');
  padding: 7px;
  cursor: pointer;
  border-radius: 3px;
  text-align: center;
  align-self: start;
  user-select: none;
  z-index: 0;
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  width: 100%;
}

/** has references */
.feed-select:hover {
  background-color: v-bind('theme.buttonhighlight');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.feed-select-underlay {
  z-index: 1;
  cursor: pointer;
}

.feed-select-label {
  font-family: "Russo One", system-ui, sans-serif;
  overflow-wrap: anywhere;
  color: v-bind('theme.logocolor');
  cursor: pointer;
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
}

.feed-image-wrapper {
  display: flex;
  flex-direction: row;
  padding-top: 3px;
  padding-bottom: 3px;
  cursor: pointer;
}

.feed-info-wrapper {
  flex-direction: column;
  display: flex;
  padding-left: 5px;
  cursor: pointer;
}

.feed-info-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  overflow-wrap: anywhere;
  padding: 5px;
}

.feed-info-label > img {
  max-height: 24px;
  max-width: 24px;
  padding-right: 5px;
}

.feed-info-label > span {
  padding-right: 5px;
}

.feed-info-label-small {
  max-width: fit-content;
  font-size: smaller;
  cursor: pointer;
  color: v-bind('theme.subduedmessage');
}

.feed-publication-label {
  display: flex;
  cursor: pointer;
  overflow-wrap: anywhere;
  padding: 5px;
  flex-direction: column;
  align-items: start;
}

.feed-image {
  border: 1px solid v-bind('theme.sectionbrighthighlight');
  width: 35px;
  height: 35px;
  max-width: 35px;
  max-height: 35px;
  display: inline-block; 
  background-size: cover; 
  background-position: center center;
  background-repeat: no-repeat;
  align-self: stretch;
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.link {
  text-decoration: none;
  color: unset;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.feed-info-details {
  padding-top: 5px;
}
</style>
