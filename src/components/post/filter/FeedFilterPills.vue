<template>
  <div class="feed-filter-pills pill-container">
    <!-- clear button -->
    <div class="reset-container">
      <button class="reset-button accessible-button" @click="this.$emit('resetFilterDefaults')">
        <i class="fa fa-undo" /> &nbsp; {{ this.$t('resetToDefault') }}
      </button>
    </div>
    <!-- pills -->
    <div class="filter-pills-buttons">
      <button v-for="filterPill in this.allFilterPills" :key="filterPill" 
        class="br-pill accessible-button" 
        :class="{ selectedMode: filterPill.isSelected }" 
        :title="filterPill.label"
        @click="filterPill.invoke"
        :disabled="disabled">
        <img v-if="filterPill.image" :src="filterPill.image" />
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
  emits: [
    "resetFilterDefaults",
  ],
}
</script>

<style scoped>
.feed-filter-pills {
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

.reset-container {
  padding-bottom: .75rem;
}

.reset-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  border-radius: 4px;
  text-align: center;
}

.reset-button:hover, .reset-button:focus-visible {
  background: v-bind('theme.buttonhighlight');
}

.reset-button:last-child {
  border-radius: 0px 3px 3px 0px;
}
</style>
