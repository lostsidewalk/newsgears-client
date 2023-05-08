<template>
  <div id="home">
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme" :inTransit="false">
      <template v-slot:logo>
        <h2 class="pa-2 logotext">FeedGears RSS</h2>
      </template>
      <template v-slot:buttons>
        <ControlPanel :baseUrl="baseUrl" 
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
    <!-- privacy policy view -->
    <div class="privacy-policy-view">
      <!-- privacy policy header-->
      <ViewHeader :disabled="false" :inTransit="false" :theme="theme">
        <template v-slot:count>
          {{ this.$t('feedGearsPrivacyPolicy') }}
        </template>
        <template v-slot:body>
          <!-- section -->
          <div class="section-header">{{ this.$t('whatInformationDoWeCollect') }}</div>
          <div class="section-summary">{{ this.$t('whatWeCollectSummary') }}</div>
          <div class="section-details">{{ this.$t('whatWeCollectDetails') }}</div>
          <div class="section-important-details">{{ this.$t('whatWeCollectImportantDetails') }}</div>
          <div class="section-details">{{ this.$t('whatWeCollectFurtherDetails') }}</div>
          <div class="section-summary">{{ this.$t('someCollectionIsAutomatic') }}</div>
          <div class="section-details">{{ this.$t('automaticCollectionDetails') }}</div>
          <!-- section -->
          <div class="section-header">{{ this.$t('howDoWeProcess') }}</div>
          <div class="section-summary">{{ this.$t('howDoWeProcessSummary') }}</div>
          <!-- section -->
          <div class="section-header">{{ this.$t('socialLogins') }}</div>
          <div class="section-summary">{{ this.$t('socialLoginsSummary') }}</div>
          <div class="section-details">{{ this.$t('socialLoginsDetails') }}</div>
          <!-- section -->
          <div class="section-header">{{ this.$t('internationalInformationTransfers') }}</div>
          <div class="section-summary">{{ this.$t('internationalInformationTransfersSummary') }}</div>
          <div class="section-details">{{ this.$t('internationalInformationTransfersDetails') }}</div>
          <div class="section-details">{{ this.$t('internationalInformationTransfersDetailsFurther') }}</div>
          <!-- section -->
          <div class="section-header">{{ this.$t('whatAreYourPrivacyRights') }}</div>
          <div class="section-summary">{{ this.$t('yourPrivacyRightsSummary') }}</div>
          <div class="section-details">{{ this.$t('yourPrivacyRightsDetails') }}</div>
          <div class="section-header">{{ this.$t('yourConsent') }}</div>
          <div class="section-summary">{{ this.$t('yourConsentSummary') }}</div>
          <!-- section -->
          <div class="section-header">{{ this.$t('doWeMakeUpdates') }}</div>
          <div class="section-summary">{{ this.$t('doWeMakeUpdatesSummary') }}</div>
          <!-- section -->
          <div class="section-header">{{ this.$t('howCanYouContactUs') }}</div>
          <div class="section-summary">
            {{ this.$t('contactUsWithQuestionsViaEmail') }} &nbsp; <a class="footer-link" href="mailto:support@feedgears.com" target="_blank">support@feedgears.com</a>. 
          </div>
        </template>
      </ViewHeader>
    </div> 
    <!-- "go back" link -->
    <GoBack :disabled="false" :theme="theme" />
  </div>
</template>
  
<script>
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import ControlPanel from "@/components/control-panel/ControlPanel.vue";
import NavbarFixedSubheader from "@/components/layout/NavbarFixedSubheader.vue";
import ViewHeader from "@/components/layout/ViewHeader.vue";
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import GoBack from "@/components/layout/GoBack.vue";

export default {
  name: "DocsView",
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
.privacy-policy-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid v-bind('theme.sectionbordercolor');
  border-right: 1px solid v-bind('theme.sectionbordercolor');
  color: v-bind('theme.normalmessage');
  margin-bottom: .75rem;
}

.section-header {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bolder;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}

.section-summary {
  font-style: italic;
  margin-top: .56rem;
  margin-bottom: .56rem;
}

.section-details {
  margin-top: .56rem;
  margin-bottom: .56rem;
}

.section-important-details {
  font-weight: bolder;
  font-style: italic;
  margin-top: .56rem;
  margin-bottom: .56rem;
}

.footer-link {
  text-decoration: none;
  color: v-bind('theme.subduedmessage');
  cursor: pointer;
  min-width: 48px;
  min-height: 48px;
}

.footer-link:hover, .footer-link:focus-visible {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.logotext {
  font-family: 'Russo One';
  color: v-bind('theme.logosubtextcolor');
  text-shadow: 2px 0px 2px v-bind('theme.logocolor');
  float: left;
}
</style>
