<template>
  <v-card
    variant="elevated"
    align="left"
    justify="left"
  >
    <!-- metadata -->
    <PostMediaMetadata
      v-if="hasMetadata"
      :metadata="mediaContent.metadata"
    />
    <v-card-title
      :class="{ 'clickable' : isAudio || isVideo }"
      @click="$event => { 
        if (isAudio || isVideo) { 
          $emit('playEnclosure', mediaContent.reference.uri) 
        }
      }"
    >
      <v-label>
        <v-icon
          icon="fa-image"
          class="mr-2"
        />
        {{ $t('medium', { type: mediaContent.type, index, total }) }}
      </v-label>
    </v-card-title>
    <!-- reference -->
    <v-card-text>
      <v-dialog
        v-model="showContents"
        scrollable
      >
        <!-- icon (audio/video) -->
        <v-icon
          v-if="isAudio || isVideo"
          :icon="isAudio ? 'fa-headphones' : 'fa-camera'"
          :title="mediaContent.reference.uri"
          @click="$emit('playEnclosure', mediaContent.reference.uri)"
        />
        <!-- icon (image) -->
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
        class="clickable"
        @click="showContents = true"
      />
      <!-- TODO: extract media properties component -->
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
import { ref, computed } from 'vue';

import PostMediaMetadata from './PostMediaMetadata.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "PostMediaContent",
  components: {
    PostMediaMetadata,
  },
  mixins: [buttonSizeMixin],
  props: {
    index: { type: Number, required: true },
    total: { type: Number, required: true },
    mediaContent: { type: Object, required: true },
  },
  emits: ["playEnclosure"],
  setup(props) { 
    const showContents = ref(false);

    const hasMetadata = computed(() => {
      return Object.keys(props.mediaContent.metadata).length > 0;
    });
    const hasUseableProperties = computed(() => {
      let p = false;
      if (props.mediaContent.audioChannels || 
        props.mediaContent.bitRate || 
        props.mediaContent.duration ||
        props.mediaContent.expression || 
        props.mediaContent.fileSize || 
        props.mediaContent.frameRate || 
        props.mediaContent.height || 
        props.mediaContent.width || 
        props.mediaContent.language || 
        props.mediaContent.samplingRate) {
          p = true;
        }
      return p;
    });

    const isVideo = computed(() => {
      return props.mediaContent.type &&
        (props.mediaContent.type.indexOf("shockwave-flash") >= 0 || props.mediaContent.type.indexOf("video") >= 0);
    });

    const isAudio = computed(() => {
      return props.mediaContent.type &&
        props.mediaContent.type.indexOf("audio") >= 0;
    });

    const isImage = computed(() => {
      return props.mediaContent.type &&
        props.mediaContent.type.indexOf("image") >= 0;
    });

    const mediaContentIcon = computed(() => {
      if (isVideo) {
        return 'fa-file-video-o';
      } else if (isAudio) {
        return 'fa-headphones';
      } else if (isImage) {
        return 'fa-file-image-o';
      }

      return 'fa-file-o';
    });


    return {
      showContents,
      // 
      mediaContentIcon,
      isImage,
      isAudio,
      isVideo,
      hasUseableProperties,
      hasMetadata
    }
  },
}
</script>

<style scoped>
.post-media-content-image {
  background-color: transparent;
}
</style>
