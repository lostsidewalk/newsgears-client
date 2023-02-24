<template>
  <div class="post-itunes-content">
    <img v-if="this.iTunes.imageUri" :src="this.iTunes.imageUri"
      class="post-itunes-content-image" />
    <div class="pill-container">
      <div class="br-pill-subdued" v-if="this.iTunes.author">AUTHOR: {{ this.iTunes.author }}</div>
      <div class="br-pill-subdued" v-if="this.iTunes.explicit">EXPLICIT</div>
      <div class="br-pill-subdued" v-for="keyword of this.iTunes.keywords" :key="keyword">{{ keyword }}</div>
      <div class="br-pill-subdued" v-if="this.iTunes.subTitle">SUBTITLE: {{ this.iTunes.subTitle }}</div>
      <div class="br-pill-subdued" v-if="this.iTunes.summary">SUMMARY: {{ this.iTunes.summary }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostITunes",
  props: ["iTunes", "theme"],
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
  font-size: smaller;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: .31rem;
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
  gap: .31rem;
  width: max-content;
  align-items: flex-start;
}

.br-pill-subdued {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: unset;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .31rem;
  user-select: none;
}

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
