<template>
  <div class="post-media-content" v-if="this.showContentOnLoad">
    <!-- metadata -->
    <PostMediaMetadata v-if="hasUseableMetadata()"
      :theme="theme" 
      :metadata="this.mediaContent.metadata" />
    <!-- reference -->
    <div>
      <div class="pill-container">
        <div class="inner-pill-container">
          <div class="br-pill-subdued" v-if="this.mediaContent.audioChannels">{{ this.$t('audioChannelsColon')}} &nbsp; {{ this.mediaContent.audioChannels }}</div>
          <div class="br-pill-subdued" v-if="this.mediaContent.bitRate">{{ this.$t('bitRateColon') }} &nbsp; {{ this.mediaContent.bitRate }}</div>
          <div class="br-pill-subdued" v-if="this.mediaContent.duration">{{ this.$t('durationColon') }} &nbsp; {{ this.mediaContent.duration }}</div>
          <div class="br-pill-subdued" v-if="this.mediaContent.expression">{{ this.$t('expressionColon') }} &nbsp; {{ this.mediaContent.expression }}</div>
          <div class="br-pill-subdued" v-if="this.mediaContent.fileSize">{{ this.$t('fileSizeColon') }} &nbsp; {{ this.mediaContent.fileSize }}</div>
          <div class="br-pill-subdued" v-if="this.mediaContent.frameRate">{{ this.$t('frameRateColon') }} &nbsp; {{ this.mediaContent.frameRate }}</div>
          <div class="br-pill-subdued" v-if="this.mediaContent.height">{{ this.$t('heightColon') }} &nbsp; {{ this.mediaContent.height }}</div>
          <div class="br-pill-subdued" v-if="this.mediaContent.width">{{ this.$t('widthColon') }} &nbsp; {{ this.mediaContent.width }}</div>
          <div class="br-pill-subdued" v-if="this.mediaContent.language">{{ this.$t('languageColon') }} &nbsp; {{ this.mediaContent.language }}</div>
          <div class="br-pill-subdued" v-if="this.mediaContent.samplingRate">{{ this.$t('samplingRateColon') }} &nbsp; {{ this.mediaContent.samplingRate }}</div>
        </div>
      </div>
      <img v-if="isImage() && this.showContents"
        :src="this.mediaContent.reference.uri"
        class="post-media-content-image" 
        tabindex="0" 
        :alt="this.$t('postMediaContentImage')" 
        loading="lazy" />
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
    if (this.isVideo()) {
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
      return this.mediaContent.type && (this.mediaContent.type.indexOf("shockwave-flash") >= 0 || this.mediaContent.type.indexOf("video/mp4") >= 0);
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
  gap: .44rem;
  width: max-content;
  align-items: flex-start;
}

.br-pill-subdued {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: unset;
  border-radius: 4px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .44rem;
  user-select: none;
  margin-bottom: .44rem;
}

.post-media-content-image {
  max-width: 75%;
  max-height: 75%;
  object-fit: scale-down;
}

.inner-pill-container {
  display: flex;
  flex-direction: column;
}
</style>
