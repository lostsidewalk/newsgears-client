<template>
  <div class="last-server-message-container">
    <!-- server response -->
    <span class="timestamp">{{ this.serverMessages[this.serverMessages.length - 1].timestamp }}</span>
    <v-btn @click="clearLastServerMessage" 
      size="x-small"
      accesskey="x"
      prepend-icon="fa-check"
      :text="this.serverMessages[this.serverMessages.length - 1].text" />
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
  /* color: v-bind('theme.subduedmessage'); */
  float: left;
}
</style>
