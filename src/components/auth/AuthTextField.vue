<template>
  <v-text-field
    outlined
    dense
    autocomplete="false"
    :label="label"
    :placeholder="placeholder"
    :value="modelValue"
    :type="type ? type : 'text'"
    @input="this.$emit('update:modelValue', $event.target.value)" />
</template>

<script>

export default {
  name: "AuthTextField",
  components: { },
  props: [ "label", "placeholder", "type", "theme", "modelValue" ],
  emits: [ "update:modelValue" ],
};
</script>
