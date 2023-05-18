<template>
  <v-app>
    <v-app-bar app location="top" :scrol-behavior="'elevate'">
      <template v-slot:title>
        <span class="view-header-no-count">
          FeedGears RSS
        </span>
      </template>
      <template v-slot:prepend>
        <v-app-bar-nav-icon icon="fa-rss" />
      </template>
      <ControlPanel :baseUrl="baseUrl" 
          :theme="theme" 
          @updateServerMessage="setLastServerMessage">
          <template v-slot:additional>
            <GoBack :theme="theme" />
          </template>
      </ControlPanel>
    </v-app-bar>

    <v-main>
      <!-- container -->
      <BannerPanel :theme="theme" />

      <v-divider /> 

      <v-container>
        {{ this.$t('thankYouForYourOrder') }}
      </v-container>

      <v-divider />

      <FooterPanel :theme="theme" app />
    </v-main>
  </v-app>
</template>
  
<script>
import ControlPanel from "@/components/control-panel/ControlPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import BannerPanel from "@/components/landing/BannerPanel.vue";
import FooterPanel from "@/components/landing/FooterPanel.vue";

export default {
  name: "OrderConfirmedView",
  components: {
    ControlPanel,
    GoBack,
    BannerPanel,
    FooterPanel,
},
  props: ["baseUrl"],
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
  data() {
    return {
      theme: this.$theme.currentTheme,
      serverMessages: [],
    };
  },
};
</script>
