<template>
  <div class="modal-container" v-if="showModal">
    <div class="modal-body">
      <div style="overflow-y: auto; max-height: 75vh;display: grid;grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));gap: 1rem;align-items: start;place-items: start stretch;">
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
      <div class="modal-actions">
        <button class="modal-button" ref="dismissButton" @click.stop="this.$emit('dismiss')">Dismiss</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelpPanel",
  props: ["theme"],
  emits: ["dismiss"],
  methods: {
    show() {
      this.showModal = true;
      this.$nextTick(() => {
        this.$refs.dismissButton.focus();
      });
    },
    hide() {
      this.showModal = false;
    }
  },
  data() {
    return {
      helpModel: [
          {
            label: "Switch to light or dark mode",
            key: "ALT + L",
          },
          {
            label: "Logout",
            key: "ALT + O",
          },
          {
            label: "Manage subscription",
            key: "ALT + S",
          },
          {
            label: "Go to account settings",
            key: "ALT + T",
          },
          {
            label: "Create a new queue",
            key: "ALT + N",
          },
          {
            label: "Import an OPML file",
            key: "ALT + M",
          },
          {
            label: "Previous article in queue",
            icon: "fa-arrow-up",
          },
          {
            label: "Next article in queue",
            icon: "fa-arrow-down",
          },
          {
            label: "First article on page",
            key: "HOME",
          },
          {
            label: "Last article on page",
            key: "END",
          },
          {
            label: "Select previous page, first article",
            key: "PG UP",
          },
          {
            label: "Select next page, first article",
            key: "PG DOWN",
          },
          {
            label: "Edit selected queue",
            key: "SHIFT + E"
          },
          {
            label: "Mark queue as read",
            key: "SHIFT + A"
          },
          {
            label: "Refresh queue",
            key: "SHIFT + R"
          },
          {
            label: "Add queue",
            key: "SHIFT + Q"
          },
          {
            label: "Add subscription to queue",
            key: "SHIFT + S"
          },
          {
            label: "Star selected post",
            key: "S",
          },
          {
            label: "Toggle read/unread",
            key: "M",
          },
          {
            label: "Open post URL in a new tab",
            key: "V",
          },
          {
            label: "Show/hide unread",
            key: "SHIFT + U",
          },
          {
            label: "Show/hide starred",
            key: "SHIFT + T",
          },
          {
            label: "Show/hide read-later",
            key: "SHIFT + L",
          },
          {
            label: "Show/hide read",
            key: "SHIFT + H",
          },
          {
            label: "Search",
            key: "/",
          }
      ],
      // 
      showModal: false
    }
  }
}
</script>

<style scoped>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 2%;
  left: 2%;
  right: 0;
  width: 96%;
  height: auto;
  z-index: 1000;
}

.modal-header {
  text-align: left;
}

.modal-body {
  background: v-bind('theme.modalbodybg');
  color: v-bind('theme.normalmessage');
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
  padding-bottom: 1rem;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  border: 0px;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  flex-direction: row;
  gap: 3rem;
  justify-content: center;
  padding-top: .75rem;
}

.modal-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  border-radius: 3px;
  margin: .56rem;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.modal-button:hover, .modal-button:focus {
  background-color: v-bind('theme.buttonhighlight') !important;
}

.modal-close {
  cursor: auto;
  position: relative;
  align-self: end;
  right: -12px;
  top: -17px;
}

.keyboard-category {
  font-weight: bolder;
  font-size: larger;
  margin: .56rem;
  padding: .125rem;
}

.keyboard-shortcut-desc {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-left: .75rem;
  margin-right: .75rem;
  padding: .75rem;
  border: 1px solid v-bind('theme.sectionbordercolor');
  flex-wrap: wrap;
}

.keyboard-key {
  padding: .75rem;
  border: 1px solid v-bind('theme.buttonborder');
  border-radius: 3px;
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