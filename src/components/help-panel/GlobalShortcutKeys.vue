<template>
  <v-card
    elevation="6"
    class="mb-4"
  >
    <v-card-title>{{ $t('globalShortcutKeys') }}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-table class="overflow-auto flex-grow-1">
              <thead style="text-align: left;white-space: nowrap;">
                <th class="pa-1">
                  {{ $t('key') }}
                </th>
                <th class="pa-1">
                  {{ $t('action') }}
                </th>
              </thead>
              <tbody>
                <tr
                  v-for="desc in helpModel.fromAnywhere"
                  :key="desc"
                >
                  <td class="pa-1">
                    <v-btn
                      :size="buttonSize" 
                      variant="tonal" 
                      :prepend-icon="desc.icon" 
                      :text="desc.key"
                    />
                  </td>
                  <td class="pa-1">
                    {{ desc.label }}
                  </td>
                </tr>
                <tr
                  v-for="desc in helpModel.aQueueIsSelected"
                  :key="desc"
                >
                  <td class="pa-1">
                    <v-btn
                      :size="buttonSize"   
                      variant="tonal" 
                      :prepend-icon="desc.icon" 
                      :text="desc.key"
                    />
                  </td>
                  <td class="pa-1">
                    {{ desc.label }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  mixins: [buttonSizeMixin],
  data() {
    return {
      helpModel: {
        fromAnywhere: [
          {
            label: this.$t('switchMode'),
            key: "ALT + L", // global accel 
          },
          {
            label: this.$t('logout'),
            key: "ALT + O", // global accel 
          },
          {
            label: this.$t('settings'),
            key: "ALT + T", // global accel 
          },
          {
            label: this.$t('uploadOPML'),
            key: "SHIFT + M", // global accel 
          },
          {
            label: this.$t('createNewQueue'),
            key: "SHIFT + Q" // key handler from anywhere 
          },
          {
            label: this.$t('refreshQueues'),
            key: "SHIFT + R" // key handler from anywhere 
          },
        ],
        aQueueIsSelected: [
          {
            label: this.$t('configureSelectedQueue'),
            key: "SHIFT + E", // key handler when queue is selected 
          },
          {
            label: this.$t('markSelectedQueueAsRead'),
            key: "SHIFT + A", // key handler when queue is selected 
          },
          {
            label: this.$t('deleteSelectedQueue'),
            key: "SHIFT + D", // key handler when queue is selected 
          },
          {
            label: this.$t('showReadLater'),
            key: "SHIFT + L", // key handler when queue is selected 
          },
          {
            label: this.$t('showRead'),
            key: "SHIFT + H", // key handler when queue is selected 
          },
          {
            label: this.$t('search'),
            key: "/", // key handler when queue is selected 
          },
        ],
      }
    }
  }
}
</script>
