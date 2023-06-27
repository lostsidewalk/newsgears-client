<template>
  <DemoFeature
    :title="$t('apiAccess')"
    :details="[
      $t('comingSoon'),
    ]"
  />
</template>

<script>
import DemoFeature from './DemoFeature.vue';

export default {
  components: {
    DemoFeature, 
  },
}
</script>
