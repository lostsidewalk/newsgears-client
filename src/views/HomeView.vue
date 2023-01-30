<template>
  <div id="home" style="height: 100%;">
    <!-- fixed header -->
    <NavbarFixedHeader v-if="this.$auth.$isAuthenticated" :inTransit="inTransit" :theme="theme">
      <template v-slot:buttons>
        <NavbarButtons :inTransit="inTransit" :theme="theme"/>
      </template>
    </NavbarFixedHeader>
    <!-- fixed subheader -->
    <transition appear enter-active-class="animated fadeIn" v-if="this.$auth.$isAuthenticated">
      <NavbarFixedSubheader v-if="this.serverMessages.length > 0" :theme="theme" :inTransit="inTransit">
        <template v-slot:message>
          <LastServerMessage :serverMessages="this.serverMessages" @clearLastServerMessage="this.clearLastServerMessage" :theme="theme"/>
        </template>
      </NavbarFixedSubheader>
    </transition>
    <AuthPanel ref="authentication" 
      :inTransit="inTransit" 
      :theme="theme" 
      @updateInTransit="this.inTransit = $event" />
    <PostFeed ref="postFeed" 
      :baseUrl="this.baseUrl" 
      :theme="theme" 
      :inTransit="inTransit" 
      @updateServerMessage="this.setLastServerMessage" 
      @updateInTransit="this.inTransit = $event" />
  </div>
</template>
  
<script>
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import NavbarButtons from "@/components/layout/NavbarButtons.vue";
import NavbarFixedSubheader from "@/components/layout/NavbarFixedSubheader.vue";
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import AuthPanel from "@/components/auth/AuthPanel.vue";
import PostFeed from "@/components/post/PostFeed.vue";


export default {
  name: "HomeView",
  components: {
    NavbarFixedHeader, 
    NavbarButtons, 
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
      }, 6000);
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
  margin: 0px !important;
  transition: background-color 0s;
}

hr {
  color: v-bind('theme.sectionbordercolor');
}

#home {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  margin-left: 3%;
  margin-right: 3%;
}

.help-balloon {
  border: 1px solid rgba(255,255,255,0.3); /* TODO: extract color to theme */
  padding: 10px;
  background-color: rgba(0,255,0,0.03); /* TODO: extract color to theme */
  color: antiquewhite;
  border-radius: 5px;
  max-width: max-content;
  margin-bottom: 10px;
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
  -webkit-animation-duration: 0.5s;
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
  padding-right: 3px;
}
</style>
