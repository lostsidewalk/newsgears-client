<template>
  <div class="post-itunes-content">
    <img v-if="this.iTunes.imageUri" :src="this.iTunes.imageUri"
      class="post-itunes-content-image" />
    <div class="pill-container">
      <div class="br-pill" v-if="this.iTunes.author">AUTHOR: {{ this.iTunes.author }}</div>
      <div class="br-pill" v-if="this.iTunes.explicit">EXPLICIT</div>
      <div class="br-pill" v-for="keyword of this.iTunes.keywords" :key="keyword">{{ keyword }}</div>
      <div class="br-pill" v-if="this.iTunes.subTitle">SUBTITLE: {{ this.iTunes.subTitle }}</div>
      <div class="br-pill" v-if="this.iTunes.summary">SUMMARY: {{ this.iTunes.summary }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostITunes",
  props: ["iTunes", "inTransit", "theme"],
  components: { },
  mounted() {
    console.log("post-itunes mounted: iTunes=" + JSON.stringify(this.iTunes));
  },
  methods: {
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
.post-itunes-content {
  /* user-select: none; */
  width: 100%;
  font-size: small;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 5px;
}

.post-itunes-content > span:hover {
  /* cursor: pointer; */
  text-decoration: underline;
}

.post-itunes-content-wrapper {

}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-flow: wrap;
  gap: 5px;
  overflow-x: auto;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  /* cursor: pointer; */
  border-radius: 3px;
  color: v-bind('theme.buttonfg');
  padding: 5px;
  user-select: none;
}

/* .br-pill:hover {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonhighlight') !important;
} */

.collapsed {
  display: none;
}

.post-itunes-content-image {
  max-width: 70px;
  max-height: 70px;
  display: inline-block; 
  background-size: cover; 
  background-position: center center;
  background-repeat: no-repeat;
  align-self: stretch;
}
</style>
