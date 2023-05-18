<template>
  <v-btn @click="this.goBack()" 
    size="small"
    accesskey="b" 
    :title="this.$t('goBack')"
    prepend-icon="fa-arrow-left"
    :text="this.$t('goBack')" />
</template>

<script>
export default {
  name: "GoBack",
  props: [ "theme" ],
  methods: {
    goBack() {
      this.$router.back();
    }
  }
}
</script>
