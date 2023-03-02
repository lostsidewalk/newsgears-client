<template>
  <div>
    <div class="banner-view">
      <div class="logocontainer">
        <h1 class="logotext">FeedGears RSS</h1>
        <i class="logo fa fa-rss fa-5x"></i>
      </div>
      <h2 class="logosubtext fancy">
        A secure, private, accessible feed reader.
      </h2>
      <h2 class="logosubtext fancy">
        FeedGears is free because we believe in RSS <i class="fa fa-rss" />
      </h2>
      <h3 class="logosubduedtext fancy">
        (You can still pay for it if you want to support our mission.)
      </h3>
      <div class="flex" style="padding-top: 2vh;padding-bottom: 2vh;">
        <GoogleAuthButton :theme="theme" :disabled="false" />
        <!-- sign-up button -->
        <SignUpButton :disabled="false" :theme="theme" />
      </div>
      <!-- TODO: add feed discovery button -->
    </div>
  </div>
</template>

<script>
import GoogleAuthButton from '../auth/GoogleAuthButton.vue';
import SignUpButton from '../nav/SignUpButton.vue';

export default {
    name: "BannerPanel",
    props: ["theme"],
    components: { 
      GoogleAuthButton,
    SignUpButton 
  }
}
</script>

<style scoped>

.banner-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  align-items: center;
  width: 100%;
}

.logocontainer {
  padding-top: 2vh;
  padding-bottom: 2vh;
}

.logotext {
  font-family: 'Russo One';
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 1px 0px 1px v-bind('theme.logocolor');
}

.logo {
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 3px 3px 3px v-bind('theme.logosubshadow');
}

.logosubtext {
  font-size: 3.0rem;
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 3px 3px 3px v-bind('theme.logosubshadow');
  padding-top: 2vh;
  padding-bottom: 2vh;
  margin-left: 17vw;
  margin-right: 17vw;
}

.logosubduedtext {
  font-size: 2.0rem;
  padding-top: 1vh;
  padding-bottom: 1vh;
  margin-left: 17vw;
  margin-right: 17vw;
}

.tab-label {
  text-align: center;
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  user-select: none;
  background-color: v-bind('theme.sectionbrighthighlight');
  color: v-bind('theme.logocolor');
}

.tab-label:hover, .tab-label:focus {
  background-color: v-bind('theme.buttonhighlight');
}

.underline {
  text-decoration: underline;
}

.fancy {
  font-family: math; /* oh yeah */
  font-weight: bold;
  text-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}
</style>
