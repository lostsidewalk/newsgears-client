<template>
  <div class="modal-container" v-if="showModal" v-auto-animate>
    <div class="modal-body">
      <h3>{{ prompt }}</h3>
      <div class="modal-actions">
        <button class="modal-button" ref="confirmButton" @click="confirm" accesskey="c" :disabled="disabled"><i class="underline">C</i>onfirm</button>
        <button class="modal-button" @click.stop="this.$emit('cancel')" :disabled="disabled">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "ConfirmationDialog",
  props: ["prompt", "disabled", "theme"],
  emits: ["confirm", "cancel"],
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    show() {
      this.showModal = true;
      this.$nextTick(() => {
        this.$refs.confirmButton.focus();
      });
    },
    hide() {
      this.showModal = false;
    }
  },
  data() {
    return {
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
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid transparent;
  border-radius: 4px;
  font-family: Arial, Helvetica, sans-serif;
}

.modal-body {
  background: v-bind('theme.modalbodybg');
  color: v-bind('theme.normalmessage');
  text-align: center;
  width: 100%;
  height: 100%;
  padding-top: 2rem;
  padding-left: .125rem;
  padding-right: .125rem;
  padding-bottom: 1rem;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.modal-actions {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
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
  border-radius: 4px;
  margin: .56rem;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.modal-button:hover, .modal-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight') !important;
}

.modal-close {
  cursor: auto;
  position: relative;
  align-self: end;
  right: -12px;
  top: -17px;
}

.underline {
  text-decoration: underline;
}
</style>