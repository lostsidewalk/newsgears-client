<template>
  <v-card>
    <v-card-title class="pa-4 text-center">
      {{ $t("subscriptionMetrics") }}
    </v-card-title>
    <v-card-subtitle>
      {{ title }}
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        class="ma-4 overflow-auto flex-grow-1"
        style="white-space: nowrap"
        :headers="headers"
        :items="dataTableItems"
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

export default {
  name: "SubscriptionMetrics",
  mixins: [buttonSizeMixin],
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
