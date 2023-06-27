<template>
  <DemoFeature
    title="Lost Sidewalk Software"
    :details="[
      $t('aboutLS_detail1'),
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
