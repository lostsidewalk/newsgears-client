<template>
  <div class="post-itunes-content">
    <v-btn v-if="this.iTunes.imageUri" 
      @click="this.$emit('playFirstEnclosure', this.iTunes)"
      size="small"
      variant="tonal">
      <v-img :src="this.iTunes.imageUri" 
        tabindex="0" 
        :alt="this.$t('postITunesImage')" 
        max-height="140" max-width="140" width="140" />
    </v-btn>
    <div class="d-flex flex-row flex-auto flex-wrap">
      <v-btn @click="this.$emit('playFirstEnclosure', this.iTunes)" 
        variant="tonal"
        size="x-small"
        icon="fa-headphones" />
      <v-chip-group>
        <v-chip v-if="this.iTunes.title" variant="text">{{ this.iTunes.title }}</v-chip>
        <v-chip v-if="this.iTunes.subTitle" variant="text">{{ this.iTunes.subTitle }}</v-chip>
        <v-chip v-if="this.iTunes.author" variant="text">{{ this.iTunes.author }}</v-chip>
        <v-chip v-if="this.iTunes.explicit" variant="text">{{ this.$t('explicit')}}</v-chip>
        <v-chip v-if="this.iTunes.epiosodeType" variant="text"> {{ this.$t('episodeType', { episodeType: this.iTunes.epiosodeType }) }}</v-chip>
        <v-chip v-for="keyword of this.iTunes.keywords" :key="keyword" variant="text">{{ keyword }}</v-chip>
        <v-chip v-if="this.iTunes.closeCaptioned === true" variant="text">{{ this.$t('closedCaptioned') }}</v-chip>
        <v-chip v-if="this.iTunes.summary" variant="text">{{ this.iTunes.summary }}</v-chip>
      </v-chip-group>
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
