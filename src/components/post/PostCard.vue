<template>
  <!-- post item (everything after the dark grey box): title, description, image, url, comment -->
  <v-card
    elevation="6"
    :class="{ 'post-read': post.isRead }"
  >
    <!-- title + thumbnail -->
    <v-card-title
      class="d-flex flex-row flex-auto pa-4 flex-wrap align-start overflow-auto clickable"
      style="gap: 1rem; white-space: normal"
      @click="showFullPost = !showFullPost"
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
        <div v-else>
          {{ post.postTitle.value }}
        </div>
        <v-divider class="mb-1 mt-0" />
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
    </v-card-title>
    <v-divider v-if="showFullPost" />
    <v-card-text
      v-if="showFullPost"
    >
      <v-card>
        <v-card-text
          v-if="post.postDesc"
          class="overflow-auto"
        >
          <!-- post description (hidden w/no detials) -->
          <v-label>
            {{ $t("description") }} ({{ post.postDesc.type }})
          </v-label>
          <div
            v-if="isHtmlContent(post.postDesc)"
            class="post-html-frame"
            frameborder="0"
            v-html="post.postDesc.value"
          />
          <div v-else>
            {{ post.postDesc.value }}
          </div>
        </v-card-text>
        <v-card-text
          v-if="post.postContents"
          class="overflow-auto"
        >
          <div
            v-for="c in post.postContents"
            :key="c"
          >
            <div
              v-if="isHtmlContent(c)"
              class="post-html-frame"
              v-html="c.value"
            />
            <div v-else>
              {{ c.value }}
            </div>
          </div>
        </v-card-text>
        <!-- post media -->
        <PostMedia
          v-if="post.postMedia"
          ref="postMedia"
          class="ma-4"
          :media="post.postMedia"
        />
        <!-- post itunes -->
        <PostITunes
          v-if="post.postITunes"
          class="ma-4"
          :i-tunes="post.postITunes"
          @playFirstEnclosure="showFirstEnclosure = true"
        />
        <!-- post enclosures -->
        <v-sheet v-if="post.enclosures">
          <!-- first enclosure on a dialog -->
          <v-dialog v-model="showFirstEnclosure">
            <PostEnclosure :enclosure="post.enclosures[0]" />
          </v-dialog>
          <PostEnclosure
            v-for="enclosure in post.enclosure"
            :key="enclosure"
            :enclosure="enclosure"
          />
        </v-sheet>
        <!-- post urls, i.e., 'other links' (hidden w/no details) -->
        <v-card-text v-if="post.postUrls">
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
        </v-card-text>
        <!-- post comment (hidden w/no details) -->
        <v-card-text v-if="post.postComment">
          <v-label>{{ $t("postComments") }}</v-label>
          <div>{{ post.postComment }}</div>
        </v-card-text>
        <!-- post authors -->
        <v-card-text v-if="post.authors">
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
        </v-card-text>
        <!-- post contributors -->
        <v-card-text v-if="post.contributors">
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
        </v-card-text>
        <!-- post rights (hidden w/no details) -->
        <v-card-text v-if="post.postRights">
          <div>{{ post.postRights }}</div>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-divider />
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
        :icon="post.isRead ? 'fa-check-square-o' : 'fa-eye'"
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
        :icon="post.isReadLater ? 'fa-bullseye' : 'fa-circle-o'"
        @click.stop="togglePostReadLaterStatus"
      />
      <!-- star button -->
      <v-btn
        v-if="!post.isPublished"
        :size="buttonSize"
        :title="$t('starThisPost')"
        :aria-label="$t('starThisPost')"
        icon="fa-star-o"
        @click.stop="stagePost"
      />
      <!-- un-star button -->
      <v-btn
        v-if="post.isPublished"
        class="star-colored"
        :size="buttonSize"
        :title="$t('unstarThisPost')"
        :aria-label="$t('unstarThisPost')"
        icon="fa-star"
        @click.stop="unstagePost"
      />
      <!-- link button -->
      <v-btn
        :size="buttonSize"
        :title="$t('openOriginalArticle')"
        :aria-label="$t('openOriginalArticle')"
        icon="fa-link"
        @click.stop="$emit('openPostUrl')"
      />
      <v-btn
        v-if="post.postCategories && post.postCategories.length > 0"
        :size="buttonSize"
        :title="$t('showPostCategories')"
        :aria-label="$t('showPostCategories')"
        :icon="showPostCategories ? 'fa-compress' : 'fa-tags'"
        @click.stop="showPostCategories = !showPostCategories"
      />
      <v-btn
        v-for="postCategory in post.postCategories"
        v-show="showPostCategories"
        :key="postCategory"
        :size="buttonSize"
        :title="$t('addCategoryToFilter', { postCategory: postCategory })"
        :text="postCategory"
        @click.stop="
          $emit('updateFilter', {
            name: 'category',
            value: postCategory,
          })
        "
      />
      <v-btn
        :size="buttonSize"
        :title="$t('showPostSharing')"
        :aria-label="$t('showPostSharing')"
        :icon="showPostSharing ? 'fa-compress' : 'fa-share-alt'"
        @click.stop="showPostSharing = !showPostSharing"
      />
      <v-btn
        v-for="sharingOption in sharingOptions"
        v-show="showPostSharing"
        :key="sharingOption"
        :size="buttonSize"
        :title="$t('shareWith_' + sharingOption.name)"
        :aria-label="$t('shareWith_' + sharingOption.name + '_ariaLabel')"
        :icon="'fa-' + sharingOption.icon"
        @click.stop="
          $emit('share', { sharingOption: sharingOption, post: post })
        "
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { useTimestamp } from '@/composable/useTimestamp.js';
import PostEnclosure from "@/components/post/PostEnclosure.vue";
import PostMedia from "@/components/post/PostMedia.vue";
import PostITunes from "@/components/post/PostITunes.vue";
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "PostCard",
  components: {
    PostEnclosure,
    PostMedia,
    PostITunes,
  },
  mixins: [buttonSizeMixin], 
  props: {
    post: { type: Object, required: true },
    sharingOptions: { type: Array, default: null },
    collapsed: { type: Boolean, default: false },
  },
  emits: [
    "updatePostReadStatus",
    "updatePostPubStatus",
    "updateFilter",
    "openPostUrl",
    "share",
  ],
  setup() {
    const { formatTimestamp } = useTimestamp();

    return {
      formatTimestamp
    }
  },
  data() {
    return {
      showPostCategories: false,
      showPostSharing: false,
      showFullPost: !this.collapsed,
      showFirstEnclosure: false,
    };
  },
  methods: {
    isHtmlContent(contentObj) {
      return (
        contentObj != null &&
        contentObj.type != null &&
        contentObj.type.toLowerCase().indexOf("html") >= 0
      );
    },
    stagePost() {
      console.log("post: publishing post id=" + this.post.id);
      this.updatePostPubStatus(this.post.queueIdent, "PUB_PENDING", "stagePost");
    },
    unstagePost() {
      console.log("post: unstaging post id=" + this.post.id);
      this.updatePostPubStatus(
        this.post.queueIdent,
        "DEPUB_PENDING",
        "unstagePost"
      );
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
        newStatus = "READ";
      } else {
        console.log("post: unmarking post id=" + this.post.id + " as read");
        newStatus = "UNREAD";
      }
      this.updatePostReadStatus(newStatus, "togglePostReadStatus");
    },
    togglePostReadLaterStatus() {
      let newStatus;
      if (!this.post.isReadLater) {
        console.log("post: marking post id=" + this.post.id + " as read-later");
        newStatus = "READ_LATER";
      } else {
        console.log("post: unmarking post id=" + this.post.id + " as read-later");
        newStatus = "UNREAD";
      }
      this.updatePostReadStatus(newStatus, "togglePostReadLaterStatus");
    },
    updatePostReadStatus(newStatus, successSignal) {
      this.$emit("updatePostReadStatus", {
        id: this.post.id,
        newStatus: newStatus,
        originator: successSignal,
      });
    },
    updatePostPubStatus(queueIdent, newStatus, successSignal) {
      this.$emit("updatePostPubStatus", {
        id: this.post.id,
        newStatus: newStatus,
        queueIdent: queueIdent,
        originator: successSignal,
      });
    },
  },
};
</script>

<style scoped>
.post-thumbnail {
  background-color: transparent;
}

.post-html-frame {
  overflow: auto;
}

.post-read {
  mix-blend-mode: luminosity;
}

.clickable:hover {
  cursor: pointer;
}
</style>
