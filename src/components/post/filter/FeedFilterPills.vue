<template>
  <div class="feed-filter-pills pill-container">
    <!-- expression -->
    <div class="filter-expression-container">
      <!-- TODO: interpolated string -->
      <div class="filter-expression" v-auto-animate>
        {{ this.$t('viewingColon')}} <span class="filter-mode-expression">{{ this.filterModeExpression }}</span> articles in 
        <span class="filter-subscriptions-expression">{{ this.filterSubscriptionsExpression }}</span>
        <span v-if="this.selectedFeedFilterCategories.length > 0"> with categories in: 
          <span class="filter-categories-expression">{{ this.selectedFeedFilterCategories.join(', ') }}</span>
        </span>.
      </div>
    </div>
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
    "toggleSubscription",
    "toggleCategory",
    "resetFilterDefaults",
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
        let t = this.allPostSubscriptions[0].title;
        if (t) {
          subscriptionNames.push(t.value);
        }
      } else if (this.selectedFeedFilterSubscriptions.length > 0) {
        for (let i = 0; i < this.selectedFeedFilterSubscriptions.length; i++) {
          let t = this.selectedFeedFilterSubscriptions[i].title;
          if (t) {
            subscriptionNames.push(t.value);
          }
        }
      } else {
        subscriptionNames.push(this.$t('allSubscriptions'));
      }
      return (subscriptionNames.length > 0 ? (subscriptionNames.join(', ')) : '');
    },
    allFilterPills: function() {
      let filterPills = [
        {
          isSelected: this.lcSetContainsStr('UNREAD', this.feedFilterModes),
          invoke: () => this.$emit('unread'), 
          label: this.$t('unread'),
        },
        {
          isSelected: this.lcSetContainsStr('READ_LATER', this.feedFilterModes),
          invoke: () => this.$emit('readLater'), 
          label: this.$t('readLater'),
        },
        {
          isSelected: this.lcSetContainsStr('READ', this.feedFilterModes),
          invoke: () => this.$emit('read'), 
          label: this.$t('read'),
        },
        {
          isSelected: this.lcSetContainsStr('PUBLISHED', this.feedFilterModes),
          invoke: () => this.$emit('published'), 
          label: this.$t('starred'),
        },
      ];
      if (this.allPostSubscriptions.length > 1) {
        for (let i = 0; i < this.allPostSubscriptions.length; i++) {
          let subscription = this.allPostSubscriptions[i];
          let subscriptionLabel = null;
          let title = subscription.title;
          if (title) {
            subscriptionLabel = title.value;
          } else {
            subscriptionLabel = subscription.feedUrl;
          }
          filterPills.push({
            isSelected: this.setContains(subscription, this.selectedFeedFilterSubscriptions),
            invoke: () => this.$emit('toggleSubscription', subscription),
            label: subscriptionLabel,
            image: subscription.feedImageUrl, 
          });
        }
      }
      if (this.allPostCategories.length > 1) {
        for (let i = 0; i < this.allPostCategories.length; i++) {
          let category = this.allPostCategories[i];
          filterPills.push({
            isSelected: this.lcSetContainsStr(category, this.selectedFeedFilterCategories),
            invoke: () => this.$emit('category', category),
            label: category 
          });
        }
      }

      return filterPills;
    },
    totalPages: function() {
      let t = Math.ceil(this.allFilterPills.length / this.itemsPerPage);
      return t;
    },
  },
  methods: {
    // setContains is true IFF obj1 is contained in objSet 
    setContains(obj1, objSet) {
      if (obj1 && objSet) {
        for (let i = 0; i < objSet.length; i++) {
          if (obj1 === objSet[i]) {
            return true;
          }
        }
      }
      return false;
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
  border-radius: 4px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .44rem .75rem;
  user-select: none;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  grid-template-columns: repeat(5, 1fr);
  gap: .75rem;
  max-height: 25svh;
  overflow: auto;
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
  color: v-bind('theme.highlightedmessage');
}

.filter-categories-expression {
  color: v-bind('theme.highlightedmessage');
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
