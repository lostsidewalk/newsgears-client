<template>
  <div class="go-back" @click="this.goBack()">
    <span class="go-back-text">
      <span class="fa fa-arrow-left"/>
      &nbsp; Go back.
    </span>
  </div>
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

<style scoped>
.go-back {
  color: v-bind('theme.subduedmessage');
  text-align: left;
  margin-top: 50px;
  margin-left: 25px;
  display: inline;
  float: left;
  user-select: none;
}

.go-back-text {
  cursor: auto;
}

.go-back-text:hover {
  cursor: pointer;
}
</style>
