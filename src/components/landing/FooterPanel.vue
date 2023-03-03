<template>
  <div>
    <div class="links-view">
      <span>
        <a class="footer-link" href="https://www.lostsidewalk.com/feedgears/devblog" target="_blank"><i class="fa fa-code-fork" /> Dev Blog</a>
      </span>
      <span>
        <a class="footer-link" href="#" target="_blank" @click.prevent="this.$router.push('/docs');">
          <i class="fa fa-question-circle" /> Docs
        </a>
      </span>
      <span>
        <a class="footer-link" href="#" target="_blank" @click.prevent="this.$router.push('/privacy');">
          <i class="fa fa-file-text" /> Privacy Policy
        </a>
      </span>
      <span>
        <a class="footer-link" href="#" target="_blank" @click.prevent="this.$router.push('/api');">
          <i class="fa fa-plug" /> API
        </a>
      </span>
      <span>
        <a class="footer-link" href="mailto:support@feedgears.com" target="_blank"><i class="fa fa-envelope" /> Email</a>
      </span>
      <span>
        <a class="footer-link" href="https://twitter.com/lostsidewalkllc" target="_blank"><i class="fa fa-twitter" /> Twitter</a>
      </span>
      <span>
        <a class="footer-link" href="https://github.com/lostsidewalk" target="_blank"><i class="fa fa-github" /> Github</a>
      </span>
      <span>
        <a class="footer-link" href="https://twitch.tv/elderscrollsjesus" target="_blank"><i class="fa fa-twitch" /> Twitch</a>
      </span>
      <span>
        <a class="footer-link" href="https://discord.gg/7nyY89UrNw" target="_blank"><i class="fa fa-comments-o" /> Discord</a>
      </span>
    </div>
    <div class="footer-divider"/>
    <div class="copyright-view">
      <div>COPYRIGHT <i class="fa fa-copyright" /> 2023 <a class="footer-link" href="https://www.lostsidewalk.com" target="_blank">LOST SIDEWALK SOFTWARE LLC</a></div>
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
  resize: none;
  gap: .75rem;
  padding: 1.25rem;
}

.footer-link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
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
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-content: flex-end;
  align-items: flex-end;
  white-space: nowrap;
  font-size: smaller;
}

.copyright-view > div { 
  margin: .125rem;
}

</style>
