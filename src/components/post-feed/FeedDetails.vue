<template>
  <v-sheet>
    <v-card class="ma-4">
      <!-- subscriptions label -->
      <v-card-title>
        {{ $t('subscriptions') }}
      </v-card-title>
      <!-- subscriptions -->
      <v-divider />
      <v-alert
        v-if="shouldShowAlert('theseAreYourSubscriptions')"
        closable
        variant="outlined"
        border="top"
        icon="fa-question-circle"
        :text="$t('theseAreYourSubscriptions')"
        class="ma-4"
        @click.close="dismissAlert('theseAreYourSubscriptions')"
      />
      <v-list>
        <v-list-item
          v-for="rssAtomFeedUrl of rssAtomFeedUrls"
          :key="rssAtomFeedUrl"
          class="ma-2 pa-2"
        >
          <template #title>
            <v-label class="ml-2 clickable">
              {{ rssAtomFeedUrl.title ? rssAtomFeedUrl.title : rssAtomFeedUrl.feedUrl }}
            </v-label>
          </template>
          <template #subtitle>
            <v-divider class="ml-2 mb-1 mt-1" />
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
              class="ma-2"
              src="rss_logo.svg"
              :alt="$t('rssLogo')"
              width="48"
              max-width="48"
              max-height="48"
            />
          </template>
          <v-list-item-action class="ml-2">
            <v-btn
              :size="buttonSize"
              class="mr-2"
              variant="outlined"
              :text="buildImportCtMessage(rssAtomFeedUrl.feedMetrics)"
              :title="buildMetricStatusMessage(rssAtomFeedUrl.feedMetrics)"
              @click.prevent="hasFeedMetrics(rssAtomFeedUrl) ? openQueryMetrics(rssAtomFeedUrl) : false"
            />
            <v-btn
              :size="buttonSize"
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
      <v-alert
        v-if="shouldShowAlert('theseAreYourPublications')"
        closable
        variant="outlined"
        border="top"
        icon="fa-question-circle"
        :text="$t('theseAreYourPublications')"
        class="ma-4"
        @click.close="dismissAlert('theseAreYourPublications')"
      />
      <v-card-actions>
        <v-btn-group>
          <v-btn
            :size="buttonSize"
            label
            :href="jsonPubUrl"
          >
            <v-icon
              start
              icon="fa-link"
            /> JSON
          </v-btn>
          <v-btn
            :size="buttonSize"
            label
            :href="rssPubUrl"
          >
            <v-icon
              start
              icon="fa-link"
            /> RSS
          </v-btn>
          <v-btn
            :size="buttonSize"
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
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "FeedDetails",
  mixins: [buttonSizeMixin],
  props: {
    rssAtomFeedUrls: { type: Array, required: true },
    jsonPubUrl: { type: String, required: true },
    rssPubUrl: { type: String, required: true },
    atomPubUrl: { type: String, required: true },
  },
  emits: ["updatePostFeedFilter", "showQueryMetrics"],
  methods: {
    shouldShowAlert(alertName) {
      return !localStorage.getItem(alertName);
    },
    dismissAlert(alertName) {
      localStorage.setItem(alertName, new Date().toISOString());
    },
    // shown on hover 
    buildMetricStatusMessage(feedMetrics) {
      if (feedMetrics) {
        let m = this.getMostRecentMetric(feedMetrics);
        // 
        let metricStatusMessage = this.$t("importerRanAt", { importTimestamp: this.formatTimestamp(m.importTimestamp) }); // 'Importer ran at ' + m.importTimestamp;
        // add the persist ct to the metric status message 
        if (m.persistCt > 0) {
          metricStatusMessage = metricStatusMessage + "\n" + this.$t("nNewArticlesSaved", { n: m.persistCt }); // m.persistCt + ' new articles saved';;
        }
        if (m.archiveCt > 0) {
          metricStatusMessage = metricStatusMessage + "\n" + this.$t("nArticlesArchived", { n: m.archiveCt }); // m.archiveCt + ' articles archived';
        }
        // add the http status code, http status message, redirect status code, redirect status message to the metric status message, if any 
        if (m.httpStatusCode && m.httpStatusCode > 0) {
          metricStatusMessage = metricStatusMessage + "\n" + this.$t("httpStatus", {
            httpStatusCode: m.httpStatusCode,
            httpStatusMessage: m.httpStatusMessage
          });
          if (m.redirectFeedUrl) {
            metricStatusMessage = metricStatusMessage + "\n" + this.$t("redirectedTo", {
              redirectFeedUrl: m.redirectFeedUrl,
              redirectHttpStatusCode: m.redirectHttpStatusCode,
              redirectHttpStatusMessage: m.redirectHttpStatusMessage
            });
          }
        }
        // add query exception message, if any 
        if (m.queryExceptionTypeMessage) {
          // TODO: (translation) translate queryExceptionTypeMessage 
          metricStatusMessage = metricStatusMessage + "\n" + m.queryExceptionTypeMessage;
        }
        return metricStatusMessage;
      }
      else {
        // default response 
        return this.$t("metricsNotYetAvailable");
      }
    },
    hasFeedMetrics(rssAtomFeedUrl) {
      return rssAtomFeedUrl.feedMetrics && rssAtomFeedUrl.feedMetrics.length > 0;
    },
    // shown next to the RSS/ATOM icon 
    buildImportCtMessage(feedMetrics) {
      let m = this.getMostRecentMetric(feedMetrics);
      if (m) {
        return "+" + (m.persistCt > 0 ? m.persistCt : 0);
      }
      return "-";
    },
    getMostRecentMetric(feedMetrics) {
      if (feedMetrics) {
        let mostRecentMetric = null;
        for (let i = 0; i < feedMetrics.length; i++) {
          let f = feedMetrics[i];
          if (!mostRecentMetric) {
            mostRecentMetric = f;
          } else {
            if (new Date(f.importTimestamp) - new Date(mostRecentMetric.importTimestamp) > 0) {
              mostRecentMetric = f;
            }
          }
        }
        return mostRecentMetric;
      }
      return null;
    },
    openQueryMetrics(rssAtomFeedUrl) {
      this.$emit('showQueryMetrics', rssAtomFeedUrl);
    },
    formatTimestamp(timestamp) {
      if (!timestamp) {
        return null;
      }
      try {
        let d = new Date(Date.parse(timestamp));
        return d.toLocaleString();
      }
      catch (error) {
        console.debug("Unable to format timestamp due to: " + error);
      }
    }
  }
}
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>