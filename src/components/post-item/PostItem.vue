<template>
  <!-- post item (everything after the dark grey box): title, description, image, url, comment -->
  <v-card
    elevation="6" 
    :class="{ 'post-read' : post.isRead }"
    @click="showFullPost = !showFullPost"
  >
    <!-- title + thumbnail -->
    <v-card-title
      class="d-flex flex-row flex-auto pa-4 flex-wrap align-start"
      style="gap: 1rem;"
    >
      <v-img
        v-if="post.postImgSrc" 
        class="post-thumbnail roundedm"
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
          class="post-text-frame"
        >
          {{ post.postTitle.value }}
        </div>
        <v-divider class="mb-1 mt-0" />
        <div
          v-if="post.lastUpdatedTimestamp && post.lastUpdatedTimestamp !== post.publishTimestamp" 
          class="d-flex flex-grow-1 justify-start align-center text-subtitle-2"
        >
          {{ $t('updated') }}
          {{ post.lastUpdatedTimestamp }}
        </div>
        <div class="d-flex flex-grow-1 justify-start align-center text-subtitle-2">
          {{ $t('published') }}
          {{ post.publishTimestamp }}
        </div>
        <div class="d-flex flex-grow-1 justify-start align-center text-subtitle-2">
          {{ post.importerDesc }}
        </div>
      </div>
    </v-card-title>
    <v-divider v-if="showFullPost" />
    <v-expand-transition>
      <v-card v-if="showFullPost">
        <v-card-text v-if="post.postDesc || true">
          <!-- post description (hidden w/no detials) -->
          <v-label>{{ $t('description') }} ({{ 'post.postDesc.type' }})</v-label>
          <div
            v-if="isHtmlContent(post.postDesc)"
            class="post-html-frame" 
            frameborder="0"
            v-html="post.postDesc.value"
          />
          <div
            v-else
            class="post-text-frame"
          >
            {{ 'post.postDesc.value' }}
          </div>
        </v-card-text>
        <v-card-text v-if="post.postContents || true">
          <!-- post contents -->
          <v-label>{{ $t('contents') }} ({{ '1/1' }})</v-label>
          <div
            v-for="c of [{type: 'text', value: 'post.postContents'}]"
            :key="c"
          >
            <div
              v-if="isHtmlContent(c)"
              class="post-html-frame" 
              v-html="c.value"
            />
            <div
              v-else
              class="post-text-frame"
            >
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
          @playing="onMediaPlaying" 
          @audioPlay="onAudioPlay"
        />
        <!-- post itunes -->
        <PostITunes
          v-if="post.postITunes"
           
          :i-tunes="post.postITunes" 
          @playFirstEnclosure="onPlayFirstEnclosure"
        />
        <!-- post enclosures -->
        <v-card-text v-if="post.enclosures">
          <PostEnclosure
            v-for="(enclosure, i) in post.enclosures"
            :key="enclosure"
            :ref="'postEnclosure_' + i"
            
            :enclosure="enclosure" 
            @playing="onEnclosurePlaying(i)" 
            @audioPlay="onAudioPlay"
          />
        </v-card-text>
        <!-- post urls, i.e., 'other links' (hidden w/no details) -->
        <v-card-text v-if="post.postUrls">
          <v-label>{{ $t('links') }}</v-label>
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
                (postUrl.rel ? (" (" + postUrl.rel + ")") : '') + 
                (postUrl.hreflang ? (" (" + postUrl.hreflang + ")") : '') 
            }}
          </div>
        </v-card-text>
        <!-- post comment (hidden w/no details) -->
        <v-card-text v-if="post.postComment">
          <v-label>{{ $t('postComments') }}</v-label>
          <div>{{ trimToLength(post.postComment, 128) }}</div>
        </v-card-text>
        <!-- post authors -->
        <v-card-text v-if="post.postAuthors || post.publishTimestamp || post.lastUpdatedTimestamp">
          <v-label v-if="post.postAuthors">
            {{ post.postAuthors.length > 1 ? $t('authors') : $t('author') }}
          </v-label>
          <div
            v-for="author of post.postAuthors"
            :key="author"
          >
            {{ 
              (author.name ? author.name : author.email) + 
                (author.email ? (" (" + author.email + ")") : '')
            }}
          </div>
        </v-card-text>
        <!-- post contributors -->
        <v-card-text v-if="post.postContributors">
          <v-label>{{ $t('contributors') }}</v-label>
          <div
            v-for="contributor of post.postContributors"
            :key="contributor"
          >
            {{ 
              (contributor.name ? contributor.name : contributor.email) + 
                (contributor.name ? (" (" + contributor.email + ")") : '')
            }}
          </div>
        </v-card-text>
        <!-- post rights (hidden w/no details) -->
        <v-card-text v-if="post.postRights">
          <div>{{ trimToLength(post.postRights, 128) }}</div>
        </v-card-text>
      </v-card>
    </v-expand-transition>
    <v-divider />
    <v-card-actions>
      <!-- toggle read status button -->
      <v-btn
        size="x-small"
        :title="post.isRead ? $t('markPostAsUnread') : $t('markPostAsRead')"
        :aria-label="$t('markPostAsUnread')"
        :icon="post.isRead ? 'fa-eye' : 'fa-eye-slash'"
        @click.stop="togglePostReadStatus"
      />
      <!-- toggle read-later status button -->
      <v-btn
        size="x-small"
        :title="post.isReadLater ? $t('unmarkPostAsReadLater') : $t('markPostAsReadLater')"
        :aria-label="$t('markPostAsReadLater')"
        :icon="(post.isReadLater ? 'fa-bullseye' : 'fa-circle-o')"
        @click.stop="togglePostReadLaterStatus"
      />
      <!-- star button -->
      <v-btn
        v-if="!post.isPublished"
        size="x-small"
        :title="$t('starThisPost')"
        :aria-label="$t('starThisPost')"
        icon="fa-star-o"
        @click.stop="stagePost"
      />
      <!-- un-star button -->
      <v-btn
        v-if="post.isPublished"
        class="star-colored"
        size="x-small"
        :title="$t('unstarThisPost')"
        :aria-label="$t('unstarThisPost')"
        icon="fa-star"
        @click.stop="unstagePost"
      />
      <!-- link button -->
      <v-btn
        size="x-small"
        :title="$t('openOriginalArticle')"
        :aria-label="$t('openOriginalArticle')"
        icon="fa-link"
        @click.stop="$emit('openPostUrl')"
      />
      <v-btn
        v-if="post.postCategories && post.postCategories.length > 0"
        size="x-small"
        :title="$t('showPostCategories')"
        :aria-label="$t('showPostCategories')"
        :icon="showPostCategories ? 'fa-compress' : 'fa-tags'"
        @click.stop="showPostCategories = !showPostCategories"
      />
      <v-btn
        v-for="postCategory in post.postCategories"
        v-show="showPostCategories"
        :key="postCategory"
        size="x-small"
        :title="$t('addCategoryToFilter', { postCategory: postCategory })"
        :text="postCategory" 
        @click.stop="$emit('updatePostFeedFilter', { name: 'category', value: postCategory })"
      />
      <v-btn
        size="x-small"
        :title="$t('showPostSharing')"
        :aria-label="$t('showPostSharing')"
        :icon="showPostSharing ? 'fa-compress' : 'fa-share-alt'"
        @click.stop="showPostSharing = !showPostSharing"
      />
      <v-btn
        v-for="sharingOption in sharingOptions"
        v-show="showPostSharing"
        :key="sharingOption"
        size="x-small"
        :title="$t('shareWith_' + sharingOption.name)"
        :aria-label="$t('shareWith_' + sharingOption.name + '_ariaLabel')"
        :icon="'fa-' + sharingOption.icon"
        @click.stop="$emit('share', { sharingOption: sharingOption, post: post })"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import PostEnclosure from '@/components/post-item/PostEnclosure.vue';
