<template>
  <v-btn
    :size="buttonSize"  
    accesskey="b"
    :title="$t('goBack')" 
    prepend-icon="fa-arrow-left"
    :text="$t('goBack')"
    @click="$router.back()"
  />
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "GoBack",
  mixins: [buttonSizeMixin], 
}
</script>
