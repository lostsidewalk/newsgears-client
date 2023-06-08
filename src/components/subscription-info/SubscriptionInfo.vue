<template>
  <v-card>
    <!-- title -->
    <v-card-title
      class="clickable"
    >
      {{ info.title ? info.title : info.url }}
    </v-card-title>
    <v-divider />
    <!-- icon -->
    <v-card-subtitle>
      <v-img
        v-if="info.icon"
        class="mt-4 rounded h-auto" 
        :src="info.icon.url" 
        :title="info.icon.title" 
        :alt="$t('feedLogoImage')" 
        width="128" 
        max-width="128"
        max-height="128"
      />
      <v-img
        v-if="info.image && !info.icon"
        class="mt-4 rounded h-auto" 
        :src="info.image.url" 
        :title="info.image.title" 
        :alt="$t('feedLogoImage')" 
        width="128" 
        max-width="128"
        max-height="128"
      />
    </v-card-subtitle>
    <!-- description -->
    <v-card-text v-if="info.description">
      {{ info.description ? info.description.value : '' }}
    </v-card-text>
    <!-- chips -->
    <v-card-text>
      <v-chip-group v-if="hasChips">
        <!-- author -->
        <v-chip
          v-if="info.author"
          class="ma-1"
          label
          :ripple="false"
          variant="text"
        >
          {{ $t('authorColon') }} {{ info.author }}
        </v-chip>
        <!-- copyright -->
        <v-chip
          v-if="info.copyright"
          class="ma-1"
          label
          :ripple="false"
          variant="text"
        >
          {{ info.copyright }}
        </v-chip>
        <!-- published date -->
        <v-chip
          v-if="info.publishedDate"
          class="ma-1"
          label
          :ripple="false"
          variant="text"
        >
          {{ $t('lastPublishedColon') }} {{ formatTimestamp(info.publishedDate) }}
        </v-chip>
        <v-chip
          v-for="category of info.categories"
          :key="category"
          variant="text"
          label
          :ripple="false"
          :title="category"
        >
          {{ category }}
        </v-chip>
        <!-- docs -->
        <v-chip
          v-if="info.docs" 
          variant="text"
          label
          :ripple="false"
          :title="info.docs"
        >
          {{ info.docs }}
        </v-chip>
        <!-- encoding -->
        <v-chip
          v-if="info.encoding" 
          variant="text"
          label
          :ripple="false"
          :title="info.encoding"
        >
          {{ info.encoding }}
        </v-chip>
        <!-- managing editor -->
        <v-chip
          v-if="info.managingEditor" 
          variant="text"
          label
          :ripple="false"
          :title="info.managingEditor"
        >
          {{ $t('managingEditorColon') }} {{ info.managingEditor }}
        </v-chip>
        <!-- web master -->
        <v-chip
          v-if="info.webMaster" 
          variant="text"
          label
          :ripple="false"
          :title="info.webMaster"
        >
          {{ $t('webmasterColon') }} {{ info.webMaster }}
        </v-chip>
        <!-- HTTP status -->
        <v-chip
          v-if="httpStatusCode"
          class="ma-1" 
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('httpStatus', { 
            httpStatusCode: httpStatusCode, 
            httpStatusMessage: httpStatusMessage 
          }) }}
        </v-chip>
        <!-- HTTP redirect status -->
        <v-chip
          v-if="info.redirectHttpStatusCode"
          class="ma-1" 
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('redirectedTo', { 
            redirectFeedUrl: info.redirectFeedUrl, 
            redirectHttpStatusCode: info.redirectHttpStatusCode, 
            redirectHttpStatusMessage: info.redirectHttpStatusMessage
          }) }}
        </v-chip>
        <!-- URL is upgradable -->
        <v-chip
          v-if="info.isUrlUpgradable === true"
          class="ma-1" 
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('feedAlsoAvailableInHttps') }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-divider />
    <v-card-actions class="flex-wrap">
      <v-btn
        :size="buttonSize" 
        :title="$t('subscriptionMetrics')"
        :text="$t('subscriptionMetrics')"
        :disabled="!info.subscriptionMetrics" 
        @click.stop="showSubscriptionMetrics = true"
      />
      <v-dialog
        v-model="showSubscriptionMetrics"
        fullscreen
        scrollable
      >
        <SubscriptionMetrics
          :title="info.title ? info.title : info.url"
          :subscription-metrics="usefulSubscriptionMetrics"
          @dismiss="showSubscriptionMetrics = false"
        />
      </v-dialog>
      <slot name="additional" />
    </v-card-actions>
  </v-card>
</template>

<script>
import { useTimestamp } from '@/composable/timestamp/HomeTimestamp.js';
import SubscriptionMetrics from './SubscriptionMetrics.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "SubscriptionInfo",
  components: {
    SubscriptionMetrics
  },
  mixins: [buttonSizeMixin], 
  props: {
    info: { type: Object, required: true }
  },
  setup() {
    const { formatTimestamp } = useTimestamp();

    return {
      formatTimestamp
    }
  },
  data() {
    return {
      showSubscriptionMetrics: false,
      cardMode: null,
    }
  },
  computed: {
    httpStatusCode: function () {
      let s = this.info.httpStatusCode;
      if (s) {
        return s;
      }
      let subscriptionMetrics = this.info.subscriptionMetrics;
      if (subscriptionMetrics && subscriptionMetrics.length > 0) {
        let mostRecentMetric = subscriptionMetrics[0];
        return mostRecentMetric.httpStatusCode;
      }
      return null;
    },
    httpStatusMessage: function () {
      let s = this.info.httpStatusMessage;
      if (s) {
        return s;
      }
      let subscriptionMetrics = this.info.subscriptionMetrics;
      if (subscriptionMetrics && subscriptionMetrics.length > 0) {
        let mostRecentMetric = subscriptionMetrics[0];
        return mostRecentMetric.httpStatusMessage;
      }
      return null;
    },
    usefulSubscriptionMetrics: function () {
      return this.info.subscriptionMetrics ? this.info.subscriptionMetrics.filter(f => f.persistCt > 0) : null;
    },
    hasChips: function () {
      return this.info.author || 
        this.info.copyright ||
        this.info.publishedDate || 
        this.info.categories || 
        this.info.docs || 
        this.info.encoding || 
        this.info.managingEditor || 
        this.info.webMaster || 
        this.httpStatusCode || 
        this.info.redirectHttpStatusCode || 
        this.info.isUrlUpgradable === true;
    },
  },
}
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
