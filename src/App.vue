<template>
  <div id="apphome">
    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  methods: {
    isLoading() {
      return false;
    },
  },
  data() {
    return {
      theme: this.$theme.currentTheme,
    }
  }
};
</script>

<style scoped>
#apphome {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-family: 'Merriweather', system-ui, sans-serif;
}

@font-face {
  font-family: 'Russo One';
  font-style: normal;
  font-display: swap;
  src: url(./fonts/Z9XUDmZRWg6M1LvRYsH-yA.ttf) format('truetype');
}

@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-display: swap;
  src: url(./fonts/Merriweather-Regular.ttf) format('truetype');
}
</style>