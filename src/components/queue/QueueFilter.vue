<template>
  <div>
    <!-- queue filter input -->
    <v-text-field
      id="queue-filter"
      :placeholder="$t('filter')"
      :aria-label="$t('filter')"
      :value="filter" 
      variant="underlined"
      bg-color="transparent"
      @input="$emit('update:modelValue', $event.target.value)"
      @click:append="showFilterHelp = !showFilterHelp"
    >
      <template #append>
        <!-- help buton -->
        <v-btn
          :size="buttonSize"
          :title="$t('toggleSortOrder')"
          :aria-label="$t('toggleSortOrder')"
          :icon="showFilterHelp ? 'fa-compress' : 'fa-question-circle'"
          variant="plain"
          @click="showFilterHelp = !showFilterHelp"
        />
      </template>
    </v-text-field>
    <!-- filter help card -->
    <v-dialog
      v-model="showFilterHelp"
      fullscreen
      scrollable
    >
      <QueueFilterHelp @dismiss="showFilterHelp = false" />
    </v-dialog>
  </div>
</template>

<script>
import QueueFilterHelp from './QueueFilterHelp.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueFilter",
  components: {
    QueueFilterHelp,
  },
  mixins: [buttonSizeMixin],
  props: {
    filter: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data() {
    return {
      showFilterHelp: false,
    }
  }
}
</script>
