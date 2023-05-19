<template>
  <v-app>
    <v-app-bar
      app
      location="top"
      :scrol-behavior="'elevate'"
    >
      <template #title>
        <span class="view-header-no-count">
          FeedGears RSS
        </span>
      </template>
      <template #prepend>
        <v-app-bar-nav-icon icon="fa-rss" />
      </template>
      <v-toolbar-items>
        <GoBack />
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <!-- container -->
      <BannerPanel />

      <v-divider /> 

      <v-container>
        {{ $t('inDevelopment') }}
      </v-container>

      <v-divider /> 
      
      <FooterPanel
        
        app
      />
    </v-main>
  </v-app>
</template>

<script>
import BannerPanel from "@/components/landing/BannerPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import FooterPanel from "@/components/landing/FooterPanel.vue";

export default {
  name: "ApiView",
  components: {
    BannerPanel,
    GoBack,
    FooterPanel,
  },
  props: {
    baseUrl: { type: String, required: true },
  },
  data() {
    return {
      theme: this.$theme.currentTheme,
      serverMessages: [],
    };
  },
  methods: {
    setLastServerMessage(messageObj) {
      this.$notification.requestPermission().then(p => {
        if (p !== "granted") {
          this.clearLastServerMessage();
          let serverMessageId = Math.random();
          this.serverMessages.push({
            timestamp: new Date(),
            id: serverMessageId,
            text: messageObj.message
          });
          this.$announcer.polite(messageObj.message);
          setTimeout(() => {
            let idxToSplice = -1;
            for(let i = 0; i < this.serverMessages.length; i++) {
              if (this.serverMessages[i].id == serverMessageId) {
                idxToSplice = i;
                break;
              }
            }
            if (idxToSplice >= 0) {
              this.serverMessages.splice(idxToSplice, 1);
            }
          }, 4000);
        } else {
          this.$notification.show('FeedGears message', {
           body: messageObj.message
          }, {
            onerror: function() {
              console.error("unable to show notification, message=" + messageObj.message);
            }
          });
        }
      });
      this.$announcer.polite(messageObj.message);
    },
    clearLastServerMessage() {
      this.serverMessages.pop();
    },
  },
};
</script>
