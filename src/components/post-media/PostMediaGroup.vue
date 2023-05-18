<template>
  <v-card variant="flat" align="left" justify="left">
    <v-card-subtitle v-if="isUseableMetadata(this.mediaGroup.postMediaMetadata)">
      <!-- metadata -->
      <PostMediaMetadata 
        :theme="theme" 
        :metadata="this.mediaGroup.postMediaMetadata" />
    </v-card-subtitle>
    <v-sheet v-if="this.mediaGroup.postMediaContents && this.showContents">
      <PostMediaContent v-for="(mc,idx) of this.mediaGroup.postMediaContents" :key="mc" 
        :ref="'postMediaContent_' + idx"
        :mediaContent="mc" 
        :showContentOnLoad="idx === 0"
        :theme="theme" 
        @playing="this.$emit('playing')" 
        @audioPlay="this.$emit('audioPlay', $event)" />
    </v-sheet>
  </v-card>
</template>

<script>
import PostMediaMetadata from './PostMediaMetadata.vue';
import PostMediaContent from './PostMediaContent.vue';

export default {
  name: "PostMediaGroup",
  props: [ "mediaGroup", "theme" ],
  emits: [ "playing" ],
  components: {
    PostMediaMetadata,
    PostMediaContent,
  },
  methods: {
    pause() {
      if (this.mediaGroup.postMediaContents) {
        for (let i = 0; i < this.mediaGroup.postMediaContents.length; i++) {
          let r = this.$refs['postMediaContent_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
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
