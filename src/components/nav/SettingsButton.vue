<template>
  <span>
    <button class="settings-button" @click="this.$router.push('/settings');" :disabled="disableSettings || inTransit" aria-label="Go to settings">
      <span class="fa fa-wrench" />
    </button>
  </span>
</template>

<script>
export default {
  name: "SettingsButton", 
  props: [ "inTransit", "theme", "disableSettings" ],
}
</script>

<style scoped>
.settings-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: right;
  border-radius: 3px;
  margin: 9px;
  margin-right: 2%;
  text-align: center;
}

.settings-button:disabled {
  cursor: auto;
}

.settings-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.settings-button:hover:disabled {
  background-color: unset;
}
</style>