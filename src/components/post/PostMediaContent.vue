<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <v-card-subtitle v-if="hasUseableMetadata()">
      <!-- metadata -->
      <PostMediaMetadata
        class="ma-2 pa-2"
        :metadata="mediaContent.metadata"
      />
    </v-card-subtitle>
    <!-- reference -->
    <v-card-text>
      <v-chip-group>
        <v-chip
          v-if="mediaContent.audioChannels"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('audioChannelsColon') }} {{ mediaContent.audioChannels }}
        </v-chip>
        <v-chip
          v-if="mediaContent.bitRate"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('bitRateColon') }} {{ mediaContent.bitRate }}
        </v-chip>
        <v-chip
          v-if="mediaContent.duration"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('durationColon') }} {{ mediaContent.duration }}
        </v-chip>
        <v-chip
          v-if="mediaContent.expression"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('expressionColon') }} {{ mediaContent.expression }}
        </v-chip>
        <v-chip
          v-if="mediaContent.fileSize"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('fileSizeColon') }} {{ mediaContent.fileSize }}
        </v-chip>
        <v-chip
          v-if="mediaContent.frameRate"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('frameRateColon') }} {{ mediaContent.frameRate }}
        </v-chip>
        <v-chip
          v-if="mediaContent.height"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('heightColon') }} {{ mediaContent.height }}
        </v-chip>
        <v-chip
          v-if="mediaContent.width"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('widthColon') }} {{ mediaContent.width }}
        </v-chip>
        <v-chip
          v-if="mediaContent.language"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('languageColon') }} {{ mediaContent.language }}
        </v-chip>
        <v-chip
          v-if="mediaContent.samplingRate"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('samplingRateColon') }} {{ mediaContent.samplingRate }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-actions style="justify-content: start;">
      <v-dialog v-model="showContents">
        <vue-plyr v-if="isVideo()">
          <div class="plyr__video-embed">
            <iframe
              allowfullscreen 
              allowtransparency
              :src="mediaContent.reference.uri"
            />
          </div>
        </vue-plyr>
        <v-img
          v-else
          :src="mediaContent.reference.uri"
          class="post-media-content-image" 
          tabindex="0" 
          :alt="$t('postMediaContentImage')"
        />
      </v-dialog>
      <v-btn
        icon="fa-file-video-o"
        @click="showContents = true"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import PostMediaMetadata from '@/components/post/PostMediaMetadata.vue';

export default {
  name: "PostMediaContent",
  components: {
    PostMediaMetadata,
  },
  props: {
    mediaContent: { type: Object, required: true },
  },
  data() {
    return {
      showContents: false,
    }
  },
  methods: {
    hasUseableMetadata() {
      return this.mediaContent.metadata.thumbnail && this.mediaContent.metadata.thumbnail.length > 0;
    },
    isVideo() {
      return this.mediaContent.type && (this.mediaContent.type.indexOf("shockwave-flash") >= 0 || this.mediaContent.type.indexOf("video/mp4") >= 0);
    },
  }
}
</script>

<style scoped>
.post-media-content-image {
  background-color: transparent;
}
</style>
