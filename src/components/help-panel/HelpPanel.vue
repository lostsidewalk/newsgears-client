<template>
  <v-card>
    <v-card-title
      class="text-center"
      :class="pa4r"
    >
      {{ $t('newsgearsHelp') }}
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- shortcut keys -->
      <GlobalShortcutKeys />
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

import GlobalShortcutKeys from './GlobalShortcutKeys.vue';

export default {
  name: "HelpPanel",
  components: {
    GlobalShortcutKeys,
  },
  mixins: [buttonSizeMixin, spacingMixin],
  emits: ["dismiss"], 
}
</script>
