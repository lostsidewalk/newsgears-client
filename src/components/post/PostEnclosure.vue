<template>
  <div class="post-enclosure">
    <v-img 
      v-if="isImage()" 
      :src="enclosure.url"
      class="post-enclosure-image" 
      tabindex="0" 
      :alt="$t('postEnclosureImage')"
    />
    <div
      v-else-if="isVideo()"
      class="post-enclosure-image"
    >
      <vue-plyr ref="player">
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
  </div>
</template>

<script>
export default {
  name: "PostEnclosure",
  props: {
    enclosure: { type: Object, required: true },
  },
  methods: {
    isImage() {
      return this.enclosure.type === "image" || this.enclosure.type.indexOf("image") === 0;
    },
    isVideo() {
      return this.enclosure.type.indexOf("shockwave-flash") >= 0 || this.enclosure.type.indexOf("video/mp4") >= 0;
    },
  },
}
</script>

<style scoped>
.post-enclosure-image {
  background-color: transparent;
}

.post-enclosure-image:hover, .post-enclosure-image:focus-visible {
  cursor: pointer;
}
</style>
