<template>
  <tr
    class="clickable"
    :class="{ 'post-read' : post.isRead }"
    @click.stop="$emit('openPost', post.id)"
  >
    <td>{{ isHtmlTitle ? '<HTML not shown>' : postTitle }}</td>
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
  },
  emits: [
    "openPost",
    "openPostUrl",
    "updatePostReadStatus",
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
    isRead: function () {
      return this.post.isRead;
    },
    isReadLater: function () {
      return this.post.isReadLater;
    },
   },
  methods: {
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
  }
};
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
