<template>
  <div class="d-flex flex-row flex-wrap">
    <v-checkbox 
      density="compact"
      :title="$t('toggleUnread')"
      :model-value="showUnread"
      :label="$t('unread')"
      :messages="$t('unreadDetails')"
      @click="$emit('toggleUnreadPosts')"
    />
    <v-checkbox 
      density="compact"
      :title="$t('toggleRead')"
      :model-value="showRead"
      :label="$t('read')"
      :messages="$t('readDetails')"
      @click="$emit('toggleReadPosts')"
    />
    <v-checkbox
      density="compact"
      :title="$t('toggleReadLater')"
      :model-value="showReadLater"
      :label="$t('readLater')"
      :messages="$t('readLaterDetails')"
      @click="$emit('toggleReadLaterPosts')"
    />
  </div>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  mixins: [buttonSizeMixin],
  props: {
    showUnread: { type: Boolean, default: false },
    showRead: { type: Boolean, default: false },
    showReadLater: { type: Boolean, default: false },
  }, 
  emits: [
    "toggleUnreadPosts",
    "toggleReadPosts",
    "toggleReadLaterPosts",
  ],
}
</script>
