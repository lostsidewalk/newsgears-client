<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <!-- metadata -->
    <PostMediaMetadata
      v-if="hasMetadata"
      :metadata="mediaGroup.postMediaMetadata"
    />
    <v-card-text v-if="mediaGroup.postMediaContents && showContents">
      <v-sheet class="d-flex flex-row flex-wrap gap-1">
        <PostMediaContent
          v-for="(mc,idx) of mediaGroup.postMediaContents"
          :key="mc" 
          :ref="'postMediaContent_' + idx"
          :media-content="mc" 
          :start-iconified="idx !== 0"
          :index="idx + 1"
          :total="mediaGroup.postMediaContents.length"
          @playEnclosure="$event => { $emit('playEnclosure', $event); }"
        />
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, computed } from 'vue';

import PostMediaMetadata from './PostMediaMetadata.vue';
import PostMediaContent from './PostMediaContent.vue';

export default {
  name: "PostMediaGroup",
  components: {
    PostMediaMetadata,
    PostMediaContent,
  },
  props: {
    mediaGroup: { type: Object, required: true },
  },
  emits: ["playEnclosure"],
  setup(props) {
    const showContents = ref(true);

    const hasMetadata = computed(() => {
      return Object.keys(props.mediaGroup.postMediaMetadata).length > 0;
    });

    function pause() {
      if (props.mediaGroup.postMediaContents) {
        for (let i = 0; i < props.mediaGroup.postMediaContents.length; i++) {
          let r = ref('postMediaContent_' + i);
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
    }

    function isUseableMetadata(metadata) {
      return metadata.thumbnails && metadata.thumbnails.length > 0;
    }

    return {
      showContents,
      hasMetadata,
      // 
      pause,
      isUseableMetadata,
    }
  }
}
</script>
