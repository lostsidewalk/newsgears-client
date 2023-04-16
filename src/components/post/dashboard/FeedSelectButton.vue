<template>
  <button class="feed-select" 
    :value="feed.value" 
    :key="feed.value" 
    :disabled="disabled">
    <div class="feed-select-underlay">
      <!-- feed name -->
      <label class="feed-select-label">
        {{ feed.label }}
      </label>
      <!-- card -->
      <!-- TODO: component -->
      <div class="feed-image-wrapper">
        <img v-if="feed.imgSrc" 
          class="feed-image" 
          :src="'data:image/png;base64,' + feed.imgSrc" 
          :alt="this.$t('queueLogoImage')" 
          height="35">
        <img v-else 
          class="feed-image" 
          src="feedgears.png" 
          :alt="this.$t('queueLogoImage')" 
          height="35">
        <div class="feed-info-wrapper">
          <label class="feed-info-label">
            <span class="fa fa-eye" /> {{ this.inboundCount }}
          </label>
          <label class="feed-info-label">
            <span class="fa fa-star" /> {{ this.publishedCount }}
          </label>
        </div>
      </div>
      <span v-if="(!this.feed.rssAtomFeedUrls || this.feed.rssAtomFeedUrls.length === 0)">
        {{ this.$t('zeroSubscriptions') }}
      </span>
    </div>
  </button>
</template>

<script>
export default {
  name: "FeedSelectButton",
  props: ["feed", "feedUrl", "inboundCount", "publishedCount", "disabled", "theme"],
}
</script>

<style scoped>
/** has references */
.feed-select {
  display: block !important;
  text-align: left !important;
  color: v-bind('theme.buttonfg');
  padding: .44rem;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
  align-self: start;
  user-select: none;
  z-index: 0;
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  width: 100%;
}

/** has references */
.feed-select:hover, .feed-select:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.feed-select-underlay {
  z-index: 1;
  cursor: pointer;
}

.feed-select-label {
  font-family: "Russo One", system-ui, sans-serif;
  overflow-wrap: anywhere;
  color: v-bind('theme.logocolor');
  cursor: pointer;
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
}

.feed-image-wrapper {
  display: flex;
  flex-direction: row;
  padding-top: .125rem;
  padding-bottom: .125rem;
  cursor: pointer;
}

.feed-info-wrapper {
  flex-direction: row;
  display: flex;
  padding-left: .44rem;
  cursor: pointer;
  align-items: flex-start;
}

.feed-info-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: .44rem;
  gap: .44rem;
  overflow-wrap: break-word;
  word-break: break-word;
}

.feed-info-label > span {
  padding-right: .44rem;
  word-wrap: break-word;
  word-break: keep-all;
}

.feed-image {
  border: 1px solid transparent;
  border-radius: 4px;
  width: 35px;
  height: 35px;
  max-width: 35px;
  max-height: 35px;
  display: inline-block; 
  background-size: cover; 
  background-position: center center;
  background-repeat: no-repeat;
  align-self: stretch;
}
</style>
