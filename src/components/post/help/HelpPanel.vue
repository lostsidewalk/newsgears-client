<template>
  <div class="modal-container" v-auto-animate>
    <div class="modal-body">
      <div class="keyboard-shortcut-container">
        <div class="keyboard-shortcut-desc" v-for="desc in this.helpModel" :key="desc">
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
      helpModel: [
          {
            label: this.$t('switchModeAriaLabel'),
            key: "ALT + L",
          },
          {
            label: this.$t('logout'),
            key: "ALT + O",
          },
          {
            label: this.$t('goToSettingsAriaLabel'),
            key: "ALT + T",
          },
          {
            label: this.$t('uploadOPML'),
            key: "ALT + M",
          },
          {
            label: this.$t('goToPreviousPost'),
            icon: "fa-arrow-up",
          },
          {
            label: this.$t('goToNextPost'),
            icon: "fa-arrow-down",
          },
          {
            label: this.$t('goToFirstPost'),
            key: "HOME",
          },
          {
            label: this.$t('goToLastPost'),
            key: "END",
          },
          {
            label: this.$t('configureSelectedQueue'),
            key: "SHIFT + E"
          },
          {
            label: this.$t('markSelectedQueueAsRead'),
            key: "SHIFT + A"
          },
          {
            label: this.$t('refreshQueues'),
            key: "SHIFT + R"
          },
          {
            label: this.$t('createNewQueue'),
            key: "SHIFT + Q"
          },
          {
            label: this.$t('addSubscriptionToSelectedQueue'),
            key: "SHIFT + S"
          },
          {
            label: this.$t('starSelectedPost'),
            key: "S",
          },
          {
            label: this.$t('toggleReadStatusSelectedPost'),
            key: "M",
          },
          {
            label: this.$t('openOriginalArticleSelectedPost'),
            key: "V",
          },
          {
            label: this.$t('showUnread'),
            key: "SHIFT + U",
          },
          {
            label: this.$t('showStarred'),
            key: "SHIFT + T",
          },
          {
            label: this.$t('showReadLater'),
            key: "SHIFT + L",
          },
          {
            label: this.$t('showRead'),
            key: "SHIFT + H",
          },
          {
            label: this.$t('search'),
            key: "/",
          }
      ],
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
</style>