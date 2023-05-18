<template>
  <v-card class="ma-4">
    <v-card-title class="pa-4">{{ prompt }}</v-card-title>
    <v-divider />
    <v-card-actions>
      <v-btn @click="confirm" 
        autofocus 
        accesskey="c" 
        :text="this.$t('confirm')" />
      <v-btn @click.stop="this.$emit('cancel')" 
        :text="this.$t('cancel')" />
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: "ConfirmationDialog",
  props: ["prompt", "theme"],
  emits: ["confirm", "cancel"],
  methods: {
    confirm() {
      this.$emit('confirm');
    },
  },
}
</script>
