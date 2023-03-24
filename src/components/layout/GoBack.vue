<template>
  <button class="go-back" @click="this.goBack()" accesskey="b" :disabled="disabled">
    <span class="fa fa-arrow-left" />&nbsp; {{ this.$t('goBack') }}
  </button>
</template>

<script>
export default {
  name: "GoBack",
  props: [ "disabled", "theme" ],
  methods: {
    goBack() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>
.go-back {
  color: v-bind('theme.subduedmessage');
  text-align: left;
  margin-top: 3.125rem;
  margin-left: 1.56rem;
  display: inline;
  float: left;
  user-select: none;
  position: relative;
  background-color: unset;
  border: unset;
  cursor: pointer;
}

.underline {
  text-decoration: underline;
}
</style>
