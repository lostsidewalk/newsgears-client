<template>
  <v-card>
    <v-card-title class="pa-4 text-center">
      {{ $t('queryMetrics') }}
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
            v-for="queryMetric in queryMetrics"
            :key="queryMetric"
          >
            <td class="pa-1">
              {{ formatTimestamp(queryMetric.importTimestamp) }}
            </td>
            <td class="pa-1">
              {{ $t('importedNArticles', { n: queryMetric.persistCt }) }}
            </td>
            <!-- HTTP status -->
            <td class="pa-1">
              {{ $t('httpStatus', { 
                httpStatusCode: queryMetric.httpStatusCode, 
                httpStatusMessage: queryMetric.httpStatusMessage 
              }) }}
            </td>
            <!-- HTTP redirect status -->
            <td class="pa-1">
              {{ queryMetric.redirectFeedUrl ? 
                $t('redirectedTo', { 
                  redirectFeedUrl: queryMetric.redirectFeedUrl, 
                  redirectHttpStatusCode: queryMetric.redirectHttpStatusCode, 
                  redirectHttpStatusMessage: queryMetric.redirectHttpStatusMessage
                }) : $t('NONE') }}
            </td>
            <!-- error -->
            <td
              class="pa-1"
              :class="{ 'error': queryMetric.queryExceptionTypeMessage }"
            >
              {{ queryMetric.queryExceptionTypeMessage ? 
                queryMetric.queryExceptionTypeMessage : $t('NONE') }}
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
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "QueryMetrics",
  mixins: [buttonSizeMixin],
  props: {
    title: { type: String, required: true },
    queryMetrics: { type: Array, required: true },
  },
  emits: ["dismiss"],
  methods: {
    formatTimestamp(timestamp) {
      if (!timestamp) {
        return null;
      }
      try {
        let d = new Date(Date.parse(timestamp));
        return d.toLocaleString();
      } catch (error) {
        console.debug("Unable to format timestamp due to: " + error);
      }
    }
  }
}
</script>
