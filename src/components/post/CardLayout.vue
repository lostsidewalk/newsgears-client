<template>
  <div>
    <PostCard
      v-for="post in filteredArticleList"
      :id="'post_' + post.id"
      :key="post.id"
      :post="post"
      :sharing-options="sharingOptions"
      :collapsed="true"
      class="ma-4"
      @openPostUrl="$emit('openPostUrl', { postId: post.id })"
      @updatePostReadStatus="$emit('updatePostReadStatus', $event)"
      @updateFilter="$emit('updateFilter', $event)"
      @share="($event) => $emit('share', $event)"
    />
  </div>
</template>

<script>
import PostCard from "./PostCard.vue";

export default {
  components: {
    PostCard,
  },
  props: {
    sharingOptions: { type: Array, required: true },
    filteredArticleList: { type: Array, required: true },
  },
};
</script>
