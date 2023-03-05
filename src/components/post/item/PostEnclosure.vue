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
    <!-- PLAY BUTTON PLACEHOLDER -->
    <!-- <div v-else-if="isAudio()" class="post-enclosure-image">
      <button class="fa fa-play audio-player-control" @click="playAudio" />
    </div> -->
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
  emits: [ "playing", "audioPlay" ],
  mounted() {
    if (this.isVideo()) {
      this.$refs.player.player.on('playing', () => this.$emit('playing'));
    }
  },
  methods: {
    playAudio() {
      this.$emit('audioPlay', { url: this.enclosure.url });
    },
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
  width: 100%;
}

.post-enclosure > span:hover, .post-enclosure > span:focus {
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

.post-enclosure-image:hover, .post-enclosure-image:focus {
  cursor: pointer;
}
</style>
