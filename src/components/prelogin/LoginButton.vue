<template>
  <v-btn
    id="login"
    size="small"
    :title="$t('login')"
    append-icon="fa-sign-in"
    :text="$t('login')"
    @click="$router.push('/app')"
  />
</template>

<script>
export default {
  name: "LoginButton",
}
</script>
