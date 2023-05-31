<template>
  <v-toolbar-items class="flex-grow-1 align-content-center">
    <v-chip-group
      class="align-content-center ml-2"
    >
      <v-chip
        v-for="filterPill in filterPills"
        :key="filterPill" 
        elevation="2"
        variant="text"
        :size="buttonSize" 
        :title="filterPill.title"
        @click="filterPill.invoke"
      >
        <v-img
          v-if="filterPill.image" 
          :src="filterPill.image" 
          max-height="24" 
          max-width="24"
        />
        {{ filterPill.label }}
      </v-chip>
    </v-chip-group>
  </v-toolbar-items>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  mixins: [buttonSizeMixin],
  props: {
    filterPills: { type: Array, required: true },
  }, 
}
</script>
