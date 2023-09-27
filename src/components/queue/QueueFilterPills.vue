<template>
  <v-row stye="font-size: x-small !important;">
    <!-- unread -->
    <v-col
      cols="12"
      sm="3"
      md="3"
    >
      <v-checkbox 
        density="compact"
        :title="$t('toggleUnread')"
        :model-value="showUnread"
        :label="$t('unread')"
        @click="$emit('toggleUnread')"
      />
    </v-col>
    <!-- read -->
    <v-col
      cols="12"
      sm="3"
      md="3"
    >
      <v-checkbox 
        density="compact"
        :title="$t('toggleRead')"
        :model-value="showRead"
        :label="$t('read')"
        @click="$emit('toggleRead')"
      />
    </v-col>
    <!-- read-later -->
    <v-col
      cols="12"
      sm="3"
      md="3"
    >
      <v-checkbox
        density="compact"
        :title="$t('toggleReadLater')"
        :model-value="showReadLater"
        :label="$t('readLater')"
        @click="$emit('toggleReadLater')"
      />
    </v-col>
  </v-row>
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
    "toggleUnread",
    "toggleRead",
    "toggleReadLater",
  ],
}
</script>
