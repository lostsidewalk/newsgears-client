<template>
  <div class="audio-player-container"
    v-if="this.url"
    :style="{
        '--buffered-width': `${(this.bufferedAmount / this.duration) * 100}%`,
        '--played-width': `${(this.currentTime / this.duration) * 100}%`
      }">
    {{ this.details ? this.details.title : '' }}
    <div class="audio-player-buttons">
      <span @click="togglePlay" :class="'fa ' + (state === 'play' ? 'fa-pause' : 'fa-play')" tabindex="0" />
      <span @click="stopPlaying" class="fa fa-stop" tabindex="0" />
    </div>
    <div class="audio-player-progress">
      <span class="time">{{ currentTimePosition }}</span>
      <input v-if="fileType !== 2"
          type="range"
          class="seek-slider"
          :max="duration"
          :value="currentTime"
          @change="changeCurrentTime" />
      <span v-if="fileType !== 2" id="duration" class="time">{{ maxTimePosition }}</span>
    </div>
    <VolumeControl v-model:value="volume" />
  </div>
</template>

<script>
import VolumeControl from "@/components/post-feed-audio/VolumeControl";

const stopPlayer = (player) => {
  player.pause();
  player.currentTime = 0;
}

const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}

export default {
  name: "PostFeedAudio",
  props: [ "src" ],
  components: {VolumeControl},
  data() {
    return {
      ended: false,
      fileType: 0,
      url: null,
      progress_title: null,
      duration: 0,
      bufferedAmount: 0,
      bufferedPercent: '',
      currentTime: 0,
      state: '',
      loading: true,
      volume: 100,
      isHidden: {
        'visibility': 'hidden'
      },
      playerObj: null,
      corsRetry: false,
    }
  },
  created() {
    this.playerObj = document.getElementById('post-feed-audio');
  },
  unmounted() {
    stopPlayer(this.playerObj);
    //
    this.playerObj.removeEventListener('play', this.onPlay);
    this.playerObj.removeEventListener('pause', this.onPause);
    this.playerObj.removeEventListener('volumechange', this.volumeChange);
    this.playerObj.removeEventListener('progress', this.displayDuration);
    this.playerObj.removeEventListener('loadedmetadata', this.displayDuration);
    this.playerObj.removeEventListener('timeupdate', this.timeUpdate);
    this.playerObj.removeEventListener('error', this.onError);
    this.playerObj.removeEventListener('ended', this.onEnded);
  },
  mounted() {
    this.attachEvents();
  },
  methods: {
    initPlayer(source, destroy = false) {
        let player = document.getElementById('audio_player');
        if (destroy && player) {
          document.getElementById('audio_player').remove();
          player = null;
        }
        if (!player) {
          player = document.createElement('audio');
          player.id = 'audio_player';
          document.body.appendChild(player);
        }
        if (source) {
          player.src = source.url
          player.type = source.type
        }
        player.preload = 'none'

        return player
    },
    attachEvents() {
      this.playerObj.addEventListener('play', this.onPlay)
      this.playerObj.addEventListener('pause', this.onPause)
      this.playerObj.addEventListener('volumechange', this.volumeChange)
      this.playerObj.addEventListener('progress', this.displayDuration)
      this.playerObj.addEventListener('loadedmetadata', this.displayDuration)
      this.playerObj.addEventListener('timeupdate', this.timeUpdate)
      this.playerObj.addEventListener('error', this.onError)
      this.playerObj.addEventListener('ended', this.onEnded)
    },
    play(bundle) {
      this.details = bundle.details;
      this.url = bundle.url;
      this.playerObj.src = this.url;
      this.playerObj.play()
    },
    onEnded() {
      this.ended = true
    },
    onPlay() {
      this.loading = false
      this.ended = false
      this.state = 'play'
    },
    onPause() {
      this.state = 'paused'
    },
    volumeChange ($e) {
      this.volume = $e.target.volume * 100
    },
    onError ($event) {
      this.loading = false
      let player = $event.target
      if (!this.corsRetry && player.error.code == 4) {
        this.corsRetry = true
        this.playerObj = this.initPlayer(this.source, true);
        this.attachEvents();
        this.playerObj.src = this.source.url
        this.playerObj.type = this.source.type
        this.playerObj.play().then(() => this.playerObj.crossOrigin = 'anonymous')
      }
    },
    pausePlaying() {
      if (this.state === 'play') {
        this.playerObj.pause();
      }
    },
    stopPlaying() {
      stopPlayer(this.playerObj);
      this.url = null;
    },
    togglePlay() {
      if (this.state === 'play') {
        this.playerObj.pause()
      } else if (this.state === 'paused') {
        this.playerObj.play();
      }
    },
    timeUpdate ($event) {
      this.currentTime = Math.floor($event.target.currentTime)
    },
    changeCurrentTime($event) {
      this.playerObj.currentTime = $event.target.value
    },
    displayDuration() {
      this.$nextTick(() => {
        if (this.player) {
          if (this.loading) {
            this.loading = false
            this.player.play()
          }
          this.duration = this.player.duration
          this.bufferedAmount = this.player.buffered.length ?
              Math.floor(this.player.buffered.end(this.player.buffered.length - 1)) : 0
          this.bufferedPercent = `${(this.bufferedAmount / this.duration) * 100}%`
          this.volume = this.player.volume * 100
        }
      })
    },
  },
  computed: {
    player() {
      return this.playerObj;
    },
    currentTimePosition() {
      if (!this.currentTime) {
        return '0:00';
      }
      return calculateTime(this.currentTime);
    },
    maxTimePosition() {
      if (!this.duration) {
        return '0:00';
      }
      return calculateTime(this.duration);
    },
    source() {
      return {
        url: this.url, 
        type: 'audio/mpeg'
      }
    },
  },
  watch: {
    volume (v) {
      if (v !== this.player.volume * 100) {
        this.player.volume = v / 100;
      }
    },
  }
}
</script>

<style scoped lang="scss">

.audio-player-buttons {
  display: flex;
}

.audio-player-buttons span {
	width: 3rem;
	min-width: 3rem;
	height: 3rem;
  padding: .44rem 1.25rem;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}

.audio-player-progress {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 50%;
  margin-right: .125rem;
}

.seek-slider {
  position: relative;
  -webkit-appearence: none;
  width: 100%;
  padding: 0;
  height: 4px;
  background: transparent;

  &::before {
    position: absolute;
    content: "";
    top: 0;
    left: 1px;
    width: var(--buffered-width);
    height: 4px;
    cursor: pointer;
    border-radius: 20px;
  }

  &::after {
    position: absolute;
    content: "";
    top: 0;
    left: 1px;
    width: var(--played-width);
    height: 4px;
    cursor: pointer;
    border-radius: 20px;
    z-index: 0;
  }
}

.time {
  margin-right: .125rem;
}

.audio-player-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: .5rem;
}
</style>
