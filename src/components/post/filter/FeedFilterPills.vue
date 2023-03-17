<template>
  <div class="feed-filter-pills pill-container">
    <div v-if="needsPagination()" class="filter-pills-pagination-buttons">
      <!-- first page button-->
      <button title="first" class="filter-pills-pagination-button" @click="firstPage">
        <span class="fa fa-angle-double-left"/>
      </button>
      <!-- previous page button -->
      <button title="previous" class="filter-pills-pagination-button" @click="previousPage">
        <span class="fa fa-angle-left"/>
      </button>
      <!-- next page button -->
      <button title="next" class="filter-pills-pagination-button" @click="nextPage">
        <span class="fa fa-angle-right"/>
      </button>
      <!-- last page button-->
      <button title="last" class="filter-pills-pagination-button" @click="lastPage">
        <span class="fa fa-angle-double-right"/>
      </button>
    </div>
    <div class="filter-pills-buttons">
      <button v-for="filterPill in this.getCurrentPage(this.allFilterPills)" :key="filterPill" 
        class="br-pill" 
        :class="{ selectedMode: filterPill.isSelected }" 
        :title="filterPill.label"
        @click="filterPill.invoke"
        :disabled="disabled">
        <img v-if="filterPill.image" :src="filterPill.image" loading="lazy" />
        {{ filterPill.label }}
      </button>
    </div>
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
  computed: {
    allFilterPills: function() {
      let filterPills = [
        {
          isSelected: this.lcSetContainsStr('UNREAD', this.feedFilterModes),
          invoke: () => this.$emit('unread'), 
          label: 'UNREAD',
        },
        {
          isSelected: this.lcSetContainsStr('READ_LATER', this.feedFilterModes),
          invoke: () => this.$emit('readLater'), 
          label: 'READ-LATER',
        },
        {
          isSelected: this.lcSetContainsStr('READ', this.feedFilterModes),
          invoke: () => this.$emit('read'), 
          label: 'READ',
        },
        {
          isSelected: this.lcSetContainsStr('PUBLISHED', this.feedFilterModes),
          invoke: () => this.$emit('published'), 
          label: 'STARRED',
        },
      ];
      for (let i = 0; i < this.allPostSubscriptions.length; i++) {
        let subscription = this.allPostSubscriptions[i];
        filterPills.push({
          isSelected: this.lcSetContainsStr(subscription.feedTitle, this.selectedFeedFilterSubscriptions),
          invoke: () => this.$emit('subscription', subscription.feedTitle),
          label: subscription.feedTitle,
          image: subscription.feedImageUrl, 
        });
      }
      for (let i = 0; i < this.allPostCategories.length; i++) {
        let category = this.allPostCategories[i];
        filterPills.push({
          isSelected: this.lcSetContainsStr(category, this.selectedFeedFilterSubscriptions),
          invoke: () => this.$emit('category', category),
          label: category 
        });
      }

      return filterPills;
    },
    totalPages: function() {
      let t = Math.ceil(this.allFilterPills.length / this.itemsPerPage);
      return t;
    },
  },
  methods: {
    // 
    // pagination 
    // 
    needsPagination() {
      return this.itemCount > this.itemsPerPage;
    },
    getCurrentPage(items) {
      if (items.length !== this.itemCount) {
        this.itemCount = items.length; 
        this.currentPage = 0;
      }
      let startIdx = this.currentPage * 10;
      let endIdx = startIdx + 10;
      return items.slice(startIdx, endIdx);
    },
    firstPage() {
      this.currentPage = 0;
    },
    nextPage() {
      let n = this.currentPage + 1;
      if (n === this.totalPages) {
        n -= 1;
      }
      this.currentPage = n;
    },
    previousPage() {
      let p = this.currentPage - 1;
      if (p < 0) {
        p = 0;
      }
      this.currentPage = p;
    },
    lastPage() {
      this.currentPage = this.totalPages - 1;
    },
    // lcStrEq is true IFF str1 and str2 are LC-EQ 
    lcStrEq(str1, str2) {
      return str1 && str2 && str1.toLowerCase() === str2.toLowerCase();
    },
    // lcSetContainsStr is true IFF str1 is contained in strSet 
    lcSetContainsStr(str1, strSet) {
      if (str1 && strSet) {
        for (let i = 0; i < strSet.length; i++) {
          if (this.lcStrEq(str1, strSet[i])) {
            return true;
          }
        }
      }
      return false;
    }
  },
  data() {
    return {
      itemsPerPage: 10,
      currentPage: 0,
      itemCount: 0,
    }
  }
}
</script>

<style scoped>
.feed-filter-pills {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-bottom: .75rem;
  justify-content: flex-start;
  align-items: center;
  max-height: 25svh;
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
  padding: .44rem .75rem;
  user-select: none;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  min-width: 3rem;
  min-height: 3rem;
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

.filter-pills-pagination-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  text-align: left;
  align-items: baseline;
  justify-content: flex-start;
  margin-top: .125rem;
  margin-bottom: .75rem;
  resize: none;
  width: 100%;
}

.filter-pills-pagination-button {
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.filter-pills-pagination-button:hover, .filter-pills-pagination-button:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.filter-pills-pagination-button:disabled {
  cursor: auto;
}

.filter-pills-pagination-button:hover:disabled {
  background-color: unset;
}

.filter-pills-pagination-button:last-child {
  border-radius: 0px 3px 3px 0px;
}

.filter-pills-buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: .75rem;
}
</style>
