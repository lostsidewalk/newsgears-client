<template>
  <v-btn
    :size="buttonSize()" 
    accesskey="l"
    :icon="$vuetify.theme.dark ? 'fa-moon-o' : 'fa-lightbulb-o'" 
    :title="$t('switchMode')" 
    :aria-label="$t('switchModeAriaLabel')"
    @click="toggleTheme"
  />
</template>

<script>
import { useTheme } from 'vuetify'
import { useDisplay } from 'vuetify'

export default {
  name: "DisplayModeButton",
  setup() {
    const theme = useTheme();

    const {
      xs, // sm,
      // md, lg, xl, xxl
    } = useDisplay();

    function toggleTheme() {
      theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
      localStorage.setItem('theme', theme.global.name.value);
    }

    function buttonSize() {
      if (xs) {
        return 'x-small';
      }  else {
        return 'small';
      } 
    }

    return {
      theme,
      toggleTheme,
      buttonSize,
    }
  },
}
</script>
