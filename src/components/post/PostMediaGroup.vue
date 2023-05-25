<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <v-card-subtitle v-if="isUseableMetadata(mediaGroup.postMediaMetadata)">
      <!-- metadata -->
      <PostMediaMetadata
        class="ma-2 pa-2"
        :metadata="mediaGroup.postMediaMetadata"
      />
    </v-card-subtitle>
    <v-sheet v-if="mediaGroup.postMediaContents && showContents">
      <PostMediaContent
        v-for="(mc,idx) of mediaGroup.postMediaContents"
        :key="mc" 
        :ref="'postMediaContent_' + idx"
        :media-content="mc" 
      />
    </v-sheet>
  </v-card>
</template>

<script>
import PostMediaMetadata from '@/components/post/PostMediaMetadata.vue';
import PostMediaContent from '@/components/post/PostMediaContent.vue';

export default {
  name: "PostMediaGroup",
  components: {
    PostMediaMetadata,
    PostMediaContent,
  },
  props: {
    mediaGroup: { type: Object, required: true },
  },
  data() {
    return {
      showContents: true,
    }
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
  }
}
</script>
