<template>
  <v-footer elevation="6">
    <v-dialog v-model="this.showPrivacyPolicy" width="75%" height="75%" scrollable>
      <PrivacyPolicyPanel @dismiss="this.showPrivacyPolicy = false" />
    </v-dialog>
    <v-row justify="center" no-gutters cols="9">
      <!-- TODO: (refactor) extract component -->
      <v-btn @click.prevent="window.open('https://www.lostsidewalk.com/feedgears/devblog', '_blank')"
        size="small"
        variant="text"
        prepend-icon="fa-code-fork" 
        :text="this.$t('devBlog')" />
      <v-btn @click.prevent="this.$router.push('/docs');"
        size="small"
        variant="text"
        prepend-icon="fa-question-circle"
        :text="this.$t('docs')" />
      <v-btn @click="this.showPrivacyPolicy = !this.showPrivacyPolicy" 
        size="small" 
        variant="text" 
        prepend-icon="fa-file-text"
        :text="this.$t('privacyPolicy')" />
      <v-btn @click.prevent="this.$router.push('/api');"
        size="small" 
        variant="text"
        prepend-icon="fa-plug"
        :text="this.$t('api')" />
      <v-btn @click.prevent="sendSupportMail"
        size="small" 
        variant="text"
        prepend-icon="fa-envelope"
        :text="this.$t('email')" />
      <v-btn @click.prevent="window.open('https://twitter.com/lostsidewalkllc', '_blank')"
        size="small" 
        variant="text"
        prepend-icon="fa-twitter"
        :text="this.$t('twitter')" />
      <v-btn @click.prevent="window.open('https://github.com/lostsidewalk', '_blank')"
        size="small" 
        variant="text"
        prepend-icon="fa-github" 
        :text="this.$t('github')" />
      <v-btn @click.prevent="window.open('https://twitch.tv/elderscrollsjesus', '_blank')"
        size="small" 
        variant="text"
        prepend-icon="fa-twitch" 
        :text="this.$t('twitch')" />
      <v-btn @click.prevent="window.open('https://discord.gg/7nyY89UrNw', '_blank')"
        size="small" 
        variant="text"
        prepend-icon="fa-comments-o" 
        :text="this.$t('discord')" />
      <v-col cols="9" class="text-center mt-4">
        <div>{{ this.$t('copyright') }} <v-icon icon="fa-copyright" /> 2023 <a href="https://www.lostsidewalk.com" target="_blank">LOST SIDEWALK SOFTWARE LLC</a></div>
        <div>2501 Chatham Rd STE R | Springfield, IL 62704 | Sangamon County</div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import PrivacyPolicyPanel from '@/components/privacy-policy-panel/PrivacyPolicyPanel.vue';

export default {
  name: "FooterPanel",
  props: [ "theme" ],
  components: {
    PrivacyPolicyPanel,
  },
  methods: {
    sendSupportMail() {
      window.open('mailto:support@feedgears.com', '_blank');
    }
  },
  data() {
    return {
      showPrivacyPolicy: false,
    }
  }
}
</script>
