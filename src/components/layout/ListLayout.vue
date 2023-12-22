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
          v-for="post in queueStore.filteredArticleList"
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
import { useQueues } from "@/composable/useQueues";

import PostListItem from "./PostListItem.vue";
import spacingMixin from "@/mixins/spacingMixin";

export default {
  name: "ListLayout",
  components: {
    PostListItem,
  },
  mixins: [spacingMixin],
  props: {
    baseUrl: { type: String, required: true },
    layoutHeight: { type: String, default: "75vh" },
  },
  emits: ["openPost", "updatePostReadStatus"],
  setup(props) {
    const { queueStore } = useQueues(props);
    const selectedItem = reactive({}); // selected post list item (i.e., scrolling through the list in list view)

    return {
      queueStore,
      selectedItem,
    };
  },
};
</script>
