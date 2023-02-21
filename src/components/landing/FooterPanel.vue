<template>
  <div>
    <div class="footer-view">
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
        <a class="footer-link" href="mailto:feedgears@lostsidewalk.com" target="_blank"><i class="fa fa-envelope" /> Email</a>
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
.footer-view {
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

.footer-link:hover {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

</style>
