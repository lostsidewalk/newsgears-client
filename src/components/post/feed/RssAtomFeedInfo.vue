<template>
  <div :disabled="disabled">
    <div class="rss-atom-feed-info" v-if="this.info.discoveryUrl">
      <!-- left chunk (image) -->
      <div class="left">
        <!-- icon -->
        <div class="rss-atom-feed-info-image">
          <a v-if="this.info.icon" :href="this.info.icon.link" :style="this.disabled ? 'pointer-events: none' : ''" :target="'window_' + (Math.random() + 1).toString(36).substring(7)" tabindex="0">
            <img :src="'data:image/png;base64,' + this.info.icon.imgSrc" :title="this.info.icon.title" />
          </a>
          <a v-if="this.info.image && !this.info.icon" :href="this.info.image.link" :style="this.disabled ? 'pointer-events: none' : ''" :target="'window_' + (Math.random() + 1).toString(36).substring(7)" tabindex="0">
            <img :src="'data:image/png;base64,' + this.info.image.imgSrc" :title="this.info.image.title" />
          </a>
          <a v-if="!this.info.image && !this.info.icon" :href="this.info.feedUrl" :style="this.disabled ? 'pointer-events: none' : ''" :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
          </a>
        </div>
      </div>
      <!-- right chunk (text) -->
      <div class="right">
        <!-- title -->
        <div class="rss-atom-feed-info-field rss-atom-feed-info-title">
          <a class="link" :href="this.info.feedUrl" :style="this.disabled ? 'pointer-events: none' : ''" :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
            {{ this.info.title.value }}
          </a>
        </div>
        <!-- author -->
        <div v-if="this.info.author" class="rss-atom-feed-info-field pill-container">
          <button 
            :class="filterSupport ? '' : 'br-pill-subdued'"
            :title="filterSupport ? 'Add/remove this author (' + this.info.author + ') to the current filter' : this.info.author"
            @click="updateFeedFilter('author', this.info.author)"
            :disabled="!filterSupport">
            Author: {{ this.info.author }}
          </button>
        </div>
        <!-- copyright -->
        <div v-if="this.info.copyright" class="rss-atom-feed-info-field">{{ this.info.copyright }}</div>
        <!-- published date -->
        <div v-if="this.info.publishedDate" class="rss-atom-feed-info-field">Last published: {{ this.info.publishedDate }}</div>
        <!-- description -->
        <div class="rss-atom-feed-info-field">{{ this.info.description ? this.info.description.value : '' }}</div>
        <!-- sample entries -->
        <div class="rss-atom-feed-info-field rss-atom-feed-info-sample" v-for="sampleEntry in this.info.sampleEntries" :key="sampleEntry.title">
          <a class="link"
            :href="sampleEntry.link" 
            :style="this.disabled ? 'pointer-events: none' : ''" 
            :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
            {{ sampleEntry.title }}
          </a>
        </div>
        <!-- categories -->
        <div v-if="this.info.categories.length > 0" class="rss-atom-feed-info-field pill-container">
          <button v-for="category of this.info.categories" :key="category" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            :title="filterSupport ? 'Add/remove this category (' + category + ') to the current filter' : category"
            @click="updateFeedFilter('category', category)"
            :disabled="!filterSupport">
            {{ category }}
          </button>
        </div>
        <div class="rss-atom-feed-info-field pill-container">
          <!-- language -->
          <button v-if="this.info.language" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            :title="filterSupport ? 'Add/remove this language (' + this.info.language + ') to the current filter' : this.info.language"
            @click="updateFeedFilter('language', this.info.language)"
            :disabled="!filterSupport">
            Language: {{ this.info.language }}
          </button>
          <!-- docs -->
          <button v-if="this.info.docs" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            :title="filterSupport ? 'Add/remove this doc string (' + this.info.docs + ') to the current filter' : this.info.docs"
            @click="updateFeedFilter('docs', this.info.docs)"
            :disabled="!filterSupport">
            Docs: {{ this.info.docs }}
          </button>
          <!-- encoding -->
          <button v-if="this.info.encoding" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            :title="filterSupport ? 'Add/remove this encoding (' + this.info.encoding + ') to the current filter' : this.info.encoding"
            @click="updateFeedFilter('encoding', this.info.encoding)"
            :disabled="!filterSupport">
            Encoding: {{ this.info.encoding }}
          </button>
          <!-- feed type -->
          <button v-if="this.info.feedType" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            :title="filterSupport ? 'Add/remove this feed type (' + this.info.feedType + ') to the current filter' : this.info.feedType"
            @click="updateFeedFilter('feedType', this.info.feedType)"
            :disabled="!filterSupport">
            Feed type: {{ this.info.feedType }}
          </button>
          <!-- generator -->
          <button v-if="this.info.generator" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            :title="filterSupport ? 'Add/remove this generator (' + this.info.generator + ') to the current filter' : this.info.generator"
            @click="updateFeedFilter('generator', this.info.generator)"
            :disabled="!filterSupport">
            Generator: {{ this.info.generator }}
          </button>
          <!-- managing editor -->
          <button v-if="this.info.managingEditor" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            :title="filterSupport ? 'Add/remove this managing editor (' + this.info.managingEditor + ') to the current filter' : this.info.managingEditor"
            @click="updateFeedFilter('managingEditor', this.info.managingEditor)"
            :disabled="!filterSupport">
            Managing editor: {{ this.info.managingEditor }}
          </button>
          <!-- web master -->
          <button v-if="this.info.webMaster" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            :title="filterSupport ? 'Add/remove this web master (' + this.info.webMaster + ') to the current filter' : this.info.webMaster"
            @click="updateFeedFilter('webMaster', this.info.webMaster)"
            :disabled="!filterSupport">
            Webmaster: {{ this.info.webMaster }}
          </button>
        </div>
        <div class="rss-atom-feed-info-field pill-container">
          <!-- http satus code + status message -->
          <span v-if="this.info.httpStatusCode" 
            class="br-pill-subdued" 
            :title="'HTTP status code ' + this.info.httpStatusCode + ' (' + this.info.httpStatusMessage + ')'">
            {{ 'HTTP ' + this.info.httpStatusCode }}
          </span>
          <!-- redirect status code + redirect status message -->
          <span v-if="this.info.redirectHttpStatusCode" 
            class="br-pill-subdued" 
            :title="'Redirect HTTP status code ' + this.info.redirectHttpStatusCode + ' (' + this.info.redirectHttpStatusMessage + ')'">
            {{ this.info.redirectHttpStatusCode }}
          </span>
          <!-- is url upgradable -->
          <span v-if="this.info.isUrlUpgradable === true" 
            class="br-pill-subdued" 
            title="This feed is also available in HTTPS">
            <i class="fa fa-lock-o fa-1x">SSL</i>
          </span>
        </div>
      </div>
    </div>
    <div v-if="this.info.error" class="error">
      {{ this.info.error }}
      <div class="rss-atom-feed-info-field pill-container">
        <!-- http satus code + status message -->
        <span v-if="this.info.httpStatusCode" 
          class="br-pill-subdued" 
          :title="'HTTP ' + this.info.httpStatusCode + ' (' + this.info.httpStatusMessage + ')' + (this.info.redirectFeedUrl ? (', redirected to ' + this.info.redirectFeedUrl) : '')">
          {{ 'HTTP ' + this.info.httpStatusCode + ' ' + this.info.httpStatusMessage }} &nbsp;
          <span v-if="this.info.redirectFeedUrl">
            <i class="fa fa-arrow-right fa-1x" /> &nbsp; {{ this.info.redirectFeedUrl }}
          </span>
          <span v-if="this.info.redirectHttpStatusCode">
            &nbsp; <i class="fa fa-arrow-right fa-1x" /> &nbsp; {{ this.info.redirectHttpStatusCode + ' ' + this.info.redirectHttpStatusMessage }}
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
  emits: [ "updateFilter" ],
  methods: {
    updateFeedFilter(filterName, filterValue) {
      this.$emit("updateFilter", { name: filterName, value: filterValue });
    },
  }
}
</script>

