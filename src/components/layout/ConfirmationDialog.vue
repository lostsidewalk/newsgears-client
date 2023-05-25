<template>
  <v-card class="ma-4">
    <v-card-title class="text-center pa-4">
      {{ $t('pleaseConfirm') }}
    </v-card-title>
    <v-card-subtitle>
      {{ prompt }}
    </v-card-subtitle>
    <v-divider />
    <v-card-actions>
      <v-btn
        density="comfortable"
        autofocus 
        accesskey="c" 
        :text="$t('confirm')" 
        @click="confirm"
      />
      <v-btn
        density="comfortable"
        :text="$t('cancel')" 
        @click.stop="$emit('cancel')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ConfirmationDialog",
  props: {
    prompt: { type: String, required: true },
  },
  emits: ["confirm", "cancel"],
  methods: {
    confirm() {
      this.$emit('confirm');
    },
  },
}
</script>
