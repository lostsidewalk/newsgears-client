<template>
  <v-text-field
    :label="label"
    :type="type ? type : null"
    :value="modelValue"
    :placeholder="placeholder"
    :hint="hint"
    persistent-placeholder
    variant="solo-filled"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  name: "QueueConfigTextField",
  components: { },
  props: {
    label: { type: String, required: true },
    hint: { type: String, default: null },
    placeholder: { type: String, default: null },
    type: { type: String, default: null },
    modelValue: { type: String, default: null },
  },
  emits: [ "update:modelValue" ],
};
</script>
