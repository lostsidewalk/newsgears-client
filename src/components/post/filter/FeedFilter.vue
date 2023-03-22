<template>
  <div class="article-queue">
    <!-- feed filter label -->
    <label>ARTICLE QUEUE {{ '(' + this.queueLength + ')' }}</label>
    <div class="feed-filter">
      <!-- feed filter input -->
      <input id="feed-filter" 
        type="text" 
        placeholder="Filter" 
        @input="$emit('update:modelValue', $event.target.value)" 
        :value="inboundQueueFilter" 
        :disabled="disabled" />
      <div class="feed-filter-buttons">
        <!-- sort direction button -->
        <button class="feed-filter-button" @click="this.$emit('toggleSortOrder')" :disabled="disabled" aria-label="Toggle sort order">
          <span :class="'fa fa-arrow-' + (this.inboundQueueSortOrder === 'ASC' ? 'up' : 'down')" />
        </button>
        <!-- refresh feed button -->
        <button class="feed-filter-button" 
          @click="this.$emit('refreshFeeds')"
          :disabled="disabled" 
          aria-label="Refresh feeds">
          <span class="fa fa-refresh"/>
        </button>
        <!-- mark as read button -->
        <button class="feed-filter-button"
          @click.stop="this.$emit('markAsRead')"
          :disabled="disabled"
          title="Mark this queue as read">
          <span class="fa fa-eye"></span>
        </button>
        <!-- show feed filter pills button -->
        <button class="feed-filter-button" 
          @click="this.$emit('toggleFeedFilterPills')"
          :disabled="disabled" 
          aria-label="Show filter options">
          <span class="fa fa-expand"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeedFilter", 
  props: [
    "showFullInboundQueueHeader",
    "queueLength",
    "inboundQueueFilter",
    "inboundQueueSortOrder", 
    "showFeedFilterPills", 
    "disabled", 
    "theme"
  ],
  emits: [
    "toggleSortOrder",
    "refreshFeeds", 
    "markAsRead", 
    "toggleFeedFilterPills",
  ],
  components: {

  },
}
</script>

<style scoped>
.article-queue {
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 0px 0px 4px 4px;
  padding-top: .75rem;
  padding-bottom: .75rem;
  border-top: 0px;

  text-align: left;
  display: flex;
  flex-direction: column;
}

.feed-filter {
  text-align: left;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-start;
  margin-top: .125rem;
  resize: none;
}

.feed-filter input {
  padding: .44rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 4px 0px 0px 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  width: 100%;
}

.feed-filter input:hover, .feed-filter > input:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-filter > input:disabled {
  cursor: auto;
}

.feed-filter-buttons {
  padding-top: .75rem;
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.feed-filter-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.feed-filter-button:hover, .feed-filter-button:focus-visible {
  background: v-bind('theme.buttonhighlight');
}

.feed-filter-button:disabled {
  cursor: auto;
}

.feed-filter-button:hover:disabled {
  background-color: unset;
}

.feed-filter-button:last-child {
  border-radius: 0px 3px 3px 0px;
}
</style>