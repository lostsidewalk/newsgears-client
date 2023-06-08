<template>
  <v-card class="ma-4">
    <v-card-title class="text-center pa-4">
      {{ $t('pleaseConfirm') }}
    </v-card-title>
    <v-card-text class="text-center">
      {{ prompt }}
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn
        :size="buttonSize"
        autofocus 
        accesskey="c" 
        :text="$t('confirm')" 
        @click="$emit('confirm')"
      />
      <v-btn
        :size="buttonSize"
        :text="$t('cancel')" 
        @click.stop="$emit('cancel')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "ConfirmationDialog",
  mixins: [buttonSizeMixin],
  props: {
    prompt: { type: String, required: true },
  },
  emits: ["confirm", "cancel"],
}
</script>
