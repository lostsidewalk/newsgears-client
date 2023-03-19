<template>
  <button  
    class="feed-select" 
    :value="feed.value" 
    :key="feed.value" 
    :disabled="disabled">
    <div class="feed-select-underlay">
      <!-- feed name -->
      <label class="feed-select-label">
        {{ feed.label }}
      </label>
      <!-- card -->
      <div class="feed-image-wrapper">
        <img v-if="feed.imgSrc" class="feed-image" :src="'data:image/png;base64,' + feed.imgSrc" alt="Queue logo image">
        <img v-else class="feed-image" src="feedgears.png" alt="Queue logo image">
        <div class="feed-info-wrapper">
          <!-- inbound / published count -->
          <label class="feed-info-label"><span class="fa fa-eye" /> {{ this.inboundCount }}</label>
          <label class="feed-info-label"><span class="fa fa-star" /> {{ this.publishedCount }}</label>
        </div>
      </div>
      <!-- show more/less information (also selects the feed) -->
      <a v-if="this.showMoreInformation || feed.rssAtomFeedUrls.length > 0" class="feed-info-label-small link" @click.stop="toggleMoreInformation()" @keypress.enter.prevent="toggleMoreInformation()" tabindex="0">
        {{ this.showMoreInformation ? 'Hide subscriptions' : 'Show subscriptions' }}
      </a>
      <span v-if="feed.rssAtomFeedUrls.length === 0">0 subscriptions</span>
      <!-- more information -->
      <div v-if="this.showMoreInformation" class="feed-info-details">
        <!-- subscriptions -->
        <label class="feed-info-label-small">SUBSCRIPTIONS</label>
        <!-- RSS/ATOM feeds -->
        <label class="feed-info-label subscription-label" v-for="rssAtomFeedUrl of feed.rssAtomFeedUrls" :key="rssAtomFeedUrl" :title="rssAtomFeedUrl.feedUrl ? rssAtomFeedUrl.feedUrl : false">
          <!-- feed logo image -->
          <img v-if="rssAtomFeedUrl.feedImageUrl" :src="rssAtomFeedUrl.feedImageUrl" alt="Feed logo image" loading="lazy" /> 
          <!-- RSS logo -->
          <img v-else src="rss_logo.svg" alt="RSS logo" /> 
          <!-- last http status -->
          <span v-if="hasFeedMetrics(rssAtomFeedUrl)" :title='buildMetricStatusMessage(rssAtomFeedUrl.feedMetrics)'>
            {{ buildImportCtMessage(rssAtomFeedUrl.feedMetrics) }}
          </span>
          <!-- feed title w/direct link -->
          {{ rssAtomFeedUrl.feedTitle ? rssAtomFeedUrl.feedTitle : rssAtomFeedUrl.feedUrl }}
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
    hasFeedMetrics(rssAtomFeedUrl) {
      return rssAtomFeedUrl.feedMetrics && rssAtomFeedUrl.feedMetrics.length > 0;
    },
    // shown on hover 
    buildMetricStatusMessage(feedMetrics) {
      let m = this.getMostRecentMetric(feedMetrics);
      if (m.persistCt > 0) {
        return m.persistCt + ' new articles imported at ' + m.importTimestamp;
      } else {
        // HTTP 302 (Moved), redirected to https://whatever.com/feed (HTTP 200 OK)
        let message = m.httpStatusCode + ' (' + m.httpStatusMessage + ')' + (m.redirectFeedUrl ? (', redirected to ' + m.redirectFeedUrl + ' (' + m.redirectHttpStatusCode + ' ' + m.redirectHttpStatusMessage + ')') : '')
        if (m.queryExceptionTypeMessage) {
          message = message + '\n' + m.queryExceptionTypeMessage;
        }
        return message;
      }
    },
    // shown next to the RSS/ATOM icon 
    buildImportCtMessage(feedMetrics) {
      let m = this.getMostRecentMetric(feedMetrics);
      return m.persistCt > 0 ? '+' + m.persistCt : ('HTTP ' + m.httpStatusCode);
    },
    getMostRecentMetric(feedMetrics) {
      if (feedMetrics) {
        return feedMetrics.sort((a, b) => {
          return a.importTimestamp - b.importTimestamp;
        })[0];
      }
    },
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
  color: v-bind('theme.buttonfg');
  padding: .44rem;
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
.feed-select:hover, .feed-select:focus-visible {
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
  padding-top: .125rem;
  padding-bottom: .125rem;
  cursor: pointer;
}

.feed-info-wrapper {
  flex-direction: row;
  display: flex;
  padding-left: .44rem;
  cursor: pointer;
  align-items: flex-start;
}

.feed-info-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: .44rem;
  gap: .44rem;
  overflow-wrap: break-word;
  word-break: break-word;
}

.feed-info-label > img {
  max-height: 24px;
  max-width: 24px;
  padding-right: .44rem;
}

.feed-info-label > span {
  padding-right: .44rem;
  word-wrap: break-word;
}

.feed-info-label-small {
  max-width: fit-content;
  cursor: pointer;
  color: v-bind('theme.subduedmessage');
}

.subscription-label {
  margin-top: .31rem;
  margin-bottom: .31rem;
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
  border: 1px solid transparent;
}

.link:hover, .link:focus-visible {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.feed-info-details {
  padding-top: .44rem;
  overflow: auto;
  max-height: 25svh;
}
</style>
