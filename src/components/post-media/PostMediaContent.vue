<template>
  <v-card variant="flat" align="left" justify="left">
    <v-card-subtitle v-if="hasUseableMetadata()">
      <!-- metadata -->
      <PostMediaMetadata 
        :theme="theme" 
        :metadata="this.mediaContent.metadata" />
    </v-card-subtitle>
    <!-- reference -->
    <v-card-text>
      <v-chip-group>
        <v-chip v-if="this.mediaContent.audioChannels" variant="text">{{ this.$t('audioChannelsColon')}} {{ this.mediaContent.audioChannels }}</v-chip>
        <v-chip v-if="this.mediaContent.bitRate" variant="text">{{ this.$t('bitRateColon') }} {{ this.mediaContent.bitRate }}</v-chip>
        <v-chip v-if="this.mediaContent.duration" variant="text">{{ this.$t('durationColon') }} {{ this.mediaContent.duration }}</v-chip>
        <v-chip v-if="this.mediaContent.expression" variant="text">{{ this.$t('expressionColon') }} {{ this.mediaContent.expression }}</v-chip>
        <v-chip v-if="this.mediaContent.fileSize" variant="text">{{ this.$t('fileSizeColon') }} {{ this.mediaContent.fileSize }}</v-chip>
        <v-chip v-if="this.mediaContent.frameRate" variant="text">{{ this.$t('frameRateColon') }} {{ this.mediaContent.frameRate }}</v-chip>
        <v-chip v-if="this.mediaContent.height" variant="text">{{ this.$t('heightColon') }} {{ this.mediaContent.height }}</v-chip>
        <v-chip v-if="this.mediaContent.width" variant="text">{{ this.$t('widthColon') }} {{ this.mediaContent.width }}</v-chip>
        <v-chip v-if="this.mediaContent.language" variant="text">{{ this.$t('languageColon') }} {{ this.mediaContent.language }}</v-chip>
        <v-chip v-if="this.mediaContent.samplingRate" variant="text">{{ this.$t('samplingRateColon') }} {{ this.mediaContent.samplingRate }}</v-chip>
      </v-chip-group>
      <vue-plyr ref="player" v-if="isVideo()" v-show="this.showContents">
        <div class="plyr__video-embed" data-plyr-config='{ autoplay: false, autopause: true }'>
          <iframe class="w-100" style="border: 0px;"
            allowfullscreen
            allowtransparency
            :src="this.mediaContent.reference.uri">
          </iframe>
        </div>
      </vue-plyr>
      <img v-else-if="this.showContents"
        :src="this.mediaContent.reference.uri"
        class="post-media-content-image" 
        tabindex="0" 
        :alt="this.$t('postMediaContentImage')" />
    </v-card-text>
  </v-card>
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
      if (this.isVideo()) {
        this.$refs.player.player.pause();
      }
    },
    hasUseableMetadata() {
      return this.mediaContent.metadata.thumbnail && this.mediaContent.metadata.thumbnail.length > 0;
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
.post-media-content-image {
  max-width: 75%;
  max-height: 75%;
  object-fit: scale-down;
  background-color: currentColor;
}
</style>
