<template>
  <v-btn @click="this.$router.push('/app')"
    id="login"
    size="small"
    :title="this.$t('login')"
    append-icon="fa-sign-in"
    :text="this.$t('login')" />
</template>

<script>
export default {
  name: "LoginButton",
  props: [ "theme" ],
}
</script>
