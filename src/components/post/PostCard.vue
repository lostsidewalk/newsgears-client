<template>
  <v-card
    elevation="6"
    :class="{ 'post-read': post.isRead }"
  >
    <!-- title + thumbnail -->
    <v-card-title
      class="d-flex flex-row flex-auto flex-wrap align-start overflow-auto"
      :class="[pa4r, collapsible ? 'clickable' :'']"
      style="gap: 1rem; white-space: normal"
      @click="$event => {
        if (collapsible) {
          showFullPost = !showFullPost;
        }
      }"
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
        <v-divider class="my-1" />
        <div class="d-flex flex-row flex-wrap justify-space-between">
          <div>
            <div
              v-if="
                post.lastUpdatedTimestamp &&
                  post.lastUpdatedTimestamp !== post.publishTimestamp
              "
              class="d-flex flex-grow-1 justify-start align-center text-subtitle-2"
              style="font-weight: bold"
            >
              {{ $t("updatedColon") }}
              {{ formatTimestamp(post.lastUpdatedTimestamp) }}
            </div>
            <div
              class="d-flex flex-grow-1 justify-start align-center text-subtitle-2"
            >
              {{ $t("publishedColon") }}
              {{ formatTimestamp(post.publishTimestamp) }}
            </div>
            <div
              class="d-flex flex-grow-1 justify-start align-center text-subtitle-2"
            >
              {{ post.importerDesc }}
            </div>
          </div>
          <v-chip-group>
            <v-chip :size="buttonSize">
              {{ formatStatus(post.postReadStatus) }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>
    </v-card-title>
    <!-- divider -->
    <v-divider v-if="showFullPost" />
    <!-- body -->
    <v-card-text
      v-if="showFullPost"
    >
      <!-- description -->
      <div
        v-if="post.postDesc"
        class="overflow-auto"
      >
        <!-- post description (hidden w/no detials) -->
        <v-label>
          {{ $t("description") }} ({{ post.postDesc.type }})
        </v-label>
        <v-divider class="my-1" />
        <div
          v-if="isHtmlContent(post.postDesc)"
          v-dompurify-html="post.postDesc.value"
          class="post-html-frame"
          frameborder="0"
        />
        <div
          v-else
          class="post-text-frame"
        >
          {{ post.postDesc.value }}
        </div>
      </div>
      <!-- contents -->
      <div
        v-if="post.postContents"
        class="overflow-auto"
      >
        <div
          v-for="(c,idx) in post.postContents"
          :key="c"
        >
          <!-- post contents (hidden w/no detials) -->
          <v-label>
            {{ $t("contentsNofM", { n: idx + 1, m: post.postContents.length }) }} ({{ c.type }})
          </v-label>
          <v-divider class="my-1" />
          <div
            v-if="isHtmlContent(c)"
            v-dompurify-html="c.value"
            class="post-html-frame"
          />
          <div
            v-else
            class="post-text-frame"
          >
            {{ c.value }}
          </div>
        </div>
      </div>
      <!-- divider -->
      <v-divider v-if="post.postMedia" />
      <!-- post media -->
      <PostMedia
        v-if="post.postMedia"
        ref="postMedia"
        class="ma-2"
        :media="post.postMedia"
        @playEnclosure="$emit('playEnclosure', $event)"
      />
      <!-- divider -->
      <v-divider v-if="post.postITunes" />
      <!-- post itunes -->
      <PostITunes
        v-if="post.postITunes"
        class="ma-2"
        :i-tunes="post.postITunes"
      />
      <!-- post enclosures -->
      <v-sheet v-if="post.enclosures">
        <PostEnclosure
          v-for="enclosure in post.enclosures"
          :key="enclosure"
          class="ma-2"
          :enclosure="enclosure"
          @playEnclosure="$emit('playEnclosure', $event)"
        />
      </v-sheet>
      <!-- post urls, i.e., 'other links' (hidden w/no details) -->
      <div v-if="post.postUrls">
        <v-label>{{ $t("links") }}</v-label>
        <div
          v-for="postUrl of post.postUrls"
          :key="postUrl"
          class="post-other-link"
        >
          <a
            :class="post.isRead ? 'subdued-link' : 'link'"
            :href="postUrl.href"
            target="_blank"
          >
            <v-icon icon="fa-link" />
          </a>
          {{
            (postUrl.title ? postUrl.title : postUrl.type) +
              (postUrl.rel ? " (" + postUrl.rel + ")" : "") +
              (postUrl.hreflang ? " (" + postUrl.hreflang + ")" : "")
          }}
        </div>
      </div>
      <!-- post comment (hidden w/no details) -->
      <div v-if="post.postComment">
        <v-label>{{ $t("postComments") }}</v-label>
        <div>{{ post.postComment }}</div>
      </div>
      <!-- post authors -->
      <div v-if="post.authors">
        <v-label v-if="post.authors">
          {{ post.authors.length > 1 ? $t("authors") : $t("author") }}
        </v-label>
        <div
          v-for="author of post.authors"
          :key="author"
        >
          {{
            (author.name ? author.name : author.email) +
              (author.email ? " (" + author.email + ")" : "")
          }}
        </div>
      </div>
      <!-- post contributors -->
      <div v-if="post.contributors">
        <v-label>{{ $t("contributors") }}</v-label>
        <div
          v-for="contributor of post.contributors"
          :key="contributor"
        >
          {{
            (contributor.name ? contributor.name : contributor.email) +
              (contributor.name ? " (" + contributor.email + ")" : "")
          }}
        </div>
      </div>
      <!-- post rights (hidden w/no details) -->
      <div v-if="post.postRights">
        <div>{{ post.postRights }}</div>
      </div>
    </v-card-text>
    <!-- divider -->
    <v-divider />
    <!-- actions -->
    <v-card-actions
      class="d-flex flex-wrap"
      style="justify-content: start"
    >
      <slot name="additional" />
      <!-- toggle read status button -->
      <v-btn
        :size="buttonSize"
        :title="post.isRead ? $t('markPostAsUnread') : $t('markPostAsRead')"
        :aria-label="$t('markPostAsUnread')"
        :prepend-icon="post.isRead ? 'fa-eye' : 'fa-check-square-o'"
        @click.stop="togglePostReadStatus"
      />
      <!-- toggle read-later status button -->
      <v-btn
        :size="buttonSize"
        :title="
          post.isReadLater
            ? $t('unmarkPostAsReadLater')
            : $t('markPostAsReadLater')
        "
        :aria-label="$t('markPostAsReadLater')"
        :prepend-icon="post.isReadLater ? 'fa-circle-o' : 'fa-bullseye'"
        @click.stop="togglePostReadLaterStatus"
      />
      <!-- link button -->
      <v-btn
        :size="buttonSize"
        :title="$t('openOriginalArticle')"
        :aria-label="$t('openOriginalArticle')"
        :prepend-icon="'fa-link'"
        @click.stop="$emit('openPostUrl')"
      />
      <!-- toggle post categories button -->
      <v-btn
        v-if="post.postCategories && post.postCategories.length > 0"
        :size="buttonSize"
        :title="$t('showPostCategories')"
        :aria-label="$t('showPostCategories')"
        :prepend-icon="showPostCategories ? 'fa-compress' : 'fa-tags'"
        @click.stop="showPostCategories = !showPostCategories"
      />
      <!-- post category buttons (the actual categories) -->
      <v-btn
        v-for="postCategory in post.postCategories"
        v-show="showPostCategories"
        :key="postCategory"
        :size="buttonSize"
        :title="$t('addCategoryToFilter', { postCategory: postCategory })"
        :aria-label="$t('addCategoryToFilter', { postCategory: postCategory })"
        :prepend-icon="'fa-tags'"
        :text="postCategory"
        @click.stop="queueStore.updateFilter({
          name: 'category',
          value: postCategory,
          queueId: post.queueId,
        })"
      />
      <!-- toggle sharing options button -->
      <v-btn
        :size="buttonSize"
        :title="$t('showPostSharing')"
        :aria-label="$t('showPostSharing')"
        :prepend-icon="showPostSharing ? 'fa-compress' : 'fa-share-alt'"
        @click.stop="showPostSharing = !showPostSharing"
      />
      <!-- post sharing buttons (the actual sharing options) -->
      <v-btn
        v-for="sharingOption in sharingOptions"
        v-show="showPostSharing"
        :key="sharingOption"
        :size="buttonSize"
        :title="$t('shareWith_' + sharingOption.name)"
        :aria-label="$t('shareWith_' + sharingOption.name + '_ariaLabel')"
        :prepend-icon="'fa-' + sharingOption.icon"
        @click.stop="
          $emit('share', { sharingOption: sharingOption, post: post })
        "
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref } from 'vue';

