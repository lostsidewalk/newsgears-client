<template>
  <div class="feed-filter-pills pill-container">
    <!-- post status filter pills -->
    <button class="br-pill" :class="{ selectedMode: lcSetContainsStr('UNREAD', this.feedFilterModes) }" 
      @click="this.$emit('unread')"
      :disabled="disabled">
        UNREAD
    </button>
    <button class="br-pill" :class="{ selectedMode: lcSetContainsStr('READ_LATER', this.feedFilterModes) }" 
      @click="this.$emit('readLayer')"
      :disabled="disabled">
        READ-LATER
    </button>
    <button class="br-pill" :class="{ selectedMode: lcSetContainsStr('READ', this.feedFilterModes) }" 
      @click="this.$emit('read')"
      :disabled="disabled">
        READ
    </button>
    <button class="br-pill" :class="{ selectedMode: lcSetContainsStr('PUBLISHED', this.feedFilterModes) }" 
      @click="this.$emit('published')"
      :disabled="disabled">
        STARRED
    </button>
    <button v-for="subscription of this.allPostSubscriptions" :key="subscription"
      class="br-pill" :class="{ selectedMode: lcSetContainsStr(subscription.feedTitle, this.selectedFeedFilterSubscriptions)}" 
      @click="this.$emit('subscription', subscription.feedTitle)"
      :disabled="disabled || Object.keys(this.allPostSubscriptions).length === 1">
        <img :src="subscription.feedImageUrl" loading="lazy" />
        {{ subscription.feedTitle }}
    </button>
    <button v-for="category of this.allPostCategories" :key="category"
      class="br-pill" :class="{ selectedMode: lcSetContainsStr(category, this.selectedFeedFilterCategories)}"
      @click="this.$emit('category', category)"
      :disabled="disabled ">
        {{ category }}
    </button>
  </div>
</template>

<script>
export default {
  name: "FeedFilterPills",
  props: [
    "feedFilterModes", 
    "allPostSubscriptions",
    "selectedFeedFilterSubscriptions",
    "allPostCategories", 
    "selectedFeedFilterCategories",
    "disabled", 
    "theme"
  ],
}
</script>

<style scoped>
.feed-filter-pills {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-bottom: .75rem;
  justify-content: flex-start;
  align-items: center;
  max-height: 25vh;
  overflow: auto;
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-wrap: wrap;
  gap: .44rem;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .44rem 1.25rem;
  user-select: none;
  min-width: 3rem;
  min-height: 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.br-pill:hover, .br-pill:focus-visible {
  border: 1px solid v-bind('theme.buttonborder');
}

.br-pill > img {
  max-height: 24px;
  max-width: 24px;
  padding-right: .44rem;
}

.selectedMode {
  color: v-bind('theme.buttonfg');
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.buttonhighlight') !important;
}

</style>
