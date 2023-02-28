<template>
  <div class="volume-control">
      <i class="fa" :class="volumeIcon"></i>
      <input type="range"
          v-model="volume"
          height="4px"
          width="64px"
          class="volume-slider"
          step="0.5" min="1" max="100"
          :style="volumeStyle" />
  </div>
</template>

<script>
export default {
  name: "VolumeControl",
  props: [ "value" ],
  computed: {
    volume: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('update:value', parseFloat(value))
      }
    },
    volumeStyle: function() {
      return {'--volume-width': `${this.volume}%`}
    },
    volumeIcon: function() {
      if (this.volume === 0)
        return "fa-volume-off";
      else if (this.volume < 100)
        return "fa-volume-down";
      else
        return "fa-volume-up";
    }
  }
}
</script>

<style scoped lang="scss">
.volume-slider {
  position: relative;
  width: 100%;
  padding: 0;
  height: 4px;
  background: transparent;

  &::before {
    position: absolute;
    top: 0;
    left: 1px;
    width: var(--buffered-width);
    height: 4px;
    cursor: pointer;
  }

  &::after {
    position: absolute;
    top: 0;
    left: 1px;
    width: var(--played-width);
    height: 4px;
    cursor: pointer;
    z-index: 0;
  }
}

.volume-control {
  display: flex;
  box-sizing: content-box;
}
</style>
