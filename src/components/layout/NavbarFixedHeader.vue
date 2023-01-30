<template>
  <div class="navbar fixed-header">
    <slot name="buttons"></slot>
    <div class="loader" v-if="inTransit">
        <div class="loading_1"></div>
    </div>
  </div>
</template>

<script>

export default {
  components: { },
  name: "NavbarFixedHeader",
  props: [ "inTransit", "theme" ],
}

</script>

<style scoped>
.navbar.fixed-header {
  align-items: center;
  width: 100%;
  z-index: 200;
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

.loader .loading_1:before {
    content: "";
    display: block;
    position: absolute;
    width: 0;
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
        top: 10px;
    }

    12.5% {
        top: 30px;
    }
}
</style>
