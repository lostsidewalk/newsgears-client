<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <v-card-title
      class="d-flex flex-row flex-auto flex-wrap align-start overflow-auto"
      :class="pa4r"
      style="gap: 1rem; white-space: normal"
    >
      <v-img
        v-if="iTunes.imageUri"
        :src="iTunes.imageUri"
        tabindex="0"
        :alt="$t('postITunesImage')"
        max-height="140"
        max-width="140"
        width="140"
      />
      <div class="d-flex flex-column flex-auto flex-grow-1">
        <div>
          {{ $t("iTunesTitle", { title: iTunes.title }) }}
        </div>
        <v-divider />
        <div
          v-if="iTunes.subTitle"
          class="text-subtitle-2"
        >
          {{ $t("iTunesSubTitle", { subTitle: iTunes.subTitle }) }}
        </div>
        <div
          v-if="iTunes.author"
          class="text-subtitle-2"
        >
          {{ $t("iTunesAuthor", { author: iTunes.author }) }}
        </div>
        <div
          v-if="iTunes.episode"
          class="text-subtitle-2"
        >
          {{ $t("iTunesEpisode", { episode: iTunes.episode }) }}
        </div>
        <div
          v-if="iTunes.episodeType"
          class="text-subtitle-2"
        >
          {{ $t("iTunesEpisodeType", { episodeType: iTunes.episodeType }) }}
        </div>
        <div
          v-if="iTunes.duration"
          class="text-subtitle-2"
        >
          {{ $t("iTunesDuration", { duration: formattedDuration }) }}
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
        <v-chip-group
          v-if="iTunes.closeCaptioned === true || iTunes.explicit === true"
        >
          <v-chip
            v-if="iTunes.closeCaptioned"
            class="text-subtitle-2"
          >
            {{ $t("closedCaptioned") }}
          </v-chip>
          <v-chip
            v-if="iTunes.explicit"
            class="text-subtitle-2"
          >
            {{ $t("explicit") }}
          </v-chip>
        </v-chip-group>
      </div>
    </v-card-title>
    <v-card-text v-if="iTunes.summary">
      <div
        v-dompurify-html="iTunes.summary"
        class="post-html-frame"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { computed } from 'vue';

import buttonSizeMixin from "@/mixins/buttonSizeMixin";
import spacingMixin from "@/mixins/spacingMixin";

export default {
  name: "PostITunes",
  mixins: [buttonSizeMixin, spacingMixin],
  props: {
    iTunes: { type: Object, required: true },
  },
  setup(props) {
    const formattedDuration = computed(() => {
      if (props.iTunes.duration) {
        let milliseconds = props.iTunes.duration;
        const seconds = Math.floor(milliseconds / 1000) % 60;
        const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        return formattedTime;
      }
      return null;
    });

    return {
      formattedDuration,
    }
  }
};
</script>
