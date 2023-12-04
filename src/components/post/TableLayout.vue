<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    class="my-4"
    :headers="headers"
    :items="dataTableItems"
    :expanded="expanded"
    :show-expand="true"
    :expand-on-click="true"
    items-per-page="-1"
    density="compact"
    hover
  >
    <template #expanded-row="{ columns, item }">
      <tr v-if="item.postDesc.value">
        <td :colspan="columns.length">
          <div
            v-if="item.postDesc.isHtml"
            v-dompurify-html="item.postDesc.value"
            class="post-html-frame"
            frameborder="0"
          />
          <div
            v-else-if="item.postDesc.value"
            class="post-text-frame"
          >
            {{ item.postDesc.value }}
          </div>
        </td>
      </tr>
    </template>
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
  data() {
    return {
      expanded: [],
    }
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
        let isHtmlDesc = a.postDesc != null &&
          a.postDesc.type != null &&
          a.postDesc.type.toLowerCase().indexOf('html') >= 0;
        let item = {
          id: a.id,
          isRead: a.isRead,
          isReadLayer: a.isReadLater,
          postTitle: isHtmlTitle ? '<HTML title not shown>' : a.postTitle.value,
          importerDesc: a.importerDesc,
          postTimestamp: a.lastUpdatedTimestamp ? a.lastUpdatedTimestamp : a.publishTimestamp,
          postDesc: {
            isHtml: isHtmlDesc,
            value: a.postDesc ? a.postDesc.value : null,
          },
        };
        dataTableItems.push(item); 
      }
      return dataTableItems;
    },
  }
};
</script>

<style scoped>
.post-html-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}

.post-text-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}
</style>
