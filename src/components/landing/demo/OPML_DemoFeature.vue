<template>
  <DemoFeature
    :title="$t('opmlSupport')"
    :details="[
      $t('opmlSupport_detail1'),
      $t('opmlSupport_detail2'),
    ]"
  >
    <template #body>
      <v-card
        elevation="12"
        :class="mb16r"
      >
        <v-card-text>
          <v-img
            :src="'opml_upload_' + (isDark ? 'dark' : 'light') + '.png'"
            :alt="$t('opmlUploadScreenshot')"
          />
        </v-card-text>
      </v-card>
    </template>
  </DemoFeature>
</template>

<script>
import DemoFeature from './DemoFeature.vue';
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "OPMLDemoFeature",
  components: {
    DemoFeature, 
  },
  mixins: [spacingMixin],
  props: {
    isDark: { type: Boolean, default: false },
  }
}
</script>
