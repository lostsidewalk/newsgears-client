<template>
  <tr
    class="clickable"
    :class="{ 'post-read' : post.isRead }"
    @click.stop="$emit('openPost', post.id)"
  >
    <td>{{ isHtmlTitle ? '<HTML not shown>' : postTitle }}</td>
    <td>{{ isHtmlDesc ? '<HTML not shown>' : postDesc }}</td>
    <td>{{ importerDesc }}</td>
    <td>{{ formatTimestamp(postTimestamp) }}</td>
    <!-- mark as read/unread button -->
    <td> 
      <v-btn
        :size="buttonSize"
        variant="text"
        :title="post.isRead ? $t('markPostAsUnread') : $t('markPostAsRead')"
        :aria-label="$t('markPostAsUnread')"
        :icon="post.isRead ? 'fa-check-square-o' : 'fa-eye'"
        @click.stop="togglePostReadStatus"
      />
    </td>
    <!-- toggle read-later button -->
    <td>
      <v-btn
        :size="buttonSize"
        variant="text"
        :title="
          post.isReadLater
            ? $t('unmarkPostAsReadLater')
            : $t('markPostAsReadLater')
        "
        :aria-label="$t('markPostAsReadLater')"
        :icon="post.isReadLater ? 'fa-bullseye' : 'fa-circle-o'"
        @click.stop="togglePostReadLaterStatus"
      />
    </td>
    <!-- mark as starred/unstarred button -->
    <td>
      <v-btn
        v-if="!post.isPublished"
        :size="buttonSize"
        variant="text"
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
        variant="text"
        :title="$t('unstarThisPost')"
        :aria-label="$t('unstarThisPost')"
        icon="fa-star"
        @click.stop="unstagePost"
      />
    </td>
    <td>
      <v-btn
        :size="buttonSize"
        variant="text"
        :title="$t('openOriginalArticle')"
        :aria-label="$t('openOriginalArticle')"
        icon="fa-link"
        @click.stop="$emit('openPostUrl')"
      />
    </td>
  </tr>
</template>

<script>
import { useTimestamp } from '@/composable/useTimestamp';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "PostTableRow",
  mixins: [buttonSizeMixin],
  props: {
    post: { type: Object, required: true },
    sharingOptions: { type: Array, default: null },
  },
  emits: [
    "openPost",
    "openPostUrl",
    "updatePostReadStatus",
    "updatePostPubStatus",
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
    }, 
    postTitle: function () {
      return this.post.postTitle ? this.post.postTitle.value : null;
    },
    postDesc: function () {
      return this.post.postDesc ? this.post.postDesc.value : null;
    },
    importerDesc: function () {
      return this.post.importerDesc;
    },
    postTimestamp: function () {
      let lastUpdated = this.post.lastUpdatedTimestamp;
      if (lastUpdated) {
        return lastUpdated;
      }
      return this.post.publishTimestamp;
    },
    isPublished: function () {
      return this.post.isPublished;
    },
    isRead: function () {
      return this.post.isRead;
    },
    isReadLater: function () {
      return this.post.isReadLater;
    },
   },
  methods: {
    stagePost() {
      console.log("post: publishing post id=" + this.post.id);
      this.updatePostPubStatus(this.post.queueIdent, 'PUB_PENDING', 'stagePost');
    },
    unstagePost() {
      console.log("post: unstaging post id=" + this.post.id);
      this.updatePostPubStatus(this.post.queueIdent, 'DEPUB_PENDING', "unstagePost");
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
    updatePostPubStatus(queueIdent, newStatus, successSignal) {
      this.$emit('updatePostPubStatus', { 
            id: this.post.id, 
            newStatus: newStatus, 
            queueIdent: queueIdent,
            originator: successSignal
          });
    },
  }
};
</script>
