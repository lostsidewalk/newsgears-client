<template>
  <div class="feed-config-field">
    <label v-if="label">
      <span v-if="required" class="required">*</span>
      {{ label }}
    </label>
    <input
      :type="type ? type : 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="inTransit"
      @input="this.$emit('update:modelValue', $event.target.value)"
    />
    <div class="feed-config-error-message" v-for="(error, index) of errorValue" :key="index">
      {{ error.$message }}
    </div>
  </div>
</template>

<script>

export default {
  name: "FeedConfigTextField",
  components: { },
  props: [ "label", "required", "placeholder", "type", "inTransit", "theme", "modelValue", "errorValue" ],
  emits: [ "update:modelValue" ],
};
</script>

<style scoped>
.feed-config-field {
  border: 1px solid v-bind('theme.sectionbordercolor');
  text-align: left;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
}

.feed-config-field label {
  font-size: small;
  /* padding-bottom: 3px; */
}

.feed-config-field > input, .feed-config-field > textarea {
  padding: 5px;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: 2px;
  resize: none;
}

.feed-config-field input:hover, .feed-config-field textarea:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-config-field input:focus, .feed-config-field textarea:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
}

.feed-config-field input:disabled, .feed-config-field textarea:disabled {
  cursor: auto;
}
</style>
