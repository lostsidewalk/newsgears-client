<template>
  <div class="d-flex">
    <!-- image -->
    <v-img 
      v-if="isImage()" 
      :src="enclosure.url"
      class="post-enclosure-image" 
      tabindex="0" 
      :alt="$t('postEnclosureImage')"
    />
    <!-- audio -->
    <div
      v-if="isAudio()"
      class="d-flex audio-player w-100 h-auto ma-2 pa-4"
    >
      <vue-plyr
        ref="audioPlayer"
      >
        <audio
          :src="enclosure.url"
          controls
        />
      </vue-plyr>
    </div>
    <!-- video -->
    <vue-plyr
      v-if="isVideo()"
      ref="player"
    >
      <div
        class="plyr__video-embed"
        data-plyr-config="{ autoplay: false, autopause: true }"
      >
        <iframe
          style="border: 0px; width:100%;"
          allowfullscreen
          allowtransparency
          :src="enclosure.url"
        />
      </div>
    </vue-plyr>        
  </div>
</template>

<script>
export default {
  name: "PostEnclosure",
  props: {
    enclosure: { type: Object, required: true },
  },
  data() {
    return {
      showContents: false,
    }
  },
  methods: {
    isImage() {
      return this.enclosure.type === "image" || this.enclosure.type.indexOf("image") === 0;
    },
    isAudio() {
      let a = this.enclosure.type.indexOf("shockwave-flash") >= 0 || this.enclosure.type.indexOf("audio") >= 0;
      console.debug("enclosureType=" + this.enclosure.type + ", isAudio=" + a);
      return a;
    },
    isVideo() {
      let v = this.enclosure.type.indexOf("shockwave-flash") >= 0 || this.enclosure.type.indexOf("video/mp4") >= 0;
      console.debug("enclosureType=" + this.enclosure.type + ", isVideo=" + v);
      return v;
    },
    show() {
      this.showContents = true;
    }
  }

}
</script>

<style scoped>
.post-enclosure-image {
  background-color: transparent;
}

.audio-player {
  align-items: center;
  justify-content: center;
}

.audio-player audio {
  width: 100%;
  max-width: 400px;
}
</style>
