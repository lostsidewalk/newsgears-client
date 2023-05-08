<template>
  <div class="navbar fixed-header">
    <slot name="logo"></slot>
    <div class="pa-2" style="display: flex;flex-wrap: wrap;justify-content: flex-end;gap: 1rem;flex: auto;">
      <slot name="buttons"></slot>
    </div>
    <div class="loader" v-if="this.inTransit">
      <div class="loading_1"></div>
    </div>
    <div v-else>
      <div class="not-loading"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavbarFixedHeader",
  props: [ "inTransit", "theme" ],
}

</script>

<style scoped>
.navbar.fixed-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  z-index: 200;
  overflow: auto;
}

.loader {
  width: 100%;
  position: relative;
}

.loader .loading_1 {
  position: relative;
  height: 1px;
  animation: turn 4s linear 1.75s infinite;
}

.not-loading {
  position: relative;
  height: 1px;
  color: transparent;
}

.loader .loading_1:before {
  content: "";
  display: block;
  position: absolute;
  width: 0%;
  height: 100%;
  background-color: v-bind('theme.navbarshadow');
  animation: load 2s linear infinite;
}

@keyframes load {
    0% {
        width: 0%;
    }

    87.5% {
        width: 100%;
    }
}

@keyframes turn {
    0% {
        transform: rotateY(0deg);
    }

    6.25%,
    50% {
        transform: rotateY(180deg);
    }

    56.25%,
    100% {
        transform: rotateY(360deg);
    }
}

@keyframes bounce {

    0%,
    100% {
        top: .75rem;
    }

    12.5% {
        top: 30px;
    }
}
</style>
