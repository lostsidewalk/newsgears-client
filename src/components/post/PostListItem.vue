<template>
  <v-list-item
    elevation="6"
    :value="post"
    class="rounded"
    :class="{ 'post-read' : post.isRead }"
    @click.stop="$emit('openPost', post.id)"
  >
    <!-- title + thumbnail -->
    <v-list-item-title 
      class="d-flex flex-row flex-auto flex-wrap align-start overflow-auto mt-2"
      style="gap: 1rem;white-space: normal;"
    >
      <v-img
        v-if="post.postImgSrc" 
        class="post-thumbnail rounded"
        :src="post.postImgSrc"
        :alt="$t('postThumbnailImage')" 
        width="140"
        max-height="140"
        max-width="140"
      /> 
      <div class="d-flex flex-column flex-auto flex-grow-1">
        <div
          v-if="isHtmlTitle" 
          v-dompurify-html="post.postTitle.value"
          class="post-html-frame"
          frameborder="0"
        />
        <div
          v-else
          class="post-text-frame"
        >
          {{ post.postTitle.value }}
        </div>
        <div
          v-if="post.lastUpdatedTimestamp && post.lastUpdatedTimestamp !== post.publishTimestamp" 
          class="d-flex flex-grow-1 justify-start align-center text-subtitle-2"
        >
          {{ $t('updatedColon') }}
          {{ formatTimestamp(post.lastUpdatedTimestamp) }}
        </div>
        <div class="d-flex flex-grow-1 justify-start align-center text-subtitle-2">
          {{ $t('publishedColon') }}
          {{ formatTimestamp(post.publishTimestamp) }}
        </div>
        <div class="d-flex flex-grow-1 justify-start align-center text-subtitle-2">
          {{ post.importerDesc }}
        </div>
      </div>
    </v-list-item-title>
    <!-- post description -->
    <v-list-item-subtitle
      class="mt-2"
    >
      <div
        v-if="isHtmlDesc"
        v-dompurify-html="post.postDesc.value" 
        class="post-html-frame mb-2"
        frameborder="0"
      />
      <div
        v-else-if="post.postDesc"
        class="post-text-frame"
      >
        {{ post.postDesc.value }}
      </div>
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script>
import { useTimestamp } from '@/composable/useTimestamp';

export default {
  name: "PostListItem",
  props: {
    post: { type: Object, required: true },
  },
  emits: [
    "openPost",
    "updatePostReadStatus",
  ],
  setup() {
    const { formatTimestamp } = useTimestamp();

    return {
      formatTimestamp
    }
  },
  computed: {
    isHtmlTitle: function () {
      return this.post.postTitle != null && 
        this.post.postTitle.type != null && 
        this.post.postTitle.type.toLowerCase().indexOf('html') >= 0;
    },
    isHtmlDesc: function () {
      return this.post.postDesc != null && 
        this.post.postDesc.type != null && 
        this.post.postDesc.type.toLowerCase().indexOf('html') >= 0;
    }
   },
  methods: {
    togglePostReadStatus() {
      let newStatus;
      if (!this.post.isRead) {
        console.log("post: marking post id=" + this.post.id + " as read");
        newStatus = 'READ';
      } else {
        console.log("post: unmarking post id=" + this.post.id + " as read");
        newStatus = 'UNREAD';
      }
      this.updatePostReadStatus(newStatus, "togglePostReadStatus");
    },
    togglePostReadLaterStatus() {
      let newStatus;
      if (!this.post.isReadLater) {
        console.log("post: marking post id=" + this.post.id + " as read-later");
        newStatus = 'READ_LATER';
      } else {
        console.log("post: unmarking post id=" + this.post.id + " as read-later");
        newStatus = 'UNREAD';
      }
      this.updatePostReadStatus(newStatus, "togglePostReadLaterStatus");
    },
    updatePostReadStatus(newStatus, successSignal) {
      this.$emit('updatePostReadStatus', { 
            id: this.post.id, 
            newStatus: newStatus, 
            originator: successSignal,
          });
    },
  }
};
</script>

<style scoped>
.post-thumbnail {
  background-color: transparent;
}

.post-html-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}

.post-text-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}
</style>
