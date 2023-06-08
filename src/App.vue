<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style scoped>
#apphome {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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