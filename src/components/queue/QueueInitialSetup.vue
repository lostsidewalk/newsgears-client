<template>
  <v-card>
    <v-card-title
      class="text-center"
      :class="pa4r"
    >
      <h3>
        <v-icon icon="fa-rss" />
        {{ $t("queueInitialSetup") }}
      </h3>
    </v-card-title>
    <v-card-subtitle
      class="text-center"
      :class="pa4r"
    >
      {{ $t("queueInitialSetup_details") }}
    </v-card-subtitle>
    <v-divider />
    <v-card-text>
      <v-sheet
        align="left"
        justify="center"
        class="d-flex flex-column"
        style="gap: 1rem;"
      >
        <!-- add subscription -->
        <v-card
          elevation="1"
          @click="
            $emit('openQueueConfigPanel', {
              queueId: queueStore.selectedQueueId,
            })
          "
        >
          <v-card-title>
            <v-icon icon="fa-link" />
            {{ t("clickHereToAddANewSubscription") }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            {{ t("clickHereToAddANewSubscription_detail") }}
          </v-card-text>
        </v-card>
        <!-- upload OPML -->
        <v-card
          elevation="1"
          @click="$emit('uploadOpml')"
        >
          <v-card-title>
            <v-icon icon="fa-file" />
            {{ t("clickHereToUploadOPML") }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            {{ t("clickHereToUploadOPML_detail") }}
          </v-card-text>
          <v-card-text>
            {{ t("clickHereToUploadOPML_detail1") }}
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-card-text>
    <v-divider />
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
import { useI18n } from "vue-i18n";
import { useQueues } from "@/composable/useQueues";
import spacingMixin from "@/mixins/spacingMixin";
import buttonSizeMixin from "@/mixins/buttonSizeMixin";

export default {
  mixins: [spacingMixin, buttonSizeMixin],
  props: {
    baseUrl: { type: String, required: true },
  },
  emits: [
    "openQueueConfigPanel",
    "uploadOpml",
    "dismiss",
  ],
  setup(props) {
    const { t } = useI18n();
    const { queueStore } = useQueues(props);

    return {
      t,
      queueStore,
    };
  },
};
</script>
