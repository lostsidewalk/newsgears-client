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
        <img v-if="feed.imgSrc" class="feed-image" :src="'data:image/png;base64,' + feed.imgSrc">
        <div class="feed-info-wrapper">
          <!-- inbound / published count -->
          <label class="feed-info-label"><i class="fa fa-eye"></i> {{ this.inboundCount }}</label>
          <label class="feed-info-label"><i class="fa fa-star"></i> {{ this.publishedCount }}</label>
          <!-- <label class="feed-info-label">{{ feed.title }}</label>
          <label class="feed-info-label">{{ feed.description }}</label> -->
        </div>
      </div>
      <!-- show more/less information (also selects the feed) -->
      <a class="feed-info-label-small link" @click.stop="toggleMoreInformation()" @keypress.enter.prevent="toggleMoreInformation()" tabindex="0">
        Show {{ this.showMoreInformation ? 'less' : 'more' }}
      </a>
      <!-- more information -->
      <div v-if="this.showMoreInformation" class="feed-info-details">
        <!-- subscriptions -->
        <label class="feed-info-label-small">SUBSCRIPTIONS</label>
        <!-- NewsApiV2 -->
        <label class="feed-info-label" v-if="feed.newsApiV2QueryText">
          <img src="newsapiv2_logo.png" /> {{ feed.newsApiV2QueryText }}
        </label>
        <!-- RSS/ATOM feeds -->
        <a class="feed-info-label feed-info-label-small link" v-if="feed.rssAtomFeedUrls.length === 0" href="#" @click="this.$emit('rssAtomUrlQuickAdd', feed.id)" tabindex="0">
          + Add RSS/ATOM subscription
        </a>
        <label class="feed-info-label" v-for="rssAtomFeedUrl of feed.rssAtomFeedUrls" :key="rssAtomFeedUrl" :title="rssAtomFeedUrl.feedUrl ? rssAtomFeedUrl.feedUrl : false">
          <!-- RSS logo -->
          <img src="rss_logo.svg" /> 
          <!-- last http status -->
          <span v-if="hasFeedMetrics(rssAtomFeedUrl)" :title='buildMetricStatusMessage(rssAtomFeedUrl.feedMetrics)'>
            {{ buildImportCtMessage(rssAtomFeedUrl.feedMetrics) }}
          </span>
          <!-- feed title w/direct link -->
            <a class="link" :href="rssAtomFeedUrl.feedUrl" :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
            {{ rssAtomFeedUrl.feedTitle ? rssAtomFeedUrl.feedTitle : rssAtomFeedUrl.feedUrl }}
          </a>
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
  padding-top: .125rem;
  padding-bottom: .125rem;
  cursor: pointer;
}

.feed-info-wrapper {
  flex-direction: row;
  display: flex;
  padding-left: .31rem;
  cursor: pointer;
  align-items: flex-start;
}

.feed-info-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  overflow-wrap: anywhere;
  padding: .31rem;
  gap: .31rem;
  overflow-wrap: break-word;
}

.feed-info-label > img {
  max-height: 24px;
  max-width: 24px;
  padding-right: .31rem;
}

.feed-info-label > span {
  padding-right: .31rem;
  word-wrap: break-word;
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
  padding: .31rem;
  flex-direction: column;
  align-items: flex-start;
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

.link:focus, .link:hover {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.feed-info-details {
  padding-top: .31rem;
  overflow: auto;
}
</style>
