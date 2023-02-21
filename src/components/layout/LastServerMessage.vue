<template>
  <div class="last-server-message-container">
    <!-- server response -->
    <span class="timestamp">{{ this.serverMessages[this.serverMessages.length - 1].timestamp }}</span>
    <button class="last-server-message" @click="clearLastServerMessage" accesskey="x">
      <i class="fa fa-check fa-1x clear-last-server-message" /> &nbsp;
      {{ this.serverMessages[this.serverMessages.length - 1].text }}
    </button>
  </div>
</template>

<script>
export default {
  name: "LastServerMessage",
  props: [ "serverMessages", "theme" ],
  emits: [ "clearLastServerMessage" ],
  methods: {
    clearLastServerMessage() {
      this.$emit('clearLastServerMessage');
    }
  }
}
</script>

<style scoped>
.last-server-message-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
}

.timestamp {
  color: v-bind('theme.subduedmessage');
  float: left;
}

.last-server-message {
  float: center;
  color: v-bind('theme.subduedmessage');
  background-color: unset;
  border: unset;
}

.clear-last-server-message {
  float: left;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
}

.clear-last-server-message:hover {
  color: v-bind('theme.highlightedmessage');
}
</style>
