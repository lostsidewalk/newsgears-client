<template>
  <div>
    <div class="demo-view">
      <div class="background" />
      <div class="tabs">
        <button class="tab-label" @click="this.activeTab=1">{{ this.$t('rssAtomFeeds') }}</button>
        <button class="tab-label" @click="this.activeTab=2">{{ this.$t('iTunesPodcasts') }}</button>
        <button class="tab-label" @click="this.activeTab=3">{{ this.$t('youtube') }}</button>
        <button class="tab-label" @click="this.activeTab=4">{{ this.$t('reddit') }}</button>
      </div>
      <div v-show="this.activeTab === 1" class="tab-panel">
        <img src="demo1.png" :alt="this.$t('queuePageScreenshot')">
      </div>
      <div v-show="this.activeTab === 2" class="tab-panel">
        <!-- <img src="demo2.png" :alt="this.$t('queuePageScreenshot')"> -->
      </div>
      <div v-show="this.activeTab === 3" class="tab-panel">
        <!-- <img src="demo3.png" :alt="this.$t('queuePageScreenshot')"> -->
      </div>
      <div v-show="this.activeTab === 4" class="tab-panel">
        <!-- <img src="demo4.png" :alt="this.$t('queuePageScreenshot')"> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DemoPanel",
  props: [ "theme" ],
  data() {
    return {
      activeTab: 1,
    }
  }
}
</script>

<style scoped>
.demo-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 4%;
  margin-right: 4%;
}

.tabs {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 2%;
  margin-bottom: 2%;
  overflow: auto;
}

.tab-label {
  text-align: center;
  padding: 1rem;
  border-radius: 4px 5px 0px 0px;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  user-select: none;
  background-color: v-bind('theme.sectionbrighthighlight');
  color: v-bind('theme.logocolor');
}

.tab-label:hover, .tab-label:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.tab-panel {
  border: 1px solid transparent;
  overflow: auto;
  width: 100%;
}

.tab-panel > img {
  border-radius: 4px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  width: 75%;
  height: auto;
  object-fit: cover;
}
</style>
