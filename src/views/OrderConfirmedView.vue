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
      <ControlPanel
        :base-url="baseUrl" 
           
        @updateServerMessage="setLastServerMessage"
      >
        <template #additional>
          <GoBack />
        </template>
      </ControlPanel>
    </v-app-bar>

    <v-main>
      <v-row>
        <v-col
          cols="12"
          align="center"
        >
          <h2 class="logotext">
            FeedGears RSS
          </h2>
        </v-col>
        <v-col
          cols="12"
          align="center"
        >
          <i class="fa fa-rss fa-3x" />
        </v-col>
        <v-col
          cols="12"
          align="center"
        >
          <h3 class="logosubtext fancy">
            {{ $t('whatIsFeedGears') }}
          </h3>
        </v-col>
      </v-row>

      <v-divider class="mt-8" />

      <v-container>
        {{ $t('thankYouForYourOrder') }}
      </v-container>

      <v-divider />

      <FooterPanel app />
    </v-main>
  </v-app>
</template>
  
<script>
import ControlPanel from "@/components/control-panel/ControlPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import FooterPanel from "@/components/landing/FooterPanel.vue";

export default {
  name: "OrderConfirmedView",
  components: {
    ControlPanel,
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

<style scoped>
.logotext {
  font-family: 'Russo One';
}

.logosubtext {
  font-size: 1.5rem;
}

.fancy {
  font-family: 'Merriweather';
  font-weight: bold;
}
</style>
