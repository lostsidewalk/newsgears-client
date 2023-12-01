<template>
  <v-sheet
    class="queue-container d-flex flex-column rounded"
  >
    <v-alert
      info
    >
      {{ t('noArticlesInThisQueue') }}
    </v-alert>
    <!-- add subscription -->
    <v-card
      elevation="1"
      @click="$emit('openQueueConfigPanel', { queueId: queueStore.selectedQueueId })"
    >
      <v-card-title>
        <v-icon icon="fa-link" />
        {{ t('clickHereToAddANewSubscription') }}
      </v-card-title>
      <v-divider />
      <v-card-text>
        {{ t('clickHereToAddANewSubscription_detail') }}
      </v-card-text>
    </v-card>
    <!-- upload OPML -->
    <v-card
      elevation="1"
      @click="$emit('uploadOpml')"
    >
      <v-card-title>
        <v-icon icon="fa-file" />
        {{ t('clickHereToUploadOPML') }}
      </v-card-title>
      <v-divider />
      <v-card-text>
        {{ t('clickHereToUploadOPML_detail') }}
      </v-card-text>
      <v-card-text>
        {{ t('clickHereToUploadOPML_detail1') }}
      </v-card-text>
    </v-card>
    <!-- browse catalog -->
    <!-- <v-card
          elevation="1"
          @click="$emit('clicked')"
        >
          <v-card-title>
            <v-icon icon="fa-book" />
            {{ $t('clickHereToBrowseCatalog') }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            {{ $t('clickHereToBrowseCatalog_detail') }}
          </v-card-text>
        </v-card> -->
  </v-sheet>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { useQueues } from '@/composable/useQueues';

export default {
    props: {
        baseUrl: { type: String, required: true },
    },
    setup(props) {
        const { t } = useI18n();
        const { queueStore } = useQueues(props);

        return {
            t,
            queueStore,
        }
    }    
}
</script>

<style scoped>
.queue-container {
  background-color: transparent;
  gap: 1rem;
}
</style>
