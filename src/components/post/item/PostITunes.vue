<template>
  <div class="post-itunes-content">
    <button v-if="this.iTunes.imageUri" 
      class="post-itunes-content-image-wrapper" 
      @click="this.$emit('playFirstEnclosure', this.iTunes)">
      <img :src="this.iTunes.imageUri" 
        class="post-itunes-content-image" 
        tabindex="0" 
        :alt="this.$t('postITunesImage')" 
        height="140" />
    </button>
    <div class="pill-container">
      <button class="br-pill-subdued fa fa-headphones audio-player-control" @click="this.$emit('playFirstEnclosure', this.iTunes)" />
      <div class="br-pill-subdued" v-if="this.iTunes.title">{{ this.iTunes.title }}</div>
      <div class="br-pill-subdued" v-if="this.iTunes.subTitle">{{ this.iTunes.subTitle }}</div>
      <div class="br-pill-subdued" v-if="this.iTunes.author">{{ this.iTunes.author }}</div>
      <div class="br-pill-subdued" v-if="this.iTunes.explicit">{{ this.$t('explicit')}}</div>
      <!-- TODO: interpolated string -->
      <div class="br-pill-subdued" v-if="this.iTunes.epiosodeType"> {{ this.iTunes.epiosodeType + ' episode' }}</div>
      <!-- <div class="br-pill-subdued" v-if="this.iTunes.duration"> {{ this.iTunes.duration.milliseconds + ' ms' }}</div> -->
      <div class="br-pill-subdued" v-for="keyword of this.iTunes.keywords" :key="keyword">{{ keyword }}</div>
      <div class="br-pill-subdued" v-if="this.iTunes.closeCaptioned === true">{{ this.$t('closedCaptioned') }}</div>
      <div class="br-pill-subdued" v-if="this.iTunes.summary">{{ this.iTunes.summary }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostITunes",
  props: ["iTunes", "theme"],
  emits: ["playFirstEnclosure"],
}
</script>

<style scoped>
.post-itunes-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: .44rem;
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-flow: wrap;
  gap: .44rem;
  width: max-content;
  align-items: flex-start;
}

.br-pill-subdued {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: unset;
  border-radius: 4px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .44rem;
  user-select: none;
}

.post-itunes-content-image-wrapper {
  background: unset;
  border: unset;
}

.post-itunes-content-image {
  max-width: 140px;
  max-height: 140px;
  display: inline-block; 
  background-size: cover; 
  background-position: center center;
  background-repeat: no-repeat;
  align-self: stretch;
  object-fit: scale-down;
  background-color: currentColor;
}

.audio-player-control {
  cursor: pointer;
}
</style>
