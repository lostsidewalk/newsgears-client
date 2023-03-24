<template>
  <div class="footer-view">
    <button class="footer-link" @click.prevent="this.$router.push('/privacy');">
      <span class="fa fa-file-text" /> {{ this.$t('privacyPolicy') }}
    </button>
  </div>
</template>

<script>
export default {
  name: "AuthFooterView", 
  props: ["theme"]
}
</script>

<style scoped>
.footer-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  justify-content: center;
  gap: .75rem;
  padding: 1.25rem;
}

.footer-link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
  background: unset;
  border: unset;
  max-width: fit-content;
  min-width: 48px;
  min-height: 48px;
}

.footer-link:hover, .footer-link:focus-visible {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}
</style>
