<template>
  <div :class="{ 'post-wrapper-compact' : compact, 'post-wrapper' : !compact, 'post-wrapper-selected' : isSelected }" v-auto-animate>
    <div :class="{ 'post-item-wrapper-compact': compact, 'post-item-wrapper': !compact }">
      <!-- post item (everything after the dark grey box): title, description, image, url, comment -->
      <div class="post-item-body" :class="(post.isRead ? ' post-read' : '')">
        <!-- post title -->
        <div class="post-item-row post-item-title" @click.stop="togglePostDetails" @keypress.enter.prevent="togglePostDetails()">
          <button class="toggle-post-details-button">
            <img v-if="post.postImgSrc" 
              :src="post.postImgSrc"
              :class="{ 'post-thumbnail' : !compact, 'post-thumbnail-compact' : compact }" 
              :disabled="disabled" 
              :alt="this.$t('postThumbnailImage')" 
              height="140" /> 
          </button>
          <div v-if="isHtmlContent(post.postTitle)" 
            @click.stop="togglePostDetails" @keypress.enter.prevent="togglePostDetails()"
            class="post-field-wrapper post-html-frame"
            v-html="post.postTitle.value" frameborder="0" />
          <div v-else 
            class="post-field-wrapper post-text-frame"
            @click.stop="togglePostDetails" @keypress.enter.prevent="togglePostDetails()">
            {{ post.postTitle.value }}
          </div>
        </div>

        <!-- post header -->
        <div class="post-item-header" v-if="!compact || (compact && post.showPostDetails)">
          <!-- post header buttons -->
          <span class="post-admin-buttons">
            <!-- TODO: extract post-item-button component -->
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
            <!-- toggle post subscription -->
            <button v-if="enableFilterBySubscription" 
              class="post-admin-button accessible-button"
              @click.stop="updatePostFeedFilter('subscriptionId', this.post.queryId)"
              :disabled="disabled"
              :title="this.post.importerDesc"
              :aria-label="this.post.importerDesc">
              <img :src="this.post.sourceImgUrl" />
            </button>
            <button v-if="this.post.postCategories && this.post.postCategories.length > 0"
              class="post-admin-button accessible-button"
              @click.stop="togglePostCategories"
              :disabled="disabled"
              :title="this.$t('showPostCategories')"
              :aria-label="this.$t('showPostCategories')">
              <span class="fa fa-list"></span>
            </button>
            <button v-for="postCategory in post.postCategories" :key="postCategory"
              v-show="this.showPostCategories"
              class="post-admin-button accessible-button"
              @click.stop="updatePostFeedFilter('category', postCategory)"
              :title="this.$t('addCategoryToFilter', { postCategory: postCategory })"
              :aria-label="this.$t('addCategoryToFilter', { postCategory: postCategory })">
              {{ postCategory }}
            </button>
            <button class="post-admin-button accessible-button"
              @click.stop="togglePostSharing"
              :disabled="disabled"
              :title="this.$t('showPostSharing')"
              :aria-label="this.$t('showPostSharing')">
              <span class="fa fa-share-alt"></span>
            </button>
            <button v-for="sharingOption in this.sharingOptions" :key="sharingOption"
              v-show="this.showPostSharing"
              class="post-admin-button accessible-button"
              @click.stop="share(sharingOption)"
              :title="this.$t('shareWith_' + sharingOption.name)"
              :aria-label="this.$t('shareWith_' + sharingOption.name + '_ariaLabel')">
              <i class="fa" :class="'fa-' + sharingOption.icon" />
            </button>
          </span>
        </div>

        <!-- post description (hidden w/no detials) -->
        <div class="post-item-row" v-if="(post.showPostDetails && post.postDesc)">
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
        <div class="post-item-row" v-show="post.showPostDetails" v-if="(post.postContents && post.postContents.length > 0)">
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
        <div class="post-item-media" v-show="post.showPostDetails" v-if="(post.postMedia)">
          <PostMedia 
            ref="postMedia"
            :theme="theme" 
            class="post-field-wrapper"
            :media="post.postMedia" 
            @playing="onMediaPlaying" 
            @audioPlay="onAudioPlay" />
        </div>
        <!-- post itunes -->
        <div class="post-item-row" v-show="post.showPostDetails" v-if="(post.postITunes)">
          <PostITunes 
            :theme="theme" 
            class="post-field-wrapper" 
            :iTunes="post.postITunes" 
            @playFirstEnclosure="onPlayFirstEnclosure" />
        </div>
        <!-- post enclosures -->
        <div class="post-item-row" v-show="post.showPostDetails" v-if="(post.enclosures)">
          <PostEnclosure v-for="(enclosure,idx) in post.enclosures" :key="enclosure"
            :ref="'postEnclosure_' + idx"
            :theme="theme"
            :enclosure="enclosure" 
            @playing="onEnclosurePlaying(idx)" 
            @audioPlay="onAudioPlay" />
        </div>
        <!-- post urls, i.e., 'other links' (hidden w/no details) -->
        <div class="post-item-row" v-show="post.showPostDetails" v-if="(post.postUrls && post.postUrls.length > 0)">
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
        <div class="post-item-row" v-show="post.showPostDetails" v-if="(post.postComment)">
          <span class="post-field-wrapper">
            <label class="post-info-label-small">{{ this.$t('postComments') }}</label>
            <div>{{ this.trimToLength(post.postComment, 128) }}</div>
          </span>
        </div>
        <!-- post authors -->
        <div class="post-item-row" v-show="post.showPostDetails" v-if="(post.postAuthors || post.publishTimestamp || post.lastUpdatedTimestamp)">
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
        <div class="post-item-row" v-show="post.showPostDetails" v-if="post.postContributors">
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
        <div class="post-item-row" v-show="post.showPostDetails" v-if="post.postRights">
          <span class="post-field-wrapper">
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

