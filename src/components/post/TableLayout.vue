<template>
  <v-table
    class="ma-4"
    fixed-header
  >
    <tbody style="text-align: left;">
      <PostTableRow
        v-for="post in filteredArticleList"
        :id="'post_' + post.id"
        :key="post"
        :post="post"
        class="ma-4 rounded"
        @openPost="$emit('openPost', { postId: post.id })"
        @openPostUrl="$emit('openPostUrl', { postId: post.id })"
        @updatePostReadStatus="$emit('updatePostReadStatus', $event)"
      />
    </tbody>
  </v-table>
</template>

<script>
import PostTableRow from "./PostTableRow.vue";

export default {
    components: {
        PostTableRow,
    },
    props: {
        filteredArticleList: { type: Array, required: true },
  },
}
</script>
