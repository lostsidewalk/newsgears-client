<template>
  <DemoFeature :title="$t('aboutNewsgears')">
    <template #body>
      <!-- accessibility / wcag -->
      <DemoFeature
        :title="$t('accessible')"
        elevation="12"
        :details="[
          $t('accessible_detail1'),
          $t('accessible_detail2'),
        ]"
      />
      <!-- mobile optimized -->
      <DemoFeature
        :title="$t('mobileOptimized')"
        :class="mt4r"
        elevation="12"
        :details="[
          $t('mobileOptimized_detail1'), 
          $t('mobileOptimized_detail2'), 
          $t('mobileOptimized_detail3')
        ]"
      />
      <!-- secure -->
      <DemoFeature
        :title="$t('secure')"
        :class="mt4r"
        elevation="12"
        :details="[
          $t('secure_detail1'),
          $t('secure_detail2'),
          $t('secure_detail3')
        ]"
      />
      <!-- internationalization/localization -->
      <DemoFeature
        :title="$t('localized')"
        :class="mt4r"
        elevation="12"
        :details="[
          $t('localized_detail1'),
        ]"
      />
      <!-- free as in beer -->
      <DemoFeature
        :title="$t('freeAsInBeer')"
        :class="mt4r"
        elevation="12"
        :details="[
          $t('freeAsInBeer_detail1'),
          $t('freeAsInBeer_detail2'), 
          $t('freeAsInBeer_detail3')
        ]"
      />
      <!-- self-hostable / pre-built containers -->
      <DemoFeature
        :title="$t('selfHostable')"
        :class="{ mt4r: true, mb16r: true }"
        elevation="12"
        :details="[
          $t('selfHostable_detail1'), 
          $t('selfHostable_detail2'),
        ]"
      />
    </template>
  </DemoFeature>
</template>

<script>
import DemoFeature from './DemoFeature.vue';
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "MiscDemoFeature",
  components: {
    DemoFeature, 
  },
  mixins: [spacingMixin],
}
</script>
