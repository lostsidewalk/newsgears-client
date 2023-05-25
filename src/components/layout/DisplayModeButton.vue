<template>
  <v-btn
    :size="xs ? 'x-small' : 'small'" 
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

    const { xs } = useDisplay();

    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark',
      xs: () => xs,
    }
  },
}
</script>
