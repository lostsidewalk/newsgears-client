<template>
  <div style="display: block; overflow: auto;">
    <label class="post-info-label-small">MEDIA</label>
    <div>
      <!-- top-level metadata -->
      <PostMediaMetadata v-if="isUseableMetadata(this.media.postMediaMetadata)" 
        :metadata="this.media.postMediaMetadata" 
        :inTransit="inTransit" 
        :theme="theme" />
      <!-- top-level contents array -->
      <div v-if="this.media.postMediaContents && this.showContents" style="display: flex;flex-direction: row">
        <PostMediaContent v-for="mc of this.media.postMediaContents" :key="mc" 
          :mediaContent="mc" 
          :inTransit="inTransit" 
          :theme="theme" />
      </div>
      <!-- top-level media-groups array -->
      <div v-if="this.media.postMediaGroups && this.showContents">
        <PostMediaGroup v-for="mg of this.media.postMediaGroups" :key="mg" 
          :mediaGroup="mg" 
          :inTransit="inTransit" 
          :theme="theme" />
      </div>
      <!-- <pre style="margin: 0px;">{{ JSON.stringify(this.media, null, 2) }}</pre> -->
    </div>
  </div>
</template>

<script>
import PostMediaMetadata from './PostMediaMetadata.vue';
import PostMediaContent from './PostMediaContent.vue';
import PostMediaGroup from './PostMediaGroup.vue';

export default {
  name: "PostMedia",
  props: ["media", "inTransit", "theme"],
  components: {
    PostMediaMetadata,
    PostMediaContent, 
    PostMediaGroup
  },
  mounted() {
    // console.log("post-media mounted: media=" + JSON.stringify(this.media));
  },
  methods: {
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
