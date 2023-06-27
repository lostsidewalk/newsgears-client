<template>
  <v-footer>
    <v-dialog
      v-model="showPrivacyPolicy"
      fullscreen
      scrollable
    >
      <PrivacyPolicyPanel @dismiss="showPrivacyPolicy = false" />
    </v-dialog>
    <v-container>
      <v-row
        justify="center"
        no-gutters
        cols="12"
      >
        <v-btn
          :size="buttonSize" 
          variant="text"
          prepend-icon="fa-code-fork"
          :text="$t('devBlog')" 
          @click.prevent="devBlog"
        />
        <v-btn
          :size="buttonSize" 
          variant="text"
          prepend-icon="fa-question-circle"
          :text="$t('docs')"
          @click.prevent="$router.push('/docs');"
        />
        <v-btn
          :size="buttonSize"  
          variant="text" 
          prepend-icon="fa-file-text" 
          :text="$t('privacyPolicy')"
          @click="showPrivacyPolicy = !showPrivacyPolicy"
        />
        <v-btn
          :size="buttonSize" 
          variant="text" 
          prepend-icon="fa-plug"
          :text="$t('api')"
          @click.prevent="$router.push('/api');"
        />
        <v-btn
          :size="buttonSize" 
          variant="text" 
          prepend-icon="fa-envelope"
          :text="$t('email')"
          @click.prevent="sendSupportMail"
        />
        <v-btn
          :size="buttonSize" 
          variant="text" 
          prepend-icon="fa-twitter"
          :text="$t('twitter')"
          @click.prevent="twitter"
        />
        <v-btn
          :size="buttonSize" 
          variant="text" 
          prepend-icon="fa-github"
          :text="$t('github')" 
          @click.prevent="github"
        />
        <v-btn
          :size="buttonSize" 
          variant="text" 
          prepend-icon="fa-twitch"
          :text="$t('twitch')" 
          @click.prevent="twitch"
        />
        <v-btn
          :size="buttonSize" 
          variant="text" 
          prepend-icon="fa-comments-o"
          :text="$t('discord')" 
          @click.prevent="discord"
        />
      </v-row>
      <v-row>
        <v-col
          cols="12"
          class="text-center mt-4"
        >
          <div class="copyright">
            {{ $t('copyright') }} <v-icon icon="fa-copyright" /> 2023 <a
              href="https://www.lostsidewalk.com"
              target="_blank"
            >LOST SIDEWALK SOFTWARE LLC</a>
          </div>
          <div class="copyright">
            2501 Chatham Rd STE R | Springfield, IL 62704 | Sangamon County
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import PrivacyPolicyPanel from '@/components/privacy-policy-panel/PrivacyPolicyPanel.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "FooterPanel",
  components: {
    PrivacyPolicyPanel,
  },
  mixins: [buttonSizeMixin], 
  data() {
    return {
      showPrivacyPolicy: false,
    }
  },
  methods: {
    devBlog() {
      window.open('https://www.lostsidewalk.com/feedgears/devblog', '_blank');
    },
    sendSupportMail() {
      window.open('mailto:support@feedgears.com', '_blank');
    },
    twitter() {
      window.open('https://twitter.com/lostsidewalkllc', '_blank');
    },
    github() {
      window.open('https://github.com/lostsidewalk', '_blank');
    },
    twitch() {
      window.open('https://twitch.tv/elderscrollsjesus', '_blank');
    },
    discord() {
      window.open('https://discord.gg/7nyY89UrNw', '_blank');
    }
  }
}
</script>

<style>
.copyright {
  font-size: small;
}
</style>
