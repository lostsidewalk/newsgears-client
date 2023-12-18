<template>
  <div>
    <!-- queue filter input -->
    <v-text-field
      id="queue-filter"
      v-model="queueStore.articleListFilter"
      :placeholder="$t('filter')"
      :aria-label="$t('filter')"
      variant="underlined"
      bg-color="transparent"
      @input="$emit('updateArticleListFilter', $event.target.value)"
      @click:append="showFilterHelp = !showFilterHelp"
    >
      <template #append>
        <!-- help buton -->
        <v-btn
          :size="buttonSize"
          :title="$t('showFilterHelp')"
          :aria-label="$t('showFilterHelp')"
          icon="fa-question-circle"
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
import { ref } from 'vue';

import { useQueues } from '@/composable/useQueues';

import QueueFilterHelp from './QueueFilterHelp.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueueFilter",
  components: {
    QueueFilterHelp,
  },
  mixins: [buttonSizeMixin],
  props: {
    queueName: { type: String, default: '' },
    baseUrl: { type: String, required: true },
  },
  emits: [
    "updateArticleListFilter",
  ],
  setup(props) {
    const { queueStore } = useQueues(props);

    const showFilterHelp = ref(false);

    return {
      queueStore,
      showFilterHelp,
    }
  },
}
</script>
