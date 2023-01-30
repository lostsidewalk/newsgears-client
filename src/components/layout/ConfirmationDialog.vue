<template>
  <div class="modal-container" v-if="showModal">
    <div class="modal-body">
      <h3>{{ prompt }}</h3>
      <div class="modal-actions">
        <button class="modal-button" @click="confirm">Confirm</button>
        <button class="modal-button" @click="hide">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationDialog",
  props: ["prompt", "inTransit", "theme"],
  emits: ["confirm"],
  methods: {
    show() {
      this.showModal = true;
    },
    hide() {
      this.showModal = false;
    },
    confirm() {
      this.$emit('confirm');
    }
  },
  data() {
    return {
      showModal: false,
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
  height: 100%;
  z-index: 1000;
  background: rgba(0,0,0,0.8);
}

.modal-body {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  color: v-bind('theme.normalmessage');
  text-align: center;
  width: 50%;
  padding: 32px;
  border: 1px solid v-bind('theme.buttonborder');
  border-radius: 3px;
}

.modal-actions {
  display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center;
  padding-top: 10px;
}

.modal-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: right;
  border-radius: 3px;
  margin: 9px;
  margin-right: 2%;
  text-align: center;
}

.modal-button:hover {
  background-color: v-bind('theme.buttonhighlight') !important;
}

.modal-close {
  cursor: auto;
  position: relative;
  align-self: end;
  right: -12px;
  top: -17px;
}
</style>