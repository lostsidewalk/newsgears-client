<template>
  <v-footer elevation="6">
    <v-dialog
      v-model="showPrivacyPolicy"
      width="75%"
      height="75%"
      scrollable
    >
      <PrivacyPolicyPanel @dismiss="showPrivacyPolicy = false" />
    </v-dialog>
    <v-row
      justify="center"
      no-gutters
      cols="9"
    >
      <!-- TODO: (refactor) extract component -->
      <v-btn
        size="small"
        variant="text"
        prepend-icon="fa-code-fork"
        :text="$t('devBlog')" 
        @click.prevent="window.open('https://www.lostsidewalk.com/feedgears/devblog', '_blank')"
      />
      <v-btn
        size="small"
        variant="text"
        prepend-icon="fa-question-circle"
        :text="$t('docs')"
        @click.prevent="$router.push('/docs');"
      />
      <v-btn
        size="small" 
        variant="text" 
        prepend-icon="fa-file-text" 
        :text="$t('privacyPolicy')"
        @click="showPrivacyPolicy = !showPrivacyPolicy"
      />
      <v-btn
        size="small"
        variant="text" 
        prepend-icon="fa-plug"
        :text="$t('api')"
        @click.prevent="$router.push('/api');"
      />
      <v-btn
        size="small"
        variant="text" 
        prepend-icon="fa-envelope"
        :text="$t('email')"
        @click.prevent="sendSupportMail"
      />
      <v-btn
        size="small"
        variant="text" 
        prepend-icon="fa-twitter"
        :text="$t('twitter')"
        @click.prevent="window.open('https://twitter.com/lostsidewalkllc', '_blank')"
      />
      <v-btn
        size="small"
        variant="text" 
        prepend-icon="fa-github"
        :text="$t('github')" 
        @click.prevent="window.open('https://github.com/lostsidewalk', '_blank')"
      />
      <v-btn
        size="small"
        variant="text" 
        prepend-icon="fa-twitch"
        :text="$t('twitch')" 
        @click.prevent="window.open('https://twitch.tv/elderscrollsjesus', '_blank')"
      />
      <v-btn
        size="small"
        variant="text" 
        prepend-icon="fa-comments-o"
        :text="$t('discord')" 
        @click.prevent="window.open('https://discord.gg/7nyY89UrNw', '_blank')"
      />
      <v-col
        cols="9"
        class="text-center mt-4"
      >
        <div>
          {{ $t('copyright') }} <v-icon icon="fa-copyright" /> 2023 <a
            href="https://www.lostsidewalk.com"
            target="_blank"
          >LOST SIDEWALK SOFTWARE LLC</a>
        </div>
        <div>2501 Chatham Rd STE R | Springfield, IL 62704 | Sangamon County</div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import PrivacyPolicyPanel from '@/components/privacy-policy-panel/PrivacyPolicyPanel.vue';

export default {
  name: "FooterPanel",
  components: {
    PrivacyPolicyPanel,
  },
  data() {
    return {
      showPrivacyPolicy: false,
    }
  },
  methods: {
    sendSupportMail() {
      window.open('mailto:support@feedgears.com', '_blank');
    }
  }
}
</script>