<style scoped>
.rss-atom-feed-info {
  display: inline-flex;
  width: 100%;
}

.rss-atom-feed-info-field {
  margin-bottom: .31rem;
}

.rss-atom-feed-info-field > a {
  color: v-bind('theme.subduedmessage');
  text-decoration: none;
}

.rss-atom-feed-info-field > a:hover, .rss-atom-feed-info-field > a:focus {
  color: v-bind('theme.highlightedmessage');
}

.rss-atom-feed-info-field:last-of-type {
  margin-bottom: unset !important;
}

.rss-atom-feed-info-title {
  font-weight: bold;
}

.left {
  padding-right: .31rem;
}

.right {
  padding-left: .125rem;
  width: 100%;
}

.rss-atom-feed-info-sample {
  color: v-bind('theme.subduedmessage');
}

.rss-atom-feed-info-sample a {
  color: v-bind('theme.subduedmessage');
  text-decoration: none;
}

.rss-atom-feed-info-sample a:hover, .rss-atom-feed-info-sample a:focus {
  color: v-bind('theme.highlightedmessage');
}

.rss-atom-feed-info-image {
  border: 1px solid v-bind('theme.fieldborder');
  border-radius: 5px;
  max-height: 32px;
  max-width: 32px;
  min-height: 32px;
  min-width: 32px;
}

.rss-atom-feed-info-image > a > img {
  height: 32px;
  width: 32px;
}

.link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
  border: 1px solid transparent;
}

.link:hover, .link:focus {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-wrap: wrap;
  gap: .31rem;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .31rem;
  user-select: none;
}

.br-pill:hover, .br-pill:focus {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.br-pill-subdued {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: unset;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .31rem;
  user-select: none;
}

.br-pill-subdued:hover, .br-pill-subdued:focus {
  border-color: unset;
  background-color: unset !important;
}

.error {
}
</style>
