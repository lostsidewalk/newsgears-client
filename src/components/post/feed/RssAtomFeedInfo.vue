<template>
  <div :disabled="inTransit">
    <div class="rss-atom-feed-info" v-if="this.info.discoveryUrl">
      <!-- left chunk (image) -->
      <div class="left">
        <!-- icon -->
        <div class="rss-atom-feed-info-image">
          <a v-if="this.info.icon" :href="this.info.icon.link" :style="this.inTransit ? 'pointer-events: none' : ''" :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
            <img :src="'data:image/png;base64,' + this.info.icon.imgSrc" :title="this.info.icon.title" />
          </a>
          <a v-if="this.info.image && !this.info.icon" :href="this.info.image.link" :style="this.inTransit ? 'pointer-events: none' : ''" :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
            <img :src="'data:image/png;base64,' + this.info.image.imgSrc" :title="this.info.image.title" />
          </a>
          <a v-if="!this.info.image && !this.info.icon" :href="this.info.feedUrl" :style="this.inTransit ? 'pointer-events: none' : ''" :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
          </a>
        </div>
      </div>
      <!-- right chunk (text) -->
      <div class="right">
        <!-- title -->
        <div class="rss-atom-feed-info-field rss-atom-feed-info-title">
          <a class="link" :href="this.info.feedUrl" :style="this.inTransit ? 'pointer-events: none' : ''" :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
            {{ this.trimToLength(this.info.title.value, 64) }}
          </a>
        </div>
        <!-- author -->
        <div v-if="this.info.author" class="rss-atom-feed-info-field pill-container">
          <span 
            class="br-pill" 
            :class="filterSupport ? '' : 'br-pill-subdued'"
            href="#0" 
            :title="filterSupport ? 'Add/remove this author (' + this.info.author + ') to the current filter' : this.info.author"
            @click="filterSupport ? updateFeedFilter('author', this.info.author) : false">
            Author: {{ this.trimToLength(this.info.author, 64) }}
          </span>
        </div>
        <!-- copyright -->
        <div v-if="this.info.copyright" class="rss-atom-feed-info-field">{{ this.trimToLength(this.info.copyright, 64) }}</div>
        <!-- published date -->
        <div v-if="this.info.publishedDate" class="rss-atom-feed-info-field">Last published: {{ this.info.publishedDate }}</div>
        <!-- description -->
        <div class="rss-atom-feed-info-field">{{ this.trimToLength(this.info.description.value, 64) }}</div>
        <!-- sample entries -->
        <div class="rss-atom-feed-info-field rss-atom-feed-info-sample" v-for="sampleEntry in this.info.sampleEntries" :key="sampleEntry.title">
          <a class="link"
            :href="sampleEntry.link" 
            :style="this.inTransit ? 'pointer-events: none' : ''" 
            :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
            {{ this.trimToLength(sampleEntry.title, 64) }}
          </a>
        </div>
        <!-- categories -->
        <div v-if="this.info.categories.length > 0" class="rss-atom-feed-info-field pill-container">
          <span v-for="category of this.info.categories" :key="category" 
            class="br-pill" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            href="#0" 
            :title="filterSupport ? 'Add/remove this category (' + category + ') to the current filter' : category"
            @click="filterSupport ? updateFeedFilter('category', category) : false">
            {{ this.trimToLength(category, 64) }}
          </span>
        </div>
        <div class="rss-atom-feed-info-field pill-container">
          <!-- language -->
          <span v-if="this.info.language" 
            class="br-pill" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            href="#0" 
            :title="filterSupport ? 'Add/remove this language (' + this.info.language + ') to the current filter' : this.info.language"
            @click="updateFeedFilter('language', this.info.language)">
            Language: {{ this.trimToLength(this.info.language, 64) }}
          </span>
          <!-- docs -->
          <span v-if="this.info.docs" 
            class="br-pill" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            href="#0" 
            :title="filterSupport ? 'Add/remove this doc string (' + this.info.docs + ') to the current filter' : this.info.docs"
            @click="updateFeedFilter('docs', this.info.docs)">
            Docs: {{ this.trimToLength(this.info.docs, 64) }}
          </span>
          <!-- encoding -->
          <span v-if="this.info.encoding" 
            class="br-pill" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            href="#0" 
            :title="filterSupport ? 'Add/remove this encoding (' + this.info.encoding + ') to the current filter' : this.info.encoding"
            @click="updateFeedFilter('encoding', this.info.encoding)">
            Encoding: {{ this.trimToLength(this.info.encoding, 64) }}
          </span>
          <!-- feed type -->
          <span v-if="this.info.feedType" 
            class="br-pill" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            href="#0" 
            :title="filterSupport ? 'Add/remove this feed type (' + this.info.feedType + ') to the current filter' : this.info.feedType"
            @click="updateFeedFilter('feedType', this.info.feedType)">
            Feed type: {{ this.trimToLength(this.info.feedType, 64) }}
          </span>
          <!-- generator -->
          <span v-if="this.info.generator" 
            class="br-pill" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            href="#0" 
            :title="filterSupport ? 'Add/remove this generator (' + this.info.generator + ') to the current filter' : this.info.generator"
            @click="updateFeedFilter('generator', this.info.generator)">
            Generator: {{ this.trimToLength(this.info.generator, 64) }}
          </span>
          <!-- managing editor -->
          <span v-if="this.info.managingEditor" 
            class="br-pill" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            href="#0" 
            :title="filterSupport ? 'Add/remove this managing editor (' + this.info.managingEditor + ') to the current filter' : this.info.managingEditor"
            @click="updateFeedFilter('managingEditor', this.info.managingEditor)">
            Managing editor: {{ this.trimToLength(this.info.managingEditor, 64) }}
          </span>
          <!-- web master -->
          <span v-if="this.info.webMaster" 
            class="br-pill" 
            :class="filterSupport ? 'br-pill' : 'br-pill-subdued'"
            href="#0" 
            :title="filterSupport ? 'Add/remove this web master (' + this.info.webMaster + ') to the current filter' : this.info.webMaster"
            @click="updateFeedFilter('webMaster', this.info.webMaster)">
            Webmaster: {{ this.trimToLength(this.info.webMaster, 64) }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="this.info.error" class="error">{{ this.info.error }}</div>
  </div>
</template>

<script>
export default {
  name: "RssAtomFeedInfo",
  props: ["inTransit", "filterSupport", "info", "theme"],
  emits: ["updateFilter"],
  mounted() {
    console.log("rss-atom-feed-info mounted: info=" + JSON.stringify(this.info));
  },
  methods: {
    updateFeedFilter(filterName, filterValue) {
      this.$emit("updateFilter", { name: filterName, value: filterValue });
    },
    // 
    // utility methods 
    // 
    trimToLength(str, len) {
      if (!str) {
        return str;
      }
      if (str.length < len) {
        return str;
      }
      return str.substring(0, len) + " ...";
    }
  }
}
</script>

<style scoped>
.rss-atom-feed-info {
  /* margin-top: 10px; */
  display: inline-flex;
  width: 100%;
}

.rss-atom-feed-info-field {
  margin-bottom: 5px;
}

.rss-atom-feed-info-field > a {
  color: v-bind('theme.subduedmessage');
  text-decoration: none;
}

.rss-atom-feed-info-field > a:hover {
  color: v-bind('theme.highlightedmessage');
}

.rss-atom-feed-info-field:last-of-type {
  margin-bottom: unset !important;
}

.rss-atom-feed-info-title {
  font-weight: bold;
}

.left {
  padding-right: 5px;
}

.right {
  padding-left: 3px;
  width: 100%;
}

.rss-atom-feed-info-sample {
  color: v-bind('theme.subduedmessage');
}

.rss-atom-feed-info-sample a {
  color: v-bind('theme.subduedmessage');
  text-decoration: none;
}

.rss-atom-feed-info-sample a:hover {
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
}

.link:hover {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-flow: wrap;
  gap: 5px;
  overflow-x: auto;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: 5px;
  user-select: none;
}

.br-pill:hover {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.br-pill-subdued {
  cursor: unset;
}

.br-pill-subdued:hover {
  border-color: unset;
  background-color: unset !important;
}

.error {
}
</style>
