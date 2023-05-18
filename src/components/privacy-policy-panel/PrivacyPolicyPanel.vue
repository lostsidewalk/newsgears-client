<template>
  <v-card>
    <v-card-title>
      {{ this.$t('feedGearsPrivacyPolicy') }}
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- section -->
      <v-sheet>
        <v-card elevation="6" class="ma-4" variant="tonal">
          <v-card-title class="pa-4">
            {{ this.$t('whatInformationDoWeCollect') }}
          </v-card-title>
          <v-card-subtitle>
            {{ this.$t('whatWeCollectSummary') }}
          </v-card-subtitle>
          <v-card-text>
            {{ this.$t('whatWeCollectDetails') }}
          </v-card-text>
        </v-card>
        <v-card elevation="6" class="ma-4" variant="tonal">
          <v-card-title class="pa-4">
            {{ this.$t('whatWeCollectImportantDetails') }}
          </v-card-title>
          <v-card-subtitle>
            {{ this.$t('whatWeCollectFurtherDetails') }}
          </v-card-subtitle>
          <v-card-text>
            {{ this.$t('someCollectionIsAutomatic') }} {{ this.$t('automaticCollectionDetails') }}
          </v-card-text>
        </v-card>
        <v-card elevation="6" class="ma-4" variant="tonal">
          <v-card-title class="pa-4">
            {{ this.$t('howDoWeProcess') }}
          </v-card-title>
          <v-card-subtitle>
            {{ this.$t('howDoWeProcessSummary') }}
          </v-card-subtitle>
          <v-card-text />
        </v-card>
        <v-card elevation="6" class="ma-4" variant="tonal">
          <v-card-title class="pa-4">
            {{ this.$t('socialLogins') }}
          </v-card-title>
          <v-card-subtitle>
            {{ this.$t('socialLoginsSummary') }}
          </v-card-subtitle>
          <v-card-text>
            {{ this.$t('socialLoginsDetails') }}
          </v-card-text>
        </v-card>
        <v-card elevation="6" class="ma-4" variant="tonal">
          <v-card-title class="pa-4">
            {{ this.$t('internationalInformationTransfers') }}
          </v-card-title>
          <v-card-subtitle>
            {{ this.$t('internationalInformationTransfersSummary') }}
          </v-card-subtitle>
          <v-card-text>
            {{ this.$t('internationalInformationTransfersDetails') }} {{ this.$t('internationalInformationTransfersDetailsFurther') }}
          </v-card-text>
        </v-card>
        <v-card elevation="6" class="ma-4" variant="tonal">
          <v-card-title class="pa-4">
            {{ this.$t('whatAreYourPrivacyRights') }}
          </v-card-title>
          <v-card-subtitle>
            {{ this.$t('yourPrivacyRightsSummary') }}
          </v-card-subtitle>
          <v-card-text>
            {{ this.$t('yourPrivacyRightsDetails') }}
          </v-card-text>
        </v-card>
        <v-card elevation="6" class="ma-4" variant="tonal">
          <v-card-title class="pa-4">
            {{ this.$t('yourConsent') }}
          </v-card-title>
          <v-card-subtitle>
            {{ this.$t('yourConsentSummary') }}
          </v-card-subtitle>
          <v-card-text />
        </v-card>
        <v-card elevation="6" class="ma-4" variant="tonal">
          <v-card-title class="pa-4">
            {{ this.$t('doWeMakeUpdates') }}
          </v-card-title>
          <v-card-subtitle>
            {{ this.$t('doWeMakeUpdatesSummary') }}
          </v-card-subtitle>
          <v-card-text />
        </v-card>
        <v-card elevation="6" class="ma-4" variant="tonal">
          <v-card-title class="pa-4">
            {{ this.$t('howCanYouContactUs') }}
          </v-card-title>
          <v-card-subtitle>
            {{ this.$t('contactUsWithQuestionsViaEmail') }} 
          </v-card-subtitle>
          <v-card-actions>
            <v-btn type="text" @click="sendSupportMail">support@feedgears.com</v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="this.$emit('dismiss')" 
        :text="this.$t('dismiss')" />
    </v-card-actions>
  </v-card> 
</template>
  
<script>
export default {
  name: "PrivacyPolicyPanel",
  components: {
  },
  props: ["baseUrl"],
  emits: ["dismiss"],
  methods: {
    sendSupportMail() {
      window.open('mailto:support@feedgears.com', '_blank');
    },
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
      serverMessages: [],
    };
  },
};
</script>
