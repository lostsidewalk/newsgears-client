<template>
  <v-btn
    size="small" 
    accesskey="b"
    :title="$t('goBack')" 
    prepend-icon="fa-arrow-left"
    :text="$t('goBack')"
    @click="goBack()"
  />
</template>

<script>
export default {
  name: "GoBack",
  methods: {
    goBack() {
      this.$router.back();
    }
  }
}
</script>
