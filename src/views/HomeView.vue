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
      :theme="theme" 
      :disabled="inTransit" 
      @updateServerMessage="this.setLastServerMessage" />
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
  props: ["baseUrl"],
  mounted() {
    this.$auth.getTokenSilently()
      .catch(() => {})
      .finally(() => {
        if (this.$auth.$isAuthenticated) {
          console.log("app: authenticated on mount");
        } else {
          console.log("app: not authenticated on mount");
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

body {
  margin: 0rem !important;
}

hr {
  color: v-bind('theme.sectionbordercolor');
}

#home {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.server-message {
  text-align: center;
  color: v-bind('theme.highlightedmessage');
  padding: 4%;
}

.error > input, .error > textarea {
  border: 1px solid v-bind('theme.errorborder') !important;
  box-shadow: 1px 1px 1px v-bind('theme.errorshadow') !important;
  background-color: v-bind('theme.errorbg') !important;
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
</style>
