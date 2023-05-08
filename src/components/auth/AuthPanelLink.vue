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
  color: v-bind('theme.normalmessage');
  padding: .75rem;
}

.auth-field > a:hover, .auth-field > a:focus-visible {
  color: v-bind('theme.highlightedmessage') !important;
  cursor: pointer;
  text-decoration: underline !important;
}
</style>
