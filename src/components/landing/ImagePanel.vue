<template>
  <v-card>
    <v-card-title class="pa-4 text-center">
      The Power Of RSS
    </v-card-title>
    <v-card-text>
      <v-img
        class="mb-4"
        src="the_power_of_rss.gif"
        max-height="512"
      />
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
  name: "ImagePanel",
  mixins: [buttonSizeMixin],
  emits: ["dismiss"], 
}
</script>
