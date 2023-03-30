<template>
  <div class="collections">
    <div class="collection" v-for="collection in this.collections" :key="collection">
      {{ collection.label }}
    </div>
  </div>
</template>

<script>

const collections = {
  topNews: {
    label: "Top News",
    
  },
  investing: {
    label: "Investing",
  },
  technology: {
    label: "Technology",
  },
  business: {
    label: "Business",
  },
  science: {
    label: "Science",
  },
  creative: {
    label: "Creative",
  },
  lifestyle: {
    label: "Lifestyle",
  },
}

export default {
  name: "FeedCollectionsBrowser",
  data() {
    return {
      collections: collections,
    }
  }
}
</script>

<style scoped>

.collections {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.collection {
  border: 1px solid black;
  padding: 1rem;
}
</style>
