<template>
  <div>
    <PostMediaMetadata v-if="isUseableMetadata(this.mediaGroup.postMediaMetadata)" 
      :theme="theme" 
      :metadata="this.mediaGroup.postMediaMetadata" />
    <div v-if="this.mediaGroup.postMediaContents && this.showContents" 
      class="post-media-group-contents">
      <PostMediaContent v-for="(mc,idx) of this.mediaGroup.postMediaContents" :key="mc" 
        :ref="'postMediaContent_' + idx"
        :theme="theme" 
        :mediaContent="mc" 
        @playing="this.$emit('playing')" />
    </div>
  </div>
</template>

<script>
import PostMediaMetadata from './PostMediaMetadata.vue';
import PostMediaContent from './PostMediaContent.vue';

export default {
  name: "PostMediaGroup",
  props: [ "mediaGroup", "inTransit", "theme" ],
  emits: [ "playing" ],
  components: {
    PostMediaMetadata,
    PostMediaContent,
  },
  mounted() {
    // console.log("post-media-group: mediaGroup=" + JSON.stringify(this.mediaGroup));
  },
  methods: {
    pause() {
      for (let i = 0; i < this.mediaGroup.postMediaContents.length; i++) {
        let r = this.$refs['postMediaContent_' + i];
        if (r && r.length > 0) {
          r[0].pause();
        }
      }
    },
    isUseableMetadata(metadata) {
      return metadata.thumbnails && metadata.thumbnails.length > 0;
    },
  },
  data() {
    return {
      showContents: true,
    }
  }
}
</script>

<style scoped>
.post-media-group-contents {
  display: grid;
  grid-auto-flow: column;
  gap: 3rem;
}
</style>
