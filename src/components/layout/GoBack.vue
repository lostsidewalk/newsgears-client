<template>
  <v-btn
    :size="buttonSize"  
    accesskey="b"
    :title="$t('goBack')" 
    prepend-icon="fa-arrow-left"
    :text="$t('goBack')"
    @click="goBack()"
  />
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "GoBack",
  mixins: [buttonSizeMixin], 
  methods: {
    goBack() {
      this.$router.back();
    }
  },
}
</script>
