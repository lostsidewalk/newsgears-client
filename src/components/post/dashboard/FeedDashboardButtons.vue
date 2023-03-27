<template>
  <div>
    <!-- TODO: component -->
    <!-- queue config button -->
    <button v-if="this.selectedFeedId"
      class="header-button accessible-button" 
      @click.stop="this.$emit('configureFeed')" 
      :disabled="disabled" 
      :title="this.$t('manageSubscriptions')">
      {{ this.$t('manageSubscriptions') }} &nbsp; <span class="fa fa-wrench" />
    </button>
    <!-- upload OPML button -->
    <button class="header-button accessible-button" 
      @click.stop="this.$emit('uploadOpml')" 
      accesskey="m" 
      :disabled="disabled"
      :title="this.$t('uploadOPML')">
      {{ this.$t('uploadOPML') }} &nbsp; <span class="fa fa-file" />
    </button>
    <!-- delete queue button -->
    <button v-if="this.selectedFeedId"
      class="header-button accessible-button" 
      @click.stop="this.$emit('deleteFeed')" 
      :disabled="disabled" 
      :title="this.$t('deleteThisQueue')">
      {{ this.$t('deleteThisQueue') }} &nbsp; <span class="fa fa-trash" />
    </button>
    <!-- new queue button -->
    <button class="header-button accessible-button" 
      @click.stop="this.$emit('newFeed')" 
      accesskey="n" 
      :disabled="disabled"
      :title="this.$t('createNewQueue')">
      {{ this.$t('createNewQueue') }} &nbsp; <span class="fa fa-plus" />
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
</style>
