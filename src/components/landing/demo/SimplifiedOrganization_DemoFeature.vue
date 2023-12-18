<template>
  <DemoFeature
    :title="$t('simplifiedOrganization')"
    :details="[
      $t('simplifiedOrganization_detail1'),
      $t('simplifiedOrganization_detail2'),
    ]"
  >
    <template #body>
      <v-card
        elevation="12"
        :class="mb16r"
      >
        <v-card-text>
          <v-img
            :src="'reader_' + (isDark ? 'dark' : 'light') + '_2.png'"
            :alt="$t('queuePageScreenshot')"
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
  name: "SimplifiedOrganizationDemoFeature",
  components: {
    DemoFeature, 
  },
  mixins: [spacingMixin],
  props: {
    isDark: { type: Boolean, default: false },
  }
}
</script>
