<template>
  <div class="not-authenticated">
    <p>{{ this.$t('youHaveBeenLoggedOut') }}</p>
    <p><router-link to="/app">{{ this.$t('clickHereToStartOver') }}</router-link></p>
  </div>
</template>

<script>
export default {
  name: "YouHaveBeenLoggedOut",
  props: [ "theme" ],
}
</script>

<style scoped>
.not-authenticated {
  color: v-bind('theme.normalmessage');
  font-size: larger;
  text-shadow: 2px 2px 2px v-bind('theme.darkshadow');
}
.not-authenticated > p {
  padding: 1rem;
  text-decoration: none;
}

.not-authenticated > p > a {
  color: v-bind('theme.normalmessage');
}
</style>
