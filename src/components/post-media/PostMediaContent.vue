<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <v-card-subtitle v-if="hasUseableMetadata()">
      <!-- metadata -->
      <PostMediaMetadata 
         
        :metadata="mediaContent.metadata"
      />
    </v-card-subtitle>
    <!-- reference -->
    <v-card-text>
      <v-chip-group>
        <v-chip
          v-if="mediaContent.audioChannels"
          variant="text"
        >
          {{ $t('audioChannelsColon') }} {{ mediaContent.audioChannels }}
        </v-chip>
        <v-chip
          v-if="mediaContent.bitRate"
          variant="text"
        >
          {{ $t('bitRateColon') }} {{ mediaContent.bitRate }}
        </v-chip>
        <v-chip
          v-if="mediaContent.duration"
          variant="text"
        >
          {{ $t('durationColon') }} {{ mediaContent.duration }}
        </v-chip>
        <v-chip
          v-if="mediaContent.expression"
          variant="text"
        >
          {{ $t('expressionColon') }} {{ mediaContent.expression }}
        </v-chip>
        <v-chip
          v-if="mediaContent.fileSize"
          variant="text"
        >
          {{ $t('fileSizeColon') }} {{ mediaContent.fileSize }}
        </v-chip>
        <v-chip
          v-if="mediaContent.frameRate"
          variant="text"
        >
          {{ $t('frameRateColon') }} {{ mediaContent.frameRate }}
        </v-chip>
        <v-chip
          v-if="mediaContent.height"
          variant="text"
        >
          {{ $t('heightColon') }} {{ mediaContent.height }}
        </v-chip>
        <v-chip
          v-if="mediaContent.width"
          variant="text"
        >
          {{ $t('widthColon') }} {{ mediaContent.width }}
        </v-chip>
        <v-chip
          v-if="mediaContent.language"
          variant="text"
        >
          {{ $t('languageColon') }} {{ mediaContent.language }}
        </v-chip>
        <v-chip
          v-if="mediaContent.samplingRate"
          variant="text"
        >
          {{ $t('samplingRateColon') }} {{ mediaContent.samplingRate }}
        </v-chip>
      </v-chip-group>
      <vue-plyr
        v-if="isVideo()"
        v-show="showContents"
        ref="player"
      >
        <div
          class="plyr__video-embed"
          data-plyr-config="{ autoplay: false, autopause: true }"
        >
          <iframe
            class="w-100"
            style="border: 0px;"
            allowfullscreen
            allowtransparency
            :src="mediaContent.reference.uri"
          />
        </div>
      </vue-plyr>
      <img
        v-else-if="showContents"
        :src="mediaContent.reference.uri"
        class="post-media-content-image" 
        tabindex="0" 
        :alt="$t('postMediaContentImage')"
      >
    </v-card-text>
  </v-card>
</template>

<script>
import PostMediaMetadata from '@/components/post-media/PostMediaMetadata.vue';

export default {
  name: "PostMediaContent",
  components: {
    PostMediaMetadata,
  },
  props: {
    mediaContent: { type: Object, required: true },
    showContentOnLoad: { type: Boolean, default: false },
  },
  emits: [ "playing", "audioPlay" ],
  data() {
    return {
      showContents: this.showContentOnLoad, 
    }
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
