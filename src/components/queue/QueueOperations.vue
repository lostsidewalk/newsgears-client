<template>
  <v-btn-group>
    <!-- new queue button -->
    <v-btn
      :size="buttonSize"
      :title="t('createNewQueue')"
      prepend-icon="fa-plus"
      :text="t('createNewQueue')"
      @click.stop="$emit('newQueue')"
    />
    <!-- upload OPML button -->
    <v-btn
      :size="buttonSize"
      :title="t('uploadOPML')"
      prepend-icon="fa-file"
      :text="t('uploadOPML')"
      @click.stop="$emit('uploadOpml')"
    />
    <v-btn 
      :size="buttonSize"
      :title="t('cardLayout')"
      prepend-icon="fa-bars"
      @click.stop="$emit('showQueueCards')"
    />
    <v-btn 
      :size="buttonSize"
      :title="t('listLayout')"
      prepend-icon="fa-table"
      @click.stop="$emit('showListLayout')" 
    />
  </v-btn-group>
</template>

<script>
import { useI18n } from 'vue-i18n';

import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
    mixins: [buttonSizeMixin],
    setup() {
        const { t } = useI18n();

        return {
            t,
        }
    }
}
</script>
