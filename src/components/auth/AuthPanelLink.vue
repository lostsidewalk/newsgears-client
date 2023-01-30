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
.auth-panel-message {
  color: v-bind('theme.normalmessage');
  padding: 4%;
}

.auth-panel-message > a:hover {
  color: v-bind('theme.highlightedmessage') !important;
  cursor: pointer;
  text-decoration: underline !important;
}
</style>
