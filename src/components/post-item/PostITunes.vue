<template>
  <div class="post-itunes-content">
    <v-btn
      v-if="iTunes.imageUri" 
      size="small"
      variant="tonal"
      @click="$emit('playFirstEnclosure', iTunes)"
    >
      <v-img
        :src="iTunes.imageUri" 
        tabindex="0" 
        :alt="$t('postITunesImage')" 
        max-height="140"
        max-width="140"
        width="140"
      />
    </v-btn>
    <div class="d-flex flex-row flex-auto flex-wrap">
      <v-btn
        variant="tonal" 
        size="x-small"
        icon="fa-headphones"
        @click="$emit('playFirstEnclosure', iTunes)"
      />
      <v-chip-group>
        <v-chip
          v-if="iTunes.title"
          variant="text"
        >
          {{ iTunes.title }}
        </v-chip>
        <v-chip
          v-if="iTunes.subTitle"
          variant="text"
        >
          {{ iTunes.subTitle }}
        </v-chip>
        <v-chip
          v-if="iTunes.author"
          variant="text"
        >
          {{ iTunes.author }}
        </v-chip>
        <v-chip
          v-if="iTunes.explicit"
          variant="text"
        >
          {{ $t('explicit') }}
        </v-chip>
        <v-chip
          v-if="iTunes.epiosodeType"
          variant="text"
        >
          {{ $t('episodeType', { episodeType: iTunes.epiosodeType }) }}
        </v-chip>
        <v-chip
          v-for="keyword of iTunes.keywords"
          :key="keyword"
          variant="text"
        >
          {{ keyword }}
        </v-chip>
        <v-chip
          v-if="iTunes.closeCaptioned === true"
          variant="text"
        >
          {{ $t('closedCaptioned') }}
        </v-chip>
        <v-chip
          v-if="iTunes.summary"
          variant="text"
        >
          {{ iTunes.summary }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostITunes",
  props: {
    iTunes: { type: Object, required: true },
  },
  emits: ["playFirstEnclosure"],
}
</script>
