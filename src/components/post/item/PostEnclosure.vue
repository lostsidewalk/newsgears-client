<template>
  <div class="post-enclosure">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <a v-if="isImage()" @click.stop="fetchAndSaveImage()">
      <img 
        :src="this.enclosure.uri"
        class="post-enclosure-image" 
        tabindex="0" />
      </a>
    <div v-else-if="isVideo()" class="post-enclosure-image">
      <vue-plyr ref="player">
        <div class="plyr__video-embed" data-plyr-config='{ autoplay: false, autopause: true }'>
          <iframe style="border: 0px; width:100%;"
            allowfullscreen
            allowtransparency
            :src="this.enclosure.url">
        </iframe>
        </div>
      </vue-plyr>        
    </div>
    <div v-else-if="isAudio()" class="post-enclosure-image">
      <vue-plyr ref="player">
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
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';


export default {
  name: "PostEnclosure",
  props: [ "enclosure", "theme" ],
  components: {
    NavbarFixedHeader,
  },
  emits: [ "playing" ],
  mounted() {
    console.log("post-enclosure mounted: enclosure=" + JSON.stringify(this.enclosure));
    if (this.isAudio() || this.isVideo()) {
      this.$refs.player.player.on('playing', () => this.$emit('playing'));
    }
  },
  methods: {
    pause() {
      this.$refs.player.player.pause();
    },
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
      this.inTransit = true;
      fetch(this.enclosure.uri)
        .then(res => res.blob())
        .then(blob => {
          let file = window.URL.createObjectURL(blob);
          window.open(file, '_blank');
        }).finally(() => {
          this.inTransit = false;
        });
    }
  },
  data() {
    return {
      inTransit: false,
    }
  }
}
</script>

<style scoped>
.post-enclosure {
  /* user-select: none; */
  width: 100%;
  font-size: smaller;
}

.post-enclosure > span:hover {
  /* cursor: pointer; */
  text-decoration: underline;
}

.post-enclosure-wrapper {

}

.post-enclosure-image {
  max-width: 75%;
  max-height: 75%;
  object-fit: scale-down;
}

.post-enclosure-image:hover {
  cursor: pointer;
}
</style>
