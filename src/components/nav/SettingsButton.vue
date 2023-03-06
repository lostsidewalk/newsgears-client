<template>
  <button class="settings-button" @click="this.$router.push('/settings');" accesskey="t" :disabled="disabled" aria-label="Go to settings">
    <i class="fa fa-wrench" />&nbsp; Se<i class="underline">t</i>tings
  </button>
</template>

<script>
export default {
  name: "SettingsButton", 
  props: [ "disabled", "theme" ],
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
  border-radius: 3px;
  margin: .56rem;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.settings-button:disabled {
  cursor: auto;
}

.settings-button:hover, .settings-button:focus {
  background-color: v-bind('theme.buttonhighlight');
}

.settings-button:hover:disabled {
  background-color: unset;
}

.underline {
  text-decoration: underline;
}
</style>
