<template>
  <button class="settings-button accessible-button" 
    @click="this.$emit('showSettings')" 
    accesskey="t" 
    :disabled="disabled" 
    :title="this.$t('settings')"
    :aria-label="this.$t('goToSettingsAriaLabel')">
    {{ this.$t('settings') }} &nbsp; <span class="fa" :class="this.expanded ? 'fa-compress' : 'fa-expand'" />
  </button>
</template>

<script>
export default {
  name: "SettingsButton", 
  props: [ "disabled", "theme", "expanded" ],
  emits: [ "showSettings" ],
}
</script>

<style scoped>
.settings-button {
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
}

.settings-button:disabled {
  cursor: auto;
}

.settings-button:hover, .settings-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.settings-button:hover:disabled {
  background-color: unset;
}
</style>
