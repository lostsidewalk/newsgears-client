<template>
  <div class="post-wrapper" :class="this.isSelected ? 'post-wrapper-selected' : ''">
    <ConfirmationDialog ref="deleteConfirmation" 
      :inTransit="inTransit"
      :theme="theme"
      @confirm="performDelete" 
      prompt="Please confirm that you want to delete this post. This action is irreversible." />
    <div class="post-item-wrapper">
      <!-- post header -->
      <div class="post-item-header" @click.self="togglePostDetailsWithActive(post.id)">
        <!-- post header buttons -->
        <span class="post-admin-buttons">
          <!-- show details button -->
          <button 
              class="post-admin-button"
              @click.stop="togglePostDetails"
              :disabled="inTransit"
              title="Show post details">
              <span :class="this.showPostDetails ? 'fa fa-minus' : 'fa fa-plus'"></span>
          </button>
          <!-- toggle read status button -->
          <button
            class="post-admin-button"
            @click.stop="togglePostReadStatus"
            :disabled="inTransit"
            :title="post.isRead ? 'Mark as unread' : 'Mark as read'">
            <span class="fa fa-eye-slash"></span>
          </button>
          <!-- toggle read-later status button -->
          <button
            class="post-admin-button"
            @click.stop="togglePostReadLaterStatus"
            :disabled="inTransit"
            :title="post.isReadLater ? 'Unmark as read-later' : 'Mark as read-later'">
            <span class="fa fa-bullseye"></span>
          </button>
          <!-- star button -->
          <button v-if="!post.isPublished"
              class="post-admin-button"
              @click.stop="stagePost"
              :disabled="inTransit"
              title="Star this post">
              <span class="fa fa-star-o"></span>
          </button>
          <!-- un-star button -->
          <button v-if="post.isPublished"
            class="post-admin-button star-colored"
            @click.stop="unstagePost"
            :disabled="inTransit"
            title="Un-star this post">
            <span class="fa fa-star"></span>
          </button>
          <!-- delete button -->
          <button
            class="post-admin-button"
            @click.stop="deletePost"
            :disabled="inTransit || post.isPublished"
            title="Delete this post">
            <span class="fa fa-trash"></span>
          </button>
        </span>
        <!-- post header pills -->
        <span class="post-item-header-pills pill-container" @click.self="togglePostDetails">
          <!-- importer desc (query) -->
          <span 
            class="br-pill"
            @click.stop="updateFeedFilter('subscription', post.importerDesc)"
            :title="'Add this subscription (' + post.importerDesc + ') to the filter'">
            {{ post.importerDesc }}
          </span> 
          <!-- post categories -->
          <span v-for="postCategory in post.postCategories" :key="postCategory"
            class="br-pill"
            @click.stop="updateFeedFilter('category', postCategory)"
            :title="'Add this category (' + postCategory + ') to the filter'">
            {{  postCategory }}
          </span>
          <!-- published timestamp -->
          <span v-if="post.publishTimestamp"
            class="br-pill"
            @click.stop="false">
            {{ post.publishTimestamp }}
          </span>
        </span>
      </div>
      <!-- post item (everything after the dark grey box): title, description, image, url, comment -->
      <div class="post-item-body" :class="(post.isRead ? ' post-read' : '')">
        <!-- post title -->
        <div class="post-item-row">
          <img v-if="post.postImgSrc" 
            :src="'data:image/png;base64,' + post.postImgSrc" 
            @click.stop="togglePostDetails"
            class="post-thumbnail" 
            :disabled="inTransit"
          /> 
          <div v-if="isHtmlContent(this.postTitle)" 
            class="post-field-wrapper"
            :disabled="inTransit"
            v-html="this.postTitle.value" frameborder="0" />
          <div v-else 
            class="post-field-wrapper"
            :disabled="inTransit">
            {{ this.postTitle.value }}
          </div>
        </div>
        <!-- post description (hidden w/no detials) -->
        <div class="post-item-row" v-if="(this.showPostDetails && this.postDesc)">
          <span class="post-field-wrapper">
            <label class="post-info-label-small">DESCRIPTION ({{ this.postDesc.type }})</label>
            <div v-if="isHtmlContent(this.postDesc)"
              :disabled="inTransit"
              class='post-field-wrapper post-html-frame' 
              v-html="this.postDesc.value" frameborder="0" />
            <div v-else
              :disabled="inTransit"
              class='post-field-wrapper post-html-frame'>
              {{ this.postDesc.value }}
            </div>
          </span>
        </div>
        <!-- post contents -->
        <div class="post-item-row" v-if="(this.showPostDetails && this.postContents && this.postContents.length > 0)">
          <div v-for="c of this.postContents" :key="c">
            <div v-if="isHtmlContent(c)"
              :disabled="inTransit"
              class='post-field-wrapper post-html-frame' 
              v-html="c.value" />
            <div v-else
              :disabled="inTransit"
              class='post-field-wrapper post-html-frame'>
              {{  c.value }}
            </div>
          </div>
        </div>
        <!-- last updated timestamp (hidden w/no details )-->
        <div class="post-item-row" v-if="this.showPostDetails && post.lastUpdatedTimestamp">
          <span class="post-field-wrapper"
            :disabled="inTransit">
            <label class="post-info-label-small">LAST UPDATED</label>
            <div>{{ post.lastUpdatedTimestamp }}</div>
          </span>
        </div>
        <!-- post image url (hidden w/no details) -->
        <!-- <div class="post-item-row" v-if="this.showPostDetails && this.postImgUrl">
          <span class="post-field-wrapper" 
            :disabled="inTransit">
            <label class="post-info-label-small">THUMBNAIL URL</label>
            <div>
              <a :class="post.isRead ? 'subdued-link' : 'link'" 
                :href="this.postImgUrl" 
                :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
                <i class="fa fa-link fa-1x"></i>
              </a>
              {{ this.postImgUrl }}
            </div>
          </span>
        </div> -->
        <!-- post url (hidden w/no details) -->
        <div class="post-item-row" v-if="this.showPostDetails">
          <span class="post-field-wrapper"
            :disabled="inTransit">
            <label class="post-info-label-small">POST URL</label>
            <div>
              <a :class="post.isRead ? 'subdued-link' : 'link'" 
                :href="this.postUrl" 
                :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
                <i class="fa fa-link fa-1x"></i>
              </a>
              {{ this.postUrl }}
            </div>
          </span>
        </div>
        <!-- post urls, i.e., 'other links' (hidden w/no details) -->
        <div class="post-item-row" v-if="(this.showPostDetails && this.postUrls && this.postUrls.length > 0)">
          <span class="post-field-wrapper"
            :disabled="inTransit">
            <label class="post-info-label-small">LINKS</label>
            <div v-for="postUrl of this.postUrls" :key="postUrl" class="post-other-link">
              <a :class="post.isRead ? 'subdued-link' : 'link'" 
                :href="postUrl.href" 
                :target="'window_' + (Math.random() + 1).toString(36).substring(7)">
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
        <div class="post-item-row" v-if="(this.showPostDetails && this.postComment)">
          <span v-if="this.postComment" 
            class="post-field-wrapper"
            :disabled="inTransit">
            <label class="post-info-label-small">POST COMMENT</label>
            <div>{{ this.trimToLength(this.postComment, 128) }}</div>
          </span>
        </div>
        <!-- post authors -->
        <div class="post-item-row" v-if="(this.showPostDetails && this.postAuthors)">
          <span class="post-field-wrapper"
            :disabled="inTransit">
            <label class="post-info-label-small">{{ this.postAuthors.length > 1 ? 'AUTHORS' : 'AUTHOR' }}</label>
            <div v-for="author of this.postAuthors" :key="author">
              {{ 
                (author.name ? author.name : author.email) + 
                (author.email ? (" (" + author.email + ")") : '')
              }}
            </div>
          </span>
        </div>
        <!-- post contributors -->
        <div class="post-item-row" v-if="(this.showPostDetails && this.postContributors)">
          <span class="post-field-wrapper"
            :disabled="inTransit">
            <label class="post-info-label-small">CONTRIBUTORS</label>
            <div v-for="contributor of this.postContributors" :key="contributor">
              {{ 
                (contributor.name ? contributor.name : contributor.email) + 
                (contributor.name ? (" (" + contributor.email + ")") : '')
              }}
            </div>
          </span>
        </div>
        <!-- post rights (hidden w/no details) -->
        <div class="post-item-row" v-if="(this.showPostDetails && this.postRights)">
          <span v-if="this.postRights" 
            class="post-field-wrapper"
            :disabled="inTransit">
            <label class="post-info-label-small">POST RIGHTS</label>
            <div>{{ this.trimToLength(this.postRights, 128) }}</div>
          </span>
        </div>
        <!-- post media -->
        <div class="post-item-media" v-if="(this.showPostDetails && this.postMedia)">
          <PostMedia 
            :inTransit="inTransit"
            :theme="theme" 
            class="post-field-wrapper"
            :media="post.postMedia" />
        </div>
        <!-- post itunes -->
        <div class="post-item-row" v-if="(this.showPostDetails && this.postITunes)">
          <PostITunes 
            :inTransit="inTransit"
            :theme="theme" 
            class="post-field-wrapper"
            :iTunes="post.postITunes" />
        </div>
        <!-- post enclosures -->
        <div class="post-item-row" v-if="(this.showPostDetails && this.postEnclosures)">
          <PostEnclosure v-for="enclosure in this.postEnclosures" :key="enclosure"
            :inTransit="inTransit"
            :theme="theme"
            :enclosure="enclosure" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfirmationDialog from '../layout/ConfirmationDialog.vue';
