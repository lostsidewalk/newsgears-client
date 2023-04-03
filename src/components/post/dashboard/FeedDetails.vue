<template>
  <div class="feed-info-details">
    <!-- subscriptions label -->
    <label class="feed-info-label-small" v-if="this.rssAtomFeedUrls && this.rssAtomFeedUrls.length > 0">
      {{ this.$t('subscriptions') }}
    </label>
    <!-- subscriptions -->
    <label class="feed-info-label subscription-label" 
      v-for="rssAtomFeedUrl of this.rssAtomFeedUrls" :key="rssAtomFeedUrl" 
      :title='buildMetricStatusMessage(rssAtomFeedUrl.feedMetrics)'>
      <!-- feed logo image -->
      <img v-if="rssAtomFeedUrl.image" :src="rssAtomFeedUrl.image.url" :alt="this.$t('feedLogoImage')" /> 
      <!-- RSS logo -->
      <img v-else src="rss_logo.svg" :alt="this.$t('rssLogo')" /> 
      <!-- last http status -->
      <span v-if="hasFeedMetrics(rssAtomFeedUrl)">
        {{ buildImportCtMessage(rssAtomFeedUrl.feedMetrics) }}
      </span>
      <!-- feed title/URL -->
      <a class="link" href="#"
        @click.stop="this.$emit('updatePostFeedFilter', { name: 'subscriptionId', value: rssAtomFeedUrl.id, feed: rssAtomFeedUrl })" 
        @keypress.enter.prevent="feed.showMoreInformation = !feed.showMoreInformation" 
        tabindex="0">
        {{ rssAtomFeedUrl.title ? rssAtomFeedUrl.title.value : rssAtomFeedUrl.feedUrl }}
      </a>
    </label>
    <!-- publications -->
    <label class="feed-info-label-small">
      {{ this.$t('publications') }}
    </label>
    <button class="helptext fa fa-question" :title="this.$t('starredArticlesAvailableHere')"/>
    <label class="feed-info-label subscription-label">
      <a class="link" 
        :href="this.jsonPubUrl" 
        target="_blank"
        :disabled="disabled">
        <span class="fa fa-link fa-1x" />
      </a>
      JSON
    </label>
    <label class="feed-info-label subscription-label">
      <a class="link" 
        :href="this.rssPubUrl" 
        target="_blank"
        :disabled="disabled">
        <span class="fa fa-link fa-1x" />
      </a>
      RSS
    </label>
    <label class="feed-info-label subscription-label">
      <a class="link" 
        :href="this.atomPubUrl" 
        target="_blank"
        :disabled="disabled">
        <span class="fa fa-link fa-1x" />
      </a>
      ATOM
    </label>
  </div>
</template>

<script>
export default {
  name: "FeedDetails",
  props: ["rssAtomFeedUrls", "jsonPubUrl", "rssPubUrl", "atomPubUrl", "disabled", "theme"],
  emits: ["updatePostFeedFilter"], 
  methods: {
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
    hasFeedMetrics(rssAtomFeedUrl) {
      return rssAtomFeedUrl.feedMetrics && rssAtomFeedUrl.feedMetrics.length > 0;
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
  },
}
</script>

<style scoped>
.feed-info-details {
  display: block !important;
  text-align: left !important;
  /* color: v-bind('theme.buttonfg'); */
  padding: .44rem;
  cursor: pointer;
  text-align: center;
  align-self: start;
  user-select: none;
  z-index: 0;
}

.feed-info-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: .44rem;
  gap: .44rem;
  overflow-wrap: break-word;
  word-break: break-word;
  font-family: Arial, Helvetica, sans-serif;
  color: v-bind('theme.normalmessage');
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
  font-family: Arial, Helvetica, sans-serif;
}

.subscription-label {
  margin-top: .31rem;
  margin-bottom: .31rem;
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
</style>