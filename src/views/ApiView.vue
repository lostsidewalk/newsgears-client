<template>
  <div id="home">
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme" :inTransit="false">
      <template v-slot:buttons>
        <ControlPanel 
          :disabled="false" 
          :theme="theme" 
          @updateServerMessage="setLastServerMessage" />
      </template>
    </NavbarFixedHeader>
    <!-- fixed subheader -->
    <transition appear enter-active-class="animated fadeIn">
      <NavbarFixedSubheader v-if="this.serverMessages.length > 0" :theme="theme">
        <template v-slot:message>
          <LastServerMessage :serverMessages="this.serverMessages" @clearLastServerMessage="this.clearLastServerMessage" :theme="theme"/>
        </template>
      </NavbarFixedSubheader>
    </transition>
    <!-- API view -->
    <div class="api-view">
      <!-- API header-->
      <ViewHeader :disabled="false" :inTransit="false" :theme="theme">
        <template v-slot:count>
          {{ this.$t('feedGearsApi') }}
        </template>
        <template v-slot:body>
          <p>
            {{ this.$t('inDevelopment') }}
          </p>
        </template>
      </ViewHeader>
    </div> 
    <!-- "go back" link -->
    <GoBack :disabled="false" :theme="theme" />
  </div>
</template>
  
<script>
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import ControlPanel from "@/components/layout/ControlPanel.vue";
import NavbarFixedSubheader from "@/components/layout/NavbarFixedSubheader.vue";
import ViewHeader from "@/components/layout/ViewHeader.vue";
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import GoBack from "@/components/layout/GoBack.vue";

export default {
  name: "ApiView",
  components: {
    NavbarFixedHeader,
    ControlPanel,
    NavbarFixedSubheader,
    ViewHeader,
    LastServerMessage,
    GoBack,
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

<style scoped>
#home {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

/** start */
.api-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  color: v-bind('theme.normalmessage');
  margin-bottom: .75rem;
}
</style>

<style>
.accessible-button {
  min-height: 3rem;
  min-width: 3rem;
}

@media (max-width: 640px) {
  .accessible-button {
    min-height: 1.5rem;
    min-width: 1.5rem;
  }
}

@media (max-width: 480px) {
  .accessible-button {
    min-height: unset;
    min-width: unset;
  }
}
</style>
