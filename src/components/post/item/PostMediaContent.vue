<template>
  <div class="post-media-content">
    <!-- metadata -->
    <PostMediaMetadata v-if="hasUseableMetadata()"
      :theme="theme" 
      :metadata="this.mediaContent.metadata" />
    <!-- reference -->
    <div v-if="this.showContents">
      <a @click="fetchAndSaveImage()" v-if="isImage()">
        <img 
          :src="this.mediaContent.reference.uri"
          class="post-media-content-image" 
          tabindex="0" />
      </a>
      <div v-else-if="isVideo()" class="post-media-content-video">
        <vue-plyr ref="player">
          <div class="plyr__video-embed" data-plyr-config='{ autoplay: false, autopause: true }'>
            <iframe style="border: 0px; width:100%;"
              allowfullscreen
              allowtransparency
              :src="this.mediaContent.reference.uri">
            </iframe>
          </div>
        </vue-plyr>
      </div>
      <div v-else-if="isAudio()" class="post-media-content-audio">
        <vue-plyr ref="player">
          <audio controls crossorigin playsinline>
            <source
              :src="this.enclosure.url"
              :type="this.enclosure.type" />
          </audio>
        </vue-plyr>
      </div>
      <div class="pill-container">
        <div class="br-pill-subdued" v-if="this.mediaContent.audioChannels">AUDIO CHANNELS: {{ this.mediaContent.audioChannels }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.bitRate">BIT RATE: {{ this.mediaContent.bitRate }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.duration">DURATION: {{ this.mediaContent.duration }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.expression">EXPRESSION: {{ this.mediaContent.expression }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.fileSize">FILE SIZE: {{ this.mediaContent.fileSize }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.frameRate">FRAME RATE: {{ this.mediaContent.frameRate }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.height">HEIGHT: {{ this.mediaContent.height }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.width">WIDTH: {{ this.mediaContent.width }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.language">LANGUAGE: {{ this.mediaContent.language }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.samplingRate">SAMPLING RATE: {{ this.mediaContent.samplingRate }}</div>
        <div class="br-pill-subdued" v-if="this.mediaContent.medium">MEDIUM: {{ this.mediaContent.medium }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import PostMediaMetadata from './PostMediaMetadata.vue';

export default {
  name: "PostMediaContent",
  props: [ "mediaContent", "theme" ],
  emits: [ "playing" ],
  components: {
    PostMediaMetadata,
  },
  mounted() {
    // console.log("post-media-content: mediaContent=" + JSON.stringify(this.mediaContent) + ", showContents: " + this.showContent);
    if (this.isAudio() || this.isVideo()) {
      this.$refs.player.player.on('playing', () => this.$emit('playing'));
    }
  },
  methods: {
    pause() {
      this.$refs.player.player.pause();
    },
    hasUseableMetadata() {
      return this.mediaContent.metadata.thumbnail && this.mediaContent.metadata.thumbnail.length > 0;
    },
    isImage() {
      return this.mediaContent.medium === "image" || this.mediaContent.type.indexOf("image") === 0;
    },
    isVideo() {
      return this.mediaContent.type.indexOf("shockwave-flash") >= 0;
    },
    isAudio() {
      return this.mediaContent.type.indexOf("audio/mpeg") >= 0;
    },
    fetchAndSaveImage() {
      this.inTransit = true;
      fetch(this.mediaContent.reference.uri) 
        .then(res => res.blob())
        .then(blob => {
          let file = window.URL.createObjectURL(blob);
          window.open(file, '_blank');
        }).finally(() => {
          this.inTransit = false;
        })
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
  font-size: smaller;
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
  gap: .31rem;
  overflow-x: auto;
}

.br-pill-subdued {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: unset;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .31rem;
  user-select: none;
}

.post-media-content-image:hover {
  cursor: pointer;
}

.post-media-content-video {
}

.post-media-content-audio {
}
</style>
