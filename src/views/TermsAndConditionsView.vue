<template>
  <div>
    <!-- "go back" link -->
    <GoBack :theme="theme" />
    <div class="terms-and-conditions">
      <p class="terms-and-conditions-header">NewsGears Terms of Service</p>

      <p class="terms-and-conditions-header">Terms</p>

      <p>By accessing the Service and Data at https://newsgears.org, you are agreeing to be bound by these terms of service,
        all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local
        laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The
        materials contained in this website are protected by applicable copyright and trademark law.</p>

      <p class="terms-and-conditions-header">Use license</p>

      <p>Permission is granted to download the materials (information or software) on NewsGears's website for as long as
        your use case requires. This is the grant of a license, not a transfer of title, and under this license you may
        not:</p>

      <p>
        <ol>
          <li>attempt to decompile or reverse engineer any software contained on NewsGears's website;</li>
          <li>remove any copyright or other proprietary notations from the materials;</li>
          <li>register more than one API key at any one time, unless authorised;</li>
          <li>attempt to circumvent any restrictions or limits placed on your API key or account;</li>
          <li>use the service to reproduce or republish copyrighted material;</li>
          <li>use the service in any manner that violates any laws directly or indirectly;</li>
          <li>attempt to build a competing news database.</li>
        </ol>
      </p>

      <p>This license may be terminated by NewsGears at any time, with or without cause, with or without notice, effective
        immediately. In this case, any remaining paid period will be refunded pro-rata. All provisions of this Agreement
        which by their nature should survive termination shall survive termination, including, without limitation,
        ownership provisions, warranty disclaimers, waiver and release, indemnity and limitations of liability.</p>

      <p class="terms-and-conditions-header">Data license</p>

      <p>As part of the NewsGears Service, NewsGears collects and generates certain Data by aggregating information
        regarding publicly available web pages, utilizing NewsGears’s proprietary technology. This Data does not contain
        any personally identifiable information regarding any end users. As part of the API Service, certain Data is made
        publicly available to end-users.</p>

      <p>Data accessible through NewsGears may contain third party content (such as text, images, videos). This content
        will remain the sole responsibility of those who make it available. In some cases content accessible through our
        API may also be subject to intellectual property rights. If this is the case you may not use it unless you are
        licensed to do so or are otherwise permitted by law.</p>

      <p>Unless applicable by law or expressly permitted by the owner, you will not, and will not permit your end users or
        others acting on your behalf to, do any of the following with the Data returned from the API:</p>

      <p>
        <ul>
          <li>Misrepresent the ownership or the source;</li>
          <li>Obscure, remove or change any copyright, trademark, or other proprietary notices;</li>
          <li>Falsify or delete any author attributions, legal notices, or other labels of the origin or source of material.</li>
        </ul>
      </p>

      <p>
        Unless expressly authorized herein, you may not publicly release or disclose any data or usage statistics or other
        information regarding the Data.
      </p>

      <p class="terms-and-conditions-header">Accuracy of materials</p>

      <p>The materials appearing on NewsGears's website could include technical, typographical, or photographic errors.
        NewsGears does not warrant that any of the materials on its website are accurate, complete or current. NewsGears may
        make changes to the materials contained on its website at any time without notice. However NewsGears does not make
        any commitment to update the materials.</p>

      <p class="terms-and-conditions-header">Developer plan</p>

      <p>NewsGears provides a special Developer plan at no charge for new users of the Service. The Developer plan may be
        used for development and testing in a development environment only, and cannot be used in a staging or production
        environment (including internally).</p>

      <p>If the Service has been integrated outside of a development environment, license to use the Developer plan will
        be revoked and a paid subscription will be required to continue using the Service and Data.</p>

      <p class="terms-and-conditions-header">Payment</p>

      <p>By selecting a paid plan you agree to pay NewsGears the monthly or annual subscription fees indicated for that
        service. Payments will be charged on a pre-pay basis on the day you sign up for a paid plan and will cover the use
        of that service for a monthly or annual subscription period as indicated. You represent and warrant that you are
        authorized, or have the permission of the authorized signatory of the credit card or charge card provided to News
        API, to pay any fees incurred from use of the Service.</p>

      <p>Unless you notify NewsGears before the end of the applicable subscription period that you want to cancel a paid
        account, your paid subscription will automatically renew and you authorize us to collect the then-applicable
        annual or monthly subscription fee (as well as any taxes) using any credit card or other payment mechanism we have
        on record for you. If you exhaust the allocation of API requests included in your plan you authorize us to collect
        the then-applicable fee (as well as any taxes) using any credit card or other payment mechanism we have on record
        for you in exchange for another block of API requests. Paid plans can be canceled at any time in the Account
        section of the website.</p>

      <p>Unused API requests included in your plan do not roll over at the end of the month. Extra API requests purchased
        in blocks will rollover for the period of one year.</p>

      <p class="terms-and-conditions-header">Refund and cancellation policy</p>

      <p>You may cancel your monthly or annual subscription at anytime. However NewsGears will not refund subscription fees
        for the current or previous period(s) unless previously agreed. Your access to NewsGears will remain enabled until
        the end of the current paid period.</p>

      <p class="terms-and-conditions-header">Service level agreement</p>

      <p>If we do not achieve and maintain the Service Levels for each plan as described in this SLA, and your
        subscription plan provides an SLA, then you may be eligible for a 25% credit towards your future monthly service
        fees.</p>

      <p>This SLA and any applicable Service Levels do not apply to any performance or availability issues:</p>

      <p>
        <ol>
          <li>Due to factors outside our reasonable control (for example, natural disaster, war, acts of terrorism, riots,
          government action, or a network or device failure external to our data centers, including at your site or between
          your site and our data center);</li>
          <li>That result from the use of services, hardware, or software not provided by us, including, but not limited to,
          issues resulting from inadequate bandwidth or related to third-party software or services;
          Caused by your use of a Service after we advised you to modify your use of the Service, if you did not modify your
          use as advised;</li>
          <li>During or with respect to preview, pre-release, beta or trial versions of a Service, feature or software (as
          determined by us);</li>
          <li>That result from your unauthorized action or lack of action when required, or from your employees, agents,
          contractors, or vendors, or anyone gaining access to our network by means of your passwords or equipment, or
          otherwise resulting from your failure to follow appropriate security practices;</li>
          <li>That result from your failure to adhere to any required configurations, use supported platforms, follow any
          policies for acceptable use, or your use of the Service in a manner inconsistent with the features and
          functionality of the Service (for example, attempts to perform operations that are not supported) or inconsistent
          with our published guidance;</li>
          <li>That result from faulty input, instructions, or arguments (for example, requests to access data that does not
          exist);</li>
          <li>That result from your attempts to perform operations that exceed prescribed quotas or that resulted from our
          throttling of suspected abusive behavior;</li>
        </ol>
      </p>

      <p class="terms-and-conditions-header">Monthly uptime calculation</p>

      <p>"Monthly Uptime Percentage" for each API Service is calculated as Total Request Attempts less Failed Requests
        divided by Total Request Attempts in a billing month for a given API subscription. Monthly Uptime Percentage is
        represented by the following formula:</p>

      <p>Monthly Uptime % = (Total Request Attempts - Failed Requests) / Total Request Attempts * 100</p>

      <p class="terms-and-conditions-header">Customer data</p>

      <p>Any personal information collected from Customer will be securely held and processed in accordance with local law
        and will never be shared with or sold to third parties.</p>

      <p>You agree to allow us to send you important notifications via email to the email address we have on record for
        you. You can opt out from these at any time.</p>

      <p class="terms-and-conditions-header">Copyright infringement</p>

      <p>If you believe that your own copyrighted work is accessible on the Service in violation of your copyright, you
        may provide our Designated Agent with a written communication as set forth in the Digital Millennium Copyright Act
        ("DMCA"), 17 U.S.C. § 512(c)(3) that contains the following written information:</p>

      <p>A description identifying in sufficient detail the copyrighted work or intellectual property that you claim has
        been infringed so it may be accurately located using the URL. Where multiple works are at issue please provide a
        list of URLs or sufficient information to locate the alleged infringing material.</p>

      <p>
        <ul>
          <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright
          interest;</li>
          <li>A statement by you that you have a good-faith belief that the disputed use is unauthorized by the copyright owner,
            its agent, or the law;</li>
          <li>A statement by you made under penalty of perjury, that the above information in your notice is accurate and that
            you are the copyright owner or authorized to act on the copyright owner's behalf.
            Also include your name, mailing address, telephone number and email address.</li>
        </ul>
      </p>

      <p class="terms-and-conditions-header">Disclaimer of warranties</p>

      <p>The parties acknowledge that the API, Content and any services are provided “AS IS.” EXCEPT FOR BODILY INJURY,
        COMPANY AND ITS LICENSORS DISCLAIM ALL WARRANTIES RELATING TO THE API OR ANY SERVICES, EXPRESS OR IMPLIED,
        INCLUDING, BUT NOT LIMITED TO, ANY WARRANTIES AGAINST INFRINGEMENT OF THIRD-PARTY RIGHTS, MERCHANTABILITY AND
        FITNESS FOR A PARTICULAR PURPOSE.</p>

      <p class="terms-and-conditions-header">Indemnification</p>

      <p>You will indemnify and hold NewsGears harmless against any third party claims, liabilities or expenses incurred
        (including reasonable attorneys’ fees), as well as amounts finally awarded in a settlement or by a court arising
        from any claim or allegation by a third party arising out of (i) allegations that Customer's usage of NewsGears’s
        service infringes or misappropriates any trademark, copyright or other intellectual property of any third party,
        (ii) NewsGears services that are modified by Customer if the alleged infringement relates to such modification;
        (iii) NewsGears services that are combined with any Customer product, process or materials where the alleged
        infringement relates to such combination; (iv) Customer’s use of a version of the NewsGears services other than the
        version that was current at the time of such use; or (v) your breach or alleged breach of any of your obligations
        or representations under this Agreement.</p>

      <p class="terms-and-conditions-header">Limitations</p>

      <p>In no event shall NewsGears or its suppliers be liable for any damages (including, without limitation, damages for
        loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials
        on NewsGears's website or API, even if NewsGears or a NewsGears authorized representative has been notified orally or
        in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied
        warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply
        to you.</p>

      <p class="terms-and-conditions-header">Modifications</p>

      <p>NewsGears may revise these terms of service for its website at any time without notice. By using this website you
        are agreeing to be bound by the then current version of these terms of service.</p>

      <p class="terms-and-conditions-header">Governing Law</p>

      <p>These terms and conditions are governed by and construed in accordance with the laws of the State of Delaware,
        U.S.A and you irrevocably submit to the exclusive jurisdiction of the courts in this location.</p>

      <p class="terms-and-conditions-header">Users in the United Kingdom</p>

      <p>We are unable to serve users in the United Kingdom. If you are based in the United Kingdom, you are not permitted
        to register for a NewsGears account.</p>
    </div>
    <!-- "go back" link -->
    <GoBack :theme="theme" />
  </div>
</template>

<script>
import GoBack from '@/components/layout/GoBack.vue';

export default {
  name: "TermsAndConditionsView",
  components: {
    GoBack,
  },
  props: [ ],
  data() {
    return {
      theme: this.$theme.currentTheme,
    };
  },
};
</script>

<style scoped>
.terms-and-conditions {
  color: v-bind('theme.subduedmessage');
  margin: 20px;
  text-align: justify;
  border: 1px solid v-bind('theme.sectionbordercolor');
  border-radius: 3px;
  background-color: v-bind('theme.tocbgcolor');
  padding: 25px;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.terms-and-conditions-header {
  font-weight: bold;
  text-decoration: underline;
}
</style>
