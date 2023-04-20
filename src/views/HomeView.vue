<template>
  <div id="home" style="height: 100%;">
    <VueAnnouncer />
    <!-- fixed subheader -->
    <transition appear enter-active-class="animated fadeIn" v-if="this.$auth.$isAuthenticated">
      <NavbarFixedSubheader v-if="this.serverMessages.length > 0" :theme="theme">
        <template v-slot:message>
          <LastServerMessage :serverMessages="this.serverMessages" @clearLastServerMessage="this.clearLastServerMessage" :theme="theme"/>
        </template>
      </NavbarFixedSubheader>
    </transition>
    <AuthPanel ref="authentication" 
      :disabled="inTransit" 
      :theme="theme" />
    <PostFeed ref="postFeed" 
      :baseUrl="this.baseUrl" 
      :feedUrl="this.feedUrl"
      :theme="theme" 
      :disabled="inTransit" 
      @updateServerMessage="setLastServerMessage" />
  </div>
</template>
  
<script>
import NavbarFixedSubheader from "@/components/layout/NavbarFixedSubheader.vue";
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import AuthPanel from "@/components/auth/AuthPanel.vue";
import PostFeed from "@/components/post/PostFeed.vue";


export default {
  name: "HomeView",
  components: {
    NavbarFixedSubheader,
    LastServerMessage,
    AuthPanel,
    PostFeed,
  },
  props: ["baseUrl", "feedUrl"],
  mounted() {
    this.$auth.getTokenSilently()
      .catch(() => {})
      .finally(() => {
        if (this.$auth.$isAuthenticated) {
          console.log("home: authenticated on mount");
        } else {
          console.log("home: not authenticated on mount");
        }
        this.inTransit = false;
    });
  },
  data() {
    return {
      theme: this.$theme.currentTheme,
      serverMessages: [],
      inTransit: true,
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
  }
};
</script>

<style>
* {
  transition: background-color .3s, box-shadow .3s, text-shadow .3s;
}

*:focus-visible {
  outline-style: outset;
}

body {
  margin: 0rem !important;
}

hr {
  color: v-bind('theme.sectionbordercolor');
}

.server-message {
  text-align: center;
  color: v-bind('theme.highlightedmessage');
  padding: 4%;
}

.animated {
  animation-duration: .5s;
  -webkit-animation-duration: .5s;
  animation-delay: 0s;
  -webkit-animation-delay: 0s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-active {
  opacity: 0;
}

.required {
  color: v-bind('theme.requiredind');
  padding-right: .125rem;
}

.invisible {
  visibility: hidden;
}

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
