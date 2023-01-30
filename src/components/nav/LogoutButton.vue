<template>
    <span>
      <button id="logout" class="logout-button" @click="this.$auth.logout()" :disabled="inTransit">
        Logout
      </button>
    </span>
</template>

<script>
export default {
  name: "LogoutButton",
  props: [ "inTransit", "theme" ],
}
</script>

<style scoped>
.logout-button {
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

.logout-button:disabled {
  cursor: auto;
}

.logout-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.logout-button:hover:disabled {
  background-color: unset;
}
</style>