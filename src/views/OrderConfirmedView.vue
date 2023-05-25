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
      <v-container>
        {{ $t('thankYouForYourOrder') }}
      </v-container>

      <FooterPanel app />
    </v-main>
  </v-app>
</template>
  
<script>
import ControlPanel from "@/components/control-panel/ControlPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";

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
  methods: {
    setLastServerMessage(messageObj) {
      this.$notification.requestPermission().then(p => {
        if (p === "granted") {
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
  },
};
</script>
