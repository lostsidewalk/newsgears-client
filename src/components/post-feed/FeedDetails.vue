<template>
  <v-sheet>
    <v-card
      v-if="rssAtomFeedUrls && rssAtomFeedUrls.length > 0"
      class="ma-4"
    >
      <!-- subscriptions label -->
      <v-card-title>
        {{ $t('subscriptions') }}
      </v-card-title>
      <!-- subscriptions -->
      <v-divider />
      <v-list>
        <v-list-item
          v-for="rssAtomFeedUrl of rssAtomFeedUrls"
          :key="rssAtomFeedUrl"
          class="ma-2 pa-2"
          :title="rssAtomFeedUrl.title ? rssAtomFeedUrl.title : rssAtomFeedUrl.feedUrl"
        >
          <template #subtitle>
            {{ rssAtomFeedUrl.feedUrl }}
            <v-divider class="mb-1 mt-1" />
          </template>
          <template #prepend>
            <!-- feed logo image -->
            <v-img
              v-if="rssAtomFeedUrl.image" 
              class="ma-2"
              :src="rssAtomFeedUrl.image.url"
              :alt="$t('feedLogoImage')" 
              width="48" 
              max-width="48"
              max-height="48"
            /> 
            <!-- RSS logo -->
            <v-img
              v-else 
              src="rss_logo.svg" 
              :alt="$t('rssLogo')" 
              width="48" 
              max-width="48"
              max-height="48"
            /> 
          </template>
          <v-list-item-action>
            <!-- TODO: click here should go to subscriptions config -> RSS feed metrics for this sub -->
            <v-btn
              size="x-small"
              class="mr-2"
              variant="outlined"
              :text="buildImportCtMessage(rssAtomFeedUrl.feedMetrics)" 
              :title="buildMetricStatusMessage(rssAtomFeedUrl.feedMetrics)"
            />
            <v-btn
              size="x-small"
              class="border-0"
              variant="outlined"
              icon="fa-filter"
              @click.stop="$emit('updatePostFeedFilter', {
                name: 'subscription', 
                feedId: rssAtomFeedUrl.feedId,
                value: rssAtomFeedUrl.title,
              })"
            />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card class="ma-4">
      <!-- publications label -->
      <v-card-title>
        {{ $t('publications') }}
      </v-card-title>
      <v-divider />
      <v-card-actions>
        <v-btn-group>
          <v-btn
            label
            :href="jsonPubUrl"
          >
            <v-icon
              start
              icon="fa-link"
            /> JSON
          </v-btn>
          <v-btn
            label
            :href="rssPubUrl"
          >
            <v-icon
              start
              icon="fa-link"
            /> RSS
          </v-btn>
          <v-btn
            label
            :href="atomPubUrl"
          >
            <v-icon
              start
              icon="fa-link"
            /> ATOM
          </v-btn>
        </v-btn-group>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: "FeedDetails",
  props: {
    rssAtomFeedUrls: { type: Array, required: true },
    jsonPubUrl: { type: String, required: true },
    rssPubUrl: { type: String, required: true },
    atomPubUrl: { type: String, required: true },
  },
  emits: ["updatePostFeedFilter"], 
  methods: {
    // shown on hover 
    buildMetricStatusMessage(feedMetrics) {
      if (feedMetrics) {
        let m = this.getMostRecentMetric(feedMetrics);
        // 
        let metricStatusMessage = this.$t('importerRanAt', { importTimestamp: m.importTimestamp }); // 'Importer ran at ' + m.importTimestamp;
        // add the persist ct to the metric status message 
        if (m.persistCt > 0) {
          metricStatusMessage = metricStatusMessage + '\n' + this.$t('nNewArticlesSaved', { n: m.persistCt }); // m.persistCt + ' new articles saved';;
        }
        if (m.archiveCt > 0) {
          metricStatusMessage = metricStatusMessage + '\n' + this.$t('nArticlesArchived', { n: m.archiveCt }); // m.archiveCt + ' articles archived';
        }
        // add the http status code, http status message, redirect status code, redirect status message to the metric status message, if any 
        if (m.httpStatusCode && m.httpStatusCode > 0) {
          metricStatusMessage = metricStatusMessage + '\n' + this.$t('httpStatus', { 
            httpStatusCode: m.httpStatusCode, 
            httpStatusMessage: m.httpStatusMessage 
          });
          if (m.redirectFeedUrl) {
            metricStatusMessage = metricStatusMessage + '\n' + this.$t('redirectedTo', { 
              redirectFeedUrl: m.redirectFeedUrl, 
              redirectHttpStatusCode: m.redirectHttpStatusCode, 
              redirectHttpStatusMessage: m.redirectHttpStatusMessage
            });
          }
        }
        // add query exception message, if any 
        if (m.queryExceptionTypeMessage) {
          // TODO: (translation) translate queryExceptionTypeMessage 
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
      if (m) {
        return '+' + (m.persistCt > 0 ? m.persistCt : 0);
      }
      return '';
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