const sharingOptions = [
  {
    name: 'twitter',
    icon: 'twitter',
    url: 'https://twitter.com/intent/tweet?text={TITLE}&url={URL}',
  },
  {
    name: 'facebook',
    icon: 'facebook',
    url: 'http://www.facebook.com/share.php?u={URL}&title={TITLE}',
  },
  {
    name: 'telegram',
    icon: 'telegram',
    url: 'https://telegram.me/share/url?url={URL}&t={TITLE}', 
  },
  {
    name: 'linkedIn',
    icon: 'linkedin',
    url: 'http://www.linkedin.com/shareArticle?mini=true&url={URL}&title={TITLE}&source={SOURCE}', 
  },
  {
    name: 'blogger',
    icon: 'rss', // kind of generic 
    url: 'https://www.blogger.com/blog-this.g?n={TITLE}&t={CONTENT}&u={URL}', 
  },
  {
    name: 'buffer',
    icon: 'share', // generic 
    url: 'https://publish.buffer.com/compose?url={URL}&text={TITLE}', 
  },
  {
    name: 'hootsuite',
    icon: 'share', // generic 
    url: 'http://hootsuite.com/twitter/bookmark-tool-v2?address={URL}&title={TITLE}', 
  },
];

export default {
  name: "PostItem",
  components: { 
    PostEnclosure,
    PostMedia, 
    PostITunes
  },
  props: [ "post", "idx", "baseUrl", "isSelected", "enableFilterBySubscription", "disabled", "theme", "compact" ],
  emits: [
    "updatePostReadStatus",
    "updatePostPubStatus",
    "updatePostFeedFilter",
    "showPostDetails", 
    "togglePostDetails", 
    "setActive",
    "openPostUrl",
    "playing",
    "audioPlay",
    "goToNextPost",
    "goToPreviousPost",
    "enableFilterBySubscription",
  ],
  data() {
    return {
      showPostCategories: false,
      showPostSharing: false,
      //
      sharingOptions: sharingOptions,
    };
  },
  methods: {
    share(sharingOption) {
      let title = encodeURIComponent(this.post.postTitle.value);
      let link = encodeURIComponent(this.post.postUrl);
      let source = encodeURIComponent(this.post.importerDesc);
      let content = encodeURIComponent(this.post.postDesc ? this.post.postDesc.value : '');
      let url = this.replaceArray(sharingOption.url, 
        ["{URL}", "{TITLE}", "{SOURCE}", "{CONTENT}"], 
        [ link, title, source, content ]
      );
      window.open(url, '_blank');
    },
    replaceArray(str, find, replace) {
      let replaceString = str;
      let regex;
      for (let i = 0; i < find.length; i++) {
          regex = new RegExp(find[i], "g");
          replaceString = replaceString.replace(regex, replace[i]);
      }
      return replaceString;
    },
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
    updatePostFeedFilter(filterName, filterValue) {
      this.$emit("updatePostFeedFilter", { name: filterName, value: filterValue });
    },
    showFullPost() {
      this.$emit("showPostDetails");
    },
    togglePostDetails() {
      this.$emit("togglePostDetails");
    },
    togglePostCategories() {
      this.showPostCategories = !this.showPostCategories;
    },
    togglePostSharing() {
      this.showPostSharing = !this.showPostSharing;
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
  background-color: v-bind('theme.sectionhighlight');
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

.post-item-title {
  user-select: none;
  cursor: pointer;
  flex-wrap: nowrap;
}

.post-item-title:hover, .post-item-title:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.post-item-title > div {
  cursor: pointer;
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
  background-color: v-bind('theme.sectionhighlight');
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
  display: flex;
  border: 1px solid v-bind('theme.buttonborder');
  cursor: pointer;
  align-items: center;
  justify-content: center;
  align-content: center;
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

.post-admin-button img {
  height: auto;
  max-height: 2rem;
  width: 2rem;
}

.post-field-wrapper {
  cursor: auto;
  overflow-wrap: anywhere;
  padding: .75rem;
}

.post-html-frame > * {
  object-fit: scale-down;
  background-color: currentColor;
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
  cursor: pointer;
  object-fit: scale-down;
  background-color: currentColor;
}

.post-thumbnail-compact {
  max-width: 48px;
  max-height: 48px;
  cursor: pointer;
  object-fit: scale-down;
  background-color: currentColor;
}

.post-wrapper {
  display: block;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: .44rem;
  margin-bottom: .75rem;
  margin-left: .75rem;
  margin-right: .75rem;
}

.post-wrapper-compact {

}

.post-wrapper:focus-visible {
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

.post-item-wrapper-compact {
  width: 100%;
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
  user-select: none;
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
  flex-wrap: wrap;
  gap: .44rem;
}

.post-info-label-small {
  max-width: fit-content;
  color: v-bind('theme.subduedmessage');
}

.star-colored {
  color: v-bind('theme.starcolor');
}

.toggle-post-details-button {
  display: flex;
  padding: 0;
}
</style>
