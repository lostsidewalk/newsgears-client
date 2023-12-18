<template>
  <v-card>
    <!-- title -->
    <v-card-title>
      {{ info.title ? info.title : info.url }}
    </v-card-title>
    <v-divider />
    <!-- icon -->
    <v-card-subtitle>
      <v-row>
        <v-col cols="2">
          <v-img
            v-if="info.icon"
            class="rounded h-auto" 
            :class="my4r"
            :src="info.icon.url" 
            :title="info.icon.title" 
            :alt="$t('feedLogoImage')" 
            contain
            max-height="128px"
          />
          <v-img
            v-if="info.image && !info.icon"
            class="rounded h-auto" 
            :class="my4r"
            :src="info.image.url" 
            :title="info.image.title" 
            :alt="$t('feedLogoImage')" 
            contain
            max-height="128px"
          />
          <v-img
            v-if="!info || (!info.image && !info.icon)"
            class="rounded h-auto" 
            :class="my4r"
            src="rss_logo.svg"
            :alt="$t('rssLogo')"
            contain
            max-height="128px"
          />
        </v-col>
        <v-col cols="10">
          <!-- TODO: extract most recent subscription metric component -->
          <v-list
            v-if="mostRecentSubscriptionMetric"
            density="compact"
          >
            <v-list-item>
              {{ $t('lastImportedAt', { timestamp: formatTimestamp(mostRecentSubscriptionMetric.importTimestamp) }) }}
              <ul>
                <li>
                  {{ $t('nNewArticlesSaved', { n: mostRecentSubscriptionMetric.persistCt }) }}
                </li>
                <li>
                  {{ $t('nArticlesArchived', { n: mostRecentSubscriptionMetric.archiveCt }) }}
                </li>
              </ul>
            </v-list-item>
            <v-list-item>
              <v-chip-group>
                <!-- HTTP status -->
                <v-chip
                  v-if="httpStatusCode"
                  variant="tonal"
                  label
                  :ripple="false"
                  :title="info.url"
                >
                  {{ $t('httpStatus', { 
                    httpStatusCode: httpStatusCode, 
                    httpStatusMessage: httpStatusMessage 
                  }) }}
                </v-chip>
                <!-- HTTP redirect status -->
                <v-chip
                  v-if="redirectHttpStatusCode"
                  variant="tonal"
                  label
                  :ripple="false"
                  :title="redirectFeedUrl"
                >
                  {{ $t('redirectedTo', { 
                    redirectFeedUrl: redirectFeedUrl, 
                    redirectHttpStatusCode: redirectHttpStatusCode, 
                    redirectHttpStatusMessage: redirectHttpStatusMessage
                  }) }}
                </v-chip>
                <!-- URL is upgradable -->
                <v-chip
                  v-if="info.isUrlUpgradable === true"
                  variant="tonal"
                  label
                  :ripple="false"
                  :title="$t('feedAlsoAvailableInHttps')"
                >
                  {{ $t('feedAlsoAvailableInHttps') }}
                </v-chip>
              </v-chip-group>
            </v-list-item>
          </v-list>
          <v-label
            v-else
            :class="my4r"
          >
            {{ $t('metricsNotYetAvailable') }}
          </v-label>
        </v-col>
      </v-row>
    </v-card-subtitle>
    <!-- description -->
    <v-card-text v-if="info.description">
      {{ info.description ? info.description.value : '' }}
    </v-card-text>
    <!-- chips -->
    <v-card-text v-if="hasChips">
      <!-- TODO: extract subscription properties component -->
      <v-chip-group>
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
          :subscription-metrics="info.subscriptionMetrics"
          @dismiss="showSubscriptionMetrics = false"
        />
      </v-dialog>
      <slot name="additional" />
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, computed } from 'vue';

import { useTimestamp } from '@/composable/useTimestamp.js';
import SubscriptionMetrics from './SubscriptionMetrics.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "SubscriptionInfo",
  components: {
    SubscriptionMetrics
  },
  mixins: [buttonSizeMixin, spacingMixin], 
  props: {
    info: { type: Object, required: true }
  },
  setup(props) {
    const { formatTimestamp } = useTimestamp();

    const showSubscriptionMetrics = ref(false);
    const cardMode = ref(null);

    const httpStatusCode = computed(() => {
      let m = mostRecentSubscriptionMetric;
      if (m) {
        return m.httpStatusCode;
      }
      return null;
    });
    
    const httpStatusMessage = computed(() => {
      let m = mostRecentSubscriptionMetric;
      if (m) {
        return m.httpStatusMessage;
      }
      return null;
    });

    const redirectFeedUrl = computed(() => {
      let m = mostRecentSubscriptionMetric;
      if (m) {
        return m.redirectFeedUrl;
      }
      return null;
    });

    const redirectHttpStatusCode = computed(() => {
      let m = mostRecentSubscriptionMetric;
      if (m) {
        return m.redirectHttpStatusCode;
      }
      return null;
    });

    const redirectHttpStatusMessage = computed(() => {
      let m = mostRecentSubscriptionMetric;
      if (m) {
        return m.redirectHttpStatusMessage;
      }
      return null;
    });

    const mostRecentSubscriptionMetric = computed(() => {
      let len = props.info.subscriptionMetrics ? props.info.subscriptionMetrics.length : 0;
      if (len > 0) {
        return props.info.subscriptionMetrics[len - 1];
      }
      return null;
    });

    const hasChips = computed(() => {
      return props.info.author ||
        props.info.copyright ||
        props.info.publishedDate ||
        props.info.categories ||
        props.info.docs ||
        props.info.encoding ||
        props.info.managingEditor ||
        props.info.webMaster;
    });

    return {
      formatTimestamp,
      // 
      showSubscriptionMetrics,
      cardMode,
      // 
      httpStatusCode,
      httpStatusMessage,
      redirectFeedUrl,
      redirectHttpStatusCode,
      redirectHttpStatusMessage,
      mostRecentSubscriptionMetric,
      hasChips,
    }
  },
}
</script>
