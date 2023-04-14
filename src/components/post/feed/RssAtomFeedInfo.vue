<template>
  <div :disabled="disabled" v-auto-animate>
    <div class="rss-atom-feed-info">
      <!-- left chunk (image) -->
      <div class="left">
        <!-- icon -->
        <!-- TODO: component -->
        <div class="rss-atom-feed-info-image">
          <img v-if="this.info.icon" :href="this.info.icon.link" :src="this.info.icon.url" 
            :title="this.info.icon.title" 
            :alt="this.$t('feedLogoImage')" />
          <img v-if="this.info.image && !this.info.icon" :src="this.info.image.url" 
            :title="this.info.image.title" 
            :alt="this.$t('feedLogoImage')" />
          <img v-if="!this.info.image && !this.info.icon" src="rss_logo.svg" />
        </div>
      </div>
      <!-- right chunk (text) -->
      <div class="right">
        <!-- title -->
        <!-- TODO: component -->
        <div class="rss-atom-feed-info-field rss-atom-feed-info-title br-pill-subdued">
          <a class="link" :href="this.info.feedUrl" :style="this.disabled ? 'pointer-events: none' : ''" target="_blank">
            {{ this.info.title ? this.info.title.value : this.info.feedUrl }}
          </a>
        </div>
        <!-- author -->
        <div v-if="this.info.author" class="rss-atom-feed-info-field br-pill-subdued">
          {{ this.$t('authorColon') }} {{ this.info.author }}
        </div>
        <!-- copyright -->
        <div v-if="this.info.copyright" class="rss-atom-feed-info-field br-pill-subdued">{{ this.info.copyright }}</div>
        <!-- published date -->
        <div v-if="this.info.publishedDate" class="rss-atom-feed-info-field br-pill-subdued">
          {{ this.$t('lastPublishedColon') }} {{ this.info.publishedDate }}
        </div>
        <!-- description -->
        <div v-if="this.info.description" class="rss-atom-feed-info-field br-pill-subdued">
          {{ this.info.description ? this.info.description.value : '' }}
        </div>
        <div v-if="!this.sampleEntries || this.sampleEntries.length === 0" class="rss-atom-feed-info-field br-pill-subdued">
          <!-- TODO: interpolated string -->
          Click <span class="link fa fa-refresh" @click="this.$emit('refreshFeed')" /> to refresh this feed.
        </div>
        <!-- categories -->
        <div v-if="this.info.categories && this.info.categories.length > 0" class="rss-atom-feed-info-field pill-container">
          <button v-for="category of this.info.categories" :key="category"
            :class="filterSupport ? 'br-pill accessible-button' : 'br-pill-subdued'"
            :title="filterSupport ? this.$t('toggleCategoryFilter') : category"
            @click="updateFeedFilter('category', category)"
            :disabled="!filterSupport">
            {{ category }}
          </button>
        </div>
        <!-- various informational pills -->
        <div v-if="this.info.docs || this.info.encoding || this.info.managingEditor || this.info.webMaster" class="rss-atom-feed-info-field pill-container">
          <!-- docs -->
          <button v-if="this.info.docs" 
            :class="filterSupport ? 'br-pill accessible-button' : 'br-pill-subdued'"
            :title="filterSupport ? this.$t('toggleDocStringFilter') : this.info.docs"
            @click="updateFeedFilter('docs', this.info.docs)"
            :disabled="!filterSupport">
            {{ this.info.docs }}
          </button>
          <!-- encoding -->
          <button v-if="this.info.encoding" 
            :class="filterSupport ? 'br-pill accessible-button' : 'br-pill-subdued'"
            :title="filterSupport ? this.$t('toggleEncodingFilter') : this.info.encoding"
            @click="updateFeedFilter('encoding', this.info.encoding)"
            :disabled="!filterSupport">
            {{ this.info.encoding }}
          </button>
          <!-- managing editor -->
          <button v-if="this.info.managingEditor" 
            :class="filterSupport ? 'br-pill accessible-button' : 'br-pill-subdued'"
            :title="filterSupport ? this.$t('toggleManagingEditorFilter') : this.info.managingEditor"
            @click="updateFeedFilter('managingEditor', this.info.managingEditor)"
            :disabled="!filterSupport">
            {{ this.$t('managingEditorColon') }} {{ this.info.managingEditor }}
          </button>
          <!-- web master -->
          <button v-if="this.info.webMaster" 
            :class="filterSupport ? 'br-pill accessible-button' : 'br-pill-subdued'"
            :title="filterSupport ? this.$t('toggleWebmasterFilter') : this.info.webMaster"
            @click="updateFeedFilter('webMaster', this.info.webMaster)"
            :disabled="!filterSupport">
            {{ this.$t('webmasterColon') }} {{ this.info.webMaster }}
          </button>
        </div>
        <!-- technical information pills -->
        <div v-if="this.info.httpStatusCode" class="rss-atom-feed-info-field br-pill-subdued">
          <!-- http satus code + status message -->
          <!-- TODO: interpolated string -->
          Last known HTTP status: {{ this.info.httpStatusCode }}{{ this.info.redirectHttpStatusCode ? ', HTTP redirect status: ' + this.info.redirectHttpStatusCode : '' }}
        </div>
        <div v-if="this.info.isUrlUpgradable === true" class="rss-atom-feed-info-field br-pill-subdued">
          {{ this.$t('feedAlsoAvailableInHttps') }}
        </div>
        <div class="rss-atom-feed-info-field pill-container">
          <!-- show/hide sample entries -->
          <button v-if="this.info.sampleEntries" 
            class="br-pill accessible-button rss-atom-url-row-button"
            :title="this.$t('sampleEntries')"
            @click="this.showSampleEntries = !this.showSampleEntries">
            {{ this.$t('sampleEntries') }}  &nbsp; <span class="fa fa-expand" />
          </button>
        </div>
        <!-- sample entries -->
        <!-- TODO: component -->
        <div class="rss-atom-feed-info-field rss-atom-feed-info-sample" v-show="this.showSampleEntries" v-for="sampleEntry in this.sampleEntries" :key="sampleEntry.postTitle">
          <!-- sample entry thumbnail -->
          <div class="left" v-if="this.hasThumbnail(sampleEntry.postMedia)">
            <div class="rss-atom-feed-info-image">
              <button class="link"
              @click.stop="sampleEntry.showDetails = !sampleEntry.showDetails">
                <img :src="sampleEntry.postMedia.postMediaMetadata.thumbnails[0].url" />
            </button>
            </div>
          </div>
          <!-- sample entry verbiage (link, description, publish timestamp, etc.) -->
          <div class="right">
            <!-- post title -->
            <div class="rss-atom-feed-info-field rss-atom-feed-info-title">
              <a class="link"
                :href="sampleEntry.postUrl" 
                :style="this.disabled ? 'pointer-events: none' : ''" 
                target="_blank">
                {{ sampleEntry.postTitle.value }} <span class="rss-atom-feed-info-published" v-if="sampleEntry.publishTimestamp">({{ sampleEntry.publishTimestamp }})</span>
              </a>
            </div>
            <!-- post desc -->
            <div class="rss-atom-feed-info-field" v-if="sampleEntry.postDesc">
              <div v-if="this.isHtmlContent(sampleEntry.postDesc)"
                  class='post-html-frame' 
                  v-html="sampleEntry.postDesc.value" frameborder="0" />
              <div v-else
                class='post-text-frame'>
                {{ sampleEntry.postDesc.value }}
              </div>
            </div>
          </div>
        </div>
        <div class="rss-atom-feed-info-field pill-container">
          <!-- show/hide recommended feeds -->
          <button v-if="this.info.feedRecommendationInfo" 
            class="br-pill accessible-button rss-atom-url-row-button"
            :title="this.$t('recommendedFeeds')"
            @click="this.showRecommendedFeeds = !this.showRecommendedFeeds">
            {{ this.$t('recommendedFeeds') }} &nbsp; <span class="fa fa-expand" />
          </button>
        </div>
        <!-- recommended feeds -->
        <div class="rss-atom-feed-info-field" v-show="this.showRecommendedFeeds" v-for="recommendedFeed in this.recommendedFeeds" :key="recommendedFeed">
          <div class="br-pill-subdued">
            <button class="link" 
              @click.stop="this.$emit('followRecommendation', recommendedFeed)">
              {{ recommendedFeed }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="this.info.error" class="error">
      {{ this.info.error }}
      <div class="rss-atom-feed-info-field pill-container">
        <!-- http satus code + status message -->
        <span v-if="this.info.httpStatusCode" 
          class="br-pill-subdued" 
          :title="'HTTP ' + this.info.httpStatusCode + ' (' + this.info.httpStatusMessage + ')' + (this.info.redirectFeedUrl ? ('=> ' + this.info.redirectFeedUrl) : '')">
          {{ 'HTTP ' + this.info.httpStatusCode + ' ' + this.info.httpStatusMessage }} &nbsp;
          <span v-if="this.info.redirectFeedUrl">
            <span class="fa fa-arrow-right fa-1x" /> &nbsp; {{ this.info.redirectFeedUrl }}
          </span>
          <span v-if="this.info.redirectHttpStatusCode">
            &nbsp; <span class="fa fa-arrow-right fa-1x" /> &nbsp; {{ this.info.redirectHttpStatusCode + ' ' + this.info.redirectHttpStatusMessage }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RssAtomFeedInfo",
  props: [ "filterSupport", "info", "theme", "disabled" ],
  computed: {
    sampleEntries: function() {
      return this.info.sampleEntries ? this.info.sampleEntries.slice(0, 10) : null;
    },
    recommendedFeeds: function() {
      return this.info.feedRecommendationInfo ? this.info.feedRecommendationInfo.recommendedUrls : [];
    },
  },
  emits: [ "updateFilter", "refreshFeed", "followRecommendation" ],
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
      showSampleEntries: true,
      showRecommendedFeeds: true,
    }
  }
}
</script>

