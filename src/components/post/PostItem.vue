<template>
  <div class="post-wrapper" :class="this.isSelected ? 'post-wrapper-selected' : ''" v-auto-animate>
    <div class="post-item-wrapper">
      <!-- post header -->
      <div class="post-item-header">
        <!-- post header buttons -->
        <span class="post-admin-buttons">
          <!-- TODO: extract post-item-button component -->
          <!-- show details button -->
          <button 
            ref="postHandle"
            class="post-admin-button accessible-button"
            @click.stop="togglePostDetails"
            :disabled="disabled"
            :title="this.$t('showPostDetails')"
            :aria-label="this.$t('showPostDetails')">
            <span :class="this.showPostDetails ? 'fa fa-minus' : 'fa fa-plus'"></span>
          </button>
          <!-- go to next post button -->
          <button
            class="post-admin-button accessible-button"
            @click.stop="goToNextPost"
            :disabled="disabled"
            :title="this.$t('goToNextPost')"
            :aria-label="this.$t('goToNextPost')">
            <span class="fa fa-arrow-down"></span>
          </button>
          <!-- go to previous post button -->
          <button
            class="post-admin-button accessible-button"
            @click.stop="goToPreviousPost"
            :disabled="disabled"
            :title="this.$t('goToPreviousPost')"
            :aria-lable="this.$t('goToPreviousPost')">
            <span class="fa fa-arrow-up"></span>
          </button>
          <!-- toggle read status button -->
          <button
            class="post-admin-button accessible-button"
            @click.stop="togglePostReadStatus"
            :disabled="disabled"
            :title="post.isRead ? this.$t('markPostAsUnread') : this.$t('markPostAsRead')"
            :aria-label="this.$t('markPostAsUnread')">
            <span class="fa" :class="post.isRead ? 'fa-eye' : 'fa-eye-slash'"></span>
          </button>
          <!-- toggle read-later status button -->
          <button
            class="post-admin-button accessible-button"
            @click.stop="togglePostReadLaterStatus"
            :disabled="disabled"
            :title="post.isReadLater ? this.$t('unmarkPostAsReadLater') : this.$t('markPostAsReadLater')"
            :aria-label="this.$t('markPostAsReadLater')">
            <span :class="'fa ' + (post.isReadLater ? 'fa-bullseye' : 'fa-circle-o')"></span>
          </button>
          <!-- star button -->
          <button v-if="!post.isPublished"
            class="post-admin-button accessible-button"
            @click.stop="stagePost"
            :disabled="disabled"
            :title="this.$t('starThisPost')"
            :aria-label="this.$t('starThisPost')">
            <span class="fa fa-star-o"></span>
          </button>
          <!-- un-star button -->
          <button v-if="post.isPublished"
            class="post-admin-button accessible-button star-colored"
            @click.stop="unstagePost"
            :disabled="disabled"
            :title="this.$t('unstarThisPost')"
            :aria-label="this.$t('unstarThisPost')">
            <span class="fa fa-star"></span>
          </button>
          <!-- link button -->
          <button
            class="post-admin-button accessible-button"
            @click.stop="this.$emit('openPostUrl')"
            :disabled="disabled"
            :title="this.$t('openOriginalArticle')"
            :aria-label="this.$t('openOriginalArticle')">
            <span class="fa fa-link"></span>
          </button>
          <!-- toggle post categories -->
          <button v-if="this.post.postCategories && this.post.postCategories.length > 0"
            class="post-admin-button accessible-button"
            @click.stop="togglePostCategories"
            :disabled="disabled"
            :title="this.$t('showPostCategories')"
            :aria-label="this.$t('showPostCategories')">
            <span class="fa fa-list"></span>
          </button>
        </span>
        <!-- post header pills -->
        <span class="post-item-header-pills pill-container" v-if="this.showPostCategories">
          <!-- post categories -->
          <button v-for="postCategory in post.postCategories" :key="postCategory"
            class="br-pill accessible-button"
            @click.stop="updateFeedFilter('category', postCategory)"
            :title="'Add this category (' + postCategory + ') to the filter'"
            :aria-label="'Add this category (' + postCategory + ') to the filter'">
            {{ postCategory }}
          </button>
        </span>
      </div>
      <!-- post item (everything after the dark grey box): title, description, image, url, comment -->
      <div class="post-item-body" :class="(post.isRead ? ' post-read' : '')">
        <!-- post title -->
        <div class="post-item-row">
          <button @click.stop="togglePostDetails" @keypress.enter.prevent="togglePostDetails()">
            <img v-if="post.postImgSrc" 
              :src="post.postImgSrc"
              class="post-thumbnail" 
              :disabled="disabled" 
              :alt="this.$t('postThumbnailImage')" /> 
          </button>
          <div v-if="isHtmlContent(post.postTitle)" 
            class="post-field-wrapper post-html-frame"
            v-html="post.postTitle.value" frameborder="0" />
          <div v-else 
            class="post-field-wrapper post-text-frame">
            {{ post.postTitle.value }}
          </div>
        </div>
        <!-- post description (hidden w/no detials) -->
        <div class="post-item-row" v-if="(this.showPostDetails && post.postDesc)">
          <span class="post-field-wrapper">
            <label class="post-info-label-small">{{ this.$t('description') }} ({{ post.postDesc.type }})</label>
            <div v-if="isHtmlContent(post.postDesc)"
              class='post-field-wrapper post-html-frame' 
              v-html="post.postDesc.value" frameborder="0" />
            <div v-else
              class='post-field-wrapper post-text-frame'>
              {{ post.postDesc.value }}
            </div>
          </span>
        </div>
        <!-- post contents -->
        <div class="post-item-row" v-if="(this.showPostDetails && post.postContents && post.postContents.length > 0)">
          <div v-for="c of post.postContents" :key="c">
            <div v-if="isHtmlContent(c)"
              class='post-field-wrapper post-html-frame' 
              v-html="c.value" />
            <div v-else
              class='post-field-wrapper'>
              {{ c.value }}
            </div>
          </div>
        </div>
        <!-- post media -->
        <div class="post-item-media" v-if="(this.showPostDetails && post.postMedia)">
          <PostMedia 
            ref="postMedia"
            :theme="theme" 
            class="post-field-wrapper"
            :media="post.postMedia" 
            @playing="onMediaPlaying" 
            @audioPlay="onAudioPlay" />
        </div>
        <!-- post itunes -->
        <div class="post-item-row" v-if="(this.showPostDetails && post.postITunes)">
          <PostITunes 
            :theme="theme" 
            class="post-field-wrapper" 
            :iTunes="post.postITunes" 
            @playFirstEnclosure="onPlayFirstEnclosure" />
        </div>
        <!-- post enclosures -->
        <div class="post-item-row" v-if="(this.showPostDetails && post.enclosures)">
          <PostEnclosure v-for="(enclosure,idx) in post.enclosures" :key="enclosure"
            :ref="'postEnclosure_' + idx"
            :theme="theme"
            :enclosure="enclosure" 
            @playing="onEnclosurePlaying(idx)" 
            @audioPlay="onAudioPlay" />
        </div>
        <!-- post urls, i.e., 'other links' (hidden w/no details) -->
        <div class="post-item-row" v-if="(this.showPostDetails && post.postUrls && post.postUrls.length > 0)">
          <span class="post-field-wrapper">
            <label class="post-info-label-small">{{ this.$t('links') }}</label>
            <div v-for="postUrl of post.postUrls" :key="postUrl" class="post-other-link">
              <a :class="post.isRead ? 'subdued-link' : 'link'" 
                :href="postUrl.href" 
                target="_blank"
                :disabled="disabled">
                <span class="fa fa-link fa-1x" />
              </a>
              {{ 
                (postUrl.title ? postUrl.title : postUrl.type) + 
                (postUrl.rel ? (" (" + postUrl.rel + ")") : '') + 
                (postUrl.hreflang ? (" (" + postUrl.hreflang + ")") : '') 
              }}
            </div>
          </span>
        </div>
        <!-- post comment (hidden w/no details) -->
        <div class="post-item-row" v-if="(this.showPostDetails && post.postComment)">
          <span class="post-field-wrapper">
            <label class="post-info-label-small">{{ this.$t('postComments') }}</label>
            <div>{{ this.trimToLength(post.postComment, 128) }}</div>
          </span>
        </div>
        <!-- post authors -->
        <div class="post-item-row" v-if="(this.showPostDetails && (post.postAuthors || post.publishTimestamp || post.lastUpdatedTimestamp))">
          <span class="post-field-wrapper">
            <label class="post-info-label-small" v-if="post.postAuthors">
              {{ post.postAuthors.length > 1 ? this.$t('authors') : this.$t('author') }}
            </label>
            <div v-for="author of post.postAuthors" :key="author">
              {{ 
                (author.name ? author.name : author.email) + 
                (author.email ? (" (" + author.email + ")") : '')
              }}
            </div>
            <label class="post-info-label-small">
              {{ post.lastUpdatedTimestamp ? this.$t('updated') : this.$t('published') }}
            </label>
            <div v-if="post.lastUpdatedTimestamp || post.publishTimestamp">
              {{ post.lastUpdatedTimestamp ? post.lastUpdatedTimestamp : post.publishTimestamp }}
            </div>
          </span>
        </div>
        <!-- post contributors -->
        <div class="post-item-row" v-if="(this.showPostDetails && post.postContributors)">
          <span class="post-field-wrapper">
            <label class="post-info-label-small">{{ this.$t('contributors') }}</label>
            <div v-for="contributor of post.postContributors" :key="contributor">
              {{ 
                (contributor.name ? contributor.name : contributor.email) + 
                (contributor.name ? (" (" + contributor.email + ")") : '')
              }}
            </div>
          </span>
        </div>
        <!-- post rights (hidden w/no details) -->
        <div class="post-item-row" v-if="(this.showPostDetails && post.postRights)">
          <span v-if="post.postRights" 
            class="post-field-wrapper">
            <div>{{ this.trimToLength(post.postRights, 128) }}</div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostEnclosure from './item/PostEnclosure.vue';
