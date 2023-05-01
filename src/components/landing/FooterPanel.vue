<template>
  <div>
    <div class="links-view">
      <!-- TODO: (refactor) extract component -->
      <button class="footer-link" 
        :aria-label="this.$t('visitLSDevBlogAriaLabel')" 
        @click.prevent="window.open('https://www.lostsidewalk.com/feedgears/devblog', '_blank')">
        <span class="fa fa-code-fork" /> &nbsp; {{ this.$t('devBlog') }}
      </button>
      <button class="footer-link" @click.prevent="this.$router.push('/docs');">
        <span class="fa fa-question-circle" /> &nbsp; {{ this.$t('docs') }}
      </button>
      <button class="footer-link" @click.prevent="this.$router.push('/privacy');">
        <span class="fa fa-file-text" /> &nbsp; {{ this.$t('privacyPolicy') }}
      </button>
      <button class="footer-link" @click.prevent="this.$router.push('/api');">
        <span class="fa fa-plug" /> &nbsp; {{ this.$t('api') }}
      </button>
      <button class="footer-link" 
        :aria-label="this.$t('emailSupportArialLabel')" 
        @click.prevent="window.open('mailto:support@feedgears.com', '_blank')">
        <span class="fa fa-envelope" /> &nbsp; {{ this.$t('email') }}
      </button>
      <button class="footer-link" 
        :aria-label="this.$t('visitLSTwitterAriaLabel')" 
        @click.prevent="window.open('https://twitter.com/lostsidewalkllc', '_blank')">
        <span class="fa fa-twitter" /> &nbsp; {{ this.$t('twitter') }}
      </button>
      <button class="footer-link" 
        :aria-label="this.$t('visitLSGithubArialLabel')" 
        @click.prevent="window.open('https://github.com/lostsidewalk', '_blank')">
        <span class="fa fa-github" /> &nbsp; {{ this.$t('github') }}
      </button>
      <button class="footer-link" 
        :aria-label="this.$t('visitLSTwitchAriaLabel')" 
        @click.prevent="window.open('https://twitch.tv/elderscrollsjesus', '_blank')">
        <span class="fa fa-twitch" /> &nbsp; {{ this.$t('twitch') }}
      </button>
      <button class="footer-link" 
        :aria-label="this.$t('visitLSDiscordAriaLabel')" 
        @click.prevent="window.open('https://discord.gg/7nyY89UrNw', '_blank')">
        <span class="fa fa-comments-o" /> &nbsp; {{ this.$t('discord') }}
      </button>
    </div>
    <div class="footer-divider"/>
    <div class="copyright-view">
      <div>{{ this.$t('copyright') }} <span class="fa fa-copyright" /> 2023 <a class="footer-link" :aria-label="this.$t('visitLSHomepage')" href="https://www.lostsidewalk.com" target="_blank">LOST SIDEWALK SOFTWARE LLC</a></div>
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

.footer-link:hover, .footer-link:focus-visible {
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

@media (max-width: 640px) {
  .copyright-view {
    padding-left: 2%;
    padding-right: 2%;
  }
}

@media (max-width: 320px) {
  .copyright-view {
    padding-left: 0;
    padding-right: 0;
  }
}

.copyright-view > div { 
  margin: .125rem;
}

</style>
