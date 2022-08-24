<template>
  <div class="feed-banner">NewsGears</div>
  <div class="feed-sub-banner">v1.0a http://github.com/meharris-bnr/newsgears-client</div>
</template>

<script>
export default {
  name: "FeedBanner",
  data() {
    return {
    };
  },
}
</script>

<style scoped>
.feed-banner {
  font-family: "Russo One", sans-serif;
  font-weight: bold;
  font-size: xxx-large;
  color: burlywood;
  text-shadow: 2px 2px 2px rgb(255 0 0 / 50%);
  padding-top: 50px;
}

.feed-sub-banner {
  font-weight: normal;
  font-size: smaller;
  color: paleturquoise;
  margin-bottom: 50px;
}
</style>