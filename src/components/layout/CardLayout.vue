<template>
  <v-card>
    <v-card-text>
      <v-virtual-scroll
        :items="filteredArticleList"
        :height="layoutHeight"
        class="pa-2"
      >
        <template #default="{ item }">
          <PostCard
            :id="'post_' + item.id"
            :post="item"
            :sharing-options="sharingOptions"
            :collapsed="true"
            :class="mb4r"
            @openPostUrl="$emit('openPostUrl', { postId: item.id })"
            @updatePostReadStatus="$emit('updatePostReadStatus', $event)"
            @updateFilter="$emit('updateFilter', $event)"
            @share="$emit('share', $event)"
            @playEnclosure="$emit('playEnclosure', $event)"
          />
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref } from "vue";

import PostCard from '@/components/post/PostCard.vue';
import spacingMixin from "@/mixins/spacingMixin";

export default {
  name: "CardLayout",
  components: {
    PostCard,
  },
  mixins: [spacingMixin],
  props: {
    layoutHeight: { type: String, default: "75vh" },
    sharingOptions: { type: Array, required: true },
    filteredArticleList: { type: Array, required: true },
  },
  emits: [
    "openPostUrl",
    "updatePostReadStatus",
    "updateFilter",
    "share",
    "playEnclosure",
  ],
  setup(props) {
    const items = ref([]);

    function load() {
      if (props.filteredArticleList) {
        let itemCt = items.value.length;
        let totalCt = props.filteredArticleList.length;
        if (itemCt < totalCt) {
          itemCt += 10;
        }
        items.value.splice(0);
        for (let i = 0; i < itemCt && i < totalCt; i++) {
          items.value.push(props.filteredArticleList[i]);
        }
      }
    }

    return {
      items,
      load,
    };
  },
};
</script>
