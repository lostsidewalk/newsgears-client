<template>
  <v-card>
    <!-- title -->
    <v-card-title
      class="clickable"
      @click="showSubscriptionDetails = !showSubscriptionDetails"
    >
      {{ info.title ? info.title : info.feedUrl }}
    </v-card-title>
    <v-divider />
    <!-- icon -->
    <v-card-subtitle v-if="showSubscriptionDetails">
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
    <v-card-text v-if="info.description && showSubscriptionDetails">
      {{ info.description ? info.description.value : '' }}
    </v-card-text>
    <!-- chips -->
    <v-card-text v-show="showSubscriptionDetails">
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
        :append-icon="cardMode === 'QUERY_METRICS' ? 'fa-compress' : 'fa-expand'"
        :title="$t('queryMetrics')"
        :text="$t('queryMetrics')"
        :disabled="!info.feedMetrics" 
        @click.stop="showQueryMetrics = true"
      />
      <v-dialog
        v-model="showQueryMetrics"
        fullscreen
        scrollable
      >
        <v-card>
          <v-card-title class="pa-4 text-center">
            {{ $t('queryMetrics') }}
          </v-card-title>
          <v-card-subtitle>
            {{ info.title ? info.title : info.url }}
          </v-card-subtitle>
          <v-card-text>
            <v-table
              class="ma-4 overflow-auto flex-grow-1" 
              style="white-space: nowrap;"
              fixed-header
            >
              <thead style="text-align: left;white-space: nowrap;">
                <th class="pa-1">
                  {{ $t('timestamp') }}
                </th>
                <th class="pa-1">
                  {{ $t('message') }}
                </th>
                <th class="pa-1">
                  {{ $t('httpStatusLabel') }}
                </th>
                <th class="pa-1">
                  {{ $t('httpRedirect') }}
                </th>
                <th class="pa-1">
                  {{ $t('error') }}
                </th>
              </thead>
              <tbody style="text-align: left;white-space: nowrap;">
                <tr
                  v-for="queryMetric in usefulFeedMetrics"
                  :key="queryMetric"
                >
                  <td class="pa-1">
                    {{ formatTimestamp(queryMetric.importTimestamp) }}
                  </td>
                  <td class="pa-1">
                    {{ $t('importedNArticles', { n: queryMetric.persistCt }) }}
                  </td>
                  <!-- HTTP status -->
                  <td class="pa-1">
                    {{ $t('httpStatus', { 
                      httpStatusCode: queryMetric.httpStatusCode, 
                      httpStatusMessage: queryMetric.httpStatusMessage 
                    }) }}
                  </td>
                  <!-- HTTP redirect status -->
                  <td class="pa-1">
                    {{ queryMetric.redirectFeedUrl ? 
                      $t('redirectedTo', { 
                        redirectFeedUrl: queryMetric.redirectFeedUrl, 
                        redirectHttpStatusCode: queryMetric.redirectHttpStatusCode, 
                        redirectHttpStatusMessage: queryMetric.redirectHttpStatusMessage
                      }) : $t('NONE') }}
                  </td>
                  <!-- error -->
                  <td
                    class="pa-1"
                    :class="{ 'error': queryMetric.queryExceptionTypeMessage }"
                  >
                    {{ queryMetric.queryExceptionTypeMessage ? 
                      queryMetric.queryExceptionTypeMessage : $t('NONE') }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :size="buttonSize" 
              :text="$t('dismiss')"
              @click="showQueryMetrics = false"
            />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <slot name="additional" />
    </v-card-actions>
    <!-- RSS feed metrics -->
    <v-expand-transition />
    <!-- auth -->
  </v-card>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "RssAtomFeedInfo",
  mixins: [buttonSizeMixin], 
  props: {
    info: { type: Object, required: true }
  },
  emits: [ "followRecommendation" ],
  data() {
    return {
      showSubscriptionDetails: true,
      showQueryMetrics: false,
      cardMode: null,
    }
  },
  computed: {
    httpStatusCode: function() {
      let s = this.info.httpStatusCode;
      if (s) {
        return s;
      }
      let feedMetrics = this.info.feedMetrics;
      if (feedMetrics && feedMetrics.length > 0) {
        let mostRecentMetric = feedMetrics[0];
        return mostRecentMetric.httpStatusCode;
      }
      return null;
    },
    httpStatusMessage: function() {
      let s = this.info.httpStatusMessage;
      if (s) {
        return s;
      }
      let feedMetrics = this.info.feedMetrics;
      if (feedMetrics && feedMetrics.length > 0) {
        let mostRecentMetric = feedMetrics[0];
        return mostRecentMetric.httpStatusMessage;
      }
      return null;
    },
    usefulFeedMetrics: function() {
      return this.info.feedMetrics ? this.info.feedMetrics.filter(f => f.persistCt > 0) : null;
    },
    hasChips: function() {
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
  methods: {
    isHtmlContent(contentObj) {
      return contentObj != null && contentObj.type != null && contentObj.type.toLowerCase().indexOf('html') >= 0;
    },
    hasThumbnail(postMedia) {
      if (postMedia) {
        let metadata = postMedia.postMediaMetadata;
        if (metadata) {
          let thumbnails = metadata.thumbnails;
          return thumbnails && thumbnails.length > 0;
        }
      }
      return false;
    },
    formatTimestamp(timestamp) {
      if (!timestamp) {
        return null;
      }
      try {
        let d = new Date(Date.parse(timestamp));
        return d.toLocaleString();
      } catch (error) {
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
