<template>
  <v-list
    v-model="selectedItem"
    class="rounded my-4"
  >
    <PostListItem
      v-for="post in filteredArticleList"
      :id="'post_' + post.id"
      :key="post"
      :post="post"
      class="ma-4 rounded"
      @openPost="$emit('openPost', { postId: post.id })"
      @updatePostReadStatus="$emit('updatePostReadStatus', $event)"
    />
  </v-list>
</template>

<script>
import { reactive } from 'vue';

import PostListItem from './PostListItem.vue';

export default {
    components: {
        PostListItem,
    },
    props: {
        filteredArticleList: { type: Array, required: true },
    },
    setup() {
        const selectedItem = reactive({}); // selected post list item (i.e., scrolling through the list in list view) 

        return {
            selectedItem,
        }
    }
}
</script>
