<template>
  <div class="feed-filter-pills pill-container">
    <button v-for="filterPill in this.allFilterPills" :key="filterPill" class="br-pill" :class="{ selectedMode: filterPill.isSelected }" 
      @click="filterPill.invoke"
      :disabled="disabled">
      <img v-if="filterPill.image" :src="filterPill.image" loading="lazy" />
      {{ filterPill.label }}
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
