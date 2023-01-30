<template>
  <span>
    <button id="manageSubscription" class="manage-subscription-button" @click="this.$router.push('/manage-subscription');" :disabled="disableSubscription || inTransit">
      Manage Subscription
    </button>
  </span>
</template>

<script>
export default {
  name: "ManageSubscriptionButton",
  props: [ "inTransit", "theme","disableSubscription" ],
}
</script>

<style scoped>
.manage-subscription-button {
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

.manage-subscription-button:disabled {
  cursor: auto;
}

.manage-subscription-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.manage-subscription-button:hover:disabled {
  background-color: unset;
}
</style>
