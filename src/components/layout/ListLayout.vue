<template>
  <v-card>
    <v-card-text>
      <v-list
        v-model="selectedItem"
        class="rounded"
        :class="my4r"
        :height="layoutHeight"
      >
        <PostListItem
          v-for="post in filteredArticleList"
          :id="'post_' + post.id"
          :key="post"
          :post="post"
          class="rounded"
          :class="ma4r"
          @openPost="$emit('openPost', { postId: post.id })"
          @updatePostReadStatus="$emit('updatePostReadStatus', $event)"
        />
      </v-list>
    </v-card-text>  
  </v-card>
</template>

<script>
import { reactive } from "vue";

import PostListItem from "./PostListItem.vue";
import spacingMixin from "@/mixins/spacingMixin";

export default {
  name: "ListLayout",
  components: {
    PostListItem,
  },
  mixins: [spacingMixin],
  props: {
    layoutHeight: { type: String, default: "75vh" },
    filteredArticleList: { type: Array, required: true },
  },
  emits: ["openPost", "updatePostReadStatus"],
  setup() {
    const selectedItem = reactive({}); // selected post list item (i.e., scrolling through the list in list view)

    return {
      selectedItem,
    };
  },
};
</script>
