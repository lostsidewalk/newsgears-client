<template>
  <v-btn
    size="small" 
    accesskey="l"
    :icon="$vuetify.theme.dark ? 'fa-moon-o' : 'fa-lightbulb-o'" 
    :title="$t('switchMode')" 
    :aria-label="$t('switchModeAriaLabel')"
    @click="toggleTheme"
  />
</template>

<script>
import { useTheme } from 'vuetify'

export default {
  name: "DisplayModeButton",
  setup () {
    const theme = useTheme();

    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark',
    }
  },
}
</script>