import PostMedia from './item/PostMedia.vue';
import PostITunes from './item/PostITunes.vue';

export default {
  name: "PostItem",
  components: { 
    PostEnclosure,
    PostMedia, 
    PostITunes
  },
  props: [ "post", "idx", "baseUrl", "isSelected", "disabled", "theme" ],
  emits: [
    "updatePostReadStatus",
    "updatePostPubStatus",
    "updateFilter",
    "setActive",
    "openPostUrl",
    "playing",
    "audioPlay",
    "goToNextPost",
    "goToPreviousPost",
  ],
  data() {
    return {
      showPostDetails: false,
      showPostCategories: false,
    };
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
    updateFeedFilter(filterName, filterValue) {
      this.$emit("updateFilter", { name: filterName, value: filterValue });
    },
    showFullPost() {
      this.showPostDetails = true;
    },
    togglePostDetails() {
      this.showPostDetails = !this.showPostDetails;
    },
    togglePostCategories() {
      this.showPostCategories = !this.showPostCategories;
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
            originator: successSignal
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
.post-item-body {
  margin-top: 0rem;
  text-align: initial;
}

.post-item-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
  overflow: auto;
  flex-wrap: wrap;
}

.post-item-row button {
  background: unset;
  border: unset;
}

.post-item-media {
  display: block;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
}

/** has references */
.post-published {
  color: v-bind('theme.subduedmessage');
}

/** has references */
.post-item-header {
  border: 1px solid transparent;
  padding: .44rem;
  padding-right: .44rem;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: v-bind('theme.sectionbg');
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: row;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  align-items: flex-start;
  gap: .44rem;
  flex-wrap: wrap;
}

.post-item-header:hover, .post-item-header:focus-visible {
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
}

.post-admin-buttons {
  display: flex;
  gap: .44rem;
  flex-wrap: wrap;
}

.post-admin-button {
  border: 1px solid v-bind('theme.buttonborder');
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding-top: .125rem;
}

.post-admin-button:disabled {
  cursor: auto;
}

.post-admin-button:hover, .post-admin-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.post-field-wrapper {
  cursor: auto;
  overflow-wrap: anywhere;
  padding: .75rem;
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

.post-thumbnail {
  max-width: 140px;
  max-height: 140px;
  display: inline-block; 
  background-size: cover; 
  background-position: center center;
  background-repeat: no-repeat;
  align-self: stretch;
  cursor: pointer;
}

.post-wrapper {
  border: 1px solid transparent;
  margin-bottom: .75rem;
  display: block;
  padding: .44rem;
  margin-left: .75rem;
  margin-right: .75rem;
  border-radius: 4px;
  background-color: v-bind('theme.sectionbrighterhighlight');
}

.post-wrapper:hover, .post-wrapper:focus-visible {
  color: v-bind('theme.normalmessage');
  border: 1px solid v-bind('theme.fieldborderhighlight') !important;
}

/** has references */
.post-wrapper-selected, .post-wrapper-selected:hover, .post-wrapper-selected:focus-visible {
  color: v-bind('theme.normalmessage');
  border: 1px solid v-bind('theme.fieldborderhighlight') !important;
}

.post-item-wrapper {
  width: 100%;
  border: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 4px;
  overflow: auto;
}

/** has references */
.post-read {
  color: v-bind('theme.sectionsubdued') !important;
}

/** has references */
.subdued-link {
  text-decoration: none;
  color: v-bind('theme.sectionsubdued');
  cursor: pointer;
}

/** has references */
.link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
  border: 1px solid transparent;
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

.br-pill:hover, .br-pill:focus-visible {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.post-item-header-pills {
  display: flex;
  flex-direction: row-reverse;
}

.post-info-label-small {
  max-width: fit-content;
  color: v-bind('theme.subduedmessage');
}

.star-colored {
  color: v-bind('theme.starcolor');
}
</style>
