<template>
  <div class="catalog">
    <div class="feed" v-for="feed in this.catalog" :key="feed">
      {{ feed.label }}
    </div>
  </div>
</template>

<script>

const catalog = {};

export default {
  name: "FeedCatalogSearch",
  data() {
    return {
      catalog: catalog,
    }
  }
}
</script>

<style scoped>

.catalog {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.feed {
  border: 1px solid black;
  padding: 1rem;
}
</style>
