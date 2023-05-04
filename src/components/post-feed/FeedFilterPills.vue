<template>
  <div class="feed-filter-pills pill-container">
    <!-- pills -->
    <div class="filter-pills-buttons">
      <button v-for="filterPill in this.allFilterPills" :key="filterPill" 
        class="br-pill accessible-button" 
        :class="{ selectedMode: filterPill.isSelected }" 
        :title="filterPill.label"
        @click="filterPill.invoke"
        :disabled="disabled">
        <img v-if="filterPill.image" 
          :src="filterPill.image" 
          height="24" />
        {{ filterPill.label }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeedFilterPills",
  props: [
    "allFilterPills",
    "disabled", 
    "theme"
  ],
}
</script>

<style scoped>
.feed-filter-pills {
  margin-top: .56rem;
  margin-left: .56rem;
  margin-right: .56rem;
  justify-content: flex-start;
  align-items: center;
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: flex-start;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 4px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .44rem .75rem;
  user-select: none;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: max-content;
}

.br-pill:hover, .br-pill:focus-visible {
  border: 1px solid v-bind('theme.buttonborder');
}

.br-pill > img {
  max-height: 24px;
  max-width: 24px;
  padding-right: .44rem;
  object-fit: scale-down;
}

.selectedMode {
  color: v-bind('theme.buttonfg');
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.filter-pills-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: .75rem;
  max-height: 25svh;
}

@media (max-width: 639px) {
  .filter-pills-buttons {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 419px) {
  .filter-pills-buttons {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
