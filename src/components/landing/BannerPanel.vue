<template>
  <div>
    <div class="banner-view">
      <h1>FeedGears RSS</h1>
      <i class="fa fa-rss fa-5x"></i>
      <button class="tab-label" @click="this.$router.push('/app')" accesskey="s">Get <i class="underline">S</i>tarted</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BannerPanel",
  props: [ "theme" ],
}
</script>

<style scoped>

.banner-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  font-family: 'Russo One';
  font-size: larger;
  margin-bottom: 2%;
}

.banner-view > h1 {
  translate: 0 100px;
  text-shadow: 1px 0px 1px rgb(224 224 224);
}

.banner-view > i {
  color: rgb(16,16,16);
  margin-bottom: 2%;
  text-shadow: 3px 3px 3px rgba(0,0,255,0.3);
}

.tab-label {
  text-align: center;
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  user-select: none;
  background-color: v-bind('theme.sectionbrighthighlight');
  color: v-bind('theme.logocolor');
}

.tab-label:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.underline {
  text-decoration: underline;
}
</style>
