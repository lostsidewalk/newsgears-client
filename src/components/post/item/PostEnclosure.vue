<template>
  <div class="post-enclosure">
    <img v-if="isImage()" 
      :src="this.enclosure.uri"
      class="post-enclosure-image" 
      @click="fetchAndSaveImage()" />
    <div v-else-if="isVideo()" class="post-enclosure-image">
      <vue-plyr ref="player">
        <div class="plyr__video-embed" data-plyr-config='{ autoplay: false, autopause: true }'>
          <iframe style="border: 0; width:100%;"
            allowfullscreen
            allowtransparency
            :src="this.enclosure.url">
        </iframe>
        </div>
      </vue-plyr>        
    </div>
    <div v-else-if="isAudio()" class="post-enclosure-image">
      <vue-plyr>
        <audio controls crossorigin playsinline>
          <source
            :src="this.enclosure.url"
            :type="this.enclosure.type"
          />
        </audio>
      </vue-plyr>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostEnclosure",
  props: ["enclosure", "inTransit", "theme"],
  emits: ["playing"],
  mounted() {
    console.log("post-enclosure mounted: enclosure=" + JSON.stringify(this.enclosure));
  },
  methods: {
    isImage() {
      return this.enclosure.type === "image" || this.enclosure.type.indexOf("image") === 0;
    },
    isVideo() {
      return this.enclosure.type.indexOf("shockwave-flash") >= 0;
    },
    isAudio() {
      return this.enclosure.type.indexOf("audio/mpeg") >= 0;
    },
    fetchAndSaveImage() {
      fetch(this.enclosure.uri)
        .then(res => res.blob())
        .then(blob => {
          let file = window.URL.createObjectURL(blob);
          window.open(file, '_blank');
        });
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
.post-enclosure {
  /* user-select: none; */
  width: 100%;
  font-size: small;
}

.post-enclosure > span:hover {
  /* cursor: pointer; */
  text-decoration: underline;
}

.post-enclosure-wrapper {

}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-flow: wrap;
  gap: 5px;
  overflow-x: auto;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  /* cursor: pointer; */
  border-radius: 3px;
  color: v-bind('theme.buttonfg');
  padding: 5px;
  user-select: none;
}

/* .br-pill:hover {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
} */

.post-enclosure-image:hover {
  cursor: pointer;
}
</style>
