<template>
  <div class="color-field">
    <input type="color" 
      class="swatch" 
      :value="value" 
      @input="this.$emit('update:modelValue', $event.target.value)" />
    <div class="color-field-description">
      <span style="font-weight: bold;">{{ this.attr.shortDescription }}</span>
      <span>{{ this.attr.longDescription }}</span>
    </div>
</div>
</template>

<script>

export default {
  name: "ColorField",
  props: [ "inTransit", "theme", "attr", "value" ],
  emits: [ "update:modelValue" ],
  data() {
    return {
    }
  }
}
</script>

<style scoped>

.color-field {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: .75rem;
  margin-bottom: .75rem;
  border: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 5px;
  padding: .75rem;
}

.swatch {
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  background: transparent;
}

.color-field-description {
  display: flex;
  flex-direction: column;
}
</style>