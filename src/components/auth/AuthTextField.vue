<template>
  <v-text-field
    outlined
    dense
    variant="solo-filled"
    autocomplete="false"
    :label="label"
    :aria-label="label"
    :placeholder="placeholder"
    :value="modelValue"
    :type="type ? type : 'text'"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  name: "AuthTextField",
  components: {},
  props: {
    label: { type: String, required: true },
    type: { type: String, default: null },
    placeholder: { type: String, default: null },
    modelValue: { type: String, required: true },
  },
  emits: ["update:modelValue"],
};
</script>
