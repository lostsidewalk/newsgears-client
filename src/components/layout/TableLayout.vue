<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :class="my4r"
        :headers="headers"
        :items="dataTableItems"
        item-value="id"
        :expanded="expanded"
        :show-expand="true"
        :expand-on-click="true"
        items-per-page="-1"
        density="compact"
        hover
        :height="layoutHeight"
      >
        <template #item.postTitle="{ item }">
          <a
            href="#"
            @click.stop.prevent="$emit('openPost', { postId: item.id })"
          >{{ item.postTitle }}</a>
        </template>
        <template #item.importerDesc="{ item }">
          <a
            href="#"
            @click.stop.prevent="$emit('updateFilter', {
              name: 'subscription',
              value: item.importerDesc,
              queueId: item.queueId,
            })"
          >{{ item.importerDesc }}</a>
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td
              :colspan="columns.length"
            >
              <div class="d-flex flex-column">
                <div class="ma-1">
                  <!-- description -->
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
                  <v-label v-else>
                    {{ $t('noPostDescription') }}
                  </v-label>
                </div>
                <v-divider v-if="item.postContents || item.postMedia || item.postITunes || item.enclosures" />
                <div class="d-flex flex-row flex-wrap gap-1 ma-1">
                  <!-- post contents -->
                  <v-label
                    v-if="item.postContents"
                    class="clickable"
                    @click.stop.prevent="$emit('openPost', { postId: item.id })"
                  >
                    <v-icon
                      class="mr-2"
                      icon="fa-code"
                    />
                    <span>{{ $t('hasPostContents', { ct: item.postContents.length }) }}</span>
                  </v-label>
                  <!-- post media -->
                  <v-label
                    v-if="item.postMedia"
                    class="clickable"
                    @click.stop.prevent="$emit('openPost', { postId: item.id })"
                  >
                    <v-icon
                      class="mr-2"
                      icon="fa-image"
                    />
                    <span>{{ $t('hasPostMedia') }}</span>
                  </v-label>
                  <!-- post iTunes -->
                  <v-label
                    v-if="item.postITunes"
                    class="clickable"
                    @click.stop.prevent="$emit('openPost', { postId: item.id })"
                  >
                    <v-icon
                      class="mr-2"
                      icon="fa-podcast"
                    />
                    <span>{{ $t('hasPostITunes') }}</span>
                  </v-label>
                  <!-- post enclosures -->
                  <v-label
                    v-if="item.enclosures"
                    class="clickable"
                    @click.stop.prevent="$emit('openPost', { postId: item.id })"
                  >
                    <v-icon
                      class="mr-2"
                      icon="fa-paperclip"
                    />
                    <span>{{ $t('hasEnclosures', { ct: item.enclosures.length }) }}</span>
                  </v-label>
                </div>
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
              @click.stop="$emit('openPostUrl', { postId: item.id })"
            />
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { reactive, computed } from 'vue';

import { useTimestamp } from '@/composable/useTimestamp';
import { useI18n } from 'vue-i18n';

import buttonSizeMixin from '@/mixins/buttonSizeMixin';
import spacingMixin from '@/mixins/spacingMixin';

export default {
  mixins: [buttonSizeMixin, spacingMixin],
  props: {
    layoutHeight: { type: String, default: "75vh" },
    filteredArticleList: { type: Array, required: true },
  },
  emits: [
    "openPost",
    "updateFilter",
    "updatePostReadStatus",
    "openPostUrl",
  ],
  setup(props) {
    const { formatTimestamp } = useTimestamp();
    const { t } = useI18n();

    const expanded = reactive([]);

    const headers = computed(() => {
      return [
        { title: t('postTitle'), value: 'postTitle' },
        { title: t('feedTitle'), value: 'importerDesc' },
        { title: t('postTimestamp'), value: 'postTimestamp' },
        { title: t('postStatus'), value: 'postStatus' },
        { title: t('actions'), value: 'actions' },
      ];
    });

    const dataTableItems = computed(() => {
      let dataTableItems = [];
      for (let i = 0; i < props.filteredArticleList.length; i++) {
        // fetch the article 
        let a = props.filteredArticleList[i];
        // t/f if the article has a non-empty title property 
        let hasTitle = a.postTitle != null && a.postTitle.value && a.postTitle.value.length > 0;
        // t/f if the article has a non-empty HTML title 
        let isHtmlTitle = hasTitle &&
          a.postTitle.type != null && a.postTitle.type.toLowerCase().indexOf('html') >= 0;
        // t/f if the article has a non-empty description property 
        let hasDesc = a.postDesc != null && a.postDesc.value && a.postDesc.value.length > 0;
        // t/f if the article has a non-empty HTML description 
        let isHtmlDesc = hasDesc &&
          a.postDesc.type != null && a.postDesc.type.toLowerCase().indexOf('html') >= 0;
        // setup the item 
        let item = {
          id: a.id,
          queueId: a.queueId,
          isRead: a.isRead,
          isReadLayer: a.isReadLater,
          postTitle: hasTitle ?
            (isHtmlTitle ? t('htmlNotShownHere') : a.postTitle.value) :
            t('noPostTitle'),
          importerDesc: a.importerDesc,
          postTimestamp: a.lastUpdatedTimestamp ? formatTimestamp(a.lastUpdatedTimestamp) : formatTimestamp(a.publishTimestamp),
          postStatus: a.isRead ? 'READ' : (a.isReadLater ? 'READ-LATER' : 'UNREAD'),
          postDesc: {
            isHtml: isHtmlDesc,
            value: a.postDesc ? a.postDesc.value : null,
          },
          postContents: a.postContents,
          postMedia: a.postMedia,
          postITunes: a.postITunes,
          enclosures: a.enclosures,
        };
        dataTableItems.push(item);
      }
      return dataTableItems;
    });

    return {
      formatTimestamp,
      expanded,
      // 
      headers,
      dataTableItems,
    }
  },
};
</script>
