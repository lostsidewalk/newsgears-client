<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    class="my-4"
    :headers="headers"
    :items="dataTableItems"
  >
    <template #item.actions="{ item }">
      <div class="d-flex flex-row">
        <v-btn
          :size="buttonSize"
          variant="text"
          :title="item.isRead ? $t('markPostAsUnread') : $t('markPostAsRead')"
          :aria-label="$t('markPostAsUnread')"
          :icon="item.isRead ? 'fa-check-square-o' : 'fa-eye'"
          @click.stop="$emit('updatePostReadStatus', { 
            id: item.id, 
            newStatus: item.isRead ? 'UNREAD' : 'READ', 
            originator: 'togglePostReadStatus',
          })"
        />
        <v-btn
          :size="buttonSize"
          variant="text"
          :title="
            item.isReadLater
              ? $t('unmarkPostAsReadLater')
              : $t('markPostAsReadLater')
          "
          :aria-label="$t('markPostAsReadLater')"
          :icon="item.isReadLater ? 'fa-bullseye' : 'fa-circle-o'"
          @click.stop="$emit('updatePostReadStatus', { 
            id: item.id, 
            newStatus: item.isReadLayer ? 'UNREAD' : 'READ_LATER', 
            originator: 'togglePostReadLaterStatus',
          })"
        />
        <v-btn
          :size="buttonSize"
          variant="text"
          :title="$t('openOriginalArticle')"
          :aria-label="$t('openOriginalArticle')"
          icon="fa-link"
          @click.stop="$event => { console.log('item: ' + JSON.stringify(item)); $emit('openPostUrl', { postId: item.id }); }"
        />
      </div>
    </template>
  </v-data-table>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  mixins: [buttonSizeMixin],
  props: {
    filteredArticleList: { type: Array, required: true },
  },
  computed: {
    headers: function () {
      return [
        { title: this.$t('postTitle'), value: 'postTitle' },
        { title: this.$t('feedTitle'), value: 'importerDesc' },
        { title: this.$t('postTimestamp'), value: 'postTimestamp' },
        { title: this.$t('actions'), value: 'actions' },
      ];
    },
    dataTableItems: function () {
      let dataTableItems = [];
      for (let i = 0; i < this.filteredArticleList.length; i++) {
        let a = this.filteredArticleList[i];
        let isHtmlTitle = a.postTitle != null &&
          a.postTitle.type != null &&
          a.postTitle.type.toLowerCase().indexOf('html') >= 0;
        dataTableItems.push({
          id: a.id, 
          isRead: a.isRead,
          isReadLayer: a.isReadLater,
          postTitle: isHtmlTitle ? '<HTML not shown>' : a.postTitle.value,
          importerDesc: a.importerDesc,
          postTimestamp: a.lastUpdatedTimestamp ? a.lastUpdatedTimestamp : a.publishTimestamp,
        });
      }
      return dataTableItems;
    },
  }
};
</script>
