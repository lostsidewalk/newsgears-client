<template>
  <div class="not-authenticated">
    <p>Looks like you've been logged out.</p>
    <p>Click <router-link to="/app">here</router-link> to start over.</p>
  </div>
</template>

<script>
export default {
  name: "YouHaveBeenLoggedOut",
  props: [ "theme" ],
  emits: [],
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
.not-authenticated {
  color: v-bind('theme.normalmessage');
  font-size: large;
  text-shadow: 2px 2px 2px v-bind('theme.darkshadow');
}
.not-authenticated > p {
  padding: 25px;
  text-decoration: none;
}

.not-authenticated > p > a {
  color: v-bind('theme.normalmessage');
}
</style>
