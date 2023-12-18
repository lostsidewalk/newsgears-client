<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <v-card-subtitle v-if="hasMediaMetadata">
      <!-- top-level metadata -->
      <PostMediaMetadata
        class="ma-2 pa-2"
        :metadata="media.postMediaMetadata"
      />
    </v-card-subtitle>
    <!-- top-level contents array -->
    <v-sheet
      v-if="media.postMediaContents && showContents"
      class="d-flex flex-row flex-wrap gap-1"
    >
      <PostMediaContent
        v-for="(mc, idx) of media.postMediaContents"
        :key="mc" 
        :ref="'postMediaContent_' + idx"
        :media-content="mc" 
        :start-iconified="idx !== 0"
        :index="idx + 1"
        :total="media.postMediaContents.length"
        @playEnclosure="$emit('playEnclosure', $event)"
      />
    </v-sheet>
    <!-- top-level media-groups array -->
    <v-sheet
      v-if="media.postMediaGroups && showContents"
      class="d-flex flex-row flex-wrap gap-1"
    >
      <PostMediaGroup
        v-for="(mg,idx) of media.postMediaGroups"
        :key="mg" 
        :ref="'postMediaGroup_' + idx"
        :media-group="mg" 
        @playEnclosure="$emit('playEnclosure', $event)"
      />
    </v-sheet>
  </v-card>
</template>

<script>
import { ref, computed } from 'vue';

import PostMediaMetadata from './PostMediaMetadata.vue';
import PostMediaContent from './PostMediaContent.vue';
import PostMediaGroup from './PostMediaGroup.vue';

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
  emits: ["playEnclosure"],
  setup(props) {
    const showContents = ref(true);

    const hasMediaMetadata = computed(() => {
      return props.media.postMediaMetadata &&
        Object.keys(props.media.postMediaMetadata).length > 0;
    });

    function pause() {
      if (props.media.postMediaContents) {
        for (let i = 0; i < props.media.postMediaContents.length; i++) {
          let r = this.$refs['postMediaContent_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
      if (props.media.postMediaGroups) {
        for (let i = 0; i < props.media.postMediaGroups.length; i++) {
          let r = this.$refs['postMediaGroup_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
    }

    return {
      showContents,
      hasMediaMetadata,
      // 
      pause,
    }
  },
}
</script>
