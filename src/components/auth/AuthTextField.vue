<template>
  <v-text-field
    outlined
    dense
    autocomplete="false"
    :label="label"
    :placeholder="placeholder"
    :value="modelValue"
    :type="type ? type : 'text'"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>

export default {
  name: "AuthTextField",
  components: { },
  props: {
    label: { type: String, required: true },
    type: { type: String, default: null },
    placeholder: { type: String, default: null },
    modelValue: { type: String, default: null },
  },
  emits: [ "update:modelValue" ],
};
</script>
