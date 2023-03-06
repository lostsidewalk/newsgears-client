<template>
  <div class="post-media-content" v-if="this.showContentOnLoad">
    <!-- metadata -->
    <PostMediaMetadata v-if="hasUseableMetadata()"
      :theme="theme" 
      :metadata="this.mediaContent.metadata" />
    <!-- reference -->
    <div>
      <div class="pill-container">
        <button class="post-media-content-handle" :class="'fa ' + (this.showContents ? 'fa-minus' : 'fa-plus')" @click.stop="this.showContents = !this.showContents">
        </button>
        <div class="inner-pill-container">
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
      <img v-if="isImage() && this.showContents"
        :src="this.mediaContent.reference.uri"
        class="post-media-content-image" 
        tabindex="0" 
        alt="Post media content image" />
      <div v-else-if="isVideo() && this.showContents" class="post-media-content-video">
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
        <!-- PLAY BUTTON PLACEHOLDER -->
      <!-- <div v-else-if="isAudio() && this.showContents" class="post-media-content-audio">
        <button class="fa fa-play audio-player-control" @click="this.$emit('audioPlay', { url: this.mediaContent.reference.uri })" />
      </div> -->
    </div>
  </div>
</template>

<script>
import PostMediaMetadata from './PostMediaMetadata.vue';

export default {
  name: "PostMediaContent",
  props: [ "mediaContent", "showContentOnLoad", "theme" ],
  emits: [ "playing", "audioPlay" ],
  components: {
    PostMediaMetadata,
  },
  mounted() {
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
      return this.mediaContent.type && this.mediaContent.type.indexOf("shockwave-flash") >= 0;
    },
    isAudio() {
      return this.mediaContent.type && this.mediaContent.type.indexOf("audio/mpeg") >= 0;
    },
    // fetchAndSaveImage() {
    //   this.inTransit = true;
    //   fetch(this.mediaContent.reference.uri) 
    //     .then(res => res.blob())
    //     .then(blob => {
    //       let file = window.URL.createObjectURL(blob);
    //       window.open(file, '_blank');
    //     }).finally(() => {
    //       this.inTransit = false;
    //     })
    // }
  },
  data() {
    return {
      showContents: this.showContentOnLoad, 
    }
  }
}
</script>

<style scoped>
.post-media-content {
  width: 100%;
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-flow: wrap;
  gap: .31rem;
  width: max-content;
  align-items: flex-start;
}

.br-pill-subdued {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: unset;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .31rem;
  user-select: none;
  margin-bottom: .31rem;
}

.post-media-content-image-wrapper {
  background: unset;
  border: unset;
}

.post-media-content-image {
  max-width: 75%;
  max-height: 75%;
  object-fit: scale-down;
}

.post-media-content-image:hover, .post-media-content-image:focus {
  cursor: pointer;
}

.post-media-content-handle {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  text-align: center;
  border-radius: 3px;
  background-color: transparent;
  color: v-bind('theme.sectionsubdued');
  padding-top: .125rem;
}

.post-media-content-handle:hover, .post-media-content-handle:focus {
  border: 1px solid v-bind('theme.buttonborder');
  color: v-bind('theme.buttonfg');
  background-color: v-bind('theme.buttonhighlight');
}

.inner-pill-container {
  display: flex;
  flex-direction: column;
}
</style>
