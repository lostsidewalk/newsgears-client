<template>
  <div id="home">
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme" :inTransit="false">
      <template v-slot:buttons>
        <NavbarButtons :disableSettings="false" :disableSubscriptions="false" :disabled="false" :theme="theme"/>
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
          FEEDGEARS PRIVACY POLICY
        </template>
        <template v-slot:body>
          <!-- section -->
          <div class="section-header">What information do we collect?</div>
          <div class="section-summary">We collect personal information that you provide to us.</div>
          <div class="section-details">
            We collect personal information that you voluntarily provide to use when you register on FeedGears, 
            express an interest in obtaining information about us or FeedGears, when you participate in activities 
            on FeedGears, or otherwise when you contact us.  
          </div>
          <div class="section-important-details">We do not process sensitive information.</div>
          <div class="section-details">
            All personal information that you provide to us must be true, complete, and accurate, and you must notify 
            us of any changes to such personal information. 
          </div>
          <div class="section-summary">Some information is automatically collected</div>
          <div class="section-details">
            Some information--such as your Internet Protocol (IP) address and/or browser and device characteristics--is 
            collected automatically when you visit FeedGears.  This information (operating system, language preferences, 
            referring URLs, device name, country, location, information about how and when you use FeedGears, and other 
            technical information) does not reveal your specific identity (like your name or contact information) but may 
            include device and usage information.  This information is primarily needed to maintain the security and 
            operation of FeedGears, and for our internal analytics and reporting purposes.  
          </div>
          <!-- section -->
          <div class="section-header">How do we process your information?</div>
          <div class="section-summary">
            We process your information to provide, improve, and administer FeedGears, 
            communicate with you, for security and fraud prevention, and to comply with law.  We may also process 
            your information for other purposes with your consent. 
          </div>
          <!-- section -->
          <div class="section-header">Social logins</div>
          <div class="section-summary">
            FeedGears offers you the ability to register and login using your third-party social media account details (like Google or Github logins).  
            Where you choose to do this, we will receive certain profile information about you from your social media provider.  The profile information we 
            receive may vary depending on the social media provider concerned, but will often include your name, email address, and profile picture, 
            as well as other information you choose to make public on such a social media platformat.  
          </div>
          <div class="section-details">
            We will use the information we receive only for the purposes that are described in this privacy notice or that are 
            othrerwise made clear to you on FeedGears.  Please note that we do not control, and are not responsible for, other uses of your personal 
            information by your third-party social media provider.  We recommend that you review their privacy notice to understand how they collect, use, 
            and share your personal infromatino, and how you can set your privacy preferences on their sites and apps.  
          </div>
          <!-- section -->
          <div class="section-header">International information transfers</div>
          <div class="section-summary">
            We may transfer, store, and process your information in countries other than your own.  
          </div>
          <div class="section-details">
            Our servers are located in the United States.  If you are acessing FeedGears from outside the United States, please be 
            aware that your information may be transferred to, stored, and processed by us in our facilities and by those of 
            third-parties with whom we may share your personal information, in the United States and other countries. 
          </div>
          <div class="section-details">
            If you are a resident in the European Economic Area (EAA) or United Kingdom (UK), then these countries may not 
            necessarily have data protection laws or other simliar laws as comprehensive as those in your country.  We will take 
            all necessary measures to protected your personal information in accordance with this privacy notice and applicable law. 
          </div>
          <!-- section -->
          <div class="section-header">Whare are your privacy rights?</div>
          <div class="section-summary">You may review, change, or terminate your account at any time.</div>
          <div class="section-details">
            We will not distribute your personal information to outside parties without your consent.
          </div>
          <div class="section-header">Your consent</div>
          <div class="section-summar">By using our site or apps, you consent to our privacy policy.</div>
          <!-- section -->
          <div class="section-header">Do we make updates to this notice?</div>
          <div class="section-summary">Yes, we will update this notice as necessary to stay compliant with relevant laws.</div>
          <!-- section -->
          <div class="section-header">How can you contact us about this notice?</div>
          <div class="section-summary">
            If you have questions or comments about this notice, you may email us at <a class="footer-link" href="mailto:support@feedgears.com" target="_blank">support@feedgears.com</a>. 
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
import NavbarButtons from "@/components/layout/NavbarButtons.vue";
import NavbarFixedSubheader from "@/components/layout/NavbarFixedSubheader.vue";
import ViewHeader from "@/components/layout/ViewHeader.vue";
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import GoBack from "@/components/layout/GoBack.vue";

export default {
  name: "DocsView",
  components: {
    NavbarFixedHeader,
    NavbarButtons,
    NavbarFixedSubheader,
    ViewHeader,
    LastServerMessage,
    GoBack,
},
  props: ["baseUrl"],
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
}

.footer-link:hover, .footer-link:focus {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}
</style>
