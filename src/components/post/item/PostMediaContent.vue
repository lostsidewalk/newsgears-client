<template>
  <div class="post-media-content">
    <!-- metadata -->
    <PostMediaMetadata v-if="hasUseableMetadata()"
      :inTransit="inTransit" 
      :theme="theme" 
      :metadata="this.mediaContent.metadata" />
    <!-- reference -->
    <div v-if="this.showContents">
      <img v-if="isImage()" 
        :src="this.mediaContent.reference.uri"
        class="post-media-content-image" 
        @click="fetchAndSaveImage()"/>
      <div v-else-if="isVideo()" class="post-media-content-image">
        <vue-plyr>
          <div class="plyr__video-embed">
            <iframe
              :src="this.mediaContent.reference.uri"
              allowfullscreen
            ></iframe>
          </div>
        </vue-plyr>        
      </div>
      <div class="pill-container">
        <div class="br-pill" v-if="this.mediaContent.audioChannels">AUDIO CHANNELS: {{ this.mediaContent.audioChannels }}</div>
        <div class="br-pill" v-if="this.mediaContent.bitRate">BIT RATE: {{ this.mediaContent.bitRate }}</div>
        <div class="br-pill" v-if="this.mediaContent.duration">DURATION: {{ this.mediaContent.duration }}</div>
        <div class="br-pill" v-if="this.mediaContent.expression">EXPRESSION: {{ this.mediaContent.expression }}</div>
        <div class="br-pill" v-if="this.mediaContent.fileSize">FILE SIZE: {{ this.mediaContent.fileSize }}</div>
        <div class="br-pill" v-if="this.mediaContent.frameRate">FRAME RATE: {{ this.mediaContent.frameRate }}</div>
        <div class="br-pill" v-if="this.mediaContent.height">HEIGHT: {{ this.mediaContent.height }}</div>
        <div class="br-pill" v-if="this.mediaContent.width">WIDTH: {{ this.mediaContent.width }}</div>
        <div class="br-pill" v-if="this.mediaContent.language">LANGUAGE: {{ this.mediaContent.language }}</div>
        <div class="br-pill" v-if="this.mediaContent.samplingRate">SAMPLING RATE: {{ this.mediaContent.samplingRate }}</div>
        <div class="br-pill" v-if="this.mediaContent.medium">MEDIUM: {{ this.mediaContent.medium }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import PostMediaMetadata from './PostMediaMetadata.vue';

export default {
  name: "PostMediaContent",
  props: ["inTransit", "theme", "mediaContent"],
  components: {
    PostMediaMetadata,
  },
  mounted() {
    // console.log("post-media-content: mediaContent=" + JSON.stringify(this.mediaContent) + ", showContents: " + this.showContent);
  },
  methods: {
    hasUseableMetadata() {
      return this.mediaContent.metadata.thumbnail && this.mediaContent.metadata.thumbnail.length > 0;
    },
    isImage() {
      return this.mediaContent.medium === "image" || this.mediaContent.type.indexOf("image") === 0;
    },
    isVideo() {
      return this.mediaContent.type.indexOf("shockwave-flash") >= 0;
    },
    fetchAndSaveImage() {
      fetch(this.mediaContent.reference.uri) 
        .then(res => res.blob())
        .then(blob => {
          let file = window.URL.createObjectURL(blob);
          window.open(file, '_blank');
        });
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
.post-media-content {
  /* user-select: none; */
  width: 100%;
  font-size: small;
}

.post-media-content > span:hover {
  /* cursor: pointer; */
  text-decoration: underline;
}

.post-media-content-wrapper {

}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-flow: wrap;
  gap: 5px;
  overflow-x: auto;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  /* cursor: pointer; */
  border-radius: 3px;
  color: v-bind('theme.buttonfg');
  padding: 5px;
  user-select: none;
}

/* .br-pill:hover {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
} */

.post-media-content-image:hover {
  cursor: pointer;
}
</style>
