<template>
  <div class="checkout-view">
    <!-- checkout header-->
    <div class="view-header">
      <span style="display: inline-flex;flex-direction: row;">
        <h3 class="view-header-count">
          <i class="fa fa-gears fa-1x"/>
          JOIN THE FEEDGEARS COMMUNITY
        </h3>
      </span>
    </div> 
    <!-- plans -->
    <div class="plans-view">
      <div class="free-view">
        <div class="view-header">
          <span style="display: inline-flex;flex-direction: row;">
            <h3 class="view-header-count">BASIC TIER</h3>
          </span>
          <p class="price-description">
            Free, forever.
          </p>
          <p class="plan-description">
            Basic features:
          </p>
          <ul class="plan-features">
            <li>All features are enabled by default</li>
            <li>Hourly data import from an unlimited number of upstream sources</li>
            <li>Configure FeedGears to query the world's news sources, or add your own upstream RSS/ATOM sources</li>
            <li>Read, edit, save, and share articles in JSON, MD, RSS/ATOM/XML, or CSV format</li>
            <li>We will host your feeds; check our guides for details on integrating FeedGears with your application</li>
            <li>Articles marked as read are archived on a periodic basis</li>
            <li>We will never show you ads, or disclose your data to anyone</li>
          </ul>
        </div>
      </div>
      <div class="premium-view">
        <div class="view-header">
          <span style="display: inline-flex;flex-direction: row;">
            <h3 class="view-header-count">PREMIUM TIER</h3>
          </span>
          <p class="price-description">
            Pioneer pricing: $4.00 per month billed monthly
          </p>
          <p class="plan-description">
            Everything in the free tier, as well as: 
          </p>
          <ul class="plan-features">
            <li>Near real-time data import</li>
            <li>Import and publish an unlimited number of articles per feed</li>
            <li>Configurable archive settings</li>
            <li>Premium support, email response generally within 24h</li>
            <li>No obligation, cancel any time</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "SubscriptionPlanPanel",
  props: ["theme"],
}

</script>

<style scoped>
.checkout-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 5px;
  color: v-bind('theme.subduedmessage');
}

/** start */
.header-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  margin-left: 10px;
  margin-right: 0px;
  text-align: center;
  user-select: none;
}

.header-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.header-button:disabled {
  cursor: auto;
}

.header-button:disabled:hover {
  background-color: unset;
}

.plans-view {
  display: flex;
  border-top: 1px solid v-bind('theme.sectionbordercolor');
}

.free-view {
  display: flex;
  flex-direction: column;
  width: 50%;
  border-right: 1px solid v-bind('theme.sectionbordercolor');
}

.premium-view {
  display: flex;
  flex-direction: column;
  min-width: 50%;
  max-width: 50%;
}

.business-view {
  display: flex;
  flex-direction: column;
  min-width: 50%;
  max-width: 50%;
}

.price-description {
  margin-bottom: 10px;
  font-weight: bold;
  border-bottom: 1px solid v-bind('theme.sectionbordercolor');
  padding-bottom: 10px;
}

.plan-description {
  margin-bottom: 10px;
}

.plan-features {
  padding-left: 10px;
  margin-bottom: 10px;
}

.plan-features > li { 
  padding: 3px;
}

.view-header {
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
  padding-top: 20px;
  text-align: left;
  border-radius: 4px 4px 0px 0px;
  overflow: hidden;
}

.view-header-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: large;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0px;
}
</style>