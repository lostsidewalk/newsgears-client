<template>
  <v-card>
    <v-card-title :class="pa4r">
      {{ $t('newsgearsPrivacyPolicy') }}
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- section -->
      <v-sheet>
        <v-card
          elevation="6"
          :class="ma4r"
        >
          <v-card-title :class="pa4r">
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
          :class="ma4r"
        >
          <v-card-title :class="pa4r">
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
          :class="ma4r"
        >
          <v-card-title :class="pa4r">
            {{ $t('howDoWeProcess') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('howDoWeProcessSummary') }}
          </v-card-subtitle>
          <v-card-text />
        </v-card>
        <v-card
          elevation="6"
          :class="ma4r"
        >
          <v-card-title :class="pa4r">
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
          :class="ma4r"
        >
          <v-card-title :class="pa4r">
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
          :class="ma4r"
        >
          <v-card-title :class="pa4r">
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
          :class="ma4r"
        >
          <v-card-title :class="pa4r">
            {{ $t('yourConsent') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('yourConsentSummary') }}
          </v-card-subtitle>
          <v-card-text />
        </v-card>
        <v-card
          elevation="6"
          :class="ma4r"
        >
          <v-card-title :class="pa4r">
            {{ $t('doWeMakeUpdates') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('doWeMakeUpdatesSummary') }}
          </v-card-subtitle>
          <v-card-text />
        </v-card>
        <v-card
          elevation="6"
          :class="ma4r"
        >
          <v-card-title :class="pa4r">
            {{ $t('howCanYouContactUs') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('contactUsWithQuestionsViaEmail') }} 
          </v-card-subtitle>
          <v-card-actions>
            <v-btn
              :size="buttonSize"
              type="text"
              @click="sendSupportMail"
            >
              support@newsgears.com
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :size="buttonSize"
        :text="$t('dismiss')" 
        @click="$emit('dismiss')"
      />
    </v-card-actions>
  </v-card> 
</template>
  
<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "PrivacyPolicyPanel",
  mixins: [buttonSizeMixin, spacingMixin],
  emits: ["dismiss"],
  setup() {
    function sendSupportMail() {
      window.open('mailto:support@feedgears.com', '_blank');
    }

    return {
      sendSupportMail,
    }
  }
};
</script>
