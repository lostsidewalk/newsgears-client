<template>
  <div style="display: block; overflow: auto;">
    <label class="post-info-label-small">MEDIA</label>
    <div>
      <!-- top-level metadata -->
      <PostMediaMetadata v-if="isUseableMetadata(this.media.postMediaMetadata)" 
        :metadata="this.media.postMediaMetadata" 
        :theme="theme" />
      <!-- top-level contents array -->
      <div v-if="this.media.postMediaContents && this.showContents" style="display: flex;flex-direction: row">
        <PostMediaContent v-for="(mc,idx) of this.media.postMediaContents" :key="mc" 
          :ref="'postMediaContent_' + idx"
          :mediaContent="mc" 
          :showContentOnLoad="idx === 0"
          :theme="theme" 
          @playing="onMediaContentPlaying(idx)" />
      </div>
      <!-- top-level media-groups array -->
      <div v-if="this.media.postMediaGroups && this.showContents">
        <PostMediaGroup v-for="(mg,idx) of this.media.postMediaGroups" :key="mg" 
          :ref="'postMediaGroup_' + idx"
          :mediaGroup="mg" 
          :inTransit="inTransit" 
          :theme="theme" 
          @playing="onMediaGroupPlaying(idx)" />
      </div>
    </div>
  </div>
</template>

<script>
import PostMediaMetadata from './PostMediaMetadata.vue';
import PostMediaContent from './PostMediaContent.vue';
import PostMediaGroup from './PostMediaGroup.vue';

export default {
  name: "PostMedia",
  props: [ "media", "inTransit", "theme" ],
  emits: [ "playing" ],
  components: {
    PostMediaMetadata,
    PostMediaContent, 
    PostMediaGroup
  },
  mounted() {
    // console.log("post-media mounted: media=" + JSON.stringify(this.media));
  },
  methods: {
    onMediaContentPlaying(idx) {
      // pause all media groups and media content where idx != idx 
      for (let i = 0; i < this.media.postMediaGroups.length; i++) {
        let r = this.$refs['postMediaGroup_' + i];
        if (r && r.length > 0) {
          r[0].pause();
        }
      }
      for (let i = 0; i < this.media.postMediaContents.length; i++) {
        if (i === idx) {
          continue;
        }
        let r = this.$refs['postMediaContent_' + i];
        if (r && r.length > 0) {
          r[0].pause();
        }
      }
      this.$emit('playing');
    },
    onMediaGroupPlaying(idx) {
      // pause all media content and all media groups where idx != idx 
      for (let i = 0; i < this.media.postMediaGroups.length; i++) {
        if (i === idx) {
          continue;
        }
        let r = this.$refs['postMediaGroup_' + i];
        if (r && r.length > 0) {
          r.pause();
        }
      }
      this.$emit('playing');
    },
    pause() {
      if (this.media.postMediaContents) {
        for (let i = 0; i < this.media.postMediaContents.length; i++) {
          let r = this.$refs['postMediaContent_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
      if (this.media.postMediaGroups) {
        for (let i = 0; i < this.media.postMediaGroups.length; i++) {
          let r = this.$refs['postMediaGroup_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
    },
    isUseableMetadata(metadata) {
      return metadata.thumbnails && metadata.thumbnails.length > 0;
    }
  },
  data() {
    return {
      showContents: true,
    }
  }
}
</script>

<style scoped>
.post-info-label-small {
  max-width: fit-content;
  font-size: smaller;
  color: v-bind('theme.subduedmessage');
}
</style>
