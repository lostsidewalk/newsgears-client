<template>
  <v-btn
    id="logout" 
    :size="buttonSize"  
    accesskey="o"
    :title="$t('logout')" 
    append-icon="fa-sign-out"
    :text="$t('logout')"
    @click="$emit('logout')"
  />
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "LogoutButton",
  mixins: [buttonSizeMixin], 
  emits: ["logout"],
}
</script>
