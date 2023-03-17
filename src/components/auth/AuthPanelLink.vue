<template>
  <div class="auth-field">
    <router-link style="text-decoration: none; color: inherit;" :to="to">{{ message }}</router-link>
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
  margin-left: 2svw;
  margin-right: 2svw;
  margin-top: 2svh;
  margin-bottom: 2svh;
  color: v-bind('theme.normalmessage');
}

.auth-field > a:hover, .auth-field > a:focus-visible {
  color: v-bind('theme.highlightedmessage') !important;
  cursor: pointer;
  text-decoration: underline !important;
}
</style>
