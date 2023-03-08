<template>
  <div>
    <div class="links-view">
      <button class="footer-link" aria-label="Visit the Lost Sidewalk dev blog in a new tab" @click.prevent="window.open('https://www.lostsidewalk.com/feedgears/devblog', '_blank')"><span class="fa fa-code-fork" /> Dev Blog</button>
      <button class="footer-link" @click.prevent="this.$router.push('/docs');">
        <span class="fa fa-question-circle" /> Docs
      </button>
      <button class="footer-link" @click.prevent="this.$router.push('/privacy');">
        <span class="fa fa-file-text" /> Privacy Policy
      </button>
      <button class="footer-link" @click.prevent="this.$router.push('/api');">
        <span class="fa fa-plug" /> API
      </button>
      <button class="footer-link" aria-label="Open your email client to send email to support@feedgears.com" @click.prevent="window.open('mailto:support@feedgears.com', '_blank')"><span class="fa fa-envelope" /> Email</button>
      <button class="footer-link" aria-label="Visit the Lost Sidewalk Twitter in a new tab" @click.prevent="window.open('https://twitter.com/lostsidewalkllc', '_blank')"><span class="fa fa-twitter" /> Twitter</button>
      <button class="footer-link" aria-label="Visit the Lost Sidewalk Github in a new tab" @click.prevent="window.open('https://github.com/lostsidewalk', '_blank')"><span class="fa fa-github" /> Github</button>
      <button class="footer-link" aria-label="Visit Lost Sidewalk on Twitch in a new tab " @click.prevent="window.open('https://twitch.tv/elderscrollsjesus', '_blank')"><span class="fa fa-twitch" /> Twitch</button>
      <button class="footer-link" aria-label="Visit the Lost Sidewalk Discord in a new tab" @click.prevent="window.open('https://discord.gg/7nyY89UrNw', '_blank')"><span class="fa fa-comments-o" /> Discord</button>
    </div>
    <div class="footer-divider"/>
    <div class="copyright-view">
      <div>COPYRIGHT <span class="fa fa-copyright" /> 2023 <a class="footer-link" aria-label="Visit the Lost Sidewalk homepage" href="https://www.lostsidewalk.com" target="_blank">LOST SIDEWALK SOFTWARE LLC</a></div>
      <div>2501 Chatham Rd STE R | Springfield, IL 62704 | Sangamon County</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterPanel",
  props: [ "theme" ],
}
</script>

<style scoped>
.links-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: .75rem;
  padding: 1.25rem;
}

.footer-link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
  background: unset;
  border: unset;
  max-width: fit-content;
  min-width: 48px;
  min-height: 48px;
}

.footer-link:hover, .footer-link:focus {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.footer-divider {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  width: 75%;
  margin: auto;
  padding-top: 1%;
  padding-bottom: 1%;
}

.copyright-view {
  padding-left: 4%;
  padding-right: 4%;
  padding-bottom: 1%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-size: smaller;
}

.copyright-view > div { 
  margin: .125rem;
}

</style>
