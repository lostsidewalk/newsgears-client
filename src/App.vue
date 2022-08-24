<template>
  <FeedBanner />
  <PostFeed :baseUrl="this.baseUrl"/>
</template>

<script>
import FeedBanner from "./components/FeedBanner.vue";
import PostFeed from "./components/PostFeed.vue";

export default {
  name: "App",
  components: {
    PostFeed,
    FeedBanner
  },
  props: ["baseUrl", "admin"],
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: rgb(64,64,64);
  margin-top: 60px;
  font-family: "Roboto Mono", sans-serif;
  font-weight: normal;
  font-size: smaller;
}
</style>
