<template>
  <v-card>
    <v-card-title
      class="text-center"
      :class="pa4r"
    >
      The Power Of RSS
    </v-card-title>
    <v-card-text>
      <v-img
        :class="mb4r"
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
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "ImagePanel",
  mixins: [buttonSizeMixin, spacingMixin],
  emits: ["dismiss"], 
}
</script>
