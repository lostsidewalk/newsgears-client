<template>
  <span>
    <button id="manageSubscription" class="manage-subscription-button" @click="this.$router.push('/manage-subscription');" accesskey="s" :disabled="disabled">
      Manage <i class="underline">s</i>ubscription
    </button>
  </span>
</template>

<script>
export default {
  name: "ManageSubscriptionButton",
  props: [ "disabled", "theme" ],
}
</script>

<style scoped>
.manage-subscription-button {
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

.underline { 
  text-decoration: underline;
}
</style>
