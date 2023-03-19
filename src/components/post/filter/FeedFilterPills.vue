<template>
  <div class="feed-filter-pills pill-container">
    <!-- expression -->
    <div class="filter-expression-container">
      <div class="filter-expression">
        Viewing: <span class="filter-mode-expression">{{ this.filterModeExpression }}</span> articles in 
        <span class="filter-subscriptions-expression">{{ this.filterSubscriptionsExpression }}</span>
        <span v-if="this.selectedFeedFilterCategories.length > 0"> with categories in: <span class="filter-categories-expression">{{ this.selectedFeedFilterCategories.toString() }}</span></span>
      </div>
    </div>
    <!-- clear button -->
    <div class="clear-all-container">
      <button class="clear-all-button" @click="this.$emit('clearAll')"><i class="fa fa-eraser" /> &nbsp; Clear all filters.</button>
    </div>
    <!-- pills -->
    <div class="filter-pills-buttons">
      <button v-for="filterPill in this.allFilterPills" :key="filterPill" 
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
  emits: [
    "read",
    "unread",
    "readLater",
    "published",
    "subscription",
    "category",
    "clearAll",
  ],
  computed: {
    filterModeExpression: function() {
      let selectedMode = null;
      for (let i = 0; i < 4; i++) {
        if (this.allFilterPills[i].isSelected) {
          selectedMode = this.allFilterPills[i].label;
          break;
        }
      }
      return selectedMode;
    },
    filterSubscriptionsExpression() {
      let subscriptionNames = [];
      if (this.allPostSubscriptions.length === 1) {
        subscriptionNames.push(this.allPostSubscriptions[0].feedTitle);
      } else {
        for (let i = 0; i < this.selectedFeedFilterSubscriptions.length; i++) {
          subscriptionNames.push(this.selectedFeedFilterSubscriptions[i]);
        }
      }
       return (subscriptionNames.length > 0 ? (subscriptionNames.toString()) : '');
    },
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
          isSelected: this.lcSetContainsStr(category, this.selectedFeedFilterCategories),
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
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: flex-start;
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

.filter-pills-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .75rem;
  max-height: 25svh;
  overflow: auto;
}

@media (max-width: 639px) {
  .filter-pills-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 419px) {
  .filter-pills-buttons {
    grid-template-columns: repeat(1, 1fr);
  }
}

.filter-expression-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  font-family: Arial, Helvetica, sans-serif;
}

.filter-expression {
  word-break: break-word;
}

.filter-mode-expression {
  color: v-bind('theme.highlightedmessage');
}

.filter-subscriptions-expression {
  color: v-bind('theme.normalmessage');
}

.filter-categories-expression {
  color: v-bind('theme.highlightedmessage');
}

.clear-all-container {
  padding-bottom: .75rem;
}

.clear-all-button {
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

.clear-all-button:hover, .clear-all-button:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.clear-all-button:last-child {
  border-radius: 0px 3px 3px 0px;
}
</style>
