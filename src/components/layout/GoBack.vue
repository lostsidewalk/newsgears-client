<template>
  <v-btn
    :size="xs ? 'x-small' : 'small'"  
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
  computed: {
    xs: function() {
      return this.$vuetify.display.xs;
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    }
  },
}
</script>
