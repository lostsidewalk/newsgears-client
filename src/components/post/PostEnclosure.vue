<template>
  <div
    class="post-enclosure-content"
    :class="pa4r"
  >
    <!-- icon (image) -->
    <v-img 
      v-if="isImage" 
      :src="enclosure.imgUrl"
      tabindex="0" 
      :alt="$t('postEnclosureImage')"
      :title="enclosure.url"
    />
    <!-- icon (audio) -->
    <v-icon
      v-if="isAudio"
      icon="fa-headphones"
      :title="enclosure.url"
      @click="$emit('playEnclosure', enclosure.url)"
    />
    <!-- icon (video) -->
    <v-icon
      v-if="isVideo"
      icon="fa-camera"
      :title="enclosure.url"
      @click="$emit('playEnclosure', enclosure.url)"
    />
    <!-- label -->
    <v-label
      :title="enclosure.url"
    >
      {{ $t('enclosureOfType', { type: enclosure.type }) }}
    </v-label>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "PostEnclosure",
  mixins: [spacingMixin],
  props: {
    enclosure: { type: Object, required: true },
  },
  emits: [
    "playEnclosure",
  ],
  setup(props) {
    const showContents = ref(false);

    const isImage = computed(() => {
      return props.enclosure.type === "image" || props.enclosure.type.indexOf("image") === 0;
    });
    const isAudio = computed(() => {
      let a = props.enclosure.type.indexOf("shockwave-flash") >= 0 || props.enclosure.type.indexOf("audio") >= 0;
      return a;
    });
    const isVideo = computed(() => {
      let v = props.enclosure.type.indexOf("shockwave-flash") >= 0 || props.enclosure.type.indexOf("video") >= 0;
      return v;
    });

    function show() {
      showContents.value = true;
    }

    function play() {
      // TODO: implement this method 
    }

    return {
      showContents,
      isImage,
      isAudio,
      isVideo,
      // 
      show,
      play,
    }
  },
}
</script>

<style scoped>
.post-enclosure-content {
  display: flex;
  flex-direction: flex-row;
  gap: 1rem;
}
</style>
