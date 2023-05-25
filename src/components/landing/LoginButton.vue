<template>
  <v-btn
    id="login"
    :size="xs ? 'x-small' : 'small'" 
    :title="$t('login')"
    append-icon="fa-sign-in"
    :text="$t('login')"
    @click="$router.push('/app')"
  />
</template>

<script>
export default {
  name: "LoginButton",
  computed: {
    xs: function() {
      return this.$vuetify.display.xs;
    }
  },
}
</script>
