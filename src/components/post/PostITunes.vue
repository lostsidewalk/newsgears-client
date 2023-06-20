<template>
  <v-card
    class="post-itunes-content"
    variant="flat"
    align="left"
    justify="left"
  >
    <v-card-title
      class="d-flex flex-row flex-auto pa-4 flex-wrap align-start overflow-auto clickable"
      style="gap: 1rem; white-space: normal"
    >
      <v-img
        :src="iTunes.imageUri" 
        tabindex="0" 
        :alt="$t('postITunesImage')" 
        max-height="140"
        max-width="140"
        width="140"
      />
      <div class="d-flex flex-column flex-auto flex-grow-1">
        <div>
          {{ $t('iTunesTitle', { title: iTunes.title }) }}
        </div>
        <v-divider />
        <div
          v-if="iTunes.subTitle"
          class="text-subtitle-2"
        >
          {{ $t('iTunesSubTitle', { subTitle: iTunes.subTitle }) }}
        </div>
        <div
          v-if="iTunes.author"
          class="text-subtitle-2"
        >
          {{ $t('iTunesAuthor', { author: iTunes.author }) }}
        </div>
        <div
          v-if="iTunes.episode"
          class="text-subtitle-2"
        >
          {{ $t('iTunesEpisode', { episode: iTunes.episode }) }}
        </div>
        <div
          v-if="iTunes.episodeType"
          class="text-subtitle-2"
        >
          {{ $t('iTunesEpisodeType', { episodeType: iTunes.episodeType }) }}
        </div>
        <div
          v-if="iTunes.duration"
          class="text-subtitle-2"
        >
          {{ $t('iTunesDuration', { duration: formattedDuration }) }}
        </div>
        <v-chip-group v-if="iTunes.keywords.length > 0">
          <v-chip
            v-for="keyword of iTunes.keywords"
            :key="keyword"
            class="text-subtitle-2"
          >
            {{ keyword }}
          </v-chip>
        </v-chip-group>
        <v-chip-group v-if="iTunes.closeCaptioned === true || iTunes.explicit === true">
          <v-chip
            v-if="iTunes.closeCaptioned"
            class="text-subtitle-2"
          >
            {{ $t('closedCaptioned') }}
          </v-chip>
          <v-chip
            v-if="iTunes.explicit"
            class="text-subtitle-2"
          >
            {{ $t('explicit') }}
          </v-chip>
        </v-chip-group>
      </div>
    </v-card-title>
    <v-card-text v-if="iTunes.summary">
      <div
        class="post-html-frame"
        v-html="iTunes.summary"
      />
    </v-card-text>
    <v-card-actions style="justify-content: start;">
      <v-btn
        variant="tonal" 
        :size="buttonSize"
        icon="fa-headphones"
        @click="$emit('playFirstEnclosure', iTunes)"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "PostITunes",
  mixins: [buttonSizeMixin],
  props: {
    iTunes: { type: Object, required: true },
  },
  emits: ["playFirstEnclosure"],
  computed: {
    formattedDuration: function () {
      if (this.iTunes.duration) {
        let milliseconds = this.iTunes.duration.milliseconds;
        const seconds = Math.floor(milliseconds / 1000) % 60;
        const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return formattedTime;
      }
      return null;
    },
  },
}
</script>
