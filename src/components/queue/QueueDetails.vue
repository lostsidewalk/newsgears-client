<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-sheet>
    <!-- TODO: extract recent article list compoennt -->
    <!-- article list -->
    <v-card
      v-if="recentArticleList"
      :class="ma4r"
    >
      <v-card-title>
        {{ $t('recentArticles') }}
      </v-card-title>
      <v-card-text>
        <v-data-table
          class="overflow-auto flex-grow-1"
          style="white-space: nowrap;"
          :headers="recentArticleHeaders"
          :items="recentArticleDataTableItems"
          item-value="id"
          density="compact"
          hover
        />
      </v-card-text>
    </v-card>
    <!-- TODO: extract queue subscription details component -->
    <!-- subscriptions -->
    <v-card :class="ma4r">
      <v-card-title>
        {{ $t('subscriptions') }}
      </v-card-title>
      <v-card-text>
        <v-data-table
          class="overflow-auto flex-grow-1"
          style="white-space: nowrap;"
          :headers="subscriptionHeaders"
          :items="subscriptionDataTableItems"
          item-value="id"
          density="compact"
          hover
        >
          <template #item="{ item }">
            <tr
              class="clickable"
              @click.stop="$emit('updateFilter', {
                name: 'subscription',
                queueId: item.queueId,
                value: item.id,
              })"
            >
              <td align="left">
                {{ item.id }}
              </td>
              <td class="d-flex flex-row">
                <v-img
                  v-if="item.image"
                  class="ma-2"
                  :src="item.image.url"
                  :alt="$t('feedLogoImage')"
                  width="48"
                  max-width="48"
                  max-height="48"
                />
                <v-img
                  v-else
                  class="ma-2"
                  src="rss_logo.svg"
                  :alt="$t('rssLogo')"
                  width="48"
                  max-width="48"
                  max-height="48"
                />
                <v-label>
                  {{ item.title ? item.title : item.url }}
                </v-label>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
import { computed } from 'vue';
import { useTimestamp } from '@/composable/useTimestamp.js';
import { useI18n } from 'vue-i18n';

import buttonSizeMixin from '@/mixins/buttonSizeMixin';
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "QueueDetails",
  mixins: [buttonSizeMixin, spacingMixin],
  props: {
    subscriptions: { type: Array, required: true },
    recentArticleList: { type: Array, default: null },
  },
  emits: ["updateFilter", "showSubscriptionMetrics"],
  setup (props, { emit }) {
    const { formatTimestamp } = useTimestamp();

    const { t } = useI18n();

    const recentArticleHeaders = computed(() => {
      return [
        { title: t('postTitle'), value: 'postTitle' },
        { title: t('postTimestamp'), value: 'publishTimestamp' }
      ];
    });

    const recentArticleDataTableItems = computed(() => {
      let d = props.recentArticleList.map(a => {
        // t/f if the article has a non-empty title property 
        let hasTitle = a.postTitle != null && a.postTitle.value && a.postTitle.value.length > 0;
        // t/f if the article has a non-empty HTML title 
        let isHtmlTitle = hasTitle && 
          a.postTitle.type != null && a.postTitle.type.toLowerCase().indexOf('html') >= 0;
        // t/f if the article has a non-empty description property 
        let hasDesc = a.postDesc != null && a.postDesc.value && a.postDesc.value.length > 0;
        // t/f if the article has a non-empty HTML description 
        let isHtmlDesc = hasDesc && 
          a.postDesc.type != null && a.postDesc.type.toLowerCase().indexOf('html') >= 0;
        return {
          postTitle: hasTitle ?
            (isHtmlTitle ? t('htmlNotShownHere') : a.postTitle.value) :
            (hasDesc ?
              (isHtmlDesc ? t('htmlNotShownHere') : a.postDesc.value) :
              t('noPostTitle')),
          publishTimestamp: a.publishTimestamp ? formatTimestamp(a.publishTimestamp) : t('noPublishTimestamp'),
        }
      });
      return d;
    });

    const subscriptionHeaders = computed(() => {
      return [
        { title: t('id'), value: 'id' },
        { title: t('subscriptionName'), value: 'name' },
      ];
    });

    const subscriptionDataTableItems = computed(() => {
      let dataTableItems = [];
      for (let i = 0; i < props.subscriptions.length; i++) {
        let subscription = props.subscriptions[i];
        dataTableItems.push({
          id: subscription.id, 
          image: subscription.image,
          title: subscription.title, 
          subscriptionMetrics: subscription.subscritionMetrics, 
          queueId: subscription.queueId,
        })
      }

      return dataTableItems;
    });

        // shown on hover 
    function buildMetricStatusMessage(subscriptionMetrics) {
      if (subscriptionMetrics) {
        let m = getMostRecentMetric(subscriptionMetrics);
        // 
        let metricStatusMessage = t("importerRanAt", { importTimestamp: formatTimestamp(m.importTimestamp) }); // 'Importer ran at ' + m.importTimestamp;
        // add the persist ct to the metric status message 
        if (m.persistCt > 0) {
          metricStatusMessage = metricStatusMessage + "\n" + t("nNewArticlesSaved", { n: m.persistCt }); // m.persistCt + ' new articles saved';;
        }
        if (m.archiveCt > 0) {
          metricStatusMessage = metricStatusMessage + "\n" + t("nArticlesArchived", { n: m.archiveCt }); // m.archiveCt + ' articles archived';
        }
        // add the http status code, http status message, redirect status code, redirect status message to the metric status message, if any 
        if (m.httpStatusCode && m.httpStatusCode > 0) {
          metricStatusMessage = metricStatusMessage + "\n" + t("httpStatus", {
            httpStatusCode: m.httpStatusCode,
            httpStatusMessage: m.httpStatusMessage
          });
          if (m.redirectFeedUrl) {
            metricStatusMessage = metricStatusMessage + "\n" + t("redirectedTo", {
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
        return t("metricsNotYetAvailable");
      }
    }

    function hasSubscriptionMetrics(subscription) {
      return subscription.subscriptionMetrics && subscription.subscriptionMetrics.length > 0;
    }

    // shown next to the RSS/ATOM icon 
    function buildImportCtMessage(subscriptionMetrics) {
      let m = getMostRecentMetric(subscriptionMetrics);
      if (m) {
        return "+" + (m.persistCt > 0 ? m.persistCt : 0);
      }
      return "-";
    }

    function getMostRecentMetric(subscriptionMetrics) {
      if (subscriptionMetrics) {
        let mostRecentMetric = null;
        for (let i = 0; i < subscriptionMetrics.length; i++) {
          let f = subscriptionMetrics[i];
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
    }

    function openSubscriptionMetrics(subscription) {
      emit('showSubscriptionMetrics', subscription);
    }

    return {
      formatTimestamp,
      recentArticleHeaders,
      recentArticleDataTableItems,
      subscriptionHeaders,
      subscriptionDataTableItems,
      // 
      buildMetricStatusMessage,
      hasSubscriptionMetrics,
      buildImportCtMessage,
      openSubscriptionMetrics,
    }
  },
}
</script>
