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
      class="d-flex flex-row flex-auto flex-wrap align-start overflow-auto mt-2 gap-1"
      style="white-space: normal;"
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

        <v-divider />
        
        <div class="d-flex flex-row flex-wrap justify-space-between">
          <div>
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
          <div class="ma-1">
            <span
              :size="buttonSize"
              class="post-status-label"
            >
              {{ formatStatus(post.postReadStatus) }}
            </span>
          </div>
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
import { computed } from 'vue';

import { useTimestamp } from '@/composable/useTimestamp';
import { usePosts } from '@/composable/usePosts';

import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "PostListItem",
  mixins: [buttonSizeMixin],
  props: {
    post: { type: Object, required: true },
  },
  emits: [
    "openPost",
    "updatePostReadStatus",
  ],
  setup(props, { emit }) {
    const { formatTimestamp } = useTimestamp();
    const { formatStatus } = usePosts();

    const isHtmlTitle = computed(() => {
      return props.post.postTitle != null &&
        props.post.postTitle.type != null &&
        props.post.postTitle.type.toLowerCase().indexOf('html') >= 0;
    });

    const isHtmlDesc = computed(() => {
      return props.post.postDesc != null &&
        props.post.postDesc.type != null &&
        props.post.postDesc.type.toLowerCase().indexOf('html') >= 0;
    });

    function togglePostReadStatus() {
      let newStatus;
      if (!props.post.isRead) {
        newStatus = 'READ';
      } else {
        newStatus = 'UNREAD';
      }
      updatePostReadStatus(newStatus, "togglePostReadStatus");
    }

    function togglePostReadLaterStatus() {
      let newStatus;
      if (!props.post.isReadLater) {
        newStatus = 'READ_LATER';
      } else {
        newStatus = 'UNREAD';
      }
      updatePostReadStatus(newStatus, "togglePostReadLaterStatus");
    }

    function updatePostReadStatus(newStatus, successSignal) {
      emit('updatePostReadStatus', { 
            id: props.post.id, 
            newStatus: newStatus, 
            originator: successSignal,
          });
    }

    return {
      isHtmlTitle,
      isHtmlDesc,
      // 
      formatTimestamp,
      formatStatus,
      // 
      togglePostReadStatus,
      togglePostReadLaterStatus,
    }
  },
};
</script>

<style scoped>
.post-thumbnail {
  background-color: transparent;
}

.post-status-label {
  font-size: x-small;
  font-weight: bold;
}
</style>
