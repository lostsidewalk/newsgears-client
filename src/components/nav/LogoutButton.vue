<template>
  <button id="logout" 
    class="logout-button accessible-button" 
    @click="logout" 
    accesskey="o" 
    :disabled="disabled">
    {{ this.$t('logout') }} 
  </button>
</template>

<script>
export default {
  name: "LogoutButton",
  props: [ "disabled", "theme" ],
  methods: {
    logout() {
      this.$auth.logout()
      .catch((error) => {
        console.error("unable to logout due to: " + error);
      }).finally(() => {
        console.log("logout complete");
      });
    }
  }
}
</script>

<style scoped>
.logout-button {
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

.logout-button:disabled {
  cursor: auto;
}

.logout-button:hover, .logout-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.logout-button:hover:disabled {
  background-color: unset;
}
</style>
