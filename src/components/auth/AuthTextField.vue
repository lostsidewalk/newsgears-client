<template>
  <div class="auth-field">
    <input
      :type="type ? type : 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <!-- <div class="auth-error-message" v-for="(error, index) of errorValue" :key="index">
      {{ error.$message }}
    </div> -->
  </div>
</template>

<script>

export default {
  name: "AuthTextField",
  components: { },
  props: [ "placeholder", "type", "disabled", "theme", "modelValue", "errorValue" ],
};
</script>

<style scoped>
.auth-field {
  margin-left: 2vw;
  margin-right: 2vw;
  margin-top: 2vh;
  margin-bottom: 2vh;
}

.auth-field > input {
  padding: .31rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.auth-field > input:hover, .auth-field > input:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.auth-error-message {
  color: v-bind('theme.normalmessage');
}
</style>
