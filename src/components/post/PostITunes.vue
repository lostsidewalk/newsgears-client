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
          {{ iTunes.title }}
        </div>
        <v-divider />
        <div
          v-if="iTunes.subTitle"
          class="text-subtitle-2"
        >
          {{ iTunes.subTitle }}
        </div>
        <div
          v-if="iTunes.author"
          class="text-subtitle-2"
        >
          {{ iTunes.author }}
        </div>
        <div
          v-if="iTunes.explicit"
          class="text-subtitle-2"
        >
          {{ $t('explicit') }}
        </div>
        <div
          v-if="iTunes.episode"
          class="text-subtitle-2"
        >
          {{ $t('episode', { episode: iTunes.episode }) }}
        </div>
        <div
          v-if="iTunes.episodeType"
          class="text-subtitle-2"
        >
          ({{ $t('episodeType', { episodeType: iTunes.episodeType }) }})
        </div>
        <div
          v-for="keyword of iTunes.keywords"
          :key="keyword"
          class="text-subtitle-2"
        >
          {{ keyword }}
        </div>
        <div
          v-if="iTunes.closeCaptioned === true"
          class="text-subtitle-2"
        >
          {{ $t('closedCaptioned') }}
        </div>
        <div
          v-if="iTunes.summary"
          class="text-subtitle-2"
        >
          {{ iTunes.summary }}
        </div>
        <div
          v-if="iTunes.duration"
          class="text-subtitle-2"
        >
          {{ formattedDuration }}
        </div>
      </div>
    </v-card-title>
    <v-card-actions style="justify-content: start;">
      <v-btn
        variant="tonal" 
        :size="xs ? 'x-small' : 'small'"
        icon="fa-headphones"
        @click="$emit('playFirstEnclosure', iTunes)"
      />
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: "PostITunes",
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
    xs: function() {
      return this.$vuetify.display.xs;
    }
  },
}
</script>
