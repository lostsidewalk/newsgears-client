<template>
  <v-card>
    <v-card-title>
      {{ $t('feedGearsPrivacyPolicy') }}
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- section -->
      <v-sheet>
        <v-card
          elevation="6"
          class="ma-4"
          variant="tonal"
        >
          <v-card-title class="pa-4">
            {{ $t('whatInformationDoWeCollect') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('whatWeCollectSummary') }}
          </v-card-subtitle>
          <v-card-text>
            {{ $t('whatWeCollectDetails') }}
          </v-card-text>
        </v-card>
        <v-card
          elevation="6"
          class="ma-4"
          variant="tonal"
        >
          <v-card-title class="pa-4">
            {{ $t('whatWeCollectImportantDetails') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('whatWeCollectFurtherDetails') }}
          </v-card-subtitle>
          <v-card-text>
            {{ $t('someCollectionIsAutomatic') }} {{ $t('automaticCollectionDetails') }}
          </v-card-text>
        </v-card>
        <v-card
          elevation="6"
          class="ma-4"
          variant="tonal"
        >
          <v-card-title class="pa-4">
            {{ $t('howDoWeProcess') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('howDoWeProcessSummary') }}
          </v-card-subtitle>
          <v-card-text />
        </v-card>
        <v-card
          elevation="6"
          class="ma-4"
          variant="tonal"
        >
          <v-card-title class="pa-4">
            {{ $t('socialLogins') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('socialLoginsSummary') }}
          </v-card-subtitle>
          <v-card-text>
            {{ $t('socialLoginsDetails') }}
          </v-card-text>
        </v-card>
        <v-card
          elevation="6"
          class="ma-4"
          variant="tonal"
        >
          <v-card-title class="pa-4">
            {{ $t('internationalInformationTransfers') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('internationalInformationTransfersSummary') }}
          </v-card-subtitle>
          <v-card-text>
            {{ $t('internationalInformationTransfersDetails') }} {{ $t('internationalInformationTransfersDetailsFurther') }}
          </v-card-text>
        </v-card>
        <v-card
          elevation="6"
          class="ma-4"
          variant="tonal"
        >
          <v-card-title class="pa-4">
            {{ $t('whatAreYourPrivacyRights') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('yourPrivacyRightsSummary') }}
          </v-card-subtitle>
          <v-card-text>
            {{ $t('yourPrivacyRightsDetails') }}
          </v-card-text>
        </v-card>
        <v-card
          elevation="6"
          class="ma-4"
          variant="tonal"
        >
          <v-card-title class="pa-4">
            {{ $t('yourConsent') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('yourConsentSummary') }}
          </v-card-subtitle>
          <v-card-text />
        </v-card>
        <v-card
          elevation="6"
          class="ma-4"
          variant="tonal"
        >
          <v-card-title class="pa-4">
            {{ $t('doWeMakeUpdates') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('doWeMakeUpdatesSummary') }}
          </v-card-subtitle>
          <v-card-text />
        </v-card>
        <v-card
          elevation="6"
          class="ma-4"
          variant="tonal"
        >
          <v-card-title class="pa-4">
            {{ $t('howCanYouContactUs') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('contactUsWithQuestionsViaEmail') }} 
          </v-card-subtitle>
          <v-card-actions>
            <v-btn
              type="text"
              @click="sendSupportMail"
            >
              support@feedgears.com
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :text="$t('dismiss')" 
        @click="$emit('dismiss')"
      />
    </v-card-actions>
  </v-card> 
</template>
  
<script>
export default {
  name: "PrivacyPolicyPanel",
  components: {
  },
  emits: ["dismiss"],
  data() {
    return {
      serverMessages: [],
    };
  },
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
};
</script>
