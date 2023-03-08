<template>
  <div class="tab-header">
    <!-- tab label -->
    <button 
      v-for="tab of tabModel" :key="tab" 
      class="tab-label" 
      :class="this.selectedTab === tab.name ? 'selected-tab-label' :''" 
      @click="selectTab(tab.name)"
      :disabled="disabled">
      <i v-if="tab.icon" :class="'fa fa-' + tab.icon + ' fa-1x'"/>
      {{ tab.description }}
    </button>
  </div>
</template>

<script>
export default {
  name: "TabHeader",
  props: [ "disabled", "theme", "selectedTab", "tabModel" ],
  emits: [ "selectTab" ],
  methods: {
    selectTab(tabName) {
      this.$emit('selectTab', tabName);
    }
  }
}
</script>

<style scoped>
.tab-header {
  display: flex;
  width: 100%;
  overflow-x: auto;
}

.tab-label {
  text-align: center;
  padding: 1rem;
  border-radius: 5px 5px 0px 0px;
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  user-select: none;
  background-color: v-bind('theme.sectionbrighthighlight');
  color: v-bind('theme.logocolor');
}

.tab-label:hover, .tab-label:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

/** has references */
.selected-tab-label {
  color: v-bind('theme.logobrightcolor');
  background-color: v-bind('theme.sectionbrighthighlight') !important;
}
</style>
