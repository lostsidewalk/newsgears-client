<template>
  <div>
    <button
      :disabled="disabled"
      type="button"
      @click="onClick()"
      class="auth-button accessible-button">
      {{ label }}<br />
      {{ subLabel }}
    </button>
  </div>
</template>
  
<script>
export default {
  name: "AuthButton",
  props: [ "label", "subLabel", "disabled", "theme" ],
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
  padding: .44rem 1.25rem;
  margin: 4%;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
  user-select: none;
}

@media (max-width: 640px) {
  .auth-button {
    margin-left: 2%;
    margin-right: 2%;
  }
}

@media (max-width: 320px) {
  .auth-button {
    margin-left: 0;
    margin-right: 0;
  }
}

/** has-references */
.auth-button:hover, .auth-button:focus-visible {
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
