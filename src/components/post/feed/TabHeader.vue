<template>
  <div class="tab-header">
    <!-- tab label -->
    <button 
      v-for="tab of tabModel" :key="tab" 
      class="tab-label" 
      :class="this.selectedTab === tab.name ? 'selected-tab-label' :''" 
      @click="selectTab(tab.name)">
      <i v-if="tab.icon" :class="'fa fa-' + tab.icon + ' fa-1x'"/>
      {{ tab.description }}
    </button>
  </div>
</template>

<script>
export default {
  name: "TabHeader",
  props: [ "inTransit", "theme", "selectedTab", "tabModel" ],
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
}

.tab-label {
  width: 20%;
  text-align: center;
  padding: 15px;
  border-radius: 5px 5px 0px 0px;
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  user-select: none;
  background-color: v-bind('theme.sectionbrighthighlight');
  font-family: "Russo One", system-ui, sans-serif;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
}

.tab-label:hover {
  background-color: v-bind('theme.buttonhighlight');
}

/** has references */
.selected-tab-label {
  color: v-bind('theme.logobrightcolor');
  background-color: v-bind('theme.sectionbrighthighlight') !important;
}
</style>
