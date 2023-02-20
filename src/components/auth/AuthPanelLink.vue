<template>
  <div class="auth-field">
    <div class="auth-panel-message">
      <router-link style="text-decoration: none; color: inherit;" :to="to">{{ message }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthPanelLink",
  props: [ "to", "message", "theme" ]
}
</script>

<style scoped>
.auth-field {
  margin-left: 2vw;
  margin-right: 2vw;
  margin-top: 2vh;
  margin-bottom: 2vh;
}

.auth-panel-message {
  color: v-bind('theme.normalmessage');
}

.auth-panel-message > a:hover {
  color: v-bind('theme.highlightedmessage') !important;
  cursor: pointer;
  text-decoration: underline !important;
}
</style>
