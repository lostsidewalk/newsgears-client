<template>
  <v-card class="ma-4">
    <v-card-title class="pa-4">
      {{ prompt }}
    </v-card-title>
    <v-divider />
    <v-card-actions>
      <v-btn
        autofocus 
        accesskey="c" 
        :text="$t('confirm')" 
        @click="confirm"
      />
      <v-btn
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
