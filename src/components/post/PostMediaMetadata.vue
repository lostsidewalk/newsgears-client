<template>
  <v-card
    class="post-media-metadata"
    elevation="0"
    align="left"
    justify="left"
  >
    <v-card-title
      class="d-flex flex-row flex-auto pa-4 flex-wrap align-start overflow-auto clickable"
      style="gap: 1rem; white-space: normal"
    >
      <v-img
        v-for="thumbnail of metadata.thumbnails"
        :key="thumbnail" 
        :src="thumbnail.url" 
        tabindex="0"
        :alt="$t('postMediaThumbnail')" 
        max-height="140"
        max-width="140"
        width="140"
      />
      <div class="d-flex flex-column flex-auto flex-grow-1">
        <!-- title -->
        <div
          v-if="hasHtmlTitle"
          class="post-html-frame"
          v-html="metadata.title"
        />
        <div
          v-else-if="hasTitle"
          class="post-text-frame"
        >
          {{ metadata.title }}
        </div>
        <v-divider v-if="hasTitle" />
        <!-- credits -->
        <v-chip-group v-if="metadata.credits && metadata.credits.length > 0">
          <v-chip
            v-for="credit of metadata.credits"
            :key="credit"
            class="text-subtitle-2"
          >
            {{ credit.name }} ({{ credit.role }})
          </v-chip>
        </v-chip-group>
        <!-- categories -->
        <v-chip-group v-if="metadata.categories && metadata.categories.length > 0">
          <v-chip
            v-for="category of metadata.categories"
            :key="category"
            class="text-subtitle-2"
          >
            {{ category.label }} ({{ category.value }})
          </v-chip>
        </v-chip-group>
        <!-- keywords -->
        <v-chip-group v-if="metadata.keywords && metadata.keywords.length > 0">
          <v-chip
            v-for="keyword of metadata.keywords"
            :key="keyword"
            class="text-subtitle-2"
          >
            {{ keyword }}
          </v-chip>
        </v-chip-group>
        <!-- ratings -->
        <v-chip-group v-if="metadata.ratings && metadata.ratings.length > 0">
          <v-chip
            v-for="rating of metadata.ratings"
            :key="rating"
            class="text-subtitle-2"
          >
            {{ rating.value }} ({{ rating.scheme }})
          </v-chip>
        </v-chip-group>
      </div>
    </v-card-title>
    <v-card-text v-if="hasDesc">
      <!-- description (html) -->
      <div
        v-if="hasHtmlDesc"
        class="post-html-frame"
        v-html="metadata.desc"
      />
      <!-- description (non-html) -->
      <div
        v-else-if="hasDesc"
        class="post-text-frame"
        style="white-space-collapse: preserve-breaks;"
      >
        {{ metadata.desc }}
      </div>
    </v-card-text>
    <v-card-actions
      v-if="metadata.community"
      style="justify-content: start;"
    >
      <PostMediaCommunity
        :community="metadata.community"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import PostMediaCommunity from '@/components/post/PostMediaCommunity.vue';

export default {
  name: "PostMediaMetadata",
  components: {
    PostMediaCommunity,
  },
  props: {
    metadata: { type: Object, required: true },
  },
  computed: {
    hasTitle: function () {
      return this.metadata.title && this.metadata.title.length > 0;
    },
    hasTitleType: function() {
      return this.metadata.titleType ? true : false;
    },
    hasHtmlTitle: function () {
      if (this.hasTitle && this.hasTitleType) {
        return this.metadata.titleType.indexOf("html") >= 0;
      }
      return false;
    },
    hasDesc: function () {
      return this.metadata.desc && this.metadata.desc.length > 0;
    },
    hasDescType: function () {
      return this.metadata.descType ? true : false;
    },
    hasHtmlDesc: function () {
      if (this.hasDesc && this.hasDescType) {
        return this.metadata.descType.indexOf("html") >= 0;
      }
      return false;
    },
  }
}
</script>

<style scoped>
.post-html-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}

.post-text-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}
</style>
