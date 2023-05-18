<template>
  <v-card @click="this.showSubscriptionDetails = !this.showSubscriptionDetails">
    <!-- title -->
    <v-card-title>
      {{ this.info.title ? this.info.title : this.info.feedUrl }}
    </v-card-title>
    <v-divider />
    <!-- icon -->
    <v-card-subtitle v-if="this.showSubscriptionDetails">
      <v-img class="mt-2 rounded h-auto"
        v-if="this.info.icon" 
        :src="this.info.icon.url" 
        :title="this.info.icon.title" 
        :alt="this.$t('feedLogoImage')" 
        width="128" 
        max-width="128"
        max-height="128" />
      <v-img class="mt-2 rounded h-auto"
        v-if="this.info.image && !this.info.icon" 
        :src="this.info.image.url" 
        :title="this.info.image.title" 
        :alt="this.$t('feedLogoImage')" 
        width="128" 
        max-width="128"
        max-height="128" />
    </v-card-subtitle>
    <!-- description -->
    <v-card-text v-if="this.info.description && this.showSubscriptionDetails">
      {{ this.info.description ? this.info.description.value : '' }}
    </v-card-text>
    <!-- error -->
    <v-divider v-if="this.info.error" />
    <v-card-text v-if="this.info.error" class="ma-1 error">
      {{ this.info.error }}
    </v-card-text>
    <!-- chips -->
    <v-card-text v-show="this.showSubscriptionDetails">
      <v-divider v-if="this.hasChips" />
      <v-chip-group v-if="this.hasChips">
        <!-- author -->
        <v-chip v-if="this.info.author" class="ma-1" elevation="2" variant="text">
          {{ this.$t('authorColon') }} {{ this.info.author }}
        </v-chip>
        <!-- copyright -->
        <v-chip v-if="this.info.copyright" class="ma-1" elevation="2" variant="text">
          {{ this.info.copyright }}
        </v-chip>
        <!-- published date -->
        <v-chip v-if="this.info.publishedDate" class="ma-1" elevation="2" variant="text">
          {{ this.$t('lastPublishedColon') }} {{ this.info.publishedDate }}
        </v-chip>
        <v-chip v-for="category of this.info.categories" :key="category"
          elevation="2" variant="text"
          :title="filterSupport ? this.$t('toggleCategoryFilter') : category"
          @click.stop="updateFeedFilter('category', category)"
          :disabled="!filterSupport">
          {{ category }}
        </v-chip>
        <!-- docs -->
        <v-chip v-if="this.info.docs" 
          elevation="2" variant="text"
          :title="filterSupport ? this.$t('toggleDocStringFilter') : this.info.docs"
          @click.stop="updateFeedFilter('docs', this.info.docs)"
          :disabled="!filterSupport">
          {{ this.info.docs }}
        </v-chip>
        <!-- encoding -->
        <v-chip v-if="this.info.encoding" 
          elevation="2" variant="text"
          :title="filterSupport ? this.$t('toggleEncodingFilter') : this.info.encoding"
          @click.stop="updateFeedFilter('encoding', this.info.encoding)"
          :disabled="!filterSupport">
          {{ this.info.encoding }}
        </v-chip>
        <!-- managing editor -->
        <v-chip v-if="this.info.managingEditor" 
          elevation="2" variant="text"
          :title="filterSupport ? this.$t('toggleManagingEditorFilter') : this.info.managingEditor"
          @click.stop="updateFeedFilter('managingEditor', this.info.managingEditor)"
          :disabled="!filterSupport">
          {{ this.$t('managingEditorColon') }} {{ this.info.managingEditor }}
        </v-chip>
        <!-- web master -->
        <v-chip v-if="this.info.webMaster" 
          elevation="2" variant="text"
          :title="filterSupport ? this.$t('toggleWebmasterFilter') : this.info.webMaster"
          @click.stop="updateFeedFilter('webMaster', this.info.webMaster)"
          :disabled="!filterSupport">
          {{ this.$t('webmasterColon') }} {{ this.info.webMaster }}
        </v-chip>
        <!-- HTTP status -->
        <v-chip v-if="this.httpStatusCode" class="ma-1" 
          variant="text">
          {{ this.$t('httpStatus', { 
            httpStatusCode: this.httpStatusCode, 
            httpStatusMessage: this.httpStatusMessage 
          }) }}
        </v-chip>
        <!-- HTTP redirect status -->
        <v-chip v-if="this.info.redirectHttpStatusCode" class="ma-1" 
          elevation="2" variant="text">
          {{ this.$t('redirectedTo', { 
              redirectFeedUrl: this.info.redirectFeedUrl, 
              redirectHttpStatusCode: this.info.redirectHttpStatusCode, 
              redirectHttpStatusMessage: this.info.redirectHttpStatusMessage
            }) }}
        </v-chip>
        <!-- URL is upgradable -->
        <v-chip v-if="this.info.isUrlUpgradable === true" class="ma-1" 
          elevation="2" variant="text">
          {{ this.$t('feedAlsoAvailableInHttps') }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-divider />
    <v-card-actions class="flex-wrap">
      <v-btn @click.stop="this.cardMode = (this.cardMode === 'QUERY_METRICS' ? null : 'QUERY_METRICS')"
        size="small"
        :append-icon="this.cardMode === 'QUERY_METRICS' ? 'fa-compress' : 'fa-expand'"
        :title="this.$t('queryMetrics')"
        :text="this.$t('queryMetrics')" 
        :disabled="!this.info.feedMetrics"/>
      <v-btn v-if="this.recommendedFeeds" @click.stop="this.cardMode = (this.cardMode === 'RECOMMENDED_FEEDS' ? null : 'RECOMENDED_FEEDS')"
        size="small"
        :append-icon="this.cardMode === 'RECOMMENDED_FEEDS' ? 'fa-compress' : 'fa-expand'"
        :title="this.$t('recommendedFeeds')"
        :text="this.$t('recommendedFeeds')" 
        :disabled="!this.info.feedRecommendationInfo"/>
      <slot name="additional" />
    </v-card-actions>
    <!-- similar feeeds -->
    <v-expand-transition>
      <div v-if="this.cardMode === 'RECOMMENDED_FEEDS'">
        <div class="ma-1" v-for="recommendedFeed in this.recommendedFeeds" :key="recommendedFeed">
          <v-btn @click.stop="this.$emit('followRecommendation', recommendedFeed)"
            :text="recommendedFeed" />
        </div>
      </div>
    </v-expand-transition>
    <!-- RSS feed metrics -->
    <v-expand-transition>
      <v-table v-if="this.cardMode === 'QUERY_METRICS'" 
        class="ma-4 overflow-auto" 
        style="white-space: norwap;"
        fixed-header>
        <thead style="text-align: left;white-space: nowrap;">
          <th class="pa-1">{{ this.$t('timestamp') }}</th>
          <th class="pa-1">{{ this.$t('message') }}</th>
          <th class="pa-1">{{ this.$t('httpStatusLabel') }}</th>
          <th class="pa-1">{{ this.$t('httpRedirect') }}</th>
          <th class="pa-1">{{ this.$t('error')}}</th>
        </thead>
        <tbody style="text-align: left;white-space: nowrap;">
          <tr v-for="queryMetric in this.usefulFeedMetrics" :key="queryMetric">
            <td class="pa-1">
              {{ queryMetric.importTimestamp }}
            </td>
            <td class="pa-1">
              {{ this.$t('importedNArticles', { n: queryMetric.persistCt }) }}
            </td>
            <!-- HTTP status -->
            <td class="pa-1">
              {{ this.$t('httpStatus', { 
                httpStatusCode: queryMetric.httpStatusCode, 
                httpStatusMessage: queryMetric.httpStatusMessage 
              }) }}
            </td>
            <!-- HTTP redirect status -->
            <td class="pa-1">
              {{ queryMetric.redirectFeedUrl ? 
              this.$t('redirectedTo', { 
                  redirectFeedUrl: queryMetric.redirectFeedUrl, 
                  redirectHttpStatusCode: queryMetric.redirectHttpStatusCode, 
                  redirectHttpStatusMessage: queryMetric.redirectHttpStatusMessage
                }) : this.$t('NONE') }}
            </td>
            <!-- error -->
            <td  class="pa-1" :class="{ 'error': queryMetric.queryExceptionTypeMessage }">
              {{ queryMetric.queryExceptionTypeMessage ? 
                queryMetric.queryExceptionTypeMessage : this.$t('NONE') }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-expand-transition>
    <!-- auth -->
  </v-card>
</template>

<script>
export default {
  name: "RssAtomFeedInfo",
  props: [ "filterSupport", "info", "theme" ],
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
    recommendedFeeds: function() {
      return this.info.feedRecommendationInfo ? this.info.feedRecommendationInfo.recommendedUrls : null;
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
    }
  },
  emits: [ "updateFilter", "followRecommendation" ],
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
    updateFeedFilter(filterName, filterValue) {
      this.$emit("updateFilter", { name: filterName, value: filterValue });
    },
  },
  data() {
    return {
      showSubscriptionDetails: true,
      cardMode: null,
    }
  }
}
</script>
