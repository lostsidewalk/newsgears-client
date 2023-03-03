<template>
  <div class="color-field">
    {{ this.attr.name }}
    <div class="swatch" />
    <div class="flex" flex-direction="row">
      RED: <input type="range" min="0" max="255" v-model="this.redValue" class="slider" id="red">
      GREEN: <input type="range" min="0" max="255" v-model="this.greenValue" class="slider" id="red">
      BLUE: <input type="range" min="0" max="255" v-model="this.blueValue" class="slider" id="red">
      ALPHA: <input type="range" min="0" max="255" v-model="this.alphaValue" class="slider" id="red">
    </div>
  </div>
</template>

<script>

export default {
  name: "ColorField",
  props: [ "inTransit", "theme", "attr", "value" ],
  computed: {
    colorValue: function() {
      return 'rgba(' + this.redValue + ', ' + this.greenValue + ', ' + this.blueValue + ', ' + this.alphaValue + ')'
    }
  },
  mounted() {
    this.redValue = this.value ? this.value[0] : 0;
    this.greenValue = this.value ? this.value[1] : 0;
    this.blueValue = this.value ? this.value[2] : 0;
    this.alphaValue = this.value ? this.value[3] : 0;
  },
  data() {
    return {
      redValue: null,
      greenValue: null,
      blueValue: null,
      alphaValue: null,
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
}

.swatch {
  min-width: 32px;
  max-width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: v-bind('colorValue')
}
</style>