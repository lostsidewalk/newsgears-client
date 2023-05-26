<template>
  <v-btn
    id="login"
    :size="buttonSize" 
    :title="$t('login')"
    append-icon="fa-sign-in"
    :text="$t('login')"
    @click="$router.push('/app')"
  />
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "LoginButton",
  mixins: [buttonSizeMixin], 
}
</script>
