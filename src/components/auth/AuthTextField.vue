<template>
  <div class="auth-field">
    <input
      :type="type ? type : 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="inTransit"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="auth-error-message" v-for="(error, index) of errorValue" :key="index">
      {{ error.$message }}
    </div>
  </div>
</template>

<script>

export default {
  name: "AuthTextField",
  components: { },
  props: [ "placeholder", "type", "inTransit", "theme", "modelValue", "errorValue" ],
};
</script>

<style scoped>
.auth-field > input {
  margin: 4%;
  padding: 5px;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  width: 20%;
  max-width: 256px;
}

.auth-field > input:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.auth-field > input:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
}

.auth-error-message {
  color: v-bind('theme.normalmessage');
}
</style>
