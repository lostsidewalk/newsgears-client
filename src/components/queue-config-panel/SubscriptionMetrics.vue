<template>
  <v-card>
    <v-card-title class="pa-4 text-center">
      {{ $t('subscriptionMetrics') }}
    </v-card-title>
    <v-card-subtitle>
      {{ title }}
    </v-card-subtitle>
    <v-card-text>
      <v-table
        class="ma-4 overflow-auto flex-grow-1" 
        style="white-space: nowrap;"
        fixed-header
      >
        <thead style="text-align: left;white-space: nowrap;">
          <th class="pa-1">
            {{ $t('timestamp') }}
          </th>
          <th class="pa-1">
            {{ $t('message') }}
          </th>
          <th class="pa-1">
            {{ $t('httpStatusLabel') }}
          </th>
          <th class="pa-1">
            {{ $t('httpRedirect') }}
          </th>
          <th class="pa-1">
            {{ $t('error') }}
          </th>
        </thead>
        <tbody style="text-align: left;white-space: nowrap;">
          <tr
            v-for="subscriptionMetric in subscriptionMetrics"
            :key="subscriptionMetric"
          >
            <td class="pa-1">
              {{ formatTimestamp(subscriptionMetric.importTimestamp) }}
            </td>
            <!-- imported/persisted/archived -->
            <td
              v-if="subscriptionMetric.importCt > 0 && subscriptionMetric.persisCt > 0 && subscriptionMetric.archiveCt > 0"
              class="pa-1"
            >
              {{ $t('importedPersistedAndArchived', { 
                importCt: subscriptionMetric.importCt, 
                persistCt: subscriptionMetric.persistCt,
                archiveCt: subscriptionMetric.archiveCt, 
              }) }}
            </td>
            <!-- imported/persisted -->
            <td
              v-else-if="subscriptionMetric.importCt > 0 && subscriptionMetric.persisCt > 0"
              class="pa-1"
            >
              {{ $t('importedPersisted', { 
                importCt: subscriptionMetric.importCt, 
                persistCt: subscriptionMetric.persistCt,
              }) }}
            </td>
            <!-- imported/persisted -->
            <td
              v-else-if="subscriptionMetric.importCt > 0 && subscriptionMetric.archiveCt > 0"
              class="pa-1"
            >
              {{ $t('importedAndArchived', { 
                importCt: subscriptionMetric.importCt, 
                archiveCt: subscriptionMetric.archiveCt,  
              }) }}
            </td>
            <!-- imported/persisted -->
            <td
              v-else-if="subscriptionMetric.importCt > 0"
              class="pa-1"
            >
              {{ $t('importedNArticles', { 
                n: subscriptionMetric.importCt, 
              }) }}
            </td>
            <!-- HTTP status -->
            <td class="pa-1">
              {{ $t('httpStatus', { 
                httpStatusCode: subscriptionMetric.httpStatusCode, 
                httpStatusMessage: subscriptionMetric.httpStatusMessage 
              }) }}
            </td>
            <!-- HTTP redirect status -->
            <td class="pa-1">
              {{ subscriptionMetric.redirectFeedUrl ? 
                $t('redirectedTo', { 
                  redirectFeedUrl: subscriptionMetric.redirectFeedUrl, 
                  redirectHttpStatusCode: subscriptionMetric.redirectHttpStatusCode, 
                  redirectHttpStatusMessage: subscriptionMetric.redirectHttpStatusMessage
                }) : $t('NONE') }}
            </td>
            <!-- error -->
            <td
              class="pa-1"
              :class="{ 'error': subscriptionMetric.queryExceptionTypeMessage }"
            >
              {{ subscriptionMetric.queryExceptionTypeMessage ? 
                subscriptionMetric.queryExceptionTypeMessage : $t('NONE') }}
            </td>
          </tr>
        </tbody>
      </v-table>
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
import { useTimestamp } from '@/composable/useTimestamp.js';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "SubscriptionMetrics",
  mixins: [buttonSizeMixin],
  props: {
    title: { type: String, required: true },
    subscriptionMetrics: { type: Array, required: true },
  },
  emits: ["dismiss"],
  setup() {
    const { formatTimestamp } = useTimestamp();

    return {
      formatTimestamp 
    }
  }
}
</script>