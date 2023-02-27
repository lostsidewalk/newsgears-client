<template>
  <div class="feedgears-logo">
    FeedGears RSS
  </div>
</template>

<script>
export default {
  name: "FeedGearsLogo",
  props: [ "theme" ], 
}
</script>

<style scoped>
.feedgears-logo {
  border: 1px solid transparent;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  margin: .56rem;
}

.feedgears-logo:hover, .feedgears-focus {
  border: 1px solid dimgrey;
}
</style>
