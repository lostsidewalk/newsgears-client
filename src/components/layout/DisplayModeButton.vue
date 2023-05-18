<template>
  <v-btn @click="toggleTheme" 
    size="small"
    accesskey="l" 
    :icon="this.$vuetify.theme.dark ? 'fa-moon-o' : 'fa-lightbulb-o'" 
    :title="this.$t('switchMode')"
    :aria-label="this.$t('switchModeAriaLabel')" />
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
