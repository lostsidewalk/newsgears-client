<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <!-- metadata -->
    <PostMediaMetadata
      v-if="mediaGroup.postMediaMetadata"
      :metadata="mediaGroup.postMediaMetadata"
    />
    <v-card-text v-if="mediaGroup.postMediaContents && showContents">
      <v-sheet>
        <PostMediaContent
          v-for="(mc,idx) of mediaGroup.postMediaContents"
          :key="mc" 
          :ref="'postMediaContent_' + idx"
          :media-content="mc" 
        />
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
import PostMediaMetadata from './PostMediaMetadata.vue';
import PostMediaContent from './PostMediaContent.vue';

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
