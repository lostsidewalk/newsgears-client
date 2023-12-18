<template>
  <v-card>
    <v-card-title
      class="text-center"
      :class="pa4r"
    >
      {{ $t("subscriptionMetrics") }}
    </v-card-title>
    <v-card-subtitle>
      {{ title }}
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        class="overflow-auto flex-grow-1"
        :class="ma4r"
        style="white-space: nowrap"
        :headers="headers"
        :items="dataTableItems"
        items-per-page="-1"
        density="compact"
        hover
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        :size="buttonSize"
        :text="$t('dismiss')"
        @click="$emit('dismiss')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTimestamp } from "@/composable/useTimestamp.js";
import buttonSizeMixin from "@/mixins/buttonSizeMixin";
import spacingMixin from "@/mixins/spacingMixin";

export default {
  name: "SubscriptionMetrics",
  mixins: [buttonSizeMixin, spacingMixin],
  props: {
    title: { type: String, required: true },
    subscriptionMetrics: { type: Array, required: true },
  },
  emits: ["dismiss"],
  setup(props) {
    const { formatTimestamp } = useTimestamp();

    const { t } = useI18n();

    const headers = computed(() => {
      return [
        { title: t("timestamp"), value: "timestamp" },
        { title: t("message"), value: "message" },
        { title: t("httpStatusLabel"), value: "httpStatusLabel" },
        { title: t("httpRedirect"), value: "httpRedirect" },
        { title: t("error"), value: "error" },
      ];
    });

    const dataTableItems = computed(() => {
      let dataTableItems = [];
      for (let i = 0; i < props.subscriptionMetrics.length; i++) {
        let subscriptionMetric = props.subscriptionMetrics[i];

        let message = "";
        if (
          subscriptionMetric.importCt > 0 &&
          subscriptionMetric.persisCt > 0 &&
          subscriptionMetric.archiveCt > 0
        ) {
          message = t("importedPersistedAndArchived", {
            importCt: subscriptionMetric.importCt,
            persistCt: subscriptionMetric.persistCt,
            archiveCt: subscriptionMetric.archiveCt,
          });
        } else if (subscriptionMetric.importCt > 0 && subscriptionMetric.persisCt > 0) {
          message = t("importedPersisted", {
            importCt: subscriptionMetric.importCt,
            persistCt: subscriptionMetric.persistCt,
          });
        } else if (subscriptionMetric.importCt > 0 && subscriptionMetric.archiveCt > 0) {
          message = t("importedAndArchived", {
            importCt: subscriptionMetric.importCt,
            archiveCt: subscriptionMetric.archiveCt,
          });
        } else if (subscriptionMetric.importCt > 0) {
          message = t("importedNArticles", {
            n: subscriptionMetric.importCt,
          });
        }

        dataTableItems.push({
          timestamp: formatTimestamp(subscriptionMetric.importTimestamp),
          message: message,
          httpStatusLabel: t("httpStatus", {
            httpStatusCode: subscriptionMetric.httpStatusCode,
            httpStatusMessage: subscriptionMetric.httpStatusMessage,
          }),
          httpRedirect: subscriptionMetric.redirectFeedUrl
            ? t("redirectedTo", {
                redirectFeedUrl: subscriptionMetric.redirectFeedUrl,
                redirectHttpStatusCode:
                  subscriptionMetric.redirectHttpStatusCode,
                redirectHttpStatusMessage:
                  subscriptionMetric.redirectHttpStatusMessage,
              })
            : t("NONE"),
          error: subscriptionMetric.queryExceptionTypeMessage
            ? subscriptionMetric.queryExceptionTypeMessage
            : t("NONE"),
        });
      }
      return dataTableItems;
    });

    return {
      formatTimestamp,
      headers,
      dataTableItems,
    };
  },
};
</script>
