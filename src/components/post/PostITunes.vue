<template>
  <div class="post-itunes-content">
    <v-btn
      v-if="iTunes.imageUri" 
      :size="xs ? 'x-small' : 'small'" 
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
        :size="xs ? 'x-small' : 'small'"
        icon="fa-headphones"
        @click="$emit('playFirstEnclosure', iTunes)"
      />
      <v-chip-group>
        <v-chip
          v-if="iTunes.title"
          variant="text"
          label
          :ripple="false"
        >
          {{ iTunes.title }}
        </v-chip>
        <v-chip
          v-if="iTunes.subTitle"
          variant="text"
          label
          :ripple="false"
        >
          {{ iTunes.subTitle }}
        </v-chip>
        <v-chip
          v-if="iTunes.author"
          variant="text"
          label
          :ripple="false"
        >
          {{ iTunes.author }}
        </v-chip>
        <v-chip
          v-if="iTunes.explicit"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('explicit') }}
        </v-chip>
        <v-chip
          v-if="iTunes.epiosodeType"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('episodeType', { episodeType: iTunes.epiosodeType }) }}
        </v-chip>
        <v-chip
          v-for="keyword of iTunes.keywords"
          :key="keyword"
          variant="text"
          label
          :ripple="false"
        >
          {{ keyword }}
        </v-chip>
        <v-chip
          v-if="iTunes.closeCaptioned === true"
          variant="text"
          label
          :ripple="false"
        >
          {{ $t('closedCaptioned') }}
        </v-chip>
        <v-chip
          v-if="iTunes.summary"
          variant="text"
          label
          :ripple="false"
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
  computed: {
    xs: function() {
      return this.$vuetify.display.xs;
    }
  },
}
</script>
