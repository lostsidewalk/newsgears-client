<template>
  <span>
    <button id="upgrade" class="upgrade-button" @click="this.$router.push('/stripe');" :disabled="disableSubscription || inTransit">
      Upgrade
    </button>
  </span>
</template>

<script>
export default {
  name: "UpgradeSubscriptionButton",
  props: [ "inTransit", "disableSubscription", "theme" ],
}
</script>

<style scoped>
.upgrade-button {
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

.upgrade-button:disabled {
  cursor: auto;
}

.upgrade-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.upgrade-button:hover:disabled {
  background-color: unset;
}
</style>