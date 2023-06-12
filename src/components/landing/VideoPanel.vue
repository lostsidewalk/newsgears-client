<template>
  <v-card elevation="6">
    <v-card-title class="question-verbiage text-center pa-4">
      {{ $t('rssMadeEasy') }}
    </v-card-title>
    <v-divider />
    <v-card-text
      align="center"
    >
      <vue-plyr style="width: 100%;height: auto;">
        <div class="plyr__video-embed">
          <iframe
            src="https://www.youtube.com/watch?v=6HNUqDL-pI8"
            allowfullscreen
            allowtransparency
            allow="autoplay"
          />
        </div>
      </vue-plyr>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :size="buttonSize" 
        :text="$t('dismiss')"
        @click="$emit('dismiss')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "VideoPanel",
  mixins: [buttonSizeMixin], 
  emits: ["dismiss"],
}
</script>

<style scoped>
.question-verbiage {
  font-family: "Russo One", system-ui, sans-serif;
}
</style>
