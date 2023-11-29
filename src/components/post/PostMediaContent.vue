<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <!-- metadata -->
    <PostMediaMetadata
      v-if="mediaContent.metadata"
      :metadata="mediaContent.metadata"
    />
    <!-- reference -->
    <v-card-text>
      <v-dialog
        v-model="showContents"
        fullscreen
        scrollable
      >
        <!-- TODO: extract component -->
        <vue-plyr v-if="isVideo">
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
      <v-img
        :src="mediaContent.reference.uri"
        @click="showContents = true"
      />
      <!-- TODO: extract component -->
      <v-chip-group v-if="hasUseableProperties">
        <v-chip
          v-if="mediaContent.audioChannels"
          :ripple="false"
        >
          {{ $t('audioChannelsColon') }} {{ mediaContent.audioChannels }}
        </v-chip>
        <v-chip
          v-if="mediaContent.bitRate"
          :ripple="false"
        >
          {{ $t('bitRateColon') }} {{ mediaContent.bitRate }}
        </v-chip>
        <v-chip
          v-if="mediaContent.duration"
          :ripple="false"
        >
          {{ $t('durationColon') }} {{ mediaContent.duration }}
        </v-chip>
        <v-chip
          v-if="mediaContent.expression"
          :ripple="false"
        >
          {{ $t('expressionColon') }} {{ mediaContent.expression }}
        </v-chip>
        <v-chip
          v-if="mediaContent.fileSize"
          :ripple="false"
        >
          {{ $t('fileSizeColon') }} {{ mediaContent.fileSize }}
        </v-chip>
        <v-chip
          v-if="mediaContent.frameRate"
          :ripple="false"
        >
          {{ $t('frameRateColon') }} {{ mediaContent.frameRate }}
        </v-chip>
        <v-chip
          v-if="mediaContent.height"
          :ripple="false"
        >
          {{ $t('heightColon') }} {{ mediaContent.height }}
        </v-chip>
        <v-chip
          v-if="mediaContent.width"
          :ripple="false"
        >
          {{ $t('widthColon') }} {{ mediaContent.width }}
        </v-chip>
        <v-chip
          v-if="mediaContent.language"
          :ripple="false"
        >
          {{ $t('languageColon') }} {{ mediaContent.language }}
        </v-chip>
        <v-chip
          v-if="mediaContent.samplingRate"
          :ripple="false"
        >
          {{ $t('samplingRateColon') }} {{ mediaContent.samplingRate }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script>
import PostMediaMetadata from '@/components/post/PostMediaMetadata.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "PostMediaContent",
  components: {
    PostMediaMetadata,
  },
  mixins: [buttonSizeMixin],
  props: {
    mediaContent: { type: Object, required: true },
  },
  data() {
    return {
      showContents: false,
    }
  },
  computed: {
    hasUseableProperties: function () {
      let p = false;
      if (this.mediaContent.audioChannels || 
        this.mediaContent.bitRate || 
        this.mediaContent.duration ||
        this.mediaContent.expression || 
        this.mediaContent.fileSize || 
        this.mediaContent.frameRate || 
        this.mediaContent.height || 
        this.mediaContent.width || 
        this.mediaContent.language || 
        this.mediaContent.samplingRate) {
          p = true;
        }
      return p;
    },
    isVideo: function () {
      return this.mediaContent.type && (this.mediaContent.type.indexOf("shockwave-flash") >= 0 || this.mediaContent.type.indexOf("video") >= 0);
    },
    isAudio: function () {
      return this.mediaContent.type && (this.mediaContent.type.indexOf("shockwave-flash") >= 0 || this.mediaContent.type.indexOf("audio") >= 0);
    },
    isImage: function () {
      return this.mediaContent.type && (this.mediaContent.type.indexOf("shockwave-flash") >= 0 || this.mediaContent.type.indexOf("image") >= 0);
    },
    mediaContentIcon: function() {
      if (this.isVideo) {
        return 'fa-file-video-o';
      } else if (this.isAudio) {
        return 'fa-headphones';
      } else if (this.isImage) {
        return 'fa-file-image-o';
      }

      return 'fa-file-o';
    }
  },
}
</script>

<style scoped>
.post-media-content-image {
  background-color: transparent;
}
</style>
