<template>
  <div class="feed-config-field">
    <label v-if="label">
      <span v-if="required" class="required">*</span>
      {{ label }} 
    </label>
    <div style="display: flex;">
      <input 
        ref="feedConfigTextFieldInput" 
        :type="type ? type : 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="this.$emit('update:modelValue', $event.target.value)"
      />
      <button class="helptext fa fa-question" v-if="this.helpText" :title="this.helpText" />
    </div>
    <div class="feed-config-error-message" v-for="(error, index) of errorValue" :key="index">
      {{ error.$message }}
    </div>
  </div>
</template>

<script>

export default {
  name: "FeedConfigTextField",
  components: { },
  props: [ "label", "required", "placeholder", "type", "disabled", "theme", "modelValue", "errorValue", "helpText" ],
  emits: [ "update:modelValue" ],
  methods: {
    focus() {
      this.$refs.feedConfigTextFieldInput.focus();
    }
  }
};
</script>

<style scoped>
.feed-config-field {
  border: 1px solid v-bind('theme.sectionbordercolor');
  text-align: left;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  padding: .75rem;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
}

.feed-config-field label {
  font-size: smaller;
  /* padding-bottom: .125rem; */
}

.feed-config-field input, .feed-config-field textarea {
  padding: .31rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: .125rem;
  resize: none;
  width: 100%;
}

.feed-config-field input:hover, .feed-config-field textarea:hover,
.feed-config-field input:focus, .feed-config-field textarea:focus
{
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-config-field input:disabled, .feed-config-field textarea:disabled {
  cursor: auto;
}

.helptext {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');;
  cursor: help;
  float: right;
  border-radius: 3px;
  text-align: center;
  margin-top: .125rem;
  margin-left: .31rem;
}

.helptext:hover, .helptext:focus {
  background-color: v-bind('theme.buttonhighlight');
}
</style>
