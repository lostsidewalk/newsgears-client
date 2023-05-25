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
          v-if="isHtmlContent(post.postTitle)" 
          class="post-html-frame"
          frameborder="0"
          v-html="post.postTitle.value"
        />
        <div
          v-else
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
    <v-list-item-subtitle
      class="mt-2"
    >
      <!-- post description (hidden w/no detials) -->
      <div
        v-if="isHtmlContent(post.postDesc)"
        class="post-html-frame mb-2" 
        frameborder="0"
        v-html="post.postDesc.value"
      />
      <div
        v-else-if="post.postDesc"
        class="mt-2 mb-2"
      >
        {{ post.postDesc.value }}
      </div>
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script>
export default {
  name: "PostListItem",
  props: {
    post: { type: Object, required: true },
    sharingOptions: { type: Array, default: null },
  },
  emits: [
    "openPost",
  ],
  data() {
    return {
      showPostCategories: false,
      showPostSharing: false,
    };
  },
  computed: {
    xs: function() {
      return this.$vuetify.display.xs;
    }
  },
  methods: {
    isHtmlContent(contentObj) {
      return contentObj != null && contentObj.type != null && contentObj.type.toLowerCase().indexOf('html') >= 0;
    },
    stagePost() {
      console.log("post: publishing post id=" + this.post.id);
      this.updatePostPubStatus(this.post.feedIdent, 'PUB_PENDING', 'stagePost');
    },
    unstagePost() {
      console.log("post: unstaging post id=" + this.post.id);
      this.updatePostPubStatus(this.post.feedIdent, 'DEPUB_PENDING', "unstagePost");
    },
    toggleStagePost() {
      if (this.post.isPublished) {
        this.unstagePost();
      } else {
        this.stagePost();
      }
    },
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
    updatePostPubStatus(feedIdent, newStatus, successSignal) {
      this.$emit('updatePostPubStatus', { 
            id: this.post.id, 
            newStatus: newStatus, 
            feedIdent: feedIdent,
            originator: successSignal
          });
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
};
</script>

<style scoped>
.post-thumbnail {
  background-color: transparent;
}

.post-html-frame {
  overflow: auto;
}
</style>
