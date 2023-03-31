<template>
  <button class="feed-select" 
    :value="feed.value" 
    :key="feed.value" 
    :disabled="disabled">
    <div class="feed-select-underlay">
      <!-- feed name -->
      <label class="feed-select-label">
        {{ feed.label }}
      </label>
      <!-- card -->
      <!-- TODO: component -->
      <div class="feed-image-wrapper">
        <img v-if="feed.imgSrc" class="feed-image" :src="'data:image/png;base64,' + feed.imgSrc" :alt="this.$t('queueLogoImage')">
        <img v-else class="feed-image" src="feedgears.png" :alt="this.$t('queueLogoImage')">
        <div class="feed-info-wrapper">
          <label class="feed-info-label">
            <span class="fa fa-eye" /> {{ this.inboundCount }}
          </label>
          <label class="feed-info-label">
            <span class="fa fa-star" /> {{ this.publishedCount }}
          </label>
        </div>
      </div>
      <!-- show more/less information (also selects the feed) -->
      <a v-if="this.showMoreInformation || (this.feed.rssAtomFeedUrls && this.feed.rssAtomFeedUrls.length > 0)" 
        class="feed-info-label-small link" 
        @click.stop="toggleMoreInformation()" 
        @keypress.enter.prevent="toggleMoreInformation()" 
        tabindex="0">
        {{ this.showMoreInformation ? this.$t('hideMoreInfo') : this.$t('showMoreInfo') }}
      </a>
      <span v-if="(!this.feed.rssAtomFeedUrls || this.feed.rssAtomFeedUrls.length === 0)">
        {{ this.$t('zeroSubscriptions') }}
      </span>
      <!-- more information -->
      <!-- TODO: component -->
      <div v-if="this.feed.rssAtomFeedUrls" v-show="this.showMoreInformation" class="feed-info-details">
        <!-- subscriptions -->
        <label class="feed-info-label-small">
          {{ this.$t('subscriptions') }}
        </label>
        <!-- RSS/ATOM feeds -->
        <label class="feed-info-label subscription-label" 
          v-for="rssAtomFeedUrl of this.feed.rssAtomFeedUrls" :key="rssAtomFeedUrl" 
          :title='buildMetricStatusMessage(rssAtomFeedUrl.feedMetrics)'>
          <!-- feed logo image -->
          <img v-if="rssAtomFeedUrl.image" :src="rssAtomFeedUrl.image.url" :alt="this.$t('feedLogoImage')" /> 
          <!-- RSS logo -->
          <img v-else src="rss_logo.svg" :alt="this.$t('rssLogo')" /> 
          <!-- last http status -->
          <span v-if="hasFeedMetrics(rssAtomFeedUrl)">
            {{ buildImportCtMessage(rssAtomFeedUrl.feedMetrics) }}
          </span>
          <!-- feed title w/direct link -->
          {{ rssAtomFeedUrl.title ? rssAtomFeedUrl.title.value : rssAtomFeedUrl.feedUrl }}
        </label>
        <!-- publications -->
        <label class="feed-info-label-small">
          {{ this.$t('publications') }}
        </label>
        <button class="helptext fa fa-question" :title="this.$t('starredArticlesAvailableHere')"/>
        <label class="feed-info-label subscription-label">
          <a class="link" 
            :href="this.feedUrl + '/feed/json/' + this.feed.transportIdent" 
            target="_blank"
            :disabled="disabled">
            <span class="fa fa-link fa-1x" />
          </a>
          JSON
        </label>
        <label class="feed-info-label subscription-label">
          <a class="link" 
            :href="this.feedUrl + '/feed/rss/' + this.feed.transportIdent" 
            target="_blank"
            :disabled="disabled">
            <span class="fa fa-link fa-1x" />
          </a>
          RSS
        </label>
        <label class="feed-info-label subscription-label">
          <a class="link" 
            :href="this.feedUrl + '/feed/atom/' + this.feed.transportIdent" 
            target="_blank"
            :disabled="disabled">
            <span class="fa fa-link fa-1x" />
          </a>
          ATOM
        </label>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: "FeedSelectButton",
  props: ["feed", "feedUrl", "inboundCount", "publishedCount", "disabled", "theme"],
  methods: {
    hasFeedMetrics(rssAtomFeedUrl) {
      return rssAtomFeedUrl.feedMetrics && rssAtomFeedUrl.feedMetrics.length > 0;
    },
    // shown on hover 
    buildMetricStatusMessage(feedMetrics) {
      if (feedMetrics) {
        let m = this.getMostRecentMetric(feedMetrics);

        // TODO: interpolated string 
        let metricStatusMessage = 'Importer ran at ' + m.importTimestamp;
        // add the persist ct to the metric status message 
        if (m.persistCt > 0) {
          let persistMessage = m.persistCt + ' new articles saved';
          metricStatusMessage = metricStatusMessage + '\n' + persistMessage;
        }
        if (m.archiveCt > 0) {
          let archiveMessage = m.archiveCt + ' articles archived';
          metricStatusMessage = metricStatusMessage + '\n' + archiveMessage;
        }
        // add the http status code, http status message, redirect status code, redirect status message to the metric status message, if any 
        if (m.httpStatusCode && m.httpStatusCode > 0) {
          // e.g.: HTTP 302 (Moved), redirected to https://whatever.com/feed (HTTP 200 OK)
          let httpStatusMessage = m.httpStatusCode + ' (' + m.httpStatusMessage + ')' + (m.redirectFeedUrl ? (', redirected to ' + m.redirectFeedUrl + ' (' + m.redirectHttpStatusCode + ' ' + m.redirectHttpStatusMessage + ')') : '')
          metricStatusMessage = metricStatusMessage + '\n' + httpStatusMessage;
        }
        // add query exception message, if any 
        if (m.queryExceptionTypeMessage) {
          metricStatusMessage = metricStatusMessage + '\n' + m.queryExceptionTypeMessage;
        }
        return metricStatusMessage;
      } else {
        // default response 
        return this.$t('metricsNotYetAvailable');
      }
    },
    // shown next to the RSS/ATOM icon 
    buildImportCtMessage(feedMetrics) {
      let m = this.getMostRecentMetric(feedMetrics);
      return '+' + (m.persistCt > 0 ? m.persistCt : 0);
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
  border-radius: 4px;
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
  word-break: keep-all;
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
  border: 1px solid transparent;
  border-radius: 4px;
  width: 35px;
  height: 35px;
  max-width: 35px;
  max-height: 35px;
  display: inline-block; 
  background-size: cover; 
  background-position: center center;
  background-repeat: no-repeat;
  align-self: stretch;
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

.helptext {
  background-color: unset;
  border: 1px solid v-bind('theme.buttonborder');
  color: v-bind('theme.buttonfg');;
  cursor: help;
  border-radius: 4px;
  text-align: center;
  margin-top: .125rem;
  margin-left: .44rem;
}
</style>