import PostEnclosure from './item/PostEnclosure.vue';
import PostMedia from './item/PostMedia.vue';
import PostITunes from './item/PostITunes.vue';

export default {
  name: "PostItem",
  components: { 
    ConfirmationDialog, 
    PostEnclosure,
    PostMedia, 
    PostITunes
  },
  props: ["post", "idx", "baseUrl", "isSelected", "inTransit", "theme"],
  emits: [
    "deletePost", 
    "updatePostReadStatus",
    "updatePostPubStatus",
    "updateFilter",
    "setActive"
  ],
  data() {
    return {
      showPostDetails: true,
      postComment: null,
      postRights: null,
      postTitle: null,
      postDesc: null,
      postContents: null,
      postUrl: null,
      postUrls: null,
      postImgUrl: null,
      postContributors: null,
      postAuthors: null,
      postEnclosures: null,
      postMedia: null,
      postITunes: null,
    };
  },
  created() {
    this.postComment = this.post.postComment;
    this.postRights = this.post.postRights;
    this.postTitle = this.post.postTitle;
    this.postDesc = this.post.postDesc;
    this.postContents = this.post.postContents;
    this.postUrl = this.post.postUrl;
    this.postUrls = this.post.postUrls;
    this.postImgUrl = this.post.postImgUrl;
    this.postContributors = this.post.contributors;
    this.postAuthors = this.post.authors;
    this.postEnclosures = this.post.enclosures;
    this.postMedia = this.post.postMedia;
    this.postITunes = this.post.postITunes;
  },
  mounted() {
    // console.log("post-item mounted: post=" + JSON.stringify(this.post));
  },
  methods: {
    isHtmlContent(contentObj) {
      return contentObj != null && contentObj.type != null && contentObj.type.toLowerCase().indexOf('html') >= 0;
    },
    updateFeedFilter(filterName, filterValue) {
      this.$emit("updateFilter", { name: filterName, value: filterValue });
    },
    showFullPost() {
      this.showPostDetails = true;
    },
    togglePostDetailsWithActive(postId) {
      this.togglePostDetails();
      this.$emit('setActive', postId)
    },
    togglePostDetails() {
      console.log()
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
    deletePost() {
      this.$refs.deleteConfirmation.show();
    }, 
    performDelete() {
      this.$refs.deleteConfirmation.hide();
      this.$emit('deletePost', { 
            id: this.post.id, 
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
  margin-top: 0px;
  /* margin-left: 5px; */
  /* margin-right: 20px; */
  text-align: initial;
  /* border-top: 1px solid v-bind('theme.sectionbordercolor');
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
  border-left: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor'); */
  /* box-shadow: 1px 1px 1px v-bind('theme.darkshadow'); */
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
  padding: 5px;
  text-align: right;
  padding-right: 5px;
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
  align-items: center;
  column-gap: 5px;
}

.post-item-header:hover {
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
}

.post-admin-buttons {
  display: flex;
  column-gap: 5px;
}

.post-admin-button {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  text-align: center;
  border-radius: 3px;
  background-color: transparent;
  color: v-bind('theme.sectionsubdued');
  padding-top: 3px;
}

.post-admin-button:disabled {
  cursor: auto;
}

.post-admin-button:hover {
  border: 1px solid v-bind('theme.buttonborder');
  color: v-bind('theme.buttonfg');
  background-color: v-bind('theme.buttonhighlight');
}

/** post rights */

.post-rights-area {
  text-align: left;
  margin-left: 7px;
  margin-top: 7px;
  margin-bottom: 5px;
  margin-right: 10px;
}

.post-rights-area > label {
  font-size: small;
  padding-bottom: 3px;
}

/** post comment */

.post-comment-area {
  text-align: left;
  margin-left: 7px;
  margin-top: 7px;
  margin-bottom: 5px;
  margin-right: 10px;
}

.post-comment-area > label {
  font-size: small;
  padding-bottom: 3px;
}

.post-field-wrapper {
  cursor: auto;
  overflow-wrap: anywhere;
  padding: 12px;
}

.post-title-area {
  text-align: left;
  margin-left: 7px;
  margin-top: 7px;
  margin-bottom: 5px;
  margin-right: 10px;
}

.post-title-area > label {
  font-size: small;
  padding-bottom: 3px;
}

/** post desc */

.post-desc-area {
  text-align: left;
  margin-left: 7px;
  margin-top: 7px;
  margin-bottom: 5px;
  margin-right: 10px;
}

.post-desc-area > label {
  font-size: small;
  padding-bottom: 3px;
}

.post-html-frame {
  display: block;
  overflow: auto;
}

/** post url */

.post-url-anchor {
  color: v-bind('theme.normalmessage');
}

.post-url-area {
  text-align: left;
  margin-left: 7px;
  margin-top: 7px;
  margin-bottom: 5px;
  margin-right: 10px;
}

.post-url-area > label {
  font-size: small;
  padding-bottom: 3px;
}

.post-img-url-area {
  text-align: left;
  margin-left: 7px;
  margin-top: 7px;
  margin-bottom: 5px;
  margin-right: 10px;
}

.post-img-url-area > label {
  font-size: small;
  padding-bottom: 3px;
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
  margin-bottom: 10px;
  display: block;
  padding: 7px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 5px;
  background-color: v-bind('theme.sectionbrighterhighlight');
}

/** has references */
.post-wrapper:hover, .post-wrapper-selected {
  color: v-bind('theme.normalmessage');
  border: 1px solid v-bind('theme.fieldborderhighlight') !important;
}

.post-wrapper:focus {
    outline:none;
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
}

.link:hover {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-flow: wrap;
  gap: 5px;
  overflow-x: auto;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 3px;
  color: v-bind('theme.buttonfg');
  padding: 5px;
  user-select: none;
}

.br-pill:hover {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.post-item-header-pills {
  display: flex;
  font-size: small;
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
