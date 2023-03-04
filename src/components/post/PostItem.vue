<template>
  <div class="post-wrapper" :class="this.isSelected ? 'post-wrapper-selected' : ''">
    <div class="post-item-wrapper">
      <!-- post header -->
      <div class="post-item-header">
        <!-- post header buttons -->
        <span class="post-admin-buttons">
          <!-- show details button -->
          <button 
            ref="postHandle"
            class="post-admin-button"
            @click.stop="togglePostDetails"
            :disabled="disabled"
            title="Show post details">
            <span :class="this.showPostDetails ? 'fa fa-minus' : 'fa fa-plus'"></span>
          </button>
          <!-- toggle read status button -->
          <button
            class="post-admin-button"
            @click.stop="togglePostReadStatus"
            :disabled="disabled"
            :title="post.isRead ? 'Mark as unread' : 'Mark as read'">
            <span class="fa fa-eye-slash"></span>
          </button>
          <!-- toggle read-later status button -->
          <button
            class="post-admin-button"
            @click.stop="togglePostReadLaterStatus"
            :disabled="disabled"
            :title="post.isReadLater ? 'Unmark as read-later' : 'Mark as read-later'">
            <span :class="'fa ' + (post.isReadLater ? 'fa-bullseye' : 'fa-circle-o')"></span>
          </button>
          <!-- star button -->
          <button v-if="!post.isPublished"
            class="post-admin-button"
            @click.stop="stagePost"
            :disabled="disabled"
            title="Star this post">
            <span class="fa fa-star-o"></span>
          </button>
          <!-- un-star button -->
          <button v-if="post.isPublished"
            class="post-admin-button star-colored"
            @click.stop="unstagePost"
            :disabled="disabled"
            title="Un-star this post">
            <span class="fa fa-star"></span>
          </button>
          <!-- link button -->
          <button
            class="post-admin-button"
            @click.stop="this.$emit('openPostUrl')"
            :disabled="disabled"
            title="Open original article">
            <span class="fa fa-link"></span>
          </button>
        </span>
        <!-- post header pills -->
        <span class="post-item-header-pills pill-container">
          <!-- importer desc (query) -->
          <button
            class="br-pill"
            @click.stop="updateFeedFilter('subscription', post.importerDesc)"
            :title="'Add this subscription (' + post.importerDesc + ') to the filter'">
            {{ post.importerDesc }}
          </button> 
          <!-- post categories -->
          <button v-for="postCategory in post.postCategories" :key="postCategory"
            class="br-pill"
            @click.stop="updateFeedFilter('category', postCategory)"
            :title="'Add this category (' + postCategory + ') to the filter'">
            {{  postCategory }}
          </button>
        </span>
      </div>
      <!-- post item (everything after the dark grey box): title, description, image, url, comment -->
      <div class="post-item-body" :class="(post.isRead ? ' post-read' : '')">
        <!-- post title -->
        <div class="post-item-row">
          <a @click.stop="togglePostDetails" @keypress.enter.prevent="togglePostDetails()" tabindex="0">
            <img v-if="post.postImgSrc" 
              :src="post.postImgSrc"
              class="post-thumbnail" 
              :disabled="disabled" /> 
          </a>
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
            <label class="post-info-label-small">DESCRIPTION ({{ post.postDesc.type }})</label>
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
              {{  c.value }}
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
        <div class="post-item-row" v-if="(this.showPostDetails && post.enclosures && !post.postITunes)">
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
            <label class="post-info-label-small">LINKS</label>
            <div v-for="postUrl of post.postUrls" :key="postUrl" class="post-other-link">
              <a :class="post.isRead ? 'subdued-link' : 'link'" 
                :href="postUrl.href" 
                :target="'window_' + (Math.random() + 1).toString(36).substring(7)"
                :disabled="disabled">
                <i class="fa fa-link fa-1x"></i>
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
            <label class="post-info-label-small">POST COMMENT</label>
            <div>{{ this.trimToLength(post.postComment, 128) }}</div>
          </span>
        </div>
        <!-- post authors -->
        <div class="post-item-row" v-if="(this.showPostDetails && (post.postAuthors || post.publishTimestamp || post.lastUpdatedTimestamp))">
          <span class="post-field-wrapper">
            <label class="post-info-label-small" v-if="post.postAuthors">
              {{ post.postAuthors.length > 1 ? 'AUTHORS' : 'AUTHOR' }}
            </label>
            <div v-for="author of post.postAuthors" :key="author">
              {{ 
                (author.name ? author.name : author.email) + 
                (author.email ? (" (" + author.email + ")") : '')
              }}
            </div>
            <label class="post-info-label-small">
              {{ post.lastUpdatedTimestamp ? 'UPDATED' : 'PUBLISHED' }}
            </label>
            <div v-if="post.lastUpdatedTimestamp || post.publishTimestamp">
              {{ post.lastUpdatedTimestamp ? post.lastUpdatedTimestamp : post.publishTimestamp }}
            </div>
          </span>
        </div>
        <!-- post contributors -->
        <div class="post-item-row" v-if="(this.showPostDetails && post.postContributors)">
          <span class="post-field-wrapper">
            <label class="post-info-label-small">CONTRIBUTORS</label>
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
  ],
  data() {
    return {
      showPostDetails: true,
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
      // if (this.showPostDetails) {
      //   if (!this.post.postStatus) {
      //     this.updatePostReadStatus('READ', "togglePostDetails");
      //   }
      // }
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
      if (this.post.postStatus !== 'READ') {
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
      if (this.post.postStatus !== 'READ_LATER') {
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
  justify-content: space-between;
  padding: .31rem;
  text-align: right;
  padding-right: .31rem;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background-color: v-bind('theme.sectionbg');
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  align-items: flex-start;
  column-gap: .31rem;
}

.post-item-header:hover, .post-item-header:focus {
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
}

.post-admin-buttons {
  display: flex;
  column-gap: .31rem;
}

.post-admin-button {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  text-align: center;
  border-radius: 3px;
  background-color: transparent;
  color: v-bind('theme.sectionsubdued');
  padding-top: .125rem;
}

.post-admin-button:disabled {
  cursor: auto;
}

.post-admin-button:hover, .post-admin-button:focus {
  border: 1px solid v-bind('theme.buttonborder');
  color: v-bind('theme.buttonfg');
  background-color: v-bind('theme.buttonhighlight');
}

/** post rights */

.post-rights-area {
  text-align: left;
  margin-left: .44rem;
  margin-top: .44rem;
  margin-bottom: .31rem;
  margin-right: .75rem;
}

.post-rights-area > label {
  font-size: smaller;
  padding-bottom: .125rem;
}

/** post comment */

.post-comment-area {
  text-align: left;
  margin-left: .44rem;
  margin-top: .44rem;
  margin-bottom: .31rem;
  margin-right: .75rem;
}

.post-comment-area > label {
  font-size: smaller;
  padding-bottom: .125rem;
}

.post-field-wrapper {
  cursor: auto;
  overflow-wrap: anywhere;
  padding: .75rem;
}

.post-title-area {
  text-align: left;
  margin-left: .44rem;
  margin-top: .44rem;
  margin-bottom: .31rem;
  margin-right: .75rem;
}

.post-title-area > label {
  font-size: smaller;
  padding-bottom: .125rem;
}

/** post desc */

.post-desc-area {
  text-align: left;
  margin-left: .44rem;
  margin-top: .44rem;
  margin-bottom: .31rem;
  margin-right: .75rem;
}

.post-desc-area > label {
  font-size: smaller;
  padding-bottom: .125rem;
}

.post-html-frame {
  display: block;
  overflow: auto;
  font-family: serif;
  font-size: larger;
}

.post-text-frame {
  display: block;
  overflow: auto;
  font-family: serif;
  font-size: larger;
}

/** post url */

.post-url-anchor {
  color: v-bind('theme.normalmessage');
}

.post-url-area {
  text-align: left;
  margin-left: .44rem;
  margin-top: .44rem;
  margin-bottom: .31rem;
  margin-right: .75rem;
}

.post-url-area > label {
  font-size: smaller;
  padding-bottom: .125rem;
}

.post-img-url-area {
  text-align: left;
  margin-left: .44rem;
  margin-top: .44rem;
  margin-bottom: .31rem;
  margin-right: .75rem;
}

.post-img-url-area > label {
  font-size: smaller;
  padding-bottom: .125rem;
}

.post-thumbnail {
  max-width: 70px;
  max-height: 70px;
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
  border-radius: 5px;
  background-color: v-bind('theme.sectionbrighterhighlight');
}

.post-wrapper:hover, .post-wrapper:focus {
  color: v-bind('theme.normalmessage');
  border: 1px solid v-bind('theme.fieldborderhighlight') !important;
}

.post-wrapper:focus {
    outline: none;
}

/** has references */
.post-wrapper-selected, .post-wrapper-selected:hover, .post-wrapper-selected:focus {
  color: v-bind('theme.normalmessage');
  border: 1px solid lightblue !important;
}

.post-item-wrapper {
  width: 100%;
  border: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 3px;
  overflow: auto;
}

/** has references */
.post-read {
  color: v-bind('theme.sectionsubdued') !important;
}

.subdued-link {
  text-decoration: none;
  color: v-bind('theme.sectionsubdued');
  cursor: pointer;
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

.post-item-header-pills {
  display: flex;
  font-size: smaller;
  flex-direction: row-reverse;
}

.post-info-label-small {
  max-width: fit-content;
  font-size: smaller;
  color: v-bind('theme.subduedmessage');
}

.star-colored {
  color: v-bind('theme.starcolor');
}
</style>