import PostMedia from '@/components/post-media/PostMedia.vue';
import PostITunes from '@/components/post-item/PostITunes.vue';

export default {
  name: "PostItem",
  components: { 
    PostEnclosure,
    PostMedia, 
    PostITunes
  },
  props: {
    post: { type: Object, required: true },
    idx: { type: Number, required: true },
    baseUrl: { type: String, required: true },
    sharingOptions: { type: Array, default: null },
  },
  emits: [
    "updatePostReadStatus",
    "updatePostPubStatus",
    "updatePostFeedFilter",
    "openPostUrl",
    "playing",
    "audioPlay",
    "goToNextPost",
    "goToPreviousPost",
    "share",
  ],
  data() {
    return {
      showPostCategories: false,
      showPostSharing: false,
      showFullPost: false,
    };
  },
  computed: {
    postFieldWrapperPadding: function() {
      return this.compact ? '.44rem' : '.75rem';
    },
    postItemRowAlignment: function() {
      return this.compact ? 'center' : 'flex-start';
    },
    postTextFrameFontSize: function() {
      return this.compact ? 'normal' : 'larger';
    }
  },
  methods: {
    focusHandle() {
      this.$refs.postHandle.focus();
    },
    onPlayFirstEnclosure(details) {
      if (this.post.enclosures) {
        this.$emit('audioPlay', { url: this.post.enclosures[0].url, details: details });
      }
    },
    onAudioPlay(url) {
      this.$emit('audioPlay', { url: url });
    },
    onMediaPlaying() {
      // pause all enclosures 
      if (this.post.enclosures) {
        for (let i = 0; i < this.post.enclosures.length; i++) {
          let r = this.$refs['postEnclosure_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
      this.$emit('playing', this.post.id);
    },
    onEnclosurePlaying(idx) {
      // pause media 
      if (this.$refs.postMedia) {
        this.$refs.postMedia.pause();
      }
      // pause all enclosures where idx != idx 
      if (this.post.enclosures) {
        for (let i = 0; i < this.post.enclosures.length; i++) {
          if (i === idx) {
            continue;
          }
          let r = this.$refs['postEnclosure_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
      this.$emit('playing', this.post.id);
    },
    pauseMedia() {
      if (this.$refs.postMedia) {
        this.$refs.postMedia.pause();
      }
      if (this.post.enclosures) {
        for (let i = 0; i < this.post.enclosures.length; i++) {
          let r = this.$refs['postEnclosure_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
    },
    isHtmlContent(contentObj) {
      return contentObj != null && contentObj.type != null && contentObj.type.toLowerCase().indexOf('html') >= 0;
    },
    stagePost() {
      console.log("post-item: publishing post id=" + this.post.id);
      this.updatePostPubStatus(this.post.feedIdent, 'PUB_PENDING', 'stagePost');
    },
    unstagePost() {
      console.log("post-item: unstaging post id=" + this.post.id);
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
        console.log("post-item: marking post id=" + this.post.id + " as read");
        newStatus = 'READ';
      } else {
        console.log("post-item: unmarking post id=" + this.post.id + " as read");
        newStatus = 'UNREAD';
      }
      this.updatePostReadStatus(newStatus, "togglePostReadStatus");
    },
    togglePostReadLaterStatus() {
      let newStatus;
      if (!this.post.isReadLater) {
        console.log("post-item: marking post id=" + this.post.id + " as read-later");
        newStatus = 'READ_LATER';
      } else {
        console.log("post-item: unmarking post id=" + this.post.id + " as read-later");
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
    goToNextPost() {
      this.$emit('goToNextPost');
    },
    goToPreviousPost() {
      this.$emit('goToPreviousPost');
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
};
</script>

<style scoped>
.post-html-frame > * {
  background-color: currentColor;
}

.post-thumbnail {
  background-color: currentColor;
}

.post-read {
}
</style>
