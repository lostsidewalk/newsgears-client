<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <v-card-title class="pa-4">
      {{ $t('media') }}
    </v-card-title>
    <v-card-subtitle v-if="isUseableMetadata(media.postMediaMetadata)">
      <!-- top-level metadata -->
      <PostMediaMetadata
        :metadata="media.postMediaMetadata" 
        :theme="theme"
      />
    </v-card-subtitle>
    <!-- top-level contents array -->
    <v-sheet v-if="media.postMediaContents && showContents">
      <PostMediaContent
        v-for="(mc,idx) of media.postMediaContents"
        :key="mc" 
        :ref="'postMediaContent_' + idx"
        :media-content="mc" 
        :show-content-on-load="idx === 0"
        :theme="theme" 
        @playing="onMediaContentPlaying(idx)" 
        @audioPlay="$emit('audioPlay', $event)"
      />
    </v-sheet>
    <!-- top-level media-groups array -->
    <v-sheet v-if="media.postMediaGroups && showContents">
      <PostMediaGroup
        v-for="(mg,idx) of media.postMediaGroups"
        :key="mg" 
        :ref="'postMediaGroup_' + idx"
        :media-group="mg" 
        :theme="theme" 
        @playing="onMediaGroupPlaying(idx)" 
        @audioPlay="$emit('audioPlay', $event)"
      />
    </v-sheet>
  </v-card>
</template>

<script>
import PostMediaMetadata from '@/components/post-media/PostMediaMetadata.vue';
import PostMediaContent from '@/components/post-media/PostMediaContent.vue';
import PostMediaGroup from '@/components/post-media/PostMediaGroup.vue';

export default {
  name: "PostMedia",
  components: {
    PostMediaMetadata,
    PostMediaContent, 
    PostMediaGroup
  },
  props: {
    media: { type: Object, required: true },
  },
  emits: [ "playing" ],
  data() {
    return {
      showContents: true,
    }
  },
  methods: {
    onMediaContentPlaying(idx) {
      // pause all media groups and media content where idx != idx 
      for (let i = 0; i < this.media.postMediaGroups.length; i++) {
        let r = this.$refs['postMediaGroup_' + i];
        if (r && r.length > 0) {
          r[0].pause();
        }
      }
      for (let i = 0; i < this.media.postMediaContents.length; i++) {
        if (i === idx) {
          continue;
        }
        let r = this.$refs['postMediaContent_' + i];
        if (r && r.length > 0) {
          r[0].pause();
        }
      }
      this.$emit('playing');
    },
    onMediaGroupPlaying(idx) {
      // pause all media content and all media groups where idx != idx 
      for (let i = 0; i < this.media.postMediaGroups.length; i++) {
        if (i === idx) {
          continue;
        }
        let r = this.$refs['postMediaGroup_' + i];
        if (r && r.length > 0) {
          r.pause();
        }
      }
      this.$emit('playing');
    },
    pause() {
      if (this.media.postMediaContents) {
        for (let i = 0; i < this.media.postMediaContents.length; i++) {
          let r = this.$refs['postMediaContent_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
      if (this.media.postMediaGroups) {
        for (let i = 0; i < this.media.postMediaGroups.length; i++) {
          let r = this.$refs['postMediaGroup_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
    },
    isUseableMetadata(metadata) {
      return metadata.thumbnails && metadata.thumbnails.length > 0;
    }
  }
}
</script>
