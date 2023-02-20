<template>
  <button class="go-back" @click="this.goBack()" accesskey="b" :disabled="disabled">
    <span class="go-back-text">
      <span class="fa fa-arrow-left"/>
      &nbsp; <i class="underline">G</i>o back.
    </span>
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
  z-index: 99999;
}

.go-back-text {
  cursor: auto;
}

.go-back-text:hover {
  cursor: pointer;
}

.underline {
  text-decoration: underline;
}
</style>
