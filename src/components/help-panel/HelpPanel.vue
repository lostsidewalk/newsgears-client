<template>
  <div class="modal-container">
    <div class="modal-body">
      <!-- global -->
      <h3 class="view-header-no-count">{{ this.$t('globalShortcutKeys') }}</h3>
      <div class="keyboard-shortcut-container">
        <div class="keyboard-shortcut-desc" v-for="desc in this.helpModel.fromAnywhere" :key="desc">
          <span class="keyboard-label-wrapper">
            {{ desc.label }}
          </span>
          <div class="keyboard-key-wrapper">
            <div class="keyboard-key">
              <i v-if="desc.icon" :class="'fa ' + desc.icon" />
              <span v-if="desc.key">{{ desc.key }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- queue selected -->
      <h3 class="view-header-no-count">{{ this.$t('whenAQueueIsSelected') }}</h3>
      <div class="keyboard-shortcut-container">
        <div class="keyboard-shortcut-desc" v-for="desc in this.helpModel.aQueueIsSelected" :key="desc">
          <span class="keyboard-label-wrapper">
            {{ desc.label }}
          </span>
          <div class="keyboard-key-wrapper">
            <div class="keyboard-key">
              <i v-if="desc.icon" :class="'fa ' + desc.icon" />
              <span v-if="desc.key">{{ desc.key }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- post selected -->
      <h3 class="view-header-no-count">{{ this.$t('whenAPostIsSelected') }}</h3>
      <div class="keyboard-shortcut-container">
        <div class="keyboard-shortcut-desc" v-for="desc in this.helpModel.aPostIsSelected" :key="desc">
          <span class="keyboard-label-wrapper">
            {{ desc.label }}
          </span>
          <div class="keyboard-key-wrapper">
            <div class="keyboard-key">
              <i v-if="desc.icon" :class="'fa ' + desc.icon" />
              <span v-if="desc.key">{{ desc.key }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelpPanel",
  props: ["theme"],
  data() {
    return {
      helpModel: {
        fromAnywhere: [
          {
            label: this.$t('switchModeAriaLabel'),
            key: "ALT + L", // global accel 
          },
          {
            label: this.$t('logoutArialLabel'),
            key: "ALT + O", // global accel 
          },
          {
            label: this.$t('goToSettingsAriaLabel'),
            key: "ALT + T", // global accel 
          },
          {
            label: this.$t('uploadOPML'),
            key: "ALT + M", // global accel 
          },
          {
            label: this.$t('cycleGridLayoutAriaLabel'),
            key: "ALT + G", // global accel 
          },
          {
            label: this.$t('cycleTableLayoutAriaLabel'),
            key: "ALT + B", // global accel 
          },
          {
            label: this.$t('toggleDistractions'),
            key: "ALT + Z", // global accel 
          },
          {
            label: this.$t('createNewQueue'),
            key: "SHIFT + Q" // key handler from anywhere 
          },
          {
            label: this.$t('refreshQueues'),
            key: "SHIFT + R" // key handler from anywhere 
          },
        ],
        aQueueIsSelected: [
          {
            label: this.$t('configureSelectedQueue'),
            key: "SHIFT + E", // key handler when queue is selected 
          },
          {
            label: this.$t('markSelectedQueueAsRead'),
            key: "SHIFT + A", // key handler when queue is selected 
          },
          {
            label: this.$t('addSubscriptionToSelectedQueue'),
            key: "SHIFT + S", // key handler when queue is selected 
          },
          {
            label: this.$t('showStarred'),
            key: "SHIFT + T", // key handler when queue is selected 
          },
          {
            label: this.$t('showReadLater'),
            key: "SHIFT + L", // key handler when queue is selected 
          },
          {
            label: this.$t('showRead'),
            key: "SHIFT + H", // key handler when queue is selected 
          },
          {
            label: this.$t('search'),
            key: "/", // key handler when queue is selected 
          },
        ],
        aPostIsSelected: [
          {
            label: this.$t('goToPreviousPost'),
            icon: "fa-arrow-up", // key handler when post is selected 
          },
          {
            label: this.$t('goToNextPost'),
            icon: "fa-arrow-down", // key handler when post is selected 
          },
          {
            label: this.$t('goToFirstPost'),
            key: "HOME", // key handler when post is selected 
          },
          {
            label: this.$t('goToLastPost'),
            key: "END", // key handler when post is selected 
          },
          {
            label: this.$t('starSelectedPost'),
            key: "S", // key handler when post is selected 
          },
          {
            label: this.$t('toggleReadStatusSelectedPost'),
            key: "M", // key handler when post is selected 
          },
          {
            label: this.$t('openOriginalArticleSelectedPost'),
            key: "V", // key handler when post is selected 
          },
        ]
      }
    }
  }
}
</script>

<style scoped>
.modal-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid transparent;
  border-radius: 4px;
  font-family: Arial, Helvetica, sans-serif;
}

.modal-body {
  color: v-bind('theme.normalmessage');
  text-align: left;
  width: 100%;
  height: fit-content;
  padding: 1rem;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.modal-actions {
  padding-top: .75rem;
}

.keyboard-shortcut-container {
  overflow-y: auto; 
  align-items: start;
  border-top: 0px;
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
  border-left: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 3px;
  margin-bottom: 1rem;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  background-color: v-bind('theme.sectionhighlight');
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.keyboard-shortcut-desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: .56rem;
  padding: .75rem;
  border: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 4px;
}

.keyboard-label-wrapper {
  text-align: start;
}

.keyboard-key {
  padding: .75rem;
  border: 1px solid v-bind('theme.buttonborder');
  border-radius: 4px;
  box-shadow: 3px 3px 1px v-bind('theme.darkshadow');
  color: v-bind('theme.buttonfg');
  background-color: v-bind('theme.buttonbg');
  margin: .56rem;
  user-select: none;
  white-space: nowrap;
}

.keyboard-key-wrapper {
  display: flex;
  align-items: center;
}

.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
}
</style>