import { useTimestamp } from '@/composable/useTimestamp.js';
import { usePosts } from '@/composable/usePosts.js';
import { useQueues } from '@/composable/useQueues.js';

import PostEnclosure from "./PostEnclosure.vue";
import PostMedia from "./PostMedia.vue";
import PostITunes from "./PostITunes.vue";
import buttonSizeMixin from '@/mixins/buttonSizeMixin';
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "PostCard",
  components: {
    PostEnclosure,
    PostMedia,
    PostITunes,
  },
  mixins: [buttonSizeMixin, spacingMixin], 
  props: {
    baseUrl: { type: String, required: true },
    post: { type: Object, required: true },
    sharingOptions: { type: Array, default: null },
    collapsible: { type: Boolean, default: true },
    collapsed: { type: Boolean, default: false },
  },
  emits: [
    "playEnclosure",
    "openPostUrl",
    "share",
    "updatePostReadStatus",
  ],
  setup(props, { emit }) {
    const { formatTimestamp } = useTimestamp();
    const { formatStatus } = usePosts();
    const { queueStore } = useQueues(props);

    const showPostCategories = ref(false);
    const showPostSharing = ref(false);
    const showFullPost = ref(!props.collapsed);
    const showFirstEnclosure = ref(false);

    function isHtmlContent(contentObj) {
      return (
        contentObj != null &&
        contentObj.type != null &&
        contentObj.type.toLowerCase().indexOf("html") >= 0
      );
    }

    function togglePostReadStatus() {
      let newStatus;
      if (!props.post.isRead) {
        newStatus = "READ";
      } else {
        newStatus = "UNREAD";
      }
      updatePostReadStatus(newStatus, "togglePostReadStatus");
    }

    function togglePostReadLaterStatus() {
      let newStatus;
      if (!props.post.isReadLater) {
        newStatus = "READ_LATER";
      } else {
        newStatus = "UNREAD";
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
      formatTimestamp,
      formatStatus,
      queueStore,
      // 
      showPostCategories,
      showPostSharing,
      showFullPost,
      showFirstEnclosure,
      // 
      isHtmlContent,
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

.post-read {
  mix-blend-mode: luminosity;
}
</style>
