<template>
  <v-text-field
    :label="label"
    :type="type ? type : 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    @input="this.$emit('update:modelValue', $event.target.value)" />
</template>

<script>

export default {
  name: "FeedConfigTextField",
  components: { },
  props: [ "label", "required", "placeholder", "type", "theme", "modelValue", "errorValue", "helpText" ],
  emits: [ "update:modelValue" ],
  methods: {
    focus() {
      this.$refs.feedConfigTextFieldInput.focus();
    }
  }
};
</script>
