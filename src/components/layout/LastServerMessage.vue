<template>
  <span>
    <!-- server response -->
    <span class="timestamp">{{ this.serverMessages[this.serverMessages.length - 1].timestamp }}</span>
    <span class="last-server-message">{{ this.serverMessages[this.serverMessages.length - 1].text }}</span>
    <span class="clear-last-server-message" @click="clearLastServerMessage">(clear message)</span>
  </span>
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
.timestamp {
  color: v-bind('theme.subduedmessage');
  float: left;
}

.last-server-message {
  float: center;
  color: v-bind('theme.subduedmessage');
}

.clear-last-server-message {
  float: left;
  color: v-bind('theme.subduedmessage');
  padding-left: 10px;
  cursor: pointer;
}

.clear-last-server-message:hover {
  color: v-bind('theme.highlightedmessage');
}
</style>