<style scoped>
.rss-atom-feed-info {
  display: inline-flex;
  width: 100%;
}

.rss-atom-feed-info-field {
  margin-bottom: .44rem;
  overflow-wrap: anywhere;
}

.rss-atom-feed-info-field > a {
  color: v-bind('theme.subduedmessage');
  text-decoration: none;
}

.rss-atom-feed-info-field > a:hover, .rss-atom-feed-info-field > a:focus-visible {
  color: v-bind('theme.highlightedmessage');
}

.rss-atom-feed-info-field:last-of-type {
  margin-bottom: unset !important;
}

.rss-atom-feed-info-title {
  font-weight: bold;
}

.rss-atom-feed-info-published {
  font-weight: normal;
}

.left {
  padding-right: .44rem;
}

.right {
  padding-left: .125rem;
  width: 100%;
  overflow-y: auto;
}

.rss-atom-feed-info-sample {
  color: v-bind('theme.subduedmessage');
  display: grid;
  grid-template: auto 1fr / auto 1fr auto;
  grid-gap: .44rem;
}

.rss-atom-feed-info-image {
  max-height: 128px;
  max-width: 128px;
  min-height: 32px;
  min-width: 32px;
}

.rss-atom-feed-info-image img {
  border-radius: 4px;
  height: auto;
  width: 128px;
}

.link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  background-color: transparent;
  text-align: start;
}

.link:hover, .link:focus-visible {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-wrap: wrap;
  gap: .44rem;
}

/** has references */
.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 4px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .44rem .75rem;
  user-select: none;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/** has references */
.br-pill:hover, .br-pill:focus-visible {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.br-pill-subdued {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: unset;
  border-radius: 4px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.normalmessage');
  padding: .44rem 1.25rem;
  user-select: none;
  font-size: smaller;
}

.error {
}

.post-html-frame > * {
  object-fit: scale-down;
}

.post-text-frame {
  display: block;
  overflow: auto;
  font-family: serif;
  font-size: larger;
}

.rss-atom-url-row-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  border-radius: 4px;
  text-align: center;
}

.rss-atom-url-row-button:hover, .rss-atom-url-row-button:focus-visible {
  background: v-bind('theme.buttonhighlight');
}

.rss-atom-url-row-button:disabled {
  cursor: auto;
}

.rss-atom-url-row-button:hover:disabled {
  background-color: unset;
}
</style>
