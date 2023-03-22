<template>
  <div>
    <!-- add subscription button -->
    <button v-if="this.selectedFeedId"
      class="header-button" 
      @click.stop="this.$emit('rssAtomUrlQuickAdd')" 
      :disabled="disabled" 
      title="Add a new subscription to this feed">
      Add <i class="underline">s</i>subscription &nbsp; <span class="fa fa-rss" />
    </button>
    <!-- queue config button -->
    <button v-if="this.selectedFeedId"
      class="header-button" 
      @click.stop="this.$emit('configureFeed')" 
      :disabled="disabled" 
      title="Configure this feed">
      Configur<i class="underline">e</i> this queue &nbsp; <span class="fa fa-wrench" />
    </button>
    <!-- new queue button -->
    <button class="header-button" @click.stop="this.$emit('newFeed')" accesskey="n" :disabled="disabled">
      <i class="underline">N</i>ew queue &nbsp; <span class="fa fa-plus" />
    </button>
    <!-- upload OPML button -->
    <button class="header-button" @click.stop="this.$emit('uploadOpml')" accesskey="m" :disabled="disabled">
      Upload OP<i class="underline">M</i>L &nbsp; <span class="fa fa-file" />
    </button>
    <!-- delete queue button -->
    <button v-if="this.selectedFeedId"
      class="header-button" 
      @click.stop="this.$emit('deleteFeed')" 
      :disabled="disabled" 
      title="Delete this feed">
      Delete this queue &nbsp; <span class="fa fa-trash" />
    </button>
  </div>

</template>

<script>
export default {
  name: "FeedDashboardButtons", 
  props: ["selectedFeedId", "disabled", "theme"],
  emits: ["rssAtomUrlQuickAdd", "configureFeed", "newFeed", "uploadOpml", "deleteFeed" ],
}
</script>

<style scoped> 
.header-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 4px;
  margin-top: .75rem;
  margin-right: .75rem;
  text-align: center;
  user-select: none;
  min-width: 3rem;
  min-height: 3rem;
}

.header-button:hover, .header-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.header-button:disabled {
  cursor: auto;
}

.header-button:disabled:hover {
  background-color: unset;
}

.underline {
  text-decoration: underline;
}
</style>
