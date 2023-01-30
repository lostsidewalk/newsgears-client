<template>
  <div class="auth-field">
    <button
      type="button"
      @click="onClick()"
      class="auth-button">
      {{ label }}<br />
      {{ subLabel }}
    </button>
  </div>
</template>
  
<script>
export default {
  name: "AuthButton",
  props: [ "label", "subLabel", "theme" ],
  methods: {
    onClick() {
      this.$emit("clicked");
    },
  },
};
</script>

<style scoped>
/** has references */
.auth-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  /* float: unset */ 
  border-radius: 3px;
  margin: 4%;
  max-width: 256px;
  text-align: center;
  user-select: none;
}

/** has-references */
.auth-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

/** has-references */
.auth-button:disabled {
  cursor: auto;
}

/** has-references */
.auth-button:disabled:hover {
  background-color: unset;
}
</style>